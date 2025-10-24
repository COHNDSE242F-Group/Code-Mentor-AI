
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import Card from '../../components/ui/Card';
import { getUserIdFromToken, getUserRoleFromToken } from '../../utils/auth';

const AssignmentDetail = () => {
  const { id } = useParams(); // Get assignment ID from URL
  const [assignment, setAssignment] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [editing, setEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState<any>(null);
  const [notice, setNotice] = React.useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const navigate = useNavigate();

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

  const canEdit = React.useMemo(() => {
    if (!assignment) return false;
    const uid = getUserIdFromToken();
    const role = getUserRoleFromToken();
    if (role === 'admin') return true;
    return uid !== null && assignment.instructor_id === uid;
  }, [assignment]);

  const startEdit = () => {
    if (!assignment) return;
    setEditForm({
      title: assignment.title,
      language: assignment.language,
      difficulty: assignment.difficulty,
      dueDate: assignment.dueDate,
      dueTime: assignment.dueTime || '',
      batch: assignment.batch || 'All Students',
      instructions: assignment.instructions || (assignment.description && assignment.description.instructions) || '',
      aiEvaluation: !!assignment.aiEvaluation,
      plagiarism: !!assignment.plagiarism,
    });
    setEditing(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let v: any = value;
    if (type === 'checkbox' && 'checked' in e.target) v = (e.target as HTMLInputElement).checked;
    setEditForm((p: any) => ({ ...p, [name]: v }));
  };

  const showNotice = (text: string, type: 'success' | 'error' | 'info' = 'success', timeout = 4000) => {
    setNotice({ type, text });
    if (timeout > 0) setTimeout(() => setNotice(null), timeout);
  };

  const saveEdit = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:8000/assignment/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const msg = body?.detail || 'Failed to update';
        showNotice(msg, 'error');
        throw new Error(msg);
      }
      const updated = await res.json();
      // reload authoritative details from server to ensure fields persisted correctly
      try {
        const resp = await fetch(`http://localhost:8000/assignment/details/${id}`, { headers: { Authorization: token ? `Bearer ${token}` : '' } });
        if (resp.ok) {
            const fresh = await resp.json();
            setAssignment(fresh);
            try { window.dispatchEvent(new CustomEvent('assignment:updated', { detail: { id: Number(id) } })); } catch(e) {}
          } else {
          // fallback to optimistic update if details fetch fails
          setAssignment((a: any) => ({ ...a, ...{
            title: updated.assignment_name,
            dueDate: updated.due_date,
            dueTime: updated.due_time,
            difficulty: editForm.difficulty,
            language: editForm.language,
            instructions: editForm.instructions,
          }}));
        }
      } catch (e) {
        setAssignment((a: any) => ({ ...a, ...{
          title: updated.assignment_name,
          dueDate: updated.due_date,
          dueTime: updated.due_time,
          difficulty: editForm.difficulty,
          language: editForm.language,
          instructions: editForm.instructions,
        }}));
      }
      setEditing(false);
      showNotice('Assignment updated successfully', 'success');
    } catch (err: any) {
      setError(err.message || 'Failed to update');
      showNotice(err.message || 'Failed to update', 'error');
    }
  };

  const doDelete = async () => {
    // open custom confirmation modal
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:8000/assignment/delete/${id}`, {
        method: 'DELETE',
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const msg = body?.detail || 'Failed to delete';
        setError(msg);
        showNotice(msg, 'error');
        setShowDeleteConfirm(false);
        return;
      }
      showNotice('Assignment deleted', 'success');
      setShowDeleteConfirm(false);
      // short delay so user sees the success message
      setTimeout(() => navigate('/assignments'), 600);
    } catch (err: any) {
      setError(err.message || 'Failed to delete');
      showNotice(err.message || 'Failed to delete', 'error');
      setShowDeleteConfirm(false);
    }
  };

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
        {/* Notice banner (success / error / info) */}
        {notice && (
          <div className={`mx-4 mt-4 rounded-md p-3 text-sm ${notice.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : notice.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-blue-50 border border-blue-200 text-blue-800'}`}>
            {notice.text}
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading assignment details...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : assignment ? (
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">{assignment.title}</h2>
              <div className="space-x-2">
                {canEdit && !editing && (
                  <>
                    <button onClick={startEdit} className="px-3 py-1 bg-yellow-500 text-white rounded-md">Edit</button>
                    <button onClick={doDelete} className="px-3 py-1 bg-red-500 text-white rounded-md">Delete</button>
                  </>
                )}
                {editing && (
                  <>
                    <button onClick={saveEdit} className="px-3 py-1 bg-green-600 text-white rounded-md">Save</button>
                    <button onClick={() => setEditing(false)} className="px-3 py-1 bg-gray-300 text-black rounded-md">Cancel</button>
                  </>
                )}
              </div>
            </div>

            {editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-500">Title</label>
                    <input name="title" value={editForm.title} onChange={handleEditChange} className="w-full px-3 py-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">Language</label>
                    <input name="language" value={editForm.language} onChange={handleEditChange} className="w-full px-3 py-2 border rounded" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm text-gray-500">Difficulty</label>
                    <select name="difficulty" value={editForm.difficulty} onChange={handleEditChange} className="w-full px-3 py-2 border rounded">
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">Due Date</label>
                    <input type="date" name="dueDate" value={editForm.dueDate} onChange={handleEditChange} className="w-full px-3 py-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">Due Time</label>
                    <input type="time" name="dueTime" value={editForm.dueTime} onChange={handleEditChange} className="w-full px-3 py-2 border rounded" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Instructions</label>
                  <textarea name="instructions" value={editForm.instructions} onChange={handleEditChange} rows={6} className="w-full px-3 py-2 border rounded" />
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">No assignment found.</div>
        )}
      </Card>
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-white rounded-md shadow-lg max-w-md w-full p-6 z-10">
            <h3 className="text-lg font-semibold mb-2">Delete assignment</h3>
            <p className="text-sm text-gray-600 mb-4">This action cannot be undone. Are you sure you want to delete this assignment?</p>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-md">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentDetail;
