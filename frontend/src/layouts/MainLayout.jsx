import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  const mainRef = useRef(null);
  const location = useLocation();
  
  // Page transition effect
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Page enter animation
      gsap.fromTo(
        ".page-content",
        { 
          opacity: 0,
          y: 50 
        },
        { 
          opacity: 1,
          y: 0,
          duration: 0.6,
          clearProps: "all"
        }
      );
    }, mainRef);
    
    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <motion.main 
        ref={mainRef}
        className="flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="page-content">
          <Outlet />
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default MainLayout;