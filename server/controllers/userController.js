const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Assuming User model file path

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  // Getting the token from the header for JWT
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(' ')[1]
  console.log("Token:", token); // Log the token value
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  // Verify token see if its valid or not
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden" });
    }
    // set our user to the request when token valid
    // Identifier
    req.user = user;
    console.log(user)
    next();
  });
}

// Controller function to add an item to a user
async function addItem(req, res) {
    try {
      const username = req.user.username;
      console.log(username);
      console.log("Incoming request body:", req.body); // Log the incoming request body
      const user = await User.findOne({ username });
      console.log(user);
      if (!user) {
        throw new Error("User not found");
      }
  
      // Validate each item in the request body
      for (const item of req.body.items) {
        // Validate item properties
        if (!item.item_name || !item.expiryDays) {
          throw new Error("Item name and expiry days are required");
        }
  
        // Push the validated item to user's items array
        user.items.push(item);
      }
  
      // Save the user with updated items array
      await user.save();
      res.status(201).json({ message: "Items added successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

async function getUserItems(req, res) {
  try {
    const username = req.user.username;
    console.log(username);
    const user = await User.findOne({username}).populate("items");
    if (!user) {
      throw new Error("User not found");
    }
    res.status(200).json({ items: user.items });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deleteItem(req, res) {
  try {
    const username = req.user.username;
    const user = await User.findOne({username});
    if (!user) {
      throw new Error("User not found");
    }
    const itemId = req.params.itemId;
    user.items.pull({ _id: itemId });
    await user.save();
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function updateItem(req, res) {
  try {
    const username = req.user.username;
    const user = await User.findOne({username});
    if (!user) {
      throw new Error("User not found");
    }
    const itemId = req.params.itemId;
    const item = user.items.id(itemId);
    if (!item) {
      throw new Error("Item not found");
    }
    Object.assign(item, req.body);
    await user.save();
    res.status(200).json({ message: "Item updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  authenticateToken,
  addItem,
  getUserItems,
  deleteItem,
  updateItem,
};
