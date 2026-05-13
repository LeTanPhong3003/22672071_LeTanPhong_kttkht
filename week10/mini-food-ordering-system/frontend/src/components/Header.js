import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import './Header.css';

export const Header = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>🍔 Food Ordering</h1>
        </Link>

        <nav className="nav">
          <Link to="/">🏠 Trang Chủ</Link>
          <Link to="/cart" className="cart-link">
            🛒 Giỏ Hàng
            {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <span className="username">👤 {user.fullName}</span>
              <button onClick={handleLogout} className="logout-btn">
                🚪 Đăng Xuất
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login">🔐 Đăng Nhập</Link>
              <Link to="/register" className="register-link">📝 Đăng Ký</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
