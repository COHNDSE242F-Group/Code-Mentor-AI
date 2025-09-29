import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Card from '../../components/ui/Card';
const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>(token ? 'pending' : 'pending');
  const [countdown, setCountdown] = useState(60);
  const email = 'user@example.com'; // In a real app, this would be passed from the registration flow
  useEffect(() => {
    // If there's a token, simulate verification
    if (token) {
      const timer = setTimeout(() => {
        setVerificationStatus('success');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [token]);
  useEffect(() => {
    // Countdown for resend email
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  const handleResendEmail = () => {
    // In a real app, this would call an API to resend the verification email
    console.log('Resending verification email to:', email);
    setCountdown(60);
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
              Verify your email
            </h2>
            {!token && <p className="mt-2 text-sm text-gray-600">
                We've sent a verification link to {email}
              </p>}
          </div>
        </div>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          {!token ? <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <MailIcon className="h-6 w-6 text-[#0D47A1]" />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                Check your inbox
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                We've sent a verification link to your email address. Please
                check your inbox and click on the link to verify your account.
              </p>
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-4">
                  Didn't receive the email?
                </p>
                <button type="button" onClick={handleResendEmail} disabled={countdown > 0} className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium ${countdown > 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'text-white bg-[#0D47A1] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D47A1]'}`}>
                  {countdown > 0 ? `Resend email (${countdown}s)` : 'Resend email'}
                </button>
              </div>
            </div> : <div className="text-center">
              {verificationStatus === 'pending' ? <div>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                    <LoadingIcon className="h-6 w-6 text-[#0D47A1] animate-spin" />
                  </div>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    Verifying your email...
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Please wait while we verify your email address.
                  </p>
                </div> : verificationStatus === 'success' ? <div>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <CheckIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    Email verified!
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Your email has been successfully verified. You can now log
                    in to your account.
                  </p>
                  <div className="mt-6">
                    <Link to="/login" className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0D47A1] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D47A1]">
                      Log in to your account
                    </Link>
                  </div>
                </div> : <div>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                    <XIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    Verification failed
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    We couldn't verify your email. The verification link may
                    have expired or is invalid.
                  </p>
                  <div className="mt-6">
                    <button type="button" onClick={handleResendEmail} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0D47A1] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D47A1]">
                      Resend verification email
                    </button>
                  </div>
                </div>}
            </div>}
          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm font-medium text-[#0D47A1] hover:text-blue-800">
              Return to login
            </Link>
          </div>
        </Card>
      </div>
    </div>;
};
const MailIcon = ({
  className
}: {
  className?: string;
}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>;
const CheckIcon = ({
  className
}: {
  className?: string;
}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>;
const XIcon = ({
  className
}: {
  className?: string;
}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>;
const LoadingIcon = ({
  className
}: {
  className?: string;
}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>;
export default VerifyEmail;