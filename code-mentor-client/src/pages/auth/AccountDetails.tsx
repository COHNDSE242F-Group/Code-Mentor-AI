import React, { useState, useRef } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserIcon, MailIcon, PhoneIcon, MapPinIcon, CameraIcon, SaveIcon } from 'lucide-react';
import Card from '../../components/ui/Card';
interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
  address: string;
  bio: string;
  avatarUrl: string | null;
}
const AccountDetails = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value ?? ""
      };
    });
  };
  // Fetch profile from backend
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('http://localhost:8000/account/profile');
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfile(data);
        setFormData(data);
      } catch (err) {
        setErrorMessage('Could not load profile.');
      }
    }
    fetchProfile();
  }, []);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          avatarUrl: imageUrl,
          name: prev.name ?? "",
          email: prev.email ?? "",
          phone: prev.phone ?? "",
          role: prev.role ?? "",
          address: prev.address ?? "",
          bio: prev.bio ?? ""
        };
      });
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');
    try {
      const res = await fetch('http://localhost:8000/account/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const updated = await res.json();
      setProfile(updated);
      setFormData(updated);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage('Could not update profile.');
    }
    setIsSaving(false);
  };
  if (errorMessage) {
    return <div className="w-full max-w-4xl mx-auto text-center py-20 text-red-600">{errorMessage}</div>;
  }
  if (!formData) {
    return <div className="w-full max-w-4xl mx-auto text-center py-20">Loading profile...</div>;
  }
  return <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Account Details</h1>
        <p className="text-gray-500">
          View and update your profile information
        </p>
      </div>
      {successMessage && <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-lg text-green-800">
          <div className="flex">
            <CheckIcon className="h-5 w-5 mr-2" />
            {successMessage}
          </div>
        </div>}
      <Card>
        <div className="flex flex-col md:flex-row items-start md:space-x-8">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-[#0D47A1] flex items-center justify-center text-white text-4xl overflow-hidden">
                  {formData.avatarUrl ? <img src={formData.avatarUrl} alt={formData.name} className="w-full h-full object-cover" /> : <span>
                      {formData.name.charAt(0)}
                      {formData.name.split(' ')[1]?.charAt(0)}
                    </span>}
                </div>
                {isEditing && <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <CameraIcon size={24} className="text-white" />
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  </div>}
              </div>
              <h2 className="mt-4 text-xl font-bold">{profile ? profile.name : ""}</h2>
              <p className="text-gray-500">{profile ? profile.role : ""}</p>
              {!isEditing && <button type="button" onClick={() => setIsEditing(true)} className="mt-4 px-4 py-2 border border-[#0D47A1] text-[#0D47A1] rounded-md hover:bg-blue-50">
                  Edit Profile
                </button>}
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon size={18} className="text-gray-400" />
                    </div>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing} className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md ${!isEditing ? 'bg-gray-50' : 'focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent'}`} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MailIcon size={18} className="text-gray-400" />
                    </div>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} disabled={!isEditing} className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md ${!isEditing ? 'bg-gray-50' : 'focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent'}`} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon size={18} className="text-gray-400" />
                    </div>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} disabled={!isEditing} className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md ${!isEditing ? 'bg-gray-50' : 'focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent'}`} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPinIcon size={18} className="text-gray-400" />
                    </div>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} disabled={!isEditing} className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md ${!isEditing ? 'bg-gray-50' : 'focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent'}`} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea name="bio" rows={4} value={formData.bio} onChange={handleInputChange} disabled={!isEditing} className={`w-full px-3 py-2 border border-gray-300 rounded-md ${!isEditing ? 'bg-gray-50' : 'focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent'}`} />
                </div>
                {isEditing && <div className="flex justify-end space-x-3">
                    <button type="button" onClick={() => {
                  setFormData(profile);
                  setIsEditing(false);
                }} className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
                      Cancel
                    </button>
                    <button type="submit" disabled={isSaving} className="flex items-center px-4 py-2 bg-[#0D47A1] text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D47A1]">
                      {isSaving ? <>
                          <LoadingIcon size={16} className="mr-2 animate-spin" />
                          Saving...
                        </> : <>
                          <SaveIcon size={16} className="mr-2" />
                          Save Changes
                        </>}
                    </button>
                  </div>}
              </div>
            </form>
          </div>
        </div>
      </Card>
      <div className="mt-6">
        <Card>
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">
              Account Security
            </h2>
            <div className="flex flex-col md:flex-row justify-between md:items-center pb-4 border-b border-gray-200">
              <div>
                <h3 className="font-medium">Password</h3>
                <p className="text-sm text-gray-500">
                  Last updated 3 months ago
                </p>
              </div>
              <Link to="/change-password" className="mt-2 md:mt-0 text-[#0D47A1] hover:text-blue-800 font-medium">
                Change password
              </Link>
            </div>
            {/* 2FA section removed as not needed */}
            <div className="flex flex-col md:flex-row justify-between md:items-center">
              <div>
                <h3 className="font-medium">Active sessions</h3>
                <p className="text-sm text-gray-500">
                  Manage your active sessions
                </p>
              </div>
              <button className="mt-2 md:mt-0 text-[#0D47A1] hover:text-blue-800 font-medium">
                View all
              </button>
            </div>
          </div>
        </Card>
      </div>
      <div className="mt-6">
        <Card>
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">
              Connected Accounts
            </h2>
            <div className="flex flex-col md:flex-row justify-between md:items-center pb-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#4285F4] rounded flex items-center justify-center mr-4">
                  <GoogleIcon className="text-white" />
                </div>
                <div>
                  <h3 className="font-medium">Google</h3>
                  <p className="text-sm text-gray-500">john.doe@gmail.com</p>
                </div>
              </div>
              <button className="mt-2 md:mt-0 text-red-500 hover:text-red-700 font-medium">
                Disconnect
              </button>
            </div>
            <div className="flex flex-col md:flex-row justify-between md:items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center mr-4">
                  <GithubIcon className="text-white" />
                </div>
                <div>
                  <h3 className="font-medium">GitHub</h3>
                  <p className="text-sm text-gray-500">Not connected</p>
                </div>
              </div>
              <button className="mt-2 md:mt-0 text-[#0D47A1] hover:text-blue-800 font-medium">
                Connect
              </button>
            </div>
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
const LoadingIcon = ({
  size,
  className
}: {
  size: number;
  className?: string;
}) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>;
const GoogleIcon = ({
  className
}: {
  className?: string;
}) => <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#fff" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" />
  </svg>;
const GithubIcon = ({
  className
}: {
  className?: string;
}) => <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>;
export default AccountDetails;