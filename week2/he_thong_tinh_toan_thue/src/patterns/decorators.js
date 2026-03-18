/**
 * Decorator Pattern Implementation
 * Adds layers of functionality like logging, validation, and audit to tax calculation
 */

export class BaseCalculator {
  calculate(actionName, calculationFn) {
    const result = calculationFn();
    const messages = Array.isArray(result) ? result : [String(result)];
    return [`📝 Hành động: ${actionName}`, ...messages];
  }
}

export class CalculatorDecorator {
  constructor(wrappee) {
    this.wrappee = wrappee;
  }

  calculate(actionName, calculationFn) {
    return this.wrappee.calculate(actionName, calculationFn);
  }
}

export class LoggingDecorator extends CalculatorDecorator {
  calculate(actionName, calculationFn) {
    const startedAt = new Date().toLocaleTimeString("vi-VN");
    const messages = this.wrappee.calculate(actionName, calculationFn);
    return [
      `⏱️ [Log ${startedAt}] Bắt đầu tính toán`,
      ...messages,
      "⏱️ [Log] Hoàn tất tính toán",
    ];
  }
}

export class NotificationDecorator extends CalculatorDecorator {
  calculate(actionName, calculationFn) {
    const messages = this.wrappee.calculate(actionName, calculationFn);
    return [
      ...messages,
      `🔔 [Thông báo] Đã hoàn thành hành động "${actionName}".`,
    ];
  }
}

export class AuditDecorator extends CalculatorDecorator {
  calculate(actionName, calculationFn) {
    const traceId = `AUD-${Date.now()}`;
    const messages = this.wrappee.calculate(actionName, calculationFn);
    return [`🔍 [Audit ${traceId}] Theo dõi giao dịch`, ...messages];
  }
}

export class ValidationDecorator extends CalculatorDecorator {
  calculate(actionName, calculationFn) {
    const preCheckMessages = ["✅ [Xác thực] Kiểm tra điều kiện tiên quyết"];
    const messages = this.wrappee.calculate(actionName, calculationFn);
    return [
      ...preCheckMessages,
      ...messages,
      "✅ [Xác thực] Kiểm tra hoàn tất",
    ];
  }
}

export class ComplianceDecorator extends CalculatorDecorator {
  calculate(actionName, calculationFn) {
    const messages = this.wrappee.calculate(actionName, calculationFn);
    return [
      "📋 [Tuân thủ] Kiểm tra tuân thủ quy định pháp luật",
      ...messages,
      "📋 [Tuân thủ] Đã xác nhận tuân thủ",
    ];
  }
}
