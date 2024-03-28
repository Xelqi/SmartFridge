const mongoose = require("mongoose");

const Schema = mongoose.Schema;

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
            }
          },
        ],
      }
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
            checked: {  // New field for checkbox status
              type: Boolean,
              default: false, // Default value is false (unchecked)
            }
          }
        ]
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
