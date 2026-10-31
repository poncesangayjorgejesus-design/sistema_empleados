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

  
return (
  <div className={`app-shell theme-${page}`}>

    <aside className="sidebar">

      <button
        className="brand"
        onClick={() => navigate('inicio')}
        aria-label="Nexo, ir al inicio"
      >
        <span className="brand-symbol">
          <Icon name="asignaciones" size={24} />
        </span>
        <span>
          nexo
          <small>PERSONAS & PROYECTOS</small>
        </span>
      </button>

      <span className="nav-caption">ESPACIO DE TRABAJO</span>

      <nav aria-label="Navegación principal">
        {Object.entries(sections).map(([key, value]) => (
          <button
            disabled={saving}
            key={key}
            className={`nav-link ${page === key ? 'selected' : ''}`}
            aria-current={page === key ? 'page' : undefined}
            onClick={() => navigate(key)}
          >
            <Icon name={value.icon} />
            <span>{value.name}</span>
            {page === key && <span className="nav-dot" />}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="workspace-card">
          <span className="workspace-avatar">AG</span>
          <div>
            <strong>Actividad grupal</strong>
            <small>Gestión de empleados</small>
          </div>
        </div>

        <div className="sidebar-footnote">
          Un equipo. Un espacio.
        </div>
      </div>
    </aside>

    <div className="main-shell">

      <header className="topbar">

        <div className="breadcrumbs">
          <span>Mi espacio</span>
          <span>/</span>
          <strong>{section.name}</strong>
        </div>

        <div className="topbar-right">
          <span className={`connection ${loadError ? 'offline' : loading ? 'checking' : ''}`}>
            <i />
            {loadError
              ? 'Sin conexión'
              : loading
              ? 'Conectando…'
              : 'Sistema conectado'}
          </span>

          <span className="profile-chip">AG</span>
        </div>

      </header>

      <main>

        <div className="page-heading">

          <div>
            <span className="eyebrow">
              {page === 'inicio'
                ? 'PANEL GENERAL'
                : `GESTIÓN DE ${section.name.toUpperCase()}`}
            </span>

            <h1>{section.title}</h1>
            <p>{section.subtitle}</p>
          </div>

          <button
            className="button secondary refresh-button"
            disabled={loading || saving}
            onClick={refresh}
          >
            <Icon name="refresh" size={17} />
            {loading ? 'Cargando…' : 'Actualizar'}
          </button>

        </div>

        {notice && (
          <div
            className={`notice ${notice.type}`}
            role={notice.type === 'error' ? 'alert' : 'status'}
          >
            <Icon
              name={notice.type === 'success' ? 'check' : 'info'}
              size={20}
            />

            <span>{notice.text}</span>

            <button
              className="icon-button"
              onClick={() => setNotice(null)}
              aria-label="Cerrar mensaje"
            >
              <Icon name="close" size={17} />
            </button>
          </div>
        )}

        {loadError && (
          <div className="notice error" role="alert">
            <Icon name="info" />

            <span>
              {loadError}
              {data && ' Se muestran los últimos datos cargados; actualiza para continuar.'}
            </span>

            <button
              className="text-button"
              disabled={loading || saving}
              onClick={refresh}
            >
              Reintentar
            </button>
          </div>
        )}

        {!data ? (
          <section className="panel initial-state">

            <span className="icon-tile">
              <Icon name={loadError ? 'info' : 'refresh'} size={30} />
            </span>

            <h2>
              {loadError
                ? 'Conectemos tu espacio'
                : 'Cargando tu espacio…'}
            </h2>

            <p>
              {loadError
                ? 'Inicia MySQL en XAMPP, importa base_de_datos.sql y ejecuta npm start dentro de server.'
                : 'Estamos consultando empleados, proyectos, asignaciones y salarios.'}
            </p>

            {loadError && (
              <button
                className="button primary"
                disabled={loading}
                onClick={refresh}
              >
                Volver a intentar
              </button>
            )}

          </section>
        ) : (
          <div className="page-content" aria-busy={loading}>

            {page === 'inicio' && <Inicio {...shared} />}

            {page === 'empleados' && <Empleados {...shared} />}

            {page === 'proyectos' && <Proyectos {...shared} />}

            {page === 'asignaciones' && (
              <Asignaciones
                {...shared}
                selectedProject={selectedProject}
              />
            )}

            {page === 'salarios' && <Salarios {...shared} />}

          </div>
        )}

        <footer className="page-footer">
          <span>
            nexo <i /> Personas & proyectos
          </span>

          <span>Organiza. Conecta. Avanza.</span>
        </footer>

      </main>
    </div>

    {pending && (
      <Confirm
        pending={pending}
        busy={saving}
        onClose={() => setPending(null)}
        onConfirm={confirmDelete}
      />
    )}

  </div>
);

export default App;
