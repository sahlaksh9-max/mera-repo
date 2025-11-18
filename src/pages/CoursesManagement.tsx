
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  Save,
  X,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  credits: string;
  prerequisites: string;
  syllabus: string[];
  instructor: string;
  schedule: string;
  capacity: string;
  fee: string;
  startDate: string;
  endDate: string;
}

const CoursesManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    category: "undergraduate",
    level: "Bachelor's",
    duration: "",
    credits: "",
    prerequisites: "",
    syllabus: [] as string[],
    instructor: "",
    schedule: "",
    capacity: "",
    fee: "",
    startDate: "",
    endDate: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = () => {
    const storedCourses = localStorage.getItem('royal-academy-courses');
    if (storedCourses) {
      try {
        const parsed = JSON.parse(storedCourses);
        // Extract all courses from categories
        const allCourses: Course[] = [];
        parsed.forEach((category: any) => {
          if (category.courses) {
            allCourses.push(...category.courses);
          }
        });
        setCourses(allCourses);
      } catch (e) {
        console.error('Error loading courses:', e);
      }
    }
  };

  const handleSaveCourse = () => {
    if (!courseForm.title || !courseForm.description) {
      alert('Please fill in title and description');
      return;
    }

    const newCourse: Course = {
      id: editingCourse ? editingCourse.id : Date.now().toString(),
      ...courseForm
    };

    const storedCourses = JSON.parse(localStorage.getItem('royal-academy-courses') || '[]');
    
    if (editingCourse) {
      // Update existing course
      storedCourses.forEach((category: any) => {
        if (category.courses) {
          const index = category.courses.findIndex((c: Course) => c.id === editingCourse.id);
          if (index !== -1) {
            category.courses[index] = newCourse;
          }
        }
      });
    } else {
      // Add new course to appropriate category
      const categoryIndex = storedCourses.findIndex((cat: any) => cat.id === courseForm.category);
      if (categoryIndex !== -1) {
        if (!storedCourses[categoryIndex].courses) {
          storedCourses[categoryIndex].courses = [];
        }
        storedCourses[categoryIndex].courses.push(newCourse);
      }
    }

    localStorage.setItem('royal-academy-courses', JSON.stringify(storedCourses));
    loadCourses();
    setShowModal(false);
    setEditingCourse(null);
    resetForm();
    alert('Course saved successfully!');
  };

  const handleDeleteCourse = (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    const storedCourses = JSON.parse(localStorage.getItem('royal-academy-courses') || '[]');
    storedCourses.forEach((category: any) => {
      if (category.courses) {
        category.courses = category.courses.filter((c: Course) => c.id !== courseId);
      }
    });

    localStorage.setItem('royal-academy-courses', JSON.stringify(storedCourses));
    loadCourses();
    alert('Course deleted successfully!');
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      duration: course.duration,
      credits: course.credits,
      prerequisites: course.prerequisites,
      syllabus: course.syllabus || [],
      instructor: course.instructor,
      schedule: course.schedule,
      capacity: course.capacity,
      fee: course.fee,
      startDate: course.startDate,
      endDate: course.endDate
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setCourseForm({
      title: "",
      description: "",
      category: "undergraduate",
      level: "Bachelor's",
      duration: "",
      credits: "",
      prerequisites: "",
      syllabus: [],
      instructor: "",
      schedule: "",
      capacity: "",
      fee: "",
      startDate: "",
      endDate: ""
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
        <div className="container-wide py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/principal-dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-heading font-bold text-foreground">
                Courses Management
              </h1>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setEditingCourse(null);
                setShowModal(true);
              }}
              className="bg-gradient-to-r from-royal to-gold text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </div>
        </div>
      </header>

      {/* Courses List */}
      <div className="container-wide py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl p-6 border border-border/50"
            >
              <div className="flex items-start justify-between mb-4">
                <BookOpen className="h-6 w-6 text-gold" />
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditCourse(course)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCourse(course.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{course.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Level:</span>
                  <span className="font-medium text-foreground">{course.level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium text-foreground">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Fee:</span>
                  <span className="font-medium text-gold">{course.fee}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No courses available. Add your first course!</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-heading font-bold">
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Course Title</label>
                <Input
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="Enter course title"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Enter course description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Level</label>
                  <Input
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                    placeholder="Bachelor's"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Duration</label>
                  <Input
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    placeholder="4 years"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Credits</label>
                  <Input
                    value={courseForm.credits}
                    onChange={(e) => setCourseForm({ ...courseForm, credits: e.target.value })}
                    placeholder="120"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Fee</label>
                  <Input
                    value={courseForm.fee}
                    onChange={(e) => setCourseForm({ ...courseForm, fee: e.target.value })}
                    placeholder="$45,000/year"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Instructor</label>
                <Input
                  value={courseForm.instructor}
                  onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                  placeholder="Dr. John Smith"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveCourse} className="bg-gradient-to-r from-royal to-gold text-white">
                <Save className="h-4 w-4 mr-2" />
                {editingCourse ? 'Update' : 'Add'} Course
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CoursesManagement;
