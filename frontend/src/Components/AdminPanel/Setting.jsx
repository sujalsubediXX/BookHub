import React, { useState } from "react";

const Setting = () => {
  const [settings, setSettings] = useState({
    username: "JohnDoe",
    email: "johndoe@example.com",
    notifications: true,
    darkMode: false,
    password: "",
  });

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSaveChanges = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Settings</h1>

      {/* Account Settings */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
        <div className="mb-4">
          <label className="block mb-2 text-sm text-gray-600">Username</label>
          <input
            type="text"
            value={settings.username}
            onChange={(e) => handleChange("username", e.target.value)}
            className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm text-gray-600">Email</label>
          <input
            type="email"
            value={settings.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Notifications</h2>
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Enable Notifications</span>
          <button
            onClick={() => handleToggle("notifications")}
            className={`w-10 h-6 rounded-full ${
              settings.notifications ? "bg-green-500" : "bg-gray-300"
            } relative`}
          >
            <span
              className={`block w-4 h-4 bg-white rounded-full transition-transform ${
                settings.notifications ? "transform translate-x-4" : ""
              }`}
            ></span>
          </button>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Dark Mode</span>
          <button
            onClick={() => handleToggle("darkMode")}
            className={`w-10 h-6 rounded-full ${
              settings.darkMode ? "bg-blue-500" : "bg-gray-300"
            } relative`}
          >
            <span
              className={`block w-4 h-4 bg-white rounded-full transition-transform ${
                settings.darkMode ? "transform translate-x-4" : ""
              }`}
            ></span>
          </button>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Security</h2>
        <div className="mb-4">
          <label className="block mb-2 text-sm text-gray-600">New Password</label>
          <input
            type="password"
            value={settings.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Save Changes Button */}
      <div className="text-right">
        <button
          onClick={handleSaveChanges}
          className="bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Setting;
