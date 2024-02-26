const express = require("express");
const {
  addStorage,
  getAllStorages,
  addItemToStorageByName,
  getItemsFromStorage,
  updateItem,
  deleteItem,
  deleteStorage,
  getOneItemFromStorage,
} = require("../controllers/userController");
const { register, login, logout, authenticateToken } = require("../controllers/authController");
const User = require("../models/user");

const router = express.Router();

// Register a new user
router.post("/register", register);

// Login an existing user
router.post("/login", login);

// Log out an existing user and clear cookies
router.post("/logout", logout);

// Add an storage for a user
router.post("/add-storage", authenticateToken, addStorage);

router.delete("/:storage_name", authenticateToken, deleteStorage)

// Get all storages
router.get("/get-all-storage", authenticateToken, getAllStorages);

// Get user items
router.get("/:storage_name", authenticateToken, getItemsFromStorage);

// Get one item from a storage
router.get('/:storage_name/:item_id', authenticateToken, getOneItemFromStorage);

// Add an item for a user
router.post("/add-item/:storage_name", authenticateToken, addItemToStorageByName);

// Delete an item for a user
router.delete("/:storage_name/:itemId", authenticateToken, deleteItem);

// Update an item for a user
router.put("/:storage_name/:itemId", authenticateToken, updateItem);

module.exports = router;
