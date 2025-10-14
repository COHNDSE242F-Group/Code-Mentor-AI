import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, SearchIcon } from 'lucide-react';
const TopBar = () => {
  // This would typically come from an auth context or state management
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent" />
            <SearchIcon size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
        <div className="flex items-center">
          {isLoggedIn ? <>
              <button className="p-2 mr-4 rounded-full hover:bg-gray-100 relative">
                <BellIcon size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
              </button>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#0D47A1] flex items-center justify-center text-white mr-2">
                  JD
                </div>
                <span className="font-medium">John Doe</span>
              </div>
            </> : <div className="flex items-center space-x-3">
              <div className="flex flex-col items-end">
                <Link to="#" className="px-4 py-2 text-[#0D47A1] hover:bg-blue-50 rounded-md transition-colors">
                  Log In
                </Link>
                <Link to="#" className="text-xs text-gray-500 hover:text-[#0D47A1] mt-1 mr-1">
                  Forgot password?
                </Link>
              </div>
              <Link to="#" className="px-4 py-2 bg-[#0D47A1] text-white rounded-md hover:bg-blue-700 transition-colors">
                Sign Up
              </Link>
            </div>}
        </div>
      </div>
    </header>;
};
export default TopBar;