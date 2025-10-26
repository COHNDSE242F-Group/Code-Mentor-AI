import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, ShieldIcon, LockIcon, EyeIcon, DatabaseIcon } from 'lucide-react';

const Privacy: React.FC = () => {
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldIcon size={32} className="text-[#0D47A1]" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: December 1, 2023</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <DatabaseIcon className="mr-3 text-[#0D47A1]" size={24} />
                1. Information We Collect
              </h2>
              <p className="text-gray-600 mb-4">
                CodeMentorAI collects information to provide personalized educational services while maintaining academic integrity. We collect:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li><strong>Account Information:</strong> Name, email address, institutional affiliation, and user role</li>
                <li><strong>Educational Data:</strong> Course enrollments, assignment submissions, code solutions, and learning progress</li>
                <li><strong>Technical Data:</strong> IP addresses, browser type, device information, and usage patterns</li>
                <li><strong>Code Analysis Data:</strong> Programming concepts attempted, error patterns, and improvement areas</li>
                <li><strong>Academic Integrity Data:</strong> Typing patterns, submission timestamps, and integrity flags (for institutional use)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <EyeIcon className="mr-3 text-[#0D47A1]" size={24} />
                2. How We Use Your Information
              </h2>
              <p className="text-gray-600 mb-4">We use collected information exclusively for educational purposes:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Provide and maintain AI-powered tutoring services</li>
                <li>Generate personalized learning feedback and concept recommendations</li>
                <li>Track student progress and identify learning gaps</li>
                <li>Ensure academic integrity in institutional settings</li>
                <li>Improve our AI algorithms and educational content</li>
                <li>Communicate important platform updates and educational resources</li>
                <li>Maintain platform security and prevent misuse</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <LockIcon className="mr-3 text-[#0D47A1]" size={24} />
                3. Data Protection & Security
              </h2>
              <p className="text-gray-600 mb-4">
                We implement comprehensive security measures to protect your educational data:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li><strong>Encryption:</strong> All data is encrypted in transit (HTTPS/TLS) and at rest (AES-256)</li>
                <li><strong>Access Controls:</strong> Role-based access ensures only authorized personnel can view sensitive data</li>
                <li><strong>Regular Audits:</strong> Security assessments and penetration testing conducted quarterly</li>
                <li><strong>Data Minimization:</strong> We collect only necessary data for educational purposes</li>
                <li><strong>Secure Storage:</strong> Data stored in SOC 2 compliant cloud infrastructure with regular backups</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Data Sharing and Disclosure</h2>
              <p className="text-gray-600 mb-4">
                We do not sell or rent your personal information to third parties. Limited data sharing occurs only in these circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li><strong>Educational Institutions:</strong> With your institution for academic progress tracking and assessment</li>
                <li><strong>Service Providers:</strong> With trusted partners who assist in platform operation (under strict confidentiality)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and users' safety</li>
                <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales (with user notification)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Educational Data Privacy</h2>
              <p className="text-gray-600 mb-4">
                For institutional users, we comply with educational privacy regulations:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li><strong>FERPA Compliance:</strong> We adhere to Family Educational Rights and Privacy Act requirements</li>
                <li><strong>GDPR Compliance:</strong> For European users, we follow General Data Protection Regulation standards</li>
                <li><strong>Data Processing Agreements:</strong> Available for educational institutions requiring formal compliance</li>
                <li><strong>Student Data Ownership:</strong> Educational institutions maintain ownership of student data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Your Rights and Choices</h2>
              <p className="text-gray-600 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Access and download your personal data and learning progress</li>
                <li>Correct inaccurate personal information</li>
                <li>Request deletion of your account and associated data</li>
                <li>Opt-out of non-essential communications</li>
                <li>Export your learning history and code submissions</li>
                <li>Lodge complaints with relevant data protection authorities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Data Retention</h2>
              <p className="text-gray-600 mb-4">
                We retain your data only as long as necessary for educational purposes:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li><strong>Active Accounts:</strong> Data retained while account is active</li>
                <li><strong>Inactive Accounts:</strong> Data deleted after 24 months of inactivity</li>
                <li><strong>Institutional Data:</strong> Retention periods determined by educational institution policies</li>
                <li><strong>Backup Data:</strong> Securely deleted within 90 days</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">8. Contact Information</h2>
              <p className="text-gray-600 mb-4">
                For privacy-related questions, data access requests, or concerns:
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-gray-700"><strong>Data Protection Officer:</strong></p>
                <p className="text-gray-600">Email: privacy@codementorai.com</p>
                <p className="text-gray-600">Response Time: Within 72 hours for all privacy-related inquiries</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Policy Updates</h2>
              <p className="text-gray-600">
                We may update this privacy policy to reflect changes in our practices or legal requirements. 
                Significant changes will be communicated via email and platform notifications. 
                Continued use of CodeMentorAI after changes constitutes acceptance of the updated policy.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;