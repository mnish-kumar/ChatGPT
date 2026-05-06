const { tavily } = require("@tavily/core");
const learningResourcesModel = require("../models/LearningResources.model");
const client = tavily({ apiKey: process.env.TAVILY_API_KEY });

// client.search({
//   query: "JavaScript interview preparation resources",
//   includeAnswer: "advanced",
//   searchDepth: "advanced",
// });

const extractYoutubeThumbnail = (url) => {
  try {
    const videoId = new URL(url).searchParams.get("v");
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
      : null;
  } catch {
    return null;
  }
};

async function searchLearningResources({
  skillGaps,
  userId,
  reportId,
  matchScore,
}) {
  try {
    // Cache check 
    const cached = await learningResourcesModel.findOne({
      user: userId,
      interviewReport: reportId,
    });
    if (cached) return cached;

    // Har skill ke liye docs + video parallel search
    const resources = await Promise.all(
      skillGaps.map(async (gap) => {
        const [docsResponse, videoResponse] = await Promise.all([
          client.search(`${gap.skill} documentation tutorial for beginners`, {
            search_depth: "advanced",
            max_results: 3,
            include_domains: [
              "developer.mozilla.org",
              "w3schools.com",
              "roadmap.sh",
              "react.dev",
              "javascript.info",
              "devdocs.io",
              "docs.python.org",
            ],
          }),
          client.search(`${gap.skill} tutorial for beginners`, {
            search_depth: "advanced",
            max_results: 3,
            include_domains: ["youtube.com"],
          }),
        ]);

        return {
          skill: gap.skill,
          severity: gap.severity,
          documentation: docsResponse.results.map((r) => ({
            title: r.title,
            url: r.url,
            description: r.content?.slice(0, 120) ?? "",
            source: new URL(r.url).hostname.replace("www.", ""),
          })),
          videos: videoResponse.results.map((r) => ({
            title: r.title,
            url: r.url,
            description: r.content?.slice(0, 120) ?? "",
            source: "youtube.com",
            thumbnail: extractYoutubeThumbnail(r.url),
          })),
        };
      }),
    );

    // DB mein save karo
    const saved = await learningResourcesModel.create({
      user: userId,
      interviewReport: reportId,
      matchScore,
      resources,
    });

    return saved;
  } catch (error) {
    console.error("Tavily search error:", error.message);
    throw new Error("Failed to fetch learning resources");
  }
}


module.exports = searchLearningResources