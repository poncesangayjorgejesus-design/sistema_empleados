
import { useRef, useState } from 'react';
import { Actions, Avatar, Empty, Field, FormButtons, Icon, matches, Search } from '../components/UI';

export default function Asignaciones({ data, mutate, askDelete, busy, selectedProject, navigate }) {
  const [form, setForm] = useState({ empleado_id: '', proyecto_id: selectedProject ? String(selectedProject) : '' });
  const [editing, setEditing] = useState(null), [search, setSearch] = useState('');
  const input = useRef(null);

  const reset = () => { setForm({ empleado_id: '', proyecto_id: '' }); setEditing(null); };
  const edit = row => { setForm({ empleado_id: String(row.empleado_id), proyecto_id: String(row.proyecto_id) }); setEditing(row); input.current.focus(); input.current.scrollIntoView({ block: 'center', behavior: 'smooth' }); };
  const submit = async e => {
    e.preventDefault();
    const path = editing ? `/asignaciones/${editing.empleado_id}/${editing.proyecto_id}` : '/asignaciones';
    if (await mutate(editing ? 'put' : 'post', path, form)) reset();
  };
  const noOptions = !data.empleados.length || !data.proyectos.length;
  const employee = data.empleados.find(e => String(e.id) === form.empleado_id);
  const project = data.proyectos.find(p => String(p.id) === form.proyecto_id);
  const filtered = data.asignaciones.filter(a => matches(search, a.nombre, a.nombre_proyecto, a.cargo));
