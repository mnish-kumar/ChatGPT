const { tavily } = require("@tavily/core");
const learningResourcesModel = require("../../models/resume/LearningResources.model");
const client = tavily({ apiKey: process.env.TAVILY_API_KEY });

const SEVERITY_ORDER = { High: 3, Medium: 2, Low: 1 };
const MAX_SKILLS_TO_FETCH = 5;

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

const safeHostname = (url) => {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "unknown";
  }
};

async function searchLearningResources({
  skillGaps,
  userId,
  reportId,
  atsScoreTotal,
  tier,
}) {
  try {
    const cached = await learningResourcesModel.findOne({
      user: userId,
      interviewReport: reportId,
    });
    if (cached) return cached;

    const topGaps = (skillGaps || [])
      .slice()
      .sort(
        (a, b) =>
          (SEVERITY_ORDER[b.severity] || 0) - (SEVERITY_ORDER[a.severity] || 0),
      )
      .slice(0, MAX_SKILLS_TO_FETCH);

    const settled = await Promise.allSettled(
      topGaps.map(async (gap) => {
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
            source: safeHostname(r.url),
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

    const resources = settled
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value);

    settled
      .filter((r) => r.status === "rejected")
      .forEach((r) =>
        console.error(
          "Skill resource fetch failed:",
          r.reason?.message || r.reason,
        ),
      );

    const saved = await learningResourcesModel.create({
      user: userId,
      interviewReport: reportId,
      atsScoreTotal,
      tier,
      resources,
    });

    return saved;
  } catch (error) {
    console.error("Tavily search error:", error.message);
    throw new Error("Failed to fetch learning resources");
  }
}

module.exports = searchLearningResources;
