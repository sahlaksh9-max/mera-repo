import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import OptimizedGallery from "@/components/OptimizedGallery";

const Gallery = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      // Show scroll button when user has scrolled 400px OR is near the bottom of the page
      const scrolled = window.scrollY;
      const threshold = 400;
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000;
      
      setShowScrollTop(scrolled > threshold || nearBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal/20 via-background to-crimson/20"></div>
        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-bold mb-4 sm:mb-6">
              Visual <span className="text-gradient-gold">Gallery</span>
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
              Explore life at Harsh kumar sah through our comprehensive photo gallery showcasing campus, academics, and student life.
            </p>
          </motion.div>
        </div>
      </section>

      <OptimizedGallery />
      
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-gold hover:bg-gold/90 text-black shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-6 w-6" />
        </motion.button>
      )}
      
      <Footer />
    </div>
  );
};

export default Gallery;
