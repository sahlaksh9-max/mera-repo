import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FacilitiesBanner from "@/components/FacilitiesBanner";
import { motion } from "framer-motion";
import { BookOpen, Beaker, Dumbbell, Theater, Cpu, Heart, Coffee, Car, ArrowUp } from "lucide-react";
import { getSupabaseData, subscribeToSupabaseChanges } from "@/lib/supabaseHelpers";

const iconMap: { [key: string]: any } = {
  BookOpen, Beaker, Dumbbell, Theater, Cpu, Heart, Coffee, Car
};

interface Facility {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  image: string;
}

interface Stat {
  id: string;
  value: string;
  label: string;
}

const Facilities = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    loadData();
    
    const unsubFacilities = subscribeToSupabaseChanges<Facility[]>(
      'royal-academy-facilities',
      (newData) => setFacilities(newData)
    );
    
    const unsubStats = subscribeToSupabaseChanges<Stat[]>(
      'royal-academy-facility-stats',
      (newData) => setStats(newData)
    );
    
    return () => {
      unsubFacilities();
      unsubStats();
    };
  }, []);

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

  const loadData = async () => {
    try {
      const defaultFacilities: Facility[] = [
        {
          id: '1',
          icon: 'BookOpen',
          title: 'Royal Library',
          description: 'A magnificent 3-story library with over 100,000 books, digital resources, and quiet study spaces.',
          features: ['Digital Archives', 'Research Stations', 'Group Study Rooms', 'Reading Gardens'],
          image: 'bg-gradient-to-br from-blue-600/20 to-purple-600/20'
        },
        {
          id: '2',
          icon: 'Beaker',
          title: 'Science Laboratories',
          description: 'State-of-the-art labs for Biology, Chemistry, Physics, and Environmental Science research.',
          features: ['Advanced Equipment', 'Safety Systems', 'Research Facilities', 'Greenhouse Complex'],
          image: 'bg-gradient-to-br from-green-600/20 to-blue-600/20'
        },
        {
          id: '3',
          icon: 'Cpu',
          title: 'Technology Center',
          description: 'Modern computer labs with latest hardware, robotics workshop, and maker spaces.',
          features: ['3D Printing Lab', 'Robotics Workshop', 'Computer Labs', 'Innovation Studio'],
          image: 'bg-gradient-to-br from-purple-600/20 to-pink-600/20'
        },
        {
          id: '4',
          icon: 'Dumbbell',
          title: 'Athletic Complex',
          description: 'Comprehensive sports facilities including gymnasium, swimming pool, and outdoor fields.',
          features: ['Olympic Pool', 'Fitness Center', 'Sports Fields', 'Indoor Courts'],
          image: 'bg-gradient-to-br from-orange-600/20 to-red-600/20'
        },
        {
          id: '5',
          icon: 'Theater',
          title: 'Performing Arts Center',
          description: 'Professional-grade theater, music halls, and practice rooms for artistic excellence.',
          features: ['Main Theater', 'Concert Hall', 'Practice Rooms', 'Recording Studio'],
          image: 'bg-gradient-to-br from-pink-600/20 to-purple-600/20'
        },
        {
          id: '6',
          icon: 'Heart',
          title: 'Health & Wellness Center',
          description: 'Complete healthcare facility with medical staff, counseling services, and wellness programs.',
          features: ['Medical Clinic', 'Counseling Center', 'Wellness Programs', 'Nutrition Services'],
          image: 'bg-gradient-to-br from-red-600/20 to-pink-600/20'
        },
        {
          id: '7',
          icon: 'Coffee',
          title: 'Student Commons',
          description: 'Central hub for student life with dining facilities, lounges, and collaborative spaces.',
          features: ['Dining Hall', 'Student Lounges', 'Collaborative Spaces', 'Outdoor Terraces'],
          image: 'bg-gradient-to-br from-yellow-600/20 to-orange-600/20'
        },
        {
          id: '8',
          icon: 'Car',
          title: 'Transportation',
          description: 'Safe and reliable transportation services connecting students to the academy.',
          features: ['School Buses', 'Shuttle Service', 'Parking Facilities', 'Bike Storage'],
          image: 'bg-gradient-to-br from-blue-600/20 to-green-600/20'
        }
      ];

      const defaultStats: Stat[] = [
        { id: '1', value: '150', label: 'Acres Campus' },
        { id: '2', value: '50+', label: 'Modern Facilities' },
        { id: '3', value: '24/7', label: 'Security & Support' },
        { id: '4', value: '100%', label: 'WiFi Coverage' }
      ];

      const facs = await getSupabaseData<Facility[]>('royal-academy-facilities', defaultFacilities);
      const sts = await getSupabaseData<Stat[]>('royal-academy-facility-stats', defaultStats);
      
      setFacilities(facs);
      setStats(sts);
    } catch (error) {
      console.error('[Facilities] Error loading data:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Banner with PixelBlast */}
      <div className="pt-20 sm:pt-24">
        <FacilitiesBanner />
      </div>

      {/* Campus Stats */}
      <section className="section-padding bg-gradient-to-r from-royal/5 via-background to-crimson/5">
        <div className="container-wide px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-12 sm:mb-20">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  rotateY: 15 
                }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300
                }}
                className="card-3d p-4 sm:p-8 text-center group cursor-pointer"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 300 }}
                  className="text-2xl sm:text-5xl font-heading font-bold text-gradient-gold mb-2 sm:mb-4"
                >
                  {stat.value}
                </motion.div>
                <p className="text-xs sm:text-lg text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="section-padding bg-gradient-to-b from-background to-muted/20">
        <div className="container-wide px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-4xl font-heading font-bold mb-4 sm:mb-6">Our Facilities</h2>
            <p className="text-base sm:text-xl text-muted-foreground px-2 sm:px-0">Discover the spaces where excellence comes to life</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {facilities.map((facility, index) => {
              const IconComponent = iconMap[facility.icon] || BookOpen;
              return (
                <motion.div
                  key={facility.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ 
                    scale: 1.02, 
                    rotateY: 5,
                    z: 50 
                  }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 300
                  }}
                  className="card-3d overflow-hidden group cursor-pointer"
                >
                  <div className="relative">
                    {/* Image/Background */}
                    <div className={`h-40 sm:h-48 ${facility.image} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.6 }}
                        className="absolute top-4 sm:top-6 left-4 sm:left-6 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gold/20 backdrop-blur-md flex items-center justify-center"
                      >
                        <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-gold" />
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6"
                      >
                        <h3 className="text-xl sm:text-2xl font-heading font-bold text-white mb-2">{facility.title}</h3>
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{facility.description}</p>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gold text-sm sm:text-base">Key Features:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {facility.features.map((feature, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 + idx * 0.05 }}
                              className="flex items-center space-x-2"
                            >
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gold"></div>
                              <span className="text-xs sm:text-sm text-muted-foreground">{feature}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Virtual Tour CTA */}
      <section className="section-padding">
        <div className="container-wide px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.6 }}
            className="text-center bg-gradient-to-r from-royal/10 via-crimson/5 to-royal/10 p-8 sm:p-16 rounded-2xl border border-border cursor-pointer"
          >
            <h3 className="text-2xl sm:text-4xl font-heading font-bold mb-4 sm:mb-6">Take a Virtual Tour</h3>
            <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto px-2 sm:px-0">
              Experience our campus from anywhere in the world. Schedule a virtual tour to see our facilities in action.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-hero px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold rounded-lg w-full sm:w-auto"
            >
              Schedule Virtual Tour
            </motion.button>
          </motion.div>
        </div>
      </section>

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

export default Facilities;
