import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Heart, Zap, MapPin, FileText, Phone, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Chatbot from '@/components/Chatbot';

import Footer from '@/components/Footer';

import { useUser } from '@clerk/clerk-react';


const HomePage = () => {
  const user = useUser();
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="overflow-hidden">
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-red-50">
        {/* Enhanced Hero Section with Image */}
        <motion.section 
          className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-red-50 py-12 md:py-16 px-4 md:px-8 lg:px-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-100 opacity-40 blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-red-100 opacity-40 blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-700 font-medium">Smart Healthcare Assistant</span>
                </motion.div>

                <motion.h1 
  className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
  initial={{ y: -30, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.7 }}
>
  <span className="bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
    MediAid
  </span>
  <span className="block text-gray-700 text-3xl md:text-4xl lg:text-5xl mt-4">
    Medicine Finder & Symptom Analyser
  </span>
</motion.h1>

                <motion.p 
                  className="text-lg text-gray-600 max-w-xl"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                >
                  Find medicines easily and get AI-powered symptom analysis to help you make informed healthcare decisions.
                </motion.p>

                {/* <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link to="/emergency-sos">
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white px-8 py-6 rounded-full
                        flex items-center gap-2 text-lg transform transition-transform hover:scale-105"
                    >
                      Emergency SOS
                      <Zap className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Button 
                    variant="outline"
                    className="border-2 border-blue-200 hover:border-blue-300 px-8 py-6 rounded-full
                      flex items-center gap-2 text-lg text-blue-700"
                  >
                    <Link to="/dashboard" className="flex items-center gap-2">
                      Open Dashboard
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </Button>
                </motion.div>

                {/* Feature List */}
                {/* <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="grid grid-cols-2 gap-6 pt-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Heart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-800">Trusted by Hospitals</p>
                      <p className="text-sm text-gray-600">Nationwide coverage</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Zap className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-red-800">24/7 Response</p>
                      <p className="text-sm text-gray-600">Instant assistance</p>
                    </div>
                  </div>
                </motion.div> */} 
              </div>

              {/* Right Image/Illustration */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-red-100 rounded-full blur-3xl"></div>
                <div className="relative bg-white p-4 rounded-2xl shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-300">
                  <div className="aspect-square rounded-xl overflow-hidden">
                    <img
                      src="https://assets-v2.lottiefiles.com/a/99e9a756-1173-11ee-b80d-079e4ff5a04b/nFNzeD4q6E.gif"
                      alt="Emergency medical response"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Floating Stats Card */}
                  <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Every second</p>
                        <p className="text-xl font-bold text-blue-800">matters</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Features Section with tighter spacing */}
        <motion.section 
          variants={container}
          initial="hidden"
          animate="show"
          className="py-12 px-4 md:px-8 lg:px-16 bg-white/80 backdrop-blur-sm relative"
        >
          {/* Subtle background elements */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-50 opacity-70"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-red-50 opacity-70"></div>
          </div>
          
          <div className="relative z-10 mb-16">
            <motion.h2 
              variants={item}
              className="text-2xl font-bold text-center mb-2 text-gray-800"
            >
              Healthcare Features
            </motion.h2>
            
            <motion.p
              variants={item}
              className="text-center text-gray-600 max-w-2xl mx-auto mb-8 text-sm"
            >
              Comprehensive healthcare tools designed to help you find medicines and analyze symptoms with ease
            </motion.p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
              {/* Emergency SOS */}
              {/* <motion.div
                variants={item}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Link to="/emergency-sos">
                  <Card className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-none h-full">
                    <CardContent className="p-2">
                      <div className="flex items-start gap-3">
                        <div className="bg-white/80 p-2 rounded-lg">
                          <Zap className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1 text-gray-800">Emergency SOS</h3>
                          <p className="text-gray-700 text-sm">One-tap emergency alert system with location sharing</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div> */}

              {/* Hospital Locator */}
              {/* <motion.div
                variants={item}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Link to="/hospital-locator">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-none h-full">
                    <CardContent className="p-2">
                      <div className="flex items-start gap-3">
                        <div className="bg-white/80 p-2 rounded-lg">
                          <MapPin className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1 text-gray-800">Hospital Locator</h3>
                          <p className="text-gray-700 text-sm">Find nearby hospitals with real-time wait times</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div> */}

              {/* Symptom Checker */}
              <motion.div
                variants={item}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Link to="/symptom-checker">
                  <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-none h-full">
                    <CardContent className="p-2">
                      <div className="flex items-start gap-3">
                        <div className="bg-white/80 p-2 rounded-lg">
                          <Heart className="h-6 w-6 text-emerald-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1 text-gray-800">Symptom Checker</h3>
                          <p className="text-gray-700 text-sm">AI-powered symptom analysis and recommendations</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>

              {/* First Aid Guides */}
              <motion.div
                variants={item}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Link to="/first-aid-guide">
                  <Card className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-none h-full">
                    <CardContent className="p-2">
                      <div className="flex items-start gap-3">
                        <div className="bg-white/80 p-2 rounded-lg">
                          <FileText className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1 text-gray-800">First Aid Guides</h3>
                          <p className="text-gray-700 text-sm">Step-by-step emergency first aid instructions</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>

              {/* Live Assistance */}
              {/* <motion.div
                variants={item}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Link to="/videocall">
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-none h-full">
                    <CardContent className="p-2">
                      <div className="flex items-start gap-3">
                        <div className="bg-white/80 p-2 rounded-lg">
                          <Phone className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1 text-gray-800">Live Assistance</h3>
                          <p className="text-gray-700 text-sm">Connect with medical professionals instantly</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div> */}
              
              {/* Add a sixth card to complete two rows of 3 on large screens */}
              <motion.div
                variants={item}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Link to="/medicines">
                  <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-none h-full">
                    <CardContent className="p-2">
                      <div className="flex items-start gap-3">
                        <div className="bg-white/80 p-2 rounded-lg">
                          <FileText className="h-6 w-6 text-indigo-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1 text-gray-800">Medicines</h3>
                          <p className="text-gray-700 text-sm">Order Emergency Medicines</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.section>
        {/* <Chatbot /> */}
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;