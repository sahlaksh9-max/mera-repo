import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, ArrowLeft, Share2 } from "lucide-react";
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

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    try {
      const events = await getSupabaseData<Event[]>('royal-academy-events', []);
      const foundEvent = events.find(e => e.id === eventId && e.published);
      
      if (foundEvent) {
        setEvent(foundEvent);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading event:", error);
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!event) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
        alert('Unable to share this event. Please copy the URL manually.');
      }
    } else {
      alert('Sharing is not supported on this browser.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading event...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-heading font-bold mb-4">Event Not Found</h1>
            <p className="text-muted-foreground mb-8">The event you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/events')} className="bg-gradient-to-r from-royal to-gold text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 sm:py-16">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/events')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Event Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-sm font-medium">
                {event.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-sm font-medium">
                Published
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              {event.title}
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Event Image */}
          {event.imageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 rounded-xl overflow-hidden shadow-lg"
            >
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-64 sm:h-96 object-cover"
              />
            </motion.div>
          )}

          {/* Event Details Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 p-6 bg-card border border-border rounded-xl"
          >
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-semibold text-foreground">{new Date(event.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-semibold text-foreground">{event.time}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-semibold text-foreground">{event.location}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Users className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Expected Attendees</p>
                <p className="font-semibold text-foreground">{event.attendees} people</p>
              </div>
            </div>
          </motion.div>

          {/* Full Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="prose prose-lg dark:prose-invert max-w-none mb-8"
          >
            <h2 className="text-2xl font-heading font-bold mb-4">About This Event</h2>
            <div className="text-foreground leading-relaxed whitespace-pre-wrap">
              {event.fullContent || event.description}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button 
              onClick={handleShare}
              variant="outline"
              className="flex-1"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Event
            </Button>
            <Button 
              onClick={() => navigate('/contact')}
              className="flex-1 bg-gradient-to-r from-royal to-gold text-white"
            >
              Contact Us for More Information
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventDetail;
