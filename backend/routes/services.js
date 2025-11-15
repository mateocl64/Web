const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Service = require('../models/Service');

// Get all services (public)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ active: true }).populate('createdBy', 'username');
    res.json(services);
  } catch (error) {
    console.error('Error reading services:', error);
    res.status(500).json({ message: 'Error reading services' });
  }
});

// Get single service (public)
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('createdBy', 'username');
    
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
    const newService = new Service({
      ...req.body,
      createdBy: req.user.id
    });
    
    await newService.save();
    
    res.status(201).json(newService);
  } catch (error) {
    console.error('Error creating service:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Error creating service' });
  }
});

// Update service (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Error updating service' });
  }
});

// Delete service (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Error deleting service' });
  }
});

module.exports = router;