import React, { useState } from 'react';
import Card from '../components/ui/Card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { DownloadIcon, CalendarIcon, FilterIcon } from 'lucide-react';

// ✅ Define TypeScript interfaces for each dataset
interface PerformanceDatum {
  name: string;
  completed: number;
  average: number;
  passing: number;
}

interface SubmissionTrend {
  name: string;
  onTime: number;
  late: number;
  missed: number;
}

interface BatchComparison {
  name: string;
  score: number;
}

interface PlagiarismDatum {
  name: string;
  value: number;
}

interface Student {
  id: number;
  name: string;
  batch: string;
  avgScore: number;
}

const Reports: React.FC = () => {
  const [reportPeriod, setReportPeriod] = useState<'week' | 'month' | 'semester'>('month');

  const performanceData: PerformanceDatum[] = [
    { name: 'Python', completed: 85, average: 78, passing: 72 },
    { name: 'JavaScript', completed: 75, average: 72, passing: 65 },
    { name: 'Java', completed: 65, average: 68, passing: 58 },
    { name: 'C++', completed: 55, average: 65, passing: 48 },
    { name: 'SQL', completed: 45, average: 80, passing: 40 },
  ];

  const submissionTrends: SubmissionTrend[] = [
    { name: 'Week 1', onTime: 40, late: 5, missed: 2 },
    { name: 'Week 2', onTime: 38, late: 7, missed: 3 },
    { name: 'Week 3', onTime: 42, late: 3, missed: 1 },
    { name: 'Week 4', onTime: 35, late: 8, missed: 5 },
    { name: 'Week 5', onTime: 37, late: 6, missed: 4 },
    { name: 'Week 6', onTime: 45, late: 2, missed: 0 },
  ];

  const batchComparisonData: BatchComparison[] = [
    { name: 'Batch A', score: 78 },
    { name: 'Batch B', score: 72 },
    { name: 'Batch C', score: 85 },
    { name: 'Advanced Python', score: 90 },
  ];

  const plagiarismData: PlagiarismDatum[] = [
    { name: 'Original', value: 75 },
    { name: 'Suspicious', value: 15 },
    { name: 'Plagiarized', value: 10 },
  ];

  const COLORS = ['#0D47A1', '#FFC107', '#FF5252'];

  const topPerformers: Student[] = [
    { id: 1, name: 'Emily Chen', batch: 'Advanced Python', avgScore: 98 },
    { id: 2, name: 'James Smith', batch: 'Batch C', avgScore: 96 },
    { id: 3, name: 'Sarah Williams', batch: 'Batch A', avgScore: 94 },
    { id: 4, name: 'Michael Brown', batch: 'Batch C', avgScore: 92 },
    { id: 5, name: 'Alex Johnson', batch: 'Batch A', avgScore: 91 },
  ];

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
        <p className="text-gray-500">View performance metrics and generate reports</p>
      </div>

      {/* Report Period Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex space-x-2">
          {(['week', 'month', 'semester'] as const).map((period) => (
            <button
              key={period}
              className={`px-4 py-2 rounded-md ${
                reportPeriod === period
                  ? 'bg-[#0D47A1] text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setReportPeriod(period)}
            >
              {period[0].toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700">
            <CalendarIcon size={16} className="mr-2" />
            Oct 1 - Oct 31, 2023
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700">
            <FilterIcon size={16} className="mr-2" />
            Filters
          </button>
          <button className="flex items-center px-4 py-2 bg-[#0D47A1] text-white rounded-md hover:bg-blue-800">
            <DownloadIcon size={16} className="mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Charts + Top Performers Table (rest of your JSX unchanged, just typed data) */}
      {/* ... */}
    </div>
  );
};

export default Reports;