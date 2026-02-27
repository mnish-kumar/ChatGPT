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
        config: {
            temperature: 0.7,
            systemInstruction: "You are a helpful assistant for answering user queries.",
        }
    });
    return responce.text;
} 


async function generateEmbedding(content) {
    
    const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: content,
        config:{
            outputDimensionality: 768
        }
    });

    return response.embeddings[0].values;
}


module.exports = {
    generateResponse,
    generateEmbedding
}