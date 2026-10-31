import { useCallback, useEffect, useRef, useState } from 'react';
import { api, errorMessage } from './api';
import { Confirm, Icon } from './components/UI';
import Inicio from './pages/Inicio';
import Empleados from './pages/Empleados';
import Proyectos from './pages/Proyectos';
import Asignaciones from './pages/Asignaciones';
import Salarios from './pages/Salarios';
import './App.css';

const sections = {
  inicio: { name: 'Inicio', icon: 'home', title: 'Tu espacio de trabajo', subtitle: 'Una vista general para mantener todo conectado.' },
  empleados: { name: 'Empleados', icon: 'empleados', title: 'Las personas, primero.', subtitle: 'Registra, consulta y actualiza la información de tu equipo.' },
  proyectos: { name: 'Proyectos', icon: 'proyectos', title: 'Ideas que toman forma.', subtitle: 'Organiza tus proyectos y descubre quiénes participan en ellos.' },
  asignaciones: { name: 'Asignaciones', icon: 'asignaciones', title: 'El trabajo se hace en equipo.', subtitle: 'Relaciona empleados y proyectos desde un solo lugar.' },
  salarios: { name: 'Salarios', icon: 'salarios', title: 'Cada actualización cuenta.', subtitle: 'Administra los salarios de tu equipo y consulta su historial.' }
};
function readPage() { const page = window.location.hash.slice(1).split('?')[0]; return sections[page] ? page : 'inicio'; }
function App() {
  const [page, setPage] = useState(readPage), [selectedProject, setSelectedProject] = useState(null);
  const [data, setData] = useState(null), [loading, setLoading] = useState(true), [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false), [notice, setNotice] = useState(null), [pending, setPending] = useState(null);
  const request = useRef(0), mutationLock = useRef(false);

const refresh = useCallback(async () => {
    const current = ++request.current;
    setLoading(true);
    try {
      const responses = await Promise.all(['empleados', 'proyectos', 'asignaciones', 'salarios'].map(path => api.get(`/${path}`)));
      if (current !== request.current) return false;
      setData(Object.fromEntries(['empleados', 'proyectos', 'asignaciones', 'salarios'].map((key, i) => [key, responses[i].data])));
      setLoadError(''); return true;
    } catch (error) {
      if (current === request.current) setLoadError(errorMessage(error));
      return false;
    } finally { if (current === request.current) setLoading(false); }
  }, []);

  useEffect(() => { refresh(); return () => { request.current += 1; }; }, [refresh]);
  useEffect(() => {
    const handler = () => { setPage(readPage()); setNotice(null); };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  useEffect(() => { document.title = `${sections[page].name} · Nexo`; }, [page]);
  const navigate = (next, projectId = null) => {
    if (saving) return;
    setSelectedProject(projectId); setPage(next); setNotice(null);
    window.location.hash = next;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const mutate = async (method, url, body) => {
    if (mutationLock.current) return false;
    mutationLock.current = true; setSaving(true); setNotice(null);
    try {
      const result = await api.request({ method, url, data: body });
      const updated = await refresh();
      setNotice({ type: updated ? 'success' : 'warning', text: updated ? result.data.mensaje : `${result.data.mensaje} No se pudo actualizar la vista. Pulsa Actualizar; no repitas el registro.` });
      return true;
    } catch (error) {
      setNotice({ type: 'error', text: errorMessage(error) }); return false;
    } finally { setSaving(false); mutationLock.current = false; }
  };
  const askDelete = (url, description, title) => setPending({ url, description, title });
  const confirmDelete = async () => { await mutate('delete', pending.url); setPending(null); };
  const shared = { data, mutate, askDelete, busy: saving || loading || !!loadError, navigate };
  const section = sections[page];
