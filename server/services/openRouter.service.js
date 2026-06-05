import axios from "axios";

const DEFAULT_OPENROUTER_MODEL = "deepseek/deepseek-chat-v3-0324:free";

export const askAi = async (message) => {
    try {
        if(!message || !Array.isArray(message) || message.length === 0) 
        {
            throw new Error("Message array is empty.");
        }
        const model = process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL;

        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions",
        {
            model,
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
        const errorMessage = error.response?.data?.error?.message || error.response?.data?.message || error.message;
        console.error("OpenRouter API Error:", error.response?.data || error.message);
        throw new Error(errorMessage || "OpenRouter API ERROR");
    }
}