import { useState, useRef, useEffect } from "react";
import { generateResumeReport } from "@/api/resumeReport.api";
import ReportPage from "./ReportPage";
import {
  MenuIcon,
  FileText,
  ChevronRightIcon,
  LoaderCircle,
  PanelLeftDashed,
} from "lucide-react/dist/cjs/lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Dropdown from "../user/Dropdown";

// ── Main Component
const ResumeHome = ({ onSubmit }) => {
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { user } = useSelector((s) => s.user);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (
      file &&
      (file.type === "application/pdf" || file.name.endsWith(".docx"))
    ) {
      setResumeFile(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setResumeFile(file);
  };

  const handleSubmit = async () => {
    if (!jobDescription.trim()) return;
    if (!resumeFile && !selfDescription.trim()) return;
    setLoading(true);
    try {
      const nextReport = await generateResumeReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      setReport(nextReport);
      if (typeof onSubmit === "function") await onSubmit(nextReport);
    } catch (err) {
      alert("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    jobDescription.trim() && (resumeFile || selfDescription.trim());

  if (report) {
    return <ReportPage report={report} onBack={() => setReport(null)} />;
  }

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white flex font-sans">
      <div
        ref={menuRef}
        className="absolute top-6 right-8 text-gray-400 border-[#1e2130]]"
      >
        <button
          onClick={() => setMenuOpen((p) => !p)}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border bg-[#0d0f14] transition hover:border-[#ff3e7f]/40 hover:bg-[#1e2130"
        >
          <MenuIcon size={18} />
        </button>
        {menuOpen && (
          <div className="absolute top-2 right-65 ">
            <Dropdown onClose={() => setMenuOpen(false)} />
          </div>
        )}
      </div>

      {/* ── History Sidebar ── */}
      {sidebarOpen ? (
        <aside className="w-64 shrink-0 border-r border-[#1e2130] flex flex-col h-screen sticky top-0">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-[#1e2130]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LoaderCircle size={14} className="text-gray-500" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Resume Analyzer
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-[#1e2130] bg-[#13161d] transition hover:bg-[#1e2130] text-gray-400"
                aria-label="Close sidebar"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <button
              onClick={() => navigate("/report-history")}
              className="mx-3 mt-3 flex w-[calc(100%-1.5rem)] items-center justify-between gap-3 rounded-xl border border-[#1e2130] bg-[#13161d] px-4 py-3 text-left transition-all hover:border-[#ff3e7f]/40 hover:bg-[#1e2130] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1e2130] bg-[#0d0f14]">
                  <FileText size={16} className="text-[#ff3e7f]" />
                </span>
                <div className="flex flex-col leading-tight cursor-pointer">
                  <span className="text-sm font-semibold text-white">
                    Report History
                  </span>
                  <span className="text-[10px] text-gray-500">
                    View all your past analyses
                  </span>
                </div>
              </div>
              <ChevronRightIcon size={14} className="text-gray-600" />
            </button>

            {/* User details */}
            <div
              className="px-3 py-3 border-t border-[#89A8B2]/15 flex items-center gap-3 cursor-pointer rounded m-1 hover:bg-[#1e2130] hover:border-[#ff3e7f]/40 transition-all"
              onClick={() => navigate("/profile")}
            >
              <div className="w-8 h-8 rounded-full bg-[#89A8B2] flex items-center justify-center text-sm font-semibold text-[#0f1219]">
                {user?.fullname?.firstname?.charAt(0)?.toUpperCase() ||
                  "U"}{" "}
              </div>
              <div>
                <p className="text-sm text-white font-medium">
                  {user?.fullname?.firstname || "User"}
                </p>
                <p className="text-xs text-[#B3C8CF]/50">{user?.email}</p>
              </div>
            </div>
          </div>
        </aside>
      ) : (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed left-4 top-4 z-50 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[#1e2130] bg-[#13161d] transition hover:bg-[#1e2130]"
          aria-label="Open sidebar"
          title="Open"
        >
          <PanelLeftDashed className="text-gray-400" size={16} />
        </button>
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col items-center px-4 py-8 overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-8 max-w-xl">
          <h1 className="text-4xl font-bold mb-3">
            Create Your Custom{" "}
            <span className="text-[#ff3e7f]">Interview Plan</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Turn your profile into a job-winning strategy 🚀.
          </p>
        </div>

        {/* Main Card */}
        <div className="w-full max-w-5xl bg-[#13161d] border border-[#1e2130] rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Job Description */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 font-semibold text-base">
                <span className="text-[#ff3e7f]">💼</span> Target Job
                Description
              </div>
              <span className="text-[10px] font-bold bg-[#ff3e7f]/20 text-[#ff3e7f] px-2 py-0.5 rounded">
                REQUIRED
              </span>
            </div>
            <textarea
              className="flex-1 min-h-[320px] bg-[#0d0f14] border border-[#1e2130] rounded-xl p-4 text-sm text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-[#ff3e7f]/50 transition-colors"
              placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              maxLength={5000}
            />
            <div className="text-right text-xs text-gray-600">
              {jobDescription.length} / 5000 chars
            </div>
          </div>

          {/* Right: Profile */}
          <div className="flex flex-col gap-4">
            <div className="font-semibold text-base flex items-center gap-2">
              <span>👤</span> Your Profile
            </div>

            {/* Resume Upload */}
            <div>
              <div className="flex items-center gap-2 text-sm mb-2">
                <span className="font-medium">Upload Resume</span>
                <span className="text-[10px] font-bold bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                  BEST RESULTS
                </span>
              </div>
              <div
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  dragOver
                    ? "border-[#ff3e7f] bg-[#ff3e7f]/5"
                    : resumeFile
                      ? "border-green-500/50 bg-green-500/5"
                      : "border-[#1e2130] bg-[#0d0f14] hover:border-[#ff3e7f]/40"
                }`}
                onClick={() => fileInputRef.current.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                {resumeFile ? (
                  <>
                    <div className="text-green-400 text-2xl mb-1">✓</div>
                    <p className="text-green-400 text-sm font-medium">
                      {resumeFile.name}
                    </p>
                    <p
                      className="text-xs text-gray-500 mt-1 hover:text-[#ff3e7f] transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setResumeFile(null);
                      }}
                    >
                      Remove file
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-[#ff3e7f] text-3xl mb-2">↑</div>
                    <p className="text-sm font-medium text-gray-300">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-gray-600 mt-1">PDF (Max 4MB)</p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#1e2130]" />
              <span className="text-xs text-gray-600">OR</span>
              <div className="flex-1 h-px bg-[#1e2130]" />
            </div>

            {/* Self Description */}
            <div>
              <p className="text-sm font-medium mb-2">Quick Self-Description</p>
              <textarea
                className={`w-full h-28 bg-[#0d0f14] border rounded-xl p-3 text-sm text-gray-300 placeholder-gray-600 resize-none focus:outline-none transition-colors ${
                  selfDescription.trim()
                    ? "border-[#ff3e7f]/50"
                    : "border-[#1e2130] focus:border-[#ff3e7f]/50"
                }`}
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
              />
            </div>

            {/* Info Banner */}
            {!resumeFile && !selfDescription.trim() && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">ℹ</span>
                <p className="text-xs text-blue-300 leading-relaxed">
                  Either a <strong>Resume</strong> or a{" "}
                  <strong>Self Description</strong> is required to generate a
                  personalized plan.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Bar */}
        <div className="w-full max-w-4xl mt-4 flex items-center justify-between px-1">
          <p className="text-xs text-gray-600">
            AI-Powered Strategy Generation · Approx 30s
          </p>
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className={`flex items-center cursor-pointer gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
              isValid && !loading
                ? "bg-[#ff3e7f] hover:bg-[#ff1a6a] text-white shadow-lg shadow-[#ff3e7f]/20 hover:shadow-[#ff3e7f]/40 active:scale-95"
                : "bg-[#1e2130] text-gray-600 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Analyzing...
              </>
            ) : (
              <>★ Generate My Interview Strategy</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeHome;
