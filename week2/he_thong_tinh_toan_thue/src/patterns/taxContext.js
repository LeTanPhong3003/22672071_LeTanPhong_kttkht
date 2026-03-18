/**
 * Tax Calculation Context
 * Manages the state, strategy, and decorators for tax calculation
 */

import {
  AuditDecorator,
  BaseCalculator,
  ComplianceDecorator,
  LoggingDecorator,
  NotificationDecorator,
  ValidationDecorator,
} from "./decorators";
import { PendingState } from "./states";

export class TaxCalculationContext {
  constructor(product, taxStrategy) {
    this.product = product;
    this.taxStrategy = taxStrategy;
    this.state = new PendingState();
    this.logs = [];
    this.isValidated = false;
    this.taxAmount = 0;
    this.appliedTax = 0;

    // Stack decorators: Compliance -> Audit -> Notification -> Logging -> Validation -> Base
    this.calculator = new ComplianceDecorator(
      new AuditDecorator(
        new NotificationDecorator(
          new LoggingDecorator(new ValidationDecorator(new BaseCalculator())),
        ),
      ),
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
      validate: {
        label: "Xác nhận sản phẩm",
        run: () => this.state.validate(this),
      },
      calculate: {
        label: "Tính toán thuế",
        run: () => this.state.calculate(this),
      },
      apply: {
        label: "Áp dụng thuế",
        run: () => this.state.apply(this),
      },
      reset: {
        label: "Khôi phục",
        run: () => this.state.reset(this),
      },
    };

    const selected = handlers[action];
    if (!selected) {
      this.pushLog("❌ Hành động không hợp lệ.");
      return;
    }

    const lines = this.calculator.calculate(selected.label, selected.run);
    this.pushLog(`Trạng thái hiện tại: ${this.state.name}`);
    lines.forEach((line) => this.pushLog(line));
    this.pushLog("--------------------------------------");
  }

  pushLog(message) {
    const timestamp = new Date().toLocaleTimeString("vi-VN");
    this.logs.unshift(`[${timestamp}] ${message}`);
  }

  getTotalPrice() {
    return this.product.basePrice + this.taxAmount;
  }

  getSummary() {
    return {
      product: this.product,
      basePrice: this.product.basePrice,
      taxAmount: this.taxAmount,
      totalPrice: this.getTotalPrice(),
      taxStrategy: this.taxStrategy.getName(),
      state: this.state.name,
    };
  }
}
