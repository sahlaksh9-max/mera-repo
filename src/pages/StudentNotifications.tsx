import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Bell, ArrowLeft, User, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import DocumentViewer from "@/components/DocumentViewer";

interface StudentData {
  id: string;
  fullName: string;
  email: string;
  class: string;
  section: string;
  rollNumber: string;
}

const StudentNotifications = () => {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [studentNotifications, setStudentNotifications] = useState<any[]>([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{src: string, title: string} | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load student data
    const currentStudent = localStorage.getItem("currentStudent");
    const studentEmail = localStorage.getItem("studentEmail");
    
    if (currentStudent) {
      try {
        const student = JSON.parse(currentStudent);
        const studentData = {
          id: student.studentId || student.id,
          fullName: student.username || student.name || student.fullName,
          email: student.email || studentEmail,
          rollNumber: student.rollNumber || 'N/A',
          class: student.class || 'N/A',
          section: student.section || 'A'
        };
        setStudentData(studentData);
      } catch (e) {
        console.log('Error parsing currentStudent');
      }
    }
  }, []);

  // Load notifications when studentData changes
  useEffect(() => {
    if (studentData) {
      const storedNotifications = localStorage.getItem('royal-academy-student-notifications');
      if (storedNotifications) {
        const allNotifications = JSON.parse(storedNotifications);
        const myNotifications = allNotifications.filter((notification: any) => {
          return notification.targetType === 'all' ||
                 (notification.targetType === 'class' && notification.targetClass === studentData.class) ||
                 (notification.targetType === 'section' && notification.targetClass === studentData.class && notification.targetSection === studentData.section) ||
                 (notification.targetType === 'student' && notification.targetStudentId === studentData.id);
        });
        setStudentNotifications(myNotifications);
      }
    }
  }, [studentData]);

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = studentNotifications.map(n => 
      n.id === notificationId ? { ...n, status: 'read' } : n
    );
    setStudentNotifications(updatedNotifications);
    
    const allNotifications = JSON.parse(localStorage.getItem('royal-academy-student-notifications') || '[]');
    const updatedAllNotifications = allNotifications.map((n: any) => 
      n.id === notificationId ? { ...n, status: 'read' } : n
    );
    localStorage.setItem('royal-academy-student-notifications', JSON.stringify(updatedAllNotifications));
  };

  const markAllAsRead = () => {
    const updatedNotifications = studentNotifications.map(n => ({ ...n, status: 'read' }));
    setStudentNotifications(updatedNotifications);
    
    const allNotifications = JSON.parse(localStorage.getItem('royal-academy-student-notifications') || '[]');
    const updatedAllNotifications = allNotifications.map((n: any) => {
      const isMyNotification = n.targetType === 'all' ||
        (n.targetType === 'class' && n.targetClass === studentData?.class) ||
        (n.targetType === 'section' && n.targetClass === studentData?.class && n.targetSection === studentData?.section) ||
        (n.targetType === 'student' && n.targetStudentId === studentData?.id);
      
      return isMyNotification ? { ...n, status: 'read' } : n;
    });
    localStorage.setItem('royal-academy-student-notifications', JSON.stringify(updatedAllNotifications));
  };

  const unreadCount = studentNotifications.filter(n => n.status === 'unread').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-50"
      >
        <div className="container-wide py-3 sm:py-4 px-3 sm:px-4">
          <div className="flex items-center justify-between gap-3">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-foreground hover:text-gold h-8 sm:h-auto px-2 sm:px-3"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back</span>
            </Button>

            {/* Title */}
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-heading font-bold text-foreground truncate">
                  📢 Notifications
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {unreadCount > 0 ? `${unreadCount} unread messages` : 'All caught up!'}
                </p>
              </div>
            </div>

            {/* Mark All Read Button */}
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs sm:text-sm h-8 sm:h-10"
              >
                Mark All Read
              </Button>
            )}
          </div>
        </div>
      </motion.header>

      <div className="container-wide py-4 sm:py-6 px-3 sm:px-4">
        {/* Notifications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/95 backdrop-blur-md rounded-xl border border-border/50 overflow-hidden"
        >
          {studentNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Notifications</h3>
              <p className="text-sm text-muted-foreground">
                You'll see messages from teachers and principal here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {studentNotifications
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className={`p-4 sm:p-6 hover:bg-muted/30 transition-colors ${
                      notification.status === 'unread' ? 'bg-blue-500/5 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Sender Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-royal/20 to-gold/20 flex items-center justify-center">
                          {notification.senderType === 'principal' ? (
                            <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-royal" />
                          ) : (
                            <User className="h-5 w-5 sm:h-6 sm:w-6 text-royal" />
                          )}
                        </div>
                      </div>

                      {/* Notification Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2 gap-2">
                          <h4 className="text-sm sm:text-base font-semibold text-foreground break-words flex-1">
                            {notification.subject}
                          </h4>
                          {notification.status === 'unread' && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 flex-shrink-0">
                              New
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-blue-400 mb-2">
                          From: {notification.senderName} ({notification.senderType === 'principal' ? 'Principal' : 'Teacher'})
                        </p>

                        <p className="text-sm sm:text-base text-muted-foreground mb-3 break-words">
                          {notification.message}
                        </p>

                        {/* Photo Attachments */}
                        {(notification.photo1 || notification.photo2) && (
                          <div className="flex space-x-3 mb-3">
                            {notification.photo1 && (
                              <img 
                                src={notification.photo1} 
                                alt="Attachment 1" 
                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => {
                                  setSelectedImage({
                                    src: notification.photo1,
                                    title: `${notification.subject} - Attachment 1`
                                  });
                                  setShowImageModal(true);
                                }}
                              />
                            )}
                            {notification.photo2 && (
                              <img 
                                src={notification.photo2} 
                                alt="Attachment 2" 
                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => {
                                  setSelectedImage({
                                    src: notification.photo2,
                                    title: `${notification.subject} - Attachment 2`
                                  });
                                  setShowImageModal(true);
                                }}
                              />
                            )}
                          </div>
                        )}

                        {/* Footer Info */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground">
                              {new Date(notification.createdAt).toLocaleDateString()} • {new Date(notification.createdAt).toLocaleTimeString()}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Target: {notification.targetType === 'all' ? 'All Students' : 
                                      notification.targetType === 'class' ? `Class ${notification.targetClass}` :
                                      notification.targetType === 'section' ? `Class ${notification.targetClass}-${notification.targetSection}` :
                                      'Individual'}
                            </span>
                          </div>
                          
                          {notification.status === 'unread' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-700 h-8"
                            >
                              Mark as Read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <DocumentViewer
          documentUrl={selectedImage.src}
          documentName={selectedImage.title}
          onClose={() => {
            setShowImageModal(false);
            setSelectedImage(null);
          }}
        />
      )}
    </div>
  );
};

export default StudentNotifications;