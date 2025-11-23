const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Content = require('../models/Content');

// Get all content (public)
router.get('/', async (req, res) => {
  try {
    const content = await Content.findAll();
    const contentObj = {};
    content.forEach(item => {
      contentObj[item.section] = {
        title: item.title,
        subtitle: item.subtitle,
        text: item.text,
        buttonText: item.buttonText,
        image: item.image,
        data: item.data,
        updatedAt: item.updatedAt
      };
    });
    res.json(contentObj);
  } catch (error) {
    console.error('Error reading content:', error);
    res.status(500).json({ message: 'Error reading content' });
  }
});

// Get specific section content (public)
router.get('/:section', async (req, res) => {
  try {
    const content = await Content.findOne({ where: { section: req.params.section } });
    if (!content) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json(content);
  } catch (error) {
    console.error('Error reading content section:', error);
    res.status(500).json({ message: 'Error reading content section' });
  }
});

// Update section content (protected)
router.put('/:section', authMiddleware, async (req, res) => {
  try {
    let content = await Content.findOne({ where: { section: req.params.section } });
    
    if (!content) {
      content = await Content.create({
        section: req.params.section,
        ...req.body,
        lastUpdatedBy: req.user.id
      });
    } else {
      await content.update({
        ...req.body,
        lastUpdatedBy: req.user.id
      });
    }
    
    res.json(content);
  } catch (error) {
    console.error('Error updating content:', error);
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Error updating content' });
  }
});

module.exports = router;