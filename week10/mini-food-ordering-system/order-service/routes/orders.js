const express = require('express');
const axios = require('axios');
const router = express.Router();

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:8081/api';
const FOOD_SERVICE_URL = process.env.FOOD_SERVICE_URL || 'http://localhost:8082/api';

// In-memory database
let orders = [];
let orderIdCounter = 1001;

// Order status constants
const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PAID: 'PAID',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
};

// Get all orders
router.get('/', (req, res) => {
  try {
    const { userId } = req.query;
    let filteredOrders = orders;

    if (userId) {
      filteredOrders = orders.filter(o => o.userId === parseInt(userId));
    }

    console.log(`✓ Get orders: ${filteredOrders.length} orders found`);
    res.json({
      success: true,
      data: filteredOrders,
      count: filteredOrders.length
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Không thể lấy danh sách đơn hàng' });
  }
});

// Get order by ID
router.get('/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;
    const order = orders.find(o => o.id === parseInt(orderId));

    if (!order) {
      return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
    }

    console.log(`✓ Get order: #${order.id}`);
    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Không thể lấy thông tin đơn hàng' });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    let { userId, items, shippingAddress } = req.body;

    // Convert userId to integer
    userId = parseInt(userId);

    // Validation
    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ 
        error: 'userId, items (không rỗng) không được để trống' 
      });
    }

    // Verify user exists
    try {
      console.log(`🔍 Verifying user: userId=${userId} (type: ${typeof userId})`);
      await axios.get(`${USER_SERVICE_URL}/users/verify/${userId}`);
      console.log(`✓ User verified: ${userId}`);
    } catch (error) {
      console.error('❌ User verification failed:', error.message);
      return res.status(404).json({ error: 'Người dùng không tồn tại' });
    }

    // Verify and get food items
    let totalPrice = 0;
    const verifiedItems = [];

    for (const item of items) {
      try {
        const foodId = parseInt(item.foodId);
        const quantity = parseInt(item.quantity);
        
        const foodResponse = await axios.get(`${FOOD_SERVICE_URL}/foods/${foodId}`);
        const food = foodResponse.data.data;

        if (!food.available) {
          return res.status(400).json({ 
            error: `Món ăn "${food.name}" không còn phục vụ` 
          });
        }

        const itemTotal = food.price * quantity;
        verifiedItems.push({
          foodId: food.id,
          foodName: food.name,
          price: food.price,
          quantity: quantity,
          subtotal: itemTotal
        });

        totalPrice += itemTotal;
      } catch (error) {
        console.error('Food verification failed:', error.message);
        return res.status(404).json({ 
          error: `Không thể tìm thấy món ăn với ID: ${item.foodId}` 
        });
      }
    }

    const newOrder = {
      id: orderIdCounter++,
      userId,
      items: verifiedItems,
      totalPrice,
      shippingAddress: shippingAddress || 'Công ty',
      status: ORDER_STATUS.PENDING,
      paymentMethod: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    orders.push(newOrder);
    console.log(`✓ Order created: #${newOrder.id} (User: ${userId}, Total: ${totalPrice})`);

    res.status(201).json({
      success: true,
      message: 'Tạo đơn hàng thành công',
      data: newOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Không thể tạo đơn hàng' });
  }
});

// Update order status (internal use by Payment Service)
router.put('/:orderId/status', (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!Object.values(ORDER_STATUS).includes(status)) {
      return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
    }

    const orderIndex = orders.findIndex(o => o.id === parseInt(orderId));

    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
    }

    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date();

    console.log(`✓ Order status updated: #${orderId} → ${status}`);
    res.json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công',
      data: orders[orderIndex]
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Không thể cập nhật trạng thái đơn hàng' });
  }
});

// Cancel order
router.put('/:orderId/cancel', (req, res) => {
  try {
    const { orderId } = req.params;
    const orderIndex = orders.findIndex(o => o.id === parseInt(orderId));

    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
    }

    if (orders[orderIndex].status !== ORDER_STATUS.PENDING) {
      return res.status(400).json({ 
        error: 'Chỉ có thể hủy đơn hàng ở trạng thái chưa xác nhận' 
      });
    }

    orders[orderIndex].status = ORDER_STATUS.CANCELLED;
    orders[orderIndex].updatedAt = new Date();

    console.log(`✓ Order cancelled: #${orderId}`);
    res.json({
      success: true,
      message: 'Hủy đơn hàng thành công',
      data: orders[orderIndex]
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Không thể hủy đơn hàng' });
  }
});

module.exports = router;
