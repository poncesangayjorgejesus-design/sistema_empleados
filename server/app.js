const express = require('express');
const cors = require('cors');
const { empleadoValido, proyectoValido, salarioValido, idValido } = require('./validaciones');

module.exports = function createApp(db) {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '100kb' }));
  const query = (sql, values = []) => new Promise((resolve, reject) => {
    db.query(sql, values, (error, result) => error ? reject(error) : resolve(result));
  });
  const route = (handler) => (req, res, next) => Promise.resolve(handler(req, res)).catch(next);
  const invalid = (res, mensaje) => res.status(400).json({ mensaje });
  function getId(value) {
    if (!idValido(value)) {
      const error = new Error('Identificador inválido.'); error.status = 400; throw error;
    }
    return Number(value);
  }
  function changed(result, res, mensaje) {
    if (!result.affectedRows) return res.status(404).json({ mensaje: 'El registro ya no existe. Actualiza la lista.' });
    return res.json({ mensaje });
  }
  app.get('/', (req, res) => res.json({ mensaje: 'Servidor de empleados y proyectos activo' }));
  app.get('/salud', route(async (req, res) => {
    await query('SELECT 1 FROM empleado LIMIT 1');
    await query('SELECT 1 FROM proyectos LIMIT 1');
    await query('SELECT 1 FROM empleado_proyecto LIMIT 1');
    await query('SELECT 1 FROM salario LIMIT 1');
    res.json({ estado: 'ok' });
  }));

  app.get('/empleados', route(async (req, res) => res.json(await query('SELECT * FROM empleado ORDER BY id DESC'))));
  const createEmployee = route(async (req, res) => {
    const data = empleadoValido(req.body);
    if (!data) return invalid(res, 'Revisa nombre, edad (1 a 120), país, cargo y correo.');
    const result = await query('INSERT INTO empleado (nombre, edad, pais, cargo, correo) VALUES (?, ?, ?, ?, ?)', data);
    res.status(201).json({ mensaje: 'Empleado registrado correctamente.', id: result.insertId });
  });
  app.post('/create', createEmployee);
  app.post('/empleados', createEmployee);
  app.put('/empleados/:id', route(async (req, res) => {
    const id = getId(req.params.id), data = empleadoValido(req.body);
    if (!data) return invalid(res, 'Revisa nombre, edad (1 a 120), país, cargo y correo.');
    changed(await query('UPDATE empleado SET nombre=?, edad=?, pais=?, cargo=?, correo=? WHERE id=?', [...data, id]), res, 'Empleado actualizado.');
  }));
  app.delete('/empleados/:id', route(async (req, res) => {
    changed(await query('DELETE FROM empleado WHERE id=?', [getId(req.params.id)]), res, 'Empleado eliminado.');
  }));

  app.get('/proyectos', route(async (req, res) => res.json(await query('SELECT * FROM proyectos ORDER BY id DESC'))));
  app.post('/proyectos', route(async (req, res) => {
    const data = proyectoValido(req.body);
    if (!data) return invalid(res, 'Ingresa un nombre (máximo 100 caracteres) y una descripción (máximo 5000).');
    const result = await query('INSERT INTO proyectos (nombre_proyecto, descripcion) VALUES (?, ?)', data);
    res.status(201).json({ mensaje: 'Proyecto creado.', id: result.insertId });
  }));
  app.put('/proyectos/:id', route(async (req, res) => {
    const id = getId(req.params.id), data = proyectoValido(req.body);
    if (!data) return invalid(res, 'Revisa el nombre y la descripción del proyecto.');
    changed(await query('UPDATE proyectos SET nombre_proyecto=?, descripcion=? WHERE id=?', [...data, id]), res, 'Proyecto actualizado.');
  }));
  app.delete('/proyectos/:id', route(async (req, res) => {
    changed(await query('DELETE FROM proyectos WHERE id=?', [getId(req.params.id)]), res, 'Proyecto eliminado.');
  }));

  app.get('/asignaciones', route(async (req, res) => res.json(await query(`
    SELECT ep.empleado_id, ep.proyecto_id, e.nombre, e.cargo, p.nombre_proyecto
    FROM empleado_proyecto ep
    INNER JOIN empleado e ON e.id=ep.empleado_id
    INNER JOIN proyectos p ON p.id=ep.proyecto_id
    ORDER BY p.nombre_proyecto, e.nombre`))));
  app.post('/asignaciones', route(async (req, res) => {
    const { empleado_id, proyecto_id } = req.body || {};
    if (!idValido(empleado_id) || !idValido(proyecto_id)) return invalid(res, 'Selecciona un empleado y un proyecto.');
    await query('INSERT INTO empleado_proyecto (empleado_id, proyecto_id) VALUES (?, ?)', [Number(empleado_id), Number(proyecto_id)]);
    res.status(201).json({ mensaje: 'Empleado asignado al proyecto.' });
  }));
  app.put('/asignaciones/:empleadoId/:proyectoId', route(async (req, res) => {
    const oldEmployee = getId(req.params.empleadoId), oldProject = getId(req.params.proyectoId);
    const { empleado_id, proyecto_id } = req.body || {};
    if (!idValido(empleado_id) || !idValido(proyecto_id)) return invalid(res, 'Selecciona un empleado y un proyecto.');
    changed(await query('UPDATE empleado_proyecto SET empleado_id=?, proyecto_id=? WHERE empleado_id=? AND proyecto_id=?',
      [Number(empleado_id), Number(proyecto_id), oldEmployee, oldProject]), res, 'Asignación actualizada.');
  }));
  app.delete('/asignaciones/:empleadoId/:proyectoId', route(async (req, res) => {
    changed(await query('DELETE FROM empleado_proyecto WHERE empleado_id=? AND proyecto_id=?',
      [getId(req.params.empleadoId), getId(req.params.proyectoId)]), res, 'Asignación retirada.');
  }));

   app.get('/salarios', route(async (req, res) => res.json(await query(`
    SELECT s.*, e.nombre, e.cargo,
      NOT EXISTS (SELECT 1 FROM salario nuevo WHERE nuevo.empleado_id=s.empleado_id
        AND (nuevo.fecha_actualizacion>s.fecha_actualizacion
          OR (nuevo.fecha_actualizacion=s.fecha_actualizacion AND nuevo.id>s.id))) AS es_actual
    FROM salario s INNER JOIN empleado e ON e.id=s.empleado_id
    ORDER BY s.fecha_actualizacion DESC, s.id DESC`))));
  app.post('/salarios', route(async (req, res) => {
    const data = salarioValido(req.body);
    if (!data) return invalid(res, 'Selecciona un empleado, un monto entre 0 y 99 999 999.99 (máximo 2 decimales) y una fecha válida.');
    const result = await query('INSERT INTO salario (empleado_id, monto, fecha_actualizacion) VALUES (?, ?, ?)', data);
    res.status(201).json({ mensaje: 'Salario registrado.', id: result.insertId });
  }));
  app.put('/salarios/:id', route(async (req, res) => {
    const id = getId(req.params.id), data = salarioValido(req.body);
    if (!data) return invalid(res, 'Revisa el empleado, el monto y la fecha del salario.');
    changed(await query('UPDATE salario SET empleado_id=?, monto=?, fecha_actualizacion=? WHERE id=?', [...data, id]), res, 'Salario actualizado.');
  }));
  app.delete('/salarios/:id', route(async (req, res) => {
    changed(await query('DELETE FROM salario WHERE id=?', [getId(req.params.id)]), res, 'Registro de salario eliminado.');
  }));

  app.use((req, res) => res.status(404).json({ mensaje: 'Ruta no encontrada.' }));
  app.use((error, req, res, next) => {
    if (error.type === 'entity.parse.failed') return invalid(res, 'El cuerpo JSON no es válido.');
    if (error.type === 'entity.too.large') return res.status(413).json({ mensaje: 'La solicitud es demasiado grande.' });
    if (error.status === 400) return invalid(res, error.message);
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensaje: 'Ya existe esta asignación o un salario para ese empleado en la misma fecha.' });
    if (error.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ mensaje: 'Este registro tiene asignaciones o salarios vinculados. Retíralos primero si deseas eliminarlo.' });
    if (error.code === 'ER_NO_REFERENCED_ROW_2') return res.status(409).json({ mensaje: 'El empleado o proyecto seleccionado ya no existe. Actualiza la lista.' });
    console.error('Error de base de datos:', error.code || error.message);
    res.status(503).json({ mensaje: 'No se pudo acceder a la base de datos. Inicia MySQL en XAMPP e importa base_de_datos.sql.' });
  });
  return app;
};