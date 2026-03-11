import React, { useState } from "react";
import { ProductFactory } from "./ProductFactory";

function FactoryDemo() {
  const [logs, setLogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    type: "electronics",
    name: "",
    price: "",
    extra: "",
  });

  const addLog = (message, type = "info") => {
    setLogs((prev) => [
      ...prev,
      { message, type, time: new Date().toLocaleTimeString() },
    ]);
  };

  const clearLogs = () => {
    setLogs([]);
    setProducts([]);
  };

  const createProduct = () => {
    try {
      if (!formData.name || !formData.price || !formData.extra) {
        addLog("Vui lòng điền đầy đủ thông tin", "warning");
        return;
      }

      const product = ProductFactory.createProduct(
        formData.type,
        formData.name,
        parseInt(formData.price),
        formData.extra,
      );

      setProducts((prev) => [...prev, product]);
      addLog(`Tạo sản phẩm: ${product.getInfo()}`, "success");
      addLog(`Type: ${product.category}`, "info");

      // Reset form
      setFormData({
        ...formData,
        name: "",
        price: "",
        extra: "",
      });
    } catch (error) {
      addLog(`Error: ${error.message}`, "error");
    }
  };

  const createSampleProducts = () => {
    const samples = [
      { type: "electronics", name: "iPhone 15", price: 25000000, extra: "12" },
      { type: "clothing", name: "Áo sơ mi", price: 350000, extra: "L" },
      { type: "food", name: "Xoài Cát Chu", price: 80000, extra: "2026-03-25" },
    ];

    samples.forEach((sample) => {
      const product = ProductFactory.createProduct(
        sample.type,
        sample.name,
        sample.price,
        sample.extra,
      );
      setProducts((prev) => [...prev, product]);
      addLog(`${product.getInfo()}`, "success");
    });
  };

  const getExtraLabel = () => {
    switch (formData.type) {
      case "electronics":
        return "Bảo hành (tháng)";
      case "clothing":
        return "Size (S/M/L/XL)";
      case "food":
        return "HSD (YYYY-MM-DD)";
      default:
        return "Extra info";
    }
  };

  return (
    <div className="pattern-section">
      <div className="pattern-header">
        <h2>Factory Pattern</h2>
        <p>
          Tạo objects mà <strong>không cần biết class cụ thể</strong>
        </p>
      </div>

      <div className="demo-section">
        <h3>Tạo Sản Phẩm</h3>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontWeight: "600",
            }}
          >
            Loại sản phẩm:
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "2px solid #e9ecef",
              fontSize: "1rem",
              width: "100%",
              maxWidth: "300px",
            }}
          >
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="food">Food</option>
          </select>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "15px",
            marginBottom: "20px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "600",
              }}
            >
              Tên sản phẩm:
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="VD: Laptop Dell"
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "2px solid #e9ecef",
                fontSize: "1rem",
                width: "100%",
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "600",
              }}
            >
              Giá (đ):
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="VD: 15000000"
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "2px solid #e9ecef",
                fontSize: "1rem",
                width: "100%",
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "600",
              }}
            >
              {getExtraLabel()}:
            </label>
            <input
              type="text"
              value={formData.extra}
              onChange={(e) =>
                setFormData({ ...formData, extra: e.target.value })
              }
              placeholder={
                formData.type === "electronics"
                  ? "24"
                  : formData.type === "clothing"
                    ? "L"
                    : "2026-03-25"
              }
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "2px solid #e9ecef",
                fontSize: "1rem",
                width: "100%",
              }}
            />
          </div>
        </div>

        <button className="button" onClick={createProduct}>
          Tạo Sản Phẩm
        </button>
        <button className="button secondary" onClick={createSampleProducts}>
          Tạo Mẫu (3 sản phẩm)
        </button>
        <button className="button secondary" onClick={clearLogs}>
          Xóa Tất Cả
        </button>

        {products.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h4 style={{ marginBottom: "15px", color: "#495057" }}>
              Danh Sách Sản Phẩm ({products.length})
            </h4>
            <div className="grid">
              {products.map((product, index) => (
                <div key={index} className="card">
                  <h4>{product.name}</h4>
                  <p>
                    <strong>Category:</strong> {product.category}
                  </p>
                  <p>
                    <strong>Price:</strong> {product.price.toLocaleString()}đ
                  </p>
                  {product.warranty && (
                    <p>
                      <strong>Warranty:</strong> {product.warranty} tháng
                    </p>
                  )}
                  {product.size && (
                    <p>
                      <strong>Size:</strong> {product.size}
                    </p>
                  )}
                  {product.expiry && (
                    <p>
                      <strong>Expiry:</strong> {product.expiry}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {logs.length > 0 && (
          <div className="output-box" style={{ marginTop: "20px" }}>
            {logs.map((log, index) => (
              <div key={index} className={`log-line log-${log.type}`}>
                <small>[{log.time}]</small> {log.message}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FactoryDemo;
