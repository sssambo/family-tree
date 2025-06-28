import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { userAPI, mediaAPI, eventAPI } from '../api/api-calls';
import { useAuth } from '../contexts/AuthContext';
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfileTabs from '../components/Profile/ProfileTabs';
import ProfileTimeline from '../components/Profile/ProfileTimeline';
import ProfilePhotos from '../components/Profile/ProfilePhotos';
import ProfileFamily from '../components/Profile/ProfileFamily';
import ProfileMemories from '../components/Profile/ProfileMemories';

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
      <ProfileHeader 
        profile={profile}
        currentUser={currentUser}
        isOwnProfile={isOwnProfile}
        getAvatarForUser={getAvatarForUser}
        getRelationToCurrentUser={getRelationToCurrentUser}
      />

      <ProfileTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {activeTab === 'timeline' && (
          <ProfileTimeline 
            timeline={timeline}
            isOwnProfile={isOwnProfile}
            getEventIcon={getEventIcon}
          />
        )}

        {activeTab === 'photos' && (
          <ProfilePhotos 
            photos={photos}
            isOwnProfile={isOwnProfile}
          />
        )}

        {activeTab === 'family' && <ProfileFamily />}

        {activeTab === 'memories' && (
          <ProfileMemories isOwnProfile={isOwnProfile} />
        )}
      </motion.div>
    </div>
  );
};

export default Profile;