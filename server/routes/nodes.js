const express = require("express")
const router = express.Router()
const Node = require("../models/Node")
const jwt = require("jsonwebtoken")

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized to access this route" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret")
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: "Not authorized to access this route" })
  }
}

// Apply protection middleware to all routes
router.use(protect)

// @route   GET /api/nodes
// @desc    Get all nodes
// @access  Private
router.get("/", async (req, res) => {
  try {
    const nodes = await Node.find().sort({ createdAt: -1 })
    res.json(nodes)
  } catch (err) {
    console.error("Error fetching nodes:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/nodes/:id
// @desc    Get node by ID
// @access  Private
router.get("/:id", async (req, res) => {
  try {
    const node = await Node.findById(req.params.id)

    if (!node) {
      return res.status(404).json({ message: "Node not found" })
    }

    res.json(node)
  } catch (err) {
    console.error("Error fetching node:", err)

    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Node not found" })
    }

    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/nodes
// @desc    Create a node
// @access  Private
router.post("/", async (req, res) => {
  try {
    const newNode = new Node(req.body)
    const node = await newNode.save()
    res.status(201).json(node)
  } catch (err) {
    console.error("Error creating node:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/nodes/:id
// @desc    Update a node
// @access  Private
router.put("/:id", async (req, res) => {
  try {
    const node = await Node.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!node) {
      return res.status(404).json({ message: "Node not found" })
    }

    res.json(node)
  } catch (err) {
    console.error("Error updating node:", err)

    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Node not found" })
    }

    res.status(500).json({ message: "Server error" })
  }
})

// @route   PATCH /api/nodes/:id/status
// @desc    Update node status
// @access  Private
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body

    if (!status || !["active", "warning", "critical"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" })
    }

    const node = await Node.findByIdAndUpdate(req.params.id, { status }, { new: true })

    if (!node) {
      return res.status(404).json({ message: "Node not found" })
    }

    res.json(node)
  } catch (err) {
    console.error("Error updating node status:", err)

    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Node not found" })
    }

    res.status(500).json({ message: "Server error" })
  }
})

// @route   DELETE /api/nodes/:id
// @desc    Delete a node
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const node = await Node.findById(req.params.id)

    if (!node) {
      return res.status(404).json({ message: "Node not found" })
    }

    await node.remove()
    res.json({ message: "Node removed" })
  } catch (err) {
    console.error("Error deleting node:", err)

    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Node not found" })
    }

    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
