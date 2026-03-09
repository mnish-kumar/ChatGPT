const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables.");
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

const structuredContentSchemaJson = zodToJsonSchema(structuredContentSchema);

async function generateResponse(content) {
  const responce = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL_NAME,
    contents: content,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(structuredContentSchemaJson),
      temperature: 0.7,
      systemInstruction:
        "You are a helpful assistant for answering user queries.",
    },
  });
  return responce.text;
}

async function generateEmbedding(content) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: content,
    config: {
      outputDimensionality: 768,
    },
  });

  return response.embeddings[0].values;
}

async function generateContentStream(content) {
  try {
    const stream = await ai.models.generateContentStream({
      model: process.env.GEMINI_MODEL_NAME,
      contents: content,

      config: {
        responseMimeType: "application/json",
        responseJsonSchema: structuredContentSchemaJson,
        temperature: 0.7,
        systemInstruction:
          "You are a helpful assistant for answering user queries.",
      },
    });

    return stream;
  } catch (error) {
    console.error("Gemini streaming error:", error);
    throw new Error("AI response generation failed");
  }
}

module.exports = {
  generateResponse,
  generateEmbedding,
  generateContentStream,
};
