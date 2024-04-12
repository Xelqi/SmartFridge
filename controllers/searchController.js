const User = require("../models/user"); // Assuming User model file path

async function searchUsers(req, res) {
  try {
    const { username } = req.query; // Extract username from query parameters
    if (!username) {
      throw new Error("Username parameter is required");
    }

    // Exclude the current user from the search results
    const currentUserID = req.user._id; // Assuming req.user contains the current user's information
    const users = await User.find({
      _id: { $ne: currentUserID }, // Exclude documents with the current user's _id
      username: { $regex: new RegExp(username, "i") },
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  searchUsers
};