//  Import mongoose to create Schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Creating a schema for a user and their items
const userSchema = Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Ensure usernames are unique
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure emails are unique
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
    ]
  },
  { timestamps: true }
);

// Exporting the model to interact with in API
module.exports = mongoose.model("User", userSchema);