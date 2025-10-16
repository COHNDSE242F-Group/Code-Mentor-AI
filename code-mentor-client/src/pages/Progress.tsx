// @ts-nocheck
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BookOpenIcon, BrainIcon, CodeIcon, TrendingUpIcon, CheckCircleIcon } from 'lucide-react';
const Progress: React.FC = () => {
  const performanceData = [{
    name: 'Arrays',
    score: 85,
    avg: 70
  }, {
    name: 'Linked Lists',
    score: 78,
    avg: 65
  }, {
    name: 'Trees',
    score: 65,
    avg: 60
  }, {
    name: 'Graphs',
    score: 45,
    avg: 55
  }, {
    name: 'DP',
    score: 60,
    avg: 50
  }, {
    name: 'Sorting',
    score: 90,
    avg: 75
  }, {
    name: 'Searching',
    score: 82,
    avg: 72
  }];
  const progressOverTime = [{
    week: 'Week 1',
    score: 60
  }, {
    week: 'Week 2',
    score: 65
  }, {
    week: 'Week 3',
    score: 68
  }, {
    week: 'Week 4',
    score: 72
  }, {
    week: 'Week 5',
    score: 75
  }, {
    week: 'Week 6',
    score: 78
  }, {
    week: 'Week 7',
    score: 83
  }];
  const needsPractice = [{
    id: 'graphs',
    name: 'Graph Algorithms',
    score: 45
  }, {
    id: 'trees',
    name: 'Binary Search Trees',
    score: 65
  }, {
    id: 'dp',
    name: 'Dynamic Programming',
    score: 60
  }];
  const mastered = [{
    id: 'arrays',
    name: 'Array Manipulation',
    score: 92
  }, {
    id: 'sorting',
    name: 'Sorting Algorithms',
    score: 90
  }, {
    id: 'searching',
    name: 'Binary Search',
    score: 88
  }];
  const newConcepts = [{
    id: 'greedy',
    name: 'Greedy Algorithms',
    difficulty: 'Medium'
  }, {
    id: 'backtracking',
    name: 'Backtracking',
    difficulty: 'Hard'
  }, {
    id: 'hashing',
    name: 'Hash Tables',
    difficulty: 'Easy'
  }];
  return <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Your Progress</h1>
        <p className="text-slate-400 mt-1">
          Track your concept mastery and improvement over time
        </p>
      </div>
      {/* Overall stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <BookOpenIcon size={20} className="text-indigo-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-slate-400">Completed</p>
              <p className="text-xl font-bold text-white">18 Problems</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
              <BrainIcon size={20} className="text-teal-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-slate-400">Mastery Level</p>
              <p className="text-xl font-bold text-white">Intermediate</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <CodeIcon size={20} className="text-purple-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-slate-400">Code Quality</p>
              <p className="text-xl font-bold text-white">Good</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
              <TrendingUpIcon size={20} className="text-amber-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-slate-400">Improvement</p>
              <p className="text-xl font-bold text-white">+23% this month</p>
            </div>
          </div>
        </div>
      </div>
      {/* Performance by concept */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-white mb-4">
          Performance by Concept
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData} margin={{
            top: 5,
            right: 20,
            bottom: 5,
            left: 0
          }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{
              backgroundColor: '#1e293b',
              borderColor: '#334155',
              borderRadius: '0.375rem'
            }} labelStyle={{
              color: '#f1f5f9'
            }} itemStyle={{
              color: '#94a3b8'
            }} />
              <Bar dataKey="score" name="Your Score" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="avg" name="Class Average" fill="#334155" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Progress over time */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-white mb-4">
          Progress Over Time
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressOverTime} margin={{
            top: 5,
            right: 20,
            bottom: 5,
            left: 0
          }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="week" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{
              backgroundColor: '#1e293b',
              borderColor: '#334155',
              borderRadius: '0.375rem'
            }} labelStyle={{
              color: '#f1f5f9'
            }} itemStyle={{
              color: '#94a3b8'
            }} />
              <Line type="monotone" dataKey="score" stroke="#14b8a6" strokeWidth={2} dot={{
              r: 4
            }} activeDot={{
              r: 6
            }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Concept cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Needs Practice */}
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
              <TrendingUpIcon size={16} className="text-amber-400" />
            </div>
            <h3 className="text-lg font-medium text-white ml-2">
              Needs Practice
            </h3>
          </div>
          <div className="space-y-4">
            {needsPractice.map(item => <div key={item.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                <div>
                  <p className="font-medium text-white">{item.name}</p>
                  <div className="mt-1 w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{
                  width: `${item.score}%`
                }}></div>
                  </div>
                </div>
                <span className="text-amber-400 font-medium">
                  {item.score}%
                </span>
              </div>)}
          </div>
        </div>
        {/* Mastered */}
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
              <CheckCircleIcon size={16} className="text-teal-400" />
            </div>
            <h3 className="text-lg font-medium text-white ml-2">Mastered</h3>
          </div>
          <div className="space-y-4">
            {mastered.map(item => <div key={item.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                <div>
                  <p className="font-medium text-white">{item.name}</p>
                  <div className="mt-1 w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-teal-500 h-2 rounded-full" style={{
                  width: `${item.score}%`
                }}></div>
                  </div>
                </div>
                <span className="text-teal-400 font-medium">{item.score}%</span>
              </div>)}
          </div>
        </div>
        {/* New Concepts */}
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <BookOpenIcon size={16} className="text-indigo-400" />
            </div>
            <h3 className="text-lg font-medium text-white ml-2">
              New Concepts
            </h3>
          </div>
          <div className="space-y-4">
            {newConcepts.map(item => <div key={item.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                <div>
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-sm text-slate-400">Unlocks next week</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${item.difficulty === 'Easy' ? 'bg-emerald-900/50 text-emerald-300' : item.difficulty === 'Medium' ? 'bg-amber-900/50 text-amber-300' : 'bg-red-900/50 text-red-300'}`}>
                  {item.difficulty}
                </span>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};
export default Progress;