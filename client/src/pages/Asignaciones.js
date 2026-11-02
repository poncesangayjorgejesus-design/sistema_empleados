
import { useRef, useState } from 'react';
import { Actions, Avatar, Empty, Field, FormButtons, Icon, matches, Search } from '../components/UI';

export default function Asignaciones({ data, mutate, askDelete, busy, selectedProject, navigate }) {
  const [form, setForm] = useState({ empleado_id: '', proyecto_id: selectedProject ? String(selectedProject) : '' });
  const [editing, setEditing] = useState(null), [search, setSearch] = useState('');
  const input = useRef(null);
