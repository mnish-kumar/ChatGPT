const ai = require("../chat/ai.service");
const { z } = require("zod");

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

module.exports = {
  generateInterviewReport,
};