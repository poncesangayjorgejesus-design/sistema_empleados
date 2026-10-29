const { test } = require('node:test');
const assert = require('node:assert/strict');
const { idValido, empleadoValido, proyectoValido, salarioValido, fechaValida } = require('../validaciones');
const empleado = { nombre: ' Ana Pérez ', edad: 25, pais: ' Perú ', cargo: ' Desarrolladora ', correo: ' ana@ejemplo.com ' };

test('Empleado: conserva los cinco campos y recorta espacios', () => {
  assert.deepEqual(empleadoValido(empleado), ['Ana Pérez', 25, 'Perú', 'Desarrolladora', 'ana@ejemplo.com']);
});
test('Empleado: rechaza edades vacías, decimales y fuera del rango', () => {
  for (const edad of ['', 0, -1, 121, 20.5, 'abc', true, [25], null]) assert.equal(empleadoValido({ ...empleado, edad }), null);
  assert.ok(empleadoValido({ ...empleado, edad: '120' }));
});
test('Empleado: todos sus campos son obligatorios', () => {
  for (const key of ['nombre', 'pais', 'cargo', 'correo']) {
    assert.equal(empleadoValido({ ...empleado, [key]: ' ' }), null);
    assert.equal(empleadoValido({ ...empleado, [key]: [] }), null);
  }
  assert.equal(empleadoValido(null), null);
});
test('Empleado: valida correo y longitudes de MySQL', () => {
  for (const correo of ['ana', 'ana@', '@ejemplo.com', 'a b@ejemplo.com']) assert.equal(empleadoValido({ ...empleado, correo }), null);
  assert.equal(empleadoValido({ ...empleado, nombre: 'x'.repeat(101) }), null);
  assert.equal(empleadoValido({ ...empleado, correo: 'a'.repeat(145) + '@ejemplo.com' }), null);
});
test('IDs: rechaza expresiones, negativos, booleanos y estructuras', () => {
  for (const id of [0, -1, '1 OR 1=1', '2.5', [], [1], true, {}, '1e3', 2147483648]) assert.equal(idValido(id), false);
  for (const id of [1, '20', 2147483647]) assert.equal(idValido(id), true);
});
test('Proyecto: nombre y descripción deben estar completos', () => {
  assert.deepEqual(proyectoValido({ nombre_proyecto: ' Web ', descripcion: ' Un portal ' }), ['Web', 'Un portal']);
  assert.equal(proyectoValido({ nombre_proyecto: 'Web', descripcion: ' ' }), null);
  assert.equal(proyectoValido({ nombre_proyecto: 'x'.repeat(101), descripcion: 'texto' }), null);
  assert.equal(proyectoValido({ nombre_proyecto: 'Web', descripcion: 'x'.repeat(5001) }), null);
});
test('Fechas: respeta el calendario y los años bisiestos', () => {
  for (const date of ['2024-02-29', '2026-10-28', '1000-01-01', '9999-12-31']) assert.equal(fechaValida(date), true);
  for (const date of ['2026-02-29', '2026-04-31', '2026-13-01', '2026-00-01', '2026-1-1', '0999-01-01', 'ayer', '']) assert.equal(fechaValida(date), false);
});
test('Salario: conserva precisión decimal y permite el límite DECIMAL(10,2)', () => {
  assert.deepEqual(salarioValido({ empleado_id: '2', monto: '1234.50', fecha_actualizacion: '2026-10-28' }), [2, '1234.50', '2026-10-28']);
  for (const monto of [0, '0.00', '99999999.99']) assert.ok(salarioValido({ empleado_id: 1, monto, fecha_actualizacion: '2026-01-01' }));
});
test('Salario: rechaza exceso de decimales, montos negativos y datos vacíos', () => {
  for (const monto of ['', ' ', -1, '1.999', '100000000', '1e2', '1,50', null, true, [5]]) {
    assert.equal(salarioValido({ empleado_id: 1, monto, fecha_actualizacion: '2026-01-01' }), null);
  }
  assert.equal(salarioValido({ empleado_id: 1, monto: '500', fecha_actualizacion: '2026-02-30' }), null);
  assert.equal(salarioValido(null), null);
});