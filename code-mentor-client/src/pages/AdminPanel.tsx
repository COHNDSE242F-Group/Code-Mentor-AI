// @ts-nocheck
import React, { useState } from 'react';
import { UsersIcon, BookOpenIcon, CheckSquareIcon, PlusIcon, SearchIcon } from 'lucide-react';
const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('roster');
  const [searchTerm, setSearchTerm] = useState('');
  const tabs = [{
    id: 'roster',
    label: 'Class Roster',
    icon: <UsersIcon size={16} />
  }, {
    id: 'problems',
    label: 'Problem Manager',
    icon: <BookOpenIcon size={16} />
  }, {
    id: 'submissions',
    label: 'Submissions',
    icon: <CheckSquareIcon size={16} />
  }];
  const students = [{
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    progress: 75,
    lastActive: '2 hours ago'
  }, {
    id: 2,
    name: 'Emily Johnson',
    email: 'emily.j@example.com',
    progress: 92,
    lastActive: '1 day ago'
  }, {
    id: 3,
    name: 'Michael Brown',
    email: 'mbrown@example.com',
    progress: 45,
    lastActive: '3 days ago'
  }, {
    id: 4,
    name: 'Sarah Davis',
    email: 'sarah.d@example.com',
    progress: 88,
    lastActive: '5 hours ago'
  }, {
    id: 5,
    name: 'David Wilson',
    email: 'dwilson@example.com',
    progress: 62,
    lastActive: '1 week ago'
  }, {
    id: 6,
    name: 'Jessica Lee',
    email: 'jlee@example.com',
    progress: 79,
    lastActive: 'Just now'
  }];
  const problems = [{
    id: 'bst-validation',
    title: 'Binary Search Tree Validation',
    difficulty: 'medium',
    tags: ['Data Structures', 'Trees'],
    assigned: true
  }, {
    id: 'two-sum',
    title: 'Two Sum Problem',
    difficulty: 'easy',
    tags: ['Algorithms', 'Arrays'],
    assigned: true
  }, {
    id: 'graph-traversal',
    title: 'Graph Traversal',
    difficulty: 'hard',
    tags: ['Algorithms', 'Graphs'],
    assigned: true
  }, {
    id: 'linked-list-cycle',
    title: 'Linked List Cycle Detection',
    difficulty: 'medium',
    tags: ['Data Structures', 'Linked Lists'],
    assigned: true
  }, {
    id: 'merge-sort',
    title: 'Merge Sort Implementation',
    difficulty: 'medium',
    tags: ['Algorithms', 'Sorting'],
    assigned: false
  }, {
    id: 'dynamic-programming',
    title: 'Knapsack Problem',
    difficulty: 'hard',
    tags: ['Algorithms', 'Dynamic Programming'],
    assigned: false
  }];
  const submissions = [{
    id: 1,
    student: 'John Smith',
    problem: 'Two Sum Problem',
    submitted: '2023-06-15 14:32',
    status: 'passed',
    score: 98
  }, {
    id: 2,
    student: 'Emily Johnson',
    problem: 'Binary Search Tree Validation',
    submitted: '2023-06-14 09:45',
    status: 'passed',
    score: 95
  }, {
    id: 3,
    student: 'Michael Brown',
    problem: 'Graph Traversal',
    submitted: '2023-06-13 16:20',
    status: 'failed',
    score: 45
  }, {
    id: 4,
    student: 'Sarah Davis',
    problem: 'Two Sum Problem',
    submitted: '2023-06-15 11:05',
    status: 'passed',
    score: 100
  }, {
    id: 5,
    student: 'David Wilson',
    problem: 'Linked List Cycle Detection',
    submitted: '2023-06-10 13:15',
    status: 'passed',
    score: 82
  }];
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <span className="px-2 py-1 bg-emerald-900/50 text-xs rounded-full text-emerald-300">
            Easy
          </span>;
      case 'medium':
        return <span className="px-2 py-1 bg-amber-900/50 text-xs rounded-full text-amber-300">
            Medium
          </span>;
      case 'hard':
        return <span className="px-2 py-1 bg-red-900/50 text-xs rounded-full text-red-300">
            Hard
          </span>;
      default:
        return null;
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return <span className="px-2 py-1 bg-emerald-900/50 text-xs rounded-full text-emerald-300">
            Passed
          </span>;
      case 'failed':
        return <span className="px-2 py-1 bg-red-900/50 text-xs rounded-full text-red-300">
            Failed
          </span>;
      default:
        return null;
    }
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case 'roster':
        return <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Class Roster</h2>
              <button className="button-primary flex items-center">
                <PlusIcon size={16} className="mr-1.5" />
                Add Student
              </button>
            </div>
            <div className="relative mb-6">
              <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" placeholder="Search students..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-800">
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-300 border-b border-slate-700">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-300 border-b border-slate-700">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-300 border-b border-slate-700">
                      Progress
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-300 border-b border-slate-700">
                      Last Active
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-300 border-b border-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => <tr key={student.id} className="hover:bg-slate-800/50">
                      <td className="px-4 py-3 border-b border-slate-700">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-medium">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="font-medium text-white">
                            {student.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 border-b border-slate-700 text-slate-300">
                        {student.email}
                      </td>
                      <td className="px-4 py-3 border-b border-slate-700">
                        <div className="flex items-center">
                          <div className="w-full max-w-[100px] bg-slate-700 rounded-full h-2 mr-2">
                            <div className={`h-2 rounded-full ${student.progress >= 80 ? 'bg-teal-500' : student.progress >= 60 ? 'bg-indigo-500' : 'bg-amber-500'}`} style={{
                          width: `${student.progress}%`
                        }}></div>
                          </div>
                          <span className="text-slate-300">
                            {student.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 border-b border-slate-700 text-slate-300">
                        {student.lastActive}
                      </td>
                      <td className="px-4 py-3 border-b border-slate-700 text-right">
                        <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-sm text-slate-300 rounded-md transition-colors">
                          View
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>;
      case 'problems':
        return <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Problem Manager</h2>
              <button className="button-primary flex items-center">
                <PlusIcon size={16} className="mr-1.5" />
                Create Problem
              </button>
            </div>
            <div className="relative mb-6">
              <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" placeholder="Search problems..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="grid grid-cols-1 gap-4">
              {problems.map(problem => <div key={problem.id} className="card flex flex-col md:flex-row md:items-center justify-between p-4">
                  <div>
                    <h4 className="text-white font-medium">{problem.title}</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {problem.tags.map(tag => <span key={tag} className="px-2 py-1 bg-slate-700 text-xs rounded-full text-slate-300">
                          {tag}
                        </span>)}
                      {getDifficultyBadge(problem.difficulty)}
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center space-x-2">
                    <span className={`px-3 py-1 text-xs rounded-md ${problem.assigned ? 'bg-teal-900/30 text-teal-400' : 'bg-slate-700 text-slate-400'}`}>
                      {problem.assigned ? 'Assigned' : 'Not Assigned'}
                    </span>
                    <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-sm text-slate-300 rounded-md transition-colors">
                      Edit
                    </button>
                    <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-sm text-white rounded-md transition-colors">
                      {problem.assigned ? 'Unassign' : 'Assign'}
                    </button>
                  </div>
                </div>)}
            </div>
          </div>;
      case 'submissions':
        return <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                Student Submissions
              </h2>
              <div>
                <select className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="all">All Problems</option>
                  <option value="two-sum">Two Sum Problem</option>
                  <option value="bst">Binary Search Tree Validation</option>
                  <option value="graph">Graph Traversal</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-800">
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-300 border-b border-slate-700">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-300 border-b border-slate-700">
                      Problem
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-300 border-b border-slate-700">
                      Submitted
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-300 border-b border-slate-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-300 border-b border-slate-700">
                      Score
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-300 border-b border-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map(submission => <tr key={submission.id} className="hover:bg-slate-800/50">
                      <td className="px-4 py-3 border-b border-slate-700 font-medium text-white">
                        {submission.student}
                      </td>
                      <td className="px-4 py-3 border-b border-slate-700 text-slate-300">
                        {submission.problem}
                      </td>
                      <td className="px-4 py-3 border-b border-slate-700 text-slate-300">
                        {submission.submitted}
                      </td>
                      <td className="px-4 py-3 border-b border-slate-700">
                        {getStatusBadge(submission.status)}
                      </td>
                      <td className="px-4 py-3 border-b border-slate-700">
                        <span className={`font-medium ${submission.score >= 90 ? 'text-teal-400' : submission.score >= 70 ? 'text-indigo-400' : submission.score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                          {submission.score}%
                        </span>
                      </td>
                      <td className="px-4 py-3 border-b border-slate-700 text-right">
                        <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-sm text-slate-300 rounded-md transition-colors">
                          Review
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>;
      default:
        return null;
    }
  };
  return <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
        <p className="text-slate-400 mt-1">
          Manage your class, problems, and student submissions
        </p>
      </div>
      <div className="border-b border-slate-700">
        <nav className="flex space-x-2">
          {tabs.map(tab => <button key={tab.id} className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 ${activeTab === tab.id ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-700'} transition-colors`} onClick={() => setActiveTab(tab.id)}>
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>)}
        </nav>
      </div>
      {renderTabContent()}
    </div>;
};
export default AdminPanel;