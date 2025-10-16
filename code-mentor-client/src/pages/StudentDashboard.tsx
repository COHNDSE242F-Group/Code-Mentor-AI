// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { PlayIcon, MessageSquareIcon, BookOpenIcon, ClockIcon, CheckCircleIcon, AlertTriangleIcon } from 'lucide-react';
const Dashboard: React.FC = () => {
  return <div className="space-y-6">
      {/* Welcome section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, John!</h1>
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
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">
              Assigned Problems
            </h3>
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <BookOpenIcon size={20} className="text-indigo-400" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-4 text-white">7</p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-indigo-400">3 due this week</span>
            <span className="mx-2 text-slate-600">•</span>
            <span className="text-slate-400">4 upcoming</span>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">
              Completed Concepts
            </h3>
            <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
              <CheckCircleIcon size={20} className="text-teal-400" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-4 text-white">12</p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-teal-400">+3 this week</span>
            <span className="mx-2 text-slate-600">•</span>
            <span className="text-slate-400">75% complete</span>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">
              Upcoming Deadlines
            </h3>
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
              <ClockIcon size={20} className="text-amber-400" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-4 text-white">2</p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-amber-400">Next: Binary Search Tree</span>
            <span className="mx-2 text-slate-600">•</span>
            <span className="text-slate-400">Tomorrow</span>
          </div>
        </div>
      </div>
      {/* Progress section */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-white mb-4">Concept Mastery</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Progress rings */}
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="10" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#6366f1" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="62.8" strokeLinecap="round" transform="rotate(-90 50 50)" />
                <text x="50" y="50" dominantBaseline="middle" textAnchor="middle" className="text-2xl font-bold fill-white">
                  75%
                </text>
              </svg>
              <p className="text-center mt-2 text-slate-300">Algorithms</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="10" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#14b8a6" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="50.24" strokeLinecap="round" transform="rotate(-90 50 50)" />
                <text x="50" y="50" dominantBaseline="middle" textAnchor="middle" className="text-2xl font-bold fill-white">
                  80%
                </text>
              </svg>
              <p className="text-center mt-2 text-slate-300">Data Structures</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="10" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#a855f7" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="125.6" strokeLinecap="round" transform="rotate(-90 50 50)" />
                <text x="50" y="50" dominantBaseline="middle" textAnchor="middle" className="text-2xl font-bold fill-white">
                  50%
                </text>
              </svg>
              <p className="text-center mt-2 text-slate-300">Recursion</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="10" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="87.92" strokeLinecap="round" transform="rotate(-90 50 50)" />
                <text x="50" y="50" dominantBaseline="middle" textAnchor="middle" className="text-2xl font-bold fill-white">
                  65%
                </text>
              </svg>
              <p className="text-center mt-2 text-slate-300">
                Dynamic Programming
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Recent assignments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Recent Assignments</h3>
          <Link to="/assignments" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
            View all
          </Link>
        </div>
        <div className="space-y-4">
          {/* Assignment cards */}
          <div className="card flex flex-col md:flex-row md:items-center justify-between p-4">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-md bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <BookOpenIcon size={20} className="text-indigo-400" />
              </div>
              <div>
                <h4 className="text-white font-medium">
                  Binary Search Tree Validation
                </h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-1 bg-slate-700 text-xs rounded-full text-slate-300">
                    Data Structures
                  </span>
                  <span className="px-2 py-1 bg-slate-700 text-xs rounded-full text-slate-300">
                    Trees
                  </span>
                  <span className="px-2 py-1 bg-amber-900/50 text-xs rounded-full text-amber-300">
                    Medium
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <div className="flex items-center mr-4">
                <ClockIcon size={16} className="text-amber-400 mr-1" />
                <span className="text-sm text-slate-300">Due tomorrow</span>
              </div>
              <Link to="/editor/bst-validation" className="button-primary">
                Resume
              </Link>
            </div>
          </div>
          <div className="card flex flex-col md:flex-row md:items-center justify-between p-4">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-md bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                <CheckCircleIcon size={20} className="text-teal-400" />
              </div>
              <div>
                <h4 className="text-white font-medium">Two Sum Problem</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-1 bg-slate-700 text-xs rounded-full text-slate-300">
                    Algorithms
                  </span>
                  <span className="px-2 py-1 bg-slate-700 text-xs rounded-full text-slate-300">
                    Arrays
                  </span>
                  <span className="px-2 py-1 bg-emerald-900/50 text-xs rounded-full text-emerald-300">
                    Easy
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <div className="flex items-center mr-4">
                <CheckCircleIcon size={16} className="text-teal-400 mr-1" />
                <span className="text-sm text-slate-300">Completed</span>
              </div>
              <Link to="/editor/two-sum" className="button-outline">
                Review
              </Link>
            </div>
          </div>
          <div className="card flex flex-col md:flex-row md:items-center justify-between p-4">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-md bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangleIcon size={20} className="text-red-400" />
              </div>
              <div>
                <h4 className="text-white font-medium">Graph Traversal</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-1 bg-slate-700 text-xs rounded-full text-slate-300">
                    Algorithms
                  </span>
                  <span className="px-2 py-1 bg-slate-700 text-xs rounded-full text-slate-300">
                    Graphs
                  </span>
                  <span className="px-2 py-1 bg-red-900/50 text-xs rounded-full text-red-300">
                    Hard
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <div className="flex items-center mr-4">
                <ClockIcon size={16} className="text-red-400 mr-1" />
                <span className="text-sm text-slate-300">
                  Overdue by 2 days
                </span>
              </div>
              <Link to="/editor/graph-traversal" className="button-primary">
                Start
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Dashboard;