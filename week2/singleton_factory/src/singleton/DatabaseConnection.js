/**
 * SINGLETON PATTERN
 *
 * Đảm bảo class chỉ có 1 instance duy nhất
 */

class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }

    this.host = "localhost";
    this.port = 3306;
    this.database = "shop_db";
    this.connected = false;
    this.connectionTime = new Date().toLocaleTimeString();
    this.instanceId = Math.floor(Math.random() * 10000);

    DatabaseConnection.instance = this;
  }

  connect() {
    this.connected = true;
    return `Kết nối thành công đến ${this.database}`;
  }

  disconnect() {
    this.connected = false;
    return `Ngắt kết nối database`;
  }

  query(sql) {
    if (!this.connected) {
      return "Error: Chưa kết nối database";
    }
    return `Executing: ${sql}`;
  }

  getInfo() {
    return {
      host: this.host,
      port: this.port,
      database: this.database,
      connected: this.connected,
      connectionTime: this.connectionTime,
      instanceId: this.instanceId,
    };
  }
}

export default DatabaseConnection;
