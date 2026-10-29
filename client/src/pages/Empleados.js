
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
