import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react";
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

const CodeEditor = forwardRef<any, CodeEditorProps>(
  (
    { language, value, onChange, disableRightClick = false, onServerPaste },
    ref
  ) => {
    const [lastCode, setLastCode] = useState(value);
    const lastChangeTime = useRef<number>(Date.now());
    const lastLineCount = useRef<number>(value.split("\n").length);
    const keystrokeTimeout = useRef<NodeJS.Timeout | null>(null);
    const editorInstance = useRef<any | null>(null);
    const pasteCooldownRef = useRef<number>(0);

    const languageMap: Record<string, string> = {
      python: "python",
      javascript: "javascript",
      c: "c",
    };

    // 🔹 Expose undo & editor actions to parent via ref
    useImperativeHandle(ref, () => ({
      trigger: (source: string, command: string, payload?: any) => {
        if (editorInstance.current) {
          editorInstance.current.trigger(source, command, payload);
        }
      },
      getValue: () => editorInstance.current?.getValue(),
      setValue: (newCode: string) =>
        editorInstance.current?.setValue(newCode),
      sendPasteEvent: () => {
        const code = editorInstance.current?.getValue() || "";
        sendKeystroke("paste", code);
      },
    }));

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

    // Fire-and-forget fetch
    fetchWithAuth("http://localhost:8000/keystroke", {
      method: "POST",
      body: JSON.stringify({ action, code: codeContent, language }),
    }).catch((err) => {
      console.error("Failed to send keystroke event", err);
    });
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
    console.log("Heuristic paste detection running...");
    const newlyAddedCode = getNewlyAddedText(oldCode, newCode);
    console.log(newlyAddedCode);

    if (newlyAddedCode.length < 10) {
      console.log("Heuristic paste detection result:");
      return false; // Too small to be a paste
    }

    // Detect structural paste (brackets, quotes, etc.)
    const structuredPattern = /.*[A-Za-z0-9]*[,\ /<"\s].*/;
    const looksStructured =
      structuredPattern.test(newlyAddedCode);
    
    console.log("Heuristic paste detection result:", looksStructured);
    
    return looksStructured;
  };

  const getNewlyAddedText = (oldCode: string, newCode: string) => {
    let start = 0;
    while (start < oldCode.length && start < newCode.length && oldCode[start] === newCode[start]) {
      start++;
    }

    let endOld = oldCode.length - 1;
    let endNew = newCode.length - 1;

    while (
      endOld >= start &&
      endNew >= start &&
      oldCode[endOld] === newCode[endNew]
    ) {
      endOld--;
      endNew--;
    }

    return newCode.slice(start, endNew + 1);
  };

  // -----------------------------
  // Handle code change
  // -----------------------------
  const handleChange = (newValue: string | undefined) => {
    const currentCode = newValue || "";
    const isPaste = detectPasteHeuristically(lastCode, currentCode);
    setLastCode(currentCode);

    if (isPaste) {
      onChange(currentCode, true);
      sendKeystroke("paste", currentCode); // fire-and-forget paste
    } else {
      onChange(currentCode, false);
      sendKeystroke("typing", currentCode); // debounced typing only
    }
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
});

export default CodeEditor;