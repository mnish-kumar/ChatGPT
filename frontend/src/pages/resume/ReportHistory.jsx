import { useEffect, useState } from "react";
import { getResumeHistory } from "@/api/resumeReport.api";
import ReportPage from "./ReportPage";
import { ClockIcon, ChevronRightIcon } from "lucide-react/dist/cjs/lucide-react";
import { useNavigate } from "react-router-dom";

// ── Helper
const extractRole = (jobDescription) => {
  const firstLine = jobDescription?.split("\n")[0] ?? "";
  const beforePipe = firstLine.split("|")[0].trim();
  return (
    beforePipe
      .replace(/\(.*?\)/g, "")
      .trim()
      .slice(0, 50) || "Unknown Role"
  );
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
};

const scoreColor = (score) => {
  if (score >= 80)
    return { text: "text-green-400", bg: "bg-green-500", label: "Strong" };
  if (score >= 60)
    return { text: "text-yellow-400", bg: "bg-yellow-500", label: "Good" };
  return { text: "text-red-400", bg: "bg-red-500", label: "Partial" };
};

// ── History Card
function HistoryCard({ report, onClick }) {
  const role = extractRole(report.jobDescription);
  const when = timeAgo(report.createdAt);
  const matchScore = Number(report.matchScore ?? 0);
  const sc = scoreColor(matchScore);
  const date = new Date(report.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-[#0d0f14] border border-[#1e2130] hover:border-[#ff3e7f]/40 rounded-xl p-3 transition-all group"
    >
      {/* Role + Time */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-xs font-semibold text-white leading-tight line-clamp-2 flex-1">
          {role}
        </p>
        <ChevronRightIcon
          size={12}
          className="text-gray-600 group-hover:text-[#ff3e7f] shrink-0 mt-0.5 transition-colors"
        />
      </div>

      {/* Date */}
      <p className="text-[10px] text-gray-600 mb-2">
        {date} · {when}
      </p>

      {/* Match Score Bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-gray-600">Match Score</span>
          <span className={`text-[10px] font-bold ${sc.text}`}>
            {matchScore}%
          </span>
        </div>
        <div className="h-1 bg-[#1e2130] rounded-full overflow-hidden">
          <div
            className={`h-full ${sc.bg} rounded-full transition-all`}
            style={{ width: `${matchScore}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-2 flex-wrap">
        <span className="text-[10px] bg-[#1e2130] text-gray-500 px-2 py-0.5 rounded-full">
          {report.technicalQuestions?.length ?? 0} Tech Qs
        </span>
        <span className="text-[10px] bg-[#1e2130] text-gray-500 px-2 py-0.5 rounded-full">
          {report.skillGaps?.length ?? 0} Gaps
        </span>
        <span className="text-[10px] bg-[#1e2130] text-gray-500 px-2 py-0.5 rounded-full">
          {report.preparationPlan?.length ?? 0}-day plan
        </span>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
            matchScore >= 80
              ? "bg-green-500/10 text-green-400"
              : "bg-yellow-500/10 text-yellow-400"
          }`}
        >
          {sc.label}
        </span>
      </div>
    </button>
  );
}

const ReportHistory = () => {
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getResumeHistory();
        setHistory(data);
      } catch {
        // silent fail
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (report) {
    return <ReportPage report={report} onBack={() => setReport(null)} />;
  }

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white flex font-sans">
      {/* Left Sidebar */}
      <aside className="w-64 shrink-0 border-r border-[#1e2130] flex flex-col h-screen sticky top-0">
        <div className="p-4 border-b border-[#1e2130] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClockIcon size={14} className="text-gray-500" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              History
            </span>
          </div>
          <button
            onClick={() => navigate("/resume-analyzer")}
            className="text-[13px] bg-accent-foreground border  hover:border-[#ff3e7f]/40 rounded cursor-pointer border-[#1e2130] px-3 py-2 font-semibold text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← Back
          </button>
        </div>

        <div className="p-3">
          <p className="text-[10px] text-gray-600">
            Click a card to open the full report.
          </p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Report History</h1>
            <p className="text-sm text-gray-500 mt-1">
              Your saved resume analysis reports.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {historyLoading ? (
              [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-[#0d0f14] border border-[#1e2130] rounded-xl p-3 animate-pulse"
                >
                  <div className="h-3 bg-[#1e2130] rounded mb-2 w-3/4" />
                  <div className="h-2 bg-[#1e2130] rounded mb-3 w-1/2" />
                  <div className="h-1 bg-[#1e2130] rounded mb-2" />
                  <div className="flex gap-1">
                    <div className="h-4 w-14 bg-[#1e2130] rounded-full" />
                    <div className="h-4 w-10 bg-[#1e2130] rounded-full" />
                  </div>
                </div>
              ))
            ) : history.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center px-4 py-20">
                <span className="text-3xl mb-2">📋</span>
                <p className="text-xs text-gray-600">No analysis yet.</p>
                <button
                  onClick={() => navigate("/resume-analyzer")}
                  className="mt-4 text-xs text-[#ff3e7f] hover:text-[#ff1a6a] transition-colors"
                >
                  Generate your first interview plan →
                </button>
              </div>
            ) : (
              history.map((item, i) => (
                <HistoryCard
                  key={item._id ?? i}
                  report={item}
                  onClick={() => setReport(item)}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportHistory;
