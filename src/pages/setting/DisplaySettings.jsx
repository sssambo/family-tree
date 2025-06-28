// 📁 components/Settings/DisplaySettings.jsx
import React from "react";

const DisplaySettings = ({ settings, handleChange }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Display</h2>
      <select
        name="theme"
        value={settings.theme || "light"}
        onChange={handleChange}
        className="input"
      >
        <option value="light">Light Mode</option>
        <option value="dark">Dark Mode</option>
      </select>
    </div>
  );
};

export default DisplaySettings;
