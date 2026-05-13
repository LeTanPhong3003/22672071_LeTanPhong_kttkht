import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../api/apiClient';
import './Cart.css';

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="cart-container">
        <div className="message">
          <p>⚠️ Vui lòng đăng nhập để xem giỏ hàng</p>
          <button onClick={() => navigate('/login')}>Đăng Nhập</button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <p>🛒 Giỏ hàng trống</p>
          <button onClick={() => navigate('/')}>Tiếp tục mua sắm</button>
        </div>
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const orderData = {
        userId: user.id,
        items: cart.map(item => ({
          foodId: item.id,
          quantity: item.quantity
        })),
        shippingAddress: 'Công ty'
      };

      const response = await orderAPI.createOrder(orderData);
      const orderId = response.data.data.id;

      clearCart();
      navigate(`/payment/${orderId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Không thể tạo đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = getTotalPrice();

  return (
    <div className="cart-container">
      <h2>🛒 Giỏ Hàng</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <div className="item-info">
              <h4>{item.name}</h4>
              <p className="item-price">{item.price.toLocaleString('vi-VN')}₫</p>
            </div>
            <div className="quantity-control">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
            <div className="item-total">
              {(item.price * item.quantity).toLocaleString('vi-VN')}₫
            </div>
            <button
              className="remove-btn"
              onClick={() => removeFromCart(item.id)}
            >
              ✕ Xóa
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Tổng cộng:</span>
          <span className="total-price">{totalPrice.toLocaleString('vi-VN')}₫</span>
        </div>
        <button
          className="checkout-btn"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? '⏳ Đang xử lý...' : '💳 Tiếp Tục Thanh Toán'}
        </button>
      </div>
    </div>
  );
};
