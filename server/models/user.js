const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const userSchema = Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    fcmToken: {
      type: String,
      default: null,
    },
    storage: [
      {
        storage_name: {
          type: String,
          required: true,
        },
        items: [
          {
            item_name: {
              type: String,
              required: true,
            },
            category: {
              type: String,
              required: false,
            },
            expiryDays: {
              type: Number,
              required: true,
            },
            quantity: {
              type: Number,
              required: true,
            },
          },
        ],
        usersWithAccess: [
          {
            user: { type: Schema.Types.ObjectId, ref: "User" },
          },
        ],
      },
    ],
    otherStorages: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        storageId: { type: Schema.Types.ObjectId },
        permissions: {
          read: { type: Boolean, required: true },
          write: { type: Boolean, required: true },
        },
      },
    ],
    shopping_lists: [
      {
        list_name: {
          type: String,
          required: true,
        },
        items: [
          {
            item_name: {
              type: String,
              required: true,
            },
            quantity: {
              type: Number,
              required: true,
            },
            checked: {
              type: Boolean,
              default: false,
            },
          },
        ],
      },
    ],
    notifications: [notificationSchema], // Array of notification objects
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
