
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import Card from '../../components/ui/Card';

const AssignmentDetail = () => {
  const { id } = useParams(); // Get assignment ID from URL
  const [assignment, setAssignment] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8000/assignment/details/${id}`, { headers: { Authorization: token ? `Bearer ${token}` : '' } })
      .then(async res => {
        if (res.status === 401) {
          setError('Not authenticated. Please log in.');
          setLoading(false);
          return Promise.reject(new Error('Not authenticated'));
        }
        if (!res.ok) {
          // try to get json error detail
          const body = await res.json().catch(() => null);
          const msg = body && body.detail ? body.detail : 'Failed to fetch assignment details';
          throw new Error(msg);
        }
        return res.json();
      })
      .then(data => {
        setAssignment(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Error loading assignment details');
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="w-full">
      <div className="mb-6">
        <Link to="/assignments" className="inline-flex items-center text-[#0D47A1] mb-4">
          <ArrowLeftIcon size={16} className="mr-1" />
          Back to Assignments
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          Assignment Details
        </h1>
        <p className="text-gray-500">View and manage assignment details</p>
      </div>

      <Card>
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading assignment details...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : assignment ? (
          <div className="p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{assignment.title}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Programming Language</p>
                <p className="text-lg font-medium text-gray-800">{assignment.language || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Difficulty</p>
                <p className="text-lg font-medium text-gray-800">{assignment.difficulty || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Batch</p>
                <p className="text-lg font-medium text-gray-800">{assignment.batch || 'All Students'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-lg font-medium text-gray-800">{assignment.status || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p className="text-lg font-medium text-gray-800">{assignment.dueDate || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Due Time</p>
                <p className="text-lg font-medium text-gray-800">{assignment.dueTime || '-'}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Instructions</p>
              <p className="text-gray-700 whitespace-pre-line">
                {assignment.instructions || (assignment.description && assignment.description.instructions) || '-'}
              </p>
            </div>

            {assignment.attachments && assignment.attachments.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Attachments</p>
                <ul className="list-disc ml-6">
                {assignment.attachments.map((file: string, index: number) => (
                  <li key={index} className="text-blue-600 hover:underline cursor-pointer">
                    {file}
                  </li>
                ))}
                </ul>
              </div>
            )}

            <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={assignment.aiEvaluation}
                  readOnly
                  className="h-4 w-4 text-[#0D47A1] border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">AI Evaluation Enabled</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={assignment.plagiarism}
                  readOnly
                  className="h-4 w-4 text-[#0D47A1] border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Plagiarism Check Enabled</label>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">No assignment found.</div>
        )}
      </Card>
    </div>
  );
};

export default AssignmentDetail;
