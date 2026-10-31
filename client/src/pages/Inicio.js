import { Avatar, Empty, Icon, money } from '../components/UI';
const modules = [
  { id: 'empleados', n: '01', title: 'Empleados', text: 'Registra y organiza a las personas de tu equipo.', button: 'Ver empleados' },
  { id: 'proyectos', n: '02', title: 'Proyectos', text: 'Dale forma a tus ideas y organiza cada proyecto.', button: 'Ver proyectos' },
  { id: 'asignaciones', n: '03', title: 'Asignaciones', text: 'Conecta a cada empleado con sus proyectos.', button: 'Asignar equipos' },
  { id: 'salarios', n: '04', title: 'Salarios', text: 'Consulta montos y conserva sus actualizaciones.', button: 'Ver salarios' }
];
export default function Inicio({ data, navigate }) {
  const total = data.salarios.filter(s => Number(s.es_actual) === 1).reduce((sum, s) => sum + Number(s.monto), 0);
