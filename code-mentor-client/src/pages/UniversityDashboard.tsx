import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIcon, UsersIcon, BookOpenIcon, ServerIcon, CreditCardIcon, SettingsIcon, BellIcon, LogOutIcon, ChevronDownIcon, SearchIcon, BarChartIcon, PlusIcon, CalendarIcon } from 'lucide-react';
import axios from 'axios';

// Import your components
import BatchManagement from './BatchManagement'; // Adjust the path as needed
import AccountDetails from './auth/AccountDetails';

interface University {
  university_id: number;
  university_name: string;
  address: string;
  email: string;
  contact_no: string | null;
}

const UniversityDashboard: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [stats, setStats] = useState({
    activeInstructors: 0,
    activeStudents: 0,
    coursesCreated: 0,
    storageUsed: '0 GB',
    storageLimit: '100 GB',
  });
   const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'instructors' | 'students' | 'courses' | 'billing' | 'settings'>('dashboard');
  const navigate = useNavigate();
  
  const recentActivity = [
    { id: 1, type: 'instructor_joined', name: 'Dr. Alice Smith', date: '2024-10-01' },
    { id: 2, type: 'course_created', name: 'Introduction to AI', date: '2024-09-28' },
    { id: 3, type: 'student_joined', name: 'John Doe and 24 others', date: '2024-09-25' },
    { id: 4, type: 'assignment_created', name: 'Project 1: Chatbot Development', date: '2024-09-20' },
  ];
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token is missing. User might not be logged in.");
          return;
        }

        const response = await axios.get("http://localhost:8000/university-stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);
  
  // Fetch university details and stats
  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token is missing. User might not be logged in.");
          setLoading(false);
          return;
        }

        // Fetch university details
        const universityResponse = await axios.get("http://localhost:8000/university/details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Fetch stats
        const statsResponse = await axios.get("http://localhost:8000/university-stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUniversity(universityResponse.data);
        setStats(statsResponse.data);
      } catch (error) {
        console.error("Error fetching university data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversityData();
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };
 // Get university initials for avatar
  const getUniversityInitials = () => {
    if (!university?.university_name) return 'U';
    return university.university_name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  // Render the active section content
 const renderActiveSection = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading university data...</p>
          </div>
        </div>
      );
    }

switch (activeSection) {
      case 'dashboard':
        return (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">
                {university ? `${university.university_name} Dashboard` : 'University Dashboard'}
              </h1>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Welcome back to your CodeMentorAI University Portal
              </p>
              {university && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Email: </span>
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                      {university.email}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Contact: </span>
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                      {university.contact_no || 'Not provided'}
                    </span>
                  </div>
                  {university.address && (
                    <div className="md:col-span-2">
                      <span className="font-medium">Address: </span>
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                        {university.address}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Active Instructors
                    </p>
                    <h3 className="text-2xl font-bold mt-1">{stats.activeInstructors}</h3>
                  </div>
                  <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                    <UserIcon size={20} />
                  </div>
                </div>
              </div>
              
              <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Active Students
                    </p>
                    <h3 className="text-2xl font-bold mt-1">{stats.activeStudents}</h3>
                  </div>
                  <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-600'}`}>
                    <UsersIcon size={20} />
                  </div>
                </div>
              </div>
              
              <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Courses Created
                    </p>
                    <h3 className="text-2xl font-bold mt-1">{stats.coursesCreated}</h3>
                  </div>
                  <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-purple-900 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                    <BookOpenIcon size={20} />
                  </div>
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
                    <div className="h-2 rounded-full bg-yellow-500" style={{ width: '43%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Subscription and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'} mb-6`}>
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold">University Information</h2>
                  </div>
                  <div className="p-6">
                    {university ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">University Name</label>
                            <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{university.university_name}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                            <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{university.email}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Contact Number</label>
                            <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{university.contact_no || 'Not provided'}</p>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                            <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{university.address}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-center text-gray-500">No university information available</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'} mb-6`}>
                  <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">Subscription</h2>
                      <button onClick={() => setActiveSection('billing')} className={`text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
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
                        <div className="h-2 rounded-full bg-blue-500" style={{ width: '80%' }}></div>
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
                        <div className="h-2 rounded-full bg-green-500" style={{ width: '49%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold">Quick Actions</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <button 
                      onClick={() => setActiveSection('instructors')}
                      className={`w-full flex items-center p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                    >
                      <PlusIcon size={18} className="mr-2" />
                      Add New Instructor/Student/Batch
                    </button>
                    <button 
                      onClick={() => setActiveSection('courses')}
                      className={`w-full flex items-center p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                    >
                      <PlusIcon size={18} className="mr-2" />
                      Create New Course
                    </button>
                    <button   
                      onClick={() => setActiveSection('students')}
                      className={`w-full flex items-center p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                    >
                      <UsersIcon size={18} className="mr-2" />
                      Invite Students
                    </button>
                    <button 
                      onClick={() => setActiveSection('settings')}
                      className={`w-full flex items-center p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                    >
                      <SettingsIcon size={18} className="mr-2" />
                      Account Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      
      case 'instructors':
      case 'students':
        return <BatchManagement />;
      
     
      case 'billing':
        return (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Billing & Subscription</h1>
              <p className="text-gray-500">Manage your subscription and billing information</p>
            </div>
            <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
              <p className="text-center text-gray-500">Billing interface coming soon...</p>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <AccountDetails />
        );
      
      default:
        return (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-500">Welcome to your university portal</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
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
            <button 
              onClick={() => setActiveSection('dashboard')}
              className={`w-full flex items-center px-6 py-3 ${activeSection === 'dashboard' ? (theme === 'dark' ? 'text-white bg-gray-700' : 'text-gray-900 bg-gray-100') : (theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')}`}
            >
              <BarChartIcon size={18} className="mr-3" />
              Dashboard
            </button>
            <button 
              onClick={() => setActiveSection('instructors')}
              className={`w-full flex items-center px-6 py-3 ${activeSection === 'instructors' ? (theme === 'dark' ? 'text-white bg-gray-700' : 'text-gray-900 bg-gray-100') : (theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')}`}
            >
              <UserIcon size={18} className="mr-3" />
              User Management
            </button>
            {/*<button 
              onClick={() => setActiveSection('students')}
              className={`w-full flex items-center px-6 py-3 ${activeSection === 'students' ? (theme === 'dark' ? 'text-white bg-gray-700' : 'text-gray-900 bg-gray-100') : (theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')}`}
            >
              <UsersIcon size={18} className="mr-3" />
              Students
            </button>*/}
            <button
              onClick={() => setActiveSection('courses')}
              className={`w-full flex items-center px-6 py-3 ${activeSection === 'courses' ? (theme === 'dark' ? 'text-white bg-gray-700' : 'text-gray-900 bg-gray-100') : (theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')}`}
            >
              <BookOpenIcon size={18} className="mr-3" />
              Courses
            </button>
            
            <div className={`mt-6 px-6 py-2 text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
              Account
            </div>
            <button 
              onClick={() => setActiveSection('billing')}
              className={`w-full flex items-center px-6 py-3 ${activeSection === 'billing' ? (theme === 'dark' ? 'text-white bg-gray-700' : 'text-gray-900 bg-gray-100') : (theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')}`}
            >
              <CreditCardIcon size={18} className="mr-3" />
              Billing
            </button>
            <button 
              onClick={() => setActiveSection('settings')}
              className={`w-full flex items-center px-6 py-3 ${activeSection === 'settings' ? (theme === 'dark' ? 'text-white bg-gray-700' : 'text-gray-900 bg-gray-100') : (theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')}`}
            >
              <SettingsIcon size={18} className="mr-3" />
              Settings
            </button>
          </nav>
          
          <div className="absolute bottom-16 w-full p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-300 hover:text-white w-full px-4 py-2"
            >
              <LogOutIcon size={20} className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
          
          <div className="absolute bottom-0 w-full p-4">
            <button 
              onClick={toggleTheme} 
              className={`w-full flex items-center justify-center py-2 px-4 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            >
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
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className={`pl-10 block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} 
                />
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
                    {getUniversityInitials()}
                  </div>
                  <span className="hidden md:inline-block">
                    {university ? university.university_name : 'University'}
                  </span>
                  <ChevronDownIcon size={16} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} />
                </button>
              </div>
            </div>
          </header>
          
          <main className="p-6">
            {renderActiveSection()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default UniversityDashboard;