import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, FileTextIcon, ScaleIcon, UserCheckIcon, AlertTriangleIcon } from 'lucide-react';

const Terms: React.FC = () => {
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
            <ScaleIcon size={32} className="text-[#0D47A1]" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
          <p className="text-gray-600">Effective Date: October 27, 2025</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FileTextIcon className="mr-3 text-[#0D47A1]" size={24} />
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-600 mb-4">
                By accessing and using CodeMentorAI ("the Platform"), you agree to be bound by these Terms and Conditions, 
                our Privacy Policy, and all applicable laws and regulations.
              </p>
              <p className="text-gray-600">
                If you do not agree with any of these terms, you are prohibited from using or accessing the Platform. 
                These terms apply to all visitors, users, and others who access or use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <UserCheckIcon className="mr-3 text-[#0D47A1]" size={24} />
                2. User Accounts and Responsibilities
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">2.1 Account Creation</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>You must provide accurate and complete information during registration</li>
                    <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                    <li>You must be at least 13 years old to use the Platform (or 16 in the EU)</li>
                    <li>Institutional users must have proper authorization from their educational institution</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">2.2 User Conduct</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Use the Platform only for educational purposes and legitimate learning</li>
                    <li>Do not attempt to circumvent academic integrity features</li>
                    <li>Do not share solutions in ways that violate academic honesty policies</li>
                    <li>Respect intellectual property rights of others</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <AlertTriangleIcon className="mr-3 text-[#0D47A1]" size={24} />
                3. Academic Integrity and Proper Use
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">3.1 Educational Purpose</h3>
                  <p className="text-gray-600 mb-2">
                    CodeMentorAI is designed as a learning tool, not a solution provider. Users agree to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Use AI guidance for learning and understanding, not for completing assignments without comprehension</li>
                    <li>Follow their institution's academic integrity policies when using the Platform</li>
                    <li>Not represent AI-generated guidance as their own original work in assessments</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">3.2 Institutional Use</h3>
                  <p className="text-gray-600 mb-2">
                    Educational institutions using CodeMentorAI agree to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Inform students about Platform usage in course policies</li>
                    <li>Use academic integrity features appropriately and fairly</li>
                    <li>Provide proper attribution when using Platform-generated analytics</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Intellectual Property Rights</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">4.1 Platform Content</h3>
                  <p className="text-gray-600">
                    All Platform design, text, graphics, logos, and software are owned by CodeMentorAI and protected by 
                    intellectual property laws. You may not reproduce, distribute, or create derivative works without permission.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">4.2 User Content</h3>
                  <p className="text-gray-600 mb-2">
                    You retain ownership of code and content you create on the Platform. By submitting content, you grant us:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>A license to use your content for providing and improving our services</li>
                    <li>Permission to analyze your code for educational feedback and platform improvement</li>
                    <li>Right to use anonymized, aggregated data for research and development</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">4.3 AI-Generated Content</h3>
                  <p className="text-gray-600">
                    AI-generated hints, explanations, and guidance are provided for educational purposes. 
                    While we strive for accuracy, we do not guarantee the correctness of AI-generated content.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Service Modifications and Availability</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to modify, suspend, or discontinue any part of the Platform at any time. 
                We will provide reasonable notice for significant changes affecting core functionality.
              </p>
              <p className="text-gray-600">
                While we strive for 99.5% uptime, we do not guarantee uninterrupted service and are not liable for 
                any interruption or loss of data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                CodeMentorAI is provided "as is" without warranties of any kind. To the fullest extent permitted by law:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>We are not liable for any indirect, incidental, or consequential damages</li>
                <li>We are not responsible for academic outcomes resulting from Platform use</li>
                <li>Total liability shall not exceed the amount paid by you for services in the past 12 months</li>
                <li>We are not liable for any AI-generated content or its educational impact</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Termination</h2>
              <p className="text-gray-600 mb-4">
                We may suspend or terminate your account if you violate these terms. Upon termination:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>Your right to use the Platform immediately ceases</li>
                <li>We may retain your data as described in our Privacy Policy</li>
                <li>You may request deletion of your personal data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">8. Governing Law and Dispute Resolution</h2>
              <p className="text-gray-600 mb-4">
                These terms are governed by the laws of [Your Jurisdiction]. Any disputes shall be resolved through:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>Informal negotiation between parties (30 days)</li>
                <li>Mediation with a neutral third party</li>
                <li>Binding arbitration in [Your City], conducted in English</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">9. Changes to Terms</h2>
              <p className="text-gray-600">
                We may update these terms periodically. Continued use of the Platform after changes constitutes 
                acceptance of the new terms. Material changes will be notified via email or platform notification.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Contact Information</h2>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-gray-700"><strong>For terms-related inquiries:</strong></p>
                <p className="text-gray-600">Email: legal@codementorai.com</p>
                <p className="text-gray-600">Address: CodeMentorAI, 123 Wijerama Mawatha.</p>
                <p className="text-gray-600">Response Time: We aim to respond within 5 business days</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;