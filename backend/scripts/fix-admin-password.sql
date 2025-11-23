-- Arreglar contraseña del admin
-- Usuario: admin
-- Password: admin123

USE movexa_db;

-- Actualizar la contraseña del usuario admin
UPDATE users 
SET password = '$2a$10$CwTycUXWue0Thq9StjUM0uJ8qV8w5J3z0eqF5J3eZQzJl8J3hQZ7u'
WHERE username = 'admin';

-- Verificar
SELECT username, email, role FROM users WHERE username = 'admin';
