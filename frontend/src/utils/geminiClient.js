// geminiClient.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your actual Gemini API key
const GEMINI_API_KEY = "AIzaSyAVwzA-xWvohSyfMugQlFpvCHfyq7aTv2g";

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

