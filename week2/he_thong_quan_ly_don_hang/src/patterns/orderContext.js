import {
  AuditDecorator,
  BaseActionExecutor,
  LoggingDecorator,
  NotificationDecorator,
} from "./decorators";
import { NewOrderState } from "./states";

export class OrderContext {
  constructor(order, shippingStrategy, refundStrategy) {
    this.order = order;
    this.shippingStrategy = shippingStrategy;
    this.refundStrategy = refundStrategy;
    this.state = new NewOrderState();
    this.logs = [];
    this.isValidated = false;
    this.shipmentPrepared = false;

    this.executor = new AuditDecorator(
      new NotificationDecorator(new LoggingDecorator(new BaseActionExecutor())),
    );
  }

  setState(nextState) {
    this.state = nextState;
  }

  can(action) {
    return this.state.can(action);
  }

  performAction(action) {
    const handlers = {
      check: {
        label: "Kiểm tra thông tin đơn",
        run: () => this.state.checkInfo(this),
      },
      process: {
        label: "Đóng gói và vận chuyển",
        run: () => this.state.startProcessing(this),
      },
      deliver: {
        label: "Cập nhật đã giao",
        run: () => this.state.markDelivered(this),
      },
      cancel: {
        label: "Hủy đơn và hoàn tiền",
        run: () => this.state.cancel(this),
      },
    };

    const selected = handlers[action];
    if (!selected) {
      this.pushLog("Hành động không hợp lệ.");
      return;
    }

    const lines = this.executor.execute(selected.label, selected.run);
    this.pushLog(`Trạng thái hiện tại: ${this.state.name}`);
    lines.forEach((line) => this.pushLog(line));
    this.pushLog("--------------------------------------");
  }

  pushLog(message) {
    const timestamp = new Date().toLocaleTimeString("vi-VN");
    this.logs.unshift(`[${timestamp}] ${message}`);
  }
}
