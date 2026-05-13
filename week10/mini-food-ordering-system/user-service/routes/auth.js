const express = require('express');
const router = express.Router();
const { generateToken } = require('../utils/jwt');
const { USER_ROLES } = require('../utils/constants');

// Register
router.post('/register', (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;
    const storage = global.userStorage;

    // Validation
    if (!username || !email || !password || !fullName) {
      return res.status(400).json({ error: 'Tất cả trường đều bắt buộc' });
    }

    // Check if user already exists
    if (storage.users.find(u => u.username === username)) {
      return res.status(400).json({ error: 'Username đã tồn tại' });
    }

    if (storage.users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email đã tồn tại' });
    }

    // Create new user
    const newUser = {
      id: storage.idCounter++,
      username,
      email,
      password, // In production, use bcrypt
      fullName,
      role: USER_ROLES.USER,
      createdAt: new Date()
    };

    storage.users.push(newUser);
    console.log(`✓ User registered: ${username} (ID: ${newUser.id})`);

    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role,
      createdAt: newUser.createdAt
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Đăng ký thất bại' });
  }
});

// Login
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const storage = global.userStorage;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username và password không được để trống' });
    }

    const user = storage.users.find(u => u.username === username && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Username hoặc password không chính xác' });
    }

    const token = generateToken(user.id, user.username);
    console.log(`✓ User logged in: ${username} (ID: ${user.id})`);

    res.json({
      userId: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Đăng nhập thất bại' });
  }
});

module.exports = router;
