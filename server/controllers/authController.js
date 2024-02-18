// controller/authController.js
require('dotenv').config()
const jwt = require('jsonwebtoken');
const User = require('../models/user');

async function register(req, res) {
    try {
        const { username, email, password } = req.body;
        // Initialize the user with an empty array for items
        const user = new User({ username, email, password, items: [] });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            throw new Error('Invalid email or password');
        }
        console.log(user);
        const token = jwt.sign({username: user.username}, process.env.ACCESS_TOKEN_SECRET);
        res.status(200).json({ token });
    } catch (error) {
        res.status(401).json({ error: error.message});
    }
}

module.exports = { register, login };
