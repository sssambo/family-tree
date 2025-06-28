import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Edit3, MessageCircle, Share } from 'lucide-react';

const ProfileHeader = ({ 
  profile, 
  currentUser, 
  isOwnProfile, 
  getAvatarForUser, 
  getRelationToCurrentUser 
}) => {
  return (
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
  );
};

export default ProfileHeader;