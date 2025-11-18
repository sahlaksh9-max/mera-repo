import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getSupabaseData } from "@/lib/supabaseHelpers";

const LoadingAnimation = () => {
  const [brandingData, setBrandingData] = useState({
    schoolName: "Royal Academy",
    tagline: "Preparing minds for the future",
    logoUrl: "/placeholder.svg"
  });

  useEffect(() => {
    // Load branding data from Supabase
    getSupabaseData('royal-academy-branding', {
      schoolName: "Royal Academy",
      tagline: "Preparing minds for the future",
      logoUrl: "/placeholder.svg"
    }).then(data => {
      setBrandingData({
        schoolName: data.schoolName || "Royal Academy",
        tagline: data.tagline || "Preparing minds for the future",
        logoUrl: data.logoUrl || "/placeholder.svg"
      });
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-background z-[100] flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.5,
            delay: 0.2
          }}
          className="relative"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-24 h-24 mx-auto mb-6 relative"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gold to-yellow-500 opacity-20 animate-ping"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center">
              <svg 
                className="w-12 h-12 text-black" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                />
              </svg>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: 0.5,
              delay: 0.5
            }}
            className="text-3xl font-heading font-bold text-gradient-gold mb-2"
          >
            {brandingData.schoolName}
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: 0.5,
              delay: 0.7
            }}
            className="text-muted-foreground"
          >
            {brandingData.tagline}
          </motion.p>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 1.5,
              delay: 1,
              ease: "easeInOut"
            }}
            className="h-1 bg-gradient-to-r from-gold to-yellow-500 mt-8 rounded-full mx-auto"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingAnimation;