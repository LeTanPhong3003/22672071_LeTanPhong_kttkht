const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/jwt');

// Get all users
router.get('/', (req, res) => {
  try {
    const storage = global.userStorage;
    console.log(`✓ Get all users: ${storage.users.length} users found`);
    res.json(storage.users.map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      fullName: u.fullName,
      role: u.role,
      createdAt: u.createdAt
    })));
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Không thể lấy danh sách người dùng' });
  }
});

// Get user by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const storage = global.userStorage;
    const user = storage.users.find(u => u.id === parseInt(id));

    if (!user) {
      return res.status(404).json({ error: 'Người dùng không tồn tại' });
    }

    console.log(`✓ Get user: ${user.username}`);
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Không thể lấy thông tin người dùng' });
  }
});

// Verify user (for other services)
router.get('/verify/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const storage = global.userStorage;
    const user = storage.users.find(u => u.id === parseInt(userId));

    if (!user) {
      return res.status(404).json({ error: 'Người dùng không tồn tại' });
    }

    console.log(`✓ User verified: ${user.username}`);
    res.json({ id: user.id, username: user.username, email: user.email });
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ error: 'Xác thực người dùng thất bại' });
  }
});

module.exports = router;
