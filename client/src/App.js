import './App.css';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function App() {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('0');
  const [pais, setPais] = useState('');
  const [cargo, setCargo] = useState('');
  const [correo, setCorreo] = useState('');
  const [id, setId] = useState();
  
  const [editar, setEditar] = useState(false);
  const [empleadosList, setEmpleadosList] = useState([]);

  const add = () => {
    Axios.post('http://localhost:3001/create', {
      nombre: nombre,
      edad: edad,
      pais: pais, 
      cargo: cargo,
      correo: correo
    }).then(() => {
      getEmpleados();
      limpiarCampos();
      cancelar();
      MySwal.fire({
        title: 'Registro Exitoso',
        text: 'El empleado ha sido registrado correctamente.',
        icon: 'success',
      });
    });
  };

  const update = () => {
    Axios.put('http://localhost:3001/update', {
      id: id,
      nombre: nombre,
      edad: edad,
      pais: pais, 
      cargo: cargo,
      correo: correo
    }).then(() => {
      getEmpleados();
      limpiarCampos();
      cancelar();
      MySwal.fire({
        title: 'Actualización Exitosa',
        text: 'El empleado ha sido actualizado correctamente.',
        icon: 'success',
      });
    });
  };

  // 📌 AQUÍ COLOCAS LA FUNCIÓN DELETE QUE COMPARTISTE
  const deleteEmple = (id, nombre) => {
    MySwal.fire({
      title: "¿Eliminar?",
      text: `¿Desea eliminar a ${nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/delete/${id}`).then(() => {
          getEmpleados();
          limpiarCampos();
          MySwal.fire({
            title: "Eliminado",
            text: `${nombre} ha sido eliminado.`,
            icon: "success"
          });
        });
      }
    });
  };

  const cancelar = () => {
    setEditar(false);
    setNombre('');
    setEdad('0');
    setPais('');
    setCargo('');
    setCorreo('');
    setId('');
  };

  const editarEmpleado = (val) => {
    setEditar(true);
    setNombre(val.nombre);
    setEdad(val.edad);
    setPais(val.pais);
    setCargo(val.cargo);
    setCorreo(val.correo);
    setId(val.id);
  };

  const limpiarCampos = () => {
    setNombre('');
    setEdad('');
    setPais('');
    setCargo('');
    setCorreo('');
  };

  const getEmpleados = () => {
    Axios.get('http://localhost:3001/empleados').then((response) => {
      setEmpleadosList(response.data);
    });
  };

  useEffect(() => {
    getEmpleados();
  }, []);

  return (
    <div className="container">
      <div className="card text-center mt-5">
        <div className="card-header">
          Gestión de Empleados
        </div>
        <div className="card-body">

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Nombre_:</span>
            <input type="text"
              value={nombre}
              onChange={(event) => {
                setNombre(event.target.value)
              }}
              className="form-control" placeholder="Ingresar Nombre" aria-label="Username" aria-describedby="basic-addon1" />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Edad____:</span>
            <input type="number"
              value={edad}
              onChange={(event) => {
                setEdad(event.target.value)
              }}
              className="form-control" placeholder="Ingresar Edad" aria-label="Username" aria-describedby="basic-addon1" />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Pais_____:</span>
            <input type="text"
              value={pais}
              onChange={(event) => {
                setPais(event.target.value)
              }}
              className="form-control" placeholder="Ingresar Pais" aria-label="Username" aria-describedby="basic-addon1" />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Cargo___:</span>
            <input type="text"
              value={cargo}
              onChange={(event) => {
                setCargo(event.target.value)
              }}
              className="form-control" placeholder="Ingresar Cargo" aria-label="Username" aria-describedby="basic-addon1" />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Correo___:</span>
            <input type="text"
              value={correo}
              onChange={(event) => {
                setCorreo(event.target.value)
              }}
              className="form-control" placeholder="Ingresar Correo" aria-label="Username" aria-describedby="basic-addon1" />
          </div>
        </div>
            
        <div className="card-footer text-muted">
          {
            editar ?
            <div>
              <button className="btn btn-success m-2" onClick={update}>Actualizar</button>
              <button className="btn btn-danger m-2" onClick={cancelar}>Cancelar</button>
            </div>
            :
            <button className="btn btn-success" onClick={add}>Registrar</button>
          }
        </div>
      </div>

      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Edad</th>
            <th scope="col">Pais</th>
            <th scope="col">Cargo</th>
            <th scope="col">Correo</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {
            empleadosList.map((val, key) => {
              return (
                <tr key={key}>
                  <td>{val.id}</td>
                  <td>{val.nombre}</td>
                  <td>{val.edad}</td>
                  <td>{val.pais}</td>
                  <td>{val.cargo}</td>
                  <td>{val.correo}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <button type="button"
                        onClick={() => {
                          editarEmpleado(val);
                        }}
                        className="btn btn-warning">Editar</button>
                      
                      {}
                      <button type="button"
                        onClick={() => {
                          deleteEmple(val.id, val.nombre);
                        }}
                        className="btn btn-danger">Eliminar</button>
                    </div>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  );
}

export default App;