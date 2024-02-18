const express = require("express");
const {
  authenticateToken,
  addItem,
  getUserItems,
  updateItem,
  deleteItem,
} = require("../controllers/userController");
const { register, login } = require("../controllers/authController");
const User = require("../models/user");

const router = express.Router();

// Register a new user
router.post("/register", register);

// Login an existing user
router.post("/login", login);

// Get user items
router.get("/", authenticateToken, getUserItems);

// Add an item for a user
router.post("/add-item", authenticateToken, addItem);

// Delete an item for a user
router.delete("/items/:itemId", authenticateToken, deleteItem);

// Update an item for a user
router.put("/items/:itemId", authenticateToken, updateItem);

module.exports = router;
