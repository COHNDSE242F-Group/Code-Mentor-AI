import React, { useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";

const CodeEditor = ({ value = "", language = "python", onChange = () => {} }) => {
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      // Python Suggestions
      monaco.languages.registerCompletionItemProvider("python", {
        provideCompletionItems: () => ({
          suggestions: [
            {
              label: "print",
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: "print(${1})",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Print output to console",
            },
            {
              label: "for",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "for ${1:item} in ${2:iterable}:\n\t${3:# code}",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "For loop in Python",
            },
          ],
        }),
      });

      // C Suggestions
      monaco.languages.registerCompletionItemProvider("c", {
        provideCompletionItems: () => ({
          suggestions: [
            {
              label: "printf",
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: 'printf("${1}");',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Print formatted output in C",
            },
            {
              label: "for",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "for (int ${1:i} = 0; ${1} < ${2:n}; ${1}++) {\n\t${3:// code}\n}",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "For loop in C",
            },
          ],
        }),
      });

      // JavaScript Suggestions
      monaco.languages.registerCompletionItemProvider("javascript", {
        provideCompletionItems: () => ({
          suggestions: [
            {
              label: "console.log",
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: "console.log(${1});",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Log output to console",
            },
            {
              label: "for",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText:
                "for (let ${1:i} = 0; ${1} < ${2:array}.length; ${1}++) {\n\t${3}// code\n}",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "For loop in JavaScript",
            },
          ],
        }),
      });
    }
  }, [monaco]);

  const handleChange = (val) => {
    try {
      if (typeof val === "string") {
        onChange(val);
      } else {
        console.warn("Unexpected editor value:", val);
      }
    } catch (err) {
      console.error("Error in CodeEditor onChange:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
    }
  };

  return (
    <div style={{ height: "500px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <Editor
        height="100%"
        value={value}
        language={language}
        onChange={handleChange}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          wordWrap: "on",
          scrollBeyondLastLine: false,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;