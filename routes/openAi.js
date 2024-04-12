require("dotenv").config();
const express = require("express");
const router = express.Router();
const openai = require("../config/openAiConfig");

// Handle POST requests to '/api/process-text'
router.post("/process-text", async (req, res) => {
  const extractedText = req.body.text;

  // console.log(extractedText);

  // Process the extracted text using OpenAI
  const openaiResponse = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          'Categorise the items even and give them a expected expiry time in days as a number, if items occur multiple times add 1 to the amount if an item has no expiry give it 999. Provide the output as a JSON object with the following format: { "items": [{ "item_name": string, "category": string, "expiryDays": int, "quantity": int }] } so its parseable.',
      },
      {
        role: "user",
        content:
          "Here is my message. It may contain mistakes. Assume what the items are if you are unsure: " +
          extractedText,
      },
    ],
    seed: 2, // Include the seed parameter here
  });

  // Get the response from OpenAI
  // content is only json part
  const openaiJsonResponse = openaiResponse.choices[0].message.content;
  // console.log(openaiJsonResponse);
  // Remove the surrounding ```json``` code block and escape newline characters
  const cleanedResponse = openaiJsonResponse
    .replace(/```json\n|```/g, "")
    .replace(/\n/g, "");
  // Send the cleaned OpenAI response to the client as a JSON object
  // console.log(cleanedResponse);
  res.json(JSON.parse(cleanedResponse));
});

module.exports = router;
