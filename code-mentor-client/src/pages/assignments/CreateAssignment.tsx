// @ts-nocheck
import React from 'react';
import Card from '../../components/ui/Card';
import { ArrowLeftIcon, PlusIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
const CreateAssignment = () => {
  return <div className="w-full">
      <div className="mb-6">
        <Link to="/assignments" className="inline-flex items-center text-[#0D47A1] mb-4">
          <ArrowLeftIcon size={16} className="mr-1" />
          Back to Assignments
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          Create New Assignment
        </h1>
        <p className="text-gray-500">
          Fill in the details to create a new programming assignment
        </p>
      </div>
      <Card>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignment Title
              </label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent" placeholder="e.g., Python Data Structures" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Programming Language
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent">
                <option>Python</option>
                <option>JavaScript</option>
                <option>Java</option>
                <option>C++</option>
                <option>SQL</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty Level
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
                <option>Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Time
              </label>
              <input type="time" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent" />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign To
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent">
              <option>All Students</option>
              <option>Batch A</option>
              <option>Batch B</option>
              <option>Batch C</option>
              <option>Custom Group</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instructions
            </label>
            <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent" rows={6} placeholder="Provide clear instructions for the assignment..."></textarea>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attachments
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <div className="flex justify-center mb-2">
                <PlusIcon size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-xs text-gray-400">
                PDF, ZIP, PY, JS, JAVA, CPP files (Max 10MB)
              </p>
              <input type="file" className="hidden" multiple />
              <button type="button" className="mt-4 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium">
                Browse Files
              </button>
            </div>
          </div>
          <div className="mb-6 space-y-4">
            <div className="flex items-center">
              <input type="checkbox" id="ai-evaluation" className="h-4 w-4 text-[#0D47A1] focus:ring-[#0D47A1] border-gray-300 rounded" />
              <label htmlFor="ai-evaluation" className="ml-2 block text-sm text-gray-700">
                Enable AI-generated evaluation program
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="plagiarism" className="h-4 w-4 text-[#0D47A1] focus:ring-[#0D47A1] border-gray-300 rounded" />
              <label htmlFor="plagiarism" className="ml-2 block text-sm text-gray-700">
                Enable plagiarism detection
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Save as Draft
            </button>
            <button type="submit" className="px-4 py-2 bg-[#0D47A1] text-white rounded-md hover:bg-blue-800">
              Create Assignment
            </button>
          </div>
        </form>
      </Card>
    </div>;
};
export default CreateAssignment;