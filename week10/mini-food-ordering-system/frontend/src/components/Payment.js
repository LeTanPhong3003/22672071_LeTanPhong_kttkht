import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { paymentAPI, orderAPI } from '../api/apiClient';
import './Payment.css';

export const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderData, setOrderData] = useState(null);

  React.useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await orderAPI.getOrderById(orderId);
      setOrderData(response.data.data);
    } catch (err) {
      setError('Không thể tải thông tin đơn hàng');
    }
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: value
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const paymentData = {
        orderId: parseInt(orderId),
        paymentMethod,
        cardDetails: paymentMethod === 'BANKING' ? cardDetails : null
      };

      const response = await paymentAPI.processPayment(paymentData);

      if (response.data.success) {
        navigate(`/order/${orderId}`);
      } else {
        setError('Thanh toán thất bại, vui lòng thử lại');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi xử lý thanh toán');
    } finally {
      setLoading(false);
    }
  };

  if (!orderData) {
    return <div className="payment-container">⏳ Đang tải...</div>;
  }

  return (
    <div className="payment-container">
      <div className="payment-wrapper">
        <div className="order-summary">
          <h2>📋 Tóm Tắt Đơn Hàng #{orderId}</h2>
          <div className="order-items">
            {orderData.items.map(item => (
              <div key={item.foodId} className="order-item">
                <span>{item.foodName} x{item.quantity}</span>
                <span>{item.subtotal.toLocaleString('vi-VN')}₫</span>
              </div>
            ))}
          </div>
          <div className="order-total">
            <strong>Tổng cộng: {orderData.totalPrice.toLocaleString('vi-VN')}₫</strong>
          </div>
        </div>

        <form onSubmit={handlePayment} className="payment-form">
          <h2>💳 Chọn Phương Thức Thanh Toán</h2>
          {error && <div className="error-message">{error}</div>}

          <div className="payment-methods">
            <label className={`method-label ${paymentMethod === 'COD' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>💵 Thanh Toán Khi Nhận (COD)</span>
            </label>

            <label className={`method-label ${paymentMethod === 'BANKING' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="BANKING"
                checked={paymentMethod === 'BANKING'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>🏦 Chuyển Khoản Ngân Hàng</span>
            </label>
          </div>

          {paymentMethod === 'BANKING' && (
            <div className="card-details">
              <div className="form-group">
                <label>Số Thẻ</label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={handleCardChange}
                  maxLength="19"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>HSD</label>
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={cardDetails.expiryDate}
                    onChange={handleCardChange}
                    maxLength="5"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={handleCardChange}
                    maxLength="3"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="pay-btn">
            {loading ? '⏳ Đang xử lý...' : `💰 Thanh Toán ${orderData.totalPrice.toLocaleString('vi-VN')}₫`}
          </button>
        </form>
      </div>
    </div>
  );
};
