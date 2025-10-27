import React, { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import { CheckCircleIcon, ClockIcon, AlertTriangleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import CalendarView from '../components/CalendarView';

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

type PerformanceItem = {
  name: string;
  students: number;
  average: number;
};

type IntegrityItem = {
  name: string;
  value: number;
};

type DeadlineItem = {
  assignment_id: number;
  assignment_name: string;
  due_date: string;
  batch_name: string; // Add batch_name if needed
};


type SubmissionItem = {
  submission_id: number;
  assignment_name: string;
  student_name: string;
  status: string;
  submitted_at: string;
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
  const [recentSubmissions, setRecentSubmissions] = useState<SubmissionItem[]>([]);
    const [loadingSubmissions, setLoadingSubmissions] = useState<boolean>(true);

  const [activeAssignments, setActiveAssignments] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<DeadlineItem[]>([]);
  const [pendingReviews, setPendingReviews] = useState<number>(0);
  const [gradedSubmissions, setGradedSubmissions] = useState<number>(0);
  const [loadingDeadlines, setLoadingDeadlines] = useState<boolean>(true);
  const [loading, setLoading] = useState({
    pending: true,
    graded: true
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [showConceptModal, setShowConceptModal] = useState(false);
  const [conceptName, setConceptName] = useState('');
  const [conceptDescription, setConceptDescription] = useState('');
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [generatedTopics, setGeneratedTopics] = useState<string[]>([]);

  useEffect(() => {
    const fetchActiveAssignments = async () => {
      try {
        const response = await fetch('http://localhost:8000/dashboard/active-assignments');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Active Assignments Response:', data); // Debug log
        setActiveAssignments(data);
      } catch (error) {
        console.error('Error fetching active assignments:', error);
        setActiveAssignments([]);
      } finally {
        setLoading(prev => ({ ...prev, assignments: false }));
      }
    };

    const fetchPendingReviews = async () => {
      try {
        const response = await fetch('http://localhost:8000/dashboard/get-pending-review');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Pending Reviews Response:', data); // Debug log
        // Make sure we're setting the count correctly
        setPendingReviews(data.count || 0);
      } catch (error) {
        console.error('Error fetching pending reviews:', error);
        setPendingReviews(0);
      } finally {
        setLoading(prev => ({ ...prev, pending: false }));
      }
    };

    const fetchGradedSubmissions = async () => {
      try {
        const response = await fetch('http://localhost:8000/dashboard/graded-submissions');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Graded Submissions Response:', data); // Debug log
        // Make sure we're setting the count correctly
        setGradedSubmissions(data.count || 0);
      } catch (error) {
        console.error('Error fetching graded submissions:', error);
        setGradedSubmissions(0);
      } finally {
        setLoading(prev => ({ ...prev, graded: false }));
      }
    };
    fetchActiveAssignments();
    fetchPendingReviews();
    fetchGradedSubmissions();
  }, []);

  useEffect(() => {
    const fetchUpcomingDeadlines = async () => {
      try {
        const response = await fetch('http://localhost:8000/dashboard/upcoming-deadlines');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Upcoming Deadlines Response:', data); // Debug log
        setUpcomingDeadlines(data);
      } catch (error) {
        console.error('Error fetching upcoming deadlines:', error);
        setUpcomingDeadlines([]);
      } finally {
        setLoadingDeadlines(false);
      }
    };

    fetchUpcomingDeadlines();
  }, []);

  useEffect(() => {
    const fetchRecentSubmissions = async () => {
      try {
        const response = await fetch('http://localhost:8000/dashboard/recent-submissions');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Recent Submissions Response:', data); // Debug log
        setRecentSubmissions(data);
      } catch (error) {
        console.error('Error fetching recent submissions:', error);
        setRecentSubmissions([]);
      } finally {
        setLoadingSubmissions(false);
      }
    };

    fetchRecentSubmissions();
  }, []);

// Debug: Log current state values
  useEffect(() => {
    console.log('Current State:', {
      activeAssignments: activeAssignments.length,
      pendingReviews,
      gradedSubmissions
    });
  }, [activeAssignments, pendingReviews, gradedSubmissions]);
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Instructor Dashboard</h1>
        </div>
        <button
          onClick={() => setShowConceptModal(true)}
          className="flex items-center gap-2 bg-[#0D47A1] text-white px-4 py-2 rounded-lg shadow hover:bg-[#1565C0] transition-all"
        >
          <span>Add Concept</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <Link to="/assignments" className="block transition-transform hover:scale-105">
          <Card className="flex items-center cursor-pointer hover:shadow-md">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <FileIcon size={24} className="text-[#0D47A1]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-700">{activeAssignments.length}</h3>
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
              <h3 className="text-lg font-bold text-gray-700">
                {loading.pending ? '...' : pendingReviews}
              </h3>
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
              <h3 className="text-lg font-bold text-gray-700">
                {loading.graded ? '...' : gradedSubmissions}
              </h3>
              <p className="text-sm text-gray-500">Graded Submissions</p>
            </div>
          </Card>
        </Link>

       {/* <Link to="/submissions?status=flagged" className="block transition-transform hover:scale-105">
          <Card className="flex items-center cursor-pointer hover:shadow-md">
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <AlertTriangleIcon size={24} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-700">8</h3>
              <p className="text-sm text-gray-500">Integrity Alerts</p>
            </div>
          </Card>
        </Link>*/}
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
          {loadingSubmissions ? (
            <p className="text-gray-500">Loading...</p>
          ) : recentSubmissions.length > 0 ? (
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
                   {recentSubmissions.map((submission, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 text-sm">{submission.student_name}</td>
                    <td className="py-3 text-sm">{submission.assignment_name}</td>
                    <td className="py-3 text-sm text-gray-500">
                      {new Date(submission.submitted_at).toLocaleString()}
                    </td>
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
          ) : (
            <p className="text-gray-500">No recent submissions.</p>
          )}
        </div>
      </Card>
         <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Upcoming Deadlines</h2>
            <button
              className="text-[#0D47A1] text-sm font-medium"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              {showCalendar ? 'Hide Calendar' : 'View Calendar'}
            </button>
          </div>

          {showCalendar ? (
            <CalendarView deadlines={upcomingDeadlines} />
          ) : (
            <div className="space-y-4">
              {loadingDeadlines ? (
                <p className="text-gray-500">Loading...</p>
              ) : upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map((deadline, i) => (
                  <div key={i} className="flex items-center p-3 border border-gray-100 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{deadline.assignment_name}</h4>
                      <p className="text-sm text-gray-500">{deadline.batch_name || 'Batch Unknown'}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {new Date(deadline.due_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No upcoming deadlines.</p>
              )}
            </div>
          )}
        </Card>
      </div>
      {showConceptModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative">
      <button
        onClick={() => {
          setShowConceptModal(false);
          setGeneratedTopics([]);
          setConceptName('');
          setConceptDescription('');
        }}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>

      <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Concept</h2>

      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-600">Concept Name</label>
          <input
            type="text"
            value={conceptName}
            onChange={(e) => setConceptName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="e.g. Object-Oriented Programming"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Description (optional)</label>
          <textarea
            value={conceptDescription}
            onChange={(e) => setConceptDescription(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={3}
            placeholder="Briefly describe this concept..."
          />
        </div>

        <button
          onClick={async () => {
            if (!conceptName.trim()) {
              alert('Please enter a concept name.');
              return;
            }
            setLoadingTopics(true);
            setGeneratedTopics([]);
            try {
              const res = await fetch('http://localhost:8000/ai/generate-topics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  concept_name: conceptName,
                  description: conceptDescription,
                }),
              });

              if (!res.ok) throw new Error('API request failed');
              const data = await res.json();
              // Assuming API returns something like: { topics: ["Encapsulation", "Inheritance", ...] }
              setGeneratedTopics(data.topics || []);
            } catch (err) {
              console.error('Error generating topics:', err);
              alert('Failed to generate topics.');
            } finally {
              setLoadingTopics(false);
            }
          }}
          disabled={loadingTopics}
          className="bg-[#0D47A1] text-white px-4 py-2 rounded-lg shadow hover:bg-[#1565C0] w-full transition-all"
        >
          {loadingTopics ? 'Generating...' : 'Generate Topics'}
        </button>
      </div>

      <div className="mt-6">
        {loadingTopics ? (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <svg
              className="animate-spin h-6 w-6 text-[#0D47A1] mb-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
              ></path>
            </svg>
            <span>✨ Generating topics...</span>
          </div>
        ) : generatedTopics.length > 0 ? (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Generated Topics:</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {generatedTopics.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  </div>
)}
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