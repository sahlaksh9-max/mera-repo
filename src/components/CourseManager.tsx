import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Edit, Trash2, Plus, ArrowLeft, X, Save } from 'lucide-react';
import { motion } from 'framer-motion';

// Define the Course interface
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

  const handleSaveCourse = () => {
    if (!courseForm.title || !courseForm.description || !courseForm.duration || !courseForm.fee || !courseForm.level) {
      alert('Please fill in all required fields.');
      return;
    }

    const newCourse: Course = {
      ...courseForm,
      id: editingCourse ? editingCourse.id : Date.now().toString(),
    };

    let updatedCoursesData = [];
    const storedCourses = localStorage.getItem('royal-academy-courses');

    if (storedCourses) {
      updatedCoursesData = JSON.parse(storedCourses);
    }

    let courseFound = false;
    // Find the category and update the course, or add to a default category if new
    if (editingCourse) {
      updatedCoursesData = updatedCoursesData.map((category: any) => {
        if (category.courses && category.courses.some((c: Course) => c.id === newCourse.id)) {
          return {
            ...category,
            courses: category.courses.map((c: Course) => c.id === newCourse.id ? newCourse : c)
          };
        }
        return category;
      });
    } else {
      // If it's a new course, add it to the 'undergraduate' category, creating it if it doesn't exist
      const undergraduateCategory = updatedCoursesData.find((cat: any) => cat.name === 'undergraduate');
      if (undergraduateCategory) {
        undergraduateCategory.courses.push(newCourse);
      } else {
        updatedCoursesData.push({ name: 'undergraduate', courses: [newCourse] });
      }
    }

    localStorage.setItem('royal-academy-courses', JSON.stringify(updatedCoursesData));
    loadCourses();
    setShowModal(false);
    resetForm();
    setEditingCourse(null);
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
      syllabus: course.syllabus,
      instructor: course.instructor,
      schedule: course.schedule,
      capacity: course.capacity,
      fee: course.fee,
      startDate: course.startDate,
      endDate: course.endDate
    });
    setShowModal(true);
  };

  const handleDeleteCourse = (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      let updatedCoursesData = [];
      const storedCourses = localStorage.getItem('royal-academy-courses');

      if (storedCourses) {
        updatedCoursesData = JSON.parse(storedCourses);
      }

      updatedCoursesData = updatedCoursesData.map((category: any) => {
        if (category.courses) {
          return {
            ...category,
            courses: category.courses.filter((c: Course) => c.id !== id)
          };
        }
        return category;
      }).filter((category: any) => category.courses && category.courses.length > 0); // Remove empty categories

      localStorage.setItem('royal-academy-courses', JSON.stringify(updatedCoursesData));
      loadCourses();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
        <div className="w-full py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 md:gap-4">
            {/* Left Section: Back Button + Title */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/principal-dashboard')}
                className="text-xs sm:text-xs px-1.5 sm:px-2 h-7 sm:h-8 flex-shrink-0 whitespace-nowrap"
              >
                <ArrowLeft className="h-4 w-4 sm:h-4 sm:w-4" />
              </Button>
              <h1 className="text-xs sm:text-sm md:text-base font-heading font-bold text-foreground break-words">
                Courses<br className="sm:hidden" /> Management
              </h1>
            </div>
            {/* Right Section: Add Button */}
            <Button
              onClick={() => {
                resetForm();
                setEditingCourse(null);
                setShowModal(true);
              }}
              className="bg-gradient-to-r from-royal to-gold text-white w-auto text-xs px-2 sm:px-2.5 h-7 sm:h-8 flex-shrink-0 whitespace-nowrap"
            >
              <Plus className="h-4 w-4 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Courses List */}
      <div className="container-wide py-4 sm:py-8 px-3 sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-lg sm:rounded-xl p-4 sm:p-6 border border-border/50"
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-gold" />
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditCourse(course)}
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCourse(course.id)}
                    className="text-red-600 hover:text-red-700 h-7 w-7 sm:h-8 sm:w-8 p-0"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">{course.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">{course.description}</p>
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
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
          <div className="text-center py-8 sm:py-12">
            <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-muted-foreground opacity-50" />
            <p className="text-sm sm:text-base text-muted-foreground px-4">No courses available. Add your first course!</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-heading font-bold">
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block">Course Title</label>
                <Input
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="Enter course title"
                  className="text-sm"
                />
              </div>

              <div>
                <label className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block">Description</label>
                <Textarea
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Enter course description"
                  rows={3}
                  className="text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block">Level</label>
                  <Input
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                    placeholder="Bachelor's"
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block">Duration</label>
                  <Input
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    placeholder="4 years"
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block">Credits</label>
                  <Input
                    value={courseForm.credits}
                    onChange={(e) => setCourseForm({ ...courseForm, credits: e.target.value })}
                    placeholder="120"
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block">Fee</label>
                  <Input
                    value={courseForm.fee}
                    onChange={(e) => setCourseForm({ ...courseForm, fee: e.target.value })}
                    placeholder="$45,000/year"
                    className="text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block">Instructor</label>
                <Input
                  value={courseForm.instructor}
                  onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                  placeholder="Dr. John Smith"
                  className="text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className="w-full sm:w-auto text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveCourse}
                className="bg-gradient-to-r from-royal to-gold text-white w-full sm:w-auto text-sm"
              >
                <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
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