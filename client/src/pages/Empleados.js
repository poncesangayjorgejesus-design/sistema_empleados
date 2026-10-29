
import { useRef, useState } from 'react';
import { Actions, Avatar, Empty, Field, FormButtons, Icon, matches, Search } from '../components/UI';

const blank = { nombre: '', edad: '', pais: '', cargo: '', correo: '' };

export default function Empleados({ data, mutate, askDelete, busy }) {
  const [form, setForm] = useState(blank), [editing, setEditing] = useState(null), [search, setSearch] = useState('');
  const input = useRef(null);
  const set = e => setForm({ ...form, [e.target.name]: e.target.value });
