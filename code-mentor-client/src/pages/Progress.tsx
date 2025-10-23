import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  BookOpenIcon,
  BrainIcon,
  CodeIcon,
  TrendingUpIcon,
  CheckCircleIcon,
} from "lucide-react";

// --- Type Definitions ---
interface ConceptPerformance {
  name: string;
  score: number;
  avg: number;
}

interface WeeklyProgress {
  week: string;
  score: number;
}

interface ConceptItem {
  id: string;
  name: string;
  score?: number;
  difficulty?: string;
}

// --- Reusable Components ---
const StatCard = ({
  icon,
  bgColor,
  textColor,
  label,
  value,
}: {
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  label: string;
  value: string;
}) => (
  <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 transition hover:scale-[1.02] hover:border-slate-600">
    <div className="flex items-center">
      <div
        className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center`}
      >
        {icon}
      </div>
      <div className="ml-3">
        <p className="text-sm text-slate-400">{label}</p>
        <p className="text-xl font-semibold text-white">{value}</p>
      </div>
    </div>
  </div>
);

const ConceptList = ({
  title,
  color,
  icon,
  data,
  type,
}: {
  title: string;
  color: string;
  icon: React.ReactNode;
  data: ConceptItem[];
  type: "practice" | "mastered" | "new";
}) => (
  <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
    <div className="flex items-center mb-4">
      <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center`}>
        {icon}
      </div>
      <h3 className="text-lg font-medium text-white ml-2">{title}</h3>
    </div>
    <div className="space-y-4">
      {data.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-700 hover:border-slate-600 transition"
        >
          <div>
            <p className="font-medium text-white">{item.name}</p>
            {type === "new" ? (
              <p className="text-sm text-slate-400">Unlocks soon</p>
            ) : (
              <div className="mt-1 w-40 bg-slate-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    type === "practice" ? "bg-amber-500" : "bg-teal-500"
                  }`}
                  style={{ width: `${item.score}%` }}
                ></div>
              </div>
            )}
          </div>

          {type === "new" ? (
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                item.difficulty === "Easy"
                  ? "bg-emerald-900/50 text-emerald-300"
                  : item.difficulty === "Medium"
                  ? "bg-amber-900/50 text-amber-300"
                  : "bg-red-900/50 text-red-300"
              }`}
            >
              {item.difficulty}
            </span>
          ) : (
            <span
              className={`font-medium ${
                type === "practice" ? "text-amber-400" : "text-teal-400"
              }`}
            >
              {item.score}%
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
);

// --- Main Component ---
const Progress: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<ConceptPerformance[]>([]);
  const [progressOverTime, setProgressOverTime] = useState<WeeklyProgress[]>([]);
  const [needsPractice, setNeedsPractice] = useState<ConceptItem[]>([]);
  const [mastered, setMastered] = useState<ConceptItem[]>([]);
  const [newConcepts, setNewConcepts] = useState<ConceptItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock API fetch (replace with your real API later)
  useEffect(() => {
    setTimeout(() => {
      setPerformanceData([
        { name: "Arrays", score: 85, avg: 70 },
        { name: "Linked Lists", score: 78, avg: 65 },
        { name: "Trees", score: 65, avg: 60 },
        { name: "Graphs", score: 45, avg: 55 },
        { name: "DP", score: 60, avg: 50 },
        { name: "Sorting", score: 90, avg: 75 },
        { name: "Searching", score: 82, avg: 72 },
      ]);
      setProgressOverTime([
        { week: "Week 1", score: 60 },
        { week: "Week 2", score: 65 },
        { week: "Week 3", score: 68 },
        { week: "Week 4", score: 72 },
        { week: "Week 5", score: 75 },
        { week: "Week 6", score: 78 },
        { week: "Week 7", score: 83 },
      ]);
      setNeedsPractice([
        { id: "graphs", name: "Graph Algorithms", score: 45 },
        { id: "trees", name: "Binary Search Trees", score: 65 },
        { id: "dp", name: "Dynamic Programming", score: 60 },
      ]);
      setMastered([
        { id: "arrays", name: "Array Manipulation", score: 92 },
        { id: "sorting", name: "Sorting Algorithms", score: 90 },
        { id: "searching", name: "Binary Search", score: 88 },
      ]);
      setNewConcepts([
        { id: "greedy", name: "Greedy Algorithms", difficulty: "Medium" },
        { id: "backtracking", name: "Backtracking", difficulty: "Hard" },
        { id: "hashing", name: "Hash Tables", difficulty: "Easy" },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <p className="text-slate-400">Loading progress...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Your Progress</h1>
        <p className="text-slate-400 mt-1">
          Track your mastery and improvements over time.
        </p>
      </div>

      {/* --- Stats Overview --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<BookOpenIcon size={20} className="text-indigo-400" />}
          bgColor="bg-indigo-500/20"
          textColor="text-indigo-400"
          label="Completed"
          value="18 Problems"
        />
        <StatCard
          icon={<BrainIcon size={20} className="text-teal-400" />}
          bgColor="bg-teal-500/20"
          textColor="text-teal-400"
          label="Mastery Level"
          value="Intermediate"
        />
        <StatCard
          icon={<CodeIcon size={20} className="text-purple-400" />}
          bgColor="bg-purple-500/20"
          textColor="text-purple-400"
          label="Code Quality"
          value="Good"
        />
        <StatCard
          icon={<TrendingUpIcon size={20} className="text-amber-400" />}
          bgColor="bg-amber-500/20"
          textColor="text-amber-400"
          label="Improvement"
          value="+23% this month"
        />
      </div>

      {/* --- Charts --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h3 className="text-lg font-medium text-white mb-4">
            Performance by Concept
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderColor: "#334155",
                    borderRadius: "0.375rem",
                  }}
                  labelStyle={{ color: "#f1f5f9" }}
                  itemStyle={{ color: "#94a3b8" }}
                />
                <Bar dataKey="score" name="Your Score" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avg" name="Class Average" fill="#334155" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h3 className="text-lg font-medium text-white mb-4">Progress Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="week" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderColor: "#334155",
                    borderRadius: "0.375rem",
                  }}
                  labelStyle={{ color: "#f1f5f9" }}
                  itemStyle={{ color: "#94a3b8" }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#14b8a6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- Lists --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ConceptList
          title="Needs Practice"
          color="bg-amber-500/20"
          icon={<TrendingUpIcon size={16} className="text-amber-400" />}
          data={needsPractice}
          type="practice"
        />
        <ConceptList
          title="Mastered"
          color="bg-teal-500/20"
          icon={<CheckCircleIcon size={16} className="text-teal-400" />}
          data={mastered}
          type="mastered"
        />
        <ConceptList
          title="New Concepts"
          color="bg-indigo-500/20"
          icon={<BookOpenIcon size={16} className="text-indigo-400" />}
          data={newConcepts}
          type="new"
        />
      </div>
    </div>
  );
};

export default Progress;