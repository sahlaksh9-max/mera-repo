import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Video, 
  X,
  Users,
  Monitor,
  Mic,
  MicOff,
  VideoOff,
  Clock
} from "lucide-react";

interface LiveClassViewerProps {
  studentClass: string;
  studentSection: string;
  studentName: string;
  studentId: string;
  onClose: () => void;
}

interface LiveBroadcast {
  id: string;
  teacherName: string;
  teacherEmail: string;
  teacherClass: string;
  teacherSection: string;
  title: string;
  description: string;
  startedAt: string;
  isActive: boolean;
  isCameraOn: boolean;
  isMicOn: boolean;
  isScreenSharing: boolean;
  viewers: string[];
}

const LiveClassViewer = ({ studentClass, studentSection, studentName, studentId, onClose }: LiveClassViewerProps) => {
  const [availableClasses, setAvailableClasses] = useState<LiveBroadcast[]>([]);
  const [joinedClass, setJoinedClass] = useState<LiveBroadcast | null>(null);

  // Load available classes for this student's class
  useEffect(() => {
    const loadClasses = () => {
      const broadcasts = JSON.parse(localStorage.getItem('royal-academy-live-broadcasts') || '[]');
      console.log('[LiveClassViewer] All broadcasts:', broadcasts);
      console.log('[LiveClassViewer] Looking for class:', studentClass, 'section:', studentSection);
      
      // Filter to show only classes for this student's class and section
      const myClasses = broadcasts.filter((b: LiveBroadcast) => 
        b.teacherClass === studentClass && 
        b.teacherSection === studentSection &&
        b.isActive
      );
      
      console.log('[LiveClassViewer] My classes:', myClasses);
      setAvailableClasses(myClasses);
      
      // Check if currently joined class ended
      if (joinedClass) {
        const stillActive = myClasses.find((c: LiveBroadcast) => c.id === joinedClass.id);
        if (!stillActive) {
          setJoinedClass(null);
          alert("The teacher has ended the class.");
        }
      }
    };

    loadClasses();
    const interval = setInterval(loadClasses, 2000);
    
    return () => clearInterval(interval);
  }, [studentClass, studentSection, joinedClass]);

  const joinClass = (broadcast: LiveBroadcast) => {
    // Add this student to viewers
    const broadcasts = JSON.parse(localStorage.getItem('royal-academy-live-broadcasts') || '[]');
    const updatedBroadcasts = broadcasts.map((b: LiveBroadcast) => {
      if (b.id === broadcast.id) {
        const viewers = b.viewers || [];
        if (!viewers.includes(studentId)) {
          viewers.push(studentId);
        }
        return { ...b, viewers };
      }
      return b;
    });
    
    localStorage.setItem('royal-academy-live-broadcasts', JSON.stringify(updatedBroadcasts));
    setJoinedClass(broadcast);
  };

  const leaveClass = () => {
    if (joinedClass) {
      // Remove this student from viewers
      const broadcasts = JSON.parse(localStorage.getItem('royal-academy-live-broadcasts') || '[]');
      const updatedBroadcasts = broadcasts.map((b: LiveBroadcast) => {
        if (b.id === joinedClass.id) {
          const viewers = (b.viewers || []).filter(id => id !== studentId);
          return { ...b, viewers };
        }
        return b;
      });
      
      localStorage.setItem('royal-academy-live-broadcasts', JSON.stringify(updatedBroadcasts));
    }
    setJoinedClass(null);
  };

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (joinedClass) {
        const broadcasts = JSON.parse(localStorage.getItem('royal-academy-live-broadcasts') || '[]');
        const updatedBroadcasts = broadcasts.map((b: LiveBroadcast) => {
          if (b.id === joinedClass.id) {
            const viewers = (b.viewers || []).filter(id => id !== studentId);
            return { ...b, viewers };
          }
          return b;
        });
        localStorage.setItem('royal-academy-live-broadcasts', JSON.stringify(updatedBroadcasts));
      }
    };
  }, [joinedClass, studentId]);

  const getTimeElapsed = (startTime: string) => {
    const start = new Date(startTime).getTime();
    const now = new Date().getTime();
    const diff = Math.floor((now - start) / 1000 / 60);
    return `${diff} min ago`;
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Video className="h-6 w-6 text-royal" />
              <h2 className="text-2xl font-bold text-foreground">
                {joinedClass ? "🔴 Live Class" : "Join Live Classes"}
              </h2>
            </div>
            <Button variant="ghost" onClick={() => {
              leaveClass();
              onClose();
            }}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Joined Class View */}
          {joinedClass ? (
            <div>
              {/* Class Info */}
              <div className="mb-4 p-4 bg-muted/20 rounded-lg border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{joinedClass.title}</h3>
                    <p className="text-sm text-muted-foreground">Teacher: {joinedClass.teacherName}</p>
                  </div>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">
                    🔴 LIVE
                  </span>
                </div>
                {joinedClass.description && (
                  <p className="text-sm text-muted-foreground mt-2">{joinedClass.description}</p>
                )}
              </div>

              {/* Live Video Area */}
              <div className="mb-6 bg-black rounded-lg overflow-hidden aspect-video relative flex items-center justify-center">
                {joinedClass.isCameraOn || joinedClass.isScreenSharing ? (
                  <div className="text-center text-white">
                    <Video className="h-16 w-16 mx-auto mb-4 animate-pulse" />
                    <p className="text-xl font-semibold mb-2">
                      {joinedClass.isScreenSharing ? "Teacher is sharing screen" : "Teacher's Camera is ON"}
                    </p>
                    <p className="text-sm text-gray-400">
                      {joinedClass.teacherName} is teaching live
                    </p>
                    
                    {/* Status indicators */}
                    <div className="flex items-center justify-center space-x-4 mt-4">
                      {joinedClass.isScreenSharing && (
                        <div className="flex items-center space-x-2 bg-blue-500/20 px-3 py-1 rounded">
                          <Monitor className="h-4 w-4" />
                          <span className="text-sm">Screen Sharing</span>
                        </div>
                      )}
                      {joinedClass.isMicOn ? (
                        <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded">
                          <Mic className="h-4 w-4" />
                          <span className="text-sm">Mic On</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 bg-red-500/20 px-3 py-1 rounded">
                          <MicOff className="h-4 w-4" />
                          <span className="text-sm">Mic Off</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-white">
                    <VideoOff className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                    <p className="text-lg">Teacher's camera is off</p>
                    <p className="text-sm text-gray-400">Waiting for teacher to turn on camera or share screen</p>
                  </div>
                )}
                
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                  🔴 LIVE
                </div>
                
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>{joinedClass.viewers?.length || 0} watching</span>
                </div>
              </div>

              <Button
                onClick={leaveClass}
                variant="destructive"
                className="w-full"
              >
                Leave Class
              </Button>
            </div>
          ) : (
            /* Available Classes List */
            <div>
              <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-foreground">
                  Showing live classes for: <strong>Class {studentClass}{studentSection}</strong>
                </p>
              </div>

              {availableClasses.length > 0 ? (
                <div className="space-y-4">
                  {availableClasses.map((broadcast) => (
                    <motion.div
                      key={broadcast.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-muted/20 rounded-lg p-6 border border-border/30 hover:border-royal transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-foreground text-lg">{broadcast.title}</h3>
                            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs animate-pulse">
                              🔴 LIVE
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Teacher: {broadcast.teacherName}
                          </p>
                          {broadcast.description && (
                            <p className="text-sm text-foreground mb-3">{broadcast.description}</p>
                          )}
                          
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>Started {getTimeElapsed(broadcast.startedAt)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{broadcast.viewers?.length || 0} watching</span>
                            </div>
                            {broadcast.isScreenSharing && (
                              <div className="flex items-center space-x-1 text-blue-400">
                                <Monitor className="h-3 w-3" />
                                <span>Screen Sharing</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => joinClass(broadcast)}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                      >
                        Join Now
                      </Button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Video className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Live Classes Right Now
                  </h3>
                  <p className="text-muted-foreground">
                    Your teachers from Class {studentClass}{studentSection} haven't started any live classes yet.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Check back later or ask your teacher to start a live session.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LiveClassViewer;
