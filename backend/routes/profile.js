const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/auth');

const usersFilePath = path.join(__dirname, '../data/users.json');

// Get current user profile
router.get('/', authMiddleware, (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data without password
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user profile
router.put('/', authMiddleware, (req, res) => {
  const { username, email } = req.body;

  // Validate that at least one field is provided
  if (!username && !email) {
    return res.status(400).json({ message: 'At least one field (username or email) is required' });
  }

  try {
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    const userIndex = users.findIndex(u => u.id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate username if provided
    if (username) {
      if (username.length < 3) {
        return res.status(400).json({ message: 'Username must be at least 3 characters' });
      }

      // Check if username is already taken by another user
      const existingUser = users.find(u => u.username === username && u.id !== req.user.id);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      users[userIndex].username = username;
    }

    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      // Check if email is already taken by another user
      const existingUser = users.find(u => u.email === email && u.id !== req.user.id);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      users[userIndex].email = email;
    }

    // Save changes
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    // Return updated user data without password
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: users[userIndex].id,
        username: users[userIndex].username,
        email: users[userIndex].email,
        role: users[userIndex].role,
        createdAt: users[userIndex].createdAt,
        lastLogin: users[userIndex].lastLogin
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Change password
router.put('/password', authMiddleware, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Validate required fields
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current password and new password are required' });
  }

  // Validate new password length
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }

  try {
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    const userIndex = users.findIndex(u => u.id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[userIndex];

    // Verify current password
    const isValidPassword = bcrypt.compareSync(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    users[userIndex].password = hashedPassword;

    // Save changes
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
