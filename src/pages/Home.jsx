import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TreePine, Users, Heart, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/Auth/LoginForm';
import SignupForm from '../components/Auth/SignupForm';
import GoogleSignInButton from '../components/Auth/GoogleSignInButton';

const Home = () => {
  const [activeTab, setActiveTab] = useState('login');
  const { isAuthenticated } = useAuth();

  const handleGoogleSuccess = () => {
    // Google login success is handled in the AuthContext
    // User will be redirected automatically when authentication state changes
  };

  const handleGoogleError = (error) => {
    console.error('Google Sign-In error:', error);
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <TreePine className="mx-auto text-emerald-600 mb-4" size={64} />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Your Family Tree</h1>
          <p className="text-xl text-gray-600 mb-8">Start exploring your family connections</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto"
            onClick={() => window.location.href = '/dashboard'}
          >
            Go to Dashboard <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-blue-600/20 to-purple-600/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <TreePine className="text-emerald-600" size={40} />
                <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Family Tree
                </h1>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Connect Your Family Stories
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Build, explore, and celebrate your family heritage with our interactive family tree platform. 
                Connect with relatives, share memories, and preserve your family's unique story for future generations.
              </p>
              
              {/* Features */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Users, title: 'Connect Family', desc: 'Find and connect with relatives' },
                  { icon: Heart, title: 'Share Memories', desc: 'Preserve family stories and photos' },
                  { icon: Shield, title: 'Privacy First', desc: 'Your data is secure and private' },
                  { icon: Sparkles, title: 'Interactive Tree', desc: 'Beautiful visualization of your family' }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg"
                  >
                    <feature.icon className="text-emerald-600 mt-1" size={20} />
                    <div>
                      <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Auth Forms */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8"
            >
              <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                    activeTab === 'login'
                      ? 'bg-white text-emerald-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setActiveTab('signup')}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                    activeTab === 'signup'
                      ? 'bg-white text-emerald-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'login' ? <LoginForm /> : <SignupForm />}
                
                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Google Sign-In Button */}
                <GoogleSignInButton 
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Our Family Tree?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with thoughtful design to help you 
              build meaningful connections with your family heritage.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: TreePine,
                title: 'Interactive Visualization',
                description: 'Explore your family tree with beautiful, interactive graphics that make discovering connections intuitive and engaging.',
                color: 'from-emerald-500 to-teal-500'
              },
              {
                icon: Users,
                title: 'Smart Connections',
                description: 'Our intelligent matching system helps you find and connect with relatives you never knew existed.',
                color: 'from-blue-500 to-indigo-500'
              },
              {
                icon: Heart,
                title: 'Memory Preservation',
                description: 'Upload photos, stories, and documents to create a rich, multimedia family history that lasts generations.',
                color: 'from-purple-500 to-pink-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                  <feature.icon className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;