const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const usersFilePath = path.join(__dirname, '../data/users.json');

// Initialize users file if it doesn't exist
const initializeUsers = () => {
  if (!fs.existsSync(usersFilePath)) {
    const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);
    const users = [
      {
        id: 1,
        username: process.env.ADMIN_USERNAME || 'admin',
        password: hashedPassword,
        role: 'admin'
      }
    ];
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  }
};

initializeUsers();

// Login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    const userIndex = users.findIndex(u => u.username === username);

    if (userIndex === -1) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[userIndex];
    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update lastLogin timestamp
    users[userIndex].lastLogin = new Date().toISOString();
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Verify token endpoint
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, message: 'Invalid or expired token' });
  }
});

// Register endpoint
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // Validate required fields
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  // Validate username length
  if (username.length < 3) {
    return res.status(400).json({ message: 'Username must be at least 3 characters' });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));

    // Check if username already exists
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Check if email already exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Generate new user ID
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create new user
    const now = new Date().toISOString();
    const newUser = {
      id: newId,
      username,
      email,
      password: hashedPassword,
      role: 'editor',
      createdAt: now,
      lastLogin: now
    };

    // Add user to array
    users.push(newUser);

    // Save to file
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    // Return success response (without password)
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
