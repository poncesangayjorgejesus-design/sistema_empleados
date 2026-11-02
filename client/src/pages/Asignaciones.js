
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

  return <><section className="assignment-composer panel"><div className="composer-heading"><div><span className="eyebrow">CONECTA A TU EQUIPO</span><h2>{editing ? 'Editar asignación' : 'La persona indicada. El proyecto indicado.'}</h2><p>Asigna empleados a uno o varios proyectos.</p></div><span className="icon-tile"><Icon name="asignaciones" size={28}/></span></div>
    {noOptions ? <div className="setup-notice"><p>Primero necesitas al menos un empleado y un proyecto.</p><div className="inline-buttons"><button className="button secondary" onClick={() => navigate('empleados')}>Ir a empleados</button><button className="button secondary" onClick={() => navigate('proyectos')}>Ir a proyectos</button></div></div> : <form onSubmit={submit}><fieldset disabled={busy}><div className="assignment-fields"><div className="assignment-step"><span className="step-number">01</span><Field label="Selecciona al empleado"><select ref={input} value={form.empleado_id} onChange={e => setForm({ ...form, empleado_id: e.target.value })} required><option value="">Elegir empleado</option>{data.empleados.map(e => <option key={e.id} value={e.id}>{e.nombre} · #{e.id}</option>)}</select></Field></div><Icon name="arrow" size={25}/><div className="assignment-step"><span className="step-number">02</span><Field label="Selecciona el proyecto"><select value={form.proyecto_id} onChange={e => setForm({ ...form, proyecto_id: e.target.value })} required><option value="">Elegir proyecto</option>{data.proyectos.map(p => <option key={p.id} value={p.id}>{p.nombre_proyecto}</option>)}</select></Field></div><FormButtons editing={editing} busy={busy} onCancel={reset} createLabel="Asignar empleado"/></div></fieldset></form>}
    {employee && project && <div className="assignment-preview"><Icon name="check" size={17}/><span><strong>{employee.nombre}</strong> se asignará a <strong>{project.nombre_proyecto}</strong>.</span></div>}
