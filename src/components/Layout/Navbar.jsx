import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TreePine, 
  User, 
  Bell, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Users,
  Home
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const NavLink = ({ to, icon: Icon, children, badge = null }) => (
    <Link
      to={to}
      className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-white/10 hover:text-white"
      onClick={() => setIsOpen(false)}
    >
      <Icon size={18} />
      <span className="font-medium">{children}</span>
      {badge && (
        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );

  return (
    <nav className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <TreePine className="text-emerald-200" size={24} />
            <span>Family Tree</span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-6 text-white">
              <NavLink to="/dashboard" icon={Home}>Dashboard</NavLink>
              <NavLink to="/tree" icon={TreePine}>Tree</NavLink>
              <NavLink to="/relationships" icon={Users}>Relationships</NavLink>
              <NavLink to="/notifications" icon={Bell} badge={unreadCount > 0 ? unreadCount : null}>
                Notifications
              </NavLink>
              <NavLink to="/settings" icon={Settings}>Settings</NavLink>
              
              {/* User Menu */}
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/20">
                <Link to={`/profile/${user?.id}`} className="flex items-center gap-2 hover:opacity-80">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <span className="font-medium">{user?.firstName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/20 py-4"
            >
              {isAuthenticated ? (
                <div className="flex flex-col gap-2 text-white">
                  <NavLink to="/dashboard" icon={Home}>Dashboard</NavLink>
                  <NavLink to="/tree" icon={TreePine}>Tree</NavLink>
                  <NavLink to="/relationships" icon={Users}>Relationships</NavLink>
                  <NavLink to="/notifications" icon={Bell} badge={unreadCount > 0 ? unreadCount : null}>
                    Notifications
                  </NavLink>
                  <NavLink to={`/profile/${user?.id}`} icon={User}>Profile</NavLink>
                  <NavLink to="/settings" icon={Settings}>Settings</NavLink>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 text-left"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 text-white">
                  <Link to="/" onClick={() => setIsOpen(false)} className="px-4 py-2 hover:bg-white/10 rounded-lg">
                    Home
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;