import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, BuildingIcon, MapPinIcon, MailIcon, PhoneIcon, GlobeIcon, UsersIcon, TargetIcon } from 'lucide-react';

const Company: React.FC = () => {
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
            CodeMentorAI Company
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pioneering the future of programming education through AI-powered, concept-driven learning platforms.
          </p>
        </div>

        {/* Company Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                CodeMentorAI was founded in 2023 by a team of computer science educators and AI researchers 
                who recognized a critical gap in programming education. While AI tools were becoming increasingly 
                powerful, they were optimized for efficiency rather than learning.
              </p>
              <p>
                We observed that students were using AI assistants to complete assignments without developing 
                essential problem-solving skills. This led to surface-level learning where students could 
                produce code but lacked the fundamental understanding to solve new problems independently.
              </p>
              <p>
                Our mission became clear: create an AI-powered platform that guides rather than gives, 
                that teaches thinking rather than providing answers. We believe that true programming 
                education should focus on developing analytical thinking and conceptual understanding.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold mb-6">Company Facts</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <BuildingIcon className="text-[#0D47A1] mr-4" size={24} />
                <div>
                  <p className="font-semibold">Founded</p>
                  <p className="text-gray-600">2025</p>
                </div>
              </div>
              <div className="flex items-center">
                <TargetIcon className="text-[#0D47A1] mr-4" size={24} />
                <div>
                  <p className="font-semibold">Mission</p>
                  <p className="text-gray-600">Revolutionize programming education through AI-guided learning</p>
                </div>
              </div>
              <div className="flex items-center">
                <UsersIcon className="text-[#0D47A1] mr-4" size={24} />
                <div>
                  <p className="font-semibold">Team Size</p>
                  <p className="text-gray-600">15+ educators, researchers, and engineers</p>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Technology</h2>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#0D47A1] font-bold text-sm">React</span>
                </div>
                <h3 className="font-semibold mb-2">Frontend</h3>
                <p className="text-gray-600 text-sm">React.js with Visual Studio Code for interactive coding</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#0D47A1] font-bold text-sm">Python</span>
                </div>
                <h3 className="font-semibold mb-2">Backend</h3>
                <p className="text-gray-600 text-sm">Scalable server architecture with FastAPI/Python</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#0D47A1] font-bold text-sm">AI/ML</span>
                </div>
                <h3 className="font-semibold mb-2">AI Engine</h3>
                <p className="text-gray-600 text-sm">GPT-4/Gemini with custom educational prompts</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#0D47A1] font-bold text-sm">DB</span>
                </div>
                <h3 className="font-semibold mb-2">Database</h3>
                <p className="text-gray-600 text-sm">PostgreSQL with encrypted data storage</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-3xl font-bold mb-8 text-center">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MailIcon className="text-[#0D47A1] mr-4" size={20} />
                  <div>
                    <p className="font-medium">General Inquiries</p>
                    <p className="text-gray-600">hello@codementorai.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MailIcon className="text-[#0D47A1] mr-4" size={20} />
                  <div>
                    <p className="font-medium">Educational Institutions</p>
                    <p className="text-gray-600">institutions@codementorai.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="text-[#0D47A1] mr-4" size={20} />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600">+9422345678</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="text-[#0D47A1] mr-4" size={20} />
                  <div>
                    <p className="font-medium">Headquarters</p>
                    <p className="text-gray-600">125 Wijerama<br />Colombo 07</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 4:00 PM </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium">10:00 AM - 2:00 PM </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> For technical support, please include your user ID and a description of the issue. 
                  For educational institution inquiries, please mention your institution name and expected scale of usage.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Educational Integrity</h3>
              <p className="text-gray-600 text-sm">
                We prioritize genuine learning over shortcuts, ensuring students develop real programming skills.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">⟳</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Continuous Innovation</h3>
              <p className="text-gray-600 text-sm">
                We constantly evolve our AI models and educational approaches based on research and user feedback.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold">👥</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Collaborative Growth</h3>
              <p className="text-gray-600 text-sm">
                We work closely with educators and institutions to create solutions that address real classroom challenges.
              </p>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Company;