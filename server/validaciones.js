function text(value, max) {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max;
}
function idValido(value) {
  return ['string', 'number'].includes(typeof value) && /^(?:[1-9]\d*)$/.test(String(value)) && Number.isSafeInteger(Number(value)) && Number(value) <= 2147483647;
}
function empleadoValido(body = {}) {
  if (!body) return null;
  const { nombre, edad, pais, cargo, correo } = body;
  if (!text(nombre, 100) || !text(pais, 100) || !text(cargo, 100) || !text(correo, 150) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim()) ||
      !['string', 'number'].includes(typeof edad) || !/^\d+$/.test(String(edad)) || Number(edad) < 1 || Number(edad) > 120) return null;
  return [nombre.trim(), Number(edad), pais.trim(), cargo.trim(), correo.trim()];
}
function proyectoValido(body = {}) {
  if (!body || !text(body.nombre_proyecto, 100) || !text(body.descripcion, 5000)) return null;
  return [body.nombre_proyecto.trim(), body.descripcion.trim()];
}
function fechaValida(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return value.slice(0, 4) >= '1000' && !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
function salarioValido(body = {}) {
  if (!body || !idValido(body.empleado_id) || !['string', 'number'].includes(typeof body.monto) ||
      !/^(?:0|[1-9]\d{0,7})(?:\.\d{1,2})?$/.test(String(body.monto)) ||
      !fechaValida(body.fecha_actualizacion)) return null;
  return [Number(body.empleado_id), String(body.monto), body.fecha_actualizacion];
}
module.exports = { idValido, empleadoValido, proyectoValido, salarioValido, fechaValida };