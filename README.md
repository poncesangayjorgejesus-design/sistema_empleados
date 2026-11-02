# NEXO – Sistema de Gestión de Empleados y Proyectos

Documentación y guía de instalación, configuración, ejecución y pruebas del proyecto.

## 1. ¿Qué es NEXO?

NEXO es un sistema web que permite administrar la información de los empleados y proyectos de una organización.

Con el sistema se puede:

- Registrar y consultar empleados.
- Crear y administrar proyectos.
- Asignar empleados a proyectos.
- Registrar y consultar salarios.

## 2. Tecnologías utilizadas

- **Frontend:** React, JavaScript, HTML y CSS.
- **Cliente HTTP:** Axios.
- **Backend:** Node.js y Express.
- **Base de datos:** MySQL.
- **Entorno local de base de datos:** XAMPP.
- **Control de versiones y colaboración:** Git y GitHub.
- **Editor recomendado:** Visual Studio Code.

## 3. Estructura del proyecto

```text
sistema_empleados/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── UI.js
│   │   ├── pages/
│   │   │   ├── Inicio.js
│   │   │   ├── Empleados.js
│   │   │   ├── Proyectos.js
│   │   │   ├── Asignaciones.js
│   │   │   └── Salarios.js
│   │   ├── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── server/
│   ├── tests/
│   │   └── validaciones.test.js
│   ├── app.js
│   ├── index.js
│   ├── validaciones.js
│   └── package.json
├── base_de_datos.sql
├── 1_INSTALAR_DEPENDENCIAS.bat
├── 2_INICIAR_SISTEMA.bat
└── README.md
```

**Descripción de las carpetas principales:**

- `client/src/pages/`: contiene las pantallas de cada módulo.
- `client/src/components/`: contiene componentes reutilizables de la interfaz.
- `client/src/api.js`: configura Axios para comunicarse con la API.
- `server/app.js`: define las rutas y operaciones de la API.
- `server/index.js`: configura la conexión con MySQL e inicia el servidor.
- `server/validaciones.js`: contiene las validaciones de los datos recibidos.
- `server/tests/`: contiene pruebas automatizadas de las validaciones.
- `base_de_datos.sql`: crea la base de datos y sus tablas.

## 4. Requisitos para utilizar el sistema

Antes de comenzar, instala:

1. **Node.js:** incluye npm, necesario para instalar y ejecutar el proyecto.
2. **XAMPP:** se utilizará para iniciar MySQL.
3. **Visual Studio Code:** recomendado para abrir el proyecto y utilizar la terminal.
4. **Git**, si se va a clonar el proyecto desde GitHub.

Puedes comprobar que Node.js y npm estén instalados ejecutando:

```bash
node -v
npm -v
```

## 5. Preparar la base de datos

1. Abre el Panel de Control de **XAMPP**.
2. Presiona **Start** en el módulo **MySQL**.
3. Abre tu navegador e ingresa a `http://localhost/phpmyadmin`.
4. Selecciona la opción **Importar**.
5. Busca el archivo `base_de_datos.sql`, ubicado en la carpeta principal del proyecto.
6. Presiona **Importar** o **Continuar**.

Se creará la base de datos `empleados`, que contiene las tablas necesarias para guardar empleados, proyectos, asignaciones y salarios.

> La configuración local del servidor utiliza MySQL en `localhost`, el usuario `root` y una contraseña vacía. Si tu instalación utiliza otros datos, debes modificarlos en `server/index.js`.

## 6. Instalar las dependencias

Las dependencias son los paquetes que necesita el proyecto para funcionar.

**Opción recomendada (Windows):**

1. Abre la carpeta principal `sistema_empleados`.
2. Ejecuta el archivo `1_INSTALAR_DEPENDENCIAS.bat`.
3. Espera a que termine la instalación.

El archivo instala automáticamente las dependencias del servidor y de la interfaz.

**Si prefieres hacerlo desde la terminal de Visual Studio Code:**

```bash
cd server
npm install
```

Luego:

```bash
cd ../client
npm install
```

Este procedimiento se realiza la primera vez que preparas el proyecto o cuando sea necesario reinstalar sus dependencias.

## 7. Iniciar NEXO

Antes de iniciar, asegúrate de que **MySQL esté encendido en XAMPP** y que hayas importado la base de datos.

**Opción recomendada (Windows):**

1. Abre la carpeta principal del proyecto.
2. Ejecuta `2_INICIAR_SISTEMA.bat`.
3. Se abrirán dos ventanas: una para el servidor y otra para la interfaz.
4. No cierres esas ventanas mientras utilices el sistema.

**Opción manual desde Visual Studio Code:**

Abre dos terminales.

**Terminal 1 – Servidor:**

```bash
cd server
npm start
```

El servidor se ejecuta en `http://localhost:3001`.

**Terminal 2 – Interfaz:**

```bash
cd client
npm start
```

React iniciará la aplicación. Abre en el navegador:

**http://localhost:3000**

¡Listo! Ya puedes utilizar NEXO.

## 8. Comprobar que funciona

Al ingresar al sistema, verifica que puedas:

1. Visualizar la pantalla principal.
2. Registrar un empleado.
3. Crear un proyecto.
4. Asignar un empleado a un proyecto.
5. Registrar un salario.
6. Consultar y modificar la información registrada.

Si los datos se guardan y aparecen al actualizar la página, la conexión con la base de datos está funcionando.

## 9. Problemas frecuentes

| Problema | Qué hacer |
|---|---|
| No se puede conectar al sistema | Comprueba que las dos ventanas (servidor e interfaz) sigan abiertas. |
| Error de conexión con MySQL | Inicia MySQL en XAMPP y verifica que importaste `base_de_datos.sql`. |
| `npm` no se reconoce | Instala Node.js y vuelve a abrir Visual Studio Code. En PowerShell puedes probar `npm.cmd`. |
| No se puede eliminar un empleado o proyecto | Comprueba si tiene asignaciones o salarios relacionados. Elimina primero esos registros relacionados. |

## 10. GitHub y publicación del proyecto

GitHub permite guardar el código, compartirlo con el equipo y mantener los cambios del proyecto.

Para descargar los últimos cambios de la rama principal:

```bash
git pull origin main
```

Para guardar y subir tus propios cambios:

```bash
git add .
git commit -m "Descripción de los cambios"
git push origin nombre-de-tu-rama
```

**Importante sobre el alojamiento:** GitHub almacena el código, pero GitHub Pages solo puede publicar la parte estática de la aplicación. Para que NEXO funcione en Internet también se necesita alojar el servidor Node.js y la base de datos MySQL en servicios compatibles, y configurar la conexión entre ellos. La configuración descrita en esta guía es para ejecutar el sistema localmente.

## 11. Cómo cerrar el sistema

Cuando termines de utilizar NEXO:

1. Presiona `Ctrl + C` en la terminal del servidor.
2. Presiona `Ctrl + C` en la terminal de la interfaz.
3. Si ya no necesitas la base de datos, puedes detener MySQL desde XAMPP.

---

**Nombre del proyecto:** NEXO – Sistema de Gestión de Empleados y Proyectos  
**Archivo de base de datos:** `base_de_datos.sql`  
**Frontend local:** `http://localhost:3000`  
**Backend local:** `http://localhost:3001`  
**Base de datos:** `empleados`