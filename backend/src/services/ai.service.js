const { GoogleGenAI } =  require("@google/genai");

if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set in environment variables.");
    process.exit(1);
}

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function generateResponse(content) {
    const responce = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL_NAME,
        contents: content,
    });
    return responce.text;
}       


module.exports = {
    generateResponse
}