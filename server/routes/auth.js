const express = require("express")
const router = express.Router()
const User = require("../models/User")
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
    req.user = await User.findById(decoded.id)
    next()
  } catch (err) {
    return res.status(401).json({ message: "Not authorized to access this route" })
  }
}

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body

    // Check if user already exists
    const userExists = await User.findOne({ username })

    if (userExists) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create user
    const user = await User.create({
      username,
      password,
      role: "admin", // For demo purposes, all users are admins
    })

    // Generate token
    const token = user.getSignedJwtToken()

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    })
  } catch (err) {
    console.error("Registration error:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body

    // Check for user
    const user = await User.findOne({ username }).select("+password")

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Generate token
    const token = user.getSignedJwtToken()

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    })
  } catch (err) {
    console.error("Login error:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/auth/verify
// @desc    Verify token & get user
// @access  Private
router.get("/verify", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    })
  } catch (err) {
    console.error("Verification error:", err)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
