/**
 * Strategy Pattern Implementation
 * Represents different tax calculation strategies for various product categories
 */

export class VATStrategy {
  getName() {
    return "Thuế Giá Trị Gia Tăng (VAT)";
  }

  getDescription() {
    return "Áp dụng cho sản phẩm tiêu dùng thông thường (10%)";
  }

  calculateTax(product) {
    const taxRate = 0.1; // 10% for STANDARD products
    const taxAmount = product.basePrice * taxRate;
    return `Thuế VAT 10%: ${formatCurrency(taxAmount)}`;
  }

  getTaxAmount(product) {
    const taxRate = 0.1;
    return product.basePrice * taxRate;
  }
}

export class ExciseTaxStrategy {
  getName() {
    return "Thuế Tiêu Thụ Đặc Biệt";
  }

  getDescription() {
    return "Áp dụng cho nhu yếu phẩm như xăng dầu, rượu bia (25%)";
  }

  calculateTax(product) {
    const taxRate = 0.25; // 25% for NECESSITY products (fuel, alcohol, etc.)
    const taxAmount = product.basePrice * taxRate;
    return `Thuế Tiêu Thụ 25%: ${formatCurrency(taxAmount)}`;
  }

  getTaxAmount(product) {
    const taxRate = 0.25;
    return product.basePrice * taxRate;
  }
}

export class LuxuryTaxStrategy {
  getName() {
    return "Thuế Sản Phẩm Xa Xỉ";
  }

  getDescription() {
    return "Áp dụng cho sản phẩm xa xỉ như nước hoa, đồ hiệu (35%)";
  }

  calculateTax(product) {
    const baseRate = 0.1; // Base VAT 10%
    const luxuryRate = 0.25; // Additional luxury tax 25%
    const totalTax = product.basePrice * (baseRate + luxuryRate);
    return `Thuế VAT 10% + Thuế Xa Xỉ 25% = 35%: ${formatCurrency(totalTax)}`;
  }

  getTaxAmount(product) {
    const baseRate = 0.1;
    const luxuryRate = 0.25;
    return product.basePrice * (baseRate + luxuryRate);
  }
}

export class EcoTaxStrategy {
  getName() {
    return "Thuế Bảo Vệ Môi Trường";
  }

  getDescription() {
    return "Áp dụng cho sản phẩm ảnh hưởng đến môi trường (5%-15%)";
  }

  calculateTax(product) {
    const taxRate = 0.05; // 5% eco tax
    const taxAmount = product.basePrice * taxRate;
    return `Thuế Môi Trường 5%: ${formatCurrency(taxAmount)}`;
  }

  getTaxAmount(product) {
    const taxRate = 0.05;
    return product.basePrice * taxRate;
  }
}

export const taxStrategies = {
  vat: () => new VATStrategy(),
  excise: () => new ExciseTaxStrategy(),
  luxury: () => new LuxuryTaxStrategy(),
  eco: () => new EcoTaxStrategy(),
};

export const strategyByCategory = {
  STANDARD: () => new VATStrategy(),
  NECESSITY: () => new ExciseTaxStrategy(),
  LUXURY: () => new LuxuryTaxStrategy(),
  ECO_FRIENDLY: () => new EcoTaxStrategy(),
};

function formatCurrency(value) {
  return `${new Intl.NumberFormat("vi-VN").format(value)} VND`;
}
