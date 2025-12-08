import dotenv from "dotenv";

dotenv.config();

export const config = {
    googleGenerativeAIApiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
    botbyteModel: process.env.BOTBYTE_MODEL || "gemini-2.5-flash",
};