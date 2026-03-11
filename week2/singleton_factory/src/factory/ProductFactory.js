/**
 * FACTORY PATTERN
 *
 * Tạo objects mà không cần biết class cụ thể
 */

// Base Product
class Product {
  constructor(name, price) {
    this.id = Date.now() + Math.random();
    this.name = name;
    this.price = price;
  }

  getInfo() {
    return `${this.name} - ${this.price.toLocaleString()}đ`;
  }
}

// Concrete Products
class Electronics extends Product {
  constructor(name, price, warranty) {
    super(name, price);
    this.warranty = warranty;
    this.category = "Electronics";
  }

  getInfo() {
    return `${this.name} - ${this.price.toLocaleString()}đ (BH: ${this.warranty} tháng)`;
  }
}

class Clothing extends Product {
  constructor(name, price, size) {
    super(name, price);
    this.size = size;
    this.category = "Clothing";
  }

  getInfo() {
    return `${this.name} - ${this.price.toLocaleString()}đ (Size: ${this.size})`;
  }
}

class Food extends Product {
  constructor(name, price, expiry) {
    super(name, price);
    this.expiry = expiry;
    this.category = "Food";
  }

  getInfo() {
    return `${this.name} - ${this.price.toLocaleString()}đ (HSD: ${this.expiry})`;
  }
}

// Factory
class ProductFactory {
  static createProduct(type, name, price, extra) {
    switch (type.toLowerCase()) {
      case "electronics":
        return new Electronics(name, price, extra);
      case "clothing":
        return new Clothing(name, price, extra);
      case "food":
        return new Food(name, price, extra);
      default:
        throw new Error("Loại sản phẩm không hợp lệ");
    }
  }

  static getProductTypes() {
    return ["electronics", "clothing", "food"];
  }
}

export { ProductFactory, Electronics, Clothing, Food };
