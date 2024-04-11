// routes/notification.js

const express = require("express");
const router = express.Router();
const { updateUserFCMToken, getAllFCMTokens, sendNotificationToAllUsers, getNotificationsForUser, deleteNotificationForUser  } = require("../controllers/notificationController");
const { authenticateToken } = require("../controllers/authController");

router.put("/fcmToken", authenticateToken, updateUserFCMToken);
router.get("/fcmTokens", authenticateToken, getAllFCMTokens);
// Route to send notifications to all users (without authentication)
router.post("/send-notifications", async (req, res) => {
    try {
      // Call the function to send notifications to all users
      await sendNotificationToAllUsers();
      res.status(200).json({ message: "Notifications sent to all users" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.get("/fetch-notifications", authenticateToken, getNotificationsForUser);
router.delete("/:notificationId", authenticateToken, deleteNotificationForUser);

module.exports = router;
