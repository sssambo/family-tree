import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Clock, 
  Check, 
  X, 
  Search,
  Filter,
  Heart,
  MessageCircle
} from 'lucide-react';
import { relationshipAPI } from '../api/api-calls';

const Relationships = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingRequests, setPendingRequests] = useState([]);
  const [confirmedRelationships, setConfirmedRelationships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelationshipData();
  }, []);

  const fetchRelationshipData = async () => {
    try {
      setLoading(true);
      
      // Fetch pending requests
      const pendingResponse = await relationshipAPI.getPendingRequests();
      setPendingRequests(pendingResponse.data || []);
      
      // Fetch confirmed relationships
      const confirmedResponse = await relationshipAPI.getRelationships('accepted');
      setConfirmedRelationships(confirmedResponse.data || []);
    } catch (error) {
      console.error('Error fetching relationship data:', error);
      // Use fallback empty arrays
      setPendingRequests([]);
      setConfirmedRelationships([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRelationshipResponse = async (relationshipId, action) => {
    try {
      await relationshipAPI.respondToRequest(relationshipId, action);
      // Refresh the data
      fetchRelationshipData();
    } catch (error) {
      console.error('Error responding to relationship request:', error);
    }
  };

  const getAvatarForUser = (user) => {
    const avatars = {
      male: '👨‍💼',
      female: '👩‍💼',
      other: '👤'
    };
    return avatars[user.gender] || '👤';
  };

  const TabButton = ({ tab, label, count, isActive, onClick }) => (
    <button
      onClick={() => onClick(tab)}
      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
        isActive
          ? 'bg-emerald-600 text-white shadow-lg'
          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
      }`}
    >
      {label}
      {count > 0 && (
        <span className={`px-2 py-1 rounded-full text-xs ${
          isActive ? 'bg-white text-emerald-600' : 'bg-gray-200 text-gray-600'
        }`}>
          {count}
        </span>
      )}
    </button>
  );

  const PendingRequestCard = ({ request }) => {
    const otherUser = request.fromUser._id !== request.currentUserId ? request.fromUser : request.toUser;
    const isIncoming = request.toUser._id === request.currentUserId;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-500"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{getAvatarForUser(otherUser)}</div>
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">
                {otherUser.username || `${otherUser.firstName} ${otherUser.lastName}`}
              </h3>
              <p className="text-emerald-600 font-medium">{request.type}</p>
              <p className="text-sm text-gray-500">
                {isIncoming ? 'Request received' : 'Request sent'} • {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {request.metadata?.message && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-gray-700 text-sm">"{request.metadata.message}"</p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <button className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2">
            <MessageCircle size={16} />
            Message
          </button>
          
          {isIncoming ? (
            <div className="flex gap-2">
              <button 
                onClick={() => handleRelationshipResponse(request._id, 'reject')}
                className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
              >
                <X size={16} />
                Decline
              </button>
              <button 
                onClick={() => handleRelationshipResponse(request._id, 'accept')}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Check size={16} />
                Accept
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-600">
              <Clock size={16} />
              <span className="text-sm font-medium">Pending</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const RelationshipCard = ({ relationship }) => {
    const otherUser = relationship.fromUser._id !== relationship.currentUserId ? relationship.fromUser : relationship.toUser;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{getAvatarForUser(otherUser)}</div>
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">
                {otherUser.username || `${otherUser.firstName} ${otherUser.lastName}`}
              </h3>
              <p className="text-emerald-600 font-medium">{relationship.type}</p>
              <p className="text-sm text-gray-500">
                Connected since {new Date(relationship.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last interaction</p>
            <p className="font-medium text-gray-800">
              {otherUser.lastActive ? new Date(otherUser.lastActive).toLocaleDateString() : 'Unknown'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Heart size={14} />
              {relationship.sharedMemories || 0} memories
            </span>
          </div>
          
          <div className="flex gap-2">
            <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors text-sm">
              View Profile
            </button>
            <button className="bg-emerald-600 text-white px-3 py-1 rounded-lg hover:bg-emerald-700 transition-colors text-sm">
              Message
            </button>
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
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="text-emerald-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">Relationships</h1>
          </div>
          <button className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all flex items-center gap-2">
            <UserPlus size={20} />
            Add Relative
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search relationships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={20} className="text-gray-600" />
            <span className="text-gray-700">Filter</span>
          </button>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-4 mb-8"
      >
        <div className="flex gap-2 flex-wrap">
          <TabButton 
            tab="pending" 
            label="Pending Requests" 
            count={pendingRequests.length}
            isActive={activeTab === 'pending'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            tab="confirmed" 
            label="Family Members" 
            count={confirmedRelationships.length}
            isActive={activeTab === 'confirmed'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            tab="suggestions" 
            label="Suggestions" 
            count={0}
            isActive={activeTab === 'suggestions'} 
            onClick={setActiveTab} 
          />
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {activeTab === 'pending' && (
          <div className="space-y-6">
            {pendingRequests.length > 0 ? (
              pendingRequests.map((request) => (
                <PendingRequestCard key={request._id} request={request} />
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Clock className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No pending requests</h3>
                <p className="text-gray-600">You're all caught up! New relationship requests will appear here.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'confirmed' && (
          <div className="grid md:grid-cols-2 gap-6">
            {confirmedRelationships.length > 0 ? (
              confirmedRelationships.map((relationship) => (
                <RelationshipCard key={relationship._id} relationship={relationship} />
              ))
            ) : (
              <div className="col-span-full bg-white rounded-xl shadow-lg p-12 text-center">
                <Users className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No confirmed relationships</h3>
                <p className="text-gray-600">Start connecting with your family members!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No suggestions yet</h3>
            <p className="text-gray-600 mb-6">
              We'll suggest potential family members based on your existing connections and shared information.
            </p>
            <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
              Invite Family Members
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Relationships;