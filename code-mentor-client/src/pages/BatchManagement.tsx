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
  id: number;
  name: string;
  email: string;
  batch: string;
  enrollmentDate: string;
  status: "Active" | "Inactive";
}

const BatchManagement: React.FC = () => {
   const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"batches" | "students">("batches");
  const [batches, setBatches] = useState<Batch[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your FastAPI endpoints
        const [batchesRes, studentsRes] = await Promise.all([
          fetch("http://localhost:8000/batches"),
          fetch("http://localhost:8000/students"),
        ]);

        if (!batchesRes.ok || !studentsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const batchData: Batch[] = await batchesRes.json();
        const studentData: Student[] = await studentsRes.json();

        setBatches(batchData);
        setStudents(studentData);
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
      ) : (
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
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                      NAME
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                      EMAIL
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                      BATCH
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                      ENROLLED
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                      STATUS
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-medium">{student.name}</td>
                      <td className="py-3 px-4 text-sm">{student.email}</td>
                      <td className="py-3 px-4 text-sm">{student.batch}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {student.enrollmentDate}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            student.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-500 hover:text-blue-700">
                            <EditIcon size={16} />
                          </button>
                          <button className="text-red-500 hover:text-red-700">
                            <TrashIcon size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Showing {students.length} students
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 disabled:opacity-50">
                  Previous
                </button>
                <button className="px-3 py-1 bg-[#0D47A1] text-white rounded-md hover:bg-blue-800">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700">
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