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