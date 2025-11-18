import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  Camera, 
  X, 
  Save,
  Mail,
  Phone,
  GraduationCap,
  Heart,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface StudentData {
  id: string;
  fullName: string;
  email: string;
  rollNumber: string;
  class: string;
  section: string;
  status: string;
}

const StudentProfileSettings = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [studentProfile, setStudentProfile] = useState({
    name: "",
    photo: "",
    bio: "",
    phone: "",
    interests: ""
  });

  // Helper function to convert file to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  useEffect(() => {
    console.log('StudentProfileSettings: Checking authentication...');
    // Check authentication
    const isAuth = localStorage.getItem("studentAuth");
    const student = localStorage.getItem("studentData");
    
    console.log('Auth status:', { isAuth: !!isAuth, hasStudent: !!student });
    console.log('Student data:', student);

    if (!isAuth || !student) {
      console.log('Authentication failed, redirecting to login');
      navigate("/student-login");
      return;
    }

    console.log('Authentication successful, loading profile...');

    const parsedStudent = JSON.parse(student);
    setStudentData(parsedStudent);

    // Load student profile
    const storedProfile = localStorage.getItem(`student-profile-${parsedStudent.email}`);
    if (storedProfile) {
      setStudentProfile(JSON.parse(storedProfile));
    } else {
      setStudentProfile(prev => ({ ...prev, name: parsedStudent.fullName }));
    }
    
    setLoading(false);
  }, [navigate]);

  const handleSaveProfile = () => {
    if (studentData) {
      localStorage.setItem(`student-profile-${studentData.email}`, JSON.stringify(studentProfile));
      alert('Profile updated successfully!');
    }
  };

  const handlePhotoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const base64 = await convertToBase64(file);
        setStudentProfile({ ...studentProfile, photo: base64 });
      }
    };
    input.click();
  };

  const handleRemovePhoto = () => {
    setStudentProfile({ ...studentProfile, photo: "" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-royal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-royal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-50"
      >
        <div className="container-wide py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate("/student-dashboard")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
            </div>
            <h1 className="text-2xl font-heading font-bold text-gradient-gold">Profile Settings</h1>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container-wide py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card/95 backdrop-blur-md rounded-xl border border-border/50 overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-royal to-gold p-8 text-white">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {studentProfile.photo ? (
                    <img
                      src={studentProfile.photo}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover border-4 border-white/20"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center">
                      <User className="h-12 w-12 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-3xl font-heading font-bold">
                    {studentProfile.name || studentData.fullName}
                  </h2>
                  <p className="text-white/80 text-lg">Class {studentData.class}{studentData.section}</p>
                  <p className="text-white/60">Roll No: {studentData.rollNumber}</p>
                  <p className="text-white/60">{studentData.email}</p>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Photo Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-heading font-bold text-foreground mb-4">
                      Profile Photo
                    </h3>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative">
                        {studentProfile.photo ? (
                          <img
                            src={studentProfile.photo}
                            alt="Profile"
                            className="h-32 w-32 rounded-full object-cover border-4 border-gold"
                          />
                        ) : (
                          <div className="h-32 w-32 rounded-full bg-gradient-to-r from-royal to-gold flex items-center justify-center">
                            <User className="h-16 w-16 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={handlePhotoUpload}
                          className="flex items-center space-x-2"
                        >
                          <Camera className="h-4 w-4" />
                          <span>Upload Photo</span>
                        </Button>
                        
                        {studentProfile.photo && (
                          <Button
                            variant="destructive"
                            onClick={handleRemovePhoto}
                            className="flex items-center space-x-2"
                          >
                            <X className="h-4 w-4" />
                            <span>Remove</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-gradient-to-r from-royal/10 to-gold/10 rounded-lg p-6">
                    <h4 className="font-semibold text-foreground mb-4">Student Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-gold" />
                        <span className="text-sm text-muted-foreground">{studentData.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <GraduationCap className="h-4 w-4 text-gold" />
                        <span className="text-sm text-muted-foreground">Class {studentData.class}{studentData.section}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <BookOpen className="h-4 w-4 text-gold" />
                        <span className="text-sm text-muted-foreground">Roll No: {studentData.rollNumber}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Profile Information Section */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-heading font-bold text-foreground">
                    Profile Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">
                        Full Name
                      </label>
                      <Input
                        value={studentProfile.name}
                        onChange={(e) => setStudentProfile({ ...studentProfile, name: e.target.value })}
                        placeholder="Enter your full name"
                        className="bg-background/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">
                        Phone Number
                      </label>
                      <Input
                        value={studentProfile.phone}
                        onChange={(e) => setStudentProfile({ ...studentProfile, phone: e.target.value })}
                        placeholder="Enter your phone number"
                        className="bg-background/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">
                        Interests & Hobbies
                      </label>
                      <Input
                        value={studentProfile.interests}
                        onChange={(e) => setStudentProfile({ ...studentProfile, interests: e.target.value })}
                        placeholder="e.g., Sports, Music, Art, Science"
                        className="bg-background/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">
                        About Me
                      </label>
                      <Textarea
                        value={studentProfile.bio}
                        onChange={(e) => setStudentProfile({ ...studentProfile, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                        rows={4}
                        className="bg-background/50"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Save Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex justify-center"
              >
                <Button
                  onClick={handleSaveProfile}
                  className="bg-gradient-to-r from-royal to-gold text-white hover:from-royal/80 hover:to-gold/80 px-8 py-3 text-lg"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save Profile
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentProfileSettings;
