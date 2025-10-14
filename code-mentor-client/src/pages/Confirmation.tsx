// @ts-nocheck
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, CalendarIcon, UsersIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
export const Confirmation: React.FC = () => {
  const {
    theme
  } = useTheme();
  const navigate = useNavigate();
  // In a real app, these would come from your state management
  const universityName = 'Stanford University';
  const plan = {
    name: 'Standard',
    instructorSeats: 15,
    studentSeats: 500,
    renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  };
  return <div className="max-w-3xl mx-auto text-center">
      <div className={`rounded-lg p-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircleIcon size={48} />
        </div>
        <h1 className="text-3xl font-bold mb-2">Welcome {universityName} 🎉</h1>
        <p className={`mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Your subscription has been successfully set up and is now active.
        </p>
        <div className={`rounded-lg p-6 mb-8 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h2 className="text-xl font-semibold mb-4">Subscription Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-3 ${theme === 'dark' ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-medium mb-1">Plan</h3>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {plan.name}
              </p>
            </div>
            <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-3 ${theme === 'dark' ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                <UsersIcon size={20} />
              </div>
              <h3 className="font-medium mb-1">Seats</h3>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {plan.instructorSeats} instructors
                <br />
                {plan.studentSeats} students
              </p>
            </div>
            <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-3 ${theme === 'dark' ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                <CalendarIcon size={20} />
              </div>
              <h3 className="font-medium mb-1">Renewal Date</h3>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {plan.renewalDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <p className="font-medium">What would you like to do next?</p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <button onClick={() => navigate('/account-setup')} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-300">
              Invite Instructors
            </button>
            <button onClick={() => navigate('/dashboard')} className={`py-3 px-6 rounded-md font-medium transition duration-300 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>
              Go to Dashboard
            </button>
          </div>
          <p className={`mt-6 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            A welcome email has been sent to your administrator email with
            further instructions.
          </p>
        </div>
      </div>
    </div>;
};