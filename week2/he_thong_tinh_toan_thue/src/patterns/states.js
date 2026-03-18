/**
 * State Pattern Implementation
 * Represents different states in the tax calculation lifecycle
 */

class TaxCalculationState {
  constructor(name) {
    this.name = name;
  }

  can() {
    return false;
  }

  validate() {
    return ["Trạng thái hiện tại không hỗ trợ xác nhận sản phẩm."];
  }

  calculate() {
    return ["Trạng thái hiện tại không hỗ trợ tính toán thuế."];
  }

  apply() {
    return ["Trạng thái hiện tại không hỗ trợ áp dụng thuế."];
  }

  reset() {
    return ["Trạng thái hiện tại không hỗ trợ khôi phục."];
  }
}

export class PendingState extends TaxCalculationState {
  constructor() {
    super("Chờ xác nhận");
  }

  can(action) {
    return ["validate", "reset"].includes(action);
  }

  validate(ctx) {
    const hasProduct = Boolean(ctx.product?.name?.trim());
    const hasPrice = ctx.product?.basePrice > 0;
    const hasCategory = Boolean(ctx.product?.category?.trim());

    if (!hasProduct || !hasPrice || !hasCategory) {
      ctx.isValidated = false;
      return ["❌ Sản phẩm không hợp lệ: thiếu tên, giá hoặc loại sản phẩm."];
    }

    ctx.isValidated = true;
    ctx.setState(new ValidatedState());
    return ["✓ Sản phẩm hợp lệ, sẵn sàng tính thuế."];
  }

  reset() {
    return ["Hệ thống đã được khôi phục."];
  }
}

export class ValidatedState extends TaxCalculationState {
  constructor() {
    super("Đã xác nhận");
  }

  can(action) {
    return ["calculate", "reset"].includes(action);
  }

  calculate(ctx) {
    if (!ctx.isValidated) {
      return ["⚠️ Cần xác nhận sản phẩm trước khi tính toán."];
    }

    const taxMessage = ctx.taxStrategy.calculateTax(ctx.product);
    ctx.taxAmount = ctx.taxStrategy.getTaxAmount(ctx.product);
    ctx.setState(new CalculatedState());
    return [
      "✓ Tính thuế thành công:",
      taxMessage,
      `Loại sản phẩm: ${ctx.product.category}`,
    ];
  }

  reset(ctx) {
    ctx.setState(new PendingState());
    ctx.isValidated = false;
    return ["Đã khôi phục về trạng thái ban đầu."];
  }
}

export class CalculatedState extends TaxCalculationState {
  constructor() {
    super("Đã tính toán");
  }

  can(action) {
    return ["apply", "calculate", "reset"].includes(action);
  }

  apply(ctx) {
    const totalPrice = ctx.product.basePrice + ctx.taxAmount;
    ctx.appliedTax = ctx.taxAmount;
    ctx.setState(new AppliedState());
    return [
      "✓ Áp dụng thuế thành công:",
      `Giá gốc: ${formatCurrency(ctx.product.basePrice)}`,
      `Tiền thuế: ${formatCurrency(ctx.taxAmount)}`,
      `Giá cuối cùng: ${formatCurrency(totalPrice)}`,
    ];
  }

  calculate() {
    return ["Thuế đã được tính, có thể áp dụng hoặc thay đổi chiến lược."];
  }

  reset(ctx) {
    ctx.setState(new PendingState());
    ctx.isValidated = false;
    ctx.taxAmount = 0;
    return ["Đã khôi phục về trạng thái ban đầu."];
  }
}

export class AppliedState extends TaxCalculationState {
  constructor() {
    super("Đã áp dụng");
  }

  can(action) {
    return ["apply", "reset"].includes(action);
  }

  apply() {
    return ["Thuế đã được áp dụng, không cần áp dụng lại."];
  }

  reset(ctx) {
    ctx.setState(new PendingState());
    ctx.isValidated = false;
    ctx.taxAmount = 0;
    ctx.appliedTax = 0;
    return ["Đã khôi phục về trạng thái ban đầu."];
  }
}

function formatCurrency(value) {
  return `${new Intl.NumberFormat("vi-VN").format(value)} VND`;
}
