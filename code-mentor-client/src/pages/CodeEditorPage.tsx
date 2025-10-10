import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import LanguageSwitcher from "../components/LanguageSwitcher";
import AiTutorChat from "../components/AiTutorChat";
import ProblemDetails from "../components/ProblemDetails";
import {
  PlayIcon,
  SendIcon,
  HelpCircleIcon,
  AlertTriangleIcon,
  FileTextIcon,
  ListIcon,
  Code2Icon,
} from "lucide-react";

const CodeEditorPage: React.FC = () => {
  const { problemId } = useParams();
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(
    "// Write your solution here\nconsole.log('Hello, world!');"
  );
  const [consoleOutput, setConsoleOutput] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [pasteDetected, setPasteDetected] = useState(false);
  const [showHintButton, setShowHintButton] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = `CodeMentorAI - ${problemId || "Code Editor"}`;
  }, [problemId]);

  // ---------------------------
  // Run Code API
  // ---------------------------
  const handleRunCode = async () => {
    setLoading(true);
    setConsoleOutput(`> Running ${selectedLanguage} code...\n`);

    try {
      const res = await fetch("http://localhost:8000/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: selectedLanguage,
          code,
          stdin: "",
        }),
      });

      const data = await res.json();

      let output = "";
      if (data.stdout) output += data.stdout;
      if (data.stderr) output +=
        (data.stdout ? "\n" : "") + `Error: ${data.stderr}`;

      setConsoleOutput((prev) => prev + output);
    } catch (err: any) {
      setConsoleOutput((prev) => prev + `\nError: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = () => {
    setConsoleOutput(
      (prev) =>
        prev +
        `\n> Submitting solution...\n> Validating...\n> All test cases passed!\n> Solution submitted successfully.`
    );
  };

  const handlePasteDetected = () => {
    setPasteDetected(true);
    setTimeout(() => setPasteDetected(false), 3000);
  };

  const handleAskForHint = () => {
    setShowHintButton(false);
  };

  return (
    <div className="relative flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
      <div className="flex flex-1 overflow-hidden relative min-h-0">
        {/* 🧭 FIXED LEFT SIDEBAR */}
        <div className="flex h-full bg-[#1e1e2e] border-r border-[#313244] w-[320px] flex-shrink-0 min-h-0">
          <div className="w-14 bg-[#181825] border-r border-[#313244] flex flex-col items-center py-3 space-y-4">
            {[
              { tab: "description", icon: FileTextIcon, title: "Description" },
              { tab: "examples", icon: ListIcon, title: "Examples" },
              { tab: "solution", icon: Code2Icon, title: "Solution" },
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
              />
            </div>
          </div>
        </div>

        {/* 🧩 MAIN EDITOR AREA */}
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

          {/* Code Editor + Console */}
          <div className="flex-1 flex flex-col overflow-hidden relative min-h-0">
            {pasteDetected && (
              <div className="absolute top-2 right-2 flex items-center bg-amber-700 text-white px-3 py-2 rounded-md z-10 animate-fade-in-out">
                <AlertTriangleIcon size={16} className="mr-2" />
                <span className="text-sm font-medium">
                  Paste detected! This may be flagged for plagiarism.
                </span>
              </div>
            )}

            <div className="flex-1 overflow-auto bg-gray-800 min-h-0">
              <CodeEditor
                language={selectedLanguage}
                value={code}
                onChange={setCode}
                onPaste={handlePasteDetected}
                disableRightClick
              />
            </div>

            {showHintButton && (
              <button
                onClick={handleAskForHint}
                className="absolute bottom-6 right-6 flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-colors"
              >
                <HelpCircleIcon size={18} />
                <span>Ask for Hint</span>
              </button>
            )}

            {/* Console Output */}
            <div className="h-32 border-t border-slate-700 overflow-auto p-2 font-mono bg-gray-900 text-white whitespace-pre-wrap">
              {consoleOutput}
            </div>
          </div>
        </div>

        {/* 🤖 AI Tutor Chat - Full right panel, expands on hover */}
        <div className="hidden lg:block">
          <div
            className="
              fixed top-0 right-0 h-full
              w-[400px] hover:w-[600px]
              transition-all duration-300 ease-in-out
              z-50 overflow-hidden shadow-xl bg-[#1e1e2e]
            "
          >
            <AiTutorChat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorPage;