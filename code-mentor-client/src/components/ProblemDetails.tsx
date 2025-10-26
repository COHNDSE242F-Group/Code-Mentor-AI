import React from "react";
import { AlertCircleIcon } from "lucide-react";

interface ProblemDetailsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  data?: any;
}

const ProblemDetails: React.FC<ProblemDetailsProps> = ({ activeTab, setActiveTab, data }) => {
  if (!data || typeof data !== "object") {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <AlertCircleIcon size={40} className="mb-3 text-gray-500" />
        <p className="text-sm">No details available</p>
      </div>
    );
  }

  const { assignment_name, description: descData, due_date, instructor_id } = data;

  if (!descData || typeof descData !== "object") {
    return <p className="text-gray-400">No problem description available.</p>;
  }

  const {
    title,
    description: mainDescription,
    io,
    tasks,
    examples,
    testcases,
    constraints,
    instructions,
  } = descData;

  const tabTitles: Record<string, string> = {
    description: "Description",
    io: "Input / Output",
    tasks: "Tasks",
    examples: "Examples",
    testcases: "Test Cases",
    constraints: "Constraints",
    instructions: "Instructions",
  };

  // Recursive renderer for any object/array/primitive
  const renderValue = (val: any) => {
    if (val === null || val === undefined) return <span className="text-gray-400">N/A</span>;
    if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
      return <span className="text-gray-300">{val.toString()}</span>;
    }
    if (Array.isArray(val)) {
      return (
        <ul className="list-disc pl-6 space-y-1 text-gray-300">
          {val.map((item, i) => (
            <li key={i}>{renderValue(item)}</li>
          ))}
        </ul>
      );
    }
    if (typeof val === "object") {
      return (
        <pre className="bg-[#232634] p-3 rounded-lg text-gray-300 whitespace-pre-wrap overflow-x-auto">
          {JSON.stringify(val, null, 2)}
        </pre>
      );
    }
    return <span className="text-gray-300">{String(val)}</span>;
  };

  const getTabContent = () => {
    switch (activeTab) {
      case "description":
        return mainDescription ? renderValue(mainDescription) : <p className="text-gray-400">No description provided.</p>;

      case "io":
        if (io && typeof io === "object") {
          return (
            <div className="space-y-2">
              {io.input && (
                <div>
                  <strong className="text-gray-300">Input:</strong>
                  {renderValue(io.input)}
                </div>
              )}
              {io.output && (
                <div>
                  <strong className="text-gray-300">Output:</strong>
                  {renderValue(io.output)}
                </div>
              )}
            </div>
          );
        }
        return <p className="text-gray-400">No IO provided.</p>;

      case "tasks":
        return tasks && tasks.length > 0 ? renderValue(tasks) : <p className="text-gray-400">No tasks available.</p>;

      case "examples":
        return examples && examples.length > 0 ? (
          <div className="space-y-4">
            {examples.map((ex: any, i: number) => (
              <div key={i} className="bg-[#232634] p-4 rounded-lg">
                {ex.function && (
                  <div>
                    <strong className="text-gray-300">Function:</strong> {renderValue(ex.function)}
                  </div>
                )}
                {ex.output && (
                  <div>
                    <strong className="text-gray-300">Output:</strong> {renderValue(ex.output)}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No examples available.</p>
        );

      case "testcases":
        return testcases && testcases.length > 0 ? (
          <div className="space-y-4">
            {testcases.map((tc: any, i: number) => (
              <div key={i} className="bg-[#232634] p-4 rounded-lg">
                {tc.input && (
                  <div>
                    <strong className="text-gray-300">Input:</strong> {renderValue(tc.input)}
                  </div>
                )}
                {tc.expected_output && (
                  <div>
                    <strong className="text-gray-300">Expected Output:</strong> {renderValue(tc.expected_output)}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No test cases available.</p>
        );

      case "constraints":
        return constraints && constraints.length > 0 ? renderValue(constraints) : <p className="text-gray-400">No constraints available.</p>;

      case "instructions":
        return instructions ? renderValue(instructions) : <p className="text-gray-400">No instructions provided.</p>;

      default:
        return <p className="text-gray-400">No details available.</p>;
    }
  };

  return (
    <div className="flex-1 px-5 py-4 overflow-y-auto h-full space-y-4">
      <h2 className="text-xl font-bold text-white mb-2">
        {assignment_name || (typeof title === "string" ? title : "Problem Details")}
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