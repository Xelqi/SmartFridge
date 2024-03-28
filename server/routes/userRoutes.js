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

const {
  register,
  login,
  logout,
  authenticateToken,
} = require("../controllers/authController");
const User = require("../models/user");

const router = express.Router();

// Register a new user
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);


router.post("/add-storage", authenticateToken, addStorage);
router.delete("/:storage_name", authenticateToken, deleteStorage);
router.get("/get-all-storage", authenticateToken, getAllStorages);
router.get("/:storage_name", authenticateToken, getItemsFromStorage);
router.get("/:storage_name/:item_id", authenticateToken, getOneItemFromStorage);
router.post("/add-item/:storage_name", authenticateToken, addItemToStorageByName);
router.delete("/:storage_name/:itemId", authenticateToken, deleteItem);
router.put("/:storage_name/:itemId", authenticateToken, updateItem);



module.exports = router;
