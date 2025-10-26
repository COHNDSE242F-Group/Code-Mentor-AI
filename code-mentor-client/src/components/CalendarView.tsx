import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type CalendarViewProps = {
  deadlines: { assignment_name: string; due_date: string }[];
};

const CalendarView: React.FC<CalendarViewProps> = ({ deadlines }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAssignments, setSelectedAssignments] = useState<string[]>([]);

  const tileContent = ({ date }: { date: Date }) => {
    const formattedDate = date.toISOString().split('T')[0];
    const matchingDeadlines = deadlines.filter(
      (deadline) => new Date(deadline.due_date).toISOString().split('T')[0] === formattedDate
    );

    return matchingDeadlines.length > 0 ? (
      <div className="text-xs text-blue-500">
        {matchingDeadlines.map((deadline, i) => (
          <div key={i}>{deadline.assignment_name.split(' ')[0]}</div> 
        ))}
      </div>
    ) : null;
  };

  const handleDateClick = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    const matchingDeadlines = deadlines.filter(
      (deadline) => new Date(deadline.due_date).toISOString().split('T')[0] === formattedDate
    );

    setSelectedDate(date);
    setSelectedAssignments(matchingDeadlines.map((deadline) => deadline.assignment_name));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Calendar View</h2>
      <Calendar
        tileContent={tileContent}
        onClickDay={handleDateClick} // Handle date click
      />
      {selectedDate && (
        <div className="mt-4">
          <h3 className="text-md font-bold text-gray-800">
            Assignments Due on {selectedDate.toLocaleDateString()}:
          </h3>
          <ul className="list-disc pl-5">
            {selectedAssignments.map((assignment, i) => (
              <li key={i} className="text-sm text-gray-600">
                {assignment}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CalendarView;