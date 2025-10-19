-- 1. Crear la base de datos
CREATE DATABASE IF NOT EXISTS todo_app;

-- 2. Usar la base de datos
USE todo_app;

-- 3. Crear la tabla 'tasks'
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);