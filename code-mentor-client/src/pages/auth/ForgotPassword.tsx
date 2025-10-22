
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MailIcon, ArrowLeftIcon } from 'lucide-react';
import Card from '../../components/ui/Card';
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
  }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const validateForm = () => {
    const newErrors: {
      email?: string;
    } = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:8000/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (response.ok) {
          setIsSubmitted(true);
        } else {
          const data = await response.json();
          setErrors({ email: data.message || "Failed to send reset email" });
        }
      } catch (error) {
        setErrors({ email: "Server error. Please try again later." });
      }
    }
  };
  return <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold flex items-center justify-center">
              <span className="bg-[#FFC107] text-[#0D47A1] p-2 rounded mr-2 text-xl">
                CM
              </span>
              CodeMentorAI
            </h1>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Reset your password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We'll send you an email with a link to reset your password
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          {!isSubmitted ? <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon size={18} className="text-gray-400" />
                  </div>
                  <input id="email" name="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className={`appearance-none block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0D47A1] focus:border-[#0D47A1] sm:text-sm`} placeholder="you@example.com" />
                </div>
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
              </div>
              <div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0D47A1] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D47A1]">
                  Send reset link
                </button>
              </div>
            </form> : <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                Check your email
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                We've sent a password reset link to {email}
              </p>
              <div className="mt-6">
                <p className="text-sm">
                  Didn't receive the email?{' '}
                  <button type="button" onClick={() => setIsSubmitted(false)} className="font-medium text-[#0D47A1] hover:text-blue-800">
                    Click here to try again
                  </button>
                </p>
              </div>
            </div>}
          <div className="mt-6">
            <Link to="/login" className="flex items-center justify-center text-sm font-medium text-[#0D47A1] hover:text-blue-800">
              <ArrowLeftIcon size={16} className="mr-1" />
              Back to login
            </Link>
          </div>
        </Card>
      </div>
    </div>;
};
const CheckIcon = ({
  className
}: {
  className?: string;
}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>;
export default ForgotPassword;