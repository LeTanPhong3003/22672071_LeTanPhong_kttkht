import { useMemo, useReducer, useState } from "react";
import "./App.css";
import { OrderContext } from "./patterns/orderContext";
import { refundStrategies, shippingStrategies } from "./patterns/strategies";

const SAMPLE_ORDER = {
  id: "ORD-20260318",
  customerName: "Nguyễn Văn A",
  items: [
    { name: "Áo khoác", qty: 1, price: 450000 },
    { name: "Giày chạy bộ", qty: 1, price: 950000 },
  ],
  total: 1400000,
};

function createOrderEngine(config) {
  const shippingStrategy = shippingStrategies[config.shipping]();
  const refundStrategy = refundStrategies[config.refund]();

  return new OrderContext(SAMPLE_ORDER, shippingStrategy, refundStrategy);
}

function formatCurrency(value) {
  return `${new Intl.NumberFormat("vi-VN").format(value)} VND`;
}

function App() {
  const [refreshKey, forceRefresh] = useReducer((value) => value + 1, 0);
  const [config, setConfig] = useState({
    shipping: "standard",
    refund: "bank",
  });

  const [engine, setEngine] = useState(() => createOrderEngine(config));

  const itemSummary = useMemo(
    () =>
      SAMPLE_ORDER.items.map((item) => `${item.name} x${item.qty}`).join(", "),
    [],
  );

  const stateBadgeClass =
    {
      "Mới tạo": "new",
      "Đang xử lý": "processing",
      "Đã giao": "delivered",
      Hủy: "canceled",
    }[engine.state.name] || "new";

  const actions = [
    { key: "check", label: "Mới tạo: Kiểm tra thông tin" },
    { key: "process", label: "Đang xử lý: Đóng gói và vận chuyển" },
    { key: "deliver", label: "Đã giao: Cập nhật đã giao" },
    { key: "cancel", label: "Hủy: Hủy đơn và hoàn tiền" },
  ];

  const runAction = (actionKey) => {
    engine.performAction(actionKey);
    forceRefresh();
  };

  const rebuildEngine = (nextConfig) => {
    setConfig(nextConfig);
    setEngine(createOrderEngine(nextConfig));
    forceRefresh();
  };

  const resetSimulation = () => {
    setEngine(createOrderEngine(config));
    forceRefresh();
  };

  return (
    <main className="layout" key={refreshKey}>
      <section className="intro card">
        <p className="eyebrow">State + Strategy + Decorator</p>
        <h1>Mô phỏng hệ thống quản lý đơn hàng</h1>
        <p className="lead">
          Đơn hàng đi qua 4 trạng thái: Mới tạo, Đang xử lý, Đã giao và Hủy. Mỗi
          thao tác được bổ sung logging, thông báo và audit qua Decorator.
        </p>
      </section>

      <section className="panel-grid">
        <article className="card control-panel">
          <h2>Cấu hình Strategy</h2>
          <div className="field-row">
            <label htmlFor="shipping">Chiến lược vận chuyển</label>
            <select
              id="shipping"
              value={config.shipping}
              onChange={(event) =>
                rebuildEngine({ ...config, shipping: event.target.value })
              }
            >
              <option value="standard">Tiêu chuẩn</option>
              <option value="express">Hỏa tốc</option>
            </select>
          </div>
          <div className="field-row">
            <label htmlFor="refund">Chiến lược hoàn tiền</label>
            <select
              id="refund"
              value={config.refund}
              onChange={(event) =>
                rebuildEngine({ ...config, refund: event.target.value })
              }
            >
              <option value="bank">Ngân hàng</option>
              <option value="wallet">Ví điện tử</option>
            </select>
          </div>
          <button className="ghost" onClick={resetSimulation}>
            Tạo lại mô phỏng
          </button>
        </article>

        <article className="card status-panel">
          <h2>Trạng thái hiện tại (State)</h2>
          <p className={`state-badge ${stateBadgeClass}`}>
            {engine.state.name}
          </p>
          <ul className="order-meta">
            <li>Mã đơn: {SAMPLE_ORDER.id}</li>
            <li>Khách hàng: {SAMPLE_ORDER.customerName}</li>
            <li>Sản phẩm: {itemSummary}</li>
            <li>Tổng tiền: {formatCurrency(SAMPLE_ORDER.total)}</li>
            <li>Vận chuyển: {engine.shippingStrategy.getName()}</li>
            <li>Hoàn tiền: {engine.refundStrategy.getName()}</li>
          </ul>
        </article>
      </section>

      <section className="card action-panel">
        <h2>Hành vi theo trạng thái</h2>
        <div className="action-grid">
          {actions.map((action) => {
            const isEnabled = engine.can(action.key);

            return (
              <button
                key={action.key}
                className={`action ${isEnabled ? "is-enabled" : "is-disabled"}`}
                onClick={() => runAction(action.key)}
                disabled={!isEnabled}
              >
                {action.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="card log-panel">
        <h2>Log hệ thống (Decorator)</h2>
        {engine.logs.length === 0 ? (
          <p className="empty-log">
            Chưa có hành động. Hãy thử kiểm tra thông tin hoặc xử lý đơn.
          </p>
        ) : (
          <ol>
            {engine.logs.map((entry, index) => (
              <li key={`${entry}-${index}`}>{entry}</li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}

export default App;
