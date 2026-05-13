// Simulated notification system
const sendNotification = (userId, message) => {
  console.log(`
╔════════════════════════════════════════════╗
║         📬 THÔNG BÁO                        ║
╟────────────────────────────────────────────╢
║ Người dùng ID: ${userId}
║ ${message}
╚════════════════════════════════════════════╝
  `);
};

module.exports = { sendNotification };
