# Instrucciones de Migración a MySQL (XAMPP)

## ✅ Migración completada de MongoDB a MySQL

Este proyecto ahora usa **MySQL** con **Sequelize ORM** en lugar de MongoDB con Mongoose.

---

## 📋 Pasos para configurar la base de datos

### 1. Iniciar XAMPP
- Abre el panel de control de XAMPP
- Inicia los servicios **Apache** y **MySQL**

### 2. Crear la base de datos
Tienes dos opciones:

#### Opción A: Usando phpMyAdmin (Recomendado)
1. Abre tu navegador y ve a: `http://localhost/phpmyadmin`
2. Ve a la pestaña **SQL**
3. Copia y pega el contenido del archivo `backend/scripts/setup-database.sql`
4. Haz clic en **Continuar** para ejecutar el script

#### Opción B: Usando MySQL Workbench o línea de comandos
```bash
mysql -u root -p < backend/scripts/setup-database.sql
```

### 3. Configurar variables de entorno
1. Copia el archivo `.env.example` a `.env`:
```bash
copy .env.example .env
```

2. Edita el archivo `.env` si necesitas cambiar alguna configuración:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=movexa_db
DB_USER=root
DB_PASSWORD=
```

### 4. Instalar dependencias
```bash
npm install
```

### 5. Crear usuario administrador (Opcional)
Si prefieres crear el usuario admin desde Node.js:
```bash
npm run setup
```

### 6. Iniciar el servidor
```bash
npm start
```

O en modo desarrollo:
```bash
npm run dev
```

---

## 🔑 Credenciales por defecto

**Usuario:** admin  
**Email:** admin@movexa.com  
**Password:** admin123

> ⚠️ **IMPORTANTE:** Cambia la contraseña después del primer login

---

## 📊 Estructura de la base de datos

### Tabla: `users`
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- username (VARCHAR 50, UNIQUE)
- email (VARCHAR 100, UNIQUE)
- password (VARCHAR 255, hasheado con bcrypt)
- role (ENUM: 'admin', 'editor')
- lastLogin (DATETIME)
- createdAt (DATETIME)
- updatedAt (DATETIME)

### Tabla: `services`
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- title (VARCHAR 100)
- description (VARCHAR 500)
- icon (VARCHAR 100)
- category (VARCHAR 50)
- active (BOOLEAN)
- createdBy (INT, FOREIGN KEY -> users.id)
- createdAt (DATETIME)
- updatedAt (DATETIME)

### Tabla: `contents`
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- section (VARCHAR 50, UNIQUE)
- title (VARCHAR 255)
- subtitle (VARCHAR 255)
- text (TEXT)
- buttonText (VARCHAR 100)
- image (VARCHAR 255)
- data (JSON)
- lastUpdatedBy (INT, FOREIGN KEY -> users.id)
- createdAt (DATETIME)
- updatedAt (DATETIME)

---

## 🚀 Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión

### Perfil
- `GET /api/profile` - Obtener perfil (requiere autenticación)
- `PUT /api/profile` - Actualizar perfil (requiere autenticación)
- `PUT /api/profile/password` - Cambiar contraseña (requiere autenticación)

### Servicios
- `GET /api/services` - Obtener todos los servicios
- `GET /api/services/:id` - Obtener un servicio específico
- `POST /api/services` - Crear servicio (requiere autenticación)
- `PUT /api/services/:id` - Actualizar servicio (requiere autenticación)
- `DELETE /api/services/:id` - Eliminar servicio (requiere autenticación)

### Contenido
- `GET /api/content` - Obtener todo el contenido
- `GET /api/content/:section` - Obtener contenido de una sección
- `PUT /api/content/:section` - Actualizar contenido (requiere autenticación)

---

## 🔧 Diferencias principales con MongoDB

### Antes (MongoDB/Mongoose):
```javascript
const user = await User.findOne({ username });
const services = await Service.find({ active: true });
const service = await Service.findById(id);
```

### Ahora (MySQL/Sequelize):
```javascript
const user = await User.findOne({ where: { username } });
const services = await Service.findAll({ where: { active: true } });
const service = await Service.findByPk(id);
```

---

## 📝 Notas adicionales

- El servidor se sincroniza automáticamente con la base de datos al iniciar
- Los timestamps (createdAt, updatedAt) se manejan automáticamente
- Las contraseñas se hashean automáticamente con bcrypt antes de guardarlas
- Las relaciones entre tablas se manejan mediante foreign keys
- Se usa JSON para campos con datos dinámicos (en la tabla contents)

---

## 🐛 Solución de problemas

### Error: "Unable to connect to the database"
- Verifica que XAMPP esté corriendo
- Verifica que MySQL esté iniciado
- Verifica las credenciales en el archivo `.env`

### Error: "Table doesn't exist"
- Ejecuta el script `setup-database.sql` en phpMyAdmin
- O ejecuta `npm run setup`

### Error: "Access denied for user"
- Verifica el usuario y contraseña en `.env`
- Por defecto XAMPP usa usuario `root` sin contraseña

---

¡Listo! Tu aplicación ahora usa MySQL con XAMPP 🎉
