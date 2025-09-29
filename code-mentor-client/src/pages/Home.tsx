import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  CheckCircleIcon,
  BookOpenIcon,
  UsersIcon,
  UserIcon,
  GraduationCapIcon,
  CodeIcon,
} from 'lucide-react';

// ✅ Define props for custom icons
interface IconProps {
  size?: number;
  className?: string;
}

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold flex items-center">
                <span className="bg-[#FFC107] text-[#0D47A1] p-1 rounded mr-2">
                  CM
                </span>
                CodeMentorAI
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-[#0D47A1] hover:bg-blue-50 rounded-md transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-[#0D47A1] text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Elevate Your Coding Education with{' '}
            <span className="text-[#0D47A1]">CodeMentorAI</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            An intelligent platform that streamlines assignment creation,
            submission management, and provides AI-powered feedback to help
            students excel in programming.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-3 bg-[#0D47A1] text-white rounded-lg hover:bg-blue-800 transition-colors font-medium flex items-center"
            >
              Get Started
              <ArrowRightIcon size={18} className="ml-2" />
            </Link>
            <a
              href="#learn-more"
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Feature Highlights */}
        <div
          id="learn-more"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <BookOpenIcon size={24} className="text-[#0D47A1]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Smart Assignment Creation
            </h3>
            <p className="text-gray-600">
              Create detailed programming assignments with automated test cases
              and clear evaluation criteria.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <CodeIcon size={24} className="text-[#0D47A1]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI-Powered Evaluation</h3>
            <p className="text-gray-600">
              Get intelligent feedback on code submissions with personalized
              improvement suggestions.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <BarChartIcon size={24} className="text-[#0D47A1]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Comprehensive Analytics
            </h3>
            <p className="text-gray-600">
              Track student progress and identify areas for improvement with
              detailed performance reports.
            </p>
          </div>
        </div>

        {/* Role Selection */}
        {/* ... (I didn’t remove your role cards, they stay the same) ... */}

        {/* Testimonials Section */}
        {/* ... (your testimonials stay the same, with StarIcon, etc.) ... */}

      </section>

      {/* Footer */}
      {/* ... (your footer stays the same, just typed icons) ... */}
    </div>
  );
};

// ✅ Typed custom icons
const StarIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const TwitterIcon: React.FC<IconProps> = ({ size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

// Repeat same typing for LinkedinIcon, GithubIcon, YoutubeIcon, BarChartIcon...

export default Home;