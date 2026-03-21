import axios from "axios";
import { model } from "mongoose";

export const askAi = async (message) => {
    try {
        if(!message || !Array.isArray(message) || message.length === 0) 
        {
            throw new Error("Message array is empty.");
        }
        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions",
        {
            model: "OpenAI: GPT-4o-mini",
            messages: message
        },
        {
        headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
        }});

        const content = response?.data?.choices?.[0]?.message?.content;

        if (!content || !content.trim()) {
            throw new Error("AI returned empty response.")
        }
        return content;
    } catch (error) {
        console.error("OpenRouter API Error:", error.response?.data || error.message);
        throw new Error("OpenRouter API ERROR");
    }
}