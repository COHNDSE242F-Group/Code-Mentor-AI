// @ts-nocheck
import React from 'react';
import Card from '../components/ui/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { CheckCircleIcon, ClockIcon, AlertTriangleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

type PerformanceItem = {
  name: string;
  students: number;
  average: number;
};

type IntegrityItem = {
  name: string;
  value: number;
};

const performanceData: PerformanceItem[] = [
  { name: 'Python', students: 85, average: 78 },
  { name: 'JavaScript', students: 75, average: 72 },
  { name: 'Java', students: 65, average: 68 },
  { name: 'C++', students: 55, average: 65 },
  { name: 'SQL', students: 45, average: 80 }
];

const integrityData: IntegrityItem[] = [
  { name: 'Original', value: 75 },
  { name: 'Suspicious', value: 15 },
  { name: 'Plagiarized', value: 10 }
];

const COLORS = ['#0D47A1', '#FFC107', '#FF5252'];

const Dashboard: React.FC = () => {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Instructor Dashboard</h1>
        <p className="text-gray-500">
          Welcome back, John! Here's what's happening with your courses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <Link to="/assignments" className="block transition-transform hover:scale-105">
          <Card className="flex items-center cursor-pointer hover:shadow-md">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <FileIcon size={24} className="text-[#0D47A1]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-700">24</h3>
              <p className="text-sm text-gray-500">Active Assignments</p>
            </div>
          </Card>
        </Link>

        <Link to="/submissions?status=pending" className="block transition-transform hover:scale-105">
          <Card className="flex items-center cursor-pointer hover:shadow-md">
            <div className="rounded-full bg-yellow-100 p-3 mr-4">
              <ClockIcon size={24} className="text-[#FFC107]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-700">18</h3>
              <p className="text-sm text-gray-500">Pending Reviews</p>
            </div>
          </Card>
        </Link>

        <Link to="/submissions?status=graded" className="block transition-transform hover:scale-105">
          <Card className="flex items-center cursor-pointer hover:shadow-md">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <CheckCircleIcon size={24} className="text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-700">156</h3>
              <p className="text-sm text-gray-500">Graded Submissions</p>
            </div>
          </Card>
        </Link>

        <Link to="/submissions?status=flagged" className="block transition-transform hover:scale-105">
          <Card className="flex items-center cursor-pointer hover:shadow-md">
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <AlertTriangleIcon size={24} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-700">8</h3>
              <p className="text-sm text-gray-500">Integrity Alerts</p>
            </div>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Student Performance by Language</h2>
            <select className="border rounded-md px-3 py-1 text-sm">
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last 6 months</option>
            </select>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" name="Students" fill="#0D47A1" />
                <Bar dataKey="average" name="Avg. Score" fill="#FFC107" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Submission Integrity</h2>
            <div className="text-sm text-gray-500">156 submissions</div>
          </div>

          <div className="h-64 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={integrityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {integrityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-around mt-2">
            {integrityData.map((entry, index) => (
              <div key={index} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-sm">{entry.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Submissions</h2>
            <button className="text-[#0D47A1] text-sm font-medium">View All</button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 text-left text-sm font-medium text-gray-500">STUDENT</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">ASSIGNMENT</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">SUBMITTED</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">STATUS</th>
                </tr>
              </thead>

              <tbody>
                {[
                  { student: 'Alex Johnson', assignment: 'Python Loops', time: '2 hours ago', status: 'Pending' },
                  { student: 'Maria Garcia', assignment: 'JavaScript Arrays', time: '5 hours ago', status: 'Graded' },
                  { student: 'James Smith', assignment: 'SQL Queries', time: '1 day ago', status: 'Graded' },
                  { student: 'Sarah Williams', assignment: 'Java Classes', time: '1 day ago', status: 'Pending' },
                  { student: 'David Lee', assignment: 'C++ Pointers', time: '2 days ago', status: 'Flagged' }
                ].map((submission, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 text-sm">{submission.student}</td>
                    <td className="py-3 text-sm">{submission.assignment}</td>
                    <td className="py-3 text-sm text-gray-500">{submission.time}</td>
                    <td className="py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          submission.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : submission.status === 'Graded'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {submission.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Upcoming Deadlines</h2>
            <button className="text-[#0D47A1] text-sm font-medium">View Calendar</button>
          </div>

          <div className="space-y-4">
            {[
              { title: 'Python Data Structures', batch: 'Batch A', date: 'Tomorrow, 11:59 PM' },
              { title: 'JavaScript DOM Manipulation', batch: 'Batch B', date: 'Oct 15, 11:59 PM' },
              { title: 'SQL Advanced Joins', batch: 'Batch C', date: 'Oct 18, 11:59 PM' },
              { title: 'Java Inheritance', batch: 'Batch A', date: 'Oct 20, 11:59 PM' }
            ].map((deadline, i) => (
              <div key={i} className="flex items-center p-3 border border-gray-100 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{deadline.title}</h4>
                  <p className="text-sm text-gray-500">{deadline.batch}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{deadline.date}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const FileIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

export default Dashboard;