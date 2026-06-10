const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const utils = require("../utils/stream.helper");
const userModel = require("../models/user.model");
const { getPlanLimits } = require("./prompt.service");

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

// Generate interview report based on user's resume, self description and job description.
const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "A score from 0 to 100 (not 0 to 1) indicating how well the user's profile matches the job description. Example: 85 means 85% match.",
    ),
  technicalQuestions: z
    .array(
      z.object({
        questions: z
          .string()
          .describe("A technical question can be asked in the interview."),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking the question."),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover,  what approch to take, etc.",
          ),
      }),
    )
    .describe(
      "Technical questions that may be asked in the interview based on the user's profile and the job description.",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        questions: z
          .string()
          .describe("A behavioral question can be asked in the interview."),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking the question."),
        answer: z
          .string()
          .describe("How to answer this question, what points to cover, etc."),
      }),
    )
    .describe(
      "Behavioral questions that may be asked in the interview based on the user's profile and the job description.",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z
          .string()
          .describe(
            "A specific skill that the user is lacking based on the analysis of their resume and the job description.",
          ),
        severity: z
          .enum(["Low", "Medium", "High"])
          .describe(
            "The severity level of the skill gap, indicating how critical it is for the job.",
          ),
        recommendation: z
          .string()
          .describe(
            "A recommendation for how the user can address this skill gap, such as courses to take, projects to work on, or other resources.",
          ),
      }),
    )
    .describe(
      "Identified skill gaps in the user's profile compared to the job requirements, along with their severity and recommendations for improvement.",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe(
            "The day number in the preparation plan, indicating the sequence of the preparation steps.",
          ),
        focus: z
          .string()
          .describe(
            "The main focus area for this day of preparation, such as a specific topic, skill, or type of question to practice.",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "A list of specific tasks or activities that the user should complete on this day to prepare for the interview, such as studying certain materials, practicing coding problems, or conducting mock interviews.",
          ),
      }),
    )
    .describe(
      "A structured preparation plan outlining daily focus areas and tasks for the user to effectively prepare for their interview based on the analysis of their profile and the job description.",
    ),
});
async function generateInterviewReport({
  selfDescription,
  jobDescription,
  resume,
}) {
  const prompt = `Generate an interview report for a candidate with the following details
                  Resume:${resume}
                  Self Description:${selfDescription}
                  Job Description:${jobDescription}`;

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(interviewReportSchema),
    },
  });

  return JSON.parse(response.text);
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
  generateInterviewReport,
};
