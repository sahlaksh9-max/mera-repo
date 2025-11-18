import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Send,
  Eye,
  EyeOff,
  Bell,
  Calendar,
  Clock,
  AlertCircle,
  Info,
  Megaphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Announcement {
  id: number;
  title: string;
  message: string;
  timestamp: string;
  type: "info" | "important" | "announcement" | "urgent";
  unread: boolean;
  published: boolean;
}

const AnnouncementManager = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [message, setMessage] = useState("");

  // Load announcements from localStorage
  useEffect(() => {
    const savedAnnouncements = localStorage.getItem('royal-academy-announcements');
    if (savedAnnouncements) {
      setAnnouncements(JSON.parse(savedAnnouncements));
    } else {
      // Default announcements
      const defaultAnnouncements: Announcement[] = [
        {
          id: 1,
          title: "Welcome to New Academic Year",
          message: "Classes for the new academic year will begin on September 1st. Please check your course schedules.",
          timestamp: new Date().toISOString(),
          type: "info",
          unread: true,
          published: true
        },
        {
          id: 2,
          title: "Library Hours Extended",
          message: "The library will now be open until 22:00 on weekdays to support your studies.",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          type: "info",
          unread: true,
          published: true
        }
      ];
      setAnnouncements(defaultAnnouncements);
      localStorage.setItem('royal-academy-announcements', JSON.stringify(defaultAnnouncements));
    }
  }, []);

  const saveAnnouncements = (updatedAnnouncements: Announcement[]) => {
    setAnnouncements(updatedAnnouncements);
    localStorage.setItem('royal-academy-announcements', JSON.stringify(updatedAnnouncements));
  };

  const handleAddAnnouncement = () => {
    const newAnnouncement: Announcement = {
      id: Date.now(),
      title: "",
      message: "",
      timestamp: new Date().toISOString(),
      type: "info",
      unread: true,
      published: false
    };
    setEditingAnnouncement(newAnnouncement);
    setIsAddingNew(true);
    setIsEditing(true);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement({ ...announcement });
    setIsAddingNew(false);
    setIsEditing(true);
  };

  const handleSaveAnnouncement = () => {
    if (!editingAnnouncement || !editingAnnouncement.title.trim() || !editingAnnouncement.message.trim()) {
      alert("Please fill in both title and message");
      return;
    }

    const updatedAnnouncements = isAddingNew
      ? [...announcements, editingAnnouncement]
      : announcements.map(a => a.id === editingAnnouncement.id ? editingAnnouncement : a);

    saveAnnouncements(updatedAnnouncements);
    setIsEditing(false);
    setEditingAnnouncement(null);
    setMessage(isAddingNew ? "Announcement created successfully!" : "Announcement updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDeleteAnnouncement = (id: number) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      const updatedAnnouncements = announcements.filter(a => a.id !== id);
      saveAnnouncements(updatedAnnouncements);
      setMessage("Announcement deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handlePublishAnnouncement = (id: number) => {
    const updatedAnnouncements = announcements.map(a => 
      a.id === id 
        ? { ...a, published: !a.published, timestamp: a.published ? a.timestamp : new Date().toISOString() }
        : a
    );
    saveAnnouncements(updatedAnnouncements);
    const announcement = updatedAnnouncements.find(a => a.id === id);
    setMessage(announcement?.published ? "Announcement published!" : "Announcement unpublished!");
    setTimeout(() => setMessage(""), 3000);
  };

  const updateAnnouncementField = (field: keyof Announcement, value: any) => {
    if (!editingAnnouncement) return;
    setEditingAnnouncement({
      ...editingAnnouncement,
      [field]: value
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'urgent': return AlertCircle;
      case 'important': return Bell;
      case 'announcement': return Megaphone;
      default: return Info;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300';
      case 'important': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300';
      case 'announcement': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">Announcement Manager</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Create and manage school announcements for students and staff</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <Button
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
          >
            {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          <Button onClick={handleAddAnnouncement} className="w-full sm:w-auto bg-gradient-to-r from-royal to-gold text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Announcement
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && editingAnnouncement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 w-full max-w-[calc(100vw-16px)] sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
                <h3 className="text-base sm:text-lg lg:text-xl font-heading font-bold truncate pr-2">
                  {isAddingNew ? "Create New Announcement" : "Edit Announcement"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="h-8 w-8 p-0 flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 block">Title</label>
                  <Input
                    value={editingAnnouncement.title}
                    onChange={(e) => updateAnnouncementField('title', e.target.value)}
                    placeholder="Enter announcement title"
                    className="text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 block">Type</label>
                  <Select
                    value={editingAnnouncement.type}
                    onValueChange={(value) => updateAnnouncementField('type', value)}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Information</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="important">Important</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 block">Message</label>
                  <Textarea
                    value={editingAnnouncement.message}
                    onChange={(e) => updateAnnouncementField('message', e.target.value)}
                    placeholder="Enter announcement message"
                    rows={3}
                    className="text-sm resize-none"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingAnnouncement.published}
                      onChange={(e) => updateAnnouncementField('published', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-xs sm:text-sm">Publish immediately</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 sm:gap-3 mt-4 sm:mt-6 pt-3 sm:pt-6 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveAnnouncement} 
                  className="w-full sm:w-auto bg-gradient-to-r from-royal to-gold text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isAddingNew ? "Create" : "Update"} Announcement
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Bell className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>No announcements created yet.</p>
            <p className="text-sm">Create your first announcement to get started.</p>
          </div>
        ) : (
          announcements.map((announcement) => {
            const TypeIcon = getTypeIcon(announcement.type);
            return (
              <motion.div
                key={announcement.id}
                layout
                className="bg-card border border-border rounded-lg p-3 sm:p-4 lg:p-6 hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <TypeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                        <h3 className="font-semibold text-foreground text-sm sm:text-base lg:text-lg truncate">{announcement.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-full flex-shrink-0 ${getTypeColor(announcement.type)}`}>
                          {announcement.type}
                        </span>
                        {announcement.published ? (
                          <span className="text-[10px] sm:text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 flex-shrink-0">
                            Published
                          </span>
                        ) : (
                          <span className="text-[10px] sm:text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 flex-shrink-0">
                            Draft
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-3 leading-relaxed text-sm sm:text-base break-words">{announcement.message}</p>
                    <div className="flex items-center space-x-4 text-[10px] sm:text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <span className="break-all">{formatTime(announcement.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row sm:flex-col lg:flex-row items-center gap-1 sm:gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePublishAnnouncement(announcement.id)}
                      className={`h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-3 ${announcement.published ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}`}
                      title={announcement.published ? "Unpublish" : "Publish"}
                    >
                      <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline ml-2">
                        {announcement.published ? "Unpublish" : "Publish"}
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditAnnouncement(announcement)}
                      className="h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-3"
                      title="Edit"
                    >
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline ml-2">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                      className="text-red-600 hover:text-red-700 h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-3"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline ml-2">Delete</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Preview Link */}
      {showPreview && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <div>
              <h3 className="font-semibold text-foreground">Live Preview</h3>
              <p className="text-sm text-muted-foreground">See how announcements appear to students and staff</p>
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              <Eye className="h-4 w-4 mr-2" />
              View Student Notifications
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementManager;
