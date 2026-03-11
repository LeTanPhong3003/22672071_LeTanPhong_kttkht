# Design Patterns Demo - Singleton & Factory

> **Sinh viên:** Lê Tấn Phong  
> **MSSV:** 22672071  
> **Môn:** Kiến trúc và thiết kế hệ thống

## 📋 Giới thiệu

Project này minh họa hai mẫu thiết kế (Design Patterns) phổ biến trong lập trình:

- **Singleton Pattern**: Đảm bảo một class chỉ có duy nhất một instance
- **Factory Pattern**: Tạo đối tượng thông qua một factory class thay vì khởi tạo trực tiếp

Ứng dụng được xây dựng bằng **React + Vite** với giao diện tương tác để demo các pattern.

## 🚀 Cài đặt và Chạy Project

### Yêu cầu hệ thống

- **Node.js**: phiên bản 16.x trở lên
- **npm** hoặc **yarn**

### Bước 1: Clone hoặc tải project

```bash
cd week2/singleton_factory
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

Hoặc sử dụng yarn:

```bash
yarn install
```

### Bước 3: Chạy ứng dụng ở chế độ development

```bash
npm run dev
```

Hoặc:

```bash
yarn dev
```

Ứng dụng sẽ chạy tại: **http://localhost:3000**

### Bước 4: Build cho production

```bash
npm run build
```

Sau khi build, xem preview:

```bash
npm run preview
```

## 📂 Cấu trúc Project

```
singleton_factory/
├── index.html              # File HTML chính
├── package.json            # Dependencies và scripts
├── vite.config.js          # Cấu hình Vite
└── src/
    ├── App.jsx             # Component chính, điều hướng giữa các pattern
    ├── index.jsx           # Entry point của React
    ├── index.css           # Styles
    ├── singleton/
    │   ├── DatabaseConnection.js    # Singleton class
    │   └── SingletonDemo.jsx        # Demo UI cho Singleton
    └── factory/
        ├── ProductFactory.js        # Factory class
        └── FactoryDemo.jsx          # Demo UI cho Factory
```
