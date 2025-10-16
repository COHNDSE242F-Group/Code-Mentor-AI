import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SunIcon, MoonIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { OnboardingSteps } from '../wizard/OnboardingSteps';
export const OnboardingLayout: React.FC = () => {
  const {
    theme,
    toggleTheme
  } = useTheme();
  const location = useLocation();
  // Don't show steps on the dashboard
  const showSteps = !location.pathname.includes('/dashboard');
  return <div className={`min-h-screen w-full ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className="w-full border-b py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <img src="https://placehold.co/200x40/3B82F6/FFFFFF?text=CodeMentorAI" alt="CodeMentorAI Logo" className="h-8" />
        </div>
        <button onClick={toggleTheme} className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-700'}`}>
          {theme === 'dark' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
        </button>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {showSteps && <OnboardingSteps />}
        <div className="mt-8">
          <Outlet />
        </div>
      </main>
      <footer className={`py-6 px-4 border-t ${theme === 'dark' ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
          <p>
            © {new Date().getFullYear()} CodeMentorAI. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-500">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-500">
              Terms of Service
            </a>
            <a href="#" className="hover:text-blue-500">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>;
};