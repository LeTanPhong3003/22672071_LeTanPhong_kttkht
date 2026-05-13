const express = require('express');
const axios = require('axios');
const router = express.Router();
const { PAYMENT_METHODS, PAYMENT_STATUS } = require('../utils/constants');
const { sendNotification } = require('../utils/notification');

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:8083/api';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:8081/api';

// In-memory database
let payments = [];
let paymentIdCounter = 5001;

// Process payment
router.post('/', async (req, res) => {
  try {
    const { orderId, paymentMethod, cardDetails } = req.body;

    // Validation
    if (!orderId || !paymentMethod) {
      return res.status(400).json({ 
        error: 'orderId, paymentMethod không được để trống' 
      });
    }

    if (!Object.values(PAYMENT_METHODS).includes(paymentMethod)) {
      return res.status(400).json({ 
        error: 'Phương thức thanh toán không hợp lệ (COD hoặc BANKING)' 
      });
    }

    // For BANKING, validate card details
    if (paymentMethod === PAYMENT_METHODS.BANKING && !cardDetails) {
      return res.status(400).json({ 
        error: 'Thông tin thẻ không được để trống' 
      });
    }

    // Get order information
    let orderData;
    try {
      const orderResponse = await axios.get(`${ORDER_SERVICE_URL}/orders/${orderId}`);
      orderData = orderResponse.data.data;
      console.log(`✓ Order found: #${orderData.id}, UserId: ${orderData.userId}`);
    } catch (error) {
      console.error('Get order failed:', error.message);
      return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
    }

    if (orderData.status !== 'PENDING') {
      return res.status(400).json({ 
        error: 'Chỉ có thể thanh toán cho đơn hàng ở trạng thái chưa xác nhận' 
      });
    }

    // Get user information
    let userData;
    try {
      console.log(`🔍 Verifying user: userId=${orderData.userId}`);
      console.log(`📍 Calling: ${USER_SERVICE_URL}/users/verify/${orderData.userId}`);
      
      const userResponse = await axios.get(`${USER_SERVICE_URL}/users/verify/${orderData.userId}`);
      userData = userResponse.data;
      console.log(`✓ User verified: ${userData.username || userData.id}`);
    } catch (error) {
      console.error('❌ User verification failed!');
      console.error(`   Error: ${error.message}`);
      console.error(`   Status: ${error.response?.status}`);
      console.error(`   Data: ${JSON.stringify(error.response?.data)}`);
      return res.status(404).json({ 
        error: 'Người dùng không tồn tại',
        debug: {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        }
      });
    }

    // Simulate payment processing
    const isPaymentSuccess = simulatePayment(paymentMethod, cardDetails);

    const newPayment = {
      id: paymentIdCounter++,
      orderId,
      userId: orderData.userId,
      amount: orderData.totalPrice,
      paymentMethod,
      status: isPaymentSuccess ? PAYMENT_STATUS.SUCCESS : PAYMENT_STATUS.FAILED,
      transactionId: generateTransactionId(),
      createdAt: new Date()
    };

    payments.push(newPayment);

    if (isPaymentSuccess) {
      // Update order status to PAID
      try {
        await axios.put(`${ORDER_SERVICE_URL}/orders/${orderId}/status`, {
          status: 'PAID'
        });
      } catch (error) {
        console.error('Update order status failed:', error.message);
      }

      // Send notification
      sendNotification(
        orderData.userId,
        `✓ Thanh toán thành công cho đơn hàng #${orderId}
Phương thức: ${paymentMethod}
Số tiền: ${orderData.totalPrice.toLocaleString('vi-VN')}₫
Mã giao dịch: ${newPayment.transactionId}`
      );

      console.log(`✓ Payment successful: #${newPayment.id} (Order: ${orderId}, Amount: ${orderData.totalPrice})`);

      res.status(201).json({
        success: true,
        message: 'Thanh toán thành công',
        data: newPayment
      });
    } else {
      console.log(`✗ Payment failed: #${newPayment.id} (Order: ${orderId})`);

      res.status(400).json({
        success: false,
        message: 'Thanh toán thất bại',
        data: newPayment
      });
    }
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ error: 'Không thể xử lý thanh toán' });
  }
});

// Get payment by ID
router.get('/:paymentId', (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = payments.find(p => p.id === parseInt(paymentId));

    if (!payment) {
      return res.status(404).json({ error: 'Thanh toán không tồn tại' });
    }

    console.log(`✓ Get payment: #${payment.id}`);
    res.json({ success: true, data: payment });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Không thể lấy thông tin thanh toán' });
  }
});

// Get payments by order ID
router.get('/order/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;
    const orderPayments = payments.filter(p => p.orderId === parseInt(orderId));

    console.log(`✓ Get payments for order: ${orderId}`);
    res.json({
      success: true,
      data: orderPayments,
      count: orderPayments.length
    });
  } catch (error) {
    console.error('Get order payments error:', error);
    res.status(500).json({ error: 'Không thể lấy thông tin thanh toán' });
  }
});

// Simulate payment processing (gambling lol)
function simulatePayment(paymentMethod, cardDetails) {
  if (paymentMethod === PAYMENT_METHODS.COD) {
    // COD always succeeds (payment on delivery)
    return true;
  }

  if (paymentMethod === PAYMENT_METHODS.BANKING) {
    // Simulate 80% success rate for banking
    return Math.random() > 0.2;
  }

  return false;
}

// Generate transaction ID
function generateTransactionId() {
  return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
}

module.exports = router;
