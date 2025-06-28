import React from "react";
import { Download, Trash2 } from "lucide-react";

const DataSettings = ({ handleDeleteAccount, loading }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Data Management
      </h2>

      <div className="space-y-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            Export Your Data
          </h3>
          <p className="text-blue-700 mb-4">
            Download a copy of all your family tree data, including
            profiles, relationships, and memories.
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download size={16} />
            Export Data
          </button>
        </div>

        <div className="bg-red-50 rounded-lg p-6">
          <h3 className="font-semibold text-red-900 mb-2">
            Delete Account
          </h3>
          <p className="text-red-700 mb-4">
            Permanently delete your account and all associated data.
            This action cannot be undone.
          </p>
          <button
            onClick={handleDeleteAccount}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Trash2 size={16} />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataSettings;