import React from "react";

const NotificationSettings = ({ settings, handleSettingChange }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Notification Preferences
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-4 border-b border-gray-200">
          <div>
            <h3 className="font-medium text-gray-800">
              Email Notifications
            </h3>
            <p className="text-sm text-gray-600">
              Receive notifications via email
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleSettingChange("emailNotifications", e.target.checked)}
              className="sr-only"
            />
            <div className={`w-11 h-6 rounded-full transition-colors ${
              settings.emailNotifications ? "bg-emerald-600" : "bg-gray-200"
            }`}>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                settings.emailNotifications ? "transform translate-x-5" : ""
              }`}></div>
            </div>
          </label>
        </div>

        <div className="flex items-center justify-between py-4 border-b border-gray-200">
          <div>
            <h3 className="font-medium text-gray-800">
              Relationship Requests
            </h3>
            <p className="text-sm text-gray-600">
              Get notified when someone wants to connect
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.relationshipRequests}
              onChange={(e) => handleSettingChange("relationshipRequests", e.target.checked)}
              className="sr-only"
            />
            <div className={`w-11 h-6 rounded-full transition-colors ${
              settings.relationshipRequests ? "bg-emerald-600" : "bg-gray-200"
            }`}>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                settings.relationshipRequests ? "transform translate-x-5" : ""
              }`}></div>
            </div>
          </label>
        </div>

        <div className="flex items-center justify-between py-4 border-b border-gray-200">
          <div>
            <h3 className="font-medium text-gray-800">
              Memory Shares
            </h3>
            <p className="text-sm text-gray-600">
              Get notified when family members share memories
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.memoryShares}
              onChange={(e) => handleSettingChange("memoryShares", e.target.checked)}
              className="sr-only"
            />
            <div className={`w-11 h-6 rounded-full transition-colors ${
              settings.memoryShares ? "bg-emerald-600" : "bg-gray-200"
            }`}>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                settings.memoryShares ? "transform translate-x-5" : ""
              }`}></div>
            </div>
          </label>
        </div>

        <div className="flex items-center justify-between py-4">
          <div>
            <h3 className="font-medium text-gray-800">
              Event Reminders
            </h3>
            <p className="text-sm text-gray-600">
              Get reminded about upcoming family events
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.eventReminders}
              onChange={(e) => handleSettingChange("eventReminders", e.target.checked)}
              className="sr-only"
            />
            <div className={`w-11 h-6 rounded-full transition-colors ${
              settings.eventReminders ? "bg-emerald-600" : "bg-gray-200"
            }`}>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                settings.eventReminders ? "transform translate-x-5" : ""
              }`}></div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;