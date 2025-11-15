const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Content = require('../models/Content');

// Get all content (public)
router.get('/', async (req, res) => {
  try {
    const content = await Content.find();
    const contentObj = {};
    content.forEach(item => {
      contentObj[item.section] = {
        title: item.title,
        subtitle: item.subtitle,
        description: item.description,
        image: item.image,
        quote: item.quote,
        email: item.email,
        phone: item.phone,
        address: item.address,
        hours: item.hours,
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
    const content = await Content.findOne({ section: req.params.section });
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
    let content = await Content.findOne({ section: req.params.section });
    if (!content) {
      content = new Content({
        section: req.params.section,
        ...req.body
      });
    } else {
      Object.assign(content, req.body);
    }
    await content.save();
    res.json(content);
  } catch (error) {
    console.error('Error updating content:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Error updating content' });
  }
});

module.exports = router;