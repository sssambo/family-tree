import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TreePine, 
  Users, 
  Plus, 
  Search, 
  Filter,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { treeAPI, userAPI } from '../api/api-calls';

const FamilyTree = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFamilyTree();
    }
  }, [user]);

  const fetchFamilyTree = async () => {
    try {
      setLoading(true);
      const response = await treeAPI.getFamilyTree(user._id || user.id, 3, 'hierarchy');
      
      // Transform API response to component format
      const members = response.data?.nodes?.map((node, index) => ({
        id: node._id || node.id,
        name: node.username || `${node.firstName} ${node.lastName}`,
        relation: getRelationToUser(node, user),
        avatar: getAvatarForUser(node),
        generation: node.generation || 0,
        x: 200 + (index % 3) * 200,
        y: 200 + Math.floor(index / 3) * 150,
        children: node.children || [],
        parents: node.parents || [],
        ...node
      })) || [];

      setFamilyMembers(members);
    } catch (error) {
      console.error('Error fetching family tree:', error);
      // Use fallback data
      setFamilyMembers([
        {
          id: user._id || user.id,
          name: user.username || `${user.firstName} ${user.lastName}`,
          relation: 'You',
          avatar: '👨‍💼',
          generation: 0,
          x: 400,
          y: 300,
          children: [],
          parents: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getRelationToUser = (member, currentUser) => {
    if (member._id === currentUser._id || member.id === currentUser.id) {
      return 'You';
    }
    // This would be determined by the relationship data from the API
    return member.relation || 'Family Member';
  };

  const getAvatarForUser = (member) => {
    const avatars = {
      male: '👨‍💼',
      female: '👩‍💼',
      other: '👤'
    };
    return avatars[member.gender] || '👤';
  };

  const TreeNode = ({ member, isSelected, onClick }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
        isSelected ? 'z-20' : 'z-10'
      }`}
      style={{ left: member.x, top: member.y }}
      onClick={() => onClick(member)}
    >
      <div className={`bg-white rounded-xl shadow-lg p-4 border-2 transition-all ${
        isSelected 
          ? 'border-emerald-500 shadow-emerald-200' 
          : 'border-gray-200 hover:border-emerald-300'
      }`}>
        <div className="text-center">
          <div className="text-3xl mb-2">{member.avatar}</div>
          <h3 className="font-semibold text-gray-800 text-sm">{member.name}</h3>
          <p className="text-xs text-gray-600">{member.relation}</p>
        </div>
      </div>
    </motion.div>
  );

  const ConnectionLine = ({ from, to }) => (
    <svg className="absolute inset-0 pointer-events-none z-0">
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke="#10b981"
        strokeWidth="2"
        className="opacity-60"
      />
    </svg>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TreePine className="text-emerald-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">Family Tree</h1>
          </div>
          <button className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all flex items-center gap-2">
            <Plus size={20} />
            Add Member
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search family members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={20} className="text-gray-600" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <ZoomIn size={20} className="text-gray-600" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <ZoomOut size={20} className="text-gray-600" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <RotateCcw size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Tree Visualization */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="relative h-96 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg overflow-hidden">
              {/* Connection Lines */}
              {familyMembers.map(member => (
                <div key={member.id}>
                  {member.parents?.map(parentId => {
                    const parent = familyMembers.find(m => m.id === parentId);
                    return parent ? (
                      <ConnectionLine key={`${member.id}-${parentId}`} from={member} to={parent} />
                    ) : null;
                  })}
                </div>
              ))}

              {/* Family Members */}
              {familyMembers.map(member => (
                <TreeNode
                  key={member.id}
                  member={member}
                  isSelected={selectedMember?.id === member.id}
                  onClick={setSelectedMember}
                />
              ))}

              {/* Center indicator */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-500 rounded-full opacity-50"></div>
            </div>
          </div>
        </motion.div>

        {/* Member Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {selectedMember ? 'Member Details' : 'Family Overview'}
            </h2>
            
            {selectedMember ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-6xl mb-2">{selectedMember.avatar}</div>
                  <h3 className="text-xl font-semibold text-gray-800">{selectedMember.name}</h3>
                  <p className="text-gray-600">{selectedMember.relation}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">Generation: {selectedMember.generation}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-gray-800 mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full bg-emerald-50 text-emerald-600 py-2 rounded-lg hover:bg-emerald-100 transition-colors">
                      View Profile
                    </button>
                    <button className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                      Add Relationship
                    </button>
                    <button className="w-full bg-purple-50 text-purple-600 py-2 rounded-lg hover:bg-purple-100 transition-colors">
                      Share Memory
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 mb-4">
                  Click on any family member to see their details and connections.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Tree Stats</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Members:</span>
                      <span className="font-semibold ml-1">{familyMembers.length}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Generations:</span>
                      <span className="font-semibold ml-1">3</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FamilyTree;