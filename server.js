const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize Gemini
const genAI = new GoogleGenerativeAI('AIzaSyDStcNe3GZcGCdvV3wJAlM9kEzOfJnX0qQ');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Changed to pro model for better stability

// Detailed request logging middleware
app.use((req, res, next) => {
    if (req.path === '/api/chat') {
        console.log('Incoming request body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        console.log('Processing chat request...');

        if (!req.body || !req.body.contents) {
            throw new Error('Invalid request format: missing contents');
        }

        const userMessage = req.body.contents[0]?.parts[0]?.text;
        console.log('Extracted user message:', userMessage);

        if (!userMessage) {
            throw new Error('No message text found in request');
        }

        // Send message to Gemini
        const result = await model.generateContent(userMessage);
        const response = await result.response;
        const text = response.text();

        console.log('Gemini response received:', text);

        // Send formatted response
        res.json({
            candidates: [{
                content: {
                    parts: [{
                        text: text
                    }]
                }
            }]
        });

    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({
            error: true,
            message: error.message,
            stack: error.stack
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Using Gemini model: gemini-1.5-pro`);
});
