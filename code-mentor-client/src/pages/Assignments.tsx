import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, FilterIcon, ClockIcon, CheckCircleIcon, XIcon } from 'lucide-react';
import { fetchWithAuth } from '../utils/auth'; // adjust the path

interface AssignmentData {
  Assignment: {
    assignment_id: number;
    assignment_name: string;
    due_date: string;
    due_time?: string;
    description?: any;
    difficulty?: string;
    instructor_id?: number;
    batch_id?: number;
  };
  Submission_id?: number | null;
}

interface SubmissionDetails {
  submission_id: number;
  content: string;
}

const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useState<AssignmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [submissionDetails, setSubmissionDetails] = useState<SubmissionDetails | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await fetchWithAuth('http://localhost:8000/student_assignment', {
        method: 'GET',
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data: AssignmentData[] = await res.json();
      setAssignments(data);
    } catch (err) {
      console.error('Failed to fetch assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmission = async (assignmentId: number) => {
    try {
      const res = await fetchWithAuth(`http://localhost:8000/submission/${assignmentId}`);
      const data: SubmissionDetails = await res.json();
      setSubmissionDetails(data);
      setModalOpen(true);
    } catch (err) {
      console.error('Error fetching submission', err);
      setSubmissionDetails(null);
    }
  };

  const filteredAssignments = Array.isArray(assignments)
    ? assignments.filter(a => {
        const title = a.Assignment.assignment_name.toLowerCase();
        const matchesSearch = title.includes(searchTerm.toLowerCase());
        const matchesDifficulty =
          difficultyFilter === 'all' || a.Assignment.difficulty === difficultyFilter;
        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'submitted' && !!a.Submission_id) ||
          (statusFilter === 'due' && !a.Submission_id);
        return matchesSearch && matchesDifficulty && matchesStatus;
      })
    : [];

  const getStatusIcon = (submitted: boolean) =>
    submitted ? (
      <CheckCircleIcon size={18} className="text-green-400" />
    ) : (
      <ClockIcon size={18} className="text-amber-400" />
    );

  const handleAssignmentClick = (a: AssignmentData) => {
    if (!a.Submission_id) {
      navigate(`/code-editor?assignmentId=${a.Assignment.assignment_id}`);
    }
  };

  if (loading) return <p className="text-slate-400">Loading assignments...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Assignments</h1>
        <p className="text-slate-400 mt-1">View and manage your coding assignments</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex space-x-2">
          <select
            value={difficultyFilter}
            onChange={e => setDifficultyFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="due">Due</option>
          </select>
          <button className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-300 hover:bg-slate-700 focus:outline-none">
            <FilterIcon size={18} />
          </button>
        </div>
      </div>

      {/* Assignment list */}
      <div className="space-y-4">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map(a => (
            <div
              key={a.Assignment.assignment_id}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 cursor-pointer
                         hover:bg-slate-700 transition rounded-xl border-2 border-indigo-500/50
                         shadow-lg shadow-indigo-700/40 hover:shadow-indigo-500/60"
            >
              <div className="flex items-start space-x-4" onClick={() => handleAssignmentClick(a)}>
                <div className="w-10 h-10 rounded-md bg-slate-700 flex items-center justify-center flex-shrink-0">
                  {getStatusIcon(!!a.Submission_id)}
                </div>
                <div>
                  <h4 className={`font-medium ${a.Submission_id ? 'text-green-400' : 'text-white'}`}>
                    {a.Assignment.assignment_name}
                  </h4>
                  {!a.Submission_id && (
                    <p className="text-sm text-slate-400">
                      Due: {a.Assignment.due_date} {a.Assignment.due_time || ''}
                    </p>
                  )}
                  {a.Assignment.difficulty && (
                    <span className="px-2 py-1 bg-slate-700 text-xs rounded-full text-slate-300 mt-1 inline-block">
                      {a.Assignment.difficulty.charAt(0).toUpperCase() + a.Assignment.difficulty.slice(1)}
                    </span>
                  )}
                </div>
              </div>
              {a.Submission_id && (
                <button
                  onClick={() => fetchSubmission(a.Assignment.assignment_id)}
                  className="ml-4 mt-2 md:mt-0 px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  View Submission
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-400">No assignments match your filters</p>
          </div>
        )}
      </div>

      {/* Submission modal */}
      {modalOpen && submissionDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-md p-6 w-11/12 md:w-1/2 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-slate-400 hover:text-white"
            >
              <XIcon size={20} />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">Submission Details</h3>
            <pre className="bg-slate-700 p-4 rounded text-slate-200 whitespace-pre-wrap overflow-x-auto">
              {submissionDetails.content}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;