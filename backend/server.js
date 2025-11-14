const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const servicesRoutes = require('./routes/services');
const contentRoutes = require('./routes/content');
const profileRoutes = require('./routes/profile');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '..')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/profile', profileRoutes);

// Root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Movexa Admin Panel API',
    version: '1.0.0',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        verify: 'GET /api/auth/verify'
      },
      profile: {
        getProfile: 'GET /api/profile (auth required)',
        updateProfile: 'PUT /api/profile (auth required)',
        changePassword: 'PUT /api/profile/password (auth required)'
      },
      services: {
        getAll: 'GET /api/services',
        getOne: 'GET /api/services/:id',
        create: 'POST /api/services (auth required)',
        update: 'PUT /api/services/:id (auth required)',
        delete: 'DELETE /api/services/:id (auth required)'
      },
      content: {
        getAll: 'GET /api/content',
        getSection: 'GET /api/content/:section',
        updateSection: 'PUT /api/content/:section (auth required)'
      }
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Admin panel: http://localhost:${PORT}/admin`);
  console.log(`🌐 Public site: http://localhost:${PORT}`);
  console.log(`📊 API docs: http://localhost:${PORT}/api`);
});
