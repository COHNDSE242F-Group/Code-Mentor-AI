import React, { useState } from "react";
import { SaveIcon, TrashIcon, PlusIcon } from "lucide-react";

interface StudentRow {
  id: number;
  name: string;
  username: string;
  password: string;
  email: string;
  batch: string;
  enrolled: string;
  status: string;
}

const AddStudent: React.FC = () => {
  const [students, setStudents] = useState<StudentRow[]>([
    {
      id: 1,
      name: "",
      username: "",
      password: "",
      email: "",
      batch: "",
      enrolled: "",
      status: "Active",
    },
  ]);

  // Add new empty row
  const addRow = () => {
    setStudents([
      ...students,
      {
        id: students.length + 1,
        name: "",
        username: "",
        password: "",
        email: "",
        batch: "",
        enrolled: "",
        status: "Active",
      },
    ]);
  };

  // Delete specific row
  const deleteRow = (id: number) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  // Update cell value
  const handleChange = (id: number, field: keyof StudentRow, value: string) => {
    setStudents(
      students.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      )
    );
  };

  // Save data to backend (loop one by one)
  const handleSave = async () => {
    try {
      for (const student of students) {
        const response = await fetch("http://localhost:8000/student/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Include JWT token if your backend requires admin login
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            username: student.username,
            password: student.password,
            student_name: student.name,
            email: student.email,
            contact_no: null,  // optional field
            index_no: null,    // optional field
            batch_id: parseInt(student.batch) || 1, // adjust as needed
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Error saving student");
        }
      }

      alert("All students saved successfully!");
      setStudents([
        {
          id: 1,
          name: "",
          username: "",
          password: "",
          email: "",
          batch: "",
          enrolled: "",
          status: "Active",
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save students.");
    }
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Add Students</h1>
      <p className="text-gray-500 mb-6">
        Use the table below to add multiple students at once.
      </p>

      <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                NAME
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                USERNAME
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                PASSWORD
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                EMAIL
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                BATCH (ID)
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                ENROLLED
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                STATUS
              </th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-2 px-4">
                  <input
                    value={student.name}
                    onChange={(e) =>
                      handleChange(student.id, "name", e.target.value)
                    }
                    className="border rounded-md px-2 py-1 w-full"
                    placeholder="Name"
                  />
                </td>
                <td className="py-2 px-4">
                  <input
                    value={student.username}
                    onChange={(e) =>
                      handleChange(student.id, "username", e.target.value)
                    }
                    className="border rounded-md px-2 py-1 w-full"
                    placeholder="Username"
                  />
                </td>
                <td className="py-2 px-4">
                  <input
                    type="password"
                    value={student.password}
                    onChange={(e) =>
                      handleChange(student.id, "password", e.target.value)
                    }
                    className="border rounded-md px-2 py-1 w-full"
                    placeholder="Password"
                  />
                </td>
                <td className="py-2 px-4">
                  <input
                    value={student.email}
                    onChange={(e) =>
                      handleChange(student.id, "email", e.target.value)
                    }
                    className="border rounded-md px-2 py-1 w-full"
                    placeholder="Email"
                  />
                </td>
                <td className="py-2 px-4">
                  <input
                    value={student.batch}
                    onChange={(e) =>
                      handleChange(student.id, "batch", e.target.value)
                    }
                    className="border rounded-md px-2 py-1 w-full"
                    placeholder="Batch ID"
                  />
                </td>
                <td className="py-2 px-4">
                  <input
                    type="date"
                    value={student.enrolled}
                    onChange={(e) =>
                      handleChange(student.id, "enrolled", e.target.value)
                    }
                    className="border rounded-md px-2 py-1 w-full"
                  />
                </td>
                <td className="py-2 px-4">
                  <select
                    value={student.status}
                    onChange={(e) =>
                      handleChange(student.id, "status", e.target.value)
                    }
                    className="border rounded-md px-2 py-1 w-full"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => deleteRow(student.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={addRow}
          className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <PlusIcon size={16} className="mr-2" />
          Add Row
        </button>

        <button
          onClick={handleSave}
          className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          <SaveIcon size={16} className="mr-2" />
          Save All
        </button>
      </div>
    </div>
  );
};

export default AddStudent;
