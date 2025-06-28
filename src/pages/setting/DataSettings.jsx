// 📁 components/Settings/DataSettings.jsx
import React from "react";

const DataSettings = ({ handleDelete }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Data Control</h2>
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Delete My Account
      </button>
    </div>
  );
};

export default DataSettings;

// ✅ Now update your Settings.jsx to import and render these components appropriately.
