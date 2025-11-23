const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Service = require('../models/Service');
const User = require('../models/User');

// Get all services (public)
router.get('/', async (req, res) => {
  try {
    const services = await Service.findAll({ 
      where: { active: true },
      include: [{
        model: User,
        as: 'creator',
        attributes: ['username', 'email']
      }]
    });
    res.json(services);
  } catch (error) {
    console.error('Error reading services:', error);
    res.status(500).json({ message: 'Error reading services' });
  }
});

// Get single service (public)
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['username', 'email']
      }]
    });
    
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
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newService = await Service.create({
      ...req.body,
      createdBy: req.user.id
    });
    
    res.status(201).json(newService);
  } catch (error) {
    console.error('Error creating service:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Error creating service' });
  }
});

// Update service (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    await service.update(req.body);
    
    res.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Error updating service' });
  }
});

// Delete service (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    await service.destroy();
    
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Error deleting service' });
  }
});

module.exports = router;