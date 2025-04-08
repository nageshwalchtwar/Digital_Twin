const mongoose = require("mongoose")

const NodeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a node name"],
    trim: true,
  },
  lat: {
    type: Number,
    required: [true, "Please provide latitude"],
  },
  lng: {
    type: Number,
    required: [true, "Please provide longitude"],
  },
  status: {
    type: String,
    enum: ["active", "warning", "critical"],
    default: "active",
  },
  voltage: {
    type: Number,
    default: () => Math.floor(Math.random() * 50) + 200, // 200-250V
  },
  current: {
    type: Number,
    default: () => Math.random() * 10, // 0-10A
  },
  temperature: {
    type: Number,
    default: () => Math.floor(Math.random() * 30) + 20, // 20-50°C
  },
  motorStatus: {
    type: Boolean,
    default: () => Math.random() > 0.3, // 70% chance of being on
  },
  lastMaintenance: {
    type: Date,
    default: () => new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
  },
  alerts: {
    type: [String],
    default: () => (Math.random() > 0.7 ? ["High temperature", "Voltage fluctuation"] : []),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Node", NodeSchema)
