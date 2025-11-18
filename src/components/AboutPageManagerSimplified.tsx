import { useState, useEffect } from "react";
import { Save, Plus, X, Edit } from "lucide-react";
import { Button } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SchoolInfo {
  // Basic Information
  schoolName: string;
  motto: string;
  foundedYear: string;
  principalName: string;
  
  // Contact Information
  address: string;
  phone: string;
  email: string;
  website: string;
  
  // About Content
  aboutTitle: string;
  aboutDescription: string;
  missionStatement: string;
  visionStatement: string;
  
  // Statistics
  totalStudents: string;
  totalTeachers: string;
  totalCourses: string;
  yearsOfExcellence: string;
  
  // Achievements
  achievements: string[];
}

const AboutPageManagerSimplified = () => {
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>({
    schoolName: "Royal Academy",
    motto: "Excellence in Education",
    foundedYear: "1875",
    principalName: "Dr. Sarah Johnson",
    address: "123 Education Boulevard, Academic City, AC 12345",
    phone: "+1 (555) 123-4567",
    email: "info@royalacademy.edu",
    website: "www.royalacademy.edu",
    aboutTitle: "About Royal Academy",
    aboutDescription: "Royal Academy has been a beacon of educational excellence for over 148 years, nurturing minds and shaping the future of countless students.",
    missionStatement: "To provide exceptional education that empowers students to achieve their highest potential.",
    visionStatement: "To be the world's leading educational institution, recognized for academic excellence.",
    totalStudents: "2,500+",
    totalTeachers: "180+",
    totalCourses: "45+",
    yearsOfExcellence: "148+",
    achievements: [
      "Ranked #1 Private School in the Region",
      "98% Graduate Employment Rate",
      "50+ National Academic Awards"
    ]
  });

  const [message, setMessage] = useState("");
  const [newAchievement, setNewAchievement] = useState("");

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('school-info-simplified');
    if (savedData) {
      try {
        setSchoolInfo(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage
  const saveData = () => {
    try {
      localStorage.setItem('school-info-simplified', JSON.stringify(schoolInfo));
      // Also save to the main about page key
      const aboutPageData = {
        heroTitle: schoolInfo.aboutTitle,
        heroSubtitle: schoolInfo.motto,
        heroDescription: schoolInfo.aboutDescription,
        foundedYear: schoolInfo.foundedYear,
        missionTitle: "Our Mission",
        missionContent: schoolInfo.missionStatement,
        visionTitle: "Our Vision",
        visionContent: schoolInfo.visionStatement,
        stats: {
          students: { number: schoolInfo.totalStudents, label: "Students" },
          faculty: { number: schoolInfo.totalTeachers, label: "Faculty" },
          programs: { number: schoolInfo.totalCourses, label: "Programs" },
          years: { number: schoolInfo.yearsOfExcellence, label: "Years" }
        },
        achievements: schoolInfo.achievements,
        contactInfo: {
          address: schoolInfo.address,
          phone: schoolInfo.phone,
          email: schoolInfo.email,
          website: schoolInfo.website
        },
        historyTitle: "Our History",
        historyContent: `Founded in ${schoolInfo.foundedYear}, ${schoolInfo.schoolName} has been dedicated to excellence in education.`,
        values: {
          excellence: { title: "Excellence", description: "Striving for the highest standards" },
          innovation: { title: "Innovation", description: "Embracing new ideas and methods" },
          integrity: { title: "Integrity", description: "Upholding ethical standards" },
          community: { title: "Community", description: "Fostering a supportive environment" }
        },
        leadershipTitle: "Our Leadership",
        leadershipDescription: `Led by ${schoolInfo.principalName}`,
        staffMembers: []
      };
      localStorage.setItem('royal-academy-about', JSON.stringify(aboutPageData));
      
      setMessage("✅ School information saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("❌ Error saving data. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const updateField = (field: keyof SchoolInfo, value: string) => {
    setSchoolInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setSchoolInfo(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement("");
    }
  };

  const removeAchievement = (index: number) => {
    setSchoolInfo(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  return (
    <div style={{ 
      padding: "24px", 
      backgroundColor: "white", 
      color: "black", 
      borderRadius: "12px",
      minHeight: "600px"
    }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "8px", color: "#1a1a1a" }}>
          📝 Update School Information
        </h2>
        <p style={{ color: "#666", fontSize: "14px" }}>
          Edit your school's information below. Changes will be reflected on the About page.
        </p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div style={{
          padding: "12px 16px",
          marginBottom: "24px",
          backgroundColor: message.includes("✅") ? "#d4edda" : "#f8d7da",
          color: message.includes("✅") ? "#155724" : "#721c24",
          borderRadius: "8px",
          border: `1px solid ${message.includes("✅") ? "#c3e6cb" : "#f5c6cb"}`
        }}>
          {message}
        </div>
      )}

      {/* Form Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Basic Information Section */}
          <div style={{ 
            padding: "20px", 
            backgroundColor: "#f8f9fa", 
            borderRadius: "8px",
            border: "1px solid #dee2e6"
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#495057" }}>
              🏫 Basic Information
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#495057" }}>
                  School Name
                </label>
                <Input
                  value={schoolInfo.schoolName}
                  onChange={(e) => updateField('schoolName', e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#495057" }}>
                  School Motto
                </label>
                <Input
                  value={schoolInfo.motto}
                  onChange={(e) => updateField('motto', e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#495057" }}>
                  Founded Year
                </label>
                <Input
                  value={schoolInfo.foundedYear}
                  onChange={(e) => updateField('foundedYear', e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#495057" }}>
                  Principal Name
                </label>
                <Input
                  value={schoolInfo.principalName}
                  onChange={(e) => updateField('principalName', e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div style={{ 
            padding: "20px", 
            backgroundColor: "#f8f9fa", 
            borderRadius: "8px",
            border: "1px solid #dee2e6"
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#495057" }}>
              📞 Contact Information
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#495057" }}>
                  Address
                </label>
                <Textarea
                  value={schoolInfo.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  rows={2}
                  style={{ width: "100%" }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#495057" }}>
                  Phone
                </label>
                <Input
                  value={schoolInfo.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#495057" }}>
                  Email
                </label>
                <Input
                  value={schoolInfo.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#495057" }}>
                  Website
                </label>
                <Input
                  value={schoolInfo.website}
                  onChange={(e) => updateField('website', e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* About Content Section */}
          <div style={{ 
            padding: "20px", 
            backgroundColor: "#f8f9fa", 
            borderRadius: "8px",
            border: "1px solid #dee2e6"
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#495057" }}>
              📖 About Content
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#495057" }}>
                  About Title
                </label>
                <Input
                  value={schoolInfo.aboutTitle}
                  onChange={(e) => updateField('aboutTitle', e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#495057" }}>
                  About Description
                </label>
                <Textarea
                  value={schoolInfo.aboutDescription}
                  onChange={(e) => updateField('aboutDescription', e.target.value)}
                  rows={3}
                  style={{ width: "100%" }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#495057" }}>
                  Mission Statement
                </label>
                <Textarea
                  value={schoolInfo.missionStatement}
                  onChange={(e) => updateField('missionStatement', e.target.value)}
                  rows={2}
                  style={{ width: "100%" }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#495057" }}>
                  Vision Statement
                </label>
                <Textarea
                  value={schoolInfo.visionStatement}
                  onChange={(e) => updateField('visionStatement', e.target.value)}
                  rows={2}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div style={{ 
            padding: "20px", 
            backgroundColor: "#f8f9fa", 
            borderRadius: "8px",
            border: "1px solid #dee2e6"
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#495057" }}>
              📊 Statistics
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#495057" }}>
                  Total Students
                </label>
                <Input
                  value={schoolInfo.totalStudents}
                  onChange={(e) => updateField('totalStudents', e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#495057" }}>
                  Total Teachers
                </label>
                <Input
                  value={schoolInfo.totalTeachers}
                  onChange={(e) => updateField('totalTeachers', e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#495057" }}>
                  Total Courses
                </label>
                <Input
                  value={schoolInfo.totalCourses}
                  onChange={(e) => updateField('totalCourses', e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#495057" }}>
                  Years of Excellence
                </label>
                <Input
                  value={schoolInfo.yearsOfExcellence}
                  onChange={(e) => updateField('yearsOfExcellence', e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div style={{ 
        padding: "20px", 
        backgroundColor: "#f8f9fa", 
        borderRadius: "8px",
        border: "1px solid #dee2e6",
        marginBottom: "32px"
      }}>
        <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#495057" }}>
          🏆 Achievements
        </h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {schoolInfo.achievements.map((achievement, index) => (
            <div key={index} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Input
                value={achievement}
                onChange={(e) => {
                  const newAchievements = [...schoolInfo.achievements];
                  newAchievements[index] = e.target.value;
                  setSchoolInfo(prev => ({ ...prev, achievements: newAchievements }));
                }}
                style={{ flex: 1 }}
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeAchievement(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <div style={{ display: "flex", gap: "8px" }}>
            <Input
              placeholder="Add new achievement..."
              value={newAchievement}
              onChange={(e) => setNewAchievement(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addAchievement()}
              style={{ flex: 1 }}
            />
            <Button
              variant="outline"
              onClick={addAchievement}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
        <Button
          onClick={saveData}
          size="lg"
          style={{ 
            backgroundColor: "#28a745",
            color: "white",
            padding: "12px 32px",
            fontSize: "16px",
            fontWeight: "600"
          }}
        >
          <Save className="h-5 w-5 mr-2" />
          Save All Changes
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={() => window.open('/about', '_blank')}
          style={{ 
            padding: "12px 32px",
            fontSize: "16px"
          }}
        >
          Preview About Page
        </Button>
      </div>
    </div>
  );
};

export default AboutPageManagerSimplified;
