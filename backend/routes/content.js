const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/auth');

const contentFilePath = path.join(__dirname, '../data/content.json');

// Initialize content file if it doesn't exist
const initializeContent = () => {
  if (!fs.existsSync(contentFilePath)) {
    const content = {
      hero: {
        title: 'Bienvenidos a Movexa',
        subtitle: 'Especialistas en soluciones de prótesis modernas, humanas y confiables.',
        image: 'img/protesis.jpg',
        updatedAt: new Date().toISOString()
      },
      about: {
        title: 'Nosotros',
        description: 'Somos un equipo de profesionales comprometidos con mejorar la calidad de vida de las personas a través de soluciones protésicas de última generación.',
        image: 'img/nosotros.png',
        quote: 'Restaurar movilidad es devolver libertad.',
        updatedAt: new Date().toISOString()
      },
      contact: {
        title: 'Contacto',
        description: '¿Tienes preguntas? Envíanos un mensaje directamente.',
        email: 'msas@movexa.com',
        phone: '+57 300 123 4567',
        address: 'Medellín, Colombia',
        hours: 'Lunes a Sábado: 8:00 a.m. - 8:00 p.m.',
        quote: 'Tu bienestar es nuestra prioridad.',
        updatedAt: new Date().toISOString()
      }
    };
    fs.writeFileSync(contentFilePath, JSON.stringify(content, null, 2));
  }
};

initializeContent();

// Get all content (public)
router.get('/', (req, res) => {
  try {
    const content = JSON.parse(fs.readFileSync(contentFilePath, 'utf8'));
    res.json(content);
  } catch (error) {
    console.error('Error reading content:', error);
    res.status(500).json({ message: 'Error reading content' });
  }
});

// Get specific section content (public)
router.get('/:section', (req, res) => {
  try {
    const content = JSON.parse(fs.readFileSync(contentFilePath, 'utf8'));
    const section = content[req.params.section];
    
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    
    res.json(section);
  } catch (error) {
    console.error('Error reading content section:', error);
    res.status(500).json({ message: 'Error reading content section' });
  }
});

// Update section content (protected)
router.put('/:section', authMiddleware, (req, res) => {
  try {
    const content = JSON.parse(fs.readFileSync(contentFilePath, 'utf8'));
    
    if (!content[req.params.section]) {
      return res.status(404).json({ message: 'Section not found' });
    }
    
    content[req.params.section] = {
      ...content[req.params.section],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(contentFilePath, JSON.stringify(content, null, 2));
    res.json(content[req.params.section]);
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ message: 'Error updating content' });
  }
});

module.exports = router;
