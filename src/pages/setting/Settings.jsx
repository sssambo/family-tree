import React, { useState, useEffect } from "react";
import ProfileSettings from "./ProfileSettings";
import PrivacySettings from "./PrivacySettings";
import NotificationSettings from "./NotificationSettings";
import DisplaySettings from "./DisplaySettings";
import DataSettings from "./DataSettings";
import { userAPI } from "../../api/api-calls";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const Settings = () => {
  const { user, setUser } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await userAPI.getProfile();
        setSettings(res.user);
      } catch (err) {
        toast.error("Failed to load settings");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading || !settings) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin h-10 w-10 border-4 border-emerald-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>

      <ProfileSettings
        settings={settings}
        setSettings={setSettings}
        setUser={setUser}
      />

      <PrivacySettings settings={settings} setSettings={setSettings} />

      <NotificationSettings settings={settings} setSettings={setSettings} />

      <DisplaySettings settings={settings} setSettings={setSettings} />

      <DataSettings userId={user?._id || user?.id} />
    </div>
  );
};

export default Settings;
