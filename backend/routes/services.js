const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/auth');

const servicesFilePath = path.join(__dirname, '../data/services.json');

// Initialize services file if it doesn't exist
const initializeServices = () => {
  if (!fs.existsSync(servicesFilePath)) {
    const services = [
      {
        id: 1,
        title: 'Prótesis Personalizadas',
        description: 'Diseñadas para adaptarse perfectamente a cada paciente.',
        image: 'img/protesiscustom.jpg',
        details: 'Nuestras prótesis personalizadas utilizan tecnología de punta para garantizar comodidad y funcionalidad óptima.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Rehabilitación',
        description: 'Acompañamiento integral en el proceso de adaptación.',
        image: 'img/rehab.jpg',
        details: 'Programa de rehabilitación completo con profesionales especializados para asegurar una adaptación exitosa.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Asesoramiento',
        description: 'Te guiamos para que tomes la mejor decisión en tu tratamiento.',
        image: 'img/guía.jpg',
        details: 'Asesoría personalizada para ayudarte a elegir la mejor solución protésica según tus necesidades.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    fs.writeFileSync(servicesFilePath, JSON.stringify(services, null, 2));
  }
};

initializeServices();

// Get all services (public)
router.get('/', (req, res) => {
  try {
    const services = JSON.parse(fs.readFileSync(servicesFilePath, 'utf8'));
    res.json(services);
  } catch (error) {
    console.error('Error reading services:', error);
    res.status(500).json({ message: 'Error reading services' });
  }
});

// Get single service (public)
router.get('/:id', (req, res) => {
  try {
    const services = JSON.parse(fs.readFileSync(servicesFilePath, 'utf8'));
    const service = services.find(s => s.id === parseInt(req.params.id));
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    console.error('Error reading service:', error);
    res.status(500).json({ message: 'Error reading service' });
  }
});

// Create service (protected)
router.post('/', authMiddleware, (req, res) => {
  try {
    const services = JSON.parse(fs.readFileSync(servicesFilePath, 'utf8'));
    const newService = {
      id: services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    services.push(newService);
    fs.writeFileSync(servicesFilePath, JSON.stringify(services, null, 2));
    
    res.status(201).json(newService);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Error creating service' });
  }
});

// Update service (protected)
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const services = JSON.parse(fs.readFileSync(servicesFilePath, 'utf8'));
    const index = services.findIndex(s => s.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    services[index] = {
      ...services[index],
      ...req.body,
      id: services[index].id,
      createdAt: services[index].createdAt,
      updatedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(servicesFilePath, JSON.stringify(services, null, 2));
    res.json(services[index]);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Error updating service' });
  }
});

// Delete service (protected)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const services = JSON.parse(fs.readFileSync(servicesFilePath, 'utf8'));
    const filteredServices = services.filter(s => s.id !== parseInt(req.params.id));
    
    if (services.length === filteredServices.length) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    fs.writeFileSync(servicesFilePath, JSON.stringify(filteredServices, null, 2));
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Error deleting service' });
  }
});

module.exports = router;
