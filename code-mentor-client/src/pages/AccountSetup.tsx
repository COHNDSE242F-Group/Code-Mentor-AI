import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadIcon, PlusIcon, TrashIcon, UsersIcon, UserIcon, MailIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
interface Invitation {
  id: string;
  email: string;
  name: string;
  role: 'instructor' | 'student';
  status: 'pending' | 'sent';
}
const AccountSetup: React.FC = () => {
  const { theme } = useTheme(); // Correct destructuring
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'instructors' | 'students'>('instructors');
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  // In a real app, this would come from your state management
  const plan = {
    instructorSeats: 15,
    studentSeats: 500,
    instructorsInvited: 2,
    studentsInvited: 0
  };
  const handleAddInvitation = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing.");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/invitations",
        { email: newEmail, name: newName, role: activeTab },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInvitations([...invitations, response.data.invitation]);
      setNewEmail("");
      setNewName("");
    } catch (error) {
      console.error("Error adding invitation:", error);
    }
  };
  const handleRemoveInvitation = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing.");
        return;
      }

      await axios.delete(`http://localhost:8000/invitations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setInvitations(invitations.filter((inv) => inv.id !== id));
    } catch (error) {
      console.error("Error removing invitation:", error);
    }
  };

  const role = activeTab === 'instructors' ? 'instructor' : 'student';

  const handleSendInvitations = () => {
    // In a real app, this would send the invitations
    setInvitations(invitations.map(inv => ({
      ...inv,
      status: 'sent'
    })));
    navigate('/dashboard');
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };
  const handleProcessCSV = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !csvFile) {
        console.error("Token or CSV file is missing.");
        return;
      }

      const formData = new FormData();
      formData.append("csv_file", csvFile);

      const response = await axios.post("http://localhost:8000/invitations/process-csv", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setInvitations([...invitations, ...response.data.invitations]);
      setCsvFile(null);
    } catch (error) {
      console.error("Error processing CSV:", error);
    }
  };
  const getProgressPercentage = () => {
    if (activeTab === 'instructors') {
      return Math.min(100, plan.instructorsInvited / plan.instructorSeats * 100);
    } else {
      return Math.min(100, plan.studentsInvited / plan.studentSeats * 100);
    }
  };
  return <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Account Setup</h1>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Invite instructors and students to join your CodeMentorAI University
          Portal
        </p>
      </div>
      <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
        <div className="flex border-b">
          <button className={`flex items-center py-4 px-6 font-medium ${activeTab === 'instructors' ? `border-b-2 border-blue-500 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}` : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} onClick={() => setActiveTab('instructors')}>
            <UserIcon size={18} className="mr-2" />
            Invite Instructors
          </button>
          <button className={`flex items-center py-4 px-6 font-medium ${activeTab === 'students' ? `border-b-2 border-blue-500 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}` : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} onClick={() => setActiveTab('students')}>
            <UsersIcon size={18} className="mr-2" />
            Invite Students
          </button>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Allocation Progress</h2>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mr-4">
                <div className="bg-blue-600 h-4 rounded-full" style={{
                width: `${getProgressPercentage()}%`
              }}></div>
              </div>
              <span className="text-sm whitespace-nowrap">
                {activeTab === 'instructors' ? `${plan.instructorsInvited}/${plan.instructorSeats} instructors` : `${plan.studentsInvited}/${plan.studentSeats} students`}
              </span>
            </div>
          </div>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Add Individual{' '}
                {activeTab === 'instructors' ? 'Instructor' : 'Student'}
              </h2>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon size={18} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                  </div>
                  <input type="text" value={newName} onChange={e => setNewName(e.target.value)} className={`pl-10 block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} placeholder={`${activeTab === 'instructors' ? 'Professor name' : 'Student name'}`} />
                </div>
              </div>
              <div className="flex-1">
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon size={18} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                  </div>
                  <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className={`pl-10 block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} placeholder={`${activeTab === 'instructors' ? 'professor@university.edu' : 'student@university.edu'}`} />
                </div>
              </div>
              <div className="flex-none">
                <label className="invisible block text-sm font-medium mb-1">
                  Add
                </label>
                <button onClick={handleAddInvitation} className={`inline-flex items-center py-2 px-4 rounded-md font-medium ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                  <PlusIcon size={18} className="mr-1" />
                  Add
                </button>
              </div>
            </div>
          </div>
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Bulk Import</h2>
            </div>
            <div className={`p-6 border-2 border-dashed rounded-md text-center ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
              <div className="space-y-2">
                <div className="flex justify-center">
                  <UploadIcon size={36} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                </div>
                <div>
                  <label htmlFor="file-upload" className={`cursor-pointer font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                    Click to upload
                  </label>
                  <input id="file-upload" name="file-upload" type="file" accept=".csv" className="sr-only" onChange={handleFileUpload} />
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    {' '}
                    or drag and drop
                  </span>
                </div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  CSV file with name and email columns
                </p>
                {csvFile && <div className={`mt-2 text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                    File selected: {csvFile.name}
                  </div>}
              </div>
              <button className={`mt-4 inline-flex items-center py-2 px-4 rounded-md text-sm font-medium ${csvFile ? 'bg-blue-600 hover:bg-blue-700 text-white' : theme === 'dark' ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`} disabled={!csvFile} onClick={handleProcessCSV}>
                Process CSV
              </button>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Pending Invitations</h2>

{/* Use the mapped role for filtering */}
{invitations.filter(inv => inv.role === role).length === 0 ? (
  <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    No pending invitations yet.
  </div>
) : (
  <div className={`border rounded-md overflow-hidden ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
            Name
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
            Email
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
            Status
          </th>
          <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
            Action
          </th>
        </tr>
      </thead>
      <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
        {invitations.filter(inv => inv.role === role).map(invitation => (
          <tr key={invitation.id}>
            <td className="px-6 py-4 whitespace-nowrap">{invitation.name}</td>
            <td className="px-6 py-4 whitespace-nowrap">{invitation.email}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  invitation.status === 'sent'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                }`}
              >
                {invitation.status === 'sent' ? 'Sent' : 'Pending'}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
              <button
                onClick={() => handleRemoveInvitation(invitation.id)}
                className={`text-sm ${theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}
              >
                <TrashIcon size={18} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
          </div>
          <div className="mt-8 flex justify-end">
            <button onClick={() => navigate('/dashboard')} className={`mr-4 py-2 px-4 rounded-md font-medium ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>
              Skip for Now
            </button>
            <button onClick={handleSendInvitations} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
              Send Invitations
            </button>
          </div>
        </div>
      </div>
    </div>;
};

export default AccountSetup;