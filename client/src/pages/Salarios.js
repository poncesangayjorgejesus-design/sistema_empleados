
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
