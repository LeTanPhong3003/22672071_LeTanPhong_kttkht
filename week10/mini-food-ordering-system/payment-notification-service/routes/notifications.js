const express = require('express');
const router = express.Router();

// In-memory notification storage
let notifications = [];
let notificationIdCounter = 1;

// Get all notifications for a user
router.get('/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const userNotifications = notifications.filter(n => n.userId === parseInt(userId));

    console.log(`✓ Get notifications for user: ${userId} (${userNotifications.length} found)`);
    res.json({
      success: true,
      data: userNotifications,
      count: userNotifications.length
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Không thể lấy thông báo' });
  }
});

// Get unread notifications
router.get('/user/:userId/unread', (req, res) => {
  try {
    const { userId } = req.params;
    const unreadNotifications = notifications.filter(
      n => n.userId === parseInt(userId) && !n.read
    );

    console.log(`✓ Get unread notifications for user: ${userId}`);
    res.json({
      success: true,
      data: unreadNotifications,
      count: unreadNotifications.length
    });
  } catch (error) {
    console.error('Get unread notifications error:', error);
    res.status(500).json({ error: 'Không thể lấy thông báo chưa đọc' });
  }
});

// Mark notification as read
router.put('/:notificationId/read', (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = notifications.find(n => n.id === parseInt(notificationId));

    if (!notification) {
      return res.status(404).json({ error: 'Thông báo không tồn tại' });
    }

    notification.read = true;
    notification.readAt = new Date();

    console.log(`✓ Notification marked as read: #${notificationId}`);
    res.json({ success: true, data: notification });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Không thể đánh dấu thông báo đã đọc' });
  }
});

module.exports = router;
