const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const orderRoutes = require('./routes/orders');

app.use('/api/orders', orderRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Order Service is running', port: PORT });
});

const PORT = process.env.PORT || 8083;

app.listen(PORT, () => {
  console.log(`✓ Order Service running on port ${PORT}`);
  console.log(`✓ API: http://localhost:${PORT}/api`);
});
