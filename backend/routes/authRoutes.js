const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER ROUTE
// REGISTER ROUTE
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, adminSecret } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // ADMIN SECURITY CHECK
    let finalRole = role || 'donor';
    if (role === 'admin') {
      // You can change 'SMART_SERVE_2026' to any secret key you want
      if (adminSecret !== 'SMART_SERVE_2026') {
        return res.status(403).json({ message: "Invalid Admin Secret Key" });
      }
      finalRole = 'admin';
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: finalRole
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Registration error" });
  }
});
// LOGIN ROUTE (Your code here)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.JWT_SECRET,
        { expiresIn: '1d' } // Good practice to add expiration
      );
      
      res.json({
        token,
        role: user.role,
        name: user.name
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
});

module.exports = router;