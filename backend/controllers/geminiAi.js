import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv"

dotenv.config()

console.log(process.env.API_KEY)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const AImodel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export {AImodel}