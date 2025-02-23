const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini exactly as in docs
const genAI = new GoogleGenerativeAI("AIzaSyDStcNe3GZcGCdvV3wJAlM9kEzOfJnX0qQ");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/api/chat', async (req, res) => {
    try {
        // Get message from request
        const prompt = req.body.message;
        
        // Generate content exactly as in docs
        const result = await model.generateContent(prompt);
        const response = await result.response.text();
        
        // Send response
        res.json({ response: response });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
