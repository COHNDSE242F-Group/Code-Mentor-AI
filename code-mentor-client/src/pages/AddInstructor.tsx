import React, { useState } from "react";
import { SaveIcon, TrashIcon, PlusIcon } from "lucide-react";

interface InstructorRow {
  id: number;
  name: string;
  username: string;
  password: string;
  email: string;
  contact_no: string;
  index_no: string;
}

const AddInstructor: React.FC = () => {
  const [items, setItems] = useState<InstructorRow[]>([
    { id: 1, name: '', username: '', password: '', email: '', contact_no: '', index_no: '' }
  ]);

  const addRow = () => setItems(prev => [...prev, { id: prev.length + 1, name: '', username: '', password: '', email: '', contact_no: '', index_no: '' }]);
  const deleteRow = (id: number) => setItems(prev => prev.filter(i => i.id !== id));
  const handleChange = (id: number, field: keyof InstructorRow, value: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));

  const handleSave = async () => {
    try {
      for (const ins of items) {
        const res = await fetch('http://localhost:8000/instructor/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify({
            username: ins.username,
            password: ins.password,
            instructor_name: ins.name,
            email: ins.email,
            contact_no: ins.contact_no || null,
            index_no: ins.index_no || null,
          })
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || 'Failed to save instructor');
        }
      }
      alert('Instructors saved');
      setItems([{ id: 1, name: '', username: '', password: '', email: '', contact_no: '', index_no: '' }]);
    } catch (err) {
      console.error(err);
      alert('Failed to save instructors');
    }
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Add Instructors</h1>
      <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">NAME</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">USERNAME</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">PASSWORD</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">EMAIL</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">CONTACT NO</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">INDEX NO</th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {items.map(row => (
              <tr key={row.id} className="border-b hover:bg-gray-50 transition">
                <td className="py-2 px-4"><input value={row.name} onChange={e => handleChange(row.id, 'name', e.target.value)} className="border rounded-md px-2 py-1 w-full" /></td>
                <td className="py-2 px-4"><input value={row.username} onChange={e => handleChange(row.id, 'username', e.target.value)} className="border rounded-md px-2 py-1 w-full" /></td>
                <td className="py-2 px-4"><input type="password" value={row.password} onChange={e => handleChange(row.id, 'password', e.target.value)} className="border rounded-md px-2 py-1 w-full" /></td>
                <td className="py-2 px-4"><input value={row.email} onChange={e => handleChange(row.id, 'email', e.target.value)} className="border rounded-md px-2 py-1 w-full" /></td>
                <td className="py-2 px-4"><input value={row.contact_no} onChange={e => handleChange(row.id, 'contact_no', e.target.value)} className="border rounded-md px-2 py-1 w-full" /></td>
                <td className="py-2 px-4"><input value={row.index_no} onChange={e => handleChange(row.id, 'index_no', e.target.value)} className="border rounded-md px-2 py-1 w-full" /></td>
                <td className="py-2 px-4 text-center">
                  <button onClick={() => deleteRow(row.id)} className="text-red-500 hover:text-red-700"><TrashIcon size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mt-6">
        <button onClick={addRow} className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"><PlusIcon size={16} className="mr-2" />Add Row</button>
        <button onClick={handleSave} className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"><SaveIcon size={16} className="mr-2" />Save All</button>
      </div>
    </div>
  );
};

export default AddInstructor;
