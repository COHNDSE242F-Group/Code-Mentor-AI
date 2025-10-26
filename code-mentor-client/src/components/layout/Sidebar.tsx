import React from 'react';
import { Link, useLocation,useNavigate} from 'react-router-dom';
import { LayoutDashboardIcon, FileTextIcon, SendIcon, UsersIcon, BarChartIcon, MessageSquareIcon, SettingsIcon, LogOutIcon } from 'lucide-react';
const Sidebar = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const navItems = [{
    icon: <LayoutDashboardIcon size={20} />,
    label: 'Dashboard',
    path: '/dashboard'
  }, {
    icon: <FileTextIcon size={20} />,
    label: 'Assignments',
    path: '/assignments'
  }, {
    icon: <SendIcon size={20} />,
    label: 'Submissions',
    path: '/submissions'
  }, {
    icon: <UsersIcon size={20} />,
    label: 'Batches',
    path: '/batches'
  }, {
    icon: <BarChartIcon size={20} />,
    label: 'Reports',
    path: '/reports'
  }, {
    icon: <MessageSquareIcon size={20} />,
    label: 'Messaging',
    path: '/messaging'
  }, {
    icon: <SettingsIcon size={20} />,
    label: 'Settings',
    path: '/account'
  }];
  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear auth token
    navigate('/'); // Navigate to home
  };
  return <div className="w-64 bg-[#0D47A1] text-white flex flex-col h-full">
      <div className="p-5">
        <h1 className="text-xl font-bold flex items-center">
          <span className="bg-[#FFC107] text-[#0D47A1] p-1 rounded mr-2">
            CM
          </span>
          CodeMentorAI
        </h1>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4">
          {navItems.map((item, index) => <Link key={index} to={item.path} className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${isActive(item.path) ? 'bg-white bg-opacity-10 text-white' : 'text-gray-300 hover:bg-white hover:bg-opacity-5'}`}>
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </Link>)}
        </nav>
      </div>
      <div className="p-4 border-t border-blue-800">
        <button
          onClick={handleLogout}
          className="flex items-center text-gray-300 hover:text-white w-full px-4 py-2"
        >
          <LogOutIcon size={20} className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>;
};
export default Sidebar;