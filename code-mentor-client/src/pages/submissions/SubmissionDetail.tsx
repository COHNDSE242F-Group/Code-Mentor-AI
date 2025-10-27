import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { ArrowLeftIcon } from 'lucide-react';

const SubmissionDetail = () => {
  const { submissionId } = useParams();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  interface Submission {
    id: number;
    assignment: string;
    student: string;
    studentId: string;
    submittedAt: string;
    code: string;
    paste: boolean;
    output?: string;
    status?: string;
    score?: number;
    batch: string;
    plagiarism?: object;
    ai_feedback?: string[];
    instructor_feedback?: string[];
    grade?: string;
  }

  useEffect(() => {
    if (!submissionId || isNaN(Number(submissionId))) {
      setError('Invalid submission ID');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`http://localhost:8000/submissions/${submissionId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch submission: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Fetched submission data:', data); // Debug log
        setSubmission(data);
        // Initialize form fields with existing data
        setScore(data.score?.toString() || '');
        setFeedback(data.instructor_feedback?.join('\n') || '');
      })
      .catch(err => {
        console.error('Error fetching submission:', err);
        setError('Failed to load submission');
      })
      .finally(() => setLoading(false));
  }, [submissionId]);

const handleSaveGrade = () => {
  if (!submissionId || isNaN(Number(submissionId))) {
    alert('Invalid submission ID');
    return;
  }

  const scoreValue = parseInt(score, 10);
  if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 100) {
    alert('Please enter a valid score between 0 and 100');
    return;
  }

  console.log('Saving grade with data:', {
    score: scoreValue,
    feedback: feedback
  });

  fetch(`http://localhost:8000/submissions/${submissionId}/grade`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      score: scoreValue,
      feedback: feedback,
    }),
  })
    .then(res => {
      console.log('Response status:', res.status);
      if (!res.ok) {
        throw new Error(`Failed to save grade: ${res.status}`);
      }
      return res.json();
    })
    .then(updatedData => {
      console.log('Successfully updated submission:', updatedData);
      
      setSubmission(updatedData);
      setScore(updatedData.score?.toString() || '');
      setFeedback(updatedData.instructor_feedback?.join('\n') || '');
    })
    .catch(err => {
      console.error('Error saving grade:', err);
      alert('Failed to save grade and feedback');
    });
};

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
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
            <h1 className="text-2xl font-bold text-gray-800">{submission.assignment}</h1>
            <div className="flex items-center text-gray-500">
              <span>Submitted by</span>
              <span className="font-medium text-gray-700 mx-1">{submission.student}</span>
              <span>on {submission.submittedAt}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Code Submission</h2>
            <div className="bg-gray-900 text-gray-200 p-4 rounded-md font-mono text-sm overflow-auto" style={{ maxHeight: '500px' }}>
              <pre>{submission.code || "No code submitted"}</pre>
            </div>
          </Card>
          <Card>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Execution Output</h2>
            <div className="bg-gray-100 p-4 rounded-md font-mono text-sm overflow-auto" style={{ maxHeight: '200px' }}>
              <pre className="text-green-600">{submission.output || "No output available"}</pre>
            </div>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Grading</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Score (out of 100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={score}
                onChange={e => setScore(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Grade</label>
              <input
                type="text"
                value={submission.grade || "Not graded"}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
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
              <pre>{submission.paste ? "Code was pasted" : "Code was not pasted"}</pre>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetail;