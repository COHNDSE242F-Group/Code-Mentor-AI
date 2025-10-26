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
  BarChartIcon,
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
              to="/welcome"
              className="px-8 py-3 bg-[#0D47A1] text-white rounded-lg hover:bg-blue-800 transition-colors font-medium flex items-center"
            >
              University Portal
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
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Choose Your Role</h2>
          <p className="text-gray-600 mb-10">
            Select the option that best describes how you'll use CodeMentorAI
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Instructor Role */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:border-blue-200 group">
              <div className="h-2 bg-[#0D47A1]"></div>
              <div className="p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <UsersIcon size={32} className="text-[#0D47A1]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Instructor</h3>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-start">
                    <CheckCircleIcon
                      size={18}
                      className="text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-gray-600">
                      Create and manage assignments
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon
                      size={18}
                      className="text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-gray-600">
                      Review student submissions
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon
                      size={18}
                      className="text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-gray-600">
                      Access performance analytics
                    </span>
                  </li>
                </ul>
                <Link
                  to="/login"
                  className="block w-full py-2 bg-white border border-[#0D47A1] text-[#0D47A1] rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  Join as Instructor
                </Link>
              </div>
            </div>
            {/* Student Role */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:border-blue-200 group transform translate-y-0 hover:-translate-y-1">
              <div className="h-2 bg-[#FFC107]"></div>
              <div className="p-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                  <GraduationCapIcon size={32} className="text-[#FFC107]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Student</h3>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-start">
                    <CheckCircleIcon
                      size={18}
                      className="text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-gray-600">Submit assignments</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon
                      size={18}
                      className="text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-gray-600">
                      Get AI-powered feedback
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon
                      size={18}
                      className="text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-gray-600">Track your progress</span>
                  </li>
                </ul>
                <Link
                  to="/login"
                  className="block w-full py-2 bg-[#0D47A1] text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
                >
                  Join as Student
                </Link>
              </div>
            </div>
            {/* Personal User Role */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:border-blue-200 group">
              <div className="h-2 bg-gray-500"></div>
              <div className="p-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                  <UserIcon size={32} className="text-gray-700" />
                </div>
                <h3 className="text-xl font-bold mb-3">Personal</h3>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-start">
                    <CheckCircleIcon
                      size={18}
                      className="text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-gray-600">
                      Practice coding skills
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon
                      size={18}
                      className="text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-gray-600">
                      Get AI feedback on your code
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon
                      size={18}
                      className="text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-gray-600">
                      Track your learning journey
                    </span>
                  </li>
                </ul>
                <Link
                  to="/signup?role=personal"
                  className="block w-full py-2 bg-white border border-gray-500 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Join for Personal Use
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Testimonials Section */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-center mb-10">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-4">
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} size={16} />
                ))}
              </div>
              <p className="text-gray-600 italic mb-4">
                "CodeMentorAI has transformed how I teach programming. The
                automated feedback saves me hours of grading time."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#0D47A1] font-medium mr-3">
                  JM
                </div>
                <div>
                  <p className="font-medium">Dr. K.Wijewardhana</p>
                  <p className="text-sm text-gray-500">
                    Computer Science Professor
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} size={16} />
                ))}
              </div>
              <p className="text-gray-600 italic mb-4">
                "As a student, I love getting immediate feedback on my code
                instead of waiting days for my assignments to be graded."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#0D47A1] font-medium mr-3">
                  AK
                </div>
                <div>
                  <p className="font-medium">Janaka Peris</p>
                  <p className="text-sm text-gray-500">
                    Computer Engineering Student
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} size={16} />
                ))}
              </div>
              <p className="text-gray-600 italic mb-4">
                "I've been using CodeMentorAI to improve my coding skills, and
                the personalized feedback has been invaluable."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#0D47A1] font-medium mr-3">
                  RP
                </div>
                <div>
                  <p className="font-medium">Sanjaya Edirisinghe</p>
                  <p className="text-sm text-gray-500">Self-taught Developer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold flex items-center mb-4">
                <span className="bg-[#FFC107] text-[#0D47A1] p-1 rounded mr-2">
                  CM
                </span>
                CodeMentorAI
              </h3>
              <p className="text-gray-400">
                Revolutionizing the way programming is taught and learned
                through AI-powered feedback.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/features"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/testimonials"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/documentation"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tutorials"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/support"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/company"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Compnay Details
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2025 CodeMentorAI. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <TwitterIcon size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <LinkedinIcon size={20} />
              </a>
              <a
                href="https://github.com/COHNDSE242F-Group/Code-Mentor-AI"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <GithubIcon size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <YoutubeIcon size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
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

const LinkedinIcon: React.FC<IconProps> = ({ size = 20 }) => (
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
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const GithubIcon: React.FC<IconProps> = ({ size = 20 }) => (
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
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const YoutubeIcon: React.FC<IconProps> = ({ size = 20 }) => (
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
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.94C18.88 4 12 4 12 4s-6.88 0-8.6.48a2.78 2.78 0 0 0-1.94 1.94A29.72 29.72 0 0 0 1 12a29.72 29.72 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 1.94C5.12 20 12 20 12 20s6.88 0 8.6-.48a2.78 2.78 0 0 0 1.94-1.94A29.72 29.72 0 0 0 23 12a29.72 29.72 0 0 0-.46-5.58z"></path>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon>
  </svg>
);

export default Home;