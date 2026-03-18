export class BaseActionExecutor {
  execute(actionName, actionFn) {
    const result = actionFn();
    const messages = Array.isArray(result) ? result : [String(result)];
    return [`Hành động: ${actionName}`, ...messages];
  }
}

export class ExecutorDecorator {
  constructor(wrappee) {
    this.wrappee = wrappee;
  }

  execute(actionName, actionFn) {
    return this.wrappee.execute(actionName, actionFn);
  }
}

export class LoggingDecorator extends ExecutorDecorator {
  execute(actionName, actionFn) {
    const startedAt = new Date().toLocaleTimeString("vi-VN");
    const messages = this.wrappee.execute(actionName, actionFn);
    return [
      `[Log ${startedAt}] Bắt đầu xử lý`,
      ...messages,
      "[Log] Hoàn tất xử lý",
    ];
  }
}

export class NotificationDecorator extends ExecutorDecorator {
  execute(actionName, actionFn) {
    const messages = this.wrappee.execute(actionName, actionFn);
    return [
      ...messages,
      `[Thông báo] Đã cập nhật sau hành động "${actionName}".`,
    ];
  }
}

export class AuditDecorator extends ExecutorDecorator {
  execute(actionName, actionFn) {
    const traceId = `AUD-${Date.now()}`;
    const messages = this.wrappee.execute(actionName, actionFn);
    return [`[Audit ${traceId}] Theo dõi giao dịch`, ...messages];
  }
}
