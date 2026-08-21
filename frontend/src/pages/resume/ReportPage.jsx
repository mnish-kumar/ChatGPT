import { useState } from "react";
import { ChevronDown, ChevronUp, ArrowLeft, Menu, X, Lock, RefreshCcw } from "lucide-react";

const severityColors = {
  High: "bg-red-500/20 text-red-400 border border-red-500/30",
  Medium: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  Low: "bg-green-500/20 text-green-400 border border-green-500/30",
};

const typeLabels = {
  genuinely_missing: { label: "Learn this skill", color: "text-red-400 bg-red-500/10 border-red-500/20" },
  present_but_unwritten: { label: "Add to resume", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
  weak_mention: { label: "Strengthen wording", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
};

const tierMeta = {
  Poor: { color: "#ef4444", label: "Poor Match", desc: "Resume needs improvement before interview prep unlocks." },
  Average: { color: "#f59e0b", label: "Average Match", desc: "Decent match — interview prep unlocked, job suggestions locked." },
  Good: { color: "#60a5fa", label: "Good Match", desc: "Strong match — full access unlocked." },
  Excellent: { color: "#22c55e", label: "Excellent Match", desc: "Top-tier match — priority job suggestions unlocked." },
};

// ATS Score Ring
function AtsScoreRing({ total, tier }) {
  const safeScore = Number.isFinite(Number(total)) ? Number(total) : 0;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeScore / 100) * circumference;
  const meta = tierMeta[tier] ?? tierMeta.Poor;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="120" height="120" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={radius} fill="none" stroke="#1e2130" strokeWidth="10" />
        <circle
          cx="65" cy="65" r={radius}
          fill="none" stroke={meta.color} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 65 65)"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <text x="65" y="60" textAnchor="middle" fill="white" fontSize="26" fontWeight="bold">{safeScore}</text>
        <text x="65" y="78" textAnchor="middle" fill="#6b7280" fontSize="12">/100</text>
      </svg>
      <span
        className="text-xs font-bold px-2.5 py-1 rounded-full"
        style={{ color: meta.color, backgroundColor: `${meta.color}1a` }}
      >
        {meta.label}
      </span>
      <p className="text-[11px] text-gray-500 text-center max-w-[180px] leading-relaxed">{meta.desc}</p>
    </div>
  );
}

// Score Breakdown Bars
function ScoreBreakdownBar({ label, score, max }) {
  const pct = max > 0 ? (score / max) * 100 : 0;
  const color = pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs font-semibold" style={{ color }}>
          {Number.isFinite(score) ? score : 0}/{max}
        </span>
      </div>
      <div className="h-1.5 bg-[#1e2130] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function ScoreBreakdown({ breakdown, formattingScore }) {
  if (!breakdown) return null;
  const rows = [
    { label: "Skills Match", ...breakdown.skillsMatch },
    { label: "Experience Match", ...breakdown.experienceMatch },
    { label: "Projects Match", ...breakdown.projectsMatch },
    { label: "Keywords Match", ...breakdown.keywordsMatch },
    { label: "Education", ...breakdown.education },
    { label: "Formatting", score: formattingScore?.score ?? 0, max: formattingScore?.max ?? 10 },
  ];
  return (
    <div className="flex flex-col gap-3">
      {rows.map((r, i) => (
        <ScoreBreakdownBar key={i} label={r.label} score={r.score} max={r.max} />
      ))}
    </div>
  );
}

// Formatting Issues
function FormattingIssues({ issues = [] }) {
  if (!issues.length) return null;
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-600 uppercase font-bold tracking-widest">Formatting Issues</p>
      {issues.map((iss, i) => (
        <div key={i} className={`px-3 py-2 rounded-lg text-xs ${severityColors[iss.severity] ?? "bg-[#1e2130] text-gray-400 border border-[#1e2130]"}`}>
          {iss.issue}
        </div>
      ))}
    </div>
  );
}

// Missing Keywords
function MissingKeywords({ keywords = [] }) {
  if (!keywords.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-600">
        <span className="text-3xl mb-2">✅</span>
        <p className="text-sm">No major missing keywords — nicely done!</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      {keywords.map((k, i) => {
        const meta = typeLabels[k.type] ?? typeLabels.genuinely_missing;
        return (
          <div key={i} className="bg-[#0d0f14] border border-[#1e2130] rounded-xl p-4">
            <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
              <span className="text-sm font-semibold text-white">❌ {k.keyword}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${meta.color}`}>
                {meta.label}
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">💡 {k.suggestion}</p>
          </div>
        );
      })}
    </div>
  );
}

// Strengths
function Strengths({ strengths = [] }) {
  if (!strengths.length) return null;
  return (
    <div className="flex flex-col gap-2">
      {strengths.map((s, i) => (
        <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-300 bg-green-500/5 border border-green-500/15 rounded-lg px-3 py-2">
          <span className="text-green-400 shrink-0">✓</span>
          {s}
        </div>
      ))}
    </div>
  );
}

// Locked Section Banner
function LockedBanner({ tier, onBack }) {
  if (tier === "Poor") {
    return (
      <div className="flex flex-col items-center text-center gap-3 py-14 px-4">
        <Lock size={28} className="text-gray-600" />
        <p className="text-sm font-semibold text-white">Resume score is too low for this role.</p>
        <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
          Interview prep and job suggestions will be unlocked once your resume score reaches at least 50.
          Follow the missing keywords and suggestions below to improve your resume, then re-upload.
        </p>
        <button
          onClick={onBack}
          className="mt-2 flex items-center gap-1.5 text-xs font-semibold bg-[#ff3e7f] hover:bg-[#ff1a6a] text-white px-4 py-2 rounded-lg transition-colors"
        >
          <RefreshCcw size={12} /> Improve the resume and re-upload.
        </button>
      </div>
    );
  }
  // Average tier — jobs locked
  return (
    <div className="flex flex-col items-center text-center gap-3 py-14 px-4">
      <Lock size={28} className="text-gray-600" />
      <p className="text-sm font-semibold text-white">Job suggestions abhi unlock nahi hui.</p>
      <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
        Resume decent hai but abhi job-ready nahi. Score 70+ hone par job suggestions unlock hongi.
        Abhi ke liye learning resources aur interview prep follow karo.
      </p>
    </div>
  );
}

// Shared Question Accordion
function QuestionAccordion({ questions = [], prefix, accentColor }) {
  const [openIdx, setOpenIdx] = useState(null);
  if (!questions.length) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-gray-600">
        <span className="text-3xl mb-2">📭</span>
        <p className="text-sm">No questions available yet.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      {questions.map((q, i) => (
        <div key={i} className="bg-[#0d0f14] border border-[#1e2130] rounded-xl overflow-hidden">
          <button
            className="w-full text-left px-4 py-3 sm:px-5 sm:py-4 flex items-start justify-between gap-3 hover:bg-[#1e2130]/40 transition-colors"
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
          >
            <div className="flex items-start gap-2 sm:gap-3 min-w-0">
              <span style={{ color: accentColor }} className="font-bold text-xs mt-0.5 shrink-0">
                {prefix}{i + 1}
              </span>
              <span className="text-sm font-medium text-gray-200 leading-snug">{q.questions}</span>
            </div>
            <span className="text-gray-500 shrink-0 mt-0.5 ml-1">
              {openIdx === i ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </span>
          </button>
          {openIdx === i && (
            <div className="px-4 pb-4 sm:px-5 border-t border-[#1e2130] pt-4 flex flex-col gap-3">
              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: accentColor }}>
                  🎯 Interviewer's Intent
                </p>
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

// Road Map
function RoadMap({ plan = [] }) {
  if (!plan.length) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-gray-600">
        <span className="text-3xl mb-2">🗺</span>
        <p className="text-sm">No preparation plan available yet.</p>
      </div>
    );
  }
  return (
    <div className="relative pl-7 sm:pl-8">
      <div className="absolute left-3 top-2 bottom-2 w-px bg-[#1e2130]" />
      <div className="flex flex-col gap-6 sm:gap-8">
        {plan.map((item, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-4 sm:-left-5 top-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-[#ff3e7f] bg-[#0d0f14]" />
            <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
              <span className="bg-[#ff3e7f]/20 text-[#ff3e7f] text-xs font-bold px-2 py-0.5 rounded">
                Day {item.day}
              </span>
              <h3 className="font-bold text-sm sm:text-base text-white">{item.focus}</h3>
            </div>
            <ul className="flex flex-col gap-1.5">
              {(Array.isArray(item.tasks) ? item.tasks : []).map((task, j) => (
                <li key={j} className="flex items-start gap-2 text-xs sm:text-sm text-gray-400">
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

// Job Suggestions
function JobSuggestions({ jobs }) {
  if (!jobs?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-600">
        <span className="text-4xl mb-3">🔍</span>
        <p className="text-sm">No job listings found at the moment.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {jobs.map((job, i) => (
        <div key={i} className="bg-[#0d0f14] border border-[#1e2130] rounded-xl p-4 hover:border-[#ff3e7f]/30 transition-colors">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {job.logo ? (
                <img src={job.logo} alt={job.company}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-contain bg-[#1e2130] p-1 shrink-0"
                  onError={(e) => { e.target.style.display = "none"; }} />
              ) : (
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#1e2130] flex items-center justify-center text-gray-500 text-xs font-bold shrink-0">
                  {job.company?.[0] ?? "?"}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="font-semibold text-xs sm:text-sm text-white leading-tight">{job.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{job.company}</p>
              </div>
            </div>
            <a href={job.applyUrl} target="_blank" rel="noopener noreferrer"
              className="shrink-0 bg-[#ff3e7f]/10 hover:bg-[#ff3e7f]/20 text-[#ff3e7f] text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap">
              Apply →
            </a>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            <span className="text-xs text-gray-500">📍 {job.location}</span>
            {job.isRemote && <span className="bg-green-500/10 text-green-400 text-xs px-2 py-0.5 rounded-full">Remote</span>}
            <span className="bg-[#1e2130] text-gray-400 text-xs px-2 py-0.5 rounded-full">{job.employmentType}</span>
            {job.salary && <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-0.5 rounded-full">💰 {job.salary}</span>}
          </div>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{job.description}</p>
          <p className="text-[10px] text-gray-700 mt-2">
            {job.postedAt
              ? `Posted ${new Date(job.postedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
              : "Posting date not available"}
            {job.publisher && ` · ${job.publisher}`}
          </p>
        </div>
      ))}
    </div>
  );
}

// Preparation Resources
function PreparationResources({ resources }) {
  const [activeSkill, setActiveSkill] = useState(0);
  const [activeTab, setActiveTab] = useState("documentation");
  const [skillDrawerOpen, setSkillDrawerOpen] = useState(false);

  if (!resources?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-600">
        <span className="text-4xl mb-3">📚</span>
        <p className="text-sm">No resources found.</p>
      </div>
    );
  }

  const current = resources[activeSkill] ?? resources[0];
  if (!current) return null;

  return (
    <div>
      {/* Mobile: Skill Picker Dropdown */}
      <div className="sm:hidden mb-4">
        <button
          onClick={() => setSkillDrawerOpen((p) => !p)}
          className="w-full flex items-center justify-between px-4 py-3 bg-[#13161d] border border-[#1e2130] rounded-xl text-sm font-medium text-white"
        >
          <span>{current.skill}</span>
          <ChevronDown size={14} className="text-gray-500" />
        </button>
        {skillDrawerOpen && (
          <div className="mt-1 bg-[#13161d] border border-[#1e2130] rounded-xl overflow-hidden">
            {resources.map((r, i) => (
              <button
                key={i}
                onClick={() => { setActiveSkill(i); setActiveTab("documentation"); setSkillDrawerOpen(false); }}
                className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-xs font-medium transition-colors ${
                  activeSkill === i ? "bg-[#ff3e7f]/20 text-[#ff3e7f]" : "text-gray-400 hover:bg-[#1e2130]"
                }`}
              >
                <span>{r.skill}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${severityColors[r.severity]}`}>{r.severity}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop: Side-by-side layout */}
      <div className="hidden sm:flex gap-6">
        <div className="w-52 shrink-0 flex flex-col gap-2">
          <p className="text-xs text-gray-600 uppercase font-bold tracking-widest mb-1">Skills</p>
          {resources.map((r, i) => (
            <button
              key={i}
              onClick={() => { setActiveSkill(i); setActiveTab("documentation"); }}
              className={`text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                activeSkill === i ? "bg-[#ff3e7f]/20 text-[#ff3e7f]" : "text-gray-400 hover:bg-[#1e2130] hover:text-white"
              }`}
            >
              <p className="leading-tight">{r.skill}</p>
              <span className={`text-[10px] mt-0.5 inline-block px-1.5 py-0.5 rounded ${severityColors[r.severity]}`}>
                {r.severity}
              </span>
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <ResourceContent current={current} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

      <div className="sm:hidden">
        <ResourceContent current={current} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}

function ResourceContent({ current, activeTab, setActiveTab }) {
  return (
    <>
      <div className="mb-3">
        <h3 className="font-bold text-sm sm:text-base text-white">{current.skill}</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          {(current.documentation?.length ?? 0) + (current.videos?.length ?? 0)} resources available
        </p>
      </div>
      <div className="flex gap-2 mb-4">
        {["documentation", "videos"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === tab ? "bg-[#ff3e7f] text-white" : "bg-[#1e2130] text-gray-400 hover:text-white"
            }`}
          >
            {tab === "documentation" ? "📄" : "🎥"} {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      {activeTab === "documentation" && (
        <div className="flex flex-col gap-3">
          {current.documentation?.length > 0 ? (
            current.documentation.map((doc, i) => (
              <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer"
                className="bg-[#0d0f14] border border-[#1e2130] rounded-xl p-3 sm:p-4 hover:border-[#ff3e7f]/30 transition-colors group">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                    <span className="text-lg mt-0.5 shrink-0">📄</span>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-white group-hover:text-[#ff3e7f] transition-colors leading-tight">{doc.title}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{doc.source}</p>
                      {doc.description && <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{doc.description}</p>}
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
      {activeTab === "videos" && (
        <div className="flex flex-col gap-3">
          {current.videos?.length > 0 ? (
            current.videos.map((video, i) => (
              <a key={i} href={video.url} target="_blank" rel="noopener noreferrer"
                className="bg-[#0d0f14] border border-[#1e2130] rounded-xl p-3 sm:p-4 hover:border-[#ff3e7f]/30 transition-colors group flex gap-3">
                <div className="shrink-0 w-24 h-14 sm:w-28 sm:h-16 rounded-lg overflow-hidden bg-[#1e2130] flex items-center justify-center">
                  {video.thumbnail ? (
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = "none"; }} />
                  ) : (
                    <span className="text-xl">▶️</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-white group-hover:text-[#ff3e7f] transition-colors leading-tight line-clamp-2">{video.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">youtube.com</p>
                  {video.description && <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{video.description}</p>}
                </div>
              </a>
            ))
          ) : (
            <p className="text-sm text-gray-600 py-8 text-center">No videos found for this skill.</p>
          )}
        </div>
      )}
    </>
  );
}

// ─── Stats Panel (ATS Score + Skill Gaps) ─────────────────────────────────────
function StatsPanel({ report }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs text-gray-600 uppercase font-bold tracking-widest mb-4">ATS Score</p>
        <AtsScoreRing total={report.atsScore.total} tier={report.atsScore.tier} />
      </div>
      {report.skillGaps.length > 0 && (
        <div>
          <p className="text-xs text-gray-600 uppercase font-bold tracking-widest mb-3">Skill Gaps</p>
          <div className="flex flex-col gap-2">
            {report.skillGaps.map((gap, i) => (
              <div key={i} className={`px-3 py-2 rounded-lg text-xs font-medium ${severityColors[gap.severity] ?? "bg-[#1e2130] text-gray-400 border border-[#1e2130]"}`}>
                <p className="font-semibold">{gap.skill ?? "Unknown"}</p>
                <p className="text-[10px] mt-0.5 opacity-75 font-normal">
                  {(gap.recommendation ?? "").slice(0, 80)}
                  {(gap.recommendation ?? "").length > 80 ? "..." : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Main ReportPage
export default function ReportPage({ report, onBack }) {
  const [navOpen, setNavOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);

  const atsScore = report?.atsScore ?? { total: 0, tier: "Poor", breakdown: null, formattingScore: null };

  const normalizedReport = {
    ...(report ?? {}),
    atsScore,
    missingKeywords: Array.isArray(report.atsScore?.missingKeywords) ? report.atsScore.missingKeywords : [],
    strengths: Array.isArray(report.atsScore?.strengths) ? report.atsScore.strengths : [],
    technicalQuestions: Array.isArray(report?.technicalQuestions) ? report.technicalQuestions : [],
    behavioralQuestions: Array.isArray(report?.behavioralQuestions) ? report.behavioralQuestions : [],
    preparationPlan: Array.isArray(report?.preparationPlan) ? report.preparationPlan : [],
    jobSuggestions: Array.isArray(report?.jobSuggestions) ? report.jobSuggestions : [],
    learningResources: Array.isArray(report?.learningResources) ? report.learningResources : [],
    skillGaps: Array.isArray(report?.skillGaps) ? report.skillGaps : [],
  };

  const tier = atsScore.tier;
  const isPoor = tier === "Poor";
  const isAverage = tier === "Average";
  const isGoodOrExcellent = tier === "Good" || tier === "Excellent";

  const [activeSection, setActiveSection] = useState("ats");

  // Sections list — tier-gated, mirrors backend unlock logic exactly
  const SECTIONS = [
    { key: "ats", label: "ATS Report", icon: "📊" },
    ...(!isPoor ? [
      { key: "technical", label: "Technical Questions", icon: "<>" },
      { key: "behavioral", label: "Behavioral Questions", icon: "💬" },
      { key: "roadmap", label: "Road Map", icon: "🗺" },
    ] : []),
    isGoodOrExcellent
      ? { key: "jobs", label: "Job Suggestions", icon: "💼" }
      : isAverage
        ? { key: "resources", label: "Prep Resources", icon: "📚" }
        : null,
  ].filter(Boolean);

  const activeLabel = SECTIONS.find((s) => s.key === activeSection)?.label ?? "";

  const handleNavSelect = (key) => {
    setActiveSection(key);
    setNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white font-sans">

      {/* ── Mobile Top Bar ── */}
      <div className="lg:hidden sticky top-0 z-30 bg-[#0d0f14] border-b border-[#1e2130] px-4 py-3 flex items-center justify-between gap-2">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors shrink-0">
          <ArrowLeft size={14} /> Back
        </button>
        <span className="text-xs font-semibold text-white truncate">{activeLabel}</span>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setStatsOpen((p) => !p)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-[#1e2130] text-gray-400 hover:text-white transition-colors"
          >
            Score
          </button>
          <button
            onClick={() => setNavOpen((p) => !p)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e2130] text-gray-400 hover:text-white transition-colors"
          >
            {navOpen ? <X size={14} /> : <Menu size={14} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {navOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setNavOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-64 bg-[#13161d] border-l border-[#1e2130] p-5 flex flex-col gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-600 uppercase font-bold tracking-widest">Sections</p>
              <button onClick={() => setNavOpen(false)} className="text-gray-500 hover:text-white">
                <X size={14} />
              </button>
            </div>
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => handleNavSelect(s.key)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors ${
                  activeSection === s.key
                    ? "bg-[#ff3e7f]/20 text-[#ff3e7f]"
                    : "text-gray-400 hover:bg-[#1e2130] hover:text-white"
                }`}
              >
                <span className="text-xs">{s.icon}</span>
                {s.label}
              </button>
            ))}
            {isPoor && (
              <p className="text-[10px] text-gray-600 mt-2 leading-relaxed px-1">
                🔒 Interview prep and job suggestions will be unlocked once your resume score reaches at least 50.
              </p>
            )}
            <div className="mt-auto">
              <button onClick={onBack} className="w-full text-xs text-gray-600 border border-[#1e2130] hover:text-gray-400 transition-colors py-2 rounded-lg">
                ← Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Stats Drawer */}
      {statsOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setStatsOpen(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-[#13161d] border-t border-[#1e2130] p-5 rounded-t-2xl max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-white">Stats</p>
              <button onClick={() => setStatsOpen(false)} className="text-gray-500 hover:text-white">
                <X size={14} />
              </button>
            </div>
            <StatsPanel report={normalizedReport} />
          </div>
        </div>
      )}

      {/* Desktop 3-column layout */}
      <div className="hidden lg:flex min-h-screen">
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
          {isPoor && (
            <p className="text-[10px] text-gray-600 mt-2 leading-relaxed px-1">
              🔒 Interview prep and job suggestions will be unlocked once your resume score reaches at least 50.
            </p>
          )}
          <div className="mt-auto">
            <button onClick={onBack} className="w-full text-xs cursor-pointer text-gray-600 border border-[#1e2130] hover:text-gray-400 transition-colors py-2 rounded-lg">
              ← Go Back
            </button>
          </div>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
          <SectionContent section={activeSection} report={normalizedReport} onBack={onBack} />
        </main>

        <aside className="w-64 shrink-0 border-l border-[#1e2130] p-5 sticky top-0 h-screen overflow-y-auto">
          <StatsPanel report={normalizedReport} />
        </aside>
      </div>

      {/* Mobile Main Content */}
      <div className="lg:hidden px-4 py-5 pb-24">
        <SectionContent section={activeSection} report={normalizedReport} onBack={onBack} />
      </div>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-[#0d0f14] border-t border-[#1e2130] flex">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 text-[10px] font-medium transition-colors ${
              activeSection === s.key ? "text-[#ff3e7f]" : "text-gray-600"
            }`}
          >
            <span className="text-base leading-none">{s.icon}</span>
            <span className="leading-tight text-center px-0.5 line-clamp-1">{s.label.split(" ")[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Section Content (shared between mobile & desktop)
function SectionContent({ section, report, onBack }) {
  const tier = report.atsScore.tier;

  if (section === "ats") return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-lg sm:text-xl font-bold mb-1">ATS Score Breakdown</h2>
        <p className="text-xs sm:text-sm text-gray-500 mb-5">
          Deterministic score — same resume + JD always gives the same result.
        </p>
        <ScoreBreakdown breakdown={report.atsScore.breakdown} formattingScore={report.atsScore.formattingScore} />
      </div>

      {report.atsScore.formattingScore?.issues?.length > 0 && (
        <FormattingIssues issues={report.atsScore.formattingScore.issues} />
      )}

      {report.strengths.length > 0 && (
        <div>
          <p className="text-xs text-gray-600 uppercase font-bold tracking-widest mb-3">Strengths</p>
          <Strengths strengths={report.strengths} />
        </div>
      )}

      <div>
        <p className="text-xs text-gray-600 uppercase font-bold tracking-widest mb-3">Missing Keywords & What to Fix</p>
        <MissingKeywords keywords={report.missingKeywords} />
      </div>

      {tier === "Poor" && (
        <div className="border-t border-[#1e2130] pt-6">
          <LockedBanner tier={tier} onBack={onBack} />
        </div>
      )}
    </div>
  );

  if (section === "technical") return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold mb-1">Technical Questions</h2>
      <p className="text-xs sm:text-sm text-gray-500 mb-5">
        {report.technicalQuestions.length} questions based on your profile
      </p>
      <QuestionAccordion questions={report.technicalQuestions} prefix="Q" accentColor="#ff3e7f" />
    </div>
  );

  if (section === "behavioral") return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold mb-1">Behavioral Questions</h2>
      <p className="text-xs sm:text-sm text-gray-500 mb-5">
        {report.behavioralQuestions.length} questions to assess your soft skills
      </p>
      <QuestionAccordion questions={report.behavioralQuestions} prefix="B" accentColor="#60a5fa" />
    </div>
  );

  if (section === "roadmap") return (
    <div>
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <h2 className="text-lg sm:text-xl font-bold">Preparation Road Map</h2>
        <span className="bg-[#1e2130] text-gray-400 text-xs px-3 py-1 rounded-full">
          {report.preparationPlan.length}-day plan
        </span>
      </div>
      <RoadMap plan={report.preparationPlan} />
    </div>
  );

  if (section === "jobs") return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold mb-1">Job Suggestions</h2>
      <p className="text-xs sm:text-sm text-gray-500 mb-5">
        {report.jobSuggestions.length} recent openings matching your profile
      </p>
      <JobSuggestions jobs={report.jobSuggestions} />
    </div>
  );

  if (section === "resources") return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold mb-1">Preparation Resources</h2>
      <p className="text-xs sm:text-sm text-gray-500 mb-5">Curated docs & videos for each skill gap</p>
      <PreparationResources resources={report.learningResources} />
    </div>
  );

  return null;
}