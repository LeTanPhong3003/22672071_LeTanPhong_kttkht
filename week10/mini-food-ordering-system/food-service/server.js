const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const foodRoutes = require('./routes/foods');

app.use('/api/foods', foodRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Food Service is running', port: PORT });
});

const PORT = process.env.PORT || 8082;

app.listen(PORT, () => {
  console.log(`✓ Food Service running on port ${PORT}`);
  console.log(`✓ API: http://localhost:${PORT}/api`);
});
