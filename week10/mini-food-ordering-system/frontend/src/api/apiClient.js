import axios from 'axios';

const API_USER = process.env.REACT_APP_API_USER_URL || 'http://localhost:8081/api';
const API_FOOD = process.env.REACT_APP_API_FOOD_URL || 'http://localhost:8082/api';
const API_ORDER = process.env.REACT_APP_API_ORDER_URL || 'http://localhost:8083/api';
const API_PAYMENT = process.env.REACT_APP_API_PAYMENT_URL || 'http://localhost:8084/api';

// User API
export const userAPI = {
  register: (data) => axios.post(`${API_USER}/auth/register`, data),
  login: (data) => axios.post(`${API_USER}/auth/login`, data),
  getUser: (id) => axios.get(`${API_USER}/users/${id}`)
};

// Food API
export const foodAPI = {
  getAllFoods: () => axios.get(`${API_FOOD}/foods`),
  getFoodById: (id) => axios.get(`${API_FOOD}/foods/${id}`)
};

// Order API
export const orderAPI = {
  createOrder: (data) => axios.post(`${API_ORDER}/orders`, data),
  getOrders: (userId) => axios.get(`${API_ORDER}/orders?userId=${userId}`),
  getOrderById: (id) => axios.get(`${API_ORDER}/orders/${id}`)
};

// Payment API
export const paymentAPI = {
  processPayment: (data) => axios.post(`${API_PAYMENT}/payments`, data),
  getPaymentById: (id) => axios.get(`${API_PAYMENT}/payments/${id}`),
  getOrderPayments: (orderId) => axios.get(`${API_PAYMENT}/payments/order/${orderId}`)
};
