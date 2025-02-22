const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const apiKey = 'AIzaSyDStcNe3GZcGCdvV3wJAlM9kEzOfJnX0qQ';
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "tunedModels/periodpal-v001-1wlehidxwo3m",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

app.post('/api/chat', async (req, res) => {
    try {
        const chatSession = model.startChat({
            generationConfig,
            history: req.body.history || [],
        });

        // Extract message from the Gemini-style request format
        let userMessage;
        if (req.body.contents && Array.isArray(req.body.contents)) {
            userMessage = req.body.contents[0]?.parts[0]?.text;
        } else {
            userMessage = req.body.message;
        }

        if (!userMessage) {
            throw new Error('No message content provided');
        }

        const result = await chatSession.sendMessage(userMessage);
        const responseText = await result.response.text();
        
        // Format response to match Gemini API format
        res.json({
            candidates: [{
                content: {
                    parts: [{
                        text: responseText
                    }]
                }
            }]
        });
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ 
            error: "Server error",
            details: error.toString(),
            stack: error.stack 
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});