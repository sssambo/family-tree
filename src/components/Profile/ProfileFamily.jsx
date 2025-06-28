import React from 'react';
import { User } from 'lucide-react';

const ProfileFamily = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Family Connections</h2>
      <div className="text-center py-12">
        <User className="mx-auto text-gray-400 mb-4" size={48} />
        <p className="text-gray-600">Family connections will be displayed here</p>
      </div>
    </div>
  );
};

export default ProfileFamily;