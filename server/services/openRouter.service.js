import axios from "axios";

class OpenRouterError extends Error {
  constructor(message, status = 500, code = "OPENROUTER_ERROR") {
    super(message);
    this.name = "OpenRouterError";
    this.status = status;
    this.code = code;
  }
}

export const askAi = async (message) => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  try {
    if (!message || !Array.isArray(message) || message.length === 0) {
      throw new OpenRouterError("Message array is empty.", 400, "INVALID_MESSAGE");
    }

    if (!apiKey) {
      throw new OpenRouterError(
        "OpenRouter API key is not configured on the server.",
        503,
        "OPENROUTER_NOT_CONFIGURED",
      );
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: process.env.OPENROUTER_MODEL || "google/gemma-4-31b-it:free",
        messages: message,
      },
      {
        headers: {
          Authorization: "Bearer " + apiKey,
          "Content-Type": "application/json",
          ...(process.env.OPENROUTER_SITE_URL
            ? { "HTTP-Referer": process.env.OPENROUTER_SITE_URL }
            : {}),
          ...(process.env.OPENROUTER_SITE_NAME
            ? { "X-Title": process.env.OPENROUTER_SITE_NAME }
            : {}),
        },
        timeout: 35000,
      },
    );

    const content = response?.data?.choices?.[0]?.message?.content;

    if (!content || !content.trim()) {
      throw new OpenRouterError("AI returned empty response.", 502, "EMPTY_AI_RESPONSE");
    }

    return content;
  } catch (error) {
    if (error instanceof OpenRouterError) {
      throw error;
    }

    if (error?.code === "ECONNABORTED") {
      throw new OpenRouterError("OpenRouter request timed out.", 504, "OPENROUTER_TIMEOUT");
    }

    const upstreamStatus = error?.response?.status;
    const upstreamMessage =
      error?.response?.data?.error?.message ||
      error?.response?.data?.message ||
      error?.message ||
      "OpenRouter API error";

    console.error("OpenRouter API Error:", error?.response?.data || error?.message);

    throw new OpenRouterError(
      `OpenRouter API error: ${upstreamMessage}`,
      upstreamStatus >= 400 && upstreamStatus < 600 ? upstreamStatus : 502,
      "OPENROUTER_API_ERROR",
    );
  }
};

export { OpenRouterError };
