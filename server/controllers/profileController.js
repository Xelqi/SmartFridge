const User = require("../models/user"); // Assuming User model file path
const { generateNewToken } = require("../controllers/authController");

const getUserDetails = async (req, res) => {
  try {
    const _id = req.user._id;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const _id = req.user._id;
    const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      throw new Error("User not found");
    }
    
    // Generate new token
    const tokenData = await generateNewToken(updatedUser, res);

    // Return updated user data and token data
    res.status(200).json({ user: updatedUser, ...tokenData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const _id = req.user._id;
    const deletedUser = await User.findByIdAndDelete(_id);
    if (!deletedUser) {
      throw new Error("User not found");
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getUserDetails,
  updateUserDetails,
  deleteUser,
};
