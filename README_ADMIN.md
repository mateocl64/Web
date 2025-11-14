# Panel de Administración de Movexa

Panel de administración completo desarrollado con Node.js + Express para gestionar el contenido del sitio web de Movexa.

## 🚀 Características

### Autenticación
- Login seguro con JWT (JSON Web Tokens)
- Tokens con expiración de 24 horas
- Passwords hasheados con bcryptjs
- Usuario por defecto: `admin` / `admin123`

### Backend API RESTful
- Express.js como framework
- CORS habilitado para comunicación frontend-backend
- Body parser para procesar JSON
- Middleware de autenticación en rutas protegidas
- Almacenamiento en archivos JSON (fácil migración a bases de datos)

### Endpoints de la API

#### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/verify` - Verificar token JWT

#### Servicios
- `GET /api/services` - Listar todos los servicios (público)
- `GET /api/services/:id` - Obtener un servicio específico (público)
- `POST /api/services` - Crear nuevo servicio (requiere autenticación)
- `PUT /api/services/:id` - Actualizar servicio (requiere autenticación)
- `DELETE /api/services/:id` - Eliminar servicio (requiere autenticación)

#### Contenido
- `GET /api/content` - Obtener todo el contenido (público)
- `GET /api/content/:section` - Obtener contenido de una sección (público)
- `PUT /api/content/:section` - Actualizar contenido de una sección (requiere autenticación)

### Frontend
- Dashboard con estadísticas en tiempo real
- Gestión completa de servicios (CRUD)
- Editor de contenido de secciones del sitio
- Interfaz moderna y responsive
- Sistema de notificaciones
- Modales para edición

## 📦 Instalación

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
```

Edita el archivo `.env` y configura las variables según tus necesidades:
```env
PORT=3000
JWT_SECRET=tu_clave_secreta_muy_segura_cambiar_esto_123456789
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
NODE_ENV=development
```

**⚠️ IMPORTANTE:** Cambia el `JWT_SECRET` y las credenciales de administrador en producción.

### 3. Iniciar el servidor

#### Modo desarrollo (con auto-reload)
```bash
npm run dev
```

#### Modo producción
```bash
npm start
```

### 4. Acceder al panel
Abre tu navegador y visita: `http://localhost:3000/admin`

## 📁 Estructura del proyecto

```
/
├── admin/                      # Frontend del panel de administración
│   ├── index.html             # Página de login
│   ├── dashboard.html         # Dashboard principal
│   ├── services.html          # Gestión de servicios
│   ├── content.html           # Gestión de contenido
│   ├── messages.html          # Visualización de mensajes
│   ├── css/
│   │   └── admin.css         # Estilos del panel
│   └── js/
│       └── admin.js          # Lógica JavaScript común
├── backend/                    # Backend Node.js
│   ├── server.js              # Servidor Express principal
│   ├── middleware/
│   │   └── auth.js           # Middleware de autenticación JWT
│   ├── routes/
│   │   ├── auth.js           # Rutas de autenticación
│   │   ├── services.js       # CRUD de servicios
│   │   └── content.js        # Gestión de contenido
│   └── data/                  # Datos (generados automáticamente)
│       ├── users.json        # Datos de usuarios
│       ├── services.json     # Datos de servicios
│       └── content.json      # Datos de contenido
├── img/                        # Imágenes del sitio público
├── estilos.css                # Estilos del sitio público
├── index.html                 # Página principal del sitio público
├── package.json               # Configuración de Node.js
├── .env.example               # Ejemplo de variables de entorno
├── .gitignore                 # Archivos a ignorar en git
└── README_ADMIN.md            # Esta documentación
```

## 🔐 Seguridad

- **JWT (JSON Web Tokens):** Tokens seguros para gestión de sesiones
- **Bcrypt:** Algoritmo de hash robusto para passwords
- **Variables de entorno:** Credenciales nunca en código fuente
- **Middleware de autenticación:** Protección de rutas sensibles
- **CORS configurado:** Control de acceso desde diferentes orígenes

## 🌐 Despliegue

Este panel es compatible con plataformas de hosting modernas:

### Vercel
1. Instala Vercel CLI: `npm i -g vercel`
2. Ejecuta: `vercel`
3. Sigue las instrucciones

### Render
1. Conecta tu repositorio de GitHub
2. Configura las variables de entorno
3. Despliega

### Railway
1. Conecta tu repositorio
2. Configura las variables de entorno
3. Railway detectará automáticamente Node.js

## 🔄 Migración a Base de Datos

El sistema actualmente usa archivos JSON para almacenar datos. Para migrar a una base de datos real (MongoDB, PostgreSQL, etc.):

1. Instala el driver correspondiente:
   - MongoDB: `npm install mongodb mongoose`
   - PostgreSQL: `npm install pg`

2. Modifica los archivos en `backend/routes/` para usar el nuevo driver en lugar de `fs` (filesystem)

3. Actualiza la estructura de datos según tu esquema de base de datos

## 📝 Notas importantes

- Los archivos JSON en `backend/data/` se generan automáticamente al iniciar el servidor
- **Cambia las credenciales por defecto antes de desplegar en producción**
- El sistema está preparado para escalar y migrar a bases de datos más robustas
- Todos los endpoints de escritura requieren autenticación JWT

## 🆘 Solución de problemas

### El servidor no inicia
- Verifica que todas las dependencias estén instaladas: `npm install`
- Asegúrate de que el puerto 3000 no esté en uso
- Revisa el archivo `.env` y que tenga todas las variables necesarias

### No puedo iniciar sesión
- Verifica que `ADMIN_USERNAME` y `ADMIN_PASSWORD` en `.env` sean correctos
- Las credenciales por defecto son: `admin` / `admin123`

### Los cambios no se guardan
- Verifica que la carpeta `backend/data/` exista y tenga permisos de escritura
- Revisa los logs del servidor para ver errores

## 📧 Soporte

Para problemas o sugerencias, contacta al equipo de desarrollo de Movexa.

---

**Movexa SA** - Especialistas en soluciones de prótesis modernas, humanas y confiables.
