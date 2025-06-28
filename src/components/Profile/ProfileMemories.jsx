import React from 'react';
import { Heart, Image, Video } from 'lucide-react';

const ProfileMemories = ({ isOwnProfile }) => {
  return (
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
  );
};

export default ProfileMemories;