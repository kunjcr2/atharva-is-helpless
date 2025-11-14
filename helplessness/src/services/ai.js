import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.warn("Missing VITE_GEMINI_API_KEY – set it in .env");
}

const ai = new GoogleGenAI({ apiKey });

const SYSTEM_PROMPT = `You are a helpful, intelligent, and friendly assistant. 
You provide clear, accurate, and thoughtful responses. 
You ask clarifying questions when needed and explain your reasoning.
You are concise but thorough in your answers.
NO MARKDOWN.`;

// Message shape: { role: 'user' | 'model', content: string }
export async function* streamChat(messages) {
  // Send full conversation history for proper context
  const model = "gemini-2.5-flash"; // fast chat model

  // Convert messages to Gemini API format
  const contents = messages.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));

  try {
    const stream = await ai.models.generateContentStream({
      model,
      contents,
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
      },
    });

    for await (const chunk of stream) {
      if (chunk?.text) yield chunk.text;
    }
  } catch (error) {
    if (error.message?.includes("API key")) {
      throw new Error(
        "Invalid or missing API key. Please check your VITE_GEMINI_API_KEY."
      );
    }
    throw error;
  }
}
