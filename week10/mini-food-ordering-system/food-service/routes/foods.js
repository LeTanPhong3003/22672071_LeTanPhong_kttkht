const express = require('express');
const router = express.Router();

// In-memory database with seed data
let foods = [
  {
    id: 1,
    name: 'Bánh mì cà chua',
    description: 'Bánh mì nước ngoài kèm cà chua tươi',
    price: 25000,
    category: 'bánh mì',
    image: 'https://via.placeholder.com/300x200?text=Banh+Mi',
    available: true,
    createdAt: new Date()
  },
  {
    id: 2,
    name: 'Phở bò',
    description: 'Phở bò nóng hổi với nước dùng thơm ngon',
    price: 35000,
    category: 'phở',
    image: 'https://via.placeholder.com/300x200?text=Pho+Bo',
    available: true,
    createdAt: new Date()
  },
  {
    id: 3,
    name: 'Cơm tấm sườn',
    description: 'Cơm tấm kèm sườn nướng giòn rụm',
    price: 40000,
    category: 'cơm',
    image: 'https://via.placeholder.com/300x200?text=Com+Tam',
    available: true,
    createdAt: new Date()
  },
  {
    id: 4,
    name: 'Bún chả',
    description: 'Bún chả Hà Nội truyền thống',
    price: 30000,
    category: 'bún',
    image: 'https://via.placeholder.com/300x200?text=Bun+Cha',
    available: true,
    createdAt: new Date()
  },
  {
    id: 5,
    name: 'Cơm chiên dương châu',
    description: 'Cơm chiên với thịt, trứng, rau đủ dinh dưỡng',
    price: 35000,
    category: 'cơm',
    image: 'https://via.placeholder.com/300x200?text=Com+Chien',
    available: true,
    createdAt: new Date()
  }
];

let idCounter = 6;

// Get all foods
router.get('/', (req, res) => {
  try {
    console.log(`✓ Get all foods: ${foods.length} foods found`);
    res.json({
      success: true,
      data: foods,
      count: foods.length
    });
  } catch (error) {
    console.error('Get foods error:', error);
    res.status(500).json({ error: 'Không thể lấy danh sách món ăn' });
  }
});

// Get food by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const food = foods.find(f => f.id === parseInt(id));

    if (!food) {
      return res.status(404).json({ error: 'Món ăn không tồn tại' });
    }

    console.log(`✓ Get food: ${food.name}`);
    res.json({ success: true, data: food });
  } catch (error) {
    console.error('Get food error:', error);
    res.status(500).json({ error: 'Không thể lấy thông tin món ăn' });
  }
});

// Create new food (ADMIN only)
router.post('/', (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, và category không được để trống' });
    }

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ error: 'Price phải là số dương' });
    }

    const newFood = {
      id: idCounter++,
      name,
      description: description || '',
      price,
      category,
      image: image || 'https://via.placeholder.com/300x200?text=Food',
      available: true,
      createdAt: new Date()
    };

    foods.push(newFood);
    console.log(`✓ Food created: ${name} (ID: ${newFood.id})`);

    res.status(201).json({
      success: true,
      message: 'Thêm món ăn thành công',
      data: newFood
    });
  } catch (error) {
    console.error('Create food error:', error);
    res.status(500).json({ error: 'Không thể thêm món ăn' });
  }
});

// Update food (ADMIN only)
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image, available } = req.body;

    const foodIndex = foods.findIndex(f => f.id === parseInt(id));

    if (foodIndex === -1) {
      return res.status(404).json({ error: 'Món ăn không tồn tại' });
    }

    // Update only provided fields
    if (name) foods[foodIndex].name = name;
    if (description) foods[foodIndex].description = description;
    if (price) {
      if (isNaN(price) || price <= 0) {
        return res.status(400).json({ error: 'Price phải là số dương' });
      }
      foods[foodIndex].price = price;
    }
    if (category) foods[foodIndex].category = category;
    if (image) foods[foodIndex].image = image;
    if (available !== undefined) foods[foodIndex].available = available;

    console.log(`✓ Food updated: ${foods[foodIndex].name}`);
    res.json({
      success: true,
      message: 'Cập nhật món ăn thành công',
      data: foods[foodIndex]
    });
  } catch (error) {
    console.error('Update food error:', error);
    res.status(500).json({ error: 'Không thể cập nhật món ăn' });
  }
});

// Delete food (ADMIN only)
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const foodIndex = foods.findIndex(f => f.id === parseInt(id));

    if (foodIndex === -1) {
      return res.status(404).json({ error: 'Món ăn không tồn tại' });
    }

    const deletedFood = foods.splice(foodIndex, 1);
    console.log(`✓ Food deleted: ${deletedFood[0].name}`);

    res.json({
      success: true,
      message: 'Xóa món ăn thành công',
      data: deletedFood[0]
    });
  } catch (error) {
    console.error('Delete food error:', error);
    res.status(500).json({ error: 'Không thể xóa món ăn' });
  }
});

module.exports = router;
