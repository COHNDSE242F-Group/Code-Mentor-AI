import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlayIcon, MessageSquareIcon, BookOpenIcon, ClockIcon, CheckCircleIcon } from "lucide-react";
import { fetchWithAuth } from "../utils/auth";

interface Assignment {
  Assignment: {
    assignment_id: number;
    assignment_name: string;
    description: any;
    due_date: string;
    due_time: string;
    difficulty: string;
    instructor_id: number;
    batch_id: number;
  };
  Submission_id: number | null;
}

interface PerformanceItem {
  name: string;
  score: number;
  avg: number;
}

interface ProgressData {
  performance?: PerformanceItem[];
}

const StudentDashboard: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load assignments
        const assignmentsRes = await fetchWithAuth("http://localhost:8000/student_assignment", {
          method: "GET",
        });
        
        if (!assignmentsRes.ok) throw new Error(`HTTP ${assignmentsRes.status} - ${assignmentsRes.statusText}`);
        
        const assignmentsData: Assignment[] = await assignmentsRes.json();
        setAssignments(assignmentsData);

        // Load performance data (if needed for concept mastery rings)
        const progressRes = await fetchWithAuth("http://localhost:8000/progress/", {
          method: "GET",
        });
        
        if (progressRes.ok) {
          const progressData: ProgressData = await progressRes.json();
          setProgress(progressData);
        }

      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate summary statistics from assignments
  const calculateSummary = () => {
    const totalAssigned = assignments.length;
    const submittedCount = assignments.filter(assignment => assignment.Submission_id !== null).length;
    const pendingCount = totalAssigned - submittedCount;
    
    // Calculate due this week (assuming current week logic)
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const dueThisWeek = assignments.filter(assignment => {
      const dueDate = new Date(assignment.Assignment.due_date);
      return dueDate <= oneWeekFromNow && dueDate >= now;
    }).length;

    return {
      totalAssigned,
      submittedCount,
      pendingCount,
      dueThisWeek
    };
  };

  const summary = calculateSummary();
  const ringColors = ["#6366f1", "#14b8a6", "#a855f7", "#f59e0b", "#ef4444", "#3b82f6"];

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-slate-400 mt-1">
            Your learning journey continues. Here's what's new today.
          </p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Link to="/editor/last" className="button-primary flex items-center">
            <PlayIcon size={16} className="mr-2" />
            Resume Last Activity
          </Link>
          <Link to="/editor/chat" className="button-secondary flex items-center">
            <MessageSquareIcon size={16} className="mr-2" />
            Open AI Tutor
          </Link>
        </div>
      </div>

      {/* Dynamic summary cards */}
      {loading ? (
        <p className="text-slate-400">Loading summary...</p>
      ) : error ? (
        <p className="text-red-400">⚠️ {error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Assigned Problems */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Assigned Problems</h3>
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <BookOpenIcon size={20} className="text-indigo-400" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-4 text-white">
              {summary.totalAssigned}
            </p>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-indigo-400">
                {summary.dueThisWeek} due this week
              </span>
              <span className="mx-2 text-slate-600">•</span>
              <span className="text-slate-400">{summary.pendingCount} pending</span>
            </div>
          </div>

          {/* Completed Problems */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Completed Problems</h3>
              <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                <CheckCircleIcon size={20} className="text-teal-400" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-4 text-white">
              {summary.submittedCount}
            </p>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-teal-400">
                {summary.totalAssigned > 0 
                  ? Math.round((summary.submittedCount / summary.totalAssigned) * 100)
                  : 0}% complete
              </span>
              <span className="mx-2 text-slate-600">•</span>
              <span className="text-slate-400">{summary.pendingCount} remaining</span>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Upcoming Deadlines</h3>
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <ClockIcon size={20} className="text-amber-400" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-4 text-white">
              {summary.dueThisWeek}
            </p>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-amber-400">
                Next: {assignments.length > 0 ? assignments[0].Assignment.assignment_name : "N/A"}
              </span>
              <span className="mx-2 text-slate-600">•</span>
              <span className="text-slate-400">
                {assignments.length > 0 ? assignments[0].Assignment.due_date : "N/A"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Concept Mastery Rings - stays the same */}
      {progress?.performance?.length ? (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-white mb-4">Concept Mastery</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {progress.performance.map((concept, idx) => {
              const percent = Math.round(concept.score);
              const radius = 45;
              const strokeWidth = 10;
              const circumference = 2 * Math.PI * radius;
              const offset = circumference - (percent / 100) * circumference;
              const color = ringColors[idx % ringColors.length];

              return (
                <div key={idx} className="flex flex-col items-center">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth={strokeWidth}
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                      <text
                        x="50"
                        y="50"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        className="text-2xl font-bold fill-white"
                      >
                        {percent}%
                      </text>
                    </svg>
                  </div>
                  <p className="text-center mt-2 text-slate-300">{concept.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default StudentDashboard;