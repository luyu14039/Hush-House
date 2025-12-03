import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuration
const API_KEY = 'sk-1c8f763b0a0340c5945bcd28cffed101';
const API_URL = 'https://api.deepseek.com/v3.2_speciale_expires_on_20251215/chat/completions';
const MODEL_NAME = 'deepseek-reasoner';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testDeepSeek() {
    console.log("Testing DeepSeek API connection...");

    const payload = {
        model: MODEL_NAME,
        messages: [
            { role: "system", content: "You are a JSON generator. Output a simple JSON object." },
            { role: "user", content: "Return a JSON with a greeting key." }
        ]
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`API Error: ${response.status} ${response.statusText} - ${errText}`);
        }

        const data = await response.json();
        console.log("API Response Status: OK");
        console.log("Full Response Structure:", JSON.stringify(data, null, 2));

        let content = data.choices[0].message.content;
        console.log("\nRaw Content:", content);

        // Test Extraction Logic
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}');
        
        if (jsonStart !== -1 && jsonEnd !== -1) {
            content = content.substring(jsonStart, jsonEnd + 1);
            console.log("\nExtracted JSON String:", content);
            const parsed = JSON.parse(content);
            console.log("Parsed JSON:", parsed);
            console.log("Test Passed!");
        } else {
            console.error("Test Failed: Could not find JSON in output.");
        }

    } catch (error) {
        console.error("Test Failed with Error:", error);
    }
}

testDeepSeek();
