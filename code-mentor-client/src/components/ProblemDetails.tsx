import React from "react";
import { AlertCircleIcon } from "lucide-react";

interface ProblemDetailsProps {
  activeTab: string; // "description", "io", etc.
  setActiveTab: (tab: string) => void;
  data?: any;
}

const ProblemDetails: React.FC<ProblemDetailsProps> = ({
  activeTab,
  setActiveTab,
  data,
}) => {
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <AlertCircleIcon size={40} className="mb-3 text-gray-500" />
        <p className="text-sm">No details available</p>
      </div>
    );
  }

  const { assignment_name, description: descData, due_date, instructor_id } = data;

  if (!descData) {
    return (
      <p className="text-gray-400">No problem description available.</p>
    );
  }

  const { title, tasks, io, examples, solution, testcases, constraints, language, description, instructions } = descData;

  const tabTitles: Record<string, string> = {
    description: "Description",
    io: "Input / Output",
    tasks: "Tasks",
    examples: "Examples",
    solution: "Solution",
    testcases: "Test Cases",
    constraints: "Constraints",
    instructions: "Instructions",
  };

  const getTabContent = () => {
    switch (activeTab) {
      case "description":
        return description ? (
          <p className="text-gray-300">{description}</p>
        ) : (
          <p className="text-gray-400">No description provided.</p>
        );

      case "io":
        return io ? (
          <div>
            {io.input && (
              <p className="text-gray-300 mb-2">
                <strong>Input:</strong> {io.input}
              </p>
            )}
            {io.output && (
              <p className="text-gray-300">
                <strong>Output:</strong> {io.output}
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-400">No IO provided.</p>
        );

      case "tasks":
        return tasks && tasks.length > 0 ? (
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            {tasks.map((task: string, i: number) => (
              <li key={i}>{task}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No tasks available.</p>
        );

      case "examples":
        return examples && examples.length > 0 ? (
          <div className="space-y-4">
            {examples.map((ex: any, i: number) => (
              <div key={i} className="bg-[#232634] p-4 rounded-lg">
                {ex.function && (
                  <p className="text-gray-300">
                    <strong>Function:</strong> {ex.function}
                  </p>
                )}
                {ex.output && (
                  <p className="text-gray-300">
                    <strong>Output:</strong> {ex.output}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No examples available.</p>
        );

      case "solution":
        return solution ? (
          <pre className="bg-[#232634] p-4 rounded-lg text-gray-100 whitespace-pre-wrap overflow-x-auto">
            {solution}
          </pre>
        ) : (
          <p className="text-gray-400">No solution provided yet.</p>
        );

      case "testcases":
        return testcases && testcases.length > 0 ? (
          <div className="space-y-4">
            {testcases.map((tc: any, i: number) => (
              <div key={i} className="bg-[#232634] p-4 rounded-lg">
                {tc.input && (
                  <p className="text-gray-300">
                    <strong>Input:</strong> {tc.input}
                  </p>
                )}
                {tc.expected_output && (
                  <p className="text-gray-300">
                    <strong>Expected Output:</strong> {tc.expected_output}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No test cases available.</p>
        );

      case "constraints":
        return constraints && constraints.length > 0 ? (
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            {constraints.map((c: string, i: number) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No constraints available.</p>
        );

      case "instructions":
        return instructions ? (
          <p className="text-gray-300">{instructions}</p>
        ) : (
          <p className="text-gray-400">No instructions provided.</p>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 px-5 py-4 overflow-y-auto h-full space-y-4">
      <h2 className="text-xl font-bold text-white mb-2">
        {assignment_name || title || "Problem Details"}
      </h2>
      <p className="text-sm text-gray-400 mb-4">
        Due Date: {due_date ? new Date(due_date).toLocaleDateString() : "N/A"} | Instructor ID: {instructor_id || "N/A"}
      </p>

      <h3 className="text-lg font-bold text-white mb-2">
        {tabTitles[activeTab] || "Details"}
      </h3>
      {getTabContent()}
    </div>
  );
};

export default ProblemDetails;