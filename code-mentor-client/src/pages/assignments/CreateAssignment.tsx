
import React, { useState, useEffect, useRef } from 'react';
import Card from '../../components/ui/Card';
import { ArrowLeftIcon, PlusIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
const CreateAssignment = () => {
  const [batches, setBatches] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: '',
    language: 'Python',
    difficulty: 'Easy',
    dueDate: '',
    dueTime: '',
    batch: '',
    instructions: '',
    aiEvaluation: false,
    plagiarism: false
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [draftSaved, setDraftSaved] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8000/assignment/options', { headers: { Authorization: token ? `Bearer ${token}` : '' } })
      .then(res => res.json())
      .then(data => setBatches(data.batches || []));
    // Load draft if exists
    const draft = localStorage.getItem('assignmentDraft');
    if (draft) {
      setForm(JSON.parse(draft));
    }
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let fieldValue: string | boolean = value;
    if (type === 'checkbox' && 'checked' in e.target) {
      fieldValue = (e.target as HTMLInputElement).checked;
    }
    setForm(prev => ({
      ...prev,
      [name]: fieldValue
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    // validation
    if (!form.title || !form.language || !form.difficulty || !form.dueDate || !form.dueTime || !form.batch || !form.instructions) {
      setError('Please fill in all required fields.');
      setTimeout(() => setError(''), 2000);
      return;
    }
    const token = localStorage.getItem('token');
    const payload = {
      title: form.title,
      language: form.language,
      difficulty: form.difficulty,
      dueDate: form.dueDate,
      dueTime: form.dueTime,
      batch: form.batch,
      instructions: form.instructions,
      aiEvaluation: form.aiEvaluation,
      plagiarism: form.plagiarism,
    };

    const res = await fetch('http://localhost:8000/assignment/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      setSuccess('Assignment created successfully!');
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem('assignmentDraft', JSON.stringify(form));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };
  const handleFileClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };
  return <div className="w-full">
      <div className="mb-6">
        <Link to="/assignments" className="inline-flex items-center text-[#0D47A1] mb-4">
          <ArrowLeftIcon size={16} className="mr-1" />
          Back to Assignments
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          Create New Assignment
        </h1>
        <p className="text-gray-500">
          Fill in the details to create a new programming assignment
        </p>
      </div>
      <Card>
  <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignment Title
              </label>
              <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent" placeholder="e.g., Python Data Structures" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Programming Language
              </label>
              <select name="language" value={form.language} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent">
                <option>Python</option>
                <option>JavaScript</option>
                <option>Java</option>
                <option>C++</option>
                <option>SQL</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty Level
              </label>
              <select name="difficulty" value={form.difficulty} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
                <option>Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Time
              </label>
              <input type="time" name="dueTime" value={form.dueTime} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent" />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign To
            </label>
            <select name="batch" value={form.batch} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent">
              {batches.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instructions
            </label>
            <textarea name="instructions" value={form.instructions} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent" rows={6} placeholder="Provide clear instructions for the assignment..."></textarea>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attachments
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <div className="flex justify-center mb-2">
                <PlusIcon size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-xs text-gray-400">
                PDF, ZIP, PY, JS, JAVA, CPP files (Max 10MB)
              </p>
              <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange} />
              <button type="button" onClick={handleFileClick} className="mt-4 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium">
                Browse Files
              </button>
              {selectedFiles.length > 0 && (
                <div className="mt-4 text-left">
                  <span className="font-medium text-gray-700">Selected files:</span>
                  <ul className="list-disc ml-6">
                    {selectedFiles.map(file => (
                      <li key={file.name} className="text-sm text-gray-600">{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="mb-6 space-y-4">
            <div className="flex items-center">
              <input type="checkbox" id="ai-evaluation" name="aiEvaluation" checked={form.aiEvaluation} onChange={handleChange} className="h-4 w-4 text-[#0D47A1] focus:ring-[#0D47A1] border-gray-300 rounded" />
              <label htmlFor="ai-evaluation" className="ml-2 block text-sm text-gray-700">
                Enable AI-generated evaluation program
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="plagiarism" name="plagiarism" checked={form.plagiarism} onChange={handleChange} className="h-4 w-4 text-[#0D47A1] focus:ring-[#0D47A1] border-gray-300 rounded" />
              <label htmlFor="plagiarism" className="ml-2 block text-sm text-gray-700">
                Enable plagiarism detection
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={handleSaveDraft} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Save as Draft
            </button>
            <button type="button" onClick={() => {
              const draft = localStorage.getItem('assignmentDraft');
              if (draft) {
                setForm(JSON.parse(draft));
                setDraftLoaded('Draft loaded!');
              } else {
                setDraftLoaded('No draft found.');
              }
              setTimeout(() => setDraftLoaded(''), 2000);
            }} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Load Draft
            </button>
            {draftLoaded && <span className="text-blue-600 ml-2">{draftLoaded}</span>}
            {draftSaved && <span className="text-blue-600 ml-2">Draft saved!</span>}
            <button type="submit" className="px-4 py-2 bg-[#0D47A1] text-white rounded-md hover:bg-blue-800">
              Create Assignment
            </button>
            {error && <span className="text-red-600 ml-4">{error}</span>}
            {success && <span className="text-green-600 ml-4">{success}</span>}
          </div>
        </form>
      </Card>
    </div>;
};
export default CreateAssignment;