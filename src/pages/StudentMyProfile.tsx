import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, User, Camera, X, Home, Info, BookOpen, GraduationCap, Image as ImageIcon } from "lucide-react";

interface StudentProfile {
  name: string;
  phone: string;
  interests: string;
  bio: string;
  photo: string;
}

interface StudentData {
  id: string;
  fullName: string;
  email: string;
  rollNumber: string;
  class: string;
  section: string;
  status: string;
}

export default function StudentMyProfile() {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>({
    name: "",
    phone: "",
    interests: "",
    bio: "",
    photo: ""
  });

  useEffect(() => {
    const isAuth = localStorage.getItem("studentAuth");
    const studentEmail = localStorage.getItem("studentEmail");
    
    if (!isAuth || isAuth !== "true") {
      navigate("/student-auth");
      return;
    }

    const currentStudent = localStorage.getItem("currentStudent");
    if (currentStudent) {
      try {
        const student = JSON.parse(currentStudent);
        const data = {
          id: student.studentId || student.id,
          fullName: student.username || student.name || student.fullName,
          email: student.email || studentEmail || '',
          rollNumber: student.rollNumber || 'N/A',
          class: student.class || 'N/A',
          section: student.section || 'A',
          status: student.status || 'active'
        };
        setStudentData(data);

        const storedProfile = localStorage.getItem(`student-profile-${data.email}`);
        if (storedProfile) {
          setStudentProfile(JSON.parse(storedProfile));
        } else {
          setStudentProfile({
            name: data.fullName,
            phone: "",
            interests: "",
            bio: "",
            photo: ""
          });
        }
      } catch (e) {
        console.error('Error loading student data:', e);
      }
    } else if (studentEmail) {
      const students = JSON.parse(localStorage.getItem('royal-academy-students') || '[]');
      const student = students.find((s: any) => s.email === studentEmail);
      
      if (student) {
        setStudentData(student);
        const storedProfile = localStorage.getItem(`student-profile-${student.email}`);
        if (storedProfile) {
          setStudentProfile(JSON.parse(storedProfile));
        } else {
          setStudentProfile({
            name: student.fullName || student.name,
            phone: "",
            interests: "",
            bio: "",
            photo: ""
          });
        }
      }
    }
  }, [navigate]);

  const convertToBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  const handleSaveProfile = () => {
    if (studentData) {
      localStorage.setItem(`student-profile-${studentData.email}`, JSON.stringify(studentProfile));
      alert('Profile updated successfully!');
      navigate('/student-dashboard');
    }
  };

  if (!studentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal/10 via-background to-gold/10">
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/student-dashboard')}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-heading font-bold text-foreground">My Profile</h1>
            </div>
            
            <div className="hidden lg:flex items-center space-x-6">
              <button
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center"
              >
                <Home className="h-4 w-4 mr-1" />
                Home
              </button>
              <button
                onClick={() => navigate('/about')}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center"
              >
                <Info className="h-4 w-4 mr-1" />
                About
              </button>
              <button
                onClick={() => navigate('/courses')}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center"
              >
                <BookOpen className="h-4 w-4 mr-1" />
                Courses
              </button>
              <button
                onClick={() => navigate('/admissions')}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center"
              >
                <GraduationCap className="h-4 w-4 mr-1" />
                Admissions
              </button>
              <button
                onClick={() => navigate('/gallery')}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center"
              >
                <ImageIcon className="h-4 w-4 mr-1" />
                Gallery
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/95 backdrop-blur-md rounded-xl p-6 md:p-8 border border-border/50"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-8 pb-6 border-b border-border">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
                {studentData.fullName}
              </h2>
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 text-sm text-muted-foreground">
                <span>Class {studentData.class}{studentData.section}</span>
                <span className="hidden md:inline">•</span>
                <span>Roll: {studentData.rollNumber}</span>
                <span className="hidden md:inline">•</span>
                <span>{studentData.email}</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Profile Photo</h3>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {studentProfile.photo ? (
                  <img
                    src={studentProfile.photo}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gold"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-royal to-gold flex items-center justify-center">
                    <User className="h-16 w-16 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = async (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const base64 = await convertToBase64(file);
                        setStudentProfile({ ...studentProfile, photo: base64 as string });
                      }
                    };
                    input.click();
                  }}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
                
                {studentProfile.photo && (
                  <Button
                    variant="destructive"
                    onClick={() => setStudentProfile({ ...studentProfile, photo: "" })}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Profile Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-3 shadow-lg">
                  <User className="h-16 w-16 text-white" />
                </div>
                <label className="block text-sm font-medium mb-2 text-center">Full Name</label>
                <Input
                  value={studentProfile.name}
                  onChange={(e) => setStudentProfile({ ...studentProfile, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="text-center"
                />
              </div>

              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-3 shadow-lg">
                  <span className="text-6xl">📱</span>
                </div>
                <label className="block text-sm font-medium mb-2 text-center">Phone Number</label>
                <Input
                  value={studentProfile.phone}
                  onChange={(e) => setStudentProfile({ ...studentProfile, phone: e.target.value })}
                  placeholder="Enter your phone number"
                  className="text-center"
                />
              </div>

              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3 shadow-lg">
                  <span className="text-6xl">🎨</span>
                </div>
                <label className="block text-sm font-medium mb-2 text-center">Interests</label>
                <Input
                  value={studentProfile.interests}
                  onChange={(e) => setStudentProfile({ ...studentProfile, interests: e.target.value })}
                  placeholder="e.g., Sports, Music, Art"
                  className="text-center"
                />
              </div>

              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mb-3 shadow-lg">
                  <span className="text-6xl">📝</span>
                </div>
                <label className="block text-sm font-medium mb-2 text-center">Bio</label>
                <Textarea
                  value={studentProfile.bio}
                  onChange={(e) => setStudentProfile({ ...studentProfile, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="text-center"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <Button
              onClick={handleSaveProfile}
              className="w-full bg-gradient-to-r from-royal to-gold text-white"
              size="lg"
            >
              <User className="h-5 w-5 mr-2" />
              Save Profile
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
