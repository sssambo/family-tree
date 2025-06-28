import React from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

const ProfilePhotos = ({ photos, isOwnProfile }) => {
  return (
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
  );
};

export default ProfilePhotos;