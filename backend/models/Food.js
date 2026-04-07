const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, "Please provide a food title"] 
  },
  description: String,
  quantity: { 
    type: String, 
    required: true // e.g., "5 kg" or "10 Plates"
  },
  location: { 
    type: String, 
    required: true 
  },
  
  // 🔗 LINKING TO USERS
  donorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  requestedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: null 
  },

  // 🆔 VERIFICATION & SECURITY (New Fields)
  // This stores the Aadhar number or a link to the uploaded ID file
  verificationDetails: { 
    type: String, 
    required: [true, "Donor verification info (Aadhar/ID) is required"] 
  },
  // The gatekeeper: false means NGOs cannot see this post yet
  isAdminApproved: { 
    type: Boolean, 
    default: false 
  },

  // 🍱 FOOD SAFETY & TYPE
  foodType: { 
    type: String, 
    enum: ['Veg', 'Non-Veg'], 
    required: true 
  },
  expiryTime: { 
    type: String, 
    required: true // e.g., "4 hours"
  },
  storageMethod: { 
    type: String, 
    enum: ['Refrigerated', 'Hot', 'Room Temp'],
    default: 'Room Temp'
  },
  isPacked: { 
    type: Boolean, 
    default: false 
  },
  cookedTime: { 
    type: Date, 
    default: Date.now 
  },

  // 🚦 STATUS MANAGEMENT
  status: { 
  type: String, 
  enum: ['available', 'Requested', 'Accepted', 'Collected', 'Expired'],
  default: "available" 
  }
}, { timestamps: true }); 

module.exports = mongoose.model("Food", FoodSchema);