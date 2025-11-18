import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Save, 
  Eye,
  EyeOff,
  Edit,
  Users,
  Award,
  Target,
  Heart,
  Shield,
  X,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AboutPageData {
  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  
  // History Section
  historyTitle: string;
  historyContent: string;
  foundedYear: string;
  
  // Mission & Vision
  missionTitle: string;
  missionContent: string;
  visionTitle: string;
  visionContent: string;
  
  // Core Values
  values: {
    excellence: { title: string; description: string };
    innovation: { title: string; description: string };
    integrity: { title: string; description: string };
    community: { title: string; description: string };
  };
  
  // Principal and Teacher Section
  leadershipTitle: string;
  leadershipDescription: string;
  
  // Staff Members
  staffMembers: {
    id: string;
    name: string;
    position: string;
    description: string;
    photos: string[];
    email?: string;
    phone?: string;
    qualifications?: string;
    experience?: string;
  }[];
  
  // Statistics
  stats: {
    students: { number: string; label: string };
    faculty: { number: string; label: string };
    programs: { number: string; label: string };
    years: { number: string; label: string };
  };
  
  // Achievements
  achievements: string[];
  
  // Contact Info
  contactInfo: {
    address: string;
    phone: string;
    email: string;
    website: string;
  };
}

const AboutPageManager = () => {
  const [aboutData, setAboutData] = useState<AboutPageData>({
    heroTitle: "About Royal Academy",
    heroSubtitle: "Excellence in Education Since 1875",
    heroDescription: "Royal Academy has been a beacon of educational excellence for over 148 years, nurturing minds and shaping the future of countless students through innovative teaching and character development.",
    
    historyTitle: "Our Rich History",
    historyContent: "Founded in 1875 by visionary educators, Royal Academy began as a small institution with big dreams. Over nearly 150 years, we have grown into one of the nation's premier educational establishments, combining time-honored traditions with innovative approaches to learning.\n\nOur journey has been marked by continuous growth, adaptation, and unwavering commitment to educational excellence. From our humble beginnings with just 50 students, we now serve over 2,500 students across multiple programs and disciplines.",
    foundedYear: "1875",
    
    missionTitle: "Our Mission",
    missionContent: "To provide exceptional education that empowers students to achieve their highest potential, fostering critical thinking, creativity, and moral leadership in a rapidly changing world. We are committed to developing well-rounded individuals who will make meaningful contributions to society.",
    
    visionTitle: "Our Vision", 
    visionContent: "To be the world's leading educational institution, recognized for academic excellence, innovative teaching, and the development of ethical leaders who will shape a better future for humanity.",
    
    values: {
      excellence: {
        title: "Excellence",
        description: "We strive for the highest standards in everything we do, from academic achievement to character development."
      },
      innovation: {
        title: "Innovation", 
        description: "We embrace new ideas, technologies, and teaching methods to enhance the learning experience."
      },
      integrity: {
        title: "Integrity",
        description: "We uphold the highest ethical standards and promote honesty, respect, and responsibility."
      },
      community: {
        title: "Community",
        description: "We foster a supportive, inclusive environment where everyone can thrive and contribute."
      }
    },
    
    leadershipTitle: "Principal and Teacher Section",
    leadershipDescription: "Meet our dedicated leadership team and faculty members who guide Royal Academy towards excellence in education.",
    
    staffMembers: [
      {
        id: "principal-1",
        name: "Dr. Sarah Johnson",
        position: "Principal",
        description: "Dr. Sarah Johnson brings over 20 years of educational leadership experience to Royal Academy. She holds a Ph.D. in Educational Administration and is passionate about creating innovative learning environments that inspire both students and teachers.",
        photos: [
          "https://images.unsplash.com/photo-1494790108755-2616c669-b163?w=400&h=400&fit=crop&crop=face&auto=format&q=80"
        ],
        email: "principal@royalacademy.edu",
        phone: "+1 (555) 123-4567",
        qualifications: "Ph.D. in Educational Administration, M.Ed. in Curriculum Development",
        experience: "20+ years in educational leadership"
      },
      {
        id: "vice-principal-1",
        name: "Prof. Michael Chen",
        position: "Vice Principal",
        description: "Prof. Michael Chen oversees academic affairs and curriculum development at Royal Academy. With his extensive background in mathematics and educational technology, he ensures our academic programs meet the highest standards.",
        photos: [
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format&q=80"
        ],
        email: "vp@royalacademy.edu",
        phone: "+1 (555) 123-4568",
        qualifications: "M.S. in Mathematics, M.Ed. in Educational Technology",
        experience: "15+ years in academic administration"
      },
      {
        id: "teacher-1",
        name: "Dr. Emily Rodriguez",
        position: "Head of Science Department",
        description: "Dr. Emily Rodriguez leads our science department with expertise in biology and environmental science. She is dedicated to fostering scientific inquiry and critical thinking among our students.",
        photos: [
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face&auto=format&q=80"
        ],
        email: "emily.rodriguez@royalacademy.edu",
        qualifications: "Ph.D. in Biology, M.S. in Environmental Science",
        experience: "12+ years in science education"
      },
      {
        id: "teacher-2",
        name: "Prof. David Wilson",
        position: "Head of Mathematics Department",
        description: "Prof. David Wilson brings innovative teaching methods to mathematics education. His passion for making complex mathematical concepts accessible has helped countless students excel in STEM fields.",
        photos: [
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80"
        ],
        email: "david.wilson@royalacademy.edu",
        qualifications: "M.S. in Mathematics, B.Ed. in Secondary Education",
        experience: "10+ years in mathematics education"
      }
    ],
    
    stats: {
      students: { number: "2,500+", label: "Students" },
      faculty: { number: "180+", label: "Faculty Members" },
      programs: { number: "45+", label: "Academic Programs" },
      years: { number: "148+", label: "Years of Excellence" }
    },
    
    achievements: [
      "Ranked #1 Private School in the Region for 5 consecutive years",
      "98% Graduate Employment Rate within 6 months",
      "Over 50 National Academic Awards in the last decade",
      "Alumni network spanning 75+ countries worldwide",
      "State-of-the-art facilities and technology integration",
      "Comprehensive scholarship programs serving 40% of students"
    ],
    
    contactInfo: {
      address: "123 Education Boulevard, Academic City, AC 12345",
      phone: "+1 (555) 123-4567",
      email: "info@royalacademy.edu",
      website: "www.royalacademy.edu"
    }
  });

  const [showPreview, setShowPreview] = useState(false);
  const [message, setMessage] = useState("");
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [isEditingStaff, setIsEditingStaff] = useState(false);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  // Photo add helpers
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoUrlInput, setPhotoUrlInput] = useState("");

  // Load data from localStorage
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('royal-academy-about');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setAboutData(parsedData);
        console.log('AboutPageManager: Loaded data from localStorage');
      } else {
        console.log('AboutPageManager: No saved data, using defaults');
      }
    } catch (error) {
      console.error('AboutPageManager: Error loading data:', error);
    }
  }, []);

  // Auto-persist any changes to the About data so the public About page sees updates immediately
  useEffect(() => {
    try {
      localStorage.setItem('royal-academy-about', JSON.stringify(aboutData));
    } catch (error) {
      console.error('AboutPageManager: Error saving data:', error);
    }
  }, [aboutData]);

  const saveData = () => {
    localStorage.setItem('royal-academy-about', JSON.stringify(aboutData));
    setMessage("About page updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const updateField = (path: string, value: any) => {
    setAboutData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const addAchievement = () => {
    const newAchievement = prompt("Enter new achievement:");
    if (newAchievement && newAchievement.trim()) {
      setAboutData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
    }
  };

  const removeAchievement = (index: number) => {
    setAboutData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  // Staff Management Functions
  const handleAddStaff = () => {
    const newStaff = {
      id: Date.now().toString(),
      name: "",
      position: "",
      description: "",
      photos: [],
      email: "",
      phone: "",
      qualifications: "",
      experience: ""
    };
    setEditingStaff(newStaff);
    setIsAddingStaff(true);
    setIsEditingStaff(true);
  };

  const handleEditStaff = (staff: any) => {
    setEditingStaff({ ...staff });
    setIsAddingStaff(false);
    setIsEditingStaff(true);
  };

  const handleSaveStaff = () => {
    if (!editingStaff || !editingStaff.name.trim() || !editingStaff.position.trim()) {
      alert("Please fill in name and position");
      return;
    }

    setAboutData(prev => {
      const updatedStaff = isAddingStaff 
        ? [...prev.staffMembers, editingStaff]
        : prev.staffMembers.map(staff => 
            staff.id === editingStaff.id ? editingStaff : staff
          );
      
      return { ...prev, staffMembers: updatedStaff };
    });

    setIsEditingStaff(false);
    setEditingStaff(null);
    setMessage(isAddingStaff ? "Staff member added successfully!" : "Staff member updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDeleteStaff = (staffId: string) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      setAboutData(prev => ({
        ...prev,
        staffMembers: prev.staffMembers.filter(staff => staff.id !== staffId)
      }));
      setMessage("Staff member deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const updateStaffField = (field: string, value: any) => {
    if (!editingStaff) return;
    setEditingStaff({ ...editingStaff, [field]: value });
  };

  // Trigger hidden file input for image upload
  const addPhoto = () => {
    if (!editingStaff) return;
    if (editingStaff.photos.length >= 4) {
      alert("Maximum 4 photos allowed per staff member");
      return;
    }
    fileInputRef.current?.click();
  };

  // Handle selected file, store as data URL for preview/persistence
  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file || !editingStaff) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setEditingStaff((prev: any) => ({
          ...prev,
          photos: [...(prev?.photos || []), dataUrl].slice(0, 4)
        }));
      };
      reader.readAsDataURL(file);
      // reset input value so same file can be chosen again if needed
      e.currentTarget.value = "";
    } catch {}
  };

  // Add photo by direct URL input
  const addPhotoByUrl = () => {
    if (!editingStaff) return;
    const url = photoUrlInput.trim();
    if (!url) return;
    if (editingStaff.photos.length >= 4) {
      alert("Maximum 4 photos allowed per staff member");
      return;
    }
    setEditingStaff({ ...editingStaff, photos: [...editingStaff.photos, url] });
    setPhotoUrlInput("");
  };

  const removePhoto = (index: number) => {
    if (!editingStaff) return;
    setEditingStaff({
      ...editingStaff,
      photos: editingStaff.photos.filter((_: any, i: number) => i !== index)
    });
  };

  return (
    <div className="space-y-6 min-h-screen bg-background text-foreground p-4">
      {/* Test Header */}
      <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
        <h3 className="text-lg font-bold text-green-800">✅ AboutPageManager is Working!</h3>
        <p className="text-sm text-green-600">Component loaded successfully. You can now manage the About page content.</p>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">About Page Manager</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Customize your school's about page content and information</p>
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
          <Button onClick={saveData} className="w-full sm:w-auto bg-gradient-to-r from-royal to-gold text-white">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
              <Edit className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Hero Section
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Page Title</label>
                <Input
                  value={aboutData.heroTitle}
                  onChange={(e) => updateField('heroTitle', e.target.value)}
                  placeholder="About Royal Academy"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Subtitle</label>
                <Input
                  value={aboutData.heroSubtitle}
                  onChange={(e) => updateField('heroSubtitle', e.target.value)}
                  placeholder="Excellence in Education Since 1875"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={aboutData.heroDescription}
                  onChange={(e) => updateField('heroDescription', e.target.value)}
                  placeholder="Brief description about the school"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* History Section */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              History Section
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Founded Year</label>
                <Input
                  value={aboutData.foundedYear}
                  onChange={(e) => updateField('foundedYear', e.target.value)}
                  placeholder="1875"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">History Title</label>
                <Input
                  value={aboutData.historyTitle}
                  onChange={(e) => updateField('historyTitle', e.target.value)}
                  placeholder="Our Rich History"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">History Content</label>
                <Textarea
                  value={aboutData.historyContent}
                  onChange={(e) => updateField('historyContent', e.target.value)}
                  placeholder="Write about the school's history and journey"
                  rows={6}
                />
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Mission & Vision
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Mission Title</label>
                <Input
                  value={aboutData.missionTitle}
                  onChange={(e) => updateField('missionTitle', e.target.value)}
                  placeholder="Our Mission"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Mission Content</label>
                <Textarea
                  value={aboutData.missionContent}
                  onChange={(e) => updateField('missionContent', e.target.value)}
                  placeholder="Describe the school's mission"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Vision Title</label>
                <Input
                  value={aboutData.visionTitle}
                  onChange={(e) => updateField('visionTitle', e.target.value)}
                  placeholder="Our Vision"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Vision Content</label>
                <Textarea
                  value={aboutData.visionContent}
                  onChange={(e) => updateField('visionContent', e.target.value)}
                  placeholder="Describe the school's vision"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Statistics */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
              <Award className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(aboutData.stats).map(([key, stat]) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium block capitalize">{key}</label>
                  <Input
                    value={stat.number}
                    onChange={(e) => updateField(`stats.${key}.number`, e.target.value)}
                    placeholder="2,500+"
                    className="text-center"
                  />
                  <Input
                    value={stat.label}
                    onChange={(e) => updateField(`stats.${key}.label`, e.target.value)}
                    placeholder="Students"
                    className="text-center text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Core Values */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Core Values
            </h3>
            <div className="space-y-4">
              {Object.entries(aboutData.values).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium block capitalize">{key}</label>
                  <Input
                    value={value.title}
                    onChange={(e) => updateField(`values.${key}.title`, e.target.value)}
                    placeholder="Excellence"
                  />
                  <Textarea
                    value={value.description}
                    onChange={(e) => updateField(`values.${key}.description`, e.target.value)}
                    placeholder="Description of this value"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Achievements
            </h3>
            <div className="space-y-3">
              {aboutData.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={achievement}
                    onChange={(e) => {
                      const newAchievements = [...aboutData.achievements];
                      newAchievements[index] = e.target.value;
                      setAboutData(prev => ({ ...prev, achievements: newAchievements }));
                    }}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeAchievement(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addAchievement}
                className="w-full"
              >
                + Add Achievement
              </Button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Address</label>
                <Textarea
                  value={aboutData.contactInfo.address}
                  onChange={(e) => updateField('contactInfo.address', e.target.value)}
                  placeholder="School address"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Phone</label>
                <Input
                  value={aboutData.contactInfo.phone}
                  onChange={(e) => updateField('contactInfo.phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input
                  value={aboutData.contactInfo.email}
                  onChange={(e) => updateField('contactInfo.email', e.target.value)}
                  placeholder="info@royalacademy.edu"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Website</label>
                <Input
                  value={aboutData.contactInfo.website}
                  onChange={(e) => updateField('contactInfo.website', e.target.value)}
                  placeholder="www.royalacademy.edu"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Management Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-heading font-bold">Principal and Teacher Section</h3>
          <Button onClick={handleAddStaff} className="bg-gradient-to-r from-royal to-gold text-white">
            <Users className="h-4 w-4 mr-2" />
            Add Staff Member
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aboutData.staffMembers.map((staff) => (
            <motion.div
              key={staff.id}
              layout
              className="bg-background/50 border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-3 mb-3">
                {staff.photos[0] && (
                  <img
                    src={staff.photos[0]}
                    alt={staff.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{staff.name}</h4>
                  <p className="text-sm text-muted-foreground">{staff.position}</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{staff.description}</p>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditStaff(staff)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Edit</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteStaff(staff.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Delete</span>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Staff Edit Modal */}
      {isEditingStaff && editingStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-bold">
                {isAddingStaff ? "Add Staff Member" : "Edit Staff Member"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingStaff(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Name *</label>
                  <Input
                    value={editingStaff.name}
                    onChange={(e) => updateStaffField('name', e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Position *</label>
                  <Input
                    value={editingStaff.position}
                    onChange={(e) => updateStaffField('position', e.target.value)}
                    placeholder="e.g., Principal, Vice Principal, Teacher"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={editingStaff.description}
                  onChange={(e) => updateStaffField('description', e.target.value)}
                  placeholder="Write about this person..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input
                    type="email"
                    value={editingStaff.email}
                    onChange={(e) => updateStaffField('email', e.target.value)}
                    placeholder="email@royalacademy.edu"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone</label>
                  <Input
                    value={editingStaff.phone}
                    onChange={(e) => updateStaffField('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Qualifications</label>
                <Input
                  value={editingStaff.qualifications}
                  onChange={(e) => updateStaffField('qualifications', e.target.value)}
                  placeholder="Ph.D., M.Ed., etc."
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Experience</label>
                <Input
                  value={editingStaff.experience}
                  onChange={(e) => updateStaffField('experience', e.target.value)}
                  placeholder="10+ years in education"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Photos (Max 4)</label>
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoFileChange}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addPhoto}
                      disabled={editingStaff.photos.length >= 4}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Upload
                    </Button>
                  </div>
                </div>

                {/* Add via URL */}
                <div className="flex items-center gap-2 mb-3">
                  <Input
                    placeholder="Paste image URL..."
                    value={photoUrlInput}
                    onChange={(e) => setPhotoUrlInput(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addPhotoByUrl}
                    disabled={!photoUrlInput.trim() || editingStaff.photos.length >= 4}
                  >
                    Add URL
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {editingStaff.photos.map((photo: string, index: number) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 h-6 w-6 p-0 bg-red-600 text-white hover:bg-red-700"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={() => setIsEditingStaff(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveStaff} className="bg-gradient-to-r from-royal to-gold text-white">
                <Save className="h-4 w-4 mr-2" />
                {isAddingStaff ? "Add" : "Update"} Staff Member
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Link */}
      {showPreview && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <div>
              <h3 className="font-semibold text-foreground">Live Preview</h3>
              <p className="text-sm text-muted-foreground">View how the about page looks to visitors</p>
            </div>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                try {
                  localStorage.setItem('royal-academy-about', JSON.stringify(aboutData));
                } catch {}
                window.open('/about', '_blank');
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              Open About Page
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutPageManager;
