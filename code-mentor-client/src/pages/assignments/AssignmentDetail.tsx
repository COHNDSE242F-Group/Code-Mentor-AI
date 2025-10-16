// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { ArrowLeftIcon } from 'lucide-react';
const AssignmentDetail = () => {
  return <div className="w-full">
      <div className="mb-6">
        <Link to="/assignments" className="inline-flex items-center text-[#0D47A1] mb-4">
          <ArrowLeftIcon size={16} className="mr-1" />
          Back to Assignments
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Assignment Details</h1>
        <p className="text-gray-500">View and manage assignment details</p>
      </div>
      <Card>
        <div className="text-center py-8">
          <h2 className="text-xl font-medium text-gray-600">
            Assignment details will be displayed here
          </h2>
          <p className="text-gray-500 mt-2">
            This is a placeholder for the assignment detail view
          </p>
        </div>
      </Card>
    </div>;
};
export default AssignmentDetail;