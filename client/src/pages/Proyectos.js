
import { useRef, useState } from 'react';
import { Actions, Avatar, Empty, Field, FormButtons, Icon, matches, Search } from '../components/UI';

const blank = { nombre_proyecto: '', descripcion: '' };

export default function Proyectos({ data, mutate, askDelete, busy, navigate }) {
  const [form, setForm] = useState(blank), [editing, setEditing] = useState(null), [search, setSearch] = useState('');
  const input = useRef(null);
