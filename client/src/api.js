import Axios from 'axios';

export const api = Axios.create({ baseURL: process.env.REACT_APP_API_URL || '', timeout: 12000 });
export function errorMessage(error) {
  return error.response?.data?.mensaje || 'No se pudo conectar. Verifica que el servidor Node y MySQL estén encendidos.';
}
