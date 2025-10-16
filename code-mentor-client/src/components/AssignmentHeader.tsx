import React from 'react';
import { ClockIcon, AlertCircleIcon } from 'lucide-react';
interface AssignmentHeaderProps {
  timeRemaining: number;
}
const AssignmentHeader: React.FC<AssignmentHeaderProps> = ({
  timeRemaining
}) => {
  // Format time remaining as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    const secs = seconds % 60;
    return [hours.toString().padStart(2, '0'), minutes.toString().padStart(2, '0'), secs.toString().padStart(2, '0')].join(':');
  };
  return <header className="flex flex-col w-full">
      <div className="flex items-center justify-between px-6 py-4 bg-[#181825] border-b border-[#313244]">
        <h1 className="text-xl font-medium text-white">CodeTutor Assignment</h1>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center ${timeRemaining < 300 ? 'text-red-400' : 'text-gray-300'}`}>
            <ClockIcon size={18} className="mr-2" />
            <span className="font-mono">{formatTime(timeRemaining)}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center px-4 py-2 bg-amber-900/30 border-b border-amber-800/50">
        <AlertCircleIcon size={16} className="mr-2 text-amber-400" />
        <p className="text-sm text-amber-200">
          Academic Integrity Notice: This assignment is monitored for
          plagiarism. All code submissions are analyzed and compared against
          known solutions.
        </p>
      </div>
    </header>;
};
export default AssignmentHeader;