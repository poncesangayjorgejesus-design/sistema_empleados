
import { useRef, useState } from 'react';
import { Actions, Avatar, Empty, Field, FormButtons, Icon, matches, Search } from '../components/UI';

const blank = { nombre_proyecto: '', descripcion: '' };

export default function Proyectos({ data, mutate, askDelete, busy, navigate }) {
  const [form, setForm] = useState(blank), [editing, setEditing] = useState(null), [search, setSearch] = useState('');
  const input = useRef(null);
  const reset = () => { setForm(blank); setEditing(null); };
  const edit = row => { setForm({ nombre_proyecto: row.nombre_proyecto, descripcion: row.descripcion }); setEditing(row.id); input.current.focus(); input.current.scrollIntoView({ block: 'center', behavior: 'smooth' }); };
  const submit = async e => { e.preventDefault(); if (await mutate(editing ? 'put' : 'post', editing ? `/proyectos/${editing}` : '/proyectos', form)) reset(); };
  const filtered = data.proyectos.filter(p => matches(search, p.nombre_proyecto, p.descripcion));

  return <div className="project-layout"><div className="project-board"><div className="board-toolbar"><div><h2>Portafolio de proyectos <span className="count">{data.proyectos.length}</span></h2><p>Cada idea, un equipo para llevarla adelante.</p></div><Search value={search} onChange={setSearch} placeholder="Buscar proyecto…"/></div>
    <div className="project-grid">{filtered.map(p => { const team = data.asignaciones.filter(a => a.proyecto_id === p.id); return <article className="project-card" key={p.id}><div className="project-card-top"><span className="icon-tile"><Icon name="proyectos" size={24}/></span><span className="eyebrow">PROYECTO {String(p.id).padStart(2, '0')}</span><Actions label={p.nombre_proyecto} onEdit={() => edit(p)} disabled={busy} onDelete={() => askDelete(`/proyectos/${p.id}`, `Se eliminará el proyecto «${p.nombre_proyecto}». Primero retira sus asignaciones si las tiene.`)}/></div><h3>{p.nombre_proyecto}</h3><p className="project-description">{p.descripcion}</p><div className="project-team"><div className="avatar-stack">{team.slice(0, 3).map(a => <Avatar small key={a.empleado_id} name={a.nombre}/>)}</div><span>{team.length} {team.length === 1 ? 'integrante' : 'integrantes'}</span></div><button className="text-button" onClick={() => navigate('asignaciones', p.id)}>Gestionar equipo <Icon name="arrow" size={17}/></button></article>; })}</div>
    {!filtered.length && <section className="panel"><Empty title={search ? 'No hay proyectos con ese nombre' : 'Tu próximo proyecto empieza aquí'}>{search ? 'Intenta con otra búsqueda.' : 'Crea un proyecto con su nombre y descripción.'}</Empty></section>}

  </div><section className="panel form-panel project-form"><span className="eyebrow">ESPACIO DE TRABAJO</span><h2>{editing ? 'Editar proyecto' : 'Una nueva idea'}</h2><p className="muted">Define el proyecto. Luego reúne a su equipo.</p><form onSubmit={submit}><fieldset disabled={busy}><Field label="Nombre del proyecto"><input ref={input} value={form.nombre_proyecto} onChange={e => setForm({ ...form, nombre_proyecto: e.target.value })} maxLength={100} required placeholder="Ej. Sistema de inventario"/></Field><Field label="Descripción"><textarea rows="6" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} maxLength={5000} required placeholder="¿Qué se va a desarrollar y cuál es su objetivo?"/></Field><FormButtons editing={editing} busy={busy} onCancel={reset} createLabel="Crear proyecto"/></fieldset></form><div className="form-note"><Icon name="info" size={17}/><span>Un proyecto puede tener varios empleados y cada empleado puede participar en más de uno.</span></div></section></div>;
}
