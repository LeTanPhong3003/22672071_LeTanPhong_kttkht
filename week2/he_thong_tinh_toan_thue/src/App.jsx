import { useMemo, useReducer, useState } from "react";
import "./App.css";
import { TaxCalculationContext } from "./patterns/taxContext";
import { strategyByCategory, taxStrategies } from "./patterns/strategies";

const SAMPLE_PRODUCTS = [
  {
    id: "SP-001",
    name: "Áo phông thường",
    basePrice: 150000,
    category: "STANDARD",
  },
  {
    id: "SP-002",
    name: "Xăng RON 95",
    basePrice: 500000,
    category: "NECESSITY",
  },
  {
    id: "SP-003",
    name: "Nước hoa Dior",
    basePrice: 2000000,
    category: "LUXURY",
  },
  {
    id: "SP-004",
    name: "Pin mặt trời",
    basePrice: 800000,
    category: "ECO_FRIENDLY",
  },
];

function createTaxEngine(product, strategy) {
  return new TaxCalculationContext(product, strategy);
}

function formatCurrency(value) {
  return `${new Intl.NumberFormat("vi-VN").format(value)} VND`;
}

function App() {
  const [, forceRefresh] = useReducer((value) => value + 1, 0);
  const [selectedProductId, setSelectedProductId] = useState("SP-001");
  const [selectedStrategy, setSelectedStrategy] = useState("auto");

  const selectedProduct = SAMPLE_PRODUCTS.find(
    (p) => p.id === selectedProductId,
  );

  const strategy = useMemo(() => {
    if (selectedStrategy === "auto") {
      return strategyByCategory[selectedProduct.category]();
    }
    return taxStrategies[selectedStrategy]();
  }, [selectedStrategy, selectedProduct]);

  const [engine, setEngine] = useState(() =>
    createTaxEngine(selectedProduct, strategy),
  );

  // Update engine when product or strategy changes
  useMemo(() => {
    setEngine(createTaxEngine(selectedProduct, strategy));
  }, [selectedProduct, strategy]);

  const basePriceFormatted = formatCurrency(selectedProduct.basePrice);

  const actions = [
    {
      name: "validate",
      label: "✓ Xác Nhận",
      className: "validate",
      enabled: engine.can("validate"),
    },
    {
      name: "calculate",
      label: "🧮 Tính Thuế",
      className: "calculate",
      enabled: engine.can("calculate"),
    },
    {
      name: "apply",
      label: "✔ Áp Dụng",
      className: "apply",
      enabled: engine.can("apply"),
    },
    {
      name: "reset",
      label: "🔄 Khôi Phục",
      className: "reset",
      enabled: engine.can("reset"),
    },
  ];

  const handleAction = (actionName) => {
    engine.performAction(actionName);
    forceRefresh();
  };

  const handleProductChange = (e) => {
    setSelectedProductId(e.target.value);
  };

  const handleStrategyChange = (e) => {
    setSelectedStrategy(e.target.value);
  };

  const summary = engine.getSummary();

  const selectedStrategyObj =
    selectedStrategy === "auto"
      ? strategyByCategory[selectedProduct.category]()
      : taxStrategies[selectedStrategy]();

  return (
    <div className="app-container">
      <div className="header">
        <h1>🏛️ Hệ Thống Tính Toán Thuế Sản Phẩm</h1>
        <p>Sử dụng Design Patterns: State, Strategy, Decorator</p>
      </div>

      <div className="main-content">
        {/* Product Selection & Input Section */}
        <div className="section">
          <h2>📦 Chọn Sản Phẩm</h2>
          <div className="form-group">
            <label htmlFor="product-select">Sản phẩm:</label>
            <select
              id="product-select"
              value={selectedProductId}
              onChange={handleProductChange}
            >
              {SAMPLE_PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} - {formatCurrency(p.basePrice)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="strategy-select">Loại Thuế:</label>
            <select
              id="strategy-select"
              value={selectedStrategy}
              onChange={handleStrategyChange}
            >
              <option value="auto">🔄 Tự động (theo loại sản phẩm)</option>
              <option value="vat">💰 VAT (10%)</option>
              <option value="excise">🍺 Thuế Tiêu Thụ Đặc Biệt (25%)</option>
              <option value="luxury">✨ Thuế Sản Phẩm Xa Xỉ (35%)</option>
              <option value="eco">🌱 Thuế Bảo Vệ Môi Trường (5%)</option>
            </select>
          </div>

          <div className="strategy-info">
            <strong>{selectedStrategyObj.getName()}</strong>
            <em>{selectedStrategyObj.getDescription()}</em>
          </div>

          <div className="form-group">
            <label>
              <strong>Thông tin sản phẩm:</strong>
            </label>
            <div style={{ marginTop: "10px", textAlign: "left" }}>
              <div className="summary-item">
                <span className="summary-label">ID Sản phẩm:</span>
                <span className="summary-value">{selectedProduct.id}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Phân loại:</span>
                <span className="summary-value">
                  {selectedProduct.category}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Giá gốc:</span>
                <span className="summary-value">{basePriceFormatted}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Calculation & Status Section */}
        <div className="section">
          <h2>💳 Tính Toán Thuế</h2>
          <div className="state-indicator" title={engine.state.name}>
            <span>Trạng thái: {engine.state.name}</span>
          </div>

          <div className="button-group">
            {actions.map((action) => (
              <button
                key={action.name}
                className={`action-btn ${action.className}`}
                disabled={!action.enabled}
                onClick={() => handleAction(action.name)}
              >
                {action.label}
              </button>
            ))}
          </div>

          {engine.taxAmount > 0 && (
            <div className="summary-box">
              <div style={{ marginBottom: "10px", textAlign: "left" }}>
                <h3 style={{ margin: "0 0 10px 0", color: "#FFD700" }}>
                  📊 Kết quả tính toán:
                </h3>
              </div>
              <div className="summary-item">
                <span className="summary-label">Giá gốc:</span>
                <span className="summary-value">
                  {formatCurrency(summary.basePrice)}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">
                  Thuế ({selectedStrategyObj.getName()}):
                </span>
                <span className="summary-value">
                  {formatCurrency(engine.taxAmount)}
                </span>
              </div>
              <div className="summary-item total">
                <span className="summary-label">💰 Giá cuối cùng:</span>
                <span className="summary-value">
                  {formatCurrency(summary.totalPrice)}
                </span>
              </div>
            </div>
          )}

          <div style={{ marginTop: "20px", textAlign: "left" }}>
            <strong style={{ color: "#646cff" }}>Chiến lược hiện tại:</strong>
            <div style={{ marginTop: "8px", color: "#e0e0e0" }}>
              {selectedStrategyObj.getName()}
            </div>
          </div>
        </div>
      </div>

      {/* Logs Section */}
      <div className="logs-section">
        <h2>📋 Nhật Ký Xử Lý</h2>
        <div className="logs-container">
          {engine.logs.length > 0 ? (
            engine.logs.map((log, idx) => (
              <div
                key={idx}
                className={`log-entry ${
                  log.includes("❌")
                    ? "error"
                    : log.includes("✓")
                      ? "success"
                      : "info"
                }`}
              >
                {log}
              </div>
            ))
          ) : (
            <div className="log-entry info">
              📝 Chưa có hành động nào được thực hiện. Bắt đầu bằng cách nhấn
              &quot;Xác Nhận&quot;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
