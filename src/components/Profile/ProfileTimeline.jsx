import React from 'react';
import { Calendar, Plus } from 'lucide-react';

const ProfileTimeline = ({ timeline, isOwnProfile, getEventIcon }) => {
  return (
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
  );
};

export default ProfileTimeline;