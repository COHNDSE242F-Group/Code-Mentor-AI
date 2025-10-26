import React, { useEffect, useState, useRef, } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import LanguageSwitcher from "../components/LanguageSwitcher";
import AiTutorChat from "../components/AiTutorChat";
import ProblemDetails from "../components/ProblemDetails";
import { fetchWithAuth } from "../utils/auth";
import {
  PlayIcon,
  SendIcon,
  HelpCircleIcon,
  AlertTriangleIcon,
  FileTextIcon,
  ListIcon,
  Code2Icon,
  TerminalIcon,
  ClipboardListIcon,
  BeakerIcon,
} from "lucide-react";

const CodeEditorPage: React.FC = () => {
  const navigate = useNavigate();

  const reactLocation = useLocation();
  const searchParams = new URLSearchParams(reactLocation.search);
  const assignmentId = searchParams.get("assignmentId");
  const problemId = searchParams.get("problemId");

  // ---------------------------
  // State variables
  // ---------------------------
  const [selectedLanguage, setSelectedLanguage] = useState<string>("javascript");
  const [code, setCode] = useState<string>(
    "// Write your solution here\nconsole.log('Hello, world!');"
  );
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("description");
  const [pasteDetected, setPasteDetected] = useState<boolean>(false);
  const [showHintButton, setShowHintButton] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const editorRef = useRef<any>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [keystrokeReport, setKeystrokeReport] = useState<{code: string; paste: boolean} | null>(null);
  const defaultCodeMap: Record<string, string> = {
    javascript: "// Write your solution here\nconsole.log('Hello, world!');",
    python: "# Write your solution here\nprint('Hello, world!')",
    c: "/* Write your solution here */\n#include <stdio.h>\nint main() {\n    printf(\"Hello, world!\\n\");\n    return 0;\n}",
  };
  const [problemData, setProblemData] = useState<any>(null);
  // ---------------------------
  // Auth & Page Setup
  // ---------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    document.title = `CodeMentorAI - ${problemId || "Code Editor"}`;
  }, [problemId]);

  useEffect(() => {
    const initializePage = async () => {
      // Check for invalid cases: neither or both IDs provided
      if ((!assignmentId && !problemId) || (assignmentId && problemId)) {
        console.error("Invalid URL: must provide either assignmentId or problemId, not both.");
        navigate("/");
        return;
      }

      if (assignmentId) {
        try {
          const res = await fetchWithAuth(`http://localhost:8000/assignment/${assignmentId}`, {
            method: "GET",
          });

          if (res.status === 401 || res.status === 403) {
            navigate("/");
            return;
          }

          if (!res.ok) {
            navigate("/");
            console.error("Failed to fetch assignment");
            return;
          }

          const assignmentData = await res.json();
          console.log("Assignment loaded:", assignmentData);
          setProblemData(assignmentData);

        } catch (err) {
          console.error("Error fetching assignment:", err);
          navigate("/");
        }
      } else if (problemId) {
        // TODO: implement problem fetching logic later
        console.log("Problem mode, ID:", problemId);
      }
    };

    initializePage();
  }, [assignmentId, problemId]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const token = localStorage.getItem("token");
      const code = editorRef.current?.getValue() || "";
      const language = selectedLanguage;

      // Prepare payload with token
      const payload = JSON.stringify({
        action: "exit",
        code,
        language,
        token,
      });

      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("http://localhost:8000/keystroke/clear", blob);

      // Optional: show browser confirmation dialog
      e.preventDefault();
      e.returnValue = ""; // required in Chrome
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [selectedLanguage]);

  // ---------------------------
  // Helper: Auth headers
  // ---------------------------
  const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const handleUndo = () => {
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'undo', null);
    }
    setShowPasteModal(false);
  };

  const handleContinue = () => {
    setShowPasteModal(false);

    if (editorRef.current) {
      // Trigger sending paste keystroke to backend
      editorRef.current.sendPasteEvent();
    }
  };


  // ---------------------------
  // Ensure user is logged in
  // ---------------------------
  const ensureLoggedIn = (): boolean => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return false;
    }
    return true;
  };

  // ---------------------------
  // Handle Code Change
  // ---------------------------
  const handleCodeChange = (newCode: string, isPaste?: boolean) => {
    setCode(newCode);
    if (isPaste) setShowPasteModal(true);
  };

  // ---------------------------
  // Run Code
  // ---------------------------
  const handleRunCode = async () => {
    if (!ensureLoggedIn()) return;

    setLoading(true);
    setConsoleOutput(`> Running ${selectedLanguage} code...\n`);

    try {
      const res = await fetchWithAuth("http://localhost:8000/run", {
        method: "POST",
        body: JSON.stringify({ language: selectedLanguage, code, stdin: "" }),
      });

      const data = await res.json();
      let output = "";
      if (data.stdout) output += data.stdout;
      if (data.stderr) output += `${data.stdout ? "\n" : ""}Error: ${data.stderr}`;

      setConsoleOutput((prev) => prev + output);
    } catch (err: any) {
      setConsoleOutput((prev) => prev + `\nError: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Submit Code
  // ---------------------------
  const handleSubmitCode = async () => {
    if (!ensureLoggedIn()) return;

    try {
      const res = await fetchWithAuth("http://localhost:8000/keystroke/report", {
        method: "GET",
      });

      if (!res.ok) throw new Error("Failed to fetch report");

      const report = await res.json();
      setKeystrokeReport(report);
      setShowSubmitModal(true); // Show modal
    } catch (err) {
      console.error("Failed to fetch keystroke report", err);
    }
  };

  const handleConfirmSubmit = async (assignmentId: number, keystrokeReport: any) => {
    if (!ensureLoggedIn()) return;

    try {
      // Submit code & keystroke report
      const submitRes = await fetchWithAuth("http://localhost:8000/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignment_id: assignmentId, report: keystrokeReport }),
      });

      if (!submitRes.ok) {
        const errorData = await submitRes.json();
        throw new Error(errorData.detail || "Submission failed");
      }

      const submitData = await submitRes.json();
      const submission_id = submitData.submission_id;
      console.log(submission_id);
      if (!submission_id) throw new Error("No submission_id returned from submit");

      console.log("Submission successful:", submitData);

      // Trigger AI evaluation (fire-and-forget)
      fetchWithAuth(`http://localhost:8000/report/ai-evaluation?submission_id=${submission_id}`, {
        method: "POST",
      }).catch(err => console.warn("AI evaluation failed:", err));

      // Trigger progress report (fire-and-forget)
      fetchWithAuth(`http://localhost:8000/report/progress_report?submission_id=${submission_id}`, {
        method: "POST",
      }).catch(err => console.warn("Progress report failed:", err));

      // Clear the user's keystroke cache
      const token = localStorage.getItem("token");
      if (token) {
        const clearRes = await fetch("http://localhost:8000/keystroke/clear", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!clearRes.ok) {
          const clearErr = await clearRes.json();
          console.warn("Failed to clear keystrokes:", clearErr.detail);
        } else {
          console.log("Keystrokes cleared successfully");
        }
      }

      alert("Code submitted successfully!");
      setShowSubmitModal(false);
      resetEditor();

    } catch (err) {
      console.error("Error submitting code:", err);
      alert("Submission failed. Please try again.");
    }
  };

  const resetEditor = () => {
    const initialCode = defaultCodeMap[selectedLanguage];
    
    // Update the Monaco editor without triggering handleChange
    editorRef.current?.setValue(initialCode);

    // Update internal lastCode so paste detection stays correct
    if (editorRef.current?.lastCode !== undefined) {
      editorRef.current.lastCode = initialCode; // optional if you want to avoid paste detection
    }

    // Reset other states in parent if needed
    setCode(initialCode);
    setPasteDetected(false);
    setConsoleOutput("");
    setKeystrokeReport(null);
    setShowSubmitModal(false);
  };

  // ---------------------------
  // Hint Button
  // ---------------------------
  const handleAskForHint = () => setShowHintButton(false);

  // ---------------------------
  // JSX Layout
  // ---------------------------
  return (
    <div className="relative flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
      <div className="flex flex-1 overflow-hidden relative min-h-0">
        {/* ==================== Left Sidebar ==================== */}
        <div className="flex h-full bg-[#1e1e2e] border-r border-[#313244] w-[320px] flex-shrink-0 min-h-0">
          {/* Sidebar Icons */}
          <div className="w-14 bg-[#181825] border-r border-[#313244] flex flex-col items-center py-3 space-y-4">
            {[
              { tab: "description", icon: FileTextIcon, title: "Description" },
              { tab: "io", icon: TerminalIcon, title: "Input / Output" },
              { tab: "constraints", icon: ClipboardListIcon, title: "Constraints" },
              { tab: "examples", icon: ListIcon, title: "Examples" },
              { tab: "solution", icon: Code2Icon, title: "Solution" },
              { tab: "testcases", icon: BeakerIcon, title: "Test Cases" },
            ].map(({ tab, icon: Icon, title }) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`p-2 rounded-md transition-all ${
                  activeTab === tab
                    ? "bg-[#313244] text-teal-400"
                    : "text-gray-400 hover:text-gray-200 hover:bg-[#313244]/50"
                }`}
                title={title}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>

          {/* Problem Details Section */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between px-4 py-3 bg-[#181825] border-b border-[#313244]">
              <h2 className="font-semibold text-sm text-slate-200">
                Problem Details
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 min-h-0">
              <ProblemDetails
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                data={problemData}
              />
            </div>
          </div>
        </div>

        {/* ==================== Main Editor Area ==================== */}
        <div className="flex flex-col border-r border-slate-700 w-[800px] flex-shrink-0 min-h-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
            <LanguageSwitcher
              selectedLanguage={selectedLanguage}
              onSelectLanguage={setSelectedLanguage}
            />
            <div className="flex space-x-2">
              <button
                onClick={handleRunCode}
                disabled={loading}
                className="flex items-center px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors disabled:opacity-50"
              >
                <PlayIcon size={16} className="mr-1.5" />
                {loading ? "Running..." : "Run"}
              </button>
              <button
                onClick={handleSubmitCode}
                className="flex items-center px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
              >
                <SendIcon size={16} className="mr-1.5" />
                Submit
              </button>
            </div>
          </div>

          {/* Code Editor & Output */}
          <div className="flex-1 flex flex-col overflow-hidden relative min-h-0">
            {/* Paste alert */}
            {pasteDetected && (
              <div className="absolute top-2 right-2 flex items-center bg-amber-700 text-white px-3 py-2 rounded-md z-10 animate-fade-in-out">
                <AlertTriangleIcon size={16} className="mr-2" />
                <span className="text-sm font-medium">
                  Paste detected! This may be flagged for plagiarism.
                </span>
              </div>
            )}

            {/* Code editor */}
            <div className="flex-1 overflow-auto bg-gray-800 min-h-0">
              <CodeEditor
                ref={editorRef}
                language={selectedLanguage}
                value={code}
                onChange={handleCodeChange}
                disableRightClick
                onServerPaste={(detected: boolean) => {
                  if (detected) {
                    setPasteDetected(true);
                    setTimeout(() => setPasteDetected(false), 3000);
                  }
                }}
              />

              {showPasteModal && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                  <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md text-center space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Paste Detected
                    </h2>
                    <p className="text-gray-600">
                      A paste action was detected. Do you want to undo the last action?
                    </p>

                    <label className="flex items-center gap-2 text-sm text-gray-600 justify-center">
                      <input type="checkbox" required />
                      I understand this will be recorded.
                    </label>

                    <div className="flex justify-center gap-4 pt-3">
                      <button
                        onClick={handleUndo}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Undo
                      </button>
                      <button
                        onClick={handleContinue}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Hint button */}
            {showHintButton && (
              <button
                onClick={handleAskForHint}
                className="absolute bottom-6 right-6 flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-colors"
              >
                <HelpCircleIcon size={18} />
                <span>Ask for Hint</span>
              </button>
            )}

            {/* Console output */}
            <div className="h-32 border-t border-slate-700 overflow-auto p-2 font-mono bg-gray-900 text-white whitespace-pre-wrap">
              {consoleOutput}
            </div>
          </div>
        </div>

        {/* ==================== AI Tutor Chat ==================== */}
        <div className="hidden lg:block">
          <div className="fixed top-0 right-0 h-full w-[400px] hover:w-[600px] transition-all duration-300 ease-in-out z-50 overflow-hidden shadow-xl bg-[#1e1e2e]">
            <AiTutorChat />
          </div>
        </div>

        {showSubmitModal && keystrokeReport && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
            <div className="bg-white w-11/12 max-w-5xl h-4/5 p-8 rounded-3xl shadow-2xl flex flex-col space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 text-center">
                Submit Code
              </h2>

              <div className="flex-1 overflow-auto bg-gray-100 p-4 rounded-lg border border-gray-300">
                <pre className="whitespace-pre-wrap text-sm md:text-base text-gray-800 font-mono">
                  {keystrokeReport.code}
                </pre>
              </div>

              <p className="text-lg font-medium text-gray-800 text-center">
                {keystrokeReport.paste ? "⚠️ Paste detected!" : "✅ No paste detected"}
              </p>

              <div className="flex justify-center gap-6">
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    console.log("User canceled submission");
                    // TODO: handle cancel logic
                  }}
                  className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    if (problemData && problemData.assignment_id) {
                      handleConfirmSubmit(problemData.assignment_id, keystrokeReport)
                    }
                  }}
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditorPage;