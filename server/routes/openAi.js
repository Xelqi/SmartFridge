require('dotenv').config();
const express = require('express');
const router = express.Router();
const openai = require('../config/openAiConfig');


// Handle POST requests to '/api/process-text'
router.post('/process-text', async (req, res) => {
    const extractedText = req.body.text;

    console.log(extractedText);

    // Process the extracted text using OpenAI
    const openaiResponse = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-1106',
    messages: [
        {
        role: 'system',
        content: 'Recognise edible food Items. Categorise the items and give them a expected expiry time in days as a number, if items occur multiple times add 1 to the amount. Provide the output as a JSON object with the following format: { "food_items": [{ "name": string, "category": string, "expiry_date": int, "quantity": int }] } so its parseable',
        },
        {
        role: 'user',
        content: 'Here is my message it may contain mistakes assume what the items are if you are unsure : ' + extractedText,
        },
    ],
    });

    // Get the response from OpenAI
    // content is only json part 
    const openaiJsonResponse = openaiResponse.choices[0].message.content;
    console.log(openaiJsonResponse);

    // Send the OpenAI response to the client
    res.json({ openaiJsonResponse });
});

module.exports = router;