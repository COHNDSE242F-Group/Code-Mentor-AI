// src/pages/AssignmentGeneratorPage.tsx
import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../utils/auth";
import Card from "../../components/ui/Card";
import { Link } from "react-router-dom";

/* --------------------
   Types
   -------------------- */
type Batch = {
  batch_id: number;
  batch_name?: string;
};

type Topic = {
  id: number;
  name: string;
  completed?: boolean;
};

type Concept = {
  id: number;
  name: string;
  topics: Topic[];
  description?: string;
  topic_count?: number;
  completed_count?: number;
};

type GeneratedAssignment = any; // AI output has variable shape; treated as any but we access defensively

/* --------------------
   Component
   -------------------- */
const AssignmentGeneratorPage: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<number | "">("");
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [loadingConcepts, setLoadingConcepts] = useState(false);
  const [fetchConceptsError, setFetchConceptsError] = useState<string | null>(null);

  // selected topics tracked as keys "conceptId:topicId"
  const [selectedTopics, setSelectedTopics] = useState<Record<string, boolean>>({});

  const [optionalDescription, setOptionalDescription] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("Medium");

  // generation / AI states
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generatedAssignment, setGeneratedAssignment] = useState<GeneratedAssignment | null>(null);
  const [assignmentDetails, setAssignmentDetails] = useState<any | null>(null);

  // finalize / add assignment
  const [dueDate, setDueDate] = useState<string>("");
  const [dueTime, setDueTime] = useState<string>("");
  const [adding, setAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);

  const [showConceptModal, setShowConceptModal] = useState(false);
  const [conceptName, setConceptName] = useState('');
  const [conceptDescription, setConceptDescription] = useState('');
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [generatedTopics, setGeneratedTopics] = useState<string[]>([]);

  // Load batches when component mounts
  useEffect(() => {
    const loadBatches = async () => {
      try {
        const res = await fetchWithAuth("http://localhost:8000/batch", { method: "GET" });
        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(`Failed to load batches: ${res.status} ${t}`);
        }
        const data = await res.json();
        // data might be array or object; normalize to array
        const arr = Array.isArray(data) ? data : data?.batches ?? [];
        setBatches(arr);
      } catch (err: any) {
        console.error("Error loading batches", err);
        setBatches([]);
      }
    };

    loadBatches();
  }, []);

  // When a batch is selected -> fetch concepts for that batch
  useEffect(() => {
    if (!selectedBatch) {
      setConcepts([]);
      return;
    }

    const loadConcepts = async () => {
      setLoadingConcepts(true);
      setFetchConceptsError(null);
      setConcepts([]);
      try {
        const url = `http://localhost:8000/assignment_generate/concept?batch_id=${selectedBatch}`;
        let res = await fetchWithAuth(url, { method: "GET" });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Failed to load concepts: ${res.status} ${txt}`);
        }

        const data = await res.json();
        const rawConcepts = data?.concepts ?? [];

        // normalize concepts defensively
        const normalized: Concept[] = rawConcepts.map((c: any) => ({
          id: Number(c.id),
          name: String(c.name ?? "Untitled"),
          topics: Array.isArray(c.topics)
            ? c.topics.map((t: any) => ({
                id: Number(t.id),
                name: String(t.name ?? ""),
                completed: !!t.completed,
              }))
            : [],
          description: c.description,
          topic_count: c.topic_count,
          completed_count: c.completed_count,
        }));

        setConcepts(normalized);
        setSelectedTopics({});
      } catch (err: any) {
        console.error("Error fetching concepts", err);
        setFetchConceptsError(err.message || "Failed to fetch concepts");
      } finally {
        setLoadingConcepts(false);
      }
    };

    loadConcepts();
  }, [selectedBatch]);

  // Toggle topic selection
  const toggleTopic = (conceptId: number, topicId: number) => {
    const key = `${conceptId}:${topicId}`;
    setSelectedTopics((prev) => {
      const copy = { ...prev };
      if (copy[key]) {
        delete copy[key];
      } else {
        copy[key] = true;
      }
      return copy;
    });
  };

  // Build payload and call AI generation endpoint
  const handleGenerate = async () => {
    setGenerationError(null);
    setGeneratedAssignment(null);

    if (!selectedBatch) {
      setGenerationError("Please choose a batch first.");
      return;
    }

    const selected = Object.keys(selectedTopics).map((k) => {
      const [conceptIdStr, topicIdStr] = k.split(":");
      return {
        concept_id: Number(conceptIdStr),
        topic_id: Number(topicIdStr),
      };
    });

    if (selected.length === 0) {
      setGenerationError("Please select at least one topic before generating.");
      return;
    }

    const payload = {
      batch_id: selectedBatch,
      selected_topics: selected,
      description: optionalDescription || undefined,
      selected_difficulty: selectedDifficulty,
    };

    setGenerating(true);
    try {
      // primary endpoint
      let res = await fetchWithAuth("http://localhost:8000/assignment_generate/generate", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`AI generation failed: ${res.status} ${txt}`);
      }

      const data = await res.json();
      
      setGeneratedAssignment(data.assignment);
      setAssignmentDetails(data.input);
    } catch (err: any) {
      console.error("Generation error", err);
      setGenerationError(err.message || "Failed to generate assignment");
    } finally {
      setGenerating(false);
    }
  };

  // Regenerate uses same selected topics & description
  const handleRegenerate = async () => {
    setGeneratedAssignment(null);
    await handleGenerate();
  };

  // Add (create) assignment on server
  const handleAddAssignment = async () => {
    setAddError(null);
    setAddSuccess(null);

    if (!generatedAssignment) {
      setAddError("No generated assignment to add.");
      return;
    }

    // Build body by merging generated assignment with selected batch/due date/time
    const body: any = {
      assignment_name: generatedAssignment.assignment_name, // from AI generation
      description: generatedAssignment,                     // the whole generated object
      due_date: dueDate,                                    // e.g. "2025-11-30"
      due_time: dueTime,                                    // e.g. "18:00:00"
      difficulty: assignmentDetails.selected_difficulty,     // from AssignmentDetails
      instructor_id: 2,                                     // example — from logged-in user
      batch_id: assignmentDetails.batch_id
    };

    setAdding(true);
    try {
      const res = await fetchWithAuth("http://localhost:8000/assignment", {
        method: "POST",
        body: JSON.stringify({assignment: body, assignment_topics: assignmentDetails.selected_topics}),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Failed to add assignment: ${res.status} ${txt}`);
      }

      const created = await res.json();
      setAddSuccess(`Assignment created (id: ${created.assignment_id ?? created.id ?? "unknown"})`);
    } catch (err: any) {
      console.error("Add assignment error", err);
      setAddError(err.message || "Failed to add assignment");
    } finally {
      setAdding(false);
    }
  };

  /* --------------------
     Render
     -------------------- */
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">AI Assignment Generator</h1>
          <p className="text-sm text-gray-500 mt-1">
            Select a batch, pick topics, optionally add a description and generate an assignment using AI.
          </p>
        </div>
        <div>
          <Link to="/assignments" className="text-indigo-600 hover:underline">
            Back to assignments
          </Link>
        </div>
      </div>

      <Card>
        <div className="space-y-4">
          {/* Batch selector + optional description + generate */}
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Batch:</label>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value ? Number(e.target.value) : "")}
                className="border px-3 py-2 rounded"
              >
                <option value="">-- choose batch --</option>
                {batches.map((b) => (
                  <option key={b.batch_id} value={b.batch_id}>
                    {b.batch_name ? `${b.batch_name} (${b.batch_id})` : `Batch ${b.batch_id}`}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowConceptModal(true)}
              className="flex items-center gap-2 bg-[#0D47A1] text-white px-4 py-2 rounded-lg shadow hover:bg-[#1565C0] transition-all"
            >
              <span>Add Concept</span>
            </button>

            {/* Difficulty selector */}
            <div className="flex items-center gap-3">
                <label className="text-sm font-medium">Difficulty:</label>
                <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="border px-3 py-2 rounded"
                >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
                </select>
            </div>

            <div className="flex-1">
              <input
                type="text"
                placeholder="Optional assignment description..."
                value={optionalDescription}
                onChange={(e) => setOptionalDescription(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleGenerate}
                disabled={generating || loadingConcepts}
                className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-60"
              >
                {generating ? "Generating..." : "Generate"}
              </button>
              <button
                onClick={() => {
                  // Clear selection and generated assignment
                  setSelectedTopics({});
                  setGeneratedAssignment(null);
                  setGenerationError(null);
                }}
                className="px-4 py-2 bg-gray-100 rounded"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Concepts horizontally scrollable */}
          <div>
            <h3 className="text-sm font-medium mb-2">Concepts & Topics</h3>

            {loadingConcepts ? (
              <div className="py-8 text-center text-gray-500">Loading concepts...</div>
            ) : fetchConceptsError ? (
              <div className="py-6 text-red-600">{fetchConceptsError}</div>
            ) : concepts.length === 0 ? (
              <div className="py-6 text-gray-500">No concepts loaded. Select a batch to load topics.</div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {concepts.map((concept) => (
                  <div
                    key={concept.id}
                    className="min-w-[260px] bg-white border rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-gray-800">{concept.name}</h4>
                      <span className="text-xs text-gray-500">
                        {concept.topic_count ?? concept.topics.length} topics
                      </span>
                    </div>

                    <div className="space-y-2">
                      {concept.topics.map((topic) => {
                        const key = `${concept.id}:${topic.id}`;
                        const isSelected = !!selectedTopics[key];
                        const completed = !!topic.completed;
                        return (
                          <label
                            key={topic.id}
                            className="flex items-center justify-between cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleTopic(concept.id, topic.id)}
                                className="h-4 w-4"
                              />
                              <span
                                className={`text-sm ${
                                  completed ? "text-green-700" : "text-gray-500"
                                }`}
                              >
                                {topic.name}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Generation area */}
          <div>
            <h3 className="text-sm font-medium mb-2">Generated Assignment</h3>

            {generating ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-indigo-600 border-gray-200 mb-4" />
                <div className="text-sm text-gray-600">Generating assignment with AI…</div>
              </div>
            ) : generationError ? (
              <div className="p-4 bg-red-50 text-red-700 rounded">{generationError}</div>
            ) : generatedAssignment ? (
              <div className="p-4 bg-gray-50 border rounded-lg space-y-4">

                {/* Assignment Card */}
                <div className="p-4 bg-white rounded-lg shadow-md space-y-4">
                  {/* Assignment Name & Difficulty */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {generatedAssignment.assignment_name ?? "Generated Assignment"}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Difficulty: {generatedAssignment.difficulty ?? "Not specified"}
                    </p>
                  </div>

                  {/* Description */}
                  {generatedAssignment.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">Description</h3>
                      <p className="text-gray-600 mt-1">{generatedAssignment.description.title}</p>

                      {/* Input/Output Info */}
                      {generatedAssignment.description.io && (
                        <div className="mt-2">
                          <p className="text-gray-600">
                            <span className="font-medium">Input:</span>{" "}
                            {generatedAssignment.description.io.input}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Output:</span>{" "}
                            {generatedAssignment.description.io.output}
                          </p>
                        </div>
                      )}

                      {/* Tasks */}
                      {Array.isArray(generatedAssignment.description.tasks) && (
                        <div className="mt-2">
                          <h4 className="font-medium text-gray-700">Tasks:</h4>
                          <ul className="list-disc list-inside space-y-1 mt-1">
                            {generatedAssignment.description.tasks.map(
                              (task: string, index: number) => (
                                <li key={index} className="text-gray-600 whitespace-pre-line">
                                  {task}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Constraints */}
                  {Array.isArray(generatedAssignment.constraints) &&
                    generatedAssignment.constraints.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700">Constraints</h3>
                        <ul className="list-disc list-inside space-y-1 mt-1 text-gray-600">
                          {generatedAssignment.constraints.map(
                            (constraint: string, idx: number) => (
                              <li key={idx}>{constraint}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {/* Examples */}
                  {Array.isArray(generatedAssignment.examples) &&
                    generatedAssignment.examples.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700">Examples</h3>
                        {generatedAssignment.examples.map(
                          (example: { function: string; output: string }, idx: number) => (
                            <div key={idx} className="mt-2 p-2 bg-gray-100 rounded">
                              <p className="text-gray-700 font-medium">Function:</p>
                              <pre className="bg-gray-200 p-2 rounded overflow-x-auto text-sm">
                                {example.function}
                              </pre>
                              <p className="text-gray-700 font-medium mt-1">Output:</p>
                              <pre className="bg-gray-200 p-2 rounded overflow-x-auto text-sm">
                                {example.output}
                              </pre>
                            </div>
                          )
                        )}
                      </div>
                    )}

                  {/* Regenerate Button */}
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleRegenerate}
                      className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded text-sm"
                    >
                      Regenerate
                    </button>
                  </div>
                </div>

                {/* Footer: Add / Clear / Due Date */}
                <div className="mt-4 border-t pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <label className="text-xs text-gray-600">Due date</label>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="border px-2 py-1 rounded ml-2"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Due time</label>
                      <input
                        type="time"
                        value={dueTime}
                        onChange={(e) => setDueTime(e.target.value)}
                        className="border px-2 py-1 rounded ml-2"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleAddAssignment}
                      disabled={adding}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                    >
                      {adding ? "Adding..." : "Add Assignment"}
                    </button>
                    <button
                      onClick={() => setGeneratedAssignment(null)}
                      className="px-4 py-2 bg-gray-100 rounded"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {addSuccess && <div className="mt-3 text-sm text-green-700">{addSuccess}</div>}
                {addError && <div className="mt-3 text-sm text-red-700">{addError}</div>}
              </div>
            ) : (
              <div className="p-6 text-sm text-gray-500">
                No assignment generated yet. Select topics and click <strong>Generate</strong>.
              </div>
            )}
          </div>
        </div>
      </Card>
      {showConceptModal && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative">
          <button
            onClick={() => {
              setShowConceptModal(false);
              setGeneratedTopics([]);
              setConceptName('');
              setConceptDescription('');
            }}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>

          <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Concept</h2>

          <div className="space-y-3">
            {/* Concept Name */}
            <div>
              <label className="text-sm text-gray-600">Concept Name</label>
              <input
                type="text"
                value={conceptName}
                onChange={(e) => setConceptName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g. Object-Oriented Programming"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm text-gray-600">Description (optional)</label>
              <textarea
                value={conceptDescription}
                onChange={(e) => setConceptDescription(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={3}
                placeholder="Briefly describe this concept..."
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={async () => {
                if (!conceptName.trim()) {
                  alert('Please enter a concept name.');
                  return;
                }

                setLoadingTopics(true);
                setGeneratedTopics([]);

                try {
                  const res = await fetchWithAuth(
                    'http://localhost:8000/report/concept', // Instructor endpoint
                    {
                      method: 'POST',
                      body: JSON.stringify({
                        concept: conceptName,
                        description: conceptDescription,
                        batch_id: selectedBatch, // set in state
                      }),
                    }
                  );

                  if (!res.ok) throw new Error('API request failed');

                  const data = await res.json();

                  // Backend returns { concept, description, topics: [{id, name}, ...] }
                  setGeneratedTopics(data.topics.map((t: any) => t.name));
                } catch (err) {
                  console.error('Error generating topics:', err);
                  alert('Failed to generate topics.');
                } finally {
                  setLoadingTopics(false);
                }
              }}
              disabled={loadingTopics}
              className="bg-[#0D47A1] text-white px-4 py-2 rounded-lg shadow hover:bg-[#1565C0] w-full transition-all"
            >
              {loadingTopics ? 'Generating...' : 'Generate Topics'}
            </button>
          </div>

          {/* Generated Topics Section */}
          <div className="mt-6">
            {loadingTopics ? (
              <div className="flex flex-col items-center justify-center text-gray-500">
                <svg
                  className="animate-spin h-6 w-6 text-[#0D47A1] mb-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                  ></path>
                </svg>
                <span>✨ Generating topics...</span>
              </div>
            ) : generatedTopics.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Generated Topics:</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {generatedTopics.map((topic, index) => (
                    <li key={index}>{topic}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default AssignmentGeneratorPage;