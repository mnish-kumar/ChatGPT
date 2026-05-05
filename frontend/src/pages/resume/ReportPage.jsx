import { useState } from "react";

const severityColors = {
  High: "bg-red-500/20 text-red-400 border border-red-500/30",
  Medium: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  Low: "bg-green-500/20 text-green-400 border border-green-500/30",
};

function MatchScoreRing({ score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";
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
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 65 65)"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <text x="65" y="60" textAnchor="middle" fill="white" fontSize="26" fontWeight="bold">{score}</text>
        <text x="65" y="78" textAnchor="middle" fill="#6b7280" fontSize="12">%</text>
      </svg>
      <p style={{ color }} className="text-xs font-medium">{label}</p>
    </div>
  );
}

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

function RoadMap({ plan }) {
  return (
    <div className="relative pl-8">
      {/* vertical line */}
      <div className="absolute left-3 top-2 bottom-2 w-px bg-[#1e2130]" />
      <div className="flex flex-col gap-8">
        {plan.map((item, i) => (
          <div key={i} className="relative">
            {/* dot */}
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

const SECTIONS = [
  { key: "technical", label: "Technical Questions", icon: "<>" },
  { key: "behavioral", label: "Behavioral Questions", icon: "💬" },
  { key: "roadmap", label: "Road Map", icon: "🗺" },
];

export default function ReportPage({ report, onBack }) {
  const [activeSection, setActiveSection] = useState("roadmap");

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
            className="w-full text-xs text-gray-600 border border-accent-foreground hover:text-gray-400 transition-colors py-2"
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
                <p className="text-[10px] mt-0.5 opacity-75 font-normal">{gap.recommendation.slice(0, 80)}...</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}