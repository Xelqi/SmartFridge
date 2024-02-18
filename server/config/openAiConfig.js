require("dotenv").config();
const OpenAI = require('openai');

// Setting up openi 
const openai = new OpenAI({apiKey: process.env.OPEN_AI_KEY});

module.exports = openai;