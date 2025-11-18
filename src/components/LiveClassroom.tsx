import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  MonitorOff,
  Users,
  X,
  PlayCircle,
  StopCircle
} from "lucide-react";

interface LiveClassroomProps {
  teacherName: string;
  teacherEmail: string;
  teacherClass: string;
  teacherSection: string;
  onClose: () => void;
}

const LiveClassroom = ({ teacherName, teacherEmail, teacherClass, teacherSection, onClose }: LiveClassroomProps) => {
  const [isLive, setIsLive] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [studentCount, setStudentCount] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // Load active viewers count
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        const broadcasts = JSON.parse(localStorage.getItem('royal-academy-live-broadcasts') || '[]');
        const myBroadcast = broadcasts.find((b: any) => b.teacherEmail === teacherEmail);
        if (myBroadcast) {
          setStudentCount(myBroadcast.viewers?.length || 0);
        }
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [isLive, teacherEmail]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: isMicOn 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      streamRef.current = stream;
      setIsCameraOn(true);
    } catch (err) {
      alert("Failed to access camera. Please allow camera permissions.");
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraOn(false);
  };

  const toggleMic = async () => {
    if (isMicOn) {
      // Mute
      if (streamRef.current) {
        streamRef.current.getAudioTracks().forEach(track => track.enabled = false);
      }
      setIsMicOn(false);
    } else {
      // Unmute
      if (streamRef.current) {
        streamRef.current.getAudioTracks().forEach(track => track.enabled = true);
      } else {
        // Start fresh stream with audio
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: isCameraOn, 
            audio: true 
          });
          
          if (isCameraOn && videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          
          streamRef.current = stream;
        } catch (err) {
          alert("Failed to access microphone.");
          return;
        }
      }
      setIsMicOn(true);
    }
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true,
        audio: true
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = screenStream;
      }
      
      // Stop camera when screen sharing starts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      screenStreamRef.current = screenStream;
      setIsScreenSharing(true);
      setIsCameraOn(false);
      
      // Handle when user stops sharing via browser UI
      screenStream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };
    } catch (err) {
      alert("Failed to start screen sharing.");
      console.error(err);
    }
  };

  const stopScreenShare = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsScreenSharing(false);
  };

  const startBroadcast = () => {
    if (!title.trim()) {
      alert("Please enter a class title!");
      return;
    }

    // Save broadcast info to localStorage
    const broadcasts = JSON.parse(localStorage.getItem('royal-academy-live-broadcasts') || '[]');
    
    const newBroadcast = {
      id: `${teacherEmail}-${Date.now()}`,
      teacherName,
      teacherEmail,
      teacherClass,
      teacherSection,
      title,
      description,
      startedAt: new Date().toISOString(),
      isActive: true,
      isCameraOn,
      isMicOn,
      isScreenSharing,
      viewers: []
    };
    
    // Remove any existing broadcast from this teacher
    const filteredBroadcasts = broadcasts.filter((b: any) => b.teacherEmail !== teacherEmail);
    filteredBroadcasts.push(newBroadcast);
    
    localStorage.setItem('royal-academy-live-broadcasts', JSON.stringify(filteredBroadcasts));
    
    setIsLive(true);
  };

  const stopBroadcast = () => {
    // Stop all streams
    stopCamera();
    stopScreenShare();
    
    // Remove broadcast from localStorage
    const broadcasts = JSON.parse(localStorage.getItem('royal-academy-live-broadcasts') || '[]');
    const filteredBroadcasts = broadcasts.filter((b: any) => b.teacherEmail !== teacherEmail);
    localStorage.setItem('royal-academy-live-broadcasts', JSON.stringify(filteredBroadcasts));
    
    setIsLive(false);
    setStudentCount(0);
  };

  // Update broadcast status in real-time
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        const broadcasts = JSON.parse(localStorage.getItem('royal-academy-live-broadcasts') || '[]');
        const updatedBroadcasts = broadcasts.map((b: any) => {
          if (b.teacherEmail === teacherEmail) {
            return {
              ...b,
              isCameraOn,
              isMicOn,
              isScreenSharing,
              lastUpdate: new Date().toISOString()
            };
          }
          return b;
        });
        localStorage.setItem('royal-academy-live-broadcasts', JSON.stringify(updatedBroadcasts));
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isLive, isCameraOn, isMicOn, isScreenSharing, teacherEmail]);

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
                {isLive ? "🔴 Live Class" : "Start Live Class"}
              </h2>
              {isLive && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">
                  LIVE
                </span>
              )}
            </div>
            <Button variant="ghost" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Live Stats */}
          {isLive && (
            <div className="mb-4 p-4 bg-muted/20 rounded-lg border border-border/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-lg">
                  <Users className="h-5 w-5" />
                  <span className="font-bold text-lg">{studentCount}</span>
                  <span className="text-sm">watching</span>
                </div>
              </div>
            </div>
          )}

          {/* Setup Form (before going live) */}
          {!isLive && (
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Class Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Mathematics - Algebra Chapter 5"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What will you teach in this class?"
                  rows={3}
                  className="w-full"
                />
              </div>
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-foreground">
                  <strong>Broadcasting to:</strong> Class {teacherClass}{teacherSection}
                </p>
              </div>
            </div>
          )}

          {/* Video Preview */}
          <div className="mb-6 bg-black rounded-lg overflow-hidden aspect-video relative">
            {(isCameraOn || isScreenSharing) ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <VideoOff className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Camera Off</p>
                </div>
              </div>
            )}
            
            {/* Live indicator overlay */}
            {isLive && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                🔴 LIVE
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <Button
              onClick={isCameraOn ? stopCamera : startCamera}
              variant={isCameraOn ? "default" : "outline"}
              className="w-full"
              disabled={isScreenSharing}
            >
              {isCameraOn ? <Video className="h-4 w-4 mr-2" /> : <VideoOff className="h-4 w-4 mr-2" />}
              {isCameraOn ? "Camera On" : "Camera Off"}
            </Button>

            <Button
              onClick={toggleMic}
              variant={isMicOn ? "default" : "outline"}
              className="w-full"
            >
              {isMicOn ? <Mic className="h-4 w-4 mr-2" /> : <MicOff className="h-4 w-4 mr-2" />}
              {isMicOn ? "Mic On" : "Mic Off"}
            </Button>

            <Button
              onClick={isScreenSharing ? stopScreenShare : startScreenShare}
              variant={isScreenSharing ? "default" : "outline"}
              className="w-full"
            >
              {isScreenSharing ? <Monitor className="h-4 w-4 mr-2" /> : <MonitorOff className="h-4 w-4 mr-2" />}
              {isScreenSharing ? "Sharing" : "Share Screen"}
            </Button>

            {!isLive ? (
              <Button
                onClick={startBroadcast}
                className="w-full md:col-span-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white"
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Go Live
              </Button>
            ) : (
              <Button
                onClick={stopBroadcast}
                className="w-full md:col-span-2 bg-gradient-to-r from-red-500 to-red-600 text-white"
              >
                <StopCircle className="h-4 w-4 mr-2" />
                End Broadcast
              </Button>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-muted/20 rounded-lg p-4 border border-border/30">
            <h4 className="font-semibold text-foreground mb-2">Instructions:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Turn on camera or share screen before going live</li>
              <li>• Only students from Class {teacherClass}{teacherSection} can join</li>
              <li>• Student count updates in real-time</li>
              <li>• Click "End Broadcast" to stop the class</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LiveClassroom;
