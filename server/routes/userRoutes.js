const express = require("express");
const {
  addStorage,
  getAllStorages,
  addItemToStorageById,
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
router.delete("/:storage_id", authenticateToken, deleteStorage);
router.get("/get-all-storage", authenticateToken, getAllStorages);
router.get("/:storage_id", authenticateToken, getItemsFromStorage);
router.get("/:storage_id/:item_id", authenticateToken, getOneItemFromStorage);
router.post("/add-item/:storage_id", authenticateToken, addItemToStorageById);
router.delete("/:storage_id/:item_id", authenticateToken, deleteItem);
router.put("/:storage_id/:item_id", authenticateToken, updateItem);



module.exports = router;
