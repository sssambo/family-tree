import React from "react";

const NotificationSettings = ({ notifications, handleNotifChange }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="emailNotifications"
            checked={notifications.emailNotifications || false}
            onChange={handleNotifChange}
          />
          Email Notifications
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="smsNotifications"
            checked={notifications.smsNotifications || false}
            onChange={handleNotifChange}
          />
          SMS Notifications
        </label>
      </div>
    </div>
  );
};

export default NotificationSettings;
