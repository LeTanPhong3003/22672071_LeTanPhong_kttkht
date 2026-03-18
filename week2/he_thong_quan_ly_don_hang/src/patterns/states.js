class OrderState {
  constructor(name) {
    this.name = name;
  }

  can() {
    return false;
  }

  checkInfo() {
    return ["Trạng thái hiện tại không hỗ trợ kiểm tra thông tin."];
  }

  startProcessing() {
    return ["Trạng thái hiện tại không hỗ trợ xử lý đơn."];
  }

  markDelivered() {
    return ["Trạng thái hiện tại không hỗ trợ xác nhận đã giao."];
  }

  cancel() {
    return ["Trạng thái hiện tại không hỗ trợ hủy đơn."];
  }
}

export class NewOrderState extends OrderState {
  constructor() {
    super("Mới tạo");
  }

  can(action) {
    return ["check", "process", "cancel"].includes(action);
  }

  checkInfo(ctx) {
    const hasCustomer = Boolean(ctx.order.customerName?.trim());
    const hasItems =
      Array.isArray(ctx.order.items) && ctx.order.items.length > 0;

    if (!hasCustomer || !hasItems) {
      ctx.isValidated = false;
      return ["Thông tin đơn không hợp lệ: thiếu khách hàng hoặc sản phẩm."];
    }

    ctx.isValidated = true;
    return ["Thông tin hợp lệ, đơn sẵn sàng để xử lý."];
  }

  startProcessing(ctx) {
    if (!ctx.isValidated) {
      return ["Cần kiểm tra thông tin trước khi chuyển sang Đang xử lý."];
    }

    const shipmentMessage = ctx.shippingStrategy.createShipment(ctx.order);
    ctx.shipmentPrepared = true;
    ctx.setState(new ProcessingOrderState());

    return ["Đã chuyển sang trạng thái Đang xử lý.", shipmentMessage];
  }

  cancel(ctx) {
    const refundMessage = ctx.refundStrategy.refund(ctx.order.total);
    ctx.setState(new CanceledOrderState());
    return ["Đơn đã được hủy ngay sau khi tạo.", refundMessage];
  }
}

export class ProcessingOrderState extends OrderState {
  constructor() {
    super("Đang xử lý");
  }

  can(action) {
    return ["process", "deliver", "cancel"].includes(action);
  }

  startProcessing(ctx) {
    if (ctx.shipmentPrepared) {
      return ["Đơn đang được đóng gói và giao cho đơn vị vận chuyển."];
    }

    ctx.shipmentPrepared = true;
    return ["Đã đóng gói xong, đơn đang được giao cho vận chuyển."];
  }

  markDelivered(ctx) {
    ctx.setState(new DeliveredOrderState());
    return ["Đã cập nhật trạng thái đơn hàng là Đã giao."];
  }

  cancel(ctx) {
    const refundMessage = ctx.refundStrategy.refund(ctx.order.total);
    ctx.setState(new CanceledOrderState());
    return ["Đã hủy đơn trong quá trình xử lý.", refundMessage];
  }
}

export class DeliveredOrderState extends OrderState {
  constructor() {
    super("Đã giao");
  }

  can(action) {
    return action === "deliver";
  }

  markDelivered() {
    return ["Đơn đã ở trạng thái Đã giao, không cần cập nhật lại."];
  }

  cancel() {
    return ["Không thể hủy vì đơn đã giao thành công."];
  }
}

export class CanceledOrderState extends OrderState {
  constructor() {
    super("Hủy");
  }

  can(action) {
    return action === "cancel";
  }

  cancel() {
    return ["Đơn đã ở trạng thái Hủy."];
  }
}
