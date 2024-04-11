const express = require("express");
const router = express.Router();
const {
  addUserToSeeMyStorage,
  removeUserFromMyStorage,
  changePermissionsOfOtherUser,
  changePermissionsOfUserToWrite,
  getStoragesFromOtherUserStorages,
  addManyItemsToOtherUserStorage,
  removeItemFromOtherUserStorage,
  updateItemInOtherUserStorage,
  leaveOtherUsersStorage,
} = require("../controllers/sharedStorageController");
const { authenticateToken } = require("../controllers/authController");

// Add user to see my storage
router.post("/add-user", authenticateToken, addUserToSeeMyStorage);

// Remove user from my storage
router.delete("/remove-user", authenticateToken, removeUserFromMyStorage);

// Change permissions of other user to read-only
router.put("/read-only", authenticateToken, changePermissionsOfOtherUser);

// Change permissions of other user to write
router.put("/write-only", authenticateToken, changePermissionsOfUserToWrite);

// Get storages from other user storages
router.get("/storages", authenticateToken, getStoragesFromOtherUserStorages);

// Add many items to other user's storage
router.post("/add-to-storage", authenticateToken, addManyItemsToOtherUserStorage);

// Remove item from other user's storage
router.delete("/remove-item", authenticateToken, removeItemFromOtherUserStorage);

// Update item in other user's storage
router.put("/update-item", authenticateToken, updateItemInOtherUserStorage);

// Leave other user's storage
router.delete("/leave-storage", authenticateToken, leaveOtherUsersStorage);

module.exports = router;
