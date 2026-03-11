import React, { useState } from "react";
import DatabaseConnection from "./DatabaseConnection";

function SingletonDemo() {
  const [logs, setLogs] = useState([]);
  const [db1Info, setDb1Info] = useState(null);
  const [db2Info, setDb2Info] = useState(null);

  const addLog = (message, type = "info") => {
    setLogs((prev) => [
      ...prev,
      { message, type, time: new Date().toLocaleTimeString() },
    ]);
  };

  const clearLogs = () => {
    setLogs([]);
    setDb1Info(null);
    setDb2Info(null);
  };

  const createFirstInstance = () => {
    const db1 = new DatabaseConnection();
    const info = db1.getInfo();
    setDb1Info(info);
    addLog("Tạo instance đầu tiên (db1)", "success");
    addLog(`Instance ID: ${info.instanceId}`, "info");
  };

  const createSecondInstance = () => {
    const db2 = new DatabaseConnection();
    const info = db2.getInfo();
    setDb2Info(info);
    addLog("Tạo instance thứ hai (db2)", "success");
    addLog(`Instance ID: ${info.instanceId}`, "info");
  };

  const compareInstances = () => {
    if (!db1Info || !db2Info) {
      addLog("Vui lòng tạo cả 2 instances trước", "warning");
      return;
    }

    const isSame = db1Info.instanceId === db2Info.instanceId;
    if (isSame) {
      addLog("db1 === db2: TRUE - Cùng 1 instance!", "success");
      addLog("Singleton đảm bảo chỉ có 1 object duy nhất", "success");
    } else {
      addLog("Có vấn đề với Singleton pattern", "error");
    }
  };

  return (
    <div className="pattern-section">
      <div className="pattern-header">
        <h2>Singleton Pattern</h2>
        <p>
          Đảm bảo một class chỉ có <strong>1 instance duy nhất</strong> trong
          toàn bộ ứng dụng
        </p>
      </div>

      <div className="demo-section">
        <h3>Demo Tương Tác</h3>
        <button className="button" onClick={createFirstInstance}>
          Tạo Instance Đầu Tiên (db1)
        </button>
        <button className="button" onClick={createSecondInstance}>
          Tạo Instance Thứ Hai (db2)
        </button>
        <button className="button secondary" onClick={compareInstances}>
          So Sánh db1 === db2
        </button>
        <button className="button secondary" onClick={clearLogs}>
          Xóa Logs
        </button>

        {(db1Info || db2Info) && (
          <div className="grid" style={{ marginTop: "20px" }}>
            {db1Info && (
              <div className="card">
                <h4>DB Instance 1</h4>
                <p>
                  <strong>ID:</strong> {db1Info.instanceId}
                </p>
                <p>
                  <strong>Host:</strong> {db1Info.host}:{db1Info.port}
                </p>
                <p>
                  <strong>Database:</strong> {db1Info.database}
                </p>
                <p>
                  <strong>Time:</strong> {db1Info.connectionTime}
                </p>
              </div>
            )}
            {db2Info && (
              <div className="card">
                <h4>DB Instance 2</h4>
                <p>
                  <strong>ID:</strong> {db2Info.instanceId}
                </p>
                <p>
                  <strong>Host:</strong> {db2Info.host}:{db2Info.port}
                </p>
                <p>
                  <strong>Database:</strong> {db2Info.database}
                </p>
                <p>
                  <strong>Time:</strong> {db2Info.connectionTime}
                </p>
              </div>
            )}
          </div>
        )}

        {logs.length > 0 && (
          <div className="output-box">
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

export default SingletonDemo;
