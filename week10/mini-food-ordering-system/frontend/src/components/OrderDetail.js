import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { orderAPI } from '../api/apiClient';
import './OrderDetail.css';

export const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await orderAPI.getOrderById(orderId);
      setOrder(response.data.data);
    } catch (err) {
      setError('Không thể tải thông tin đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="order-detail-container">⏳ Đang tải...</div>;
  if (error) return <div className="order-detail-container error">{error}</div>;
  if (!order) return <div className="order-detail-container">Đơn hàng không tồn tại</div>;

  const getStatusIcon = (status) => {
    const icons = {
      PENDING: '⏳',
      CONFIRMED: '✓',
      PAID: '💳',
      DELIVERED: '📦',
      CANCELLED: '✕'
    };
    return icons[status] || '?';
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: '#f39c12',
      CONFIRMED: '#3498db',
      PAID: '#27ae60',
      DELIVERED: '#16a085',
      CANCELLED: '#e74c3c'
    };
    return colors[status] || '#95a5a6';
  };

  return (
    <div className="order-detail-container">
      <div className="order-card">
        <div className="order-header">
          <h2>📦 Đơn Hàng #{order.id}</h2>
          <div
            className="status-badge"
            style={{ backgroundColor: getStatusColor(order.status) }}
          >
            {getStatusIcon(order.status)} {order.status}
          </div>
        </div>

        <div className="order-timeline">
          {['PENDING', 'CONFIRMED', 'PAID', 'DELIVERED'].map((step, index) => (
            <div
              key={step}
              className={`timeline-step ${order.status === step || order.status === 'DELIVERED' ? 'active' : ''}`}
            >
              <div className="timeline-dot"></div>
              {index < 3 && <div className="timeline-line"></div>}
              <p>{step}</p>
            </div>
          ))}
        </div>

        <div className="order-details">
          <h3>📋 Chi Tiết Đơn Hàng</h3>
          <div className="order-items">
            {order.items.map(item => (
              <div key={item.foodId} className="detail-item">
                <div className="item-info">
                  <strong>{item.foodName}</strong>
                  <span className="quantity">x{item.quantity}</span>
                </div>
                <div className="item-price">
                  {item.subtotal.toLocaleString('vi-VN')}₫
                </div>
              </div>
            ))}
          </div>

          <div className="order-info">
            <div className="info-row">
              <span className="label">Địa chỉ giao hàng:</span>
              <span className="value">{order.shippingAddress}</span>
            </div>
            <div className="info-row">
              <span className="label">Phương thức thanh toán:</span>
              <span className="value">{order.paymentMethod || 'Chưa xác định'}</span>
            </div>
            <div className="info-row">
              <span className="label">Tổng tiền:</span>
              <span className="value total">
                {order.totalPrice.toLocaleString('vi-VN')}₫
              </span>
            </div>
            <div className="info-row">
              <span className="label">Thời gian đặt hàng:</span>
              <span className="value">
                {new Date(order.createdAt).toLocaleString('vi-VN')}
              </span>
            </div>
          </div>
        </div>

        <div className="order-message">
          <p>✓ Đơn hàng của bạn đã được xác nhận!</p>
          <p>Cảm ơn bạn đã mua hàng. Chúng tôi sẽ chuẩn bị đơn hàng trong thời gian sớm nhất.</p>
        </div>
      </div>
    </div>
  );
};
