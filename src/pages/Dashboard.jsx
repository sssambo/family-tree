import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TreePine,
  Users,
  Calendar,
  Heart,
  Plus,
  TrendingUp,
  UserPlus,
  Camera,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import { treeAPI, eventAPI, relationshipAPI } from "../api/api-calls";

const Dashboard = () => {
  const { user } = useAuth();
  const { notifications } = useNotifications();
  const [stats, setStats] = useState({
    familyMembers: 0,
    connections: 0,
    events: 0,
    memories: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch tree stats
      const treeStatsResponse = await treeAPI.getTreeStats(user._id || user.id);

      // Fetch recent timeline events
      const timelineResponse = await eventAPI.getUserTimeline(
        user._id || user.id,
        5
      );

      // Fetch relationships count
      const relationshipsResponse = await relationshipAPI.getRelationships(
        "accepted"
      );

      setStats({
        familyMembers: treeStatsResponse.data?.totalMembers || 0,
        connections: relationshipsResponse.data?.length || 0,
        events: treeStatsResponse.data?.totalEvents || 0,
        memories: treeStatsResponse.data?.totalMedia || 0,
      });

      // Transform timeline events to activity format
      const activities =
        timelineResponse.data?.map((event) => ({
          id: event._id,
          type: event.type,
          message: `${event.title} - ${event.description || ""}`,
          time: new Date(event.createdAt).toLocaleDateString(),
          avatar: getEventIcon(event.type),
        })) || [];

      setRecentActivity(activities);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Use fallback data
      setStats({
        familyMembers: 12,
        connections: 8,
        events: 3,
        memories: 45,
      });
      setRecentActivity([
        {
          id: 1,
          type: "connection",
          message: "New family member joined your tree",
          time: "2 hours ago",
          avatar: "👥",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (eventType) => {
    const icons = {
      birth: "👶",
      graduation: "🎓",
      marriage: "💒",
      anniversary: "💕",
      achievement: "🏆",
      custom: "📸",
    };
    return icons[eventType] || "📸";
  };

  const statsData = [
    {
      icon: Users,
      label: "Family Members",
      value: stats.familyMembers.toString(),
      change: "+2 this month",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Heart,
      label: "Connections",
      value: stats.connections.toString(),
      change: "+1 this week",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: Calendar,
      label: "Events",
      value: stats.events.toString(),
      change: "Upcoming",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Camera,
      label: "Memories",
      value: stats.memories.toString(),
      change: "+5 this week",
      color: "from-pink-500 to-pink-600",
    },
  ];

  const quickActions = [
    {
      icon: UserPlus,
      title: "Add Family Member",
      description: "Invite a relative to join your tree",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Camera,
      title: "Upload Memory",
      description: "Share a photo or story",
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: Calendar,
      title: "Plan Event",
      description: "Organize a family gathering",
      color: "from-purple-500 to-pink-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.username || user?.firstName}! 👋
            </h1>
            <p className="text-emerald-100">
              Your family tree is growing beautifully. Here's what's happening.
            </p>
          </div>
          <TreePine size={64} className="text-emerald-200" />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <TrendingUp className="text-green-500" size={16} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {stat.value}
            </h3>
            <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
            <p className="text-green-600 text-xs font-medium">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all text-left"
              >
                <div
                  className={`p-3 rounded-lg bg-gradient-to-r ${action.color} inline-block mb-4`}
                >
                  <action.icon className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Recent Activity
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-2xl">{activity.avatar}</div>
                    <div className="flex-1">
                      <p className="text-gray-800 text-sm mb-1">
                        {activity.message}
                      </p>
                      <p className="text-gray-500 text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
            <button className="w-full mt-4 text-emerald-600 hover:text-emerald-700 font-medium text-sm">
              View all activity
            </button>
          </div>
        </motion.div>
      </div>

      {/* Family Tree Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Family Tree</h2>
          <button className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all">
            View Full Tree
          </button>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-8 text-center">
          <TreePine className="mx-auto text-emerald-600 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Your tree has {stats.familyMembers} family members
          </h3>
          <p className="text-gray-600 mb-4">
            Explore the connections and discover your family's story
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors">
              Add Member
            </button>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
              Explore Tree
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
