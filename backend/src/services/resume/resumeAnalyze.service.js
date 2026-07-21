const { ai } = require("../chat/ai.service");
const { z } = require("zod");

const interviewReportSchema = z.object({
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
            "How to answer this question, what points to cover, what approach to take, etc.",
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

const resumeExtractionSchema = z.object({
  candidateSkills: z
    .array(z.string())
    .describe("All technical and soft skills found in the candidate's resume."),
  requiredSkills: z
    .array(z.string())
    .describe(
      "All skills mentioned as required or preferred in the job description.",
    ),
  matchedSkills: z
    .array(z.string())
    .describe(
      "Skills from candidateSkills that also appear in requiredSkills.",
    ),
  missingSkills: z
    .array(
      z.object({
        keyword: z.string().describe("The missing skill/keyword."),
        suggestion: z
          .string()
          .describe(
            "Specific advice: if candidate likely has this skill but didn't mention it, suggest how to add it to resume. If genuinely missing, suggest how to acquire it.",
          ),
        type: z
          .enum(["genuinely_missing", "present_but_unwritten", "weak_mention"])
          .describe(
            "Whether this is a real gap or just a resume-writing issue.",
          ),
      }),
    )
    .describe(
      "Required skills missing from the resume, each with an actionable suggestion.",
    ),
  candidateYearsExperience: z
    .number()
    .describe("Total years of relevant experience found in the resume."),
  requiredYearsExperience: z
    .number()
    .describe("Years of experience required by the job description."),
  relevantProjectsCount: z
    .number()
    .describe(
      "Number of projects in the resume relevant to this job description.",
    ),
  educationMatch: z
    .boolean()
    .describe(
      "Whether the candidate's education meets the job's education requirement.",
    ),
  keywordsFound: z
    .array(z.string())
    .describe("Important JD keywords/phrases found in the resume."),
  keywordsRequired: z
    .array(z.string())
    .describe("Important keywords/phrases present in the job description."),
  strengths: z
    .array(z.string())
    .describe("2-4 genuine strengths of this resume for this specific job."),
});

async function generateInterviewReport({
  selfDescription,
  jobDescription,
  resume,
}) {
  const prompt = `Generate an interview report for a candidate with the following details
                  Resume:${resume}
                  Self Description:${selfDescription || "Not provided"}
                  Job Description:${jobDescription}`;

  try {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: z.toJSONSchema(interviewReportSchema),
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Interview report generation error:", error.message);
    throw new Error("Failed to generate interview report. Please try again.");
  }
}

async function extractResumeData({ selfDescription, jobDescription, resume }) {
  const prompt = `Extract structured comparison data between this resume and job description.
                  Resume: ${resume}
                  Self Description: ${selfDescription || "Not provided"}
                  Job Description: ${jobDescription}`;

  try {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: z.toJSONSchema(resumeExtractionSchema),
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Resume extraction error:", error.message);
    throw new Error("Failed to extract resume data. Please try again.");
  }
}

module.exports = {
  generateInterviewReport,
  extractResumeData,
};
