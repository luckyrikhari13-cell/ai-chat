import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = "You are a helpful, friendly ai assistant in a terminal ";

export async function aiGemini(userMessage, onToken) {
  if (!userMessage || userMessage.trim() === "") {
    throw new Error("Empty input: cannot send a blank message please input message");
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in environment variables.");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  let fullText = "";

  const result = await model.generateContentStream(userMessage);

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) {
      fullText += text;
      if (onToken) onToken(text);
    }
  }

  return fullText;
}