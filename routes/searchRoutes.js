const express = require("express");
const router = express.Router();
const { searchUsers } = require("../controllers/searchController");

const { authenticateToken } = require("../controllers/authController");

router.get("/find", authenticateToken, searchUsers);

module.exports = router;
