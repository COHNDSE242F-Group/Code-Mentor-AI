import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Card from "../../components/ui/Card";
import { ArrowLeftIcon } from "lucide-react";

type Assignment = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  createdBy: string;
};

const AssignmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);

      fetch(`http://localhost:8000/assignments/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch assignment");
          }
          return res.json();
        })
        .then((data: Assignment) => {
          setAssignment(data);
        })
        .catch((err) => {
          console.error(err);
          setError("Unable to load assignment details");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  return (
    <div className="w-full">
      <div className="mb-6">
        <Link
          to="/assignments"
          className="inline-flex items-center text-[#0D47A1] mb-4"
        >
          <ArrowLeftIcon size={16} className="mr-1" />
          Back to Assignments
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Assignment Details</h1>
        <p className="text-gray-500">View and manage assignment details</p>
      </div>

      <Card>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : assignment ? (
          <div className="py-6 px-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {assignment.title}
            </h2>
            <p className="text-gray-600 mb-4">{assignment.description}</p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>
                <strong>Due Date:</strong> {assignment.dueDate}
              </p>
              <p>
                <strong>Created By:</strong> {assignment.createdBy}
              </p>
              <p>
                <strong>ID:</strong> {assignment.id}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-red-500">
            Assignment not found
          </div>
        )}
      </Card>
    </div>
  );
};

export default AssignmentDetail;