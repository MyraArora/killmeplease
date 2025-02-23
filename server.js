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
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        // Start a new chat
        const chat = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 8192,
            },
        });

        // Get message from request body
        const userMessage = req.body.contents?.[0]?.parts?.[0]?.text;
        
        if (!userMessage) {
            throw new Error('No message provided');
        }

        // Get response from Gemini
        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        const text = await response.text();

        // Send response back to client
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
        console.error('Server Error:', error);
        res.status(500).json({
            error: 'Server Error',
            message: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
