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