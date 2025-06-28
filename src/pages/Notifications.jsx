import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  CheckCircle, 
  X, 
  Users, 
  Calendar, 
  Heart, 
  MessageCircle,
  Settings,
  Filter
} from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { relationshipAPI } from '../api/api-calls';

const Notifications = () => {
  const [filter, setFilter] = useState('all');
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    loading 
  } = useNotifications();

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'relationship_request', label: 'Requests' },
    { value: 'memory_shared', label: 'Memories' },
    { value: 'event_reminder', label: 'Events' }
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const handleRelationshipResponse = async (relationshipId, action) => {
    try {
      await relationshipAPI.respondToRequest(relationshipId, action);
      // The notification will be updated via socket or refetch
    } catch (error) {
      console.error('Error responding to relationship request:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      relationship_request: Users,
      relationship_accepted: CheckCircle,
      relationship_rejected: X,
      memory_shared: Heart,
      event_reminder: Calendar,
      message: MessageCircle
    };
    return icons[type] || Bell;
  };

  const getNotificationColor = (type) => {
    const colors = {
      relationship_request: { text: 'text-blue-600', bg: 'bg-blue-100' },
      relationship_accepted: { text: 'text-green-600', bg: 'bg-green-100' },
      relationship_rejected: { text: 'text-red-600', bg: 'bg-red-100' },
      memory_shared: { text: 'text-pink-600', bg: 'bg-pink-100' },
      event_reminder: { text: 'text-purple-600', bg: 'bg-purple-100' },
      message: { text: 'text-indigo-600', bg: 'bg-indigo-100' }
    };
    return colors[type] || { text: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const NotificationCard = ({ notification }) => {
    const IconComponent = getNotificationIcon(notification.type);
    const colors = getNotificationColor(notification.type);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${
          notification.read 
            ? 'border-gray-200 opacity-75' 
            : 'border-emerald-500'
        } hover:shadow-lg transition-all`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${colors.bg}`}>
            <IconComponent className={colors.text} size={24} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className={`font-semibold ${notification.read ? 'text-gray-600' : 'text-gray-800'}`}>
                {notification.title}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {notification.time || new Date(notification.createdAt).toLocaleDateString()}
                </span>
                {!notification.read && (
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                )}
              </div>
            </div>
            
            <p className={`mb-4 ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
              {notification.message}
            </p>
            
            <div className="flex items-center gap-2">
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification._id || notification.id)}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  Mark as read
                </button>
              )}
              
              <button
                onClick={() => deleteNotification(notification._id || notification.id)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Delete
              </button>
              
              {notification.type === 'relationship_request' && notification.data?.relationshipId && (
                <div className="flex gap-2 ml-auto">
                  <button 
                    onClick={() => handleRelationshipResponse(notification.data.relationshipId, 'reject')}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors text-sm"
                  >
                    Decline
                  </button>
                  <button 
                    onClick={() => handleRelationshipResponse(notification.data.relationshipId, 'accept')}
                    className="bg-emerald-600 text-white px-3 py-1 rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                  >
                    Accept
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bell className="text-emerald-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={markAllAsRead}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Mark all as read
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="text-gray-400" size={20} />
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === option.value
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification._id || notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NotificationCard notification={notification} />
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-12 text-center"
          >
            <Bell className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
            </h3>
            <p className="text-gray-600">
              {filter === 'unread' 
                ? "You're all caught up! New notifications will appear here."
                : "When you have new notifications, they'll appear here."
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Notifications;