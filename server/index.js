const mysql = require('mysql');
const createApp = require('./app');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'empleados'
});
const app = createApp(db);
const port = Number(process.env.PORT || 3001);
const server = app.listen(port, () => {
  console.log(`Servidor funcionando en http://localhost:${port}`);
  db.query('SELECT 1', (error) => {
    if (error) {
      console.error('No se pudo conectar a MySQL:', error.code);
      console.error('Inicia MySQL en XAMPP e importa base_de_datos.sql.');
    } else console.log('Conectado a la base de datos de empleados.');
  });
});
function stop() { server.close(() => db.end(() => process.exit(0))); }
process.on('SIGINT', stop);
process.on('SIGTERM', stop);