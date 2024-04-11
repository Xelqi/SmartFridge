const admin = require("firebase-admin");
const serviceAccount = require("../ServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Add any other configurations if needed
});

const User = require("../models/user");

const updateUserFCMToken = async (req, res) => {
  try {
    const userId = req.user._id;
    const fcmToken = req.body.fcmToken;

    // Check if the user already has an FCM token
    const user = await User.findById(userId);
    if (user && user.fcmToken) {
      return res.status(200).json({ message: "User already has an FCM token" });
    }

    // If the user does not have a token, update it
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fcmToken: fcmToken },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    res.status(200).json({ message: "FCM token updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllFCMTokens = async (req, res) => {
  try {
    // Fetch all users from the database and retrieve their FCM tokens
    const users = await User.find({}, "fcmToken");

    const tokens = users.map((user) => user.fcmToken);

    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendNotificationToUser = async (userId, notification) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.fcmToken) {
      console.error("User not found or FCM token missing");
      return;
    }

    // Add the notification to the user's notifications array
    user.notifications.push(notification);
    await user.save();

    // Send the notification
    await admin.messaging().send({
      token: user.fcmToken,
      notification: {
        title: notification.title,
        body: notification.body,
      },
    });

    console.log("Notification sent to user:", user.username);
  } catch (error) {
    console.error("Error sending notification to user:", error);
  }
};

const sendNotificationToAllUsers = async () => {
  try {
    const users = await User.find({}, "fcmToken storage");

    for (const user of users) {
      let notificationBody = " ";

      // Iterate over storage sections
      for (const storage of user.storage) {
        let totalExpiringItems = 0;

        // Calculate the total number of expiring items for the storage
        for (const item of storage.items) {
          if (item.expiryDays <= 2) {
            totalExpiringItems += item.quantity;
          }
        }

        // Append storage name and expiring item count to the notification body
        notificationBody += `${totalExpiringItems} item(s) expiring in ${storage.storage_name}\n`;
      }

      // Send notification to the user with expiring items information
      await sendNotificationToUser(user._id, {
        title: "Expiring Items Notification",
        body: notificationBody,
      });
    }

    console.log("Notification sent to all users");
  } catch (error) {
    console.error("Error sending notification to all users:", error);
  }
};

const getNotificationsForUser = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the user and populate the notifications field
    const user = await User.findById(userId).populate("notifications");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ notifications: user.notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteNotificationForUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const notificationId = req.params.notificationId;
    console.log(notificationId);
    // Find the user and check if the notification exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const notificationIndex = user.notifications.findIndex(
      (notification) => notification._id.equals(notificationId)
    );

    if (notificationIndex === -1) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Remove the notification from the array
    user.notifications.splice(notificationIndex, 1);
    await user.save();

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  updateUserFCMToken,
  getAllFCMTokens,
  sendNotificationToAllUsers,
  getNotificationsForUser,
  deleteNotificationForUser,
};
