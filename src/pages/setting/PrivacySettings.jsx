// 📁 components/Settings/PrivacySettings.jsx
import React from "react";

const PrivacySettings = ({ settings, handleChange }) => {
  const fields = ["default", "profile", "relationships", "events"];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Privacy</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <select
            key={field}
            name={`visibilitySettings.${field}`}
            value={settings.visibilitySettings?.[field] || ""}
            onChange={handleChange}
            className="input"
          >
            <option value="">Visibility for {field}</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="family-only">Family Only</option>
          </select>
        ))}
      </div>
    </div>
  );
};

export default PrivacySettings;
