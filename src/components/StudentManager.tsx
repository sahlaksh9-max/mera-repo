import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Users, 
  GraduationCap,
  Search,
  Filter,
  UserPlus,
  Eye,
  EyeOff,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Student {
  id: string;
  fullName: string;
  email: string;
  rollNumber: string;
  parentEmail: string;
  phoneNumber: string;
  class: string;
  section: string;
  password: string;
  createdAt: string;
  status: 'active' | 'suspended';
  createdBy: string; // Teacher who created this student
}

const StudentManager = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");

  // Load students from localStorage
  useEffect(() => {
    const savedStudents = localStorage.getItem('royal-academy-students');
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
  }, []);

  const saveToStorage = (data: Student[]) => {
    localStorage.setItem('royal-academy-students', JSON.stringify(data));
    setStudents(data);
  };

  const showMessage = (msg: string, type: "success" | "error" | "info" = "info") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  const handleAddStudent = () => {
    const teacherEmail = localStorage.getItem("teacherEmail") || "teacher@royalacademy.edu";
    const newStudent: Student = {
      id: `STU${Date.now().toString().slice(-6)}`,
      fullName: "",
      email: "",
      rollNumber: "",
      parentEmail: "",
      phoneNumber: "",
      class: "",
      section: "",
      password: "",
      createdAt: new Date().toISOString(),
      status: 'active',
      createdBy: teacherEmail
    };
    setEditingStudent(newStudent);
    setIsAddingNew(true);
    setIsEditing(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent({ ...student });
    setIsAddingNew(false);
    setIsEditing(true);
  };

  const handleSaveStudent = () => {
    if (!editingStudent) return;

    // Validation
    if (!editingStudent.fullName || !editingStudent.email || !editingStudent.rollNumber || 
        !editingStudent.class || !editingStudent.section) {
      showMessage("Please fill all required fields.", "error");
      return;
    }

    // Check for duplicate email or roll number (excluding current student if editing)
    const existingStudent = students.find(s => 
      s.id !== editingStudent.id && 
      (s.email.toLowerCase() === editingStudent.email.toLowerCase() || 
       s.rollNumber === editingStudent.rollNumber)
    );

    if (existingStudent) {
      showMessage("Student with this email or roll number already exists.", "error");
      return;
    }

    // Generate password if new student
    if (isAddingNew) {
      const firstName = editingStudent.fullName.split(' ')[0].toLowerCase();
      editingStudent.password = `${firstName}123`;
    }

    let updatedStudents: Student[];
    if (isAddingNew) {
      updatedStudents = [...students, editingStudent];
    } else {
      updatedStudents = students.map(s => 
        s.id === editingStudent.id ? editingStudent : s
      );
    }

    saveToStorage(updatedStudents);
    setIsEditing(false);
    setEditingStudent(null);
    setIsAddingNew(false);
    
    if (isAddingNew) {
      showMessage(`Student account created successfully!\n\nLogin Credentials:\nEmail: ${editingStudent.email}\nPassword: ${editingStudent.password}\nStudent ID: ${editingStudent.id}`, "success");
    } else {
      showMessage("Student updated successfully!", "success");
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      const updatedStudents = students.filter(s => s.id !== studentId);
      saveToStorage(updatedStudents);
      showMessage("Student deleted successfully!", "success");
    }
  };

  const toggleStudentStatus = (studentId: string) => {
    const updatedStudents = students.map(s => 
      s.id === studentId 
        ? { ...s, status: (s.status === 'active' ? 'suspended' : 'active') as 'active' | 'suspended' }
        : s
    );
    saveToStorage(updatedStudents);
    showMessage("Student status updated successfully!", "success");
  };

  const updateStudentField = (field: keyof Student, value: string) => {
    if (!editingStudent) return;
    setEditingStudent({
      ...editingStudent,
      [field]: value
    });
  };

  // Filter students based on search and filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = searchTerm === "" || 
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = classFilter === "" || student.class === classFilter;
    const matchesSection = sectionFilter === "" || student.section === sectionFilter;
    
    return matchesSearch && matchesClass && matchesSection;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">Student Management</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Create and manage student accounts</p>
        </div>
        <Button onClick={handleAddStudent} className="w-full sm:w-auto bg-gradient-to-r from-royal to-gold text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Student ID
        </Button>
      </div>

      {/* Success/Error Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert className={`${
              messageType === "success" ? "border-green-500 bg-green-500/10" :
              messageType === "error" ? "border-red-500 bg-red-500/10" :
              "border-blue-500 bg-blue-500/10"
            }`}>
              <AlertDescription className={`${
                messageType === "success" ? "text-green-400" :
                messageType === "error" ? "text-red-400" :
                "text-blue-400"
              } whitespace-pre-line`}>
                {message}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and Filters */}
      <div className="bg-card rounded-lg p-4 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-background"
          >
            <option value="">All Classes</option>
            {Array.from({length: 12}, (_, i) => (
              <option key={i+1} value={`${i+1}`}>Class {i+1}</option>
            ))}
          </select>
          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-background"
          >
            <option value="">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
            <option value="D">Section D</option>
            <option value="E">Section E</option>
          </select>
          <div className="text-sm text-muted-foreground flex items-center">
            <Users className="h-4 w-4 mr-2" />
            {filteredStudents.length} students
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <motion.div
            key={student.id}
            layout
            className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-royal to-gold flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground text-sm truncate">{student.fullName}</h4>
                <p className="text-xs text-muted-foreground">Roll: {student.rollNumber}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                student.status === 'active' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {student.status.toUpperCase()}
              </span>
            </div>
            
            <div className="space-y-1 mb-4">
              <p className="text-xs"><span className="font-medium">Class:</span> {student.class}{student.section}</p>
              <p className="text-xs"><span className="font-medium">Email:</span> <span className="truncate">{student.email}</span></p>
              <p className="text-xs"><span className="font-medium">Parent:</span> <span className="truncate">{student.parentEmail || 'N/A'}</span></p>
              <p className="text-xs"><span className="font-medium">Phone:</span> {student.phoneNumber || 'N/A'}</p>
            </div>

            <div className="flex items-center justify-between space-x-2">
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
                variant="outline"
                size="sm"
                onClick={() => toggleStudentStatus(student.id)}
                className={`flex-1 ${
                  student.status === 'active' 
                    ? 'text-red-400 hover:text-red-300' 
                    : 'text-green-400 hover:text-green-300'
                }`}
              >
                {student.status === 'active' ? 'Suspend' : 'Activate'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteStudent(student.id)}
                className="text-red-400 hover:text-red-300 px-2"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        ))}
        
        {filteredStudents.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No students found</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && editingStudent && (
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
              className="bg-card rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-heading font-bold">
                  {isAddingNew ? "Create Student ID" : "Edit Student"}
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

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name *</label>
                  <Input
                    value={editingStudent.fullName}
                    onChange={(e) => updateStudentField('fullName', e.target.value)}
                    placeholder="Enter student's full name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Email Address *</label>
                  <Input
                    type="email"
                    value={editingStudent.email}
                    onChange={(e) => updateStudentField('email', e.target.value)}
                    placeholder="student@example.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Roll Number *</label>
                  <Input
                    value={editingStudent.rollNumber}
                    onChange={(e) => updateStudentField('rollNumber', e.target.value)}
                    placeholder="Enter roll number"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Parent Email</label>
                  <Input
                    type="email"
                    value={editingStudent.parentEmail}
                    onChange={(e) => updateStudentField('parentEmail', e.target.value)}
                    placeholder="parent@example.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Phone Number</label>
                  <Input
                    type="tel"
                    value={editingStudent.phoneNumber}
                    onChange={(e) => updateStudentField('phoneNumber', e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Class *</label>
                    <select
                      value={editingStudent.class}
                      onChange={(e) => updateStudentField('class', e.target.value)}
                      className="w-full p-3 border border-border rounded-lg bg-background"
                    >
                      <option value="">Select Class</option>
                      {Array.from({length: 12}, (_, i) => (
                        <option key={i+1} value={`${i+1}`}>Class {i+1}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Section *</label>
                    <select
                      value={editingStudent.section}
                      onChange={(e) => updateStudentField('section', e.target.value)}
                      className="w-full p-3 border border-border rounded-lg bg-background"
                    >
                      <option value="">Select Section</option>
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                      <option value="D">Section D</option>
                      <option value="E">Section E</option>
                    </select>
                  </div>
                </div>

                {isAddingNew && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-400">
                        <p className="font-medium mb-1">Password Information</p>
                        <p className="text-xs">
                          Student passwords are automatically generated using the format: firstname123 (e.g., john123). 
                          Login credentials will be displayed after account creation.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveStudent} className="bg-gradient-to-r from-royal to-gold text-white">
                  <Save className="h-4 w-4 mr-2" />
                  {isAddingNew ? "Create Student Account" : "Save Changes"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentManager;
