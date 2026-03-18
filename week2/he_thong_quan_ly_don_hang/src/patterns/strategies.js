export class StandardShippingStrategy {
  getName() {
    return "Giao hàng tiêu chuẩn";
  }

  createShipment(order) {
    return `Đơn ${order.id}: Đóng gói cơ bản, dự kiến giao trong 3 ngày.`;
  }
}

export class ExpressShippingStrategy {
  getName() {
    return "Giao hàng hỏa tốc";
  }

  createShipment(order) {
    return `Đơn ${order.id}: Đóng gói ưu tiên, dự kiến giao trong 24 giờ.`;
  }
}

export class BankRefundStrategy {
  getName() {
    return "Hoàn tiền qua ngân hàng";
  }

  refund(amount) {
    return `Hoàn ${formatCurrency(amount)} vào tài khoản ngân hàng (1-2 ngày).`;
  }
}

export class WalletRefundStrategy {
  getName() {
    return "Hoàn tiền qua ví điện tử";
  }

  refund(amount) {
    return `Hoàn ${formatCurrency(amount)} vào ví điện tử (gần như ngay lập tức).`;
  }
}

export const shippingStrategies = {
  standard: () => new StandardShippingStrategy(),
  express: () => new ExpressShippingStrategy(),
};

export const refundStrategies = {
  bank: () => new BankRefundStrategy(),
  wallet: () => new WalletRefundStrategy(),
};

function formatCurrency(value) {
  return `${new Intl.NumberFormat("vi-VN").format(value)} VND`;
}
