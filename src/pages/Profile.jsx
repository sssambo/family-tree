import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Calendar, 
  MapPin, 
  Heart, 
  Camera, 
  Edit3,
  Share,
  MessageCircle,
  Plus,
  Image,
  Video
} from 'lucide-react';
import { userAPI, mediaAPI, eventAPI } from '../api/api-calls';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('timeline');
  const [profile, setProfile] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProfileData();
    }
  }, [id]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile
      const profileResponse = await userAPI.getUserById(id);
      setProfile(profileResponse.data);

      // Fetch user's media gallery
      const mediaResponse = await mediaAPI.getMediaGallery(id, 'image', 20);
      setPhotos(mediaResponse.data || []);

      // Fetch user's timeline
      const timelineResponse = await eventAPI.getUserTimeline(id, 20);
      const timelineData = timelineResponse.data?.map(event => ({
        id: event._id,
        type: event.type,
        title: event.title,
        date: event.timestamp,
        description: event.description,
        icon: getEventIcon(event.type),
        images: event.media?.filter(m => m.type === 'image').map(m => m.url) || []
      })) || [];
      
      setTimeline(timelineData);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      // Use fallback data
      setProfile({
        _id: id,
        username: 'Unknown User',
        email: 'unknown@example.com',
        gender: 'other',
        profileImage: null
      });
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (eventType) => {
    const icons = {
      birth: '👶',
      graduation: '🎓',
      marriage: '💒',
      anniversary: '💕',
      achievement: '🏆',
      custom: '📸'
    };
    return icons[eventType] || '📸';
  };

  const getAvatarForUser = (user) => {
    if (user.profileImage) return user.profileImage;
    
    const avatars = {
      male: '👨‍💼',
      female: '👩‍💼',
      other: '👤'
    };
    return avatars[user.gender] || '👤';
  };

  const getRelationToCurrentUser = (profileUser) => {
    if (profileUser._id === currentUser._id || profileUser.id === currentUser.id) {
      return 'You';
    }
    // This would come from relationship data
    return 'Family Member';
  };

  const TabButton = ({ tab, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(tab)}
      className={`px-4 py-2 rounded-lg font-medium transition-all ${
        isActive
          ? 'bg-emerald-600 text-white shadow-lg'
          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile not found</h2>
        <p className="text-gray-600">The requested profile could not be found.</p>
      </div>
    );
  }

  const isOwnProfile = profile._id === currentUser._id || profile.id === currentUser.id;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8 mb-8"
      >
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Avatar and Basic Info */}
          <div className="flex-shrink-0 text-center md:text-left">
            <div className="text-8xl mb-4">
              {typeof getAvatarForUser(profile) === 'string' && getAvatarForUser(profile).length <= 4 
                ? getAvatarForUser(profile) 
                : '👤'
              }
            </div>
            <div className="flex gap-2 justify-center md:justify-start">
              {!isOwnProfile && (
                <>
                  <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
                    <MessageCircle size={16} />
                    Message
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Share size={16} />
                    Share
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {profile.username || `${profile.firstName} ${profile.lastName}`}
                </h1>
                <p className="text-emerald-600 font-medium text-lg">
                  {getRelationToCurrentUser(profile)}
                </p>
              </div>
              {isOwnProfile && (
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <Edit3 size={16} />
                  Edit Profile
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {profile.dob && (
                <div className="flex items-center gap-3">
                  <Calendar className="text-gray-400" size={20} />
                  <span className="text-gray-600">Born {new Date(profile.dob).toLocaleDateString()}</span>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="text-gray-400" size={20} />
                  <span className="text-gray-600">{profile.location}</span>
                </div>
              )}
            </div>

            {profile.bio && (
              <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
            )}
          </div>
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
            tab="timeline" 
            label="Timeline" 
            isActive={activeTab === 'timeline'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            tab="photos" 
            label="Photos" 
            isActive={activeTab === 'photos'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            tab="family" 
            label="Family" 
            isActive={activeTab === 'family'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            tab="memories" 
            label="Memories" 
            isActive={activeTab === 'memories'} 
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
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Life Timeline</h2>
                {isOwnProfile && (
                  <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
                    <Plus size={16} />
                    Add Event
                  </button>
                )}
              </div>
              
              <div className="space-y-6">
                {timeline.length > 0 ? (
                  timeline.map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                          <span className="text-xl">{event.icon}</span>
                        </div>
                        {index < timeline.length - 1 && (
                          <div className="w-px h-16 bg-gray-200 mx-auto mt-2"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 pb-8">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-800 mb-1">{event.title}</h3>
                          <p className="text-sm text-gray-500 mb-2">
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                          <p className="text-gray-700">{event.description}</p>
                          
                          {event.images && event.images.length > 0 && (
                            <div className="mt-3">
                              <img 
                                src={event.images[0]} 
                                alt={event.title}
                                className="w-full max-w-sm h-48 object-cover rounded-lg"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600">No timeline events yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Photo Gallery</h2>
              {isOwnProfile && (
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
                  <Camera size={16} />
                  Upload Photo
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.length > 0 ? (
                photos.map((photo) => (
                  <motion.div
                    key={photo._id || photo.id}
                    whileHover={{ scale: 1.05 }}
                    className="relative group cursor-pointer"
                  >
                    <img
                      src={photo.url}
                      alt={photo.originalName || 'Photo'}
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-end">
                      <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <h3 className="font-semibold">{photo.originalName || 'Photo'}</h3>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Camera className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600">No photos uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'family' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Family Connections</h2>
            <div className="text-center py-12">
              <User className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">Family connections will be displayed here</p>
            </div>
          </div>
        )}

        {activeTab === 'memories' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Shared Memories</h2>
              {isOwnProfile && (
                <div className="flex gap-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Image size={16} />
                    Add Photo
                  </button>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                    <Video size={16} />
                    Add Video
                  </button>
                </div>
              )}
            </div>
            
            <div className="text-center py-12">
              <Heart className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">Start creating beautiful memories together</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;