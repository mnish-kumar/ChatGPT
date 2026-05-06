import { useState } from "react";

const severityColors = {
  High: "bg-red-500/20 text-red-400 border border-red-500/30",
  Medium: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  Low: "bg-green-500/20 text-green-400 border border-green-500/30",
};

// ─── Match Score Ring ────────────────────────────────────────────────────────
function MatchScoreRing({ score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";
  const label =
    score >= 80
      ? "Strong match for this role"
      : score >= 60
      ? "Good match for this role"
      : "Partial match for this role";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={radius} fill="none" stroke="#1e2130" strokeWidth="10" />
        <circle
          cx="65" cy="65" r={radius}
          fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 65 65)"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <text x="65" y="60" textAnchor="middle" fill="white" fontSize="26" fontWeight="bold">{score}</text>
        <text x="65" y="78" textAnchor="middle" fill="#6b7280" fontSize="12">%</text>
      </svg>
      <p style={{ color }} className="text-xs font-medium">{label}</p>
    </div>
  );
}

// ─── Technical Questions ─────────────────────────────────────────────────────
function TechnicalQuestions({ questions }) {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div className="flex flex-col gap-3">
      {questions.map((q, i) => (
        <div key={i} className="bg-[#0d0f14] border border-[#1e2130] rounded-xl overflow-hidden">
          <button
            className="w-full text-left px-5 py-4 flex items-start justify-between gap-3 hover:bg-[#1e2130]/40 transition-colors"
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
          >
            <div className="flex items-start gap-3">
              <span className="text-[#ff3e7f] font-bold text-xs mt-0.5 shrink-0">Q{i + 1}</span>
              <span className="text-sm font-medium text-gray-200">{q.questions}</span>
            </div>
            <span className="text-gray-500 shrink-0 mt-0.5">{openIdx === i ? "▲" : "▼"}</span>
          </button>
          {openIdx === i && (
            <div className="px-5 pb-4 border-t border-[#1e2130] pt-4 flex flex-col gap-3">
              <div>
                <p className="text-xs text-[#ff3e7f] font-semibold mb-1">🎯 Interviewer's Intent</p>
                <p className="text-sm text-gray-400">{q.intention}</p>
              </div>
              <div>
                <p className="text-xs text-green-400 font-semibold mb-1">💡 How to Answer</p>
                <p className="text-sm text-gray-300 leading-relaxed">{q.answer}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Behavioral Questions ────────────────────────────────────────────────────
function BehavioralQuestions({ questions }) {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div className="flex flex-col gap-3">
      {questions.map((q, i) => (
        <div key={i} className="bg-[#0d0f14] border border-[#1e2130] rounded-xl overflow-hidden">
          <button
            className="w-full text-left px-5 py-4 flex items-start justify-between gap-3 hover:bg-[#1e2130]/40 transition-colors"
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
          >
            <div className="flex items-start gap-3">
              <span className="text-blue-400 font-bold text-xs mt-0.5 shrink-0">B{i + 1}</span>
              <span className="text-sm font-medium text-gray-200">{q.questions}</span>
            </div>
            <span className="text-gray-500 shrink-0 mt-0.5">{openIdx === i ? "▲" : "▼"}</span>
          </button>
          {openIdx === i && (
            <div className="px-5 pb-4 border-t border-[#1e2130] pt-4 flex flex-col gap-3">
              <div>
                <p className="text-xs text-blue-400 font-semibold mb-1">🎯 Interviewer's Intent</p>
                <p className="text-sm text-gray-400">{q.intention}</p>
              </div>
              <div>
                <p className="text-xs text-green-400 font-semibold mb-1">💡 How to Answer</p>
                <p className="text-sm text-gray-300 leading-relaxed">{q.answer}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Road Map ────────────────────────────────────────────────────────────────
function RoadMap({ plan }) {
  return (
    <div className="relative pl-8">
      <div className="absolute left-3 top-2 bottom-2 w-px bg-[#1e2130]" />
      <div className="flex flex-col gap-8">
        {plan.map((item, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-5 top-1.5 w-4 h-4 rounded-full border-2 border-[#ff3e7f] bg-[#0d0f14]" />
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-[#ff3e7f]/20 text-[#ff3e7f] text-xs font-bold px-2 py-0.5 rounded">
                Day {item.day}
              </span>
              <h3 className="font-bold text-base text-white">{item.focus}</h3>
            </div>
            <ul className="flex flex-col gap-1.5">
              {item.tasks.map((task, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="text-[#ff3e7f] mt-0.5 shrink-0">•</span>
                  {task}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Job Suggestions ─────────────────────────────────────────────────────────
function JobSuggestions({ jobs }) {
  if (!jobs?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-600">
        <span className="text-4xl mb-3">🔍</span>
        <p className="text-sm">No job listings found at the moment.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {jobs.map((job, i) => (
        <div
          key={i}
          className="bg-[#0d0f14] border border-[#1e2130] rounded-xl p-5 hover:border-[#ff3e7f]/30 transition-colors"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              {job.logo ? (
                <img
                  src={job.logo}
                  alt={job.company}
                  className="w-10 h-10 rounded-lg object-contain bg-[#1e2130] p-1"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-[#1e2130] flex items-center justify-center text-gray-500 text-xs font-bold">
                  {job.company?.[0] ?? "?"}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-sm text-white leading-tight">{job.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{job.company}</p>
              </div>
            </div>
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 bg-[#ff3e7f]/10 hover:bg-[#ff3e7f]/20 text-[#ff3e7f] text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              Apply →
            </a>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              📍 {job.location}
            </span>
            {job.isRemote && (
              <span className="bg-green-500/10 text-green-400 text-xs px-2 py-0.5 rounded-full">
                Remote
              </span>
            )}
            <span className="bg-[#1e2130] text-gray-400 text-xs px-2 py-0.5 rounded-full">
              {job.employmentType}
            </span>
            {job.salary && (
              <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-0.5 rounded-full">
                💰 {job.salary}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{job.description}</p>

          {/* Posted */}
          <p className="text-[10px] text-gray-700 mt-2">
            Posted {new Date(job.postedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            {job.publisher && ` · ${job.publisher}`}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Preparation Resources ───────────────────────────────────────────────────
function PreparationResources({ resources }) {
  const [activeSkill, setActiveSkill] = useState(0);
  const [activeTab, setActiveTab] = useState("documentation"); // "documentation" | "videos"

  if (!resources?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-600">
        <span className="text-4xl mb-3">📚</span>
        <p className="text-sm">No resources found.</p>
      </div>
    );
  }

  const current = resources[activeSkill];

  return (
    <div className="flex gap-6">
      {/* Skill List — left */}
      <div className="w-52 shrink-0 flex flex-col gap-2">
        <p className="text-xs text-gray-600 uppercase font-bold tracking-widest mb-1">Skills</p>
        {resources.map((r, i) => (
          <button
            key={i}
            onClick={() => { setActiveSkill(i); setActiveTab("documentation"); }}
            className={`text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
              activeSkill === i
                ? "bg-[#ff3e7f]/20 text-[#ff3e7f]"
                : "text-gray-400 hover:bg-[#1e2130] hover:text-white"
            }`}
          >
            <p className="leading-tight">{r.skill}</p>
            <span className={`text-[10px] mt-0.5 inline-block px-1.5 py-0.5 rounded ${severityColors[r.severity]}`}>
              {r.severity}
            </span>
          </button>
        ))}
      </div>

      {/* Content — right */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-base text-white mb-1">{current.skill}</h3>
        <p className="text-xs text-gray-500 mb-4">
          {current.documentation?.length + current.videos?.length} resources available
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setActiveTab("documentation")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "documentation"
                ? "bg-[#ff3e7f] text-white"
                : "bg-[#1e2130] text-gray-400 hover:text-white"
            }`}
          >
            📄 Documentation
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "videos"
                ? "bg-[#ff3e7f] text-white"
                : "bg-[#1e2130] text-gray-400 hover:text-white"
            }`}
          >
            🎥 Videos
          </button>
        </div>

        {/* Documentation */}
        {activeTab === "documentation" && (
          <div className="flex flex-col gap-3">
            {current.documentation?.length > 0 ? (
              current.documentation.map((doc, i) => (
                <a
                  key={i}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0d0f14] border border-[#1e2130] rounded-xl p-4 hover:border-[#ff3e7f]/30 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <span className="text-xl mt-0.5">📄</span>
                      <div>
                        <p className="text-sm font-medium text-white group-hover:text-[#ff3e7f] transition-colors leading-tight">
                          {doc.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">{doc.source}</p>
                        {doc.description && (
                          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
                            {doc.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-gray-600 group-hover:text-[#ff3e7f] transition-colors shrink-0">↗</span>
                  </div>
                </a>
              ))
            ) : (
              <p className="text-sm text-gray-600 py-8 text-center">No documentation found for this skill.</p>
            )}
          </div>
        )}

        {/* Videos */}
        {activeTab === "videos" && (
          <div className="flex flex-col gap-3">
            {current.videos?.length > 0 ? (
              current.videos.map((video, i) => (
                <a
                  key={i}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0d0f14] border border-[#1e2130] rounded-xl p-4 hover:border-[#ff3e7f]/30 transition-colors group flex gap-4"
                >
                  {/* Thumbnail */}
                  <div className="shrink-0 w-28 h-16 rounded-lg overflow-hidden bg-[#1e2130] flex items-center justify-center">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    ) : (
                      <span className="text-2xl">▶️</span>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white group-hover:text-[#ff3e7f] transition-colors leading-tight line-clamp-2">
                      {video.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">youtube.com</p>
                    {video.description && (
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                        {video.description}
                      </p>
                    )}
                  </div>
                </a>
              ))
            ) : (
              <p className="text-sm text-gray-600 py-8 text-center">No videos found for this skill.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main ReportPage ─────────────────────────────────────────────────────────
export default function ReportPage({ report, onBack }) {
  const [activeSection, setActiveSection] = useState("roadmap");

  const hasJobs = report.matchScore >= 80;

  // Dynamic sections based on matchScore
  const SECTIONS = [
    { key: "technical", label: "Technical Questions", icon: "<>" },
    { key: "behavioral", label: "Behavioral Questions", icon: "💬" },
    { key: "roadmap", label: "Road Map", icon: "🗺" },
    hasJobs
      ? { key: "jobs", label: "Job Suggestions", icon: "💼" }
      : { key: "resources", label: "Prep Resources", icon: "📚" },
  ];

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white flex font-sans">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-[#1e2130] p-5 flex flex-col gap-2 sticky top-0 h-screen">
        <p className="text-xs text-gray-600 uppercase font-bold tracking-widest mb-3">Sections</p>
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className={`flex items-center cursor-pointer gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors ${
              activeSection === s.key
                ? "bg-[#ff3e7f]/20 text-[#ff3e7f]"
                : "text-gray-400 hover:bg-[#1e2130] hover:text-white"
            }`}
          >
            <span className="text-xs">{s.icon}</span>
            {s.label}
          </button>
        ))}
        <div className="mt-auto">
          <button
            onClick={onBack}
            className="w-full text-xs cursor-pointer text-gray-600 border border-[#1e2130] hover:text-gray-400 transition-colors py-2 rounded-lg"
          >
            ← New Analysis
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeSection === "technical" && (
          <div>
            <h2 className="text-xl font-bold mb-1">Technical Questions</h2>
            <p className="text-sm text-gray-500 mb-6">
              {report.technicalQuestions.length} questions based on your profile
            </p>
            <TechnicalQuestions questions={report.technicalQuestions} />
          </div>
        )}

        {activeSection === "behavioral" && (
          <div>
            <h2 className="text-xl font-bold mb-1">Behavioral Questions</h2>
            <p className="text-sm text-gray-500 mb-6">
              {report.behavioralQuestions.length} questions to assess your soft skills
            </p>
            <BehavioralQuestions questions={report.behavioralQuestions} />
          </div>
        )}

        {activeSection === "roadmap" && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold">Preparation Road Map</h2>
              <span className="bg-[#1e2130] text-gray-400 text-xs px-3 py-1 rounded-full">
                {report.preparationPlan.length}-day plan
              </span>
            </div>
            <RoadMap plan={report.preparationPlan} />
          </div>
        )}

        {activeSection === "jobs" && (
          <div>
            <h2 className="text-xl font-bold mb-1">Job Suggestions</h2>
            <p className="text-sm text-gray-500 mb-6">
              {report.jobSuggestions?.length ?? 0} recent openings matching your profile
            </p>
            <JobSuggestions jobs={report.jobSuggestions} />
          </div>
        )}

        {activeSection === "resources" && (
          <div>
            <h2 className="text-xl font-bold mb-1">Preparation Resources</h2>
            <p className="text-sm text-gray-500 mb-6">
              Curated docs & videos for each skill gap
            </p>
            <PreparationResources resources={report.learningResources} />
          </div>
        )}
      </main>

      {/* Right Panel */}
      <aside className="w-64 shrink-0 border-l border-[#1e2130] p-5 sticky top-0 h-screen overflow-y-auto">
        {/* Match Score */}
        <div className="mb-6">
          <p className="text-xs text-gray-600 uppercase font-bold tracking-widest mb-4">Match Score</p>
          <MatchScoreRing score={report.matchScore} />
        </div>

        {/* Skill Gaps */}
        <div>
          <p className="text-xs text-gray-600 uppercase font-bold tracking-widest mb-3">Skill Gaps</p>
          <div className="flex flex-col gap-2">
            {report.skillGaps.map((gap, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-lg text-xs font-medium ${severityColors[gap.severity]}`}
              >
                <p className="font-semibold">{gap.skill}</p>
                <p className="text-[10px] mt-0.5 opacity-75 font-normal">
                  {gap.recommendation.slice(0, 80)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
