import React from 'react';
import { TerminalIcon } from 'lucide-react';
interface ConsoleOutputProps {
  output: string;
}
const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  output
}) => {
  return <div className="h-64 bg-[#11111b] border-t border-[#313244]">
      <div className="flex items-center px-4 py-2 bg-[#181825] border-b border-[#313244]">
        <TerminalIcon size={16} className="mr-2 text-gray-400" />
        <span className="text-sm font-medium">Console</span>
      </div>
      <div className="p-4 h-[calc(100%-36px)] overflow-auto font-mono text-sm">
        {output ? <pre className="whitespace-pre-wrap text-gray-300">{output}</pre> : <div className="text-gray-500 italic">
            Run your code to see output here
          </div>}
      </div>
    </div>;
};
export default ConsoleOutput;