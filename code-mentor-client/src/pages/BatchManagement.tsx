import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import { useNavigate } from "react-router-dom";

import {
  PlusIcon,
  SearchIcon,
  UsersIcon,
  EditIcon,
  TrashIcon,
  MoreHorizontalIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";

// Define types for batches and students
interface Batch {
  id: number;
  name: string;
  description: string;
  students: number;
  startDate: string;
  endDate: string;
  progress: number;
}

interface Student {
  student_id: number;
  index_no?: string | null;
  name: string;
  email: string;
  contact_no?: string | null;
  university_name?: string | null;
  batch_name?: string | null;
  username?: string | null;
  password?: string | null;
}

interface Instructor {
  instructor_id: number;
  index_no?: string | null;
  name: string;
  email: string;
  contact_no?: string | null;
  university_name?: string | null;
  username?: string | null;
  password?: string | null;
}

const BatchManagement: React.FC = () => {
   const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"batches" | "students" | "instructors">("batches");
  const [batches, setBatches] = useState<Batch[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<number, boolean>>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  const togglePassword = (id: number) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your FastAPI endpoints
        const [batchesRes, studentsRes, instructorsRes] = await Promise.all([
          fetch("http://localhost:8000/batches"),
          fetch("http://localhost:8000/students"),
          fetch("http://localhost:8000/instructors"),
        ]);

        if (!batchesRes.ok || !studentsRes.ok || !instructorsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const batchData: Batch[] = await batchesRes.json();
        const studentData: Student[] = await studentsRes.json();
        const instructorData: Instructor[] = await instructorsRes.json();

        setBatches(batchData);
        setStudents(studentData);
        setInstructors(instructorData);
      } catch (error) {
        console.error("Error fetching batches/students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="text-gray-500 text-center">Loading...</p>;
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Batch Management</h1>
        <p className="text-gray-500">Manage student batches and groups</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-3 px-6 font-medium ${
              activeTab === "batches"
                ? "text-[#0D47A1] border-b-2 border-[#0D47A1]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("batches")}
          >
            Batches
          </button>
          <button
            className={`py-3 px-6 font-medium ${
              activeTab === "students"
                ? "text-[#0D47A1] border-b-2 border-[#0D47A1]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("students")}
          >
            Students
          </button>
          <button
            className={`py-3 px-6 font-medium ${
              activeTab === "instructors"
                ? "text-[#0D47A1] border-b-2 border-[#0D47A1]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("instructors")}
          >
            Instructors
          </button>
        </div>
      </div>

      {/* Batches View */}
      {activeTab === "batches" ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search batches..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent"
              />
              <SearchIcon
                size={18}
                className="absolute left-3 top-2.5 text-gray-400"
              />
            </div>
            <button className="inline-flex items-center px-4 py-2 bg-[#0D47A1] text-white rounded-md hover:bg-blue-800">
              <PlusIcon size={16} className="mr-2" />
              Create New Batch
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {batches.map((batch) => (
              <Card key={batch.id} className="relative">
                <div className="absolute top-4 right-4">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontalIcon size={18} />
                  </button>
                </div>
                <div className="flex items-start">
                  <div className="rounded-full bg-blue-100 p-3 mr-4">
                    <UsersIcon size={24} className="text-[#0D47A1]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">
                      {batch.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {batch.description}
                    </p>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">
                        {batch.students} students
                      </span>
                      <span className="text-gray-600">
                        {batch.startDate} - {batch.endDate}
                      </span>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{batch.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#0D47A1] h-2 rounded-full"
                          style={{ width: `${batch.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-xs border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
                        View Details
                      </button>
                      <button className="px-3 py-1 text-xs border border-[#0D47A1] rounded-md bg-white text-[#0D47A1] hover:bg-blue-50">
                        Manage Students
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : activeTab === 'students' ? (
        // Students View
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent"
              />
              <SearchIcon
                size={18}
                className="absolute left-3 top-2.5 text-gray-400"
              />
            </div>
            <div className="flex space-x-4">
              <select className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700">
                <option>All Batches</option>
                {batches.map((batch) => (
                  <option key={batch.id}>{batch.name}</option>
                ))}
              </select>

              
<button
  onClick={() => navigate("/addstudent")}
  className="inline-flex items-center px-4 py-2 bg-[#0D47A1] text-white rounded-md hover:bg-blue-800"
>
  <PlusIcon size={16} className="mr-2" />
  Add Student
</button>
            </div>
          </div>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-sm text-gray-600">Passwords are masked by default. Click "Show" on a row to reveal.</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">ID</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Index No</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Name</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Email</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Contact</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">University</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Batch</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Username</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Password</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const totalPages = Math.max(1, Math.ceil(students.length / pageSize));
                    const page = Math.min(currentPage, totalPages);
                    const startIndex = (page - 1) * pageSize;
                    const endIndex = startIndex + pageSize;
                    const paginatedStudents = students.slice(startIndex, endIndex);
                    return paginatedStudents.map((student) => (
                    <tr key={student.student_id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{student.student_id}</td>
                      <td className="py-3 px-4 text-sm">{student.index_no ?? '-'}</td>
                      <td className="py-3 px-4 font-medium">{student.name}</td>
                      <td className="py-3 px-4 text-sm">{student.email}</td>
                      <td className="py-3 px-4 text-sm">{student.contact_no ?? '-'}</td>
                      <td className="py-3 px-4 text-sm">{student.university_name ?? '-'}</td>
                      <td className="py-3 px-4 text-sm">{student.batch_name ?? '-'}</td>
                      <td className="py-3 px-4 text-sm">{student.username ?? '-'}</td>
                      <td className="py-3 px-4 text-sm">
                        {student.password ? (
                          <div className="flex items-center space-x-2">
                            <span className="font-mono">{visiblePasswords[student.student_id] ? student.password : '********'}</span>
                            <button
                              onClick={() => togglePassword(student.student_id)}
                              className="text-blue-500 hover:text-blue-700 p-1 rounded"
                              aria-label={visiblePasswords[student.student_id] ? 'Hide password' : 'Show password'}
                              title={visiblePasswords[student.student_id] ? 'Hide password' : 'Show password'}
                            >
                              {visiblePasswords[student.student_id] ? (
                                <EyeOffIcon size={16} />
                              ) : (
                                <EyeIcon size={16} />
                              )}
                            </button>
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button onClick={()=>navigate(`/students/${student.student_id}/edit`)} className="text-blue-500 hover:text-blue-700">
                            <EditIcon size={16} />
                          </button>
                          <button
                            onClick={async () => {
                              // Confirm and delete
                              if (!window.confirm('Delete this student? This action cannot be undone.')) return;
                              try {
                                const res = await fetch(`http://localhost:8000/student/${student.student_id}`, { method: 'DELETE' });
                                if (!res.ok) throw new Error('Delete failed');
                                // remove from local state
                                setStudents(prev => {
                                  const next = prev.filter(s => s.student_id !== student.student_id);
                                  // adjust page if needed
                                  const newTotalPages = Math.max(1, Math.ceil(next.length / pageSize));
                                  if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
                                  return next;
                                });
                                setVisiblePasswords(prev => {
                                  const copy = { ...prev };
                                  delete copy[student.student_id];
                                  return copy;
                                });
                              } catch (err) {
                                console.error('Failed to delete student', err);
                                alert('Failed to delete student');
                              }
                            }}
                            className="text-red-500 hover:text-red-700"
                            aria-label={`Delete student ${student.name}`}
                            title="Delete"
                          >
                            <TrashIcon size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                {students.length === 0 ? (
                  'No students'
                ) : (
                  (() => {
                    const totalPages = Math.max(1, Math.ceil(students.length / pageSize));
                    const page = Math.min(currentPage, totalPages);
                    const startIndex = (page - 1) * pageSize;
                    const endIndex = Math.min(startIndex + pageSize, students.length);
                    return `Showing ${startIndex + 1}-${endIndex} of ${students.length} students`;
                  })()
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 disabled:opacity-50 ${currentPage === 1 ? 'cursor-not-allowed' : ''}`}
                >
                  Previous
                </button>
                <button className="px-3 py-1 bg-[#0D47A1] text-white rounded-md hover:bg-blue-800">
                  {currentPage}
                </button>
                <button
                  onClick={() => setCurrentPage(p => {
                    const totalPages = Math.max(1, Math.ceil(students.length / pageSize));
                    return Math.min(totalPages, p + 1);
                  })}
                  disabled={currentPage >= Math.max(1, Math.ceil(students.length / pageSize))}
                  className={`px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 ${currentPage >= Math.max(1, Math.ceil(students.length / pageSize)) ? 'cursor-not-allowed disabled:opacity-50' : ''}`}
                >
                  Next
                </button>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        // Instructors View
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search instructors..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent"
              />
            </div>
            <div className="flex space-x-4">
              <select className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700">
                <option>All Universities</option>
                {batches.map((batch) => (
                  <option key={batch.id}>{batch.name}</option>
                ))}
              </select>

              <button
                onClick={() => navigate('/addinstructor')}
                className="inline-flex items-center px-4 py-2 bg-[#0D47A1] text-white rounded-md hover:bg-blue-800"
              >
                <PlusIcon size={16} className="mr-2" />
                Add Instructor
              </button>
            </div>
          </div>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-sm text-gray-600">Passwords are masked by default. Click the eye icon on a row to reveal.</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">ID</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Index No</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Name</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Email</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Contact</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">University</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Username</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Password</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const totalPages = Math.max(1, Math.ceil(instructors.length / pageSize));
                    const page = Math.min(currentPage, totalPages);
                    const startIndex = (page - 1) * pageSize;
                    const endIndex = startIndex + pageSize;
                    const paginated = instructors.slice(startIndex, endIndex);
                    return paginated.map((ins) => (
                      <tr key={ins.instructor_id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{ins.instructor_id}</td>
                        <td className="py-3 px-4 text-sm">{ins.index_no ?? '-'}</td>
                        <td className="py-3 px-4 font-medium">{ins.name}</td>
                        <td className="py-3 px-4 text-sm">{ins.email}</td>
                        <td className="py-3 px-4 text-sm">{ins.contact_no ?? '-'}</td>
                        <td className="py-3 px-4 text-sm">{ins.university_name ?? '-'}</td>
                        <td className="py-3 px-4 text-sm">{ins.username ?? '-'}</td>
                        <td className="py-3 px-4 text-sm">
                          {ins.password ? (
                            <div className="flex items-center space-x-2">
                              <span className="font-mono">{visiblePasswords[ins.instructor_id] ? ins.password : '********'}</span>
                              <button
                                onClick={() => togglePassword(ins.instructor_id)}
                                className="text-blue-500 hover:text-blue-700 p-1 rounded"
                                aria-label={visiblePasswords[ins.instructor_id] ? 'Hide password' : 'Show password'}
                                title={visiblePasswords[ins.instructor_id] ? 'Hide password' : 'Show password'}
                              >
                                  {visiblePasswords[ins.instructor_id] ? (
                                    <EyeOffIcon size={16} />
                                  ) : (
                                    <EyeIcon size={16} />
                                  )}
                              </button>
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button onClick={()=>navigate(`/instructors/${ins.instructor_id}/edit`)} className="text-blue-500 hover:text-blue-700">
                              <EditIcon size={16} />
                            </button>
                            <button
                              onClick={async () => {
                                if (!window.confirm('Delete this instructor? This action cannot be undone.')) return;
                                try {
                                  const res = await fetch(`http://localhost:8000/instructor/${ins.instructor_id}`, { method: 'DELETE' });
                                  if (!res.ok) throw new Error('Delete failed');
                                  setInstructors(prev => prev.filter(i => i.instructor_id !== ins.instructor_id));
                                  setVisiblePasswords(prev => { const copy = { ...prev }; delete copy[ins.instructor_id]; return copy; });
                                } catch (err) {
                                  console.error('Failed to delete instructor', err);
                                  alert('Failed to delete instructor');
                                }
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <TrashIcon size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                {instructors.length === 0 ? (
                  'No instructors'
                ) : (
                  (() => {
                    const totalPages = Math.max(1, Math.ceil(instructors.length / pageSize));
                    const page = Math.min(currentPage, totalPages);
                    const startIndex = (page - 1) * pageSize;
                    const endIndex = Math.min(startIndex + pageSize, instructors.length);
                    return `Showing ${startIndex + 1}-${endIndex} of ${instructors.length} instructors`;
                  })()
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 disabled:opacity-50 ${currentPage === 1 ? 'cursor-not-allowed' : ''}`}
                >
                  Previous
                </button>
                <button className="px-3 py-1 bg-[#0D47A1] text-white rounded-md hover:bg-blue-800">
                  {currentPage}
                </button>
                <button
                  onClick={() => setCurrentPage(p => {
                    const totalPages = Math.max(1, Math.ceil(instructors.length / pageSize));
                    return Math.min(totalPages, p + 1);
                  })}
                  disabled={currentPage >= Math.max(1, Math.ceil(instructors.length / pageSize))}
                  className={`px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 ${currentPage >= Math.max(1, Math.ceil(instructors.length / pageSize)) ? 'cursor-not-allowed disabled:opacity-50' : ''}`}
                >
                  Next
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BatchManagement;