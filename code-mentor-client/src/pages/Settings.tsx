import React, { useState } from "react";
import Card from "../components/ui/Card";
import {
  PencilIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2 as LoadingIcon,
  Github as GithubIcon,
  Discord as DiscordIcon,
  Google as GoogleIcon,
  Slack as SlackIcon,
} from "lucide-react";

type User = {
  name: string;
  initials: string;
  role: string;
  email: string;
  bio: string;
};

const mockUser: User = {
  name: "John Doe",
  initials: "JD",
  role: "Programming Instructor",
  email: "john.doe@example.com",
  bio: "Computer Science instructor with 10+ years of experience...",
};

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<User>(mockUser);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof User, value: string) => {
    setUser({ ...user, [field]: value });
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log("Saved user data:", user);
      alert("Changes saved successfully!");
    }, 1000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <Card>
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Profile Settings
            </h2>
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center">
              <div className="relative mb-4 sm:mb-0 sm:mr-6">
                <div className="w-20 h-20 rounded-full bg-[#0D47A1] flex items-center justify-center text-white text-2xl">
                  {user.initials}
                </div>
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 border border-gray-300 shadow-sm hover:bg-gray-50">
                  <PencilIcon size={14} />
                </button>
              </div>
              <div>
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.role}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border rounded-lg px-3 py-2"
                value={user.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              <textarea
                placeholder="Bio"
                className="w-full border rounded-lg px-3 py-2"
                rows={3}
                value={user.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
              />
            </div>
            <button
              onClick={handleSave}
              disabled={loading}
              className="mt-4 bg-[#0D47A1] text-white px-4 py-2 rounded-lg flex items-center"
            >
              {loading && <LoadingIcon className="animate-spin mr-2" size={16} />}
              Save Changes
            </button>
          </Card>
        );

      case "account":
        return (
          <Card>
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Account Settings
            </h2>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full border rounded-lg px-3 py-2"
                value={user.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  className="w-full border rounded-lg px-3 py-2"
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={loading}
              className="mt-4 bg-[#0D47A1] text-white px-4 py-2 rounded-lg flex items-center"
            >
              {loading && <LoadingIcon className="animate-spin mr-2" size={16} />}
              Update Account
            </button>
          </Card>
        );

      case "integrations":
        return (
          <Card>
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Connected Integrations
            </h2>
            <ul className="space-y-3">
              {[
                { name: "GitHub", icon: <GithubIcon size={16} />, connected: true },
                { name: "Google", icon: <GoogleIcon size={16} />, connected: false },
                { name: "Slack", icon: <SlackIcon size={16} />, connected: false },
                { name: "Discord", icon: <DiscordIcon size={16} />, connected: true },
              ].map((integration, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between border p-3 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    {integration.icon}
                    <span>{integration.name}</span>
                  </div>
                  {integration.connected ? (
                    <CheckCircleIcon className="text-green-500" size={18} />
                  ) : (
                    <button className="bg-[#0D47A1] text-white px-3 py-1 rounded-lg">
                      Connect
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500">Manage your account and application preferences</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="space-y-2">
          {["profile", "account", "integrations"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                activeTab === tab ? "bg-[#0D47A1] text-white" : "bg-gray-100"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="md:col-span-3">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default Settings;