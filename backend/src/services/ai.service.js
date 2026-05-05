const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const utils = require("../utils/stream.helper");

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

async function generateResponse(content) {
  const responce = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL_NAME,
    contents: content,
    config: {
      temperature: 0.2,
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

async function GenerateContentStream(content, onChunk) {
  try {
    const stream = await ai.models.generateContentStream({
      model: process.env.GEMINI_MODEL_NAME,
      contents: content,

      config: {
        temperature: 0.2,
        systemInstruction:
          "You are a helpful assistant for answering user queries.",
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
    console.error("Gemini streaming error:", error);
    throw new Error("AI response generation failed");
  }
}

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
    model: "gemini-2.5-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(interviewReportSchema),
    },
  });

  return JSON.parse(response.text);
}

module.exports = {
  generateResponse,
  generateEmbedding,
  GenerateContentStream,
  generateInterviewReport,
};
