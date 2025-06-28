import React from 'react';
import { motion } from 'framer-motion';

const ProfileTabs = ({ activeTab, setActiveTab }) => {
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

  return (
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
  );
};

export default ProfileTabs;