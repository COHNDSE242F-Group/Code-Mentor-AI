import React, { useRef, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import debounce from "lodash.debounce";
import { fetchWithAuth } from "../utils/auth";

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string, isPaste?: boolean) => void;
  disableRightClick?: boolean;
  // callback invoked when server detects a paste (backend detection)
  onServerPaste?: (detected: boolean) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  value,
  onChange,
  disableRightClick = false,
  onServerPaste,
}) => {
  const [lastCode, setLastCode] = useState(value);
  const lastChangeTime = useRef<number>(Date.now());
  const lastLineCount = useRef<number>(value.split("\n").length);
  const keystrokeTimeout = useRef<NodeJS.Timeout | null>(null);
  const editorInstance = useRef<any | null>(null);
  // timestamp of last native paste sent to server (ms)
  const pasteCooldownRef = useRef<number>(0);

  const languageMap: Record<string, string> = {
    python: "python",
    javascript: "javascript",
    c: "c",
  };

  // -----------------------------
  // Context Menu (Right Click)
  // -----------------------------
  const handleContextMenu = (e: React.MouseEvent) => {
    if (disableRightClick) e.preventDefault();
  };

  // -----------------------------
  // Backend keystroke sender
  // -----------------------------
  const sendKeystroke = async (
    action: "typing" | "paste",
    codeContent: string
  ) => {
    console.debug(`sendKeystroke called action=${action} code_len=${codeContent.length}`);
    try {
      const res = await fetchWithAuth("http://localhost:8000/keystroke", {
        method: "POST",
        body: JSON.stringify({ action, code: codeContent }),
      });

      // Log response status and body (if any) to help debugging
      console.debug("keystroke response status=", res.status);
      if (res.headers.get("content-type")?.includes("application/json")) {
        try {
          const data = await res.json();
          console.debug("keystroke response json=", data);
          // If backend signals a paste (dev heuristic), notify parent via callback
          if (data && data.alert && typeof onServerPaste === "function") {
            console.info("Server signaled paste via /keystroke");
            onServerPaste(true);
          }
        } catch (err) {
          console.warn("Failed to parse /keystroke response JSON", err);
        }
      }
    } catch (err) {
      console.error("Failed to send keystroke event", err);
    }
  };

  const sendTypingEvent = useRef(
    debounce((newCode: string) => {
      sendKeystroke("typing", newCode);
    }, 500)
  ).current;

  // Native paste handler attached to the Monaco editor's DOM to make detection reliable
  const handleNativePaste = (e: ClipboardEvent) => {
    try {
      const now = Date.now();
      pasteCooldownRef.current = now;
      const editor = editorInstance.current;
      const code = editor ? editor.getValue() : lastCode;
      console.info("Native paste event detected, sending paste keystroke");
      sendKeystroke("paste", code);
      onChange(code, true);
      setLastCode(code);
    } catch (err) {
      console.error("Error handling native paste", err);
    }
  };

  // -----------------------------
  // Smarter Paste Detection Logic (Synced with CodeEditorPage)
  // -----------------------------
  const detectPasteHeuristically = (oldCode: string, newCode: string): boolean => {
    const now = Date.now();
    const timeDiff = now - lastChangeTime.current;
    const charDiff = Math.abs(newCode.length - oldCode.length);
    const absDiff = charDiff;
    const newLineCount = newCode.split("\n").length;
    const lineDiff = Math.abs(newLineCount - lastLineCount.current);

    // Quick large insert detection
    const fastChange = timeDiff < 120 && absDiff > 10;
    if (absDiff < 10) return false; // too small

    // Detect structural paste (brackets, quotes, etc.)
    const addedPart =
      newCode.length > oldCode.length
        ? newCode.slice(oldCode.length)
        : newCode;
    const structuredPattern = /[{}\[\]();'"=+\-\s,]{3,}/;
    const multipleNewLines = lineDiff > 2;
    const looksStructured =
      structuredPattern.test(addedPart) || multipleNewLines;

    // Update trackers
    lastChangeTime.current = now;
    lastLineCount.current = newLineCount;

    // If a native paste was recently sent, skip heuristic to avoid duplicates
    if (Date.now() - pasteCooldownRef.current < 800) {
      console.debug("Skipping heuristic because native paste recently fired");
      return false;
    }

    console.debug("detectPasteHeuristically", { timeDiff, absDiff, lineDiff, looksStructured });
    return fastChange && looksStructured;
  };

  // -----------------------------
  // Handle code change
  // -----------------------------
  const handleChange = (newValue: string | undefined) => {
    const currentCode = newValue || "";
    const isPaste = detectPasteHeuristically(lastCode, currentCode);

    if (isPaste) {
      console.info("Editor heuristic detected paste: len", currentCode.length - lastCode.length);
      sendKeystroke("paste", currentCode);
      onChange(currentCode, true);
    } else {
      console.debug("Editor heuristic: typing event");
      if (keystrokeTimeout.current) clearTimeout(keystrokeTimeout.current);
      keystrokeTimeout.current = setTimeout(() => {
        sendKeystroke("typing", currentCode);
      }, 500);
      onChange(currentCode, false);
      sendTypingEvent(currentCode);
    }

    setLastCode(currentCode);
  };

  // -----------------------------
  // Monaco onMount hook - attach native paste listener
  // -----------------------------
  const handleEditorMount = (editor: any) => {
    editorInstance.current = editor;
    const dom = editor.getDomNode && editor.getDomNode();
    if (dom && dom.addEventListener) {
      dom.addEventListener("paste", handleNativePaste as EventListener);
    }
  };

  // Cleanup paste listener on unmount or when editorInstance changes
  useEffect(() => {
    return () => {
      const editor = editorInstance.current;
      const dom = editor && editor.getDomNode ? editor.getDomNode() : null;
      if (dom && dom.removeEventListener) {
        try {
          dom.removeEventListener("paste", handleNativePaste as EventListener);
        } catch (_e) {
          // ignore
        }
      }
    };
  }, []);

  // -----------------------------
  // Render editor
  // -----------------------------
  return (
    <div onContextMenu={handleContextMenu} className="h-full w-full">
      <Editor
        height="100%"
        language={languageMap[language] || "javascript"}
        value={value}
        onChange={handleChange}
        onMount={handleEditorMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          padding: { top: 16 },
        }}
      />
    </div>
  );
};

export default CodeEditor;