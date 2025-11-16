# 🎨 Movexa Frontend - Documentación

## Descripción General

Frontend profesional y moderno para Movexa, empresa especializada en soluciones de prótesis médicas. El sitio cuenta con diseño responsive, animaciones fluidas y conexión dinámica con MongoDB para carga de contenido.

## 🚀 Características Principales

### Diseño Moderno
- **Gradientes Animados**: Hero section con gradiente purple-blue moderno
- **Glassmorphism**: Efectos de vidrio esmerilado en elementos clave
- **Typography Profesional**: Google Fonts (Poppins para títulos, Inter para texto)
- **Paleta de Colores**: #667eea (primary), #764ba2 (secondary), #f093fb (accent)
- **Sombras y Depth**: Box-shadows profesionales para profundidad visual

### Responsive Design
- **Mobile-First**: Diseño optimizado para dispositivos móviles primero
- **Breakpoints**:
  - 640px: Tablets pequeñas
  - 768px: Tablets
  - 1024px: Desktop
  - 1280px: Desktop grande
- **Mobile Menu**: Toggle menu para navegación móvil

### Conexión MongoDB
- Carga dinámica de servicios desde `/api/services`
- Carga dinámica de contenido desde `/api/content`
- Error handling con mensajes amigables
- Loading states durante la carga

### UX/UI Enhancements
- **Smooth Scroll**: Navegación suave entre secciones
- **Fade-in Animations**: Elementos aparecen al hacer scroll
- **Hover Effects**: Efectos visuales en cards y links
- **CTA Buttons**: Botones de llamada a la acción destacados

## 📁 Estructura de Archivos

```
/
├── index.html          # Página principal
├── estilos.css         # Estilos CSS modernos
├── js/
│   └── main.js         # JavaScript para funcionalidad dinámica
└── img/                # Imágenes del sitio
```

## 🎨 Estilos CSS (estilos.css)

### Variables CSS
```css
:root {
  --primary: #667eea;
  --secondary: #764ba2;
  --accent: #f093fb;
  --dark: #1a202c;
  --gray: #718096;
  --light: #f7fafc;
  --white: #ffffff;
  --gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Secciones Principales
- **Header**: Sticky header con navegación
- **Hero Section**: Full viewport height con gradiente animado
- **About Section**: Layout de 2 columnas
- **Services Section**: Grid adaptativo (1-3 columnas)
- **Contact Section**: Formulario estilizado
- **Footer**: Footer oscuro con 3 columnas de información

## 📜 JavaScript (js/main.js)

### Funciones Principales

#### `loadServices()`
Carga servicios dinámicamente desde la API MongoDB.
```javascript
async function loadServices() {
  const response = await fetch(`${API_BASE}/api/services`);
  const services = await response.json();
  renderServices(services);
}
```

#### `loadContent()`
Carga contenido dinámico (hero, about, contact) desde la API.
```javascript
async function loadContent() {
  const response = await fetch(`${API_BASE}/api/content`);
  const content = await response.json();
  updateHero(content.hero);
  updateAbout(content.about);
  updateContact(content.contact);
}
```

#### `initSmoothScroll()`
Implementa smooth scrolling para navegación entre secciones.

#### `observeElements()`
Utiliza Intersection Observer para animaciones on-scroll.

### Seguridad
- **Escape HTML**: Prevención de XSS con `escapeHtml()`
- **Error Handling**: Manejo robusto de errores de red
- **Validación**: Validación de datos antes de renderizar

## 🔌 API Endpoints

### Servicios
```
GET /api/services
```
Respuesta esperada:
```json
[
  {
    "_id": "...",
    "title": "Prótesis Personalizadas",
    "description": "Diseñadas para adaptarse...",
    "icon": "fas fa-cog",
    "active": true
  }
]
```

### Contenido
```
GET /api/content
```
Respuesta esperada:
```json
{
  "hero": {
    "title": "Bienvenidos a Movexa",
    "subtitle": "Especialistas en...",
    "image": "img/hero.jpg"
  },
  "about": {
    "title": "Nosotros",
    "text": "Somos un equipo...",
    "data": {
      "quote": "Restaurar movilidad..."
    }
  },
  "contact": {
    "data": {
      "email": "msas@movexa.com",
      "phone": "+57 300 123 4567",
      "address": "Medellín, Colombia",
      "hours": "Lunes a Sábado: 8:00 a.m. - 8:00 p.m."
    }
  }
}
```

## 📱 Responsive Testing

### Desktop (1280px+)
- Hero: 100vh height
- Services: Grid de 3 columnas
- Footer: 3 columnas

### Tablet (768px - 1024px)
- Hero: 100vh height
- Services: Grid de 2 columnas
- Footer: 2 columnas

### Mobile (< 768px)
- Hero: 70vh height
- Services: 1 columna
- Footer: 1 columna
- Mobile menu toggle visible

## 🎯 SEO Optimización

### Meta Tags
```html
<!-- Basic Meta -->
<title>Movexa - Prótesis Médicas Modernas y Confiables</title>
<meta name="description" content="..." />
<meta name="keywords" content="..." />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
```

## 🔧 Instalación y Uso

### Requisitos
- Node.js (para backend)
- MongoDB (local o Atlas)

### Iniciar el Servidor
```bash
cd backend
npm install
npm start
```

El servidor correrá en `http://localhost:3000`

### Desarrollo Local
1. Modificar archivos HTML/CSS/JS según necesidad
2. Recargar el navegador para ver cambios
3. Para cambios en backend, reiniciar servidor

## 🎨 Personalización

### Cambiar Colores
Editar variables CSS en `estilos.css`:
```css
:root {
  --primary: #TU_COLOR_PRIMARIO;
  --secondary: #TU_COLOR_SECUNDARIO;
  /* ... */
}
```

### Modificar Tipografía
Cambiar en `estilos.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=TU_FUENTE');

:root {
  --font-heading: 'TU_FUENTE', sans-serif;
  --font-body: 'TU_FUENTE', sans-serif;
}
```

### Agregar Secciones
1. Agregar HTML en `index.html`
2. Agregar estilos correspondientes en `estilos.css`
3. Si requiere interactividad, agregar código en `js/main.js`

## 🐛 Troubleshooting

### Los servicios no cargan
- Verificar que el backend esté corriendo
- Verificar que MongoDB esté conectado
- Revisar la consola del navegador para errores

### Las fuentes no se cargan
- Verificar conexión a internet
- Verificar que Google Fonts esté accesible
- Usar fuentes locales como fallback

### Animaciones no funcionan
- Verificar que `js/main.js` esté cargado
- Revisar la consola del navegador
- Verificar compatibilidad del navegador con Intersection Observer

## 📞 Soporte

Para problemas o preguntas:
- Email: msas@movexa.com
- WhatsApp: +57 300 123 4567

## 📝 Licencia

© 2025 Movexa SA. Todos los derechos reservados.
