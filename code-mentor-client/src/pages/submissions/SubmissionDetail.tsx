import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { ArrowLeftIcon, PlayIcon, AlertTriangleIcon, MessageCircleIcon, CheckCircleIcon } from 'lucide-react';

const SubmissionDetail = () => {
  const { submissionId } = useParams();

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);

interface Submission {
  id: number;
  assignment: string;
  student: string;
  studentId: string;
  submittedAt: string;
  code: string; // Extracted from report JSON
  paste: boolean; // Extracted from report JSON
  output?: string; // Optional, extracted from report JSON
  status?: string; // Optional, extracted from report JSON
  score?: number;
  batch: string;
  plagiarism?: object; // Dummy data
  ai_feedback?: string[]; // Dummy data
}


  useEffect(() => {
    if (!submissionId) {
      console.error('Submission ID is undefined');
      return;
    }

    setLoading(true);
    fetch(`http://localhost:8000/submission/${submissionId}`)
      .then(res => res.json())
      .then(data => setSubmission(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [submissionId]);

  const handleSaveGrade = () => {
    fetch(`http://localhost:8000/submission/${submissionId}/grade`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        score: parseInt(grade, 10),
        feedback,
      }),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to save grade and feedback');
        }
        return res.json();
      })
      .then(() => {
        alert('Grade and feedback saved successfully');
        setSubmission(prev => {
          if (!prev) return prev; // If `prev` is null, return it directly
          return {
            ...prev, // Spread the previous state
            score: parseInt(grade, 10),
            feedback,
            status: 'Graded',
          };
        });
      })
      .catch(err => console.error(err));
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!submission) return <div className="p-8 text-center">Submission not found</div>;

  return (
    <div className="w-full">
      <div className="mb-6">
        <Link to="/submissions" className="inline-flex items-center text-[#0D47A1] mb-4">
          <ArrowLeftIcon size={16} className="mr-1" />
          Back to Submissions
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{submission?.assignment}</h1>
            <div className="flex items-center text-gray-500">
              <span>Submitted by</span>
              <span className="font-medium text-gray-700 mx-1">{submission?.student}</span>
              <span>on {submission?.submittedAt}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Code Submission</h2>
            <div className="bg-gray-900 text-gray-200 p-4 rounded-md font-mono text-sm overflow-auto" style={{ maxHeight: '500px' }}>
              <pre>{submission?.code || "No code submitted"}</pre> {/* Display code or fallback */}
            </div>
          </Card>
          <Card>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Execution Output</h2>
            <div className="bg-gray-100 p-4 rounded-md font-mono text-sm overflow-auto" style={{ maxHeight: '200px' }}>
              <pre className="text-green-600">{submission?.output}</pre>
            </div>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Grading</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade (out of 100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={grade}
                onChange={e => setGrade(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Feedback to Student</label>
              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent"
                rows={6}
                placeholder="Provide detailed feedback on the submission..."
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button onClick={handleSaveGrade} className="px-4 py-2 bg-[#0D47A1] text-white rounded-md hover:bg-blue-800">
                Save Grade
              </button>
            </div>
          </Card>
          <Card>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Paste Detection</h2>
            <div className="bg-gray-100 p-4 rounded-md font-mono text-sm overflow-auto" style={{ maxHeight: '200px' }}>
              <pre>{submission?.paste ? "Code was pasted" : "Code was not pasted"}</pre> {/* Display paste flag */}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetail;