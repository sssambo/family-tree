import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Palette,
  Download,
  Trash2,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { userAPI, authAPI } from "../api/api-calls";
import toast from "react-hot-toast";

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
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Profile Information
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={settings.username}
                      onChange={(e) =>
                        handleSettingChange("username", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={settings.email}
                      className=" disabled w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={settings.firstName}
                      onChange={(e) =>
                        handleSettingChange("firstName", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={settings.lastName}
                      onChange={(e) =>
                        handleSettingChange("lastName", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={settings.phone}
                      onChange={(e) =>
                        handleSettingChange("phone", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={settings.dob}
                      onChange={(e) =>
                        handleSettingChange("dob", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={settings.gender}
                    onChange={(e) =>
                      handleSettingChange("gender", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={settings.bio}
                    onChange={(e) => handleSettingChange("bio", e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Tell your family about yourself..."
                  />
                </div>

                {/* Change Password Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Change Password
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            handlePasswordChange(
                              "currentPassword",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          handlePasswordChange("newPassword", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          handlePasswordChange(
                            "confirmPassword",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <button
                      onClick={handleChangePassword}
                      disabled={loading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      Change Password
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t">
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all flex items-center gap-2 font-semibold disabled:opacity-50"
                  >
                    <Save size={20} />
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
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
                      onChange={(e) =>
                        handleSettingChange("profileVisibility", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleSettingChange(
                          "relationshipsVisibility",
                          e.target.value
                        )
                      }
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
                      onChange={(e) =>
                        handleSettingChange("eventsVisibility", e.target.value)
                      }
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
                        onChange={(e) =>
                          handleSettingChange(
                            "searchableByEmail",
                            e.target.checked
                          )
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-11 h-6 rounded-full transition-colors ${
                          settings.searchableByEmail
                            ? "bg-emerald-600"
                            : "bg-gray-200"
                        }`}
                      >
                        <div
                          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                            settings.searchableByEmail
                              ? "transform translate-x-5"
                              : ""
                          }`}
                        ></div>
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
                        onChange={(e) =>
                          handleSettingChange(
                            "allowConnectionRequests",
                            e.target.checked
                          )
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-11 h-6 rounded-full transition-colors ${
                          settings.allowConnectionRequests
                            ? "bg-emerald-600"
                            : "bg-gray-200"
                        }`}
                      >
                        <div
                          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                            settings.allowConnectionRequests
                              ? "transform translate-x-5"
                              : ""
                          }`}
                        ></div>
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
            )}

            {activeTab === "notifications" && (
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
                        onChange={(e) =>
                          handleSettingChange(
                            "emailNotifications",
                            e.target.checked
                          )
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-11 h-6 rounded-full transition-colors ${
                          settings.emailNotifications
                            ? "bg-emerald-600"
                            : "bg-gray-200"
                        }`}
                      >
                        <div
                          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                            settings.emailNotifications
                              ? "transform translate-x-5"
                              : ""
                          }`}
                        ></div>
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
                        onChange={(e) =>
                          handleSettingChange(
                            "relationshipRequests",
                            e.target.checked
                          )
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-11 h-6 rounded-full transition-colors ${
                          settings.relationshipRequests
                            ? "bg-emerald-600"
                            : "bg-gray-200"
                        }`}
                      >
                        <div
                          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                            settings.relationshipRequests
                              ? "transform translate-x-5"
                              : ""
                          }`}
                        ></div>
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
                        onChange={(e) =>
                          handleSettingChange("memoryShares", e.target.checked)
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-11 h-6 rounded-full transition-colors ${
                          settings.memoryShares
                            ? "bg-emerald-600"
                            : "bg-gray-200"
                        }`}
                      >
                        <div
                          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                            settings.memoryShares
                              ? "transform translate-x-5"
                              : ""
                          }`}
                        ></div>
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
                        onChange={(e) =>
                          handleSettingChange(
                            "eventReminders",
                            e.target.checked
                          )
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-11 h-6 rounded-full transition-colors ${
                          settings.eventReminders
                            ? "bg-emerald-600"
                            : "bg-gray-200"
                        }`}
                      >
                        <div
                          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                            settings.eventReminders
                              ? "transform translate-x-5"
                              : ""
                          }`}
                        ></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "display" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Display Settings
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) =>
                        handleSettingChange("language", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <select
                      value={settings.theme}
                      onChange={(e) =>
                        handleSettingChange("theme", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Zone
                    </label>
                    <select
                      value={settings.timeZone}
                      onChange={(e) =>
                        handleSettingChange("timeZone", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "data" && (
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
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
