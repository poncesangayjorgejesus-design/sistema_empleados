CREATE DATABASE IF NOT EXISTS empleados CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE empleados;

CREATE TABLE IF NOT EXISTS empleado (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  edad INT NOT NULL,
  pais VARCHAR(100) NOT NULL,
  cargo VARCHAR(100) NOT NULL,
  correo VARCHAR(150) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS proyectos (
  id INT NOT NULL AUTO_INCREMENT,
  nombre_proyecto VARCHAR(100) NOT NULL,
  descripcion TEXT NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS empleado_proyecto (
  empleado_id INT NOT NULL,
  proyecto_id INT NOT NULL,
  PRIMARY KEY (empleado_id, proyecto_id),
  KEY idx_ep_proyecto (proyecto_id),
  CONSTRAINT fk_ep_empleado FOREIGN KEY (empleado_id) REFERENCES empleado(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_ep_proyecto FOREIGN KEY (proyecto_id) REFERENCES proyectos(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;