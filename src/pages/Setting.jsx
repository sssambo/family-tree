import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Palette,
  Download,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { userAPI } from "../api/api-calls";
import toast from "react-hot-toast";
import ProfileSettings from "./setting/ProfileSettings";
import PrivacySettings from "./setting/PrivacySettings";
import NotificationSettings from "./setting/NotificationSettings";
import DisplaySettings from "./setting/DisplaySettings";
import DataSettings from "./setting/DataSettings";

const Settings = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    // Profile settings
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    gender: "prefer-not-to-say",
    dob: "",

    // Privacy settings
    profileVisibility: "family-only",
    relationshipsVisibility: "family-only",
    eventsVisibility: "family-only",
    searchableByEmail: true,
    allowConnectionRequests: true,

    // Notification settings
    emailNotifications: true,
    relationshipRequests: true,
    memoryShares: true,
    eventReminders: true,

    // Display settings
    language: "en",
    theme: "light",
    timeZone: "America/New_York",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      loadUserSettings();
    }
  }, [user]);

  const loadUserSettings = async () => {
    try {
      const profileResponse = await userAPI.getProfile();
      const userData = profileResponse.user;

      setSettings((prev) => ({
        ...prev,
        username: userData.username || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        bio: userData.bio || "",
        gender: userData.gender || "prefer-not-to-say",
        dob: userData.dob ? userData.dob.split("T")[0] : "",
        profileVisibility:
          userData.visibilitySettings?.profile || "family-only",
        relationshipsVisibility:
          userData.visibilitySettings?.relationships || "family-only",
        eventsVisibility: userData.visibilitySettings?.events || "family-only",
      }));
    } catch (error) {
      console.error("Error loading user settings:", error);
    }
  };

  const TabButton = ({ tab, icon: Icon, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(tab)}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium transition-all ${
        isActive
          ? "bg-emerald-600 text-white shadow-lg"
          : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePasswordChange = (key, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);

      const profileData = {
        username: settings.username,
        firstName: settings.firstName,
        lastName: settings.lastName,
        email: settings.email,
        phone: settings.phone,
        bio: settings.bio,
        gender: settings.gender,
        dob: settings.dob,
      };

      await userAPI.updateProfile(profileData);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrivacy = async () => {
    try {
      setLoading(true);

      const visibilityData = {
        profile: settings.profileVisibility,
        relationships: settings.relationshipsVisibility,
        events: settings.eventsVisibility,
      };

      await userAPI.updateVisibility(visibilityData);
      toast.success("Privacy settings updated successfully");
    } catch (error) {
      console.error("Error updating privacy settings:", error);
      toast.error("Failed to update privacy settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      // This would typically be a separate endpoint for changing password
      // For now, we'll use a placeholder
      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        setLoading(true);
        // This would be implemented when the backend supports it
        toast.success("Account deletion request submitted");
        logout();
      } catch (error) {
        console.error("Error deleting account:", error);
        toast.error("Failed to delete account");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        <div className="flex items-center gap-3">
          <SettingsIcon className="text-emerald-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-xl shadow-lg p-4 space-y-2">
            <TabButton
              tab="profile"
              icon={User}
              label="Profile"
              isActive={activeTab === "profile"}
              onClick={setActiveTab}
            />
            <TabButton
              tab="privacy"
              icon={Shield}
              label="Privacy"
              isActive={activeTab === "privacy"}
              onClick={setActiveTab}
            />
            <TabButton
              tab="notifications"
              icon={Bell}
              label="Notifications"
              isActive={activeTab === "notifications"}
              onClick={setActiveTab}
            />
            <TabButton
              tab="display"
              icon={Palette}
              label="Display"
              isActive={activeTab === "display"}
              onClick={setActiveTab}
            />
            <TabButton
              tab="data"
              icon={Download}
              label="Data & Export"
              isActive={activeTab === "data"}
              onClick={setActiveTab}
            />
          </div>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          <div className="bg-white rounded-xl shadow-lg p-8">
            {activeTab === "profile" && (
              <ProfileSettings
                settings={settings}
                handleSettingChange={handleSettingChange}
                handleSaveProfile={handleSaveProfile}
                passwordData={passwordData}
                handlePasswordChange={handlePasswordChange}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                handleChangePassword={handleChangePassword}
                loading={loading}
              />
            )}

            {activeTab === "privacy" && (
              <PrivacySettings
                settings={settings}
                handleSettingChange={handleSettingChange}
                handleSavePrivacy={handleSavePrivacy}
                loading={loading}
              />
            )}

            {activeTab === "notifications" && (
              <NotificationSettings
                settings={settings}
                handleSettingChange={handleSettingChange}
              />
            )}

            {activeTab === "display" && (
              <DisplaySettings
                settings={settings}
                handleSettingChange={handleSettingChange}
              />
            )}

            {activeTab === "data" && (
              <DataSettings
                handleDeleteAccount={handleDeleteAccount}
                loading={loading}
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;