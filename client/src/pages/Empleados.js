
import { useRef, useState } from 'react';
import { Actions, Avatar, Empty, Field, FormButtons, Icon, matches, Search } from '../components/UI';

const blank = { nombre: '', edad: '', pais: '', cargo: '', correo: '' };

export default function Empleados({ data, mutate, askDelete, busy }) {
  const [form, setForm] = useState(blank), [editing, setEditing] = useState(null), [search, setSearch] = useState('');
  const input = useRef(null);
  const set = e => setForm({ ...form, [e.target.name]: e.target.value });
  const reset = () => { setForm(blank); setEditing(null); };
  const edit = row => { setForm({ nombre: row.nombre, edad: row.edad, pais: row.pais, cargo: row.cargo, correo: row.correo }); setEditing(row.id); input.current.focus(); input.current.scrollIntoView({ block: 'center', behavior: 'smooth' }); };
  const submit = async e => { e.preventDefault(); if (await mutate(editing ? 'put' : 'post', editing ? `/empleados/${editing}` : '/create', form)) reset(); };
  const filtered = data.empleados.filter(e => matches(search, e.nombre, e.cargo, e.correo, e.pais));

  return <div className="employee-layout">
    <section className="panel form-panel"><div className="section-heading"><span className="icon-tile"><Icon name="empleados"/></span><div><h2>{editing ? 'Editar empleado' : 'Nuevo empleado'}</h2><p>{editing ? `Registro #${editing}` : 'Dale un lugar a tu equipo.'}</p></div></div>
      <form onSubmit={submit}><fieldset disabled={busy}>
        <Field label="Nombre completo"><input ref={input} name="nombre" value={form.nombre} onChange={set} maxLength={100} placeholder="Ej. Lucía Torres" autoComplete="name" required/></Field>
        <div className="form-row"><Field label="Edad" name="edad" type="number" min="1" max="120" step="1" value={form.edad} onChange={set} placeholder="25" required/><Field label="País" name="pais" maxLength={100} value={form.pais} onChange={set} placeholder="Perú" required/></div>
        <Field label="Cargo" name="cargo" maxLength={100} value={form.cargo} onChange={set} placeholder="Ej. Desarrollador" required/>
        <Field label="Correo electrónico" name="correo" type="email" maxLength={150} value={form.correo} onChange={set} placeholder="nombre@correo.com" autoComplete="email" required/>
        <FormButtons editing={editing} busy={busy} onCancel={reset} createLabel="Registrar empleado"/>
      </fieldset></form><div className="form-note"><Icon name="info" size={17}/><span>Después del registro, podrás asignar proyectos y registrar su salario.</span></div>
    </section>

    <section className="panel directory"><div className="panel-header"><div><h2>Directorio del equipo <span className="count">{data.empleados.length}</span></h2><p>Las personas que hacen posible cada proyecto.</p></div></div><div className="table-toolbar"><Search value={search} onChange={setSearch} placeholder="Buscar por nombre, cargo o correo…"/></div>
      {filtered.length ? <div className="table-scroll"><table><thead><tr><th>Empleado</th><th>Cargo / país</th><th>Proyectos</th><th className="align-right">Acciones</th></tr></thead><tbody>{filtered.map(e => <tr key={e.id}><td><div className="person"><Avatar name={e.nombre}/><div><strong>{e.nombre}</strong><span>{e.correo}</span><small>#{e.id} · {e.edad} años</small></div></div></td><td><strong className="cell-title">{e.cargo}</strong><span className="cell-sub">{e.pais}</span></td><td><span className="pill">{data.asignaciones.filter(a => a.empleado_id === e.id).length} asignados</span></td><td><Actions label={e.nombre} onEdit={() => edit(e)} disabled={busy} onDelete={() => askDelete(`/empleados/${e.id}`, `Se eliminará a ${e.nombre}. Si tiene salarios o proyectos vinculados, deberás retirarlos primero.`)}/></td></tr>)}</tbody></table></div> : <Empty icon="empleados" title={search ? 'No encontramos coincidencias' : 'Tu equipo empieza aquí'}>{search ? 'Prueba con otro nombre, cargo o correo.' : 'Completa el formulario para registrar al primer empleado.'}</Empty>}
      <div className="panel-footer">{filtered.length} de {data.empleados.length} empleados</div>
    </section>
  </div>;
}
