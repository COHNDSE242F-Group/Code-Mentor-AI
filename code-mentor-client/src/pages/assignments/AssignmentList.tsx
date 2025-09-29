import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { PlusIcon, SearchIcon, FilterIcon, MoreHorizontalIcon } from 'lucide-react';
const AssignmentList = () => {
  const assignments = [{
    id: 1,
    title: 'Python Data Structures',
    batch: 'Batch A',
    dueDate: 'Oct 14, 2023',
    status: 'Active',
    submissions: 18,
    gradingProgress: 5
  }, {
    id: 2,
    title: 'JavaScript DOM Manipulation',
    batch: 'Batch B',
    dueDate: 'Oct 15, 2023',
    status: 'Active',
    submissions: 12,
    gradingProgress: 0
  }, {
    id: 3,
    title: 'SQL Advanced Joins',
    batch: 'Batch C',
    dueDate: 'Oct 18, 2023',
    status: 'Draft',
    submissions: 0,
    gradingProgress: 0
  }, {
    id: 4,
    title: 'Java Inheritance',
    batch: 'Batch A',
    dueDate: 'Oct 20, 2023',
    status: 'Scheduled',
    submissions: 0,
    gradingProgress: 0
  }, {
    id: 5,
    title: 'C++ Pointers and Memory Management',
    batch: 'Batch B',
    dueDate: 'Oct 10, 2023',
    status: 'Closed',
    submissions: 15,
    gradingProgress: 15
  }];
  return <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Assignments</h1>
          <p className="text-gray-500">
            Manage all your programming assignments
          </p>
        </div>
        <Link to="/assignments/create" className="inline-flex items-center px-4 py-2 bg-[#0D47A1] text-white rounded-md hover:bg-blue-800">
          <PlusIcon size={16} className="mr-2" />
          Create Assignment
        </Link>
      </div>
      <Card>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <input type="text" placeholder="Search assignments..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent" />
            <SearchIcon size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700">
              <FilterIcon size={16} className="mr-2" />
              Filters
            </button>
            <select className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700">
              <option>All Batches</option>
              <option>Batch A</option>
              <option>Batch B</option>
              <option>Batch C</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Draft</option>
              <option>Scheduled</option>
              <option>Closed</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  TITLE
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  BATCH
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  DUE DATE
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  STATUS
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  SUBMISSIONS
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                  GRADING
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500"></th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(assignment => <tr key={assignment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <Link to={`/assignments/${assignment.id}`} className="font-medium text-[#0D47A1] hover:underline">
                      {assignment.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-sm">{assignment.batch}</td>
                  <td className="py-3 px-4 text-sm">{assignment.dueDate}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${assignment.status === 'Active' ? 'bg-green-100 text-green-800' : assignment.status === 'Draft' ? 'bg-gray-100 text-gray-800' : assignment.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {assignment.submissions}
                  </td>
                  <td className="py-3 px-4">
                    {assignment.submissions > 0 && <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-[#0D47A1] h-2 rounded-full" style={{
                    width: `${assignment.gradingProgress / assignment.submissions * 100}%`
                  }}></div>
                      </div>}
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-gray-500 hover:text-gray-700">
                      <MoreHorizontalIcon size={18} />
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">
            Showing 1-5 of 5 assignments
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>;
};
export default AssignmentList;