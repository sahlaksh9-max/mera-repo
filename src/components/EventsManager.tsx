
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Upload,
  Eye,
  Calendar,
  Clock,
  MapPin,
  Users,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getSupabaseData, setSupabaseData } from "@/lib/supabaseHelpers";

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

const EventsManager = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [message, setMessage] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    loadEvents();
    loadCategories();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await getSupabaseData<Event[]>('royal-academy-events', []);
      setEvents(data);
    } catch (error) {
      console.error("Error loading events:", error);
      setEvents([]);
      setMessage("Error loading events. Please refresh the page.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await getSupabaseData<Category[]>('royal-academy-event-categories', []);
      if (data.length === 0) {
        const defaultCategories: Category[] = [
          { id: "academic", name: "Academic", color: "#3b82f6", description: "Academic events and programs" },
          { id: "sports", name: "Sports", color: "#f97316", description: "Athletic and sports activities" },
          { id: "arts", name: "Arts", color: "#ec4899", description: "Arts and cultural events" },
          { id: "social", name: "Social", color: "#fbbf24", description: "Social gatherings" }
        ];
        await setSupabaseData('royal-academy-event-categories', defaultCategories);
        setCategories(defaultCategories);
      } else {
        setCategories(data);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      setCategories([]);
    }
  };

  const handleAddEvent = () => {
    if (categories.length === 0) {
      alert("Please create at least one event category first before adding events.");
      return;
    }
    
    const newEvent: Event = {
      id: Date.now().toString(),
      title: "",
      description: "",
      fullContent: "",
      category: categories[0].name,
      date: new Date().toISOString().split('T')[0],
      time: "10:00 AM",
      location: "",
      imageUrl: "",
      attendees: 0,
      published: false
    };
    setEditingEvent(newEvent);
    setIsAddingNew(true);
    setIsEditing(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent({ ...event });
    setIsAddingNew(false);
    setIsEditing(true);
  };

  const handleSaveEvent = async () => {
    if (!editingEvent || !editingEvent.title.trim()) {
      alert("Please enter an event title");
      return;
    }

    const updatedEvents = isAddingNew
      ? [...events, editingEvent]
      : events.map(e => e.id === editingEvent.id ? editingEvent : e);

    try {
      const success = await setSupabaseData('royal-academy-events', updatedEvents);
      if (success) {
        setEvents(updatedEvents);
        setIsEditing(false);
        setEditingEvent(null);
        setMessage(isAddingNew ? "Event created successfully!" : "Event updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to save event. Please try again.");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error saving event:", error);
      setMessage("Error saving event. Please check your connection and try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      const updatedEvents = events.filter(e => e.id !== id);
      try {
        const success = await setSupabaseData('royal-academy-events', updatedEvents);
        if (success) {
          setEvents(updatedEvents);
          setMessage("Event deleted successfully!");
          setTimeout(() => setMessage(""), 3000);
        } else {
          setMessage("Failed to delete event. Please try again.");
          setTimeout(() => setMessage(""), 3000);
        }
      } catch (error) {
        console.error("Error deleting event:", error);
        setMessage("Error deleting event. Please check your connection and try again.");
        setTimeout(() => setMessage(""), 3000);
      }
    }
  };

  const handlePublishEvent = async (id: string) => {
    const updatedEvents = events.map(e => 
      e.id === id ? { ...e, published: !e.published } : e
    );
    
    try {
      const success = await setSupabaseData('royal-academy-events', updatedEvents);
      if (success) {
        setEvents(updatedEvents);
        const event = updatedEvents.find(e => e.id === id);
        setMessage(event?.published ? "Event published!" : "Event unpublished!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to update event status. Please try again.");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error publishing event:", error);
      setMessage("Error updating event status. Please check your connection and try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingEvent) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setEditingEvent({
          ...editingEvent,
          imageUrl: imageData
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateEventField = (field: keyof Event, value: any) => {
    if (!editingEvent) return;
    setEditingEvent({
      ...editingEvent,
      [field]: value
    });
  };

  const filteredEvents = filterCategory === "all" || !filterCategory
    ? events
    : events.filter(e => e.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">Events & News Manager</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Create and manage school events and news</p>
        </div>
        <Button onClick={handleAddEvent} className="w-full sm:w-auto bg-gradient-to-r from-royal to-gold text-white">
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </Button>
      </div>

      {/* Success Message */}
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Category Filter */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium">Filter by Category:</label>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && editingEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-heading font-bold">
                  {isAddingNew ? "Create New Event" : "Edit Event"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">Event Title</label>
                  <Input
                    value={editingEvent.title}
                    onChange={(e) => updateEventField('title', e.target.value)}
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select
                    value={editingEvent.category}
                    onValueChange={(value) => updateEventField('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Date</label>
                  <Input
                    type="date"
                    value={editingEvent.date}
                    onChange={(e) => updateEventField('date', e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Time</label>
                  <Input
                    value={editingEvent.time}
                    onChange={(e) => updateEventField('time', e.target.value)}
                    placeholder="e.g., 10:00 AM - 4:00 PM"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Input
                    value={editingEvent.location}
                    onChange={(e) => updateEventField('location', e.target.value)}
                    placeholder="Enter location"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">Short Description</label>
                  <Textarea
                    value={editingEvent.description}
                    onChange={(e) => updateEventField('description', e.target.value)}
                    placeholder="Brief description for event card"
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">Full Content (Learn More & Highlights)</label>
                  <Textarea
                    value={editingEvent.fullContent}
                    onChange={(e) => updateEventField('fullContent', e.target.value)}
                    placeholder="Detailed content for 'Learn More' page. Add bullet points (one per line) for highlights section."
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Tip: Each new line will be displayed as a highlight bullet point on the homepage
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">Event Image</label>
                  {editingEvent.imageUrl && (
                    <div className="mb-3">
                      <img
                        src={editingEvent.imageUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="event-image-upload"
                  />
                  <label htmlFor="event-image-upload">
                    <Button variant="outline" asChild className="cursor-pointer w-full">
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        {editingEvent.imageUrl ? "Change Image" : "Upload Image"}
                      </span>
                    </Button>
                  </label>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Expected Attendees</label>
                  <Input
                    type="number"
                    value={editingEvent.attendees}
                    onChange={(e) => updateEventField('attendees', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={editingEvent.published}
                    onChange={(e) => updateEventField('published', e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="published" className="text-sm">Publish immediately</label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEvent} className="bg-gradient-to-r from-royal to-gold text-white">
                  <Save className="h-4 w-4 mr-2" />
                  {isAddingNew ? "Create" : "Update"} Event
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>No events created yet.</p>
            <p className="text-sm">Create your first event to get started.</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <motion.div
              key={event.id}
              layout
              className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col md:flex-row">
                {event.imageUrl && (
                  <div className="md:w-48 h-48 md:h-auto">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-foreground text-lg">{event.title}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          {event.category}
                        </span>
                        {event.published ? (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            Published
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                            Draft
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3 leading-relaxed">{event.description}</p>
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
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePublishEvent(event.id)}
                      className={event.published ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline ml-2">
                        {event.published ? "Unpublish" : "Publish"}
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditEvent(event)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="hidden sm:inline ml-2">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden sm:inline ml-2">Delete</span>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventsManager;
