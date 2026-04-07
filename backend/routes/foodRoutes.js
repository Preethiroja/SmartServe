const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const protect = require('../middleware/authMiddleware');

// 🏨 1. DONOR: Post Food (Requires Admin Approval)
router.post('/', protect, async (req, res) => {
  try {
    const { 
      title, description, quantity, location, 
      foodType, expiryTime, storageMethod, isPacked, verificationDetails 
    } = req.body;

    const newFood = new Food({
      title,
      description,
      quantity,
      location,
      foodType,
      expiryTime,
      storageMethod,
      isPacked,
      verificationDetails, // From your updated model
      donorId: req.user.id,
      isAdminApproved: false, // 🔒 NGOs can't see this yet
      status: 'available'
    });

    const savedFood = await newFood.save();
    res.status(201).json({ message: "Post sent for Admin Approval!", data: savedFood });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error listing food. Check all required fields." });
  }
});

// 🤝 2. NGO: List ONLY Approved Available Food
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find({ 
      status: 'available', 
      isAdminApproved: true // ✅ Only show verified posts
    })
    .populate('donorId', 'name email') 
    .sort({ createdAt: -1 });

    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: "Error fetching food list" });
  }
});

// 🛡️ 3. NGO: Request/Accept Food
router.post('/request/:id', protect, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    
    if (!food) return res.status(404).json({ message: "Food not found" });
    if (food.status !== 'available' || !food.isAdminApproved) {
        return res.status(400).json({ message: "Food unavailable or not yet approved" });
    }

    food.requestedBy = req.user.id;
    food.status = "Accepted";
    
    await food.save();
    res.json({ message: "Food successfully reserved for pickup!" });
  } catch (err) {
    res.status(500).json({ message: "Request failed" });
  }
});

// 📜 4. EVERYONE: History (Fixed Logic)
router.get('/history', protect, async (req, res) => {
  try {
    // Donors see everything they posted
    // NGOs only see what they have successfully 'Requested'
    const query = req.user.role === 'donor' 
      ? { donorId: req.user.id } 
      : { requestedBy: req.user.id};

    const history = await Food.find(query)
      .populate('donorId', 'name email')
      .populate('requestedBy', 'name email')
      .sort({ updatedAt: -1 });
      
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history" });
  }
});

// 👮 5. ADMIN: View All Food (For Approval/Moderation)
router.get('/admin', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required." });
    }

    const allFood = await Food.find()
      .populate('donorId', 'name email')
      .populate('requestedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(allFood);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ 6. ADMIN: Approve a Post
router.patch('/approve/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: "Access denied" });

    const food = await Food.findByIdAndUpdate(
        req.params.id, 
        { isAdminApproved: true }, 
        { new: true }
    );
    res.json({ message: "Food approved and is now visible to NGOs!", food });
  } catch (err) {
    res.status(500).json({ message: "Approval failed" });
  }
});

module.exports = router;