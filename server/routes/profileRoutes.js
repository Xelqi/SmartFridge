const express = require("express");
const {
  getUserDetails,
  updateUserDetails,
  deleteUser,
} = require("../controllers/profileController");
const { authenticateToken, generateNewToken  } = require("../controllers/authController");

const router = express.Router();

router.get("/", authenticateToken, getUserDetails);
router.put("/", authenticateToken, updateUserDetails);
router.delete("/", authenticateToken, deleteUser);

module.exports = router;
