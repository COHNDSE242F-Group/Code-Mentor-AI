import React, { useState } from "react";
import CodeEditor from "../components/CodeEditor";

function CodeEditorPage() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");

  const handleCodeChange = (newValue) => {
    try {
      setCode(newValue);
    } catch (error) {
      console.error("Error updating code:", error);
    }
  };

  return (
    <div style={{ padding: "1.5rem", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: "1rem" }}>CodeMentorAI Editor</h1>

      {/* Language Selector */}
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="language">Language:&nbsp;</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="c">C</option>
        </select>
      </div>

      {/* Code Editor */}
      <CodeEditor language={language} value={code} onChange={handleCodeChange} />
    </div>
  );
}

export default CodeEditorPage;