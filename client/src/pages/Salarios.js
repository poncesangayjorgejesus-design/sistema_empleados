
import { useRef, useState } from 'react';
import { Actions, dateLabel, Empty, Field, FormButtons, Icon, matches, money, Search, today } from '../components/UI';

const blank = () => ({ empleado_id: '', monto: '', fecha_actualizacion: today() });

export default function Salarios({ data, mutate, askDelete, busy, navigate }) {
  const [form, setForm] = useState(blank), [editing, setEditing] = useState(null), [search, setSearch] = useState(''), [mode, setMode] = useState('todos');
  const input = useRef(null);
  const current = data.salarios.filter(s => Number(s.es_actual) === 1);
  const total = current.reduce((sum, s) => sum + Number(s.monto), 0);
