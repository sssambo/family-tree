import React from "react";
import { Save } from "lucide-react";

const PrivacySettings = ({ 
  settings, 
  handleSettingChange, 
  handleSavePrivacy, 
  loading 
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Privacy Settings
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Visibility
          </label>
          <select
            value={settings.profileVisibility}
            onChange={(e) => handleSettingChange("profileVisibility", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="public">Public</option>
            <option value="family-only">Family Only</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Relationships Visibility
          </label>
          <select
            value={settings.relationshipsVisibility}
            onChange={(e) => handleSettingChange("relationshipsVisibility", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="public">Public</option>
            <option value="family-only">Family Only</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Events Visibility
          </label>
          <select
            value={settings.eventsVisibility}
            onChange={(e) => handleSettingChange("eventsVisibility", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="public">Public</option>
            <option value="family-only">Family Only</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className="flex items-center justify-between py-4 border-b border-gray-200">
          <div>
            <h3 className="font-medium text-gray-800">
              Searchable by Email
            </h3>
            <p className="text-sm text-gray-600">
              Allow others to find you by your email address
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.searchableByEmail}
              onChange={(e) => handleSettingChange("searchableByEmail", e.target.checked)}
              className="sr-only"
            />
            <div className={`w-11 h-6 rounded-full transition-colors ${
              settings.searchableByEmail ? "bg-emerald-600" : "bg-gray-200"
            }`}>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                settings.searchableByEmail ? "transform translate-x-5" : ""
              }`}></div>
            </div>
          </label>
        </div>

        <div className="flex items-center justify-between py-4">
          <div>
            <h3 className="font-medium text-gray-800">
              Allow Connection Requests
            </h3>
            <p className="text-sm text-gray-600">
              Let others send you relationship requests
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.allowConnectionRequests}
              onChange={(e) => handleSettingChange("allowConnectionRequests", e.target.checked)}
              className="sr-only"
            />
            <div className={`w-11 h-6 rounded-full transition-colors ${
              settings.allowConnectionRequests ? "bg-emerald-600" : "bg-gray-200"
            }`}>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                settings.allowConnectionRequests ? "transform translate-x-5" : ""
              }`}></div>
            </div>
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t">
        <button
          onClick={handleSavePrivacy}
          disabled={loading}
          className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all flex items-center gap-2 font-semibold disabled:opacity-50"
        >
          <Save size={20} />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default PrivacySettings;