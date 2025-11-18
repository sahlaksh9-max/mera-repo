import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Eye, Edit, Users, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AboutPageData {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  historyTitle: string;
  historyContent: string;
  missionTitle: string;
  missionContent: string;
  visionTitle: string;
  visionContent: string;
  values: {
    excellence: { title: string; description: string };
    innovation: { title: string; description: string };
    integrity: { title: string; description: string };
    community: { title: string; description: string };
  };
  leadershipTitle: string;
  leadershipDescription: string;
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
  stats: {
    students: { number: string; label: string };
    faculty: { number: string; label: string };
    programs: { number: string; label: string };
    years: { number: string; label: string };
  };
  achievements: string[];
  contactInfo: {
    address: string;
    phone: string;
    email: string;
    website: string;
  };
}

const AboutPageManagerWorking = () => {
  const [aboutData, setAboutData] = useState<AboutPageData>({
    heroTitle: "About Royal Academy",
    heroSubtitle: "Excellence in Education Since 1875",
    heroDescription: "Royal Academy has been a beacon of educational excellence for over 148 years, nurturing minds and shaping the future of countless students through innovative teaching and character development.",
    historyTitle: "Our Rich History",
    historyContent: "Founded in 1875 by visionary educators, Royal Academy began as a small institution with big dreams. Over nearly 150 years, we have grown into one of the nation's premier educational establishments, combining time-honored traditions with innovative approaches to learning.",
    missionTitle: "Our Mission",
    missionContent: "To provide exceptional education that empowers students to achieve their highest potential, fostering critical thinking, creativity, and moral leadership in a rapidly changing world.",
    visionTitle: "Our Vision",
    visionContent: "To be the world's leading educational institution, recognized for academic excellence, innovative teaching, and the development of ethical leaders who will shape a better future for humanity.",
    values: {
      excellence: { title: "Excellence", description: "We strive for the highest standards in everything we do, from academic achievement to character development." },
      innovation: { title: "Innovation", description: "We embrace new ideas, technologies, and teaching methods to enhance the learning experience." },
      integrity: { title: "Integrity", description: "We uphold the highest ethical standards and promote honesty, respect, and responsibility." },
      community: { title: "Community", description: "We foster a supportive, inclusive environment where everyone can thrive and contribute." }
    },
    leadershipTitle: "Principal and Teacher Section",
    leadershipDescription: "Meet our dedicated leadership team and faculty members who guide Royal Academy towards excellence in education.",
    staffMembers: [
      {
        id: "principal-1",
        name: "Dr. Sarah Johnson",
        position: "Principal",
        description: "Dr. Sarah Johnson brings over 20 years of educational leadership experience to Royal Academy.",
        photos: ["https://images.unsplash.com/photo-1494790108755-2616c669-b163?w=400&h=400&fit=crop&crop=face&auto=format&q=80"],
        email: "principal@royalacademy.edu",
        phone: "+1 (555) 123-4567",
        qualifications: "Ph.D. in Educational Administration",
        experience: "20+ years in educational leadership"
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

  const [message, setMessage] = useState("");
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [isEditingStaff, setIsEditingStaff] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('royal-academy-about');
    if (savedData) {
      try {
        setAboutData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
  }, []);

  const saveData = () => {
    localStorage.setItem('royal-academy-about', JSON.stringify(aboutData));
    setMessage("About page updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const updateField = (field: string, value: string) => {
    setAboutData(prev => ({ ...prev, [field]: value }));
  };

  const updateValueField = (valueKey: string, field: string, value: string) => {
    setAboutData(prev => ({
      ...prev,
      values: {
        ...prev.values,
        [valueKey]: {
          ...prev.values[valueKey as keyof typeof prev.values],
          [field]: value
        }
      }
    }));
  };

  const addStaff = () => {
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
    setIsEditingStaff(true);
  };

  const saveStaff = () => {
    if (!editingStaff.name || !editingStaff.position) {
      alert("Please fill in name and position");
      return;
    }

    const existingIndex = aboutData.staffMembers.findIndex(s => s.id === editingStaff.id);
    if (existingIndex >= 0) {
      const updatedStaff = [...aboutData.staffMembers];
      updatedStaff[existingIndex] = editingStaff;
      setAboutData(prev => ({ ...prev, staffMembers: updatedStaff }));
    } else {
      setAboutData(prev => ({ ...prev, staffMembers: [...prev.staffMembers, editingStaff] }));
    }

    setIsEditingStaff(false);
    setEditingStaff(null);
    setMessage("Staff member saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const deleteStaff = (id: string) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      setAboutData(prev => ({
        ...prev,
        staffMembers: prev.staffMembers.filter(s => s.id !== id)
      }));
      setMessage("Staff member deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="space-y-8 p-6 bg-white text-black min-h-screen">
      {/* Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-2xl font-bold text-blue-800 mb-2">✅ About Page Manager</h2>
        <p className="text-blue-600">Edit your school's About page content below. Changes will appear on the public About page.</p>
      </div>

      {/* Success Message */}
      {message && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">{message}</AlertDescription>
        </Alert>
      )}

      {/* Hero Section */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Hero Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Title</label>
            <Input
              value={aboutData.heroTitle}
              onChange={(e) => updateField('heroTitle', e.target.value)}
              className="bg-white border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Subtitle</label>
            <Input
              value={aboutData.heroSubtitle}
              onChange={(e) => updateField('heroSubtitle', e.target.value)}
              className="bg-white border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Description</label>
            <Textarea
              value={aboutData.heroDescription}
              onChange={(e) => updateField('heroDescription', e.target.value)}
              rows={3}
              className="bg-white border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-xl font-bold mb-4 text-gray-800">History Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">History Title</label>
            <Input
              value={aboutData.historyTitle}
              onChange={(e) => updateField('historyTitle', e.target.value)}
              className="bg-white border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">History Content</label>
            <Textarea
              value={aboutData.historyContent}
              onChange={(e) => updateField('historyContent', e.target.value)}
              rows={4}
              className="bg-white border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Mission & Vision</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Mission Title</label>
            <Input
              value={aboutData.missionTitle}
              onChange={(e) => updateField('missionTitle', e.target.value)}
              className="bg-white border-gray-300 mb-3"
            />
            <label className="block text-sm font-medium mb-2 text-gray-700">Mission Content</label>
            <Textarea
              value={aboutData.missionContent}
              onChange={(e) => updateField('missionContent', e.target.value)}
              rows={3}
              className="bg-white border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Vision Title</label>
            <Input
              value={aboutData.visionTitle}
              onChange={(e) => updateField('visionTitle', e.target.value)}
              className="bg-white border-gray-300 mb-3"
            />
            <label className="block text-sm font-medium mb-2 text-gray-700">Vision Content</label>
            <Textarea
              value={aboutData.visionContent}
              onChange={(e) => updateField('visionContent', e.target.value)}
              rows={3}
              className="bg-white border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Core Values</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(aboutData.values).map(([key, value]) => (
            <div key={key} className="space-y-3">
              <h4 className="font-medium text-gray-700 capitalize">{key}</h4>
              <Input
                placeholder="Title"
                value={value.title}
                onChange={(e) => updateValueField(key, 'title', e.target.value)}
                className="bg-white border-gray-300"
              />
              <Textarea
                placeholder="Description"
                value={value.description}
                onChange={(e) => updateValueField(key, 'description', e.target.value)}
                rows={2}
                className="bg-white border-gray-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Staff Management */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Staff Members</h3>
          <Button onClick={addStaff} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aboutData.staffMembers.map((staff) => (
            <div key={staff.id} className="bg-white p-4 rounded-lg border border-gray-200">
              {staff.photos[0] && (
                <img
                  src={staff.photos[0]}
                  alt={staff.name}
                  className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                />
              )}
              <h4 className="font-medium text-center text-gray-800">{staff.name}</h4>
              <p className="text-sm text-center text-gray-600 mb-3">{staff.position}</p>
              <div className="flex justify-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingStaff(staff);
                    setIsEditingStaff(true);
                  }}
                  className="text-blue-600 border-blue-300"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteStaff(staff.id)}
                  className="text-red-600 border-red-300"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Edit Modal */}
      {isEditingStaff && editingStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Edit Staff Member</h3>
            <div className="space-y-4">
              <Input
                placeholder="Name"
                value={editingStaff.name}
                onChange={(e) => setEditingStaff({...editingStaff, name: e.target.value})}
                className="bg-white border-gray-300"
              />
              <Input
                placeholder="Position"
                value={editingStaff.position}
                onChange={(e) => setEditingStaff({...editingStaff, position: e.target.value})}
                className="bg-white border-gray-300"
              />
              <Textarea
                placeholder="Description"
                value={editingStaff.description}
                onChange={(e) => setEditingStaff({...editingStaff, description: e.target.value})}
                rows={3}
                className="bg-white border-gray-300"
              />
              <Input
                placeholder="Photo URL"
                value={editingStaff.photos[0] || ''}
                onChange={(e) => setEditingStaff({...editingStaff, photos: [e.target.value]})}
                className="bg-white border-gray-300"
              />
              <Input
                placeholder="Email"
                value={editingStaff.email || ''}
                onChange={(e) => setEditingStaff({...editingStaff, email: e.target.value})}
                className="bg-white border-gray-300"
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsEditingStaff(false)}
                className="border-gray-300"
              >
                Cancel
              </Button>
              <Button onClick={saveStaff} className="bg-blue-600 hover:bg-blue-700 text-white">
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveData} className="bg-green-600 hover:bg-green-700 text-white">
          <Save className="h-4 w-4 mr-2" />
          Save All Changes
        </Button>
      </div>

      {/* Preview Link */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-blue-800">Preview Changes</h3>
            <p className="text-sm text-blue-600">View how your changes look on the public About page</p>
          </div>
          <Button variant="outline" asChild className="border-blue-300 text-blue-600">
            <a href="/about" target="_blank" rel="noopener noreferrer">
              <Eye className="h-4 w-4 mr-2" />
              View About Page
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AboutPageManagerWorking;
