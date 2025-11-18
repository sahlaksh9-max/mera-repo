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
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const TeacherProfileSettings = () => {
  const navigate = useNavigate();
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherSubject, setTeacherSubject] = useState("");
  
  const [teacherProfile, setTeacherProfile] = useState({
    name: "",
    photo: "",
    bio: "",
    phone: "",
    qualification: ""
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
    // Check authentication
    const isAuth = localStorage.getItem("teacherAuth");
    const email = localStorage.getItem("teacherEmail");
    const name = localStorage.getItem("teacherName");
    const subject = localStorage.getItem("teacherSubject");

    if (!isAuth || !email) {
      navigate("/teacher-login");
      return;
    }

    setTeacherEmail(email);
    setTeacherName(name || "");
    setTeacherSubject(subject || "");

    // Load teacher profile
    const storedProfile = localStorage.getItem(`teacher-profile-${email}`);
    if (storedProfile) {
      setTeacherProfile(JSON.parse(storedProfile));
    } else {
      setTeacherProfile(prev => ({ ...prev, name: name || "" }));
    }
  }, [navigate]);

  const handleSaveProfile = () => {
    localStorage.setItem(`teacher-profile-${teacherEmail}`, JSON.stringify(teacherProfile));
    alert('Profile updated successfully!');
  };

  const handlePhotoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const base64 = await convertToBase64(file);
        setTeacherProfile({ ...teacherProfile, photo: base64 });
      }
    };
    input.click();
  };

  const handleRemovePhoto = () => {
    setTeacherProfile({ ...teacherProfile, photo: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal via-royal/90 to-gold/20">
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
                onClick={() => navigate("/teacher-dashboard")}
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
                  {teacherProfile.photo ? (
                    <img
                      src={teacherProfile.photo}
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
                    {teacherProfile.name || teacherName}
                  </h2>
                  <p className="text-white/80 text-lg">{teacherSubject} Teacher</p>
                  <p className="text-white/60">{teacherEmail}</p>
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
                        {teacherProfile.photo ? (
                          <img
                            src={teacherProfile.photo}
                            alt="Profile"
                            className="h-32 w-32 rounded-full object-cover border-4 border-gold"
                          />
                        ) : (
                          <div className="h-32 w-32 rounded-full bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center">
                            <User className="h-16 w-16 text-black" />
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
                        
                        {teacherProfile.photo && (
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
                    <h4 className="font-semibold text-foreground mb-4">Account Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-gold" />
                        <span className="text-sm text-muted-foreground">{teacherEmail}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <GraduationCap className="h-4 w-4 text-gold" />
                        <span className="text-sm text-muted-foreground">{teacherSubject} Department</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Profile Information Section - Circle Grid Layout */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="lg:col-span-2 space-y-6"
                >
                  <h3 className="text-xl font-heading font-bold text-foreground text-center">
                    Profile Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name Circle */}
                    <div className="flex flex-col items-center">
                      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-3 shadow-lg">
                        <User className="h-16 w-16 text-white" />
                      </div>
                      <label className="block text-sm font-medium mb-2 text-center">Full Name</label>
                      <Input
                        value={teacherProfile.name}
                        onChange={(e) => setTeacherProfile({ ...teacherProfile, name: e.target.value })}
                        placeholder="Enter your full name"
                        className="text-center bg-background/50"
                      />
                    </div>

                    {/* Phone Number Circle */}
                    <div className="flex flex-col items-center">
                      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-3 shadow-lg">
                        <Phone className="h-16 w-16 text-white" />
                      </div>
                      <label className="block text-sm font-medium mb-2 text-center">Phone Number</label>
                      <Input
                        value={teacherProfile.phone}
                        onChange={(e) => setTeacherProfile({ ...teacherProfile, phone: e.target.value })}
                        placeholder="Enter your phone number"
                        className="text-center bg-background/50"
                      />
                    </div>

                    {/* Qualification Circle */}
                    <div className="flex flex-col items-center">
                      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3 shadow-lg">
                        <GraduationCap className="h-16 w-16 text-white" />
                      </div>
                      <label className="block text-sm font-medium mb-2 text-center">Qualification</label>
                      <Input
                        value={teacherProfile.qualification}
                        onChange={(e) => setTeacherProfile({ ...teacherProfile, qualification: e.target.value })}
                        placeholder="e.g., M.Ed, B.Sc, Ph.D"
                        className="text-center bg-background/50"
                      />
                    </div>

                    {/* Bio Circle */}
                    <div className="flex flex-col items-center">
                      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mb-3 shadow-lg">
                        <span className="text-6xl">📝</span>
                      </div>
                      <label className="block text-sm font-medium mb-2 text-center">Bio</label>
                      <Textarea
                        value={teacherProfile.bio}
                        onChange={(e) => setTeacherProfile({ ...teacherProfile, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                        rows={4}
                        className="text-center bg-background/50"
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
                  className="bg-gradient-to-r from-gold to-yellow-500 text-black hover:from-gold/80 hover:to-yellow-500/80 px-8 py-3 text-lg"
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

export default TeacherProfileSettings;
