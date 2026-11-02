
import { useRef, useState } from 'react';
import { Actions, dateLabel, Empty, Field, FormButtons, Icon, matches, money, Search, today } from '../components/UI';

const blank = () => ({ empleado_id: '', monto: '', fecha_actualizacion: today() });

export default function Salarios({ data, mutate, askDelete, busy, navigate }) {
  const [form, setForm] = useState(blank), [editing, setEditing] = useState(null), [search, setSearch] = useState(''), [mode, setMode] = useState('todos');
  const input = useRef(null);
  const current = data.salarios.filter(s => Number(s.es_actual) === 1);
  const total = current.reduce((sum, s) => sum + Number(s.monto), 0);

  const reset = () => { setForm(blank()); setEditing(null); };
  const edit = row => { setForm({ empleado_id: String(row.empleado_id), monto: String(row.monto), fecha_actualizacion: row.fecha_actualizacion.slice(0, 10) }); setEditing(row.id); input.current.focus(); input.current.scrollIntoView({ block: 'center', behavior: 'smooth' }); };
  const submit = async e => { e.preventDefault(); if (await mutate(editing ? 'put' : 'post', editing ? `/salarios/${editing}` : '/salarios', form)) reset(); };
  const filtered = data.salarios.filter(s => (mode === 'todos' || Number(s.es_actual) === 1) && matches(search, s.nombre, s.cargo, s.monto));

  return <><div className="salary-overview"><div className="salary-total"><span className="eyebrow">TOTAL DE ÚLTIMOS SALARIOS</span><strong>{money(total)}</strong><span>Último registro por fecha de cada empleado.</span><Icon name="salarios" size={62}/></div><div className="salary-stat"><span>Con salario registrado</span><strong>{current.length}<small> / {data.empleados.length}</small></strong><p>empleados del equipo</p></div><div className="salary-stat"><span>Registros en el historial</span><strong>{data.salarios.length}</strong><p>actualizaciones guardadas</p></div></div>
    <div className="salary-layout"><section className="panel salary-ledger"><div className="panel-header"><div><h2>Historial de salarios</h2><p>Montos en soles · Ordenados por fecha</p></div></div><div className="salary-toolbar"><div className="segmented"><button className={mode === 'todos' ? 'active' : ''} aria-pressed={mode === 'todos'} onClick={() => setMode('todos')}>Todo el historial</button><button className={mode === 'actual' ? 'active' : ''} aria-pressed={mode === 'actual'} onClick={() => setMode('actual')}>Últimos salarios</button></div><Search value={search} onChange={setSearch} placeholder="Buscar empleado…"/></div>
      {filtered.length ? <div className="table-scroll"><table><thead><tr><th>Empleado</th><th>Monto</th><th>Actualización</th><th className="align-right">Acciones</th></tr></thead><tbody>{filtered.map(s => <tr key={s.id}><td><strong className="cell-title">{s.nombre}</strong><span className="cell-sub">{s.cargo}</span></td><td><strong className="money-value">{money(s.monto)}</strong><span className={`salary-tag ${Number(s.es_actual) ? 'latest' : ''}`}>{Number(s.es_actual) ? 'Último registro' : 'Histórico'}</span></td><td className="nowrap">{dateLabel(s.fecha_actualizacion)}</td><td><Actions disabled={busy} label={`salario de ${s.nombre} del ${s.fecha_actualizacion}`} onEdit={() => edit(s)} onDelete={() => askDelete(`/salarios/${s.id}`, `Se eliminará el salario de ${money(s.monto)} de ${s.nombre}, con fecha ${dateLabel(s.fecha_actualizacion)}. Los demás registros se conservarán.`)}/></td></tr>)}</tbody></table></div> : <Empty icon="salarios" title={search ? 'No hay coincidencias' : 'Aún no hay salarios para mostrar'}>{search ? 'Busca con otro nombre.' : 'Registra el monto y la fecha de actualización de un empleado.'}</Empty>}
      <div className="panel-footer">{filtered.length} registros mostrados</div></section>

    <section className="panel form-panel"><div className="section-heading"><span className="icon-tile"><Icon name="salarios"/></span><div><h2>{editing ? 'Editar salario' : 'Registrar salario'}</h2><p>{editing ? `Registro #${editing}` : 'Mantén el historial al día.'}</p></div></div>
      {!data.empleados.length ? <div className="setup-notice"><p>Registra un empleado para agregar su salario.</p><button className="button secondary" onClick={() => navigate('empleados')}>Ir a empleados</button></div> : <form onSubmit={submit}><fieldset disabled={busy}><Field label="Empleado"><select ref={input} value={form.empleado_id} onChange={e => setForm({ ...form, empleado_id: e.target.value })} required><option value="">Selecciona un empleado</option>{data.empleados.map(e => <option key={e.id} value={e.id}>{e.nombre} · #{e.id}</option>)}</select></Field><Field label="Monto (S/)" type="number" min="0" max="99999999.99" step="0.01" value={form.monto} onChange={e => setForm({ ...form, monto: e.target.value })} placeholder="0.00" required/><Field label="Fecha de actualización" type="date" min="1000-01-01" max="9999-12-31" value={form.fecha_actualizacion} onChange={e => setForm({ ...form, fecha_actualizacion: e.target.value })} required/><FormButtons editing={editing} busy={busy} onCancel={reset} createLabel="Guardar salario"/></fieldset></form>}
      <div className="form-note"><Icon name="info" size={17}/><span>Registra una nueva fecha para conservar el historial. Solo se admite un salario por empleado y fecha.</span></div>
    </section></div></>;
}
