import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { SearchIcon, FilterIcon, ChevronDownIcon, ChevronUpIcon, EyeIcon } from 'lucide-react';
const SubmissionsList = () => {
  const [sortConfig, setSortConfig] = useState({
    key: 'submittedAt',
    direction: 'desc'
  });
  const submissions = [{
    id: 1,
    student: 'Alex Johnson',
    studentId: 'ST-2023-001',
    assignment: 'Python Data Structures',
    submittedAt: 'Oct 13, 2023 - 8:45 PM',
    status: 'Pending',
    score: null,
    batch: 'Batch A'
  }, {
    id: 2,
    student: 'Maria Garcia',
    studentId: 'ST-2023-015',
    assignment: 'JavaScript Arrays',
    submittedAt: 'Oct 13, 2023 - 3:22 PM',
    status: 'Graded',
    score: 92,
    batch: 'Batch B'
  }, {
    id: 3,
    student: 'James Smith',
    studentId: 'ST-2023-008',
    assignment: 'SQL Queries',
    submittedAt: 'Oct 12, 2023 - 11:05 AM',
    status: 'Graded',
    score: 85,
    batch: 'Batch C'
  }, {
    id: 4,
    student: 'Sarah Williams',
    studentId: 'ST-2023-022',
    assignment: 'Java Classes',
    submittedAt: 'Oct 12, 2023 - 9:17 AM',
    status: 'Pending',
    score: null,
    batch: 'Batch A'
  }, {
    id: 5,
    student: 'David Lee',
    studentId: 'ST-2023-011',
    assignment: 'C++ Pointers',
    submittedAt: 'Oct 11, 2023 - 2:40 PM',
    status: 'Flagged',
    score: null,
    batch: 'Batch B'
  }, {
    id: 6,
    student: 'Emily Chen',
    studentId: 'ST-2023-019',
    assignment: 'Python Loops',
    submittedAt: 'Oct 11, 2023 - 10:12 AM',
    status: 'Graded',
    score: 78,
    batch: 'Batch A'
  }, {
    id: 7,
    student: 'Michael Brown',
    studentId: 'ST-2023-005',
    assignment: 'JavaScript DOM',
    submittedAt: 'Oct 10, 2023 - 5:30 PM',
    status: 'Graded',
    score: 88,
    batch: 'Batch C'
  }, {
    id: 8,
    student: 'Sophia Martinez',
    studentId: 'ST-2023-027',
    assignment: 'SQL Joins',
    submittedAt: 'Oct 10, 2023 - 1:15 PM',
    status: 'Pending',
    score: null,
    batch: 'Batch B'
  }];
  const requestSort = key => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({
      key,
      direction
    });
  };
  const sortedSubmissions = [...submissions].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  const getSortIcon = name => {
    if (sortConfig.key === name) {
      return sortConfig.direction === 'asc' ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />;
    }
    return null;
  };
  return <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Submissions</h1>
        <p className="text-gray-500">View and manage student submissions</p>
      </div>
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-1 bg-blue-50 border-l-4 border-[#0D47A1]">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Pending Review</p>
              <h3 className="text-2xl font-bold text-gray-800">18</h3>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <ClockIcon size={24} className="text-[#0D47A1]" />
            </div>
          </div>
        </Card>
        <Card className="md:col-span-1 bg-green-50 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Graded</p>
              <h3 className="text-2xl font-bold text-gray-800">156</h3>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircleIcon size={24} className="text-green-500" />
            </div>
          </div>
        </Card>
        <Card className="md:col-span-1 bg-yellow-50 border-l-4 border-[#FFC107]">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Late Submissions</p>
              <h3 className="text-2xl font-bold text-gray-800">12</h3>
            </div>
            <div className="rounded-full bg-yellow-100 p-3">
              <AlertCircleIcon size={24} className="text-[#FFC107]" />
            </div>
          </div>
        </Card>
        <Card className="md:col-span-1 bg-red-50 border-l-4 border-red-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Flagged</p>
              <h3 className="text-2xl font-bold text-gray-800">8</h3>
            </div>
            <div className="rounded-full bg-red-100 p-3">
              <AlertTriangleIcon size={24} className="text-red-500" />
            </div>
          </div>
        </Card>
      </div>
      <Card>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <input type="text" placeholder="Search submissions..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent" />
            <SearchIcon size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700">
              <FilterIcon size={16} className="mr-2" />
              Filters
            </button>
            <select className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700">
              <option>All Assignments</option>
              <option>Python Data Structures</option>
              <option>JavaScript Arrays</option>
              <option>SQL Queries</option>
              <option>Java Classes</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700">
              <option>All Statuses</option>
              <option>Pending</option>
              <option>Graded</option>
              <option>Flagged</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  <button className="flex items-center" onClick={() => requestSort('student')}>
                    STUDENT {getSortIcon('student')}
                  </button>
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  <button className="flex items-center" onClick={() => requestSort('assignment')}>
                    ASSIGNMENT {getSortIcon('assignment')}
                  </button>
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  <button className="flex items-center" onClick={() => requestSort('submittedAt')}>
                    SUBMITTED {getSortIcon('submittedAt')}
                  </button>
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  <button className="flex items-center" onClick={() => requestSort('status')}>
                    STATUS {getSortIcon('status')}
                  </button>
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  <button className="flex items-center" onClick={() => requestSort('score')}>
                    SCORE {getSortIcon('score')}
                  </button>
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  <button className="flex items-center" onClick={() => requestSort('batch')}>
                    BATCH {getSortIcon('batch')}
                  </button>
                </th>
                <th className="py-3 px-4 text-center text-sm font-medium text-gray-500">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedSubmissions.map(submission => <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium">{submission.student}</div>
                    <div className="text-xs text-gray-500">
                      {submission.studentId}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{submission.assignment}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {submission.submittedAt}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${submission.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : submission.status === 'Graded' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {submission.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {submission.score !== null ? submission.score : '-'}
                  </td>
                  <td className="py-3 px-4 text-sm">{submission.batch}</td>
                  <td className="py-3 px-4 text-center">
                    <Link to={`/submissions/${submission.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-[#0D47A1]">
                      <EyeIcon size={16} />
                    </Link>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">
            Showing 1-8 of 186 submissions
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-[#0D47A1] text-white rounded-md hover:bg-blue-800">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700">
              3
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700">
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>;
};
const ClockIcon = ({
  size,
  className
}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>;
const AlertCircleIcon = ({
  size,
  className
}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>;
const AlertTriangleIcon = ({
  size,
  className
}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>;
const CheckCircleIcon = ({
  size,
  className
}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>;
export default SubmissionsList;