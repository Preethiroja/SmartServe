const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const Food = require('../models/Food');
const protect = require('../middleware/authMiddleware');

// 🚩 NGO: Submit a Complaint
router.post('/', protect, async (req, res) => {
  try {
    const { foodId, reason } = req.body;

    // Find the food to get the donorId automatically
    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ message: "Food record not found" });

    const newComplaint = new Complaint({
      foodId,
      ngoId: req.user.id,
      donorId: food.donorId,
      reason
    });

    await newComplaint.save();
    res.status(201).json({ message: "Complaint filed. Admin will review this." });
  } catch (err) {
    res.status(500).json({ message: "Failed to file complaint" });
  }
});

// 👮 ADMIN: View all complaints
router.get('/admin', protect, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: "Denied" });
  
  const complaints = await Complaint.find()
    .populate('foodId', 'title')
    .populate('ngoId', 'name email')
    .populate('donorId', 'name email');
  res.json(complaints);
});

module.exports = router;