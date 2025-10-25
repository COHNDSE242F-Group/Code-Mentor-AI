
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIcon, UsersIcon, BookOpenIcon, ServerIcon, CreditCardIcon, SettingsIcon, BellIcon, LogOutIcon, ChevronDownIcon, SearchIcon, BarChartIcon, PlusIcon, CalendarIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
export const Dashboard: React.FC = () => {
  const {
    theme,
    toggleTheme
  } = useTheme();
  const navigate = useNavigate();
  // Mock data - in a real app, this would come from an API
  const stats = {
    activeInstructors: 12,
    activeStudents: 247,
    coursesCreated: 18,
    storageUsed: '87 GB',
    storageLimit: '200 GB'
  };
  const recentActivity = [{
    id: 1,
    type: 'instructor_joined',
    name: 'Dr. Sarah Johnson',
    date: '2 hours ago'
  }, {
    id: 2,
    type: 'course_created',
    name: 'Introduction to Python',
    date: '1 day ago'
  }, {
    id: 3,
    type: 'student_joined',
    name: '15 new students',
    date: '2 days ago'
  }, {
    id: 4,
    type: 'assignment_created',
    name: 'Data Structures Assignment',
    date: '3 days ago'
  }];
  return <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 w-64 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg hidden md:block`}>
          <div className="p-6">
            <img src="https://placehold.co/200x40/3B82F6/FFFFFF?text=CodeMentorAI" alt="CodeMentorAI Logo" className="h-8" />
          </div>
          <nav className="mt-6">
            <div className={`px-6 py-2 text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
              Main
            </div>
            <a href="#" className={`flex items-center px-6 py-3 ${theme === 'dark' ? 'text-white bg-gray-700' : 'text-gray-900 bg-gray-100'}`}>
              <BarChartIcon size={18} className="mr-3" />
              Dashboard
            </a>
            <a href="#" className={`flex items-center px-6 py-3 ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
              <UserIcon size={18} className="mr-3" />
              Instructors
            </a>
            <a href="#" className={`flex items-center px-6 py-3 ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
              <UsersIcon size={18} className="mr-3" />
              Students
            </a>
            <a href="#" className={`flex items-center px-6 py-3 ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
              <BookOpenIcon size={18} className="mr-3" />
              Courses
            </a>
            <div className={`mt-6 px-6 py-2 text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
              Account
            </div>
            <a href="#" onClick={() => navigate('/billing')} className={`flex items-center px-6 py-3 ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
              <CreditCardIcon size={18} className="mr-3" />
              Billing
            </a>
            <a href="#" className={`flex items-center px-6 py-3 ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
              <SettingsIcon size={18} className="mr-3" />
              Settings
            </a>
          </nav>
          <div className="absolute bottom-0 w-full p-4">
            <button onClick={toggleTheme} className={`w-full flex items-center justify-center py-2 px-4 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </aside>
        {/* Main content */}
        <div className="md:ml-64 flex-1">
          <header className={`py-4 px-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm flex justify-between items-center`}>
            <div className="flex items-center md:hidden">
              <img src="https://placehold.co/200x40/3B82F6/FFFFFF?text=CodeMentorAI" alt="CodeMentorAI Logo" className="h-8" />
            </div>
            <div className="flex-1 max-w-lg mx-4 hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon size={18} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                </div>
                <input type="text" placeholder="Search..." className={`pl-10 block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative">
                <BellIcon size={20} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <div className="relative">
                <button className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    SU
                  </div>
                  <span className="hidden md:inline-block">
                    Stanford University
                  </span>
                  <ChevronDownIcon size={16} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} />
                </button>
              </div>
            </div>
          </header>
          <main className="p-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">University Dashboard</h1>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Welcome back to your CodeMentorAI University Portal
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Active Instructors
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {stats.activeInstructors}
                    </h3>
                  </div>
                  <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                    <UserIcon size={20} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-500 mr-1">+2</span>
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    since last month
                  </span>
                </div>
              </div>
              <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Active Students
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {stats.activeStudents}
                    </h3>
                  </div>
                  <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-600'}`}>
                    <UsersIcon size={20} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-500 mr-1">+15</span>
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    since last month
                  </span>
                </div>
              </div>
              <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Courses Created
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {stats.coursesCreated}
                    </h3>
                  </div>
                  <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-purple-900 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                    <BookOpenIcon size={20} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-500 mr-1">+3</span>
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    since last month
                  </span>
                </div>
              </div>
              <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Storage Used
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {stats.storageUsed}
                    </h3>
                  </div>
                  <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-yellow-900 text-yellow-400' : 'bg-yellow-100 text-yellow-600'}`}>
                    <ServerIcon size={20} />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>
                      {stats.storageUsed} of {stats.storageLimit}
                    </span>
                    <span>43%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div className="h-2 rounded-full bg-yellow-500" style={{
                    width: '43%'
                  }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={`lg:col-span-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Recent Activity</h2>
                </div>
                <div className="divide-y">
                  {recentActivity.map(activity => <div key={activity.id} className="p-6 flex items-start">
                      <div className={`p-2 rounded-full mr-4 ${activity.type === 'instructor_joined' ? theme === 'dark' ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600' : activity.type === 'course_created' ? theme === 'dark' ? 'bg-purple-900 text-purple-400' : 'bg-purple-100 text-purple-600' : activity.type === 'student_joined' ? theme === 'dark' ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-600' : theme === 'dark' ? 'bg-yellow-900 text-yellow-400' : 'bg-yellow-100 text-yellow-600'}`}>
                        {activity.type === 'instructor_joined' && <UserIcon size={18} />}
                        {activity.type === 'course_created' && <BookOpenIcon size={18} />}
                        {activity.type === 'student_joined' && <UsersIcon size={18} />}
                        {activity.type === 'assignment_created' && <BookOpenIcon size={18} />}
                      </div>
                      <div>
                        <p className="font-medium">{activity.name}</p>
                        <div className="flex items-center mt-1">
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {activity.type === 'instructor_joined' && 'New instructor joined'}
                            {activity.type === 'course_created' && 'New course created'}
                            {activity.type === 'student_joined' && 'Students joined'}
                            {activity.type === 'assignment_created' && 'New assignment created'}
                          </p>
                          <span className={`mx-2 text-sm ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`}>
                            •
                          </span>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {activity.date}
                          </p>
                        </div>
                      </div>
                    </div>)}
                </div>
              </div>
              <div>
                <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'} mb-6`}>
                  <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">Subscription</h2>
                      <button onClick={() => navigate('/billing')} className={`text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                        Manage
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-100'}`}>
                      <div className="flex items-start">
                        <div className={`p-2 rounded-full mr-3 ${theme === 'dark' ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                          <CreditCardIcon size={18} />
                        </div>
                        <div>
                          <h3 className="font-medium">Standard Plan</h3>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            $999/month
                          </p>
                          <div className="mt-2 flex items-center">
                            <CalendarIcon size={14} className={`mr-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              Renews on Dec 1, 2023
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Instructors
                        </span>
                        <span className="text-sm font-medium">12/15</span>
                      </div>
                      <div className={`w-full h-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div className="h-2 rounded-full bg-blue-500" style={{
                        width: '80%'
                      }}></div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Students
                        </span>
                        <span className="text-sm font-medium">247/500</span>
                      </div>
                      <div className={`w-full h-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div className="h-2 rounded-full bg-green-500" style={{
                        width: '49%'
                      }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold">Quick Actions</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <button className={`w-full flex items-center p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>
                      <PlusIcon size={18} className="mr-2" />
                      Add New Instructor
                    </button>
                    <button className={`w-full flex items-center p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>
                      <PlusIcon size={18} className="mr-2" />
                      Create New Course
                    </button>
                    <button onClick={() => navigate('/account-setup')} className={`w-full flex items-center p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>
                      <UsersIcon size={18} className="mr-2" />
                      Invite Students
                    </button>
                    <button className={`w-full flex items-center p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>
                      <SettingsIcon size={18} className="mr-2" />
                      Account Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>;
};