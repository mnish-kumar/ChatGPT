const { GoogleGenAI } = require("@google/genai");
const utils = require("../../utils/stream.helper");
const userModel = require("../../models/user/user.model");
const { getPlanLimits } = require("./prompt.service");
const { z } = require("zod");

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is not set in environment variables.");
  console.error("Required env vars: GEMINI_API_KEY, GEMINI_MODEL_NAME, GEMINI_EMBEDDING_MODEL_NAME");
  process.exit(1);
}

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const structuredContentSchema = z.object({
  query: z.string().describe("User query for which response is generated."),
  context: z
    .array(z.string())
    .describe(
      "An array of strings providing additional context for generating the response. This can include previous messages in a conversation, relevant information, or any other data that can help the model generate a more accurate and relevant response.",
    ),
});


// Generate response embeddings for given content.
async function generateEmbedding(content) {
  const response = await ai.models.embedContent({
    model: process.env.GEMINI_EMBEDDING_MODEL_NAME,
    contents: content,
    config: {
      outputDimensionality: 768,
    },
  });

  return response.embeddings[0].values;
}

async function GenerateContentStream(content, onChunk, systemInstruction, user) {
  try {
    const stream = await ai.models.generateContentStream({
      model: process.env.GEMINI_MODEL_NAME,
      contents: content,

      config: {
        temperature: 0.2,
        systemInstruction: systemInstruction,
        maxOutputTokens: getPlanLimits(user).maxOutputTokens,
      },
    });

    let fullText = "";
    for await (const chunk of stream) {
      const text = utils.extractText(chunk);
      if (text) {
        fullText += text;
        if (typeof onChunk === "function") {
          onChunk(text);
        }
      }
    }
    return fullText;
  } catch (error) {
    console.error("Gemini streaming error:", error.message);
    console.error("Error type:", error.constructor.name);
    
    if (error.message?.includes("API_KEY")) {
      throw new Error("GEMINI_API_KEY is missing or invalid. Check environment variables.");
    }
    if (error.message?.includes("model")) {
      throw new Error(`Invalid model name. Check GEMINI_MODEL_NAME env var: ${process.env.GEMINI_MODEL_NAME}`);
    }
    if (error.status === 429) {
      throw new Error("API rate limit exceeded. Try again in a moment.");
    }
    throw new Error(`AI service error: ${error.message}`);
  }
}

module.exports = {
  generateEmbedding,
  GenerateContentStream,
  ai,
};
