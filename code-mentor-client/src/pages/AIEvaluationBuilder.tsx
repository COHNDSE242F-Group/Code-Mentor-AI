// @ts-nocheck
import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";

// Define the structure of an evaluation (this matches what FastAPI will return later)
interface Evaluation {
  id: number;
  name: string;
  description: string;
}

const AIEvaluationBuilder: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Later connect this to FastAPI backend
    const fetchEvaluations = async () => {
      try {
        // Placeholder for now — replace with your FastAPI endpoint
        const response = await fetch("http://localhost:8000/evaluations");
        if (!response.ok) {
          throw new Error("Failed to fetch evaluations");
        }
        const data: Evaluation[] = await response.json();
        setEvaluations(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, []);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          AI Evaluation Builder
        </h1>
        <p className="text-gray-500">
          Create and manage AI-powered evaluation criteria
        </p>
      </div>

      <Card>
        <div className="py-8">
          {loading ? (
            <p className="text-gray-500 text-center">Loading...</p>
          ) : evaluations.length > 0 ? (
            <ul className="space-y-4">
              {evaluations.map((evalItem) => (
                <li
                  key={evalItem.id}
                  className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <h2 className="text-lg font-semibold">{evalItem.name}</h2>
                  <p className="text-gray-600">{evalItem.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center">
              <h2 className="text-xl font-medium text-gray-600">
                No evaluations yet
              </h2>
              <p className="text-gray-500 mt-2">
                Start by adding new AI evaluation criteria
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AIEvaluationBuilder;