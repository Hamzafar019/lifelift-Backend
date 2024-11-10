const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Sign-in route (updated)
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  console.log( req.body)

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hashed);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Sign-in successful',
      token: token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Route to register a new user
router.post('/signup', async (req, res) => {
  try {
    const { full_name, email, password, phone_number, date_of_birth, gender, role } = req.body;

    // Validate role before creating the user (optional, as model validation already exists)
    if (role && !['counselor', 'client'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Choose either "counselor" or "client".' });
    }

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists. Please use a different email.' });
    }

    // Create a new user (password will be hashed by the model hook)
    const newUser = await User.create({
      full_name,
      email,
      password_hashed: password, // Sending raw password
      phone_number,
      date_of_birth,
      gender,
      role, // The role can be "counselor" or "client"
    });

    return res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    console.error(err);

    // Check if it's a Sequelize Unique Constraint Error
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
