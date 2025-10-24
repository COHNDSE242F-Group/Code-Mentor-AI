import React, { useState, useEffect } from "react";
import Card from "../components/ui/Card";
import {
  PencilIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2 as LoadingIcon,
  // Github as GithubIcon,
  // Discord as DiscordIcon,
  //Google as GoogleIcon,
  //Slack as SlackIcon,
} from "lucide-react";
import { fetchWithAuth } from "../utils/auth";

type User = {
  name: string;
  role: string;
  email: string;
  bio?: string;
  contact_no?: string; // Add contact_no
  qualifications?: Array<{ degree: string; university: string }>; // Add qualifications
};

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<User>({
    name: "",
    role: "",
    email: "",
    bio: "",
    contact_no: "",
    qualifications: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [integrations, setIntegrations] = useState<
    { name: string; connected: boolean }[]
  >([]);

  useEffect(() => {
    if (activeTab === "profile") {
      fetchWithAuth("http://localhost:8000/settings/profile")
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched profile data:", data); // Debugging
          setUser({
            name: data.name || "",
            email: data.email || "",
            role: data.role || "",
            contact_no: data.contact_no || "",
            qualifications: data.qualifications || [],
          });
        })
        .catch((err) => console.error("Error fetching profile:", err));
    } else if (activeTab === "integrations") {
      fetchWithAuth("http://localhost:8000/settings/integrations")
        .then((res) => res.json())
        .then((data) => setIntegrations(data))
        .catch((err) => console.error("Error fetching integrations:", err));
    }
  }, [activeTab]);

  const handleInputChange = (field: keyof User, value: any) => {
    setUser({ ...user, [field]: value });
  };

  const handleSave = () => {
    setLoading(true);
    const endpoint =
      activeTab === "profile"
        ? "http://localhost:8000/settings/profile"
        : "http://localhost:8000/settings/account";
    fetchWithAuth(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to save changes");
        }
        return res.json();
      })
      .then(() => {
        setLoading(false);
        alert("Changes saved successfully!");
      })
      .catch((err) => {
        setLoading(false);
        console.error("Error saving changes:", err);
        alert("Failed to save changes. Please try again.");
      });
  };

  const handleSaveInstructorProfile = () => {
    setLoading(true);
    fetchWithAuth("http://localhost:8000/settings/instructor-profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to save instructor profile changes");
        }
        return res.json();
      })
      .then(() => {
        setLoading(false);
        alert("Instructor profile updated successfully!");
      })
      .catch((err) => {
        setLoading(false);
        console.error("Error saving instructor profile:", err);
        alert("Failed to save instructor profile changes. Please try again.");
      });
  };

  const renderTabContent = () => {
    console.log("Rendering tab content with user:", user); // Debugging
  switch (activeTab) {
    case "profile":
      return (
        <Card>
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Profile Settings
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border rounded-lg px-3 py-2"
              value={user.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full border rounded-lg px-3 py-2"
              value={user.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
            <input
              type="text"
              placeholder="Contact Number"
              className="w-full border rounded-lg px-3 py-2"
              value={user.contact_no || ""}
              onChange={(e) => handleInputChange("contact_no", e.target.value)}
            />
       <div>
  <h3 className="text-md font-bold text-gray-800 mb-2">Qualifications</h3>
  <ul className="space-y-2">
    {(user.qualifications || []).map((qualification, idx) => (
      <li key={idx} className="border p-3 rounded-lg">
        <p>
          <strong>Degree:</strong> {qualification.degree}
        </p>
        <p>
          <strong>University:</strong> {qualification.university}
        </p>
      </li>
    ))}
  </ul>
</div>
      </div>
      <button
        onClick={handleSaveInstructorProfile}
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
              {integrations.map((integration, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between border p-3 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
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
        <p className="text-gray-500">
          Manage your account and application preferences
        </p>
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