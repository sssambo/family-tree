// 📁 components/Settings/ProfileSettings.jsx
import React from "react";

const ProfileSettings = ({ settings, handleChange, loading }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="username"
          value={settings.username || ""}
          onChange={handleChange}
          placeholder="Username"
          className="input"
        />
        <input
          type="text"
          name="phone"
          value={settings.phone || ""}
          onChange={handleChange}
          placeholder="Phone"
          className="input"
        />
        <select
          name="gender"
          value={settings.gender || ""}
          onChange={handleChange}
          className="input"
        >
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer-not-to-say">Prefer Not to Say</option>
        </select>
        <input
          type="date"
          name="dob"
          value={settings.dob || ""}
          onChange={handleChange}
          className="input"
        />
      </div>
    </div>
  );
};

export default ProfileSettings;
