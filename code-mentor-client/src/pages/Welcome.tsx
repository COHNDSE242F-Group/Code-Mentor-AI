
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BuildingIcon, MailIcon, MapPinIcon, UserIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
const registrationSchema = z.object({
  universityName: z.string().min(2, 'University name is required'),
  address: z.string().min(5, 'Address is required'),
  contactEmail: z.string().email('Invalid email address').optional(),
  contactNo: z.string().min(7, 'Contact number is required').optional()
});
type RegistrationFormData = z.infer<typeof registrationSchema>;
export const Welcome: React.FC = () => {
  const {
    theme
  } = useTheme();
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema)
  });
  const onSubmit = (data: RegistrationFormData) => {
    // Send registration to backend
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    setIsSubmitting(true);
    setServerError(undefined);
    fetch(`${apiUrl}/welcome/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        universityName: data.universityName,
        address: data.address,
        contactEmail: data.contactEmail || undefined,
        contactNo: data.contactNo || undefined
      })
    }).then(async res => {
      if (res.ok) {
        // store created university id so next pages can use it
        const payload = await res.json().catch(() => ({}));
        if (payload.university_id) {
          try {
            localStorage.setItem('university_id', String(payload.university_id));
            localStorage.setItem('university_name', String(payload.university_name || ''));
          } catch (e) {
            // ignore storage errors
          }
        }
        // proceed to success state
        setIsVerified(true);
      } else {
        const err = await res.json().catch(() => ({}));
        setServerError(err.detail || err.message || 'Registration failed');
      }
    }).catch(err => {
      setServerError(err.message || 'Network error');
    }).finally(() => setIsSubmitting(false));
  };
  const goToPackageSelection = () => {
    navigate('/select-package');
  };
  if (isVerified) {
    return <div className="max-w-lg mx-auto text-center">
        <div className={`p-8 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Successfully Registered!</h2>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Your university has been successfully registered. You're now
            ready to choose a subscription plan.
          </p>
          <button onClick={goToPackageSelection} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-300">
            Continue to Select Package
          </button>
        </div>
      </div>;
  }
  return <div className="max-w-4xl mx-auto">
      <div className={`mb-8 p-6 rounded-lg text-center ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-50'}`}>
        <h1 className="text-3xl font-bold mb-2">
          Welcome to CodeMentorAI University Portal
        </h1>
        <p className={theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}>
          Join hundreds of universities empowering their students with
          AI-powered coding education
        </p>
      </div>
      <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
        <h2 className="text-xl font-semibold mb-6">University Registration</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <div>
              <label htmlFor="universityName" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                University Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BuildingIcon size={18} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                </div>
                <input id="universityName" type="text" {...register('universityName')} className={`pl-10 block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} placeholder="e.g. Stanford University" />
              </div>
              {errors.universityName && <p className="mt-1 text-sm text-red-600">
                  {errors.universityName.message}
                </p>}
            </div>
            <div>
              <label htmlFor="contactEmail" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                University Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon size={18} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                </div>
                <input id="contactEmail" type="email" {...register('contactEmail')} className={`pl-10 block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} placeholder="e.g. contact@university.edu" />
              </div>
              {errors.contactEmail && <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>}
            </div>
            <div>
              <label htmlFor="address" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPinIcon size={18} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                </div>
                <input id="address" type="text" {...register('address')} className={`pl-10 block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} placeholder="e.g. 450 Serra Mall, Stanford, CA 94305" />
              </div>
              {errors.address && <p className="mt-1 text-sm text-red-600">
                  {errors.address.message}
                </p>}
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="contactNo" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Contact Number (optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon size={18} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                  </div>
                  <input id="contactNo" type="text" {...register('contactNo')} className={`pl-10 block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} placeholder="e.g. +1 650-xxx-xxxx" />
                </div>
                {errors.contactNo && <p className="mt-1 text-sm text-red-600">{errors.contactNo.message}</p>}
              </div>
            </div>
            {serverError && <div className="pt-2 text-sm text-red-600">{serverError}</div>}
            <div className="pt-4">
              <button type="submit" disabled={isSubmitting} className={`w-full ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-3 px-4 rounded-md transition duration-300`}>
                {isSubmitting ? 'Registering…' : 'Register'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>;
};