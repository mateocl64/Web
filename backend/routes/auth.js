const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const newUser = await User.create({ 
            username, 
            email: email || `${username}@movexa.com`,
            password,
            role: role || 'editor'
        });
        res.status(201).json({ 
            message: 'User created successfully',
            user: newUser.toJSON()
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
        }
        res.status(400).json({ error: error.message });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        
        // Update lastLogin
        user.lastLogin = new Date();
        await user.save();
        
        // Generar JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username,
                role: user.role 
            },
            process.env.JWT_SECRET || 'tu_clave_secreta_muy_segura_cambiala_en_produccion',
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );
        
        res.status(200).json({ 
            message: 'Login successful',
            token: token,
            user: user.toJSON()
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Verify token endpoint
router.get('/verify', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ 
            valid: true,
            user: user.toJSON()
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;