const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const paymentRoutes = require('./routes/payments');
const notificationRoutes = require('./routes/notifications');

app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Payment & Notification Service is running', port: PORT });
});

const PORT = process.env.PORT || 8084;

app.listen(PORT, () => {
  console.log(`✓ Payment & Notification Service running on port ${PORT}`);
  console.log(`✓ API: http://localhost:${PORT}/api`);
});
