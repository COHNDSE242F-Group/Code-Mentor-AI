import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, UsersIcon, TargetIcon, AwardIcon, CodeIcon, ShieldIcon, BookOpenIcon } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold flex items-center">
                <span className="bg-[#FFC107] text-[#0D47A1] p-1 rounded mr-2">
                  CM
                </span>
                CodeMentorAI
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="px-4 py-2 text-[#0D47A1] hover:bg-blue-50 rounded-md transition-colors flex items-center"
              >
                <ArrowLeftIcon size={16} className="mr-2" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About CodeMentorAI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionizing programming education through AI-powered Socratic tutoring that promotes deep conceptual understanding and independent problem-solving.
          </p>
        </div>

        {/* Problem Statement */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-[#0D47A1]">The Challenge We're Solving</h2>
          <div className="prose prose-lg text-gray-600">
            <p className="mb-4">
              In today's programming education landscape, students increasingly rely on AI tools like ChatGPT and GitHub Copilot that provide instant solutions. While convenient, this creates surface-level learning where students can produce code but lack fundamental problem-solving skills.
            </p>
            <p className="mb-4">
              The consequences are evident: graduates struggle with analytical thinking, employers face skill gaps, and educational institutions see declining independent problem-solving abilities among students.
            </p>
            <p>
              Traditional educational models lack the resources to provide personalized, step-by-step guidance for every student, leaving many to learn in isolation with tools that don't encourage critical thinking.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Innovative Solution</h2>
            <p className="text-gray-600 mb-4">
              CodeMentorAI addresses this critical gap by offering an AI-powered learning platform that guides students through problem-solving using Socratic questioning rather than providing direct answers.
            </p>
            <p className="text-gray-600 mb-4">
              Unlike conventional AI tools optimized for efficiency, our platform is specifically designed for learning. We emphasize understanding over memorization, guiding students to think like programmers rather than just producing code.
            </p>
            <p className="text-gray-600">
              Founded in 2023, our platform bridges the gap between theoretical knowledge and practical application by providing intelligent, concept-aware feedback that helps students learn from their mistakes in real-time.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold mb-6">Our Mission</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <TargetIcon className="text-[#0D47A1] mt-1 mr-4 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-semibold mb-2">Democratize Programming Education</h4>
                  <p className="text-gray-600">Make high-quality, concept-driven programming education accessible to everyone, everywhere.</p>
                </div>
              </div>
              <div className="flex items-start">
                <BookOpenIcon className="text-[#0D47A1] mt-1 mr-4 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-semibold mb-2">Foster Deep Conceptual Understanding</h4>
                  <p className="text-gray-600">Shift learning from solution consumption to structured problem-solving and analytical thinking.</p>
                </div>
              </div>
              <div className="flex items-start">
                <ShieldIcon className="text-[#0D47A1] mt-1 mr-4 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-semibold mb-2">Ensure Academic Integrity</h4>
                  <p className="text-gray-600">Provide institutions with tools to maintain fair assessment while promoting genuine learning.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Core Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-xl p-6">
              <CodeIcon className="text-[#0D47A1] mb-4" size={32} />
              <h3 className="font-bold text-lg mb-2">Socratic AI Tutor</h3>
              <p className="text-gray-600">Guides students with questions and hints rather than providing direct solutions.</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-6">
              <BookOpenIcon className="text-[#0D47A1] mb-4" size={32} />
              <h3 className="font-bold text-lg mb-2">Concept Tracking</h3>
              <p className="text-gray-600">Maps student performance to specific programming concepts for personalized learning.</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-6">
              <ShieldIcon className="text-[#0D47A1] mb-4" size={32} />
              <h3 className="font-bold text-lg mb-2">Academic Integrity</h3>
              <p className="text-gray-600">Copy-paste prevention, typing analysis, and plagiarism detection for fair assessments.</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#0D47A1] text-xl font-bold">UI</span>
              </div>
              <h3 className="font-bold text-lg">U.I,Kodithuwakku</h3>
              <p className="text-gray-600 mb-2">Project Lead & Education Specialist</p>
              <p className="text-sm text-gray-500">Computer Science Professor with 15+ years of teaching experience and research in educational technology</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#0D47A1] text-xl font-bold">DC</span>
              </div>
              <h3 className="font-bold text-lg">D.C.Thennakoon</h3>
              <p className="text-gray-600 mb-2">AI/ML Engineering Lead</p>
              <p className="text-sm text-gray-500">Specialist in large language models and adaptive learning systems with background in computer engineering</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#0D47A1] text-xl font-bold">KR</span>
              </div>
              <h3 className="font-bold text-lg">K.M.K.Rashmika</h3>
              <p className="text-gray-600 mb-2">Full-Stack Development Lead</p>
              <p className="text-sm text-gray-500">Expert in React.js, Node.js, and scalable web applications with focus on educational technology</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#0D47A1] text-xl font-bold">NS</span>
              </div>
              <h3 className="font-bold text-lg">H.G.N.Sanjaay</h3>
              <p className="text-gray-600 mb-2">Full-Stack Developer</p>
              <p className="text-sm text-gray-500">Expert in React.js, Node.js, and scalable web applications with focus on educational technology</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;