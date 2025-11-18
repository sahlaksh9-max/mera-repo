import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Upload, 
  Users, 
  GraduationCap,
  Award,
  Calendar,
  BookOpen,
  Eye,
  EyeOff,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getSupabaseData, setSupabaseData, subscribeToSupabaseChanges } from "@/lib/supabaseHelpers";

interface Course {
  name: string;
  description: string;
  level: string;
  prerequisites: string;
}

interface Teacher {
  id: string;
  name: string;
  position: string;
  subject: string;
  image: string;
  experience: string;
  education: string;
  specialties: string[];
  achievements: string[];
  department: string;
  email?: string;
  phone?: string;
  office?: string;
  officeHours?: string;
  biography?: string;
  philosophy?: string;
  courses?: Course[];
}

interface Department {
  name: string;
  color: string;
  teachers: Teacher[];
}

const TeacherManager = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [message, setMessage] = useState("");
  const [isEditingDepartments, setIsEditingDepartments] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  // Initialize with default data
  useEffect(() => {
    const loadData = async () => {
      const defaultDepartments: Department[] = [
      {
        name: "Mathematics & Sciences",
        color: "from-blue-500 to-cyan-500",
        teachers: [
          {
            id: "dr-sarah-chen",
            name: "Dr. Sarah Chen",
            position: "Head of Mathematics Department",
            subject: "Advanced Mathematics & Calculus",
            image: "/api/placeholder/300/400",
            experience: "15 years",
            education: "Ph.D. Mathematics, MIT",
            specialties: ["Calculus", "Statistics", "Mathematical Modeling"],
            achievements: ["Teacher of the Year 2023", "Published 12 research papers", "Math Olympiad Coach"],
            department: "Mathematics & Sciences"
          },
          {
            id: "prof-michael-rodriguez",
            name: "Prof. Michael Rodriguez",
            position: "Senior Physics Teacher",
            subject: "Physics & Engineering",
            image: "/api/placeholder/300/400",
            experience: "12 years",
            education: "M.S. Physics, Stanford University",
            specialties: ["Quantum Physics", "Thermodynamics", "Laboratory Research"],
            achievements: ["Science Fair Judge", "NASA Educator Fellow", "Robotics Team Mentor"],
            department: "Mathematics & Sciences"
          }
        ]
      },
      {
        name: "Literature & Languages",
        color: "from-purple-500 to-pink-500",
        teachers: [
          {
            id: "ms-alexandra-thompson",
            name: "Ms. Alexandra Thompson",
            position: "English Department Chair",
            subject: "English Literature & Creative Writing",
            image: "/api/placeholder/300/400",
            experience: "14 years",
            education: "M.A. English Literature, Oxford University",
            specialties: ["Shakespeare Studies", "Creative Writing", "Literary Analysis"],
            achievements: ["Published Novelist", "Poetry Contest Judge", "Writing Workshop Leader"],
            department: "Literature & Languages"
          }
        ]
      },
      {
        name: "Arts & Creative Studies",
        color: "from-orange-500 to-red-500",
        teachers: [
          {
            id: "ms-isabella-martinez",
            name: "Ms. Isabella Martinez",
            position: "Fine Arts Director",
            subject: "Visual Arts & Design",
            image: "/api/placeholder/300/400",
            experience: "11 years",
            education: "M.F.A. Fine Arts, RISD",
            specialties: ["Oil Painting", "Digital Art", "Art History"],
            achievements: ["Gallery Exhibitions", "Art Competition Judge", "Student Portfolio Mentor"],
            department: "Arts & Creative Studies"
          }
        ]
      },
      {
        name: "Social Studies & Leadership",
        color: "from-green-500 to-emerald-500",
        teachers: [
          {
            id: "dr-james-wilson",
            name: "Dr. James Wilson",
            position: "History Department Chair",
            subject: "World History & Government",
            image: "/api/placeholder/300/400",
            experience: "20 years",
            education: "Ph.D. History, Yale University",
            specialties: ["Ancient Civilizations", "Political Science", "Historical Research"],
            achievements: ["Historical Society Member", "Documentary Consultant", "Debate Team Coach"],
            department: "Social Studies & Leadership"
          }
        ]
      }
    ];

      // Load from Supabase (with localStorage fallback)
      const data = await getSupabaseData<Department[]>('royal-academy-teachers', defaultDepartments);
      setDepartments(data);
    };

    loadData();

    // Subscribe to realtime changes
    const unsubscribe = subscribeToSupabaseChanges<Department[]>(
      'royal-academy-teachers',
      (newData) => {
        console.log('[TeacherManager] Received realtime update');
        setDepartments(newData);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const saveToStorage = async (data: Department[]) => {
    setDepartments(data);
    await setSupabaseData('royal-academy-teachers', data);
  };

  const handleAddTeacher = () => {
    const newTeacher: Teacher = {
      id: `teacher-${Date.now()}`,
      name: "",
      position: "",
      subject: "",
      image: "/api/placeholder/300/400",
      experience: "",
      education: "",
      specialties: [],
      achievements: [],
      department: departments[0]?.name || ""
    };
    setEditingTeacher(newTeacher);
    setIsAddingNew(true);
    setIsEditing(true);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setEditingTeacher({ ...teacher });
    setIsAddingNew(false);
    setIsEditing(true);
  };

  const handleSaveTeacher = () => {
    if (!editingTeacher) return;

    const updatedDepartments = departments.map(dept => {
      if (dept.name === editingTeacher.department) {
        if (isAddingNew) {
          return {
            ...dept,
            teachers: [...dept.teachers, editingTeacher]
          };
        } else {
          return {
            ...dept,
            teachers: dept.teachers.map(t => 
              t.id === editingTeacher.id ? editingTeacher : t
            )
          };
        }
      } else if (!isAddingNew) {
        // Remove teacher from old department if moved
        return {
          ...dept,
          teachers: dept.teachers.filter(t => t.id !== editingTeacher.id)
        };
      }
      return dept;
    });

    saveToStorage(updatedDepartments);
    setIsEditing(false);
    setEditingTeacher(null);
    setIsAddingNew(false);
    setMessage(isAddingNew ? "Teacher added successfully!" : "Teacher updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDeleteTeacher = (teacherId: string) => {
    if (confirm("Are you sure you want to delete this teacher?")) {
      const updatedDepartments = departments.map(dept => ({
        ...dept,
        teachers: dept.teachers.filter(t => t.id !== teacherId)
      }));
      saveToStorage(updatedDepartments);
      setMessage("Teacher deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingTeacher) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditingTeacher({
          ...editingTeacher,
          image: event.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateTeacherField = (field: keyof Teacher, value: any) => {
    if (!editingTeacher) return;
    setEditingTeacher({
      ...editingTeacher,
      [field]: value
    });
  };

  const addSpecialty = (specialty: string) => {
    if (!editingTeacher || !specialty.trim()) return;
    setEditingTeacher({
      ...editingTeacher,
      specialties: [...editingTeacher.specialties, specialty.trim()]
    });
  };

  const removeSpecialty = (index: number) => {
    if (!editingTeacher) return;
    setEditingTeacher({
      ...editingTeacher,
      specialties: editingTeacher.specialties.filter((_, i) => i !== index)
    });
  };

  const addAchievement = (achievement: string) => {
    if (!editingTeacher || !achievement.trim()) return;
    setEditingTeacher({
      ...editingTeacher,
      achievements: [...editingTeacher.achievements, achievement.trim()]
    });
  };

  const removeAchievement = (index: number) => {
    if (!editingTeacher) return;
    setEditingTeacher({
      ...editingTeacher,
      achievements: editingTeacher.achievements.filter((_, i) => i !== index)
    });
  };

  const addCourse = () => {
    if (!editingTeacher) return;
    const newCourse: Course = {
      name: "",
      description: "",
      level: "",
      prerequisites: ""
    };
    setEditingTeacher({
      ...editingTeacher,
      courses: [...(editingTeacher.courses || []), newCourse]
    });
  };

  const updateCourse = (index: number, field: keyof Course, value: string) => {
    if (!editingTeacher || !editingTeacher.courses) return;
    const updatedCourses = editingTeacher.courses.map((course, i) => 
      i === index ? { ...course, [field]: value } : course
    );
    setEditingTeacher({
      ...editingTeacher,
      courses: updatedCourses
    });
  };

  const removeCourse = (index: number) => {
    if (!editingTeacher || !editingTeacher.courses) return;
    setEditingTeacher({
      ...editingTeacher,
      courses: editingTeacher.courses.filter((_, i) => i !== index)
    });
  };

  // Department management functions
  const addNewDepartment = () => {
    const newDepartment: Department = {
      name: "New Department",
      color: "from-gray-500 to-gray-600",
      teachers: []
    };
    setDepartments(prev => [...prev, newDepartment]);
    setEditingDepartment(newDepartment);
    setIsEditingDepartments(true);
  };

  const updateDepartment = async (oldName: string, newName: string, newColor: string) => {
    const updatedDepartments = departments.map(dept => {
      if (dept.name === oldName) {
        // Update department name in all teachers
        const updatedTeachers = (dept.teachers || []).map(teacher => ({
          ...teacher,
          department: newName
        }));
        return {
          ...dept,
          name: newName,
          color: newColor,
          teachers: updatedTeachers
        };
      }
      return dept;
    });
    
    setDepartments(updatedDepartments);
    await setSupabaseData('royal-academy-teachers', updatedDepartments);
    setMessage("Department updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const deleteDepartment = async (departmentName: string) => {
    const department = departments.find(d => d.name === departmentName);
    if (department && (department.teachers || []).length > 0) {
      alert("Cannot delete department with teachers. Please move all teachers to other departments first.");
      return;
    }
    
    if (confirm(`Are you sure you want to delete the "${departmentName}" department?`)) {
      const updatedDepartments = departments.filter(d => d.name !== departmentName);
      setDepartments(updatedDepartments);
      await setSupabaseData('royal-academy-teachers', updatedDepartments);
      setMessage("Department deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const moveTeacherToDepartment = async (teacherId: string, fromDepartment: string, toDepartment: string) => {
    const updatedDepartments = departments.map(dept => {
      if (dept.name === fromDepartment) {
        // Remove teacher from current department
        const teacher = (dept.teachers || []).find(t => t.id === teacherId);
        if (teacher) {
          // Update teacher's department field
          teacher.department = toDepartment;
          return {
            ...dept,
            teachers: (dept.teachers || []).filter(t => t.id !== teacherId)
          };
        }
      } else if (dept.name === toDepartment) {
        // Add teacher to new department
        const sourceTeacher = departments
          .find(d => d.name === fromDepartment)
          ?.teachers?.find(t => t.id === teacherId);
        
        if (sourceTeacher) {
          return {
            ...dept,
            teachers: [...(dept.teachers || []), { ...sourceTeacher, department: toDepartment }]
          };
        }
      }
      return dept;
    });

    setDepartments(updatedDepartments);
    await setSupabaseData('royal-academy-teachers', updatedDepartments);
    setMessage("Teacher moved successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">Teacher Management</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Manage faculty information and profiles</p>
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
          <Button
            onClick={() => setIsEditingDepartments(!isEditingDepartments)}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
          >
            <Settings className="h-4 w-4 mr-2" />
            {isEditingDepartments ? "Done Editing" : "Manage Departments"}
          </Button>
          <Button onClick={handleAddTeacher} className="w-full sm:w-auto bg-gradient-to-r from-royal to-gold text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Teacher
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Department Management Section */}
      {isEditingDepartments && (
        <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Department Management</h3>
            <Button onClick={addNewDepartment} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((department) => (
              <div key={department.name} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-4 h-4 rounded bg-gradient-to-r ${department.color}`}></div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingDepartment(department);
                        setIsEditingDepartments(true);
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteDepartment(department.name)}
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <h4 className="font-semibold text-foreground mb-1">{department.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {(department.teachers || []).length} teacher{(department.teachers || []).length !== 1 ? 's' : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && editingTeacher && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-heading font-bold">
                  {isAddingNew ? "Add New Teacher" : "Edit Teacher"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Name</label>
                    <Input
                      value={editingTeacher.name}
                      onChange={(e) => updateTeacherField('name', e.target.value)}
                      placeholder="Teacher's full name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Position</label>
                    <Input
                      value={editingTeacher.position}
                      onChange={(e) => updateTeacherField('position', e.target.value)}
                      placeholder="e.g., Head of Mathematics Department"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <Input
                      value={editingTeacher.subject}
                      onChange={(e) => updateTeacherField('subject', e.target.value)}
                      placeholder="e.g., Advanced Mathematics & Calculus"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Department</label>
                    <Select
                      value={editingTeacher.department}
                      onValueChange={(value) => updateTeacherField('department', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept.name} value={dept.name}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Experience</label>
                    <Input
                      value={editingTeacher.experience}
                      onChange={(e) => updateTeacherField('experience', e.target.value)}
                      placeholder="e.g., 15 years"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Education</label>
                    <Input
                      value={editingTeacher.education}
                      onChange={(e) => updateTeacherField('education', e.target.value)}
                      placeholder="e.g., Ph.D. Mathematics, MIT"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input
                      value={editingTeacher.email || ''}
                      onChange={(e) => updateTeacherField('email', e.target.value)}
                      placeholder="teacher@royalacademy.edu"
                      type="email"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone</label>
                    <Input
                      value={editingTeacher.phone || ''}
                      onChange={(e) => updateTeacherField('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Office Location</label>
                    <Input
                      value={editingTeacher.office || ''}
                      onChange={(e) => updateTeacherField('office', e.target.value)}
                      placeholder="Main Building, Room 101"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Office Hours</label>
                    <Input
                      value={editingTeacher.officeHours || ''}
                      onChange={(e) => updateTeacherField('officeHours', e.target.value)}
                      placeholder="Monday-Friday: 2:00-4:00 PM"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Profile Image</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-royal to-gold flex items-center justify-center overflow-hidden">
                        {editingTeacher.image.startsWith('data:') ? (
                          <img src={editingTeacher.image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <GraduationCap className="h-10 w-10 text-white" />
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload">
                          <Button variant="outline" size="sm" asChild>
                            <span className="cursor-pointer">
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Image
                            </span>
                          </Button>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Specialties, Achievements & Courses */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Biography</label>
                    <Textarea
                      value={editingTeacher.biography || ''}
                      onChange={(e) => updateTeacherField('biography', e.target.value)}
                      placeholder="Brief biography and background..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Teaching Philosophy</label>
                    <Textarea
                      value={editingTeacher.philosophy || ''}
                      onChange={(e) => updateTeacherField('philosophy', e.target.value)}
                      placeholder="Teaching philosophy and approach..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Specialties</label>
                    <div className="space-y-2">
                      {editingTeacher.specialties.map((specialty, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input value={specialty} readOnly className="flex-1" />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeSpecialty(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Add specialty"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addSpecialty((e.target as HTMLInputElement).value);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            addSpecialty(input.value);
                            input.value = '';
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Achievements</label>
                    <div className="space-y-2">
                      {editingTeacher.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input value={achievement} readOnly className="flex-1" />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeAchievement(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Add achievement"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addAchievement((e.target as HTMLInputElement).value);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            addAchievement(input.value);
                            input.value = '';
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Courses Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Courses Taught</label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addCourse}
                        type="button"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Course
                      </Button>
                    </div>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {(editingTeacher.courses || []).map((course, index) => (
                        <div key={index} className="p-3 border border-border rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">Course {index + 1}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeCourse(index)}
                              type="button"
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <Input
                              placeholder="Course name"
                              value={course.name}
                              onChange={(e) => updateCourse(index, 'name', e.target.value)}
                            />
                            <Input
                              placeholder="Level (e.g., Grades 11-12)"
                              value={course.level}
                              onChange={(e) => updateCourse(index, 'level', e.target.value)}
                            />
                          </div>
                          <Textarea
                            placeholder="Course description"
                            value={course.description}
                            onChange={(e) => updateCourse(index, 'description', e.target.value)}
                            rows={2}
                          />
                          <Input
                            placeholder="Prerequisites"
                            value={course.prerequisites}
                            onChange={(e) => updateCourse(index, 'prerequisites', e.target.value)}
                          />
                        </div>
                      ))}
                      {(!editingTeacher.courses || editingTeacher.courses.length === 0) && (
                        <div className="text-center py-4 text-muted-foreground text-sm">
                          No courses added yet. Click "Add Course" to get started.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTeacher} className="bg-gradient-to-r from-royal to-gold text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Save Teacher
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Department Edit Modal */}
        {editingDepartment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-md mx-4"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-heading font-bold">
                  Edit Department
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingDepartment(null)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Department Name</label>
                  <Input
                    value={editingDepartment.name}
                    onChange={(e) => setEditingDepartment({
                      ...editingDepartment,
                      name: e.target.value
                    })}
                    placeholder="Department name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Color Theme</label>
                  <Select
                    value={editingDepartment.color}
                    onValueChange={(value) => setEditingDepartment({
                      ...editingDepartment,
                      color: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="from-blue-500 to-cyan-500">Blue to Cyan</SelectItem>
                      <SelectItem value="from-purple-500 to-pink-500">Purple to Pink</SelectItem>
                      <SelectItem value="from-orange-500 to-red-500">Orange to Red</SelectItem>
                      <SelectItem value="from-green-500 to-emerald-500">Green to Emerald</SelectItem>
                      <SelectItem value="from-indigo-500 to-purple-500">Indigo to Purple</SelectItem>
                      <SelectItem value="from-yellow-500 to-orange-500">Yellow to Orange</SelectItem>
                      <SelectItem value="from-teal-500 to-blue-500">Teal to Blue</SelectItem>
                      <SelectItem value="from-rose-500 to-pink-500">Rose to Pink</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className={`mt-2 h-4 rounded bg-gradient-to-r ${editingDepartment.color}`}></div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t">
                <Button variant="outline" onClick={() => setEditingDepartment(null)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    const originalName = departments.find(d => d.teachers === editingDepartment.teachers)?.name || editingDepartment.name;
                    updateDepartment(originalName, editingDepartment.name, editingDepartment.color);
                    setEditingDepartment(null);
                  }}
                  className="bg-gradient-to-r from-royal to-gold text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Department
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Teachers List */}
      <div className="space-y-6 sm:space-y-8">
        {departments.map((department) => (
          <div key={department.name} className="bg-card rounded-lg sm:rounded-xl border border-border overflow-hidden">
            <div className={`bg-gradient-to-r ${department.color} p-3 sm:p-4`}>
              <h3 className="text-lg sm:text-xl font-heading font-bold text-white">
                {department.name} ({(department.teachers || []).length} teachers)
              </h3>
            </div>
            
            <div className="p-4 sm:p-6">
              {(!department.teachers || department.teachers.length === 0) ? (
                <div className="text-center py-6 sm:py-8 text-muted-foreground">
                  No teachers in this department yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {(department.teachers || []).map((teacher) => (
                    <motion.div
                      key={teacher.id}
                      layout
                      className="bg-background/50 border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-royal to-gold flex items-center justify-center overflow-hidden">
                          {teacher.image.startsWith('data:') ? (
                            <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
                          ) : (
                            <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground text-sm sm:text-base truncate">{teacher.name}</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">{teacher.position}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1 sm:space-y-2 mb-4">
                        <p className="text-xs sm:text-sm"><span className="font-medium">Subject:</span> <span className="truncate">{teacher.subject}</span></p>
                        <p className="text-xs sm:text-sm"><span className="font-medium">Experience:</span> {teacher.experience}</p>
                        <p className="text-xs sm:text-sm"><span className="font-medium">Education:</span> <span className="truncate">{teacher.education}</span></p>
                      </div>

                      <div className="flex items-center justify-end space-x-2">
                        {isEditingDepartments && (
                          <Select
                            value={teacher.department}
                            onValueChange={(newDept) => moveTeacherToDepartment(teacher.id, teacher.department, newDept)}
                          >
                            <SelectTrigger className="w-32 h-8 text-xs">
                              <SelectValue placeholder="Move to..." />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.filter(d => d.name !== teacher.department).map(dept => (
                                <SelectItem key={dept.name} value={dept.name} className="text-xs">
                                  {dept.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTeacher(teacher)}
                          className="h-8 w-8 p-0 sm:h-auto sm:w-auto sm:px-3"
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline ml-2">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTeacher(teacher.id)}
                          className="text-red-600 hover:text-red-700 h-8 w-8 p-0 sm:h-auto sm:w-auto sm:px-3"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline ml-2">Delete</span>
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Preview Link */}
      {showPreview && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <div>
              <h3 className="font-semibold text-foreground">Live Preview</h3>
              <p className="text-sm text-muted-foreground">View how the page looks to visitors</p>
            </div>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <a href="/our-teachers" target="_blank" rel="noopener noreferrer">
                <Eye className="h-4 w-4 mr-2" />
                Open Our Teachers Page
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManager;
