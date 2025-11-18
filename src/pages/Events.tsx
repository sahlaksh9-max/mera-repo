import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Users, ArrowRight, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSupabaseData } from "@/lib/supabaseHelpers";

interface Event {
  id: string;
  title: string;
  description: string;
  fullContent: string;
  category: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  attendees: number;
  published: boolean;
}

interface Category {
  id: string;
  name: string;
  color: string;
  description: string;
}

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadData = async () => {
    try {
      const eventsData = await getSupabaseData<Event[]>('royal-academy-events', []);
      const categoriesData = await getSupabaseData<Category[]>('royal-academy-event-categories', []);
      
      const publishedEvents = eventsData.filter(e => e.published);
      
      const sortedEvents = publishedEvents.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
      
      setEvents(sortedEvents);
      setCategories(categoriesData);
      setLoading(false);
    } catch (error) {
      console.error("Error loading events:", error);
      setEvents([]);
      setCategories([]);
      setLoading(false);
    }
  };

  const filteredEvents = selectedCategory === "all" 
    ? events 
    : events.filter(e => e.category === selectedCategory);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingEvents = filteredEvents.filter(e => {
    const eventDate = new Date(e.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });
  
  const pastEvents = filteredEvents.filter(e => {
    const eventDate = new Date(e.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate < today;
  });

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || "#3b82f6";
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal/20 via-background to-crimson/20"></div>
        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              Events & <span className="text-gradient-gold">News</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Stay connected with the vibrant life at Royal Academy through our exciting events, achievements, and community activities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Event Categories Filter */}
      <section className="section-padding bg-gradient-to-r from-royal/5 via-background to-crimson/5">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory("all")}
              className={`px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 border-2 ${
                selectedCategory === "all" 
                  ? "bg-gradient-to-r from-royal to-gold text-white border-gold" 
                  : "bg-card text-foreground border-border hover:border-gold/50"
              }`}
            >
              All Events
            </motion.button>
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: (index + 1) * 0.1 }}
                onClick={() => setSelectedCategory(category.name)}
                style={{
                  backgroundColor: selectedCategory === category.name ? category.color : undefined,
                  color: selectedCategory === category.name ? "white" : undefined
                }}
                className={`px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 border-2 ${
                  selectedCategory === category.name 
                    ? "border-gold" 
                    : "bg-card text-foreground border-border hover:border-gold/50"
                }`}
              >
                {category.name}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {loading ? (
        <section className="section-padding">
          <div className="container-wide text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        </section>
      ) : (
        <>
          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <section className="section-padding bg-gradient-to-b from-background to-muted/20">
              <div className="container-wide">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl font-heading font-bold mb-6">Upcoming Events</h2>
                  <p className="text-xl text-muted-foreground">Don't miss these exciting upcoming activities</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {upcomingEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="card-3d overflow-hidden group cursor-pointer"
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      {event.imageUrl && (
                        <div className="h-48 relative overflow-hidden">
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-6 right-6 rounded-lg px-3 py-1" style={{ backgroundColor: `${getCategoryColor(event.category)}20` }}>
                            <span className="text-white text-sm font-medium" style={{ color: getCategoryColor(event.category), filter: "brightness(1.5)" }}>
                              {event.category}
                            </span>
                          </div>
                          <div className="absolute bottom-6 left-6 right-6">
                            <h3 className="text-2xl font-heading font-bold text-white mb-2">{event.title}</h3>
                          </div>
                        </div>
                      )}

                      {!event.imageUrl && (
                        <div className="h-48 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${getCategoryColor(event.category)}40, ${getCategoryColor(event.category)}20)` }}>
                          <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md rounded-lg px-3 py-1">
                            <span className="text-white text-sm font-medium">{event.category}</span>
                          </div>
                          <div className="absolute bottom-6 left-6 right-6">
                            <h3 className="text-2xl font-heading font-bold text-white mb-2">{event.title}</h3>
                          </div>
                        </div>
                      )}

                      <div className="p-6 space-y-4">
                        <p className="text-muted-foreground leading-relaxed line-clamp-2">{event.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <Calendar className="h-4 w-4 text-gold" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <Clock className="h-4 w-4 text-gold" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <MapPin className="h-4 w-4 text-gold" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <Users className="h-4 w-4 text-gold" />
                            <span>{event.attendees} Expected</span>
                          </div>
                        </div>

                        <motion.div whileHover={{ scale: 1.05 }}>
                          <Button className="w-full bg-gradient-to-r from-royal to-gold text-white">
                            Learn More
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Past Events & News */}
          {pastEvents.length > 0 && (
            <section className="section-padding bg-gradient-to-r from-royal/5 via-background to-crimson/5">
              <div className="container-wide">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl font-heading font-bold mb-6">Past Events</h2>
                  <p className="text-xl text-muted-foreground">Celebrating our recent achievements and events</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {pastEvents.slice(0, 6).map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.05, y: -10 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="card-3d p-6 cursor-pointer"
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm" style={{ color: getCategoryColor(event.category) }}>
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${getCategoryColor(event.category)}20`, color: getCategoryColor(event.category) }}>
                            {event.category}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-heading font-semibold">{event.title}</h3>
                        <p className="text-muted-foreground leading-relaxed line-clamp-3">{event.description}</p>
                        
                        <Button variant="outline" className="w-full">
                          View Details
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* No Events Message */}
          {filteredEvents.length === 0 && (
            <section className="section-padding">
              <div className="container-wide text-center py-16">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-2xl font-heading font-bold mb-2">No Events Found</h3>
                <p className="text-muted-foreground">
                  {selectedCategory === "all" 
                    ? "There are no published events at the moment. Check back soon!" 
                    : `No events found in the ${selectedCategory} category.`}
                </p>
                {selectedCategory !== "all" && (
                  <Button 
                    onClick={() => setSelectedCategory("all")}
                    className="mt-6 bg-gradient-to-r from-royal to-gold text-white"
                  >
                    View All Events
                  </Button>
                )}
              </div>
            </section>
          )}
        </>
      )}

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

export default Events;
