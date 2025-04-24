// const express = require('express');
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
// require('dotenv').config();

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(express.json()); // Middleware to parse JSON request bodies

// const apiKey = process.env.API_KEY;
// const modelName = process.env.MODEL_NAME || 'gemini-pro'; // Default to gemini-pro

// async function generateGeminiResponse(prompt) {
//     try {
//         const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 contents: [{ role: 'user', parts: [{ text: prompt }] }],
//             }),
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             console.error('Gemini API error:', errorData);
//             throw new Error(`Gemini API error: ${errorData?.error?.message || response.statusText}`);
//         }

//         const data = await response.json();
//         return data.candidates?.[0]?.content?.parts?.[0]?.text;

//     } catch (error) {
//         console.error('Error calling Gemini API:', error);
//         throw error;
//     }
// }

// function formatMajorDataToJson(text) {
//     const factors = [];
//     const lines = text.split('\n');
//     let currentFactor = null;

//     for (const line of lines) {
//         const factorMatch = line.match(/^\* (\d+\. )(.+)$/);
//         if (factorMatch) {
//             if (currentFactor) {
//                 factors.push(currentFactor);
//             }
//             currentFactor = {
//                 id: factorMatch[1].trim(),
//                 name: factorMatch[2].trim(),
//                 insights: [],
//                 dataPoints: []
//             };
//             continue;
//         }

//         const insightMatch = line.match(/^\s*\*\s*Insight:\s*(.+)$/);
//         if (insightMatch && currentFactor) {
//             currentFactor.insights.push(insightMatch[1].trim());
//             continue;
//         }

//         const dataPointMatch = line.match(/^\s*\*\s*Data Point:\s*(.+)$/);
//         if (dataPointMatch && currentFactor) {
//             currentFactor.dataPoints.push(dataPointMatch[1].trim());
//             continue;
//         }
//     }

//     if (currentFactor) {
//         factors.push(currentFactor);
//     }

//     return { criticalSuccessFactors: factors };
// }

// // Endpoint 1: /api/gemini/all - For processing a general prompt
// app.post('/api/gemini/all', async (req, res) => {
//     try {
//         const { prompt } = req.body;
//         if (!prompt || !apiKey) {
//             return res.status(400).json({ error: 'Prompt and API key are required' });
//         }

//         const aiResponse = await generateGeminiResponse(prompt);
//         if (aiResponse) {
//             res.json({ data: aiResponse });
//         } else {
//             res.status(500).json({ error: 'No response from Gemini' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to process prompt', details: error.message });
//     }
// });

// // Endpoint 2: /api/gemini/major - For processing a prompt focused on major data
// app.post('/api/gemini/major', async (req, res) => {
//     try {
//         const { prompt } = req.body;
//         if (!prompt || !apiKey) {
//             return res.status(400).json({ error: 'Prompt and API key are required' });
//         }

//         const aiResponse = await generateGeminiResponse(`Focus on key insights and major data points when responding to the following: ${prompt}`);
//         if (aiResponse) {
//             const jsonData = formatMajorDataToJson(aiResponse);
//             res.json(jsonData);
//         } else {
//             res.status(500).json({ error: 'No response from Gemini' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to process major data prompt', details: error.message });
//     }
// });

// app.listen(port, () => {
//     console.log(`Server listening on port ${port}`);
// });


const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

const apiKey = process.env.API_KEY;
const modelName = process.env.MODEL_NAME || 'gemini-pro'; // Default to gemini-pro

// Endpoint 1: /api/gemini/all - For processing a general prompt
app.post('/api/gemini/all', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt || !apiKey) {
            return res.status(400).json({ error: 'Prompt and API key are required' });
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API error:', errorData);
            return res.status(response.status).json({ error: `Gemini API error: ${errorData?.error?.message || response.statusText}` });
        }

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (aiResponse) {
            res.json({ data: aiResponse });
        } else {
            res.status(500).json({ error: 'No response from Gemini' });
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ error: 'Failed to process prompt' });
    }
});

// Endpoint 2: /api/gemini/major - For processing a prompt focused on major data
app.post('/api/gemini/major', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt || !apiKey) {
            return res.status(400).json({ error: 'Prompt and API key are required' });
        }

        const enhancedPrompt = `Focus on key insights and major data points when responding to the following: ${prompt}`;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
           
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: enhancedPrompt }] }],
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API error (major):', errorData);
            return res.status(response.status).json({ error: `Gemini API error: ${errorData?.error?.message || response.statusText}` });
        }

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (aiResponse) {
            res.json({ majorData: aiResponse });
        } else {
            res.status(500).json({ error: 'No response from Gemini' });
        }
    } catch (error) {
        console.error('Error calling Gemini API (major):', error);
        res.status(500).json({ error: 'Failed to process major data prompt' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});