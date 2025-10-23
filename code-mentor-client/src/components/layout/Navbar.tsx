import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, BookOpenIcon, TrendingUpIcon, MessageCircleIcon, LogOutIcon, MenuIcon, XIcon, SettingsIcon } from 'lucide-react';
const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navItems = [{
    label: 'Home',
    path: '/student-dashboard',
    icon: <HomeIcon size={18} />
  }, {
    label: 'Assignments',
    path: '/assignments',
    icon: <BookOpenIcon size={18} />
  }, {
    label: 'Progress',
    path: '/progress',
    icon: <TrendingUpIcon size={18} />
  }, {
    label: 'Chat Tutor',
    path: '/editor/chat',
    icon: <MessageCircleIcon size={18} />
  }];
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };
  return <nav className="sticky top-0 z-50 bg-slate-800 border-b border-slate-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 mr-2">
                <span className="text-white font-bold text-sm">CM</span>
              </div>
              <span className="text-white font-bold text-lg">CodeMentorAI</span>
            </Link>
          </div>
          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              {navItems.map(item => <Link key={item.path} to={item.path} className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === item.path ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'} transition-colors duration-200`}>
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>)}
            </div>
          </div>
          {/* User profile dropdown */}
          <div className="hidden md:block">
            <div className="relative">
              <button onClick={toggleProfile} className="flex items-center space-x-2 text-slate-300 hover:text-white focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-indigo-500 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">JS</span>
                </div>
              </button>
              {isProfileOpen && <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-slate-800 border border-slate-700 z-50">
                  <div className="py-1">
                    <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white">
                      <span className="mr-2">Profile</span>
                    </Link>
                    <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white">
                      <SettingsIcon size={16} className="mr-2" />
                      <span>Settings</span>
                    </Link>
                    <Link to="/admin" className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white">
                      <span className="mr-2">Admin Panel</span>
                    </Link>
                    <div className="border-t border-slate-700 my-1"></div>
                    <Link to="/login" className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white">
                      <LogOutIcon size={16} className="mr-2" />
                      <span>Logout</span>
                    </Link>
                  </div>
                </div>}
            </div>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none">
              {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map(item => <Link key={item.path} to={item.path} className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${location.pathname === item.path ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'} transition-colors duration-200`} onClick={() => setIsMenuOpen(false)}>
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>)}
            <div className="border-t border-slate-700 my-2"></div>
            <Link to="/profile" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-700 hover:text-white" onClick={() => setIsMenuOpen(false)}>
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-teal-500 to-indigo-500 flex items-center justify-center mr-2">
                <span className="text-white font-medium text-xs">JS</span>
              </div>
              <span>Profile</span>
            </Link>
            <Link to="/login" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-700 hover:text-white" onClick={() => setIsMenuOpen(false)}>
              <LogOutIcon size={18} className="mr-2" />
              <span>Logout</span>
            </Link>
          </div>
        </div>}
    </nav>;
};
export default Navbar;