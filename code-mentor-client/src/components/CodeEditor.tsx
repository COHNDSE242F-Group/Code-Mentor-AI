import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  onPaste?: () => void;
  disableRightClick?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  value,
  onChange,
  onPaste,
  disableRightClick = false
}) => {
  const languageMap: Record<string, string> = {
    python: 'python',
    javascript: 'javascript',
    c: 'c'
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (disableRightClick) e.preventDefault();
  };

  const handlePaste = () => {
    if (onPaste) onPaste();
  };

  return (
    <div onContextMenu={handleContextMenu} onPaste={handlePaste} className="h-full w-full">
      <Editor
        height="100%"
        defaultLanguage={languageMap[language] || 'javascript'}
        language={languageMap[language] || 'javascript'}
        value={value}
        onChange={v => onChange(v || '')}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          padding: { top: 16 }
        }}
      />
    </div>
  );
};

export default CodeEditor;