## Các Pattern được triển khai

### 1. Singleton Pattern 🔒

**Khái niệm:**

- Đảm bảo một class chỉ có **1 instance duy nhất** trong toàn bộ ứng dụng
- Cung cấp global access point đến instance đó

**Tại sao sử dụng Singleton?**

Trong nhiều tình huống thực tế, việc tạo nhiều instances của cùng một class có thể:

- Lãng phí tài nguyên hệ thống (memory, connections)
- Gây xung đột dữ liệu (nhiều instances cùng thao tác trên 1 resource)
- Khó quản lý trạng thái toàn cục

Singleton giải quyết vấn đề này bằng cách **đảm bảo chỉ có 1 instance duy nhất** và tất cả code đều truy cập instance đó.

**Ví dụ thực tế:** Database Connection

- **Vấn đề:** Nếu mỗi lần cần database lại tạo connection mới → tốn tài nguyên, có thể vượt giới hạn connections
- **Giải pháp:** Singleton đảm bảo chỉ có 1 connection duy nhất, được tái sử dụng trong toàn bộ ứng dụng
- Dù tạo object `new DatabaseConnection()` bao nhiêu lần, vẫn chỉ có 1 instance thực sự

**Cơ chế hoạt động:**

1. **Lần đầu tiên** gọi `new DatabaseConnection()`:
   - Kiểm tra `DatabaseConnection.instance` → chưa tồn tại (undefined)
   - Tạo instance mới với các thuộc tính: host, port, database, instanceId
   - Lưu instance vào `DatabaseConnection.instance` (static property)
   - Trả về instance mới này

2. **Các lần sau** gọi `new DatabaseConnection()`:
   - Kiểm tra `DatabaseConnection.instance` → đã tồn tại
   - **Không tạo mới**, chỉ trả về instance cũ đã lưu
   - Kết quả: tất cả biến đều trỏ đến cùng 1 object trong memory

**Cách hoạt động trên giao diện:**

1. Click **"Tạo Instance Đầu Tiên (db1)"** → Tạo instance đầu tiên
   - Gọi `const db1 = new DatabaseConnection()`
   - Instance được tạo với ID ngẫu nhiên (ví dụ: 7823)
2. Click **"Tạo Instance Thứ Hai (db2)"** → Tạo instance thứ hai
   - Gọi `const db2 = new DatabaseConnection()`
   - **KHÔNG tạo mới**, trả về instance cũ (vẫn ID 7823)
3. Click **"So Sánh db1 === db2"** → Xem kết quả
   - So sánh `db1Info.instanceId === db2Info.instanceId`
   - Kết quả: **TRUE** - cùng ID → cùng 1 object
4. Thẻ cards hiển thị thông tin chi tiết:
   - DB Instance 1: ID = 7823, Host = localhost:3306
   - DB Instance 2: ID = 7823 (giống nhau!), Host = localhost:3306
5. **Kết luận:** Instance ID giống nhau chứng minh db1 và db2 trỏ đến cùng 1 object trong bộ nhớ

**Code logic chi tiết:**

```javascript
class DatabaseConnection {
  constructor() {
    // Kiểm tra nếu đã có instance
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance; // Trả về instance cũ, KHÔNG tạo mới
    }

    // Khởi tạo các thuộc tính CHỈ LẦN ĐẦU
    this.host = "localhost";
    this.port = 3306;
    this.database = "shop_db";
    this.connected = false;
    this.connectionTime = new Date().toLocaleTimeString();
    this.instanceId = Math.floor(Math.random() * 10000); // ID duy nhất cho instance

    // Lưu instance vào static property để dùng sau
    DatabaseConnection.instance = this;
  }

  getInfo() {
    // Trả về info của instance duy nhất
    return {
      instanceId: this.instanceId, // Cùng 1 ID cho mọi lần gọi
      host: this.host,
      port: this.port,
      // ...
    };
  }
}
```

**Ưu điểm:**

- Tiết kiệm tài nguyên (chỉ 1 instance)
- Đảm bảo consistency (tất cả đều dùng chung 1 instance)
- Dễ dàng truy cập global (từ mọi nơi trong code)

**Nhược điểm:**

- Khó test (instance tồn tại toàn cục)
- Vi phạm Single Responsibility Principle (class vừa quản lý logic vừa quản lý instance)
- Có thể gây coupling cao

**Khi nào nên dùng:**

- Logger (ghi log ra 1 file duy nhất)
- Configuration Manager (cấu hình toàn ứng dụng)
- Database Connection Pool
- Cache Manager

---

### 2. Factory Pattern 🏭

**Khái niệm:**

- Tạo objects mà **không cần biết class cụ thể**
- Factory quyết định tạo object nào dựa trên type
- Client code chỉ làm việc với interface/abstract class, không biết concrete class

**Tại sao sử dụng Factory Pattern?**

Trong thực tế, chúng ta thường cần tạo nhiều loại objects khác nhau nhưng:

- **Không muốn** client code phụ thuộc vào concrete classes
- **Muốn mở rộng** dễ dàng (thêm loại mới mà không sửa client code)
- **Tập trung logic** tạo object ở 1 nơi thay vì rải rác khắp nơi

Factory Pattern cho phép **ủy thác việc tạo object** cho một factory class, giảm coupling và tăng flexibility.

**Ví dụ thực tế:** Product Factory (E-commerce)

- **Vấn đề:**
  - Có nhiều loại sản phẩm: Electronics, Clothing, Food
  - Mỗi loại có thuộc tính riêng (Electronics có warranty, Clothing có size, Food có expiry)
  - Client không muốn viết: `if (type === 'electronics') { return new Electronics(...) }`
- **Giải pháp:**
  - Factory nhận `type` và tự động tạo đúng class
  - Client chỉ cần: `ProductFactory.createProduct(type, name, price, extra)`
  - Thêm loại mới? Chỉ sửa Factory, không động đến client code

---

**So sánh: KHÔNG dùng Factory vs DÙNG Factory**

**❌ KHÔNG dùng Factory (Bad Practice):**

```javascript
// Client code phải biết tất cả concrete classes
function createProduct(type, name, price, extra) {
  if (type === "electronics") {
    return new Electronics(name, price, extra); // Client biết Electronics
  } else if (type === "clothing") {
    return new Clothing(name, price, extra); // Client biết Clothing
  } else if (type === "food") {
    return new Food(name, price, extra); // Client biết Food
  }
}

// Vấn đề:
// 1. Client code phụ thuộc vào 3 concrete classes (tight coupling)
// 2. Thêm loại mới? Phải sửa tất cả nơi gọi createProduct()
// 3. Logic tạo object rải rác khắp nơi trong code
```

**✅ DÙNG Factory (Best Practice):**

```javascript
// Client code KHÔNG biết concrete classes
const product = ProductFactory.createProduct(type, name, price, extra);

// Ưu điểm:
// 1. Client chỉ biết ProductFactory, không biết Electronics/Clothing/Food
// 2. Thêm loại mới? Chỉ sửa bên trong Factory, client code không đổi
// 3. Logic tập trung ở 1 chỗ (Factory class)
```

---

**LOGIC FLOW CHI TIẾT:**

```
Client Request:
"Tôi muốn tạo 1 sản phẩm Electronics: iPhone 15, giá 25 triệu, bảo hành 12 tháng"

Step 1: Client gọi Factory
┌────────────────────────────────────────────────────────┐
│ Client Code (FactoryDemo.jsx)                         │
├────────────────────────────────────────────────────────┤
│ const product = ProductFactory.createProduct(         │
│   "electronics",      // type                          │
│   "iPhone 15",        // name                          │
│   25000000,           // price                         │
│   "12"                // extra (warranty)              │
│ );                                                     │
└────────────────────────────────────────────────────────┘
                         │
                         ▼
Step 2: Factory nhận request và phân tích type
┌────────────────────────────────────────────────────────┐
│ ProductFactory.createProduct(type, name, price, extra) │
├────────────────────────────────────────────────────────┤
│ switch(type.toLowerCase()) {                           │
│   case "electronics":                                  │
│     ✓ MATCH! → Gọi Electronics constructor             │
│   case "clothing":                                     │
│     ✗ Skip                                             │
│   case "food":                                         │
│     ✗ Skip                                             │
│ }                                                      │
└────────────────────────────────────────────────────────┘
                         │
                         ▼
Step 3: Factory tạo Electronics object
┌────────────────────────────────────────────────────────┐
│ new Electronics("iPhone 15", 25000000, "12")          │
├────────────────────────────────────────────────────────┤
│ Electronics constructor được gọi:                      │
│ 1. Gọi super(name, price)  → khởi tạo Product base    │
│    - this.id = unique ID                               │
│    - this.name = "iPhone 15"                           │
│    - this.price = 25000000                             │
│ 2. Thêm thuộc tính riêng:                              │
│    - this.warranty = "12"  (từ extra parameter)        │
│    - this.category = "Electronics"                     │
└────────────────────────────────────────────────────────┘
                         │
                         ▼
Step 4: Trả về object cho Client
┌────────────────────────────────────────────────────────┐
│ Object returned: Electronics {                         │
│   id: 1678923456789.123,                               │
│   name: "iPhone 15",                                   │
│   price: 25000000,                                     │
│   warranty: "12",                                      │
│   category: "Electronics",                             │
│   getInfo: function() { ... }                          │
│ }                                                      │
└────────────────────────────────────────────────────────┘
                         │
                         ▼
Step 5: Client sử dụng object (KHÔNG biết concrete class)
┌────────────────────────────────────────────────────────┐
│ Client chỉ biết product là Product, không biết nó là   │
│ Electronics hay Clothing hay Food                      │
├────────────────────────────────────────────────────────┤
│ setProducts(prev => [...prev, product]);              │
│ addLog(product.getInfo(), "success");                  │
│ // Output: "iPhone 15 - 25,000,000đ (BH: 12 tháng)"   │
└────────────────────────────────────────────────────────┘
```

---

**VÍ DỤ CỤ THỂ VỚI 3 LOẠI SẢN PHẨM:**

**Case 1: Electronics**

```javascript
// Input từ form
type = "electronics"
name = "iPhone 15"
price = 25000000
extra = "12"  // warranty (bảo hành 12 tháng)

// Factory xử lý
ProductFactory.createProduct("electronics", "iPhone 15", 25000000, "12")
  → switch case MATCH "electronics"
  → return new Electronics("iPhone 15", 25000000, "12")

// Output object
{
  id: 1678923456789.123,
  name: "iPhone 15",
  price: 25000000,
  warranty: "12",           // ← Thuộc tính ĐẶC BIỆT của Electronics
  category: "Electronics"
}

// Hiển thị trên UI
"iPhone 15 - 25,000,000đ (BH: 12 tháng)"
```

**Case 2: Clothing**

```javascript
// Input từ form
type = "clothing"
name = "Áo sơ mi"
price = 350000
extra = "L"  // size (Size L)

// Factory xử lý
ProductFactory.createProduct("clothing", "Áo sơ mi", 350000, "L")
  → switch case MATCH "clothing"
  → return new Clothing("Áo sơ mi", 350000, "L")

// Output object
{
  id: 1678923456790.456,
  name: "Áo sơ mi",
  price: 350000,
  size: "L",                // ← Thuộc tính ĐẶC BIỆT của Clothing
  category: "Clothing"
}

// Hiển thị trên UI
"Áo sơ mi - 350,000đ (Size: L)"
```

**Case 3: Food**

```javascript
// Input từ form
type = "food"
name = "Xoài Cát Chu"
price = 80000
extra = "2026-03-25"  // expiry (hạn sử dụng)

// Factory xử lý
ProductFactory.createProduct("food", "Xoài Cát Chu", 80000, "2026-03-25")
  → switch case MATCH "food"
  → return new Food("Xoài Cát Chu", 80000, "2026-03-25")

// Output object
{
  id: 1678923456791.789,
  name: "Xoài Cát Chu",
  price: 80000,
  expiry: "2026-03-25",     // ← Thuộc tính ĐẶC BIỆT của Food
  category: "Food"
}

// Hiển thị trên UI
"Xoài Cát Chu - 80,000đ (HSD: 2026-03-25)"
```

---

**ĐIỂM QUAN TRỌNG:**

**1. Client KHÔNG biết concrete class:**

```javascript
// Client code (FactoryDemo.jsx)
const product = ProductFactory.createProduct(formData.type, ...);
// Client KHÔNG viết: new Electronics(...) hay new Clothing(...)
// Client CHỈ biết ProductFactory, KHÔNG import Electronics/Clothing/Food
```

**2. Factory là "người quyết định":**

```javascript
// Factory quyết định tạo class nào dựa trên type
switch(type) {
  case "electronics": return new Electronics(...);  // Factory biết
  case "clothing":    return new Clothing(...);     // Factory biết
  case "food":        return new Food(...);         // Factory biết
}
```

**3. Thêm loại mới rất dễ:**

```javascript
// Bước 1: Tạo class mới
class Book extends Product {
  constructor(name, price, author) {
    super(name, price);
    this.author = author;
    this.category = "Book";
  }
}

// Bước 2: Thêm case vào Factory
case "book":
  return new Book(name, price, extra);

// Bước 3: XONG! Client code KHÔNG cần sửa gì
```

---

**Cách hoạt động trên giao diện:**

1. Chọn **loại sản phẩm** từ dropdown (Electronics/Clothing/Food)
   - Form tự động thay đổi label field thứ 3:
     - Electronics → "Bảo hành (tháng)"
     - Clothing → "Size (S/M/L/XL)"
     - Food → "HSD (YYYY-MM-DD)"

2. Điền **tên sản phẩm**, **giá**, và **thông tin thêm**:
   - VD: type="electronics", name="iPhone 15", price=25000000, extra="12"

3. Click **"Tạo Sản Phẩm"** → Factory xử lý theo flow ở trên

4. Click **"Tạo Mẫu (3 sản phẩm)"** → Gọi Factory 3 lần với 3 types khác nhau

5. Danh sách sản phẩm hiển thị dưới dạng cards:
   - Mỗi card tự động hiển thị đúng thông tin theo loại
   - Electronics → hiện warranty
   - Clothing → hiện size
   - Food → hiện expiry

---

**Code implementation đầy đủ:**

```javascript
// Base Product class - interface chung
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

// Concrete class 1: Electronics
class Electronics extends Product {
  constructor(name, price, warranty) {
    super(name, price); // Gọi Product constructor
    this.warranty = warranty; // Thuộc tính riêng
    this.category = "Electronics";
  }

  getInfo() {
    return `${this.name} - ${this.price.toLocaleString()}đ (BH: ${this.warranty} tháng)`;
  }
}

// Concrete class 2: Clothing
class Clothing extends Product {
  constructor(name, price, size) {
    super(name, price);
    this.size = size; // Thuộc tính riêng
    this.category = "Clothing";
  }

  getInfo() {
    return `${this.name} - ${this.price.toLocaleString()}đ (Size: ${this.size})`;
  }
}

// Concrete class 3: Food
class Food extends Product {
  constructor(name, price, expiry) {
    super(name, price);
    this.expiry = expiry; // Thuộc tính riêng
    this.category = "Food";
  }

  getInfo() {
    return `${this.name} - ${this.price.toLocaleString()}đ (HSD: ${this.expiry})`;
  }
}

// Factory class - trung tâm quyết định
class ProductFactory {
  static createProduct(type, name, price, extra) {
    // Phân tích type và quyết định tạo class nào
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
}

// Client code - đơn giản, không biết concrete classes
const product = ProductFactory.createProduct(
  "electronics",
  "Laptop",
  15000000,
  "24",
);
console.log(product.getInfo()); // "Laptop - 15,000,000đ (BH: 24 tháng)"
```

**Ưu điểm:**

- **Giảm coupling:** Client không phụ thuộc vào concrete classes
- **Dễ mở rộng:** Thêm loại mới chỉ cần sửa Factory
- **Tập trung logic:** Tất cả logic tạo object ở 1 chỗ
- **Single Responsibility:** Mỗi class chỉ lo nhiệm vụ của mình
- **Open/Closed Principle:** Mở để mở rộng (thêm class mới), đóng để sửa đổi (client code không đổi)

**Nhược điểm:**

- Thêm class và code phức tạp hơn
- Có thể overkill cho ứng dụng đơn giản (chỉ 2-3 loại)
- Factory có thể trở nên phức tạp nếu có quá nhiều loại

**Khi nào nên dùng:**

- Có nhiều loại objects cùng interface
- Client không cần biết concrete class
- Cần thêm/xóa loại objects dễ dàng
- VD: Document Creator (PDF, Word, Excel), Vehicle Factory (Car, Bike, Truck), Shape Factory (Circle, Rectangle, Triangle)
