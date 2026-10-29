
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
