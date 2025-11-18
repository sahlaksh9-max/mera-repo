import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Edit, Trash2, Save, X, Upload, Crown, Trophy, Medal, Award, Star,
  BookOpen, Target, Users, Calendar, Image as ImageIcon, GraduationCap, Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Student {
  id: number;
  name: string;
  slug: string;
  grade: string;
  subject: string;
  score: string;
  year: string;
  rank: number;
  achievements: string[];
  image: string;
  images: string[]; // Multiple images support
  description: string;
  fullBio: string;
  subjects: { name: string; grade: string; score: string; }[];
  extracurricular: string[];
  awards: { year: string; award: string; description: string; }[];
  futureGoals: string;
  universityAcceptances: string[];
  testimonial: string;
  testimonialBy: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Year {
  id: string;
  name: string;
}

const TopScorersManager = () => {
  const [activeTab, setActiveTab] = useState<"students" | "categories" | "years">("students");
  const [students, setStudents] = useState<Student[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [years, setYears] = useState<Year[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingYear, setEditingYear] = useState<Year | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showYearModal, setShowYearModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedStudents = localStorage.getItem('royal-academy-top-scorers');
    const savedCategories = localStorage.getItem('royal-academy-categories');
    const savedYears = localStorage.getItem('royal-academy-years');

    if (savedStudents) setStudents(JSON.parse(savedStudents));
    if (savedCategories) setCategories(JSON.parse(savedCategories));
    if (savedYears) setYears(JSON.parse(savedYears));

    // Initialize with default data if empty
    if (!savedCategories) {
      const defaultCategories = [
        { id: "all", name: "All Subjects", icon: "BookOpen" },
        { id: "science", name: "Science", icon: "Zap" },
        { id: "mathematics", name: "Mathematics", icon: "Target" },
        { id: "english", name: "English", icon: "BookOpen" },
        { id: "overall", name: "Overall Performance", icon: "Crown" }
      ];
      setCategories(defaultCategories);
      localStorage.setItem('royal-academy-categories', JSON.stringify(defaultCategories));
    }

    if (!savedYears) {
      const defaultYears = [
        { id: "2024", name: "2024" },
        { id: "2023", name: "2023" },
        { id: "2022", name: "2022" }
      ];
      setYears(defaultYears);
      localStorage.setItem('royal-academy-years', JSON.stringify(defaultYears));
    }
  }, []);

  // Save functions
  const saveStudents = (updatedStudents: Student[]) => {
    setStudents(updatedStudents);
    localStorage.setItem('royal-academy-top-scorers', JSON.stringify(updatedStudents));
  };

  const saveCategories = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
    localStorage.setItem('royal-academy-categories', JSON.stringify(updatedCategories));
  };

  const saveYears = (updatedYears: Year[]) => {
    setYears(updatedYears);
    localStorage.setItem('royal-academy-years', JSON.stringify(updatedYears));
  };

  // Image handling functions
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || !editingStudent) return;
    
    const currentImages = editingStudent.images || [];
    const maxImages = 5;
    const remainingSlots = maxImages - currentImages.length;
    
    if (remainingSlots <= 0) {
      alert('Maximum 5 images allowed per student');
      return;
    }
    
    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    const newImages: string[] = [];
    
    for (const file of filesToProcess) {
      if (file.type.startsWith('image/')) {
        try {
          const base64 = await convertToBase64(file);
          newImages.push(base64);
        } catch (error) {
          console.error('Error converting image:', error);
        }
      }
    }
    
    const updatedImages = [...currentImages, ...newImages];
    setEditingStudent({
      ...editingStudent,
      images: updatedImages,
      image: updatedImages[0] || editingStudent.image // Set first image as primary
    });
  };

  const removeImage = (index: number) => {
    if (!editingStudent) return;
    
    const updatedImages = editingStudent.images.filter((_, i) => i !== index);
    setEditingStudent({
      ...editingStudent,
      images: updatedImages,
      image: updatedImages[0] || "https://images.unsplash.com/photo-1494790108755-2616c669-b163?w=400&h=400&fit=crop&crop=face&auto=format&q=80"
    });
  };

  const setPrimaryImage = (index: number) => {
    if (!editingStudent) return;
    
    const selectedImage = editingStudent.images[index];
    setEditingStudent({
      ...editingStudent,
      image: selectedImage
    });
  };

  // Student management
  const handleAddStudent = () => {
    const newStudent: Student = {
      id: Date.now(),
      name: "",
      slug: "",
      grade: "",
      subject: "overall",
      score: "",
      year: "2024",
      rank: 1,
      achievements: [],
      image: "https://images.unsplash.com/photo-1494790108755-2616c669-b163?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      images: [],
      description: "",
      fullBio: "",
      subjects: [],
      extracurricular: [],
      awards: [],
      futureGoals: "",
      universityAcceptances: [],
      testimonial: "",
      testimonialBy: ""
    };
    setEditingStudent(newStudent);
    setShowStudentModal(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent({ ...student });
    setShowStudentModal(true);
  };

  const handleSaveStudent = () => {
    if (!editingStudent) return;

    const updatedStudents = editingStudent.id === 0 || !students.find(s => s.id === editingStudent.id)
      ? [...students, { ...editingStudent, id: editingStudent.id || Date.now() }]
      : students.map(s => s.id === editingStudent.id ? editingStudent : s);

    saveStudents(updatedStudents);
    setShowStudentModal(false);
    setEditingStudent(null);
  };

  const handleDeleteStudent = (id: number) => {
    if (confirm('Are you sure you want to delete this student?')) {
      const updatedStudents = students.filter(s => s.id !== id);
      saveStudents(updatedStudents);
    }
  };

  // Category management
  const handleAddCategory = () => {
    const newCategory: Category = { id: "", name: "", icon: "BookOpen" };
    setEditingCategory(newCategory);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory({ ...category });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = () => {
    if (!editingCategory || !editingCategory.name) return;

    const categoryId = editingCategory.id || editingCategory.name.toLowerCase().replace(/\s+/g, '-');
    const categoryToSave = { ...editingCategory, id: categoryId };

    const updatedCategories = editingCategory.id && categories.find(c => c.id === editingCategory.id)
      ? categories.map(c => c.id === editingCategory.id ? categoryToSave : c)
      : [...categories, categoryToSave];

    saveCategories(updatedCategories);
    setShowCategoryModal(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      const updatedCategories = categories.filter(c => c.id !== id);
      saveCategories(updatedCategories);
    }
  };

  // Year management
  const handleAddYear = () => {
    const newYear: Year = { id: "", name: "" };
    setEditingYear(newYear);
    setShowYearModal(true);
  };

  const handleEditYear = (year: Year) => {
    setEditingYear({ ...year });
    setShowYearModal(true);
  };

  const handleSaveYear = () => {
    if (!editingYear || !editingYear.name) return;

    const yearId = editingYear.id || editingYear.name;
    const yearToSave = { ...editingYear, id: yearId };

    const updatedYears = editingYear.id && years.find(y => y.id === editingYear.id)
      ? years.map(y => y.id === editingYear.id ? yearToSave : y)
      : [...years, yearToSave];

    saveYears(updatedYears);
    setShowYearModal(false);
    setEditingYear(null);
  };

  const handleDeleteYear = (id: string) => {
    if (confirm('Are you sure you want to delete this year?')) {
      const updatedYears = years.filter(y => y.id !== id);
      saveYears(updatedYears);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-gold" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <Star className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-gradient-gold text-center sm:text-left">
          Top Scorers Management
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant={activeTab === "students" ? "default" : "outline"}
              onClick={() => setActiveTab("students")}
              size="sm"
              className="flex-1 sm:flex-none"
            >
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden xs:inline">Students</span>
              <span className="xs:hidden">Students</span>
            </Button>
            <Button
              variant={activeTab === "categories" ? "default" : "outline"}
              onClick={() => setActiveTab("categories")}
              size="sm"
              className="flex-1 sm:flex-none"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              <span className="hidden xs:inline">Categories</span>
              <span className="xs:hidden">Cats</span>
            </Button>
            <Button
              variant={activeTab === "years" ? "default" : "outline"}
              onClick={() => setActiveTab("years")}
              size="sm"
              className="flex-1 sm:flex-none"
            >
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden xs:inline">Years</span>
              <span className="xs:hidden">Years</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Students Tab */}
      {activeTab === "students" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Manage Students</h3>
            <Button onClick={handleAddStudent} className="bg-gradient-to-r from-gold to-yellow-500 text-black">
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-3d p-4"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={student.image}
                    alt={student.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gold/30"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{student.name}</h4>
                    <p className="text-sm text-muted-foreground">{student.grade}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getRankIcon(student.rank)}
                    <span className="text-sm font-medium">#{student.rank}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">Score:</span>
                  <span className="font-semibold text-gold">{student.score}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditStudent(student)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteStudent(student.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Manage Categories</h3>
            <Button onClick={handleAddCategory} className="bg-gradient-to-r from-gold to-yellow-500 text-black">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-3d p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-gold" />
                    <span className="font-semibold">{category.name}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCategory(category)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Years Tab */}
      {activeTab === "years" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Manage Years</h3>
            <Button onClick={handleAddYear} className="bg-gradient-to-r from-gold to-yellow-500 text-black">
              <Plus className="h-4 w-4 mr-2" />
              Add Year
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {years.map((year) => (
              <motion.div
                key={year.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-3d p-4 text-center"
              >
                <div className="flex items-center justify-center mb-3">
                  <Calendar className="h-8 w-8 text-gold" />
                </div>
                <h4 className="font-semibold text-lg mb-3">{year.name}</h4>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditYear(year)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteYear(year.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Student Modal */}
      <AnimatePresence>
        {showStudentModal && editingStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowStudentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden mx-2 sm:mx-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="text-xl font-heading font-bold">
                  {editingStudent.id ? 'Edit Student' : 'Add New Student'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowStudentModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-140px)] sm:max-h-[calc(90vh-140px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gold">Basic Information</h4>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Name *</label>
                      <Input
                        value={editingStudent.name}
                        onChange={(e) => setEditingStudent({
                          ...editingStudent,
                          name: e.target.value,
                          slug: e.target.value.toLowerCase().replace(/\s+/g, '-')
                        })}
                        placeholder="Student name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Grade *</label>
                      <Input
                        value={editingStudent.grade}
                        onChange={(e) => setEditingStudent({...editingStudent, grade: e.target.value})}
                        placeholder="e.g., Grade 12"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Subject Category *</label>
                      <select
                        value={editingStudent.subject}
                        onChange={(e) => setEditingStudent({...editingStudent, subject: e.target.value})}
                        className="w-full p-3 border border-border rounded-lg bg-background"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Year *</label>
                      <select
                        value={editingStudent.year}
                        onChange={(e) => setEditingStudent({...editingStudent, year: e.target.value})}
                        className="w-full p-3 border border-border rounded-lg bg-background"
                      >
                        {years.map(year => (
                          <option key={year.id} value={year.id}>{year.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Rank *</label>
                      <Input
                        type="number"
                        min="1"
                        value={editingStudent.rank}
                        onChange={(e) => setEditingStudent({...editingStudent, rank: parseInt(e.target.value) || 1})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Score *</label>
                      <Input
                        value={editingStudent.score}
                        onChange={(e) => setEditingStudent({...editingStudent, score: e.target.value})}
                        placeholder="e.g., 98.5%"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Student Images (1-5 images)</label>
                      
                      {/* Image Upload Button */}
                      <div className="mb-4">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleImageUpload(e.target.files)}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full"
                          disabled={editingStudent.images.length >= 5}
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Upload Images from Device ({editingStudent.images.length}/5)
                        </Button>
                      </div>

                      {/* Current Images Display */}
                      {editingStudent.images.length > 0 && (
                        <div className="space-y-3">
                          <h5 className="text-sm font-medium">Uploaded Images:</h5>
                          <div className="grid grid-cols-2 gap-3">
                            {editingStudent.images.map((img, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={img}
                                  alt={`Student ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg border-2 border-border"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setPrimaryImage(index)}
                                    className="text-xs"
                                  >
                                    {editingStudent.image === img ? 'Primary' : 'Set Primary'}
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => removeImage(index)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                                {editingStudent.image === img && (
                                  <div className="absolute -top-2 -right-2 bg-gold text-black text-xs px-2 py-1 rounded-full font-bold">
                                    PRIMARY
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Fallback URL Input */}
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Or Image URL</label>
                        <Input
                          value={editingStudent.image}
                          onChange={(e) => setEditingStudent({...editingStudent, image: e.target.value})}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Detailed Info */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gold">Detailed Information</h4>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Short Description</label>
                      <Textarea
                        value={editingStudent.description}
                        onChange={(e) => setEditingStudent({...editingStudent, description: e.target.value})}
                        placeholder="Brief description..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Full Biography</label>
                      <Textarea
                        value={editingStudent.fullBio}
                        onChange={(e) => setEditingStudent({...editingStudent, fullBio: e.target.value})}
                        placeholder="Detailed biography..."
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Achievements (comma-separated)</label>
                      <Textarea
                        value={editingStudent.achievements.join(', ')}
                        onChange={(e) => setEditingStudent({
                          ...editingStudent,
                          achievements: e.target.value.split(',').map(a => a.trim()).filter(a => a)
                        })}
                        placeholder="Achievement 1, Achievement 2, ..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Future Goals</label>
                      <Textarea
                        value={editingStudent.futureGoals}
                        onChange={(e) => setEditingStudent({...editingStudent, futureGoals: e.target.value})}
                        placeholder="Future aspirations..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Testimonial</label>
                      <Textarea
                        value={editingStudent.testimonial}
                        onChange={(e) => setEditingStudent({...editingStudent, testimonial: e.target.value})}
                        placeholder="Faculty testimonial..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Testimonial By</label>
                      <Input
                        value={editingStudent.testimonialBy}
                        onChange={(e) => setEditingStudent({...editingStudent, testimonialBy: e.target.value})}
                        placeholder="e.g., Dr. Sarah Johnson, Principal"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 p-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setShowStudentModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveStudent}
                  className="bg-gradient-to-r from-gold to-yellow-500 text-black"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Student
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Modal */}
      <AnimatePresence>
        {showCategoryModal && editingCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCategoryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-2xl shadow-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="text-xl font-heading font-bold">
                  {editingCategory.id ? 'Edit Category' : 'Add New Category'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCategoryModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category Name *</label>
                  <Input
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                    placeholder="e.g., Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Icon</label>
                  <select
                    value={editingCategory.icon}
                    onChange={(e) => setEditingCategory({...editingCategory, icon: e.target.value})}
                    className="w-full p-3 border border-border rounded-lg bg-background"
                  >
                    <option value="BookOpen">BookOpen</option>
                    <option value="Zap">Zap</option>
                    <option value="Target">Target</option>
                    <option value="Crown">Crown</option>
                    <option value="Trophy">Trophy</option>
                    <option value="GraduationCap">GraduationCap</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 p-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setShowCategoryModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveCategory}
                  className="bg-gradient-to-r from-gold to-yellow-500 text-black"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Category
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Year Modal */}
      <AnimatePresence>
        {showYearModal && editingYear && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowYearModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-2xl shadow-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="text-xl font-heading font-bold">
                  {editingYear.id ? 'Edit Year' : 'Add New Year'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowYearModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Year *</label>
                  <Input
                    value={editingYear.name}
                    onChange={(e) => setEditingYear({...editingYear, name: e.target.value})}
                    placeholder="e.g., 2024"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 p-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setShowYearModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveYear}
                  className="bg-gradient-to-r from-gold to-yellow-500 text-black"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Year
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopScorersManager;
