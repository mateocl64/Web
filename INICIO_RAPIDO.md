# 🚀 Guía Rápida de Inicio - XAMPP + MySQL

## Requisitos previos
- ✅ XAMPP instalado
- ✅ Node.js instalado

## 🎯 Instalación rápida (5 pasos)

### 1️⃣ Iniciar XAMPP
Abre el panel de control de XAMPP y arranca:
- ✅ Apache
- ✅ MySQL

### 2️⃣ Crear la base de datos
1. Ve a [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
2. Haz clic en la pestaña **SQL**
3. Copia y pega TODO el contenido del archivo: `backend/scripts/setup-database.sql`
4. Haz clic en **Continuar**

### 3️⃣ Configurar variables de entorno
Copia el archivo de ejemplo y renómbralo:
```bash
copy .env.example .env
```

El archivo `.env` ya está configurado para XAMPP por defecto:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=movexa_db
DB_USER=root
DB_PASSWORD=
```

### 4️⃣ Instalar dependencias
```bash
npm install
```

### 5️⃣ Iniciar el servidor
```bash
npm start
```

O en modo desarrollo con auto-reload:
```bash
npm run dev
```

---

## 🎉 ¡Listo!

### 🌐 Accede a tu aplicación:
- **Sitio público:** http://localhost:3000
- **Panel de admin:** http://localhost:3000/admin
- **API:** http://localhost:3000/api

### 🔐 Credenciales por defecto:
- **Usuario:** admin
- **Contraseña:** admin123

> ⚠️ **IMPORTANTE:** Cambia la contraseña después del primer login

---

## 📊 Verificar que todo funciona

### Verificar la base de datos:
1. Ve a [phpMyAdmin](http://localhost/phpmyadmin)
2. Selecciona la base de datos `movexa_db`
3. Deberías ver 3 tablas: `users`, `services`, `contents`

### Probar la API:
Abre tu navegador y ve a: http://localhost:3000/api

Deberías ver la documentación de la API.

---

## 🔧 Comandos disponibles

```bash
npm start        # Iniciar servidor
npm run dev      # Servidor en modo desarrollo
npm run setup    # Crear usuario admin desde Node.js
```

---

## ❓ Problemas comunes

### "Error: connect ECONNREFUSED"
→ Verifica que MySQL esté corriendo en XAMPP

### "ER_BAD_DB_ERROR: Unknown database"
→ Ejecuta el script SQL en phpMyAdmin (paso 2)

### "Access denied for user 'root'"
→ Por defecto XAMPP usa usuario `root` sin contraseña. Si cambiaste esto, actualiza el archivo `.env`

---

## 📁 Estructura de archivos importantes

```
Web/
├── backend/
│   ├── config/
│   │   └── database.js          # Configuración MySQL/Sequelize
│   ├── models/
│   │   ├── User.js              # Modelo de usuario
│   │   ├── Service.js           # Modelo de servicio
│   │   ├── Content.js           # Modelo de contenido
│   │   └── index.js             # Relaciones entre modelos
│   ├── routes/
│   │   ├── auth.js              # Rutas de autenticación
│   │   ├── services.js          # Rutas de servicios
│   │   ├── content.js           # Rutas de contenido
│   │   └── profile.js           # Rutas de perfil
│   ├── scripts/
│   │   ├── setup-database.sql   # Script SQL inicial
│   │   └── createAdmin.js       # Crear admin desde Node
│   └── server.js                # Servidor Express
├── admin/                       # Panel de administración
├── .env                         # Variables de entorno (CREAR ESTE)
├── .env.example                 # Ejemplo de variables
└── package.json
```

---

¿Necesitas más ayuda? Consulta el archivo `MIGRATION_GUIDE.md` para detalles técnicos completos.
