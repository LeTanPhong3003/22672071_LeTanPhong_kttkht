import React, { useState } from "react";
import SingletonDemo from "./singleton/SingletonDemo.jsx";
import FactoryDemo from "./factory/FactoryDemo.jsx";

function App() {
  const [activeTab, setActiveTab] = useState("singleton");

  return (
    <div className="app">
      <nav className="nav">
        <button
          className={`nav-button ${activeTab === "singleton" ? "active" : ""}`}
          onClick={() => setActiveTab("singleton")}
        >
          Singleton Pattern
        </button>
        <button
          className={`nav-button ${activeTab === "factory" ? "active" : ""}`}
          onClick={() => setActiveTab("factory")}
        >
          Factory Pattern
        </button>
      </nav>

      <main className="content">
        {activeTab === "singleton" && <SingletonDemo />}
        {activeTab === "factory" && <FactoryDemo />}
      </main>

      <footer className="footer">
        <p>22672071 - Lê Tấn Phong</p>
      </footer>
    </div>
  );
}

export default App;
