const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = 3000;

app.use(express.json()); // for parsing application/json

// Configure Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Make sure you have GEMINI_API_KEY in your .env file
const model = genAI.geminiPro(); // or use gemini-pro-vision for multimodal if needed

app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const result = await model.generateContent(userMessage);
        const responseText = result.response.text();
        res.json({ response: responseText });
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: 'Failed to get response from Gemini API' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port http://localhost:${port}`);
});
