import React, { useEffect, useState } from 'react';
import { foodAPI } from '../api/apiClient';
import { useCart } from '../context/CartContext';
import './FoodList.css';

export const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await foodAPI.getAllFoods();
      setFoods(response.data.data);
      // Initialize quantity for each food
      const initialQuantity = {};
      response.data.data.forEach(food => {
        initialQuantity[food.id] = 1;
      });
      setQuantity(initialQuantity);
    } catch (err) {
      setError('Không thể tải danh sách món ăn');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (food) => {
    const qty = quantity[food.id] || 1;
    addToCart(food, qty);
    alert(`✓ Đã thêm ${qty}x ${food.name} vào giỏ hàng`);
  };

  if (loading) return <div className="loading">⏳ Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="food-list-container">
      <h2>🍽️ Danh Sách Món Ăn</h2>
      <div className="foods-grid">
        {foods.map(food => (
          <div key={food.id} className="food-card">
            <img src={food.image} alt={food.name} className="food-image" />
            <div className="food-info">
              <h3>{food.name}</h3>
              <p className="description">{food.description}</p>
              <p className="category">🏷️ {food.category}</p>
              <div className="food-footer">
                <span className="price">{food.price.toLocaleString('vi-VN')}₫</span>
                <div className="quantity-control">
                  <button
                    onClick={() => setQuantity({
                      ...quantity,
                      [food.id]: Math.max(1, (quantity[food.id] || 1) - 1)
                    })}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity[food.id] || 1}
                    onChange={(e) => setQuantity({
                      ...quantity,
                      [food.id]: Math.max(1, parseInt(e.target.value) || 1)
                    })}
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity({
                      ...quantity,
                      [food.id]: (quantity[food.id] || 1) + 1
                    })}
                  >
                    +
                  </button>
                </div>
                <button
                  className="add-btn"
                  onClick={() => handleAddToCart(food)}
                >
                  🛒 Thêm
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
