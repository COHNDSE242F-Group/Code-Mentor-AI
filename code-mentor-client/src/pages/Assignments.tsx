// @ts-nocheck
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, FilterIcon, ClockIcon, CheckCircleIcon, AlertTriangleIcon } from 'lucide-react';
const Assignments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const assignments = [{
    id: 'bst-validation',
    title: 'Binary Search Tree Validation',
    tags: ['Data Structures', 'Trees'],
    difficulty: 'medium',
    status: 'in-progress',
    dueDate: 'Tomorrow',
    dueStatus: 'upcoming'
  }, {
    id: 'two-sum',
    title: 'Two Sum Problem',
    tags: ['Algorithms', 'Arrays'],
    difficulty: 'easy',
    status: 'completed',
    dueDate: 'Completed 3 days ago',
    dueStatus: 'completed'
  }, {
    id: 'graph-traversal',
    title: 'Graph Traversal',
    tags: ['Algorithms', 'Graphs'],
    difficulty: 'hard',
    status: 'not-started',
    dueDate: 'Overdue by 2 days',
    dueStatus: 'overdue'
  }, {
    id: 'linked-list-cycle',
    title: 'Linked List Cycle Detection',
    tags: ['Data Structures', 'Linked Lists'],
    difficulty: 'medium',
    status: 'not-started',
    dueDate: 'Due in 5 days',
    dueStatus: 'upcoming'
  }, {
    id: 'merge-sort',
    title: 'Merge Sort Implementation',
    tags: ['Algorithms', 'Sorting'],
    difficulty: 'medium',
    status: 'completed',
    dueDate: 'Completed 1 week ago',
    dueStatus: 'completed'
  }, {
    id: 'dynamic-programming',
    title: 'Knapsack Problem',
    tags: ['Algorithms', 'Dynamic Programming'],
    difficulty: 'hard',
    status: 'not-started',
    dueDate: 'Due in 2 weeks',
    dueStatus: 'upcoming'
  }];
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) || assignment.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = difficultyFilter === 'all' || assignment.difficulty === difficultyFilter;
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    return matchesSearch && matchesDifficulty && matchesStatus;
  });
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
  const getStatusIcon = (status: string, dueStatus: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon size={18} className="text-teal-400" />;
      case 'in-progress':
        return <ClockIcon size={18} className="text-amber-400" />;
      case 'not-started':
        return dueStatus === 'overdue' ? <AlertTriangleIcon size={18} className="text-red-400" /> : <ClockIcon size={18} className="text-slate-400" />;
      default:
        return null;
    }
  };
  const getActionButton = (status: string, id: string) => {
    switch (status) {
      case 'completed':
        return <Link to={`/editor/${id}`} className="button-outline">
            Review
          </Link>;
      case 'in-progress':
        return <Link to={`/editor/${id}`} className="button-primary">
            Resume
          </Link>;
      case 'not-started':
        return <Link to={`/editor/${id}`} className="button-primary">
            Start
          </Link>;
      default:
        return null;
    }
  };
  return <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Assignments</h1>
        <p className="text-slate-400 mt-1">
          View and manage your coding assignments
        </p>
      </div>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search assignments..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="flex space-x-2">
          <select value={difficultyFilter} onChange={e => setDifficultyFilter(e.target.value)} className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="all">All Status</option>
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-300 hover:bg-slate-700 focus:outline-none">
            <FilterIcon size={18} />
          </button>
        </div>
      </div>
      {/* Assignment list */}
      <div className="space-y-4">
        {filteredAssignments.length > 0 ? filteredAssignments.map(assignment => <div key={assignment.id} className="card flex flex-col md:flex-row md:items-center justify-between p-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-md bg-slate-700 flex items-center justify-center flex-shrink-0">
                  {getStatusIcon(assignment.status, assignment.dueStatus)}
                </div>
                <div>
                  <h4 className="text-white font-medium">{assignment.title}</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {assignment.tags.map(tag => <span key={tag} className="px-2 py-1 bg-slate-700 text-xs rounded-full text-slate-300">
                        {tag}
                      </span>)}
                    {getDifficultyBadge(assignment.difficulty)}
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex items-center">
                <div className="flex items-center mr-4">
                  {getStatusIcon(assignment.status, assignment.dueStatus)}
                  <span className="ml-2 text-sm text-slate-300">
                    {assignment.dueDate}
                  </span>
                </div>
                {getActionButton(assignment.status, assignment.id)}
              </div>
            </div>) : <div className="text-center py-8">
            <p className="text-slate-400">No assignments match your filters</p>
          </div>}
      </div>
    </div>;
};
export default Assignments;