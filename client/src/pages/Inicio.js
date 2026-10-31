import { Avatar, Empty, Icon, money } from '../components/UI';
const modules = [
  { id: 'empleados', n: '01', title: 'Empleados', text: 'Registra y organiza a las personas de tu equipo.', button: 'Ver empleados' },
  { id: 'proyectos', n: '02', title: 'Proyectos', text: 'Dale forma a tus ideas y organiza cada proyecto.', button: 'Ver proyectos' },
  { id: 'asignaciones', n: '03', title: 'Asignaciones', text: 'Conecta a cada empleado con sus proyectos.', button: 'Asignar equipos' },
  { id: 'salarios', n: '04', title: 'Salarios', text: 'Consulta montos y conserva sus actualizaciones.', button: 'Ver salarios' }
];
export default function Inicio({ data, navigate }) {
  const total = data.salarios.filter(s => Number(s.es_actual) === 1).reduce((sum, s) => sum + Number(s.monto), 0);


return (
  <>
    <section className="welcome">
      <div>
        <span className="eyebrow">TODO CONECTADO, TODO EN ORDEN</span>

        <h2>
          Un equipo.
          <br />
          <span>Muchas posibilidades.</span>
        </h2>

        <p>
          Personas, proyectos y salarios en un solo lugar.
          <br />
          Elige una sección para empezar.
        </p>

        <button
          className="button welcome-button"
          onClick={() => navigate('empleados')}
        >
          Gestionar mi equipo
          <Icon name="arrow" size={18} />
        </button>
      </div>

      <div className="welcome-art" aria-hidden="true">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />

        <div className="art-core">
          <Icon name="asignaciones" size={38} />
        </div>

        <div className="art-label people-label">
          <Icon name="empleados" />
          <span>Personas</span>
          <i />
        </div>

        <div className="art-label project-label">
          <Icon name="proyectos" />
          <span>Proyectos</span>
          <i />
        </div>

        <div className="art-label salary-label">
          <Icon name="salarios" />
          <span>Salarios</span>
          <i />
        </div>

        <span className="spark s1" />
        <span className="spark s2" />
      </div>
    </section>

    <div className="section-title">
      <div>
        <span className="eyebrow">TU ESPACIO DE GESTIÓN</span>
        <h2>¿Por dónde empezamos?</h2>
      </div>

      <span className="muted">4 secciones, un mismo equipo</span>
    </div>

    <div className="module-grid">
      {modules.map(m => (
        <button
          key={m.id}
          className={`module-card theme-${m.id}`}
          onClick={() => navigate(m.id)}
        >
          <div className="module-top">
            <span className="icon-tile">
              <Icon name={m.id} size={24} />
            </span>

            <span className="module-number">{m.n}</span>
          </div>

          <h3>{m.title}</h3>
          <p>{m.text}</p>

          <div className="module-value">
            {m.id === 'salarios' ? money(total) : data[m.id].length}

            <span>
              {m.id === 'salarios'
                ? 'suma de últimos registros'
                : m.id === 'asignaciones'
                  ? 'vínculos registrados'
                  : 'registros en total'}
            </span>
          </div>

          <span className="module-link">
            {m.button}
            <Icon name="arrow" size={18} />
          </span>
        </button>
      ))}
    </div>

    <div className="home-bottom">

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Últimos empleados registrados</h2>
            <p>Tu equipo sigue tomando forma.</p>
          </div>

          <button
            className="text-button"
            onClick={() => navigate('empleados')}
          >
            Ver todos
            <Icon name="arrow" size={16} />
          </button>
        </div>

        {data.empleados.length ? (
          <div className="recent-list">
            {data.empleados.slice(0, 4).map(e => (
              <div className="recent-person" key={e.id}>
                <Avatar name={e.nombre} />

                <div>
                  <strong>{e.nombre}</strong>
                  <span>{e.cargo}</span>
                </div>

                <span className="pill">{e.pais}</span>
              </div>
            ))}
          </div>
        ) : (
          <Empty
            icon="empleados"
            title="Aquí aparecerá tu equipo"
          >
            Comienza registrando tu primer empleado.
          </Empty>
        )}
      </section>

      <section className="getting-started">
        <span className="eyebrow">EN TRES PASOS</span>
        <h2>Del registro al equipo.</h2>

        <div>
          <span>1</span>
          <p>
            <strong>Registra empleados y proyectos</strong>
            La base de tu espacio de trabajo.
          </p>
        </div>

        <div>
          <span>2</span>
          <p>
            <strong>Conecta a las personas</strong>
            Asigna a cada empleado a sus proyectos.
          </p>
        </div>

        <div>
          <span>3</span>
          <p>
            <strong>Mantén sus salarios al día</strong>
            Guarda cada actualización con su fecha.
          </p>
        </div>
      </section>

    </div>
  </>
):