import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const EditInstructor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [instructor, setInstructor] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const res = await fetch(`http://localhost:8000/instructors/${id}`);
        const data = await res.json();
        setInstructor(data);
        setForm({
          name: data.name || '',
          email: data.email || '',
          contact_no: data.contact_no || '',
          index_no: data.index_no || '',
          uni_id: data.uni_id || '',
          username: data.username || '',
          password: '',
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructor();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        instructor_name: form.name,
        email: form.email,
        contact_no: form.contact_no,
        index_no: form.index_no,
        uni_id: form.uni_id || null,
      };
      if (form.username) payload.username = form.username;
      if (form.password) payload.password = form.password;

      const res = await fetch(`http://localhost:8000/instructor/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Update failed');
      alert('Instructor updated');
      navigate('/batches');
    } catch (err) {
      console.error(err);
      alert('Error updating instructor');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!instructor) return <p>Instructor not found</p>;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card>
        <h2 className="text-xl font-bold mb-4">Edit Instructor</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full mt-1 p-2 border rounded bg-white" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Email</label>
            <input name="email" value={form.email} onChange={handleChange} className="w-full mt-1 p-2 border rounded bg-white" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Contact</label>
            <input name="contact_no" value={form.contact_no} onChange={handleChange} className="w-full mt-1 p-2 border rounded bg-white" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Index No</label>
            <input name="index_no" value={form.index_no} onChange={handleChange} className="w-full mt-1 p-2 border rounded bg-white" />
          </div>

          <h3 className="text-lg font-semibold mt-4">User credentials</h3>
          <div>
            <label className="block text-sm text-gray-700">Username</label>
            <input name="username" value={form.username} onChange={handleChange} className="w-full mt-1 p-2 border rounded bg-white" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Password (leave blank to keep)</label>
            <div className="relative">
              <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} className="w-full mt-1 p-2 border rounded bg-white pr-10" />
              <button type="button" className="absolute right-2 top-2 text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>
          </div>

          <div className="flex space-x-2 mt-4">
            <button type="submit" className="px-4 py-2 bg-[#0D47A1] text-white rounded">Save</button>
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Cancel</button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditInstructor;
