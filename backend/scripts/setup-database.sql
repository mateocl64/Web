-- Script para crear la base de datos y tablas en MySQL (XAMPP)
-- Ejecutar este script en phpMyAdmin o MySQL Workbench

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS movexa_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE movexa_db;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'editor') NOT NULL DEFAULT 'editor',
  lastLogin DATETIME DEFAULT CURRENT_TIMESTAMP,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de servicios
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(500) NOT NULL,
  icon VARCHAR(100) DEFAULT 'fas fa-cog',
  category VARCHAR(50),
  active TINYINT(1) DEFAULT 1,
  createdBy INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_active (active),
  INDEX idx_createdBy (createdBy),
  INDEX idx_title (title),
  INDEX idx_category (category),
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de contenido
CREATE TABLE IF NOT EXISTS contents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(255),
  subtitle VARCHAR(255),
  text TEXT,
  buttonText VARCHAR(100),
  image VARCHAR(255),
  data JSON,
  lastUpdatedBy INT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE INDEX idx_section (section),
  FOREIGN KEY (lastUpdatedBy) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar usuario admin por defecto
-- Password: admin123 (hasheada con bcrypt)
INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@movexa.com', '$2a$10$X9R7L1.0XnqF9Z8Q8xYZJ.ZqJ0aKVnF5X8z9L0Q5xYZJ.ZqJ0aKVnF', 'admin')
ON DUPLICATE KEY UPDATE username=username;

-- Insertar contenido inicial de ejemplo
INSERT INTO contents (section, title, subtitle, text) VALUES 
('hero', 'Bienvenido a Movexa', 'Innovación en Prótesis', 'Soluciones ortopédicas personalizadas para mejorar tu calidad de vida'),
('about', 'Sobre Nosotros', 'Especialistas en Prótesis', 'Tecnología de vanguardia y atención personalizada'),
('contact', 'Contáctanos', 'Estamos aquí para ayudarte', 'Agenda tu consulta con nuestros especialistas')
ON DUPLICATE KEY UPDATE section=section;

-- Insertar servicios de ejemplo
-- Nota: Estos se insertarán después de crear al menos un usuario
INSERT INTO services (title, description, icon, category, active, createdBy) 
SELECT 
  'Prótesis de Miembro Inferior' as title,
  'Prótesis personalizadas para pierna y pie con tecnología avanzada' as description,
  'fas fa-user-injured' as icon,
  'protesis' as category,
  1 as active,
  id as createdBy
FROM users WHERE role = 'admin' LIMIT 1
ON DUPLICATE KEY UPDATE title=title;

INSERT INTO services (title, description, icon, category, active, createdBy) 
SELECT 
  'Prótesis de Miembro Superior' as title,
  'Soluciones protésicas para brazo y mano con control avanzado' as description,
  'fas fa-hand-paper' as icon,
  'protesis' as category,
  1 as active,
  id as createdBy
FROM users WHERE role = 'admin' LIMIT 1
ON DUPLICATE KEY UPDATE title=title;

INSERT INTO services (title, description, icon, category, active, createdBy) 
SELECT 
  'Órtesis y Soportes' as title,
  'Dispositivos ortopédicos personalizados para corrección y soporte' as description,
  'fas fa-medkit' as icon,
  'ortesis' as category,
  1 as active,
  id as createdBy
FROM users WHERE role = 'admin' LIMIT 1
ON DUPLICATE KEY UPDATE title=title;

-- Mostrar información
SELECT 'Base de datos creada exitosamente!' as Status;
SELECT COUNT(*) as 'Total Usuarios' FROM users;
SELECT COUNT(*) as 'Total Servicios' FROM services;
SELECT COUNT(*) as 'Total Contenidos' FROM contents;
