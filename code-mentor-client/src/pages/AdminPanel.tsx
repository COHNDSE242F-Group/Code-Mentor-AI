import React, { useState, useEffect } from 'react';
import { PlusIcon } from 'lucide-react';
import axios from 'axios';
import { 
  UsersIcon, 
  BookOpenIcon, 
  CheckSquareIcon, 
  BarChartIcon, 
  UserIcon, 
  CreditCardIcon, 
  SettingsIcon, 
  BellIcon, 
  ChevronDownIcon, 
  SearchIcon, 
  LogOutIcon 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Student {
  id: string;
  name: string;
  email: string;
  progress: number;
  lastActive: string;
}

interface Problem {
  id: string;
  title: string;
  tags: string[];
  difficulty: string;
  assigned: boolean;
}

interface Submission {
  id: string;
  student: string;
  problem: string;
  submitted: string;
  status: string;
  score: number;
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('roster');
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // Local theme state
  const navigate = useNavigate();

  const tabs = [
    { id: 'roster', label: 'Class Roster', icon: <UsersIcon size={16} /> },
    { id: 'problems', label: 'Problem Manager', icon: <BookOpenIcon size={16} /> },
    { id: 'submissions', label: 'Submissions', icon: <CheckSquareIcon size={16} /> },
  ];

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/students", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    const fetchProblems = async () => {
      try {
        const response = await axios.get("http://localhost:8000/problems");
        setProblems(response.data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/submissions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubmissions(response.data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };

    fetchStudents();
    fetchProblems();
    fetchSubmissions();
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear auth token
    navigate('/'); // Navigate to home
  };

  const getDifficultyBadge = (difficulty: string) => {
  const badgeColors: { [key: string]: string } = {
    easy: 'bg-green-500 text-white',
    medium: 'bg-yellow-500 text-white',
    hard: 'bg-red-500 text-white',
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${badgeColors[difficulty] || 'bg-gray-500 text-white'}`}>
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </span>
  );
};

const getStatusBadge = (status: string) => {
  const badgeColors: { [key: string]: string } = {
    passed: 'bg-green-500 text-white',
    failed: 'bg-red-500 text-white',
    pending: 'bg-yellow-500 text-white',
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${badgeColors[status] || 'bg-gray-500 text-white'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

  const renderTabContent = () => {
    switch (activeTab) {
      case 'roster':
        return (
          <div>
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
                  {students.map((student: Student) => (
  <tr key={student.id} className="hover:bg-slate-800/50">
    <td className="px-4 py-3 border-b border-slate-700">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-3">
          <span className="text-white text-sm font-medium">
            {student.name.split(' ').map((n: string) => n[0]).join('')}
          </span>
        </div>
        <span className="font-medium text-white">{student.name}</span>
      </div>
    </td>
    <td className="px-4 py-3 border-b border-slate-700 text-slate-300">{student.email}</td>
    <td className="px-4 py-3 border-b border-slate-700">
      <div className="flex items-center">
        <div className="w-full max-w-[100px] bg-slate-700 rounded-full h-2 mr-2">
          <div
            className={`h-2 rounded-full ${
              student.progress >= 80
                ? 'bg-teal-500'
                : student.progress >= 60
                ? 'bg-indigo-500'
                : 'bg-amber-500'
            }`}
            style={{ width: `${student.progress}%` }}
          ></div>
        </div>
        <span className="text-slate-300">{student.progress}%</span>
      </div>
    </td>
    <td className="px-4 py-3 border-b border-slate-700 text-slate-300">{student.lastActive}</td>
    <td className="px-4 py-3 border-b border-slate-700 text-right">
      <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-sm text-slate-300 rounded-md transition-colors">
        View
      </button>
    </td>
  </tr>
))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'problems':
        return (
          <div>
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
          </div>
        );
      case 'submissions':
        return (
          <div>
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
                  {submissions.map((submission: Submission) => (
  <tr key={submission.id} className="hover:bg-slate-800/50">
    <td className="px-4 py-3 border-b border-slate-700 font-medium text-white">{submission.student}</td>
    <td className="px-4 py-3 border-b border-slate-700 text-slate-300">{submission.problem}</td>
    <td className="px-4 py-3 border-b border-slate-700 text-slate-300">{submission.submitted}</td>
    <td className="px-4 py-3 border-b border-slate-700">{getStatusBadge(submission.status)}</td>
    <td className="px-4 py-3 border-b border-slate-700">
      <span
        className={`font-medium ${
          submission.score >= 90
            ? 'text-teal-400'
            : submission.score >= 70
            ? 'text-indigo-400'
            : submission.score >= 50
            ? 'text-amber-400'
            : 'text-red-400'
        }`}
      >
        {submission.score}%
      </span>
    </td>
    <td className="px-4 py-3 border-b border-slate-700 text-right">
      <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-sm text-slate-300 rounded-md transition-colors">
        Review
      </button>
    </td>
  </tr>
))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 w-64 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg hidden md:block`}>
          <div className="p-6">
            <img src="https://placehold.co/200x40/3B82F6/FFFFFF?text=CodeMentorAI" alt="CodeMentorAI Logo" className="h-8" />
          </div>
          <nav className="mt-6">
            <div className={`px-6 py-2 text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
              Main
            </div>
            <a href="#" className={`flex items-center px-6 py-3 ${theme === 'dark' ? 'text-white bg-gray-700' : 'text-gray-900 bg-gray-100'}`}>
              <BarChartIcon size={18} className="mr-3" />
              Dashboard
            </a>
            <a href="#" className={`flex items-center px-6 py-3 ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
              <UserIcon size={18} className="mr-3" />
              Instructors
            </a>
            <a href="#" className={`flex items-center px-6 py-3 ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
              <UsersIcon size={18} className="mr-3" />
              Students
            </a>
            <a href="#" className={`flex items-center px-6 py-3 ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
              <BookOpenIcon size={18} className="mr-3" />
              Courses
            </a>
            <div className={`mt-6 px-6 py-2 text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
              Account
            </div>
            <a href="#" onClick={() => navigate('/billing')} className={`flex items-center px-6 py-3 ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
              <CreditCardIcon size={18} className="mr-3" />
              Billing
            </a>
            <a href="#" className={`flex items-center px-6 py-3 ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
              <SettingsIcon size={18} className="mr-3" />
              Settings
            </a>
          </nav>
          <div className="p-4 border-t border-blue-800">
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-300 hover:text-white w-full px-4 py-2"
            >
              <LogOutIcon size={20} className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
          <div className="absolute bottom-0 w-full p-4">
            <button onClick={toggleTheme} className={`w-full flex items-center justify-center py-2 px-4 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="md:ml-64 flex-1">
          {/* Top Bar */}
          <header className={`py-4 px-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm flex justify-between items-center`}>
            <div className="flex-1 max-w-lg mx-4 hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon size={18} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                </div>
                <input type="text" placeholder="Search..." className={`pl-10 block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative">
                <BellIcon size={20} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <div className="relative">
                <button className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    SU
                  </div>
                  <span className="hidden md:inline-block">
                    Stanford University
                  </span>
                  <ChevronDownIcon size={16} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} />
                </button>
              </div>
            </div>
          </header>

          {/* Tab Content */}
          <main className="p-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                <p className="text-slate-400 mt-1">
                  Manage your class, problems, and student submissions
                </p>
              </div>
              <div className="border-b border-slate-700">
                <nav className="flex space-x-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 ${
                        activeTab === tab.id
                          ? 'border-indigo-500 text-indigo-400'
                          : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-700'
                      } transition-colors`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
              {renderTabContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;