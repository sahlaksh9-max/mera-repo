import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Eye, EyeOff, Lock, Mail, Users, GraduationCap, 
  AlertCircle, CheckCircle, User, IdCard, ArrowLeft 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AuthSignup = () => {
  const [userType, setUserType] = useState<"student" | "teacher" | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    studentId: "",
    teacherId: "",
    class: "",
    section: "",
    subject: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const classes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const sections = ["A", "B", "C", "D", "E"];
  const subjects = [
    "Mathematics", "Science", "Physics", "Chemistry", "Biology", 
    "English Literature", "Hindi", "History", "Geography", "Civics/Political Science",
    "Economics", "Computer Science", "Information Technology", "Physical Education", 
    "Arts & Crafts", "Music", "Dance", "Drawing & Painting", "Home Science",
    "Agriculture", "Commerce", "Accountancy", "Business Studies", "Psychology",
    "Sociology", "Philosophy", "Sanskrit", "Urdu", "French", "German", "Spanish"
  ];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    if (userType === "student" && (!formData.studentId || !formData.class || !formData.section)) {
      setError("Please fill all student details");
      setIsLoading(false);
      return;
    }

    if (userType === "teacher" && (!formData.teacherId || !formData.subject)) {
      setError("Please fill all teacher details");
      setIsLoading(false);
      return;
    }

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Get existing users
      const existingStudents = JSON.parse(localStorage.getItem('royal-academy-auth-students') || '[]');
      const existingTeachers = JSON.parse(localStorage.getItem('royal-academy-auth-teachers') || '[]');

      // Check if user already exists
      if (userType === "student") {
        const existingStudent = existingStudents.find((s: any) => 
          s.email === formData.email || s.studentId === formData.studentId
        );
        if (existingStudent) {
          setError("Student with this email or ID already exists");
          setIsLoading(false);
          return;
        }
      } else {
        const existingTeacher = existingTeachers.find((t: any) => 
          t.email === formData.email || t.teacherId === formData.teacherId
        );
        if (existingTeacher) {
          setError("Teacher with this email or ID already exists");
          setIsLoading(false);
          return;
        }
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        username: formData.username,
        email: formData.email,
        password: formData.password, // In real app, this would be hashed
        createdAt: new Date().toISOString(),
        ...(userType === "student" ? {
          studentId: formData.studentId,
          class: formData.class,
          section: formData.section,
          type: "student"
        } : {
          teacherId: formData.teacherId,
          subject: formData.subject,
          type: "teacher"
        })
      };

      // Save to localStorage
      if (userType === "student") {
        const updatedStudents = [...existingStudents, newUser];
        localStorage.setItem('royal-academy-auth-students', JSON.stringify(updatedStudents));
      } else {
        const updatedTeachers = [...existingTeachers, newUser];
        localStorage.setItem('royal-academy-auth-teachers', JSON.stringify(updatedTeachers));
      }

      setSuccess(`${userType === "student" ? "Student" : "Teacher"} account created successfully! You can now login.`);
      
      // Reset form
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        studentId: "",
        teacherId: "",
        class: "",
        section: "",
        subject: ""
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate(userType === "student" ? "/student-login" : "/teacher");
      }, 2000);

    } catch (error) {
      setError("Failed to create account. Please try again.");
    }
    
    setIsLoading(false);
  };

  const resetForm = () => {
    setUserType(null);
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      studentId: "",
      teacherId: "",
      class: "",
      section: "",
      subject: ""
    });
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal via-royal/90 to-gold/20 flex items-center justify-center p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="bg-card/95 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl border border-border/50 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="relative">
            {/* Back Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 text-muted-foreground hover:text-foreground touch-manipulation"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            
            <div className="text-center mb-6 sm:mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center mx-auto mb-3 sm:mb-4"
              >
                <IdCard className="h-8 w-8 sm:h-10 sm:w-10 text-black" />
              </motion.div>
              <h1 className="text-xl sm:text-2xl font-heading font-bold text-foreground mb-2">
                Create Account
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Join Royal Academy Portal
              </p>
            </div>
          </div>

          {/* User Type Selection */}
          {!userType && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h3 className="text-base sm:text-lg font-semibold text-center text-foreground mb-4 sm:mb-6">
                Choose Your Role
              </h3>
              
              <Button
                onClick={() => setUserType("student")}
                className="w-full h-14 sm:h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white touch-manipulation"
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-sm sm:text-base font-semibold">Student</div>
                    <div className="text-xs sm:text-sm opacity-90">Access student portal</div>
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => setUserType("teacher")}
                className="w-full h-14 sm:h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white touch-manipulation"
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-sm sm:text-base font-semibold">Teacher</div>
                    <div className="text-xs sm:text-sm opacity-90">Access teacher portal</div>
                  </div>
                </div>
              </Button>

            </motion.div>
          )}

          {/* Signup Form */}
          {userType && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Back Button */}
              <Button
                variant="ghost"
                onClick={resetForm}
                className="mb-3 sm:mb-4 text-muted-foreground hover:text-foreground text-sm touch-manipulation"
              >
                ← Back to role selection
              </Button>

              {/* Role Header */}
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6 p-3 bg-muted/20 rounded-lg">
                {userType === "student" ? (
                  <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 flex-shrink-0" />
                ) : (
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-green-400 flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-semibold text-foreground">
                    {userType === "student" ? "Student" : "Teacher"} Registration
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Fill in your details to create account
                  </p>
                </div>
              </div>

              {/* Success Alert */}
              {success && (
                <Alert className="mb-4 sm:mb-6 border-green-500/50 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                  <AlertDescription className="text-green-400 text-sm">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              {/* Error Alert */}
              {error && (
                <Alert className="mb-4 sm:mb-6 border-red-500/50 bg-red-500/10">
                  <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                  <AlertDescription className="text-red-400 text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Signup Form */}
              <form onSubmit={handleSignup} className="space-y-3 sm:space-y-4">
                {/* Username */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-foreground">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    placeholder="Enter your full name"
                    className="h-11 sm:h-12 text-sm sm:text-base"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-foreground">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter your email"
                    className="h-11 sm:h-12 text-sm sm:text-base"
                    required
                  />
                </div>

                {/* Student/Teacher ID */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-foreground">
                    {userType === "student" ? "Student ID" : "Teacher ID"} *
                  </label>
                  <Input
                    type="text"
                    value={userType === "student" ? formData.studentId : formData.teacherId}
                    onChange={(e) => setFormData({
                      ...formData, 
                      [userType === "student" ? "studentId" : "teacherId"]: e.target.value
                    })}
                    placeholder={`Enter your ${userType} ID`}
                    className="h-11 sm:h-12 text-sm sm:text-base"
                    required
                  />
                </div>

                {/* Student-specific fields */}
                {userType === "student" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Class *</label>
                      <select
                        value={formData.class}
                        onChange={(e) => setFormData({...formData, class: e.target.value})}
                        className="w-full p-3 border border-border rounded-lg bg-background"
                        required
                      >
                        <option value="">Select Class</option>
                        {classes.map(cls => (
                          <option key={cls} value={cls}>Class {cls}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Section *</label>
                      <select
                        value={formData.section}
                        onChange={(e) => setFormData({...formData, section: e.target.value})}
                        className="w-full p-3 border border-border rounded-lg bg-background"
                        required
                      >
                        <option value="">Select Section</option>
                        {sections.map(sec => (
                          <option key={sec} value={sec}>Section {sec}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Teacher-specific fields */}
                {userType === "teacher" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Subject *</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full p-3 border border-border rounded-lg bg-background"
                        required
                      >
                        <option value="">Select Subject</option>
                        {subjects.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Assigned Class *</label>
                        <select
                          value={formData.class}
                          onChange={(e) => setFormData({...formData, class: e.target.value})}
                          className="w-full p-3 border border-border rounded-lg bg-background"
                          required
                        >
                          <option value="">Select Class</option>
                          {classes.map(cls => (
                            <option key={cls} value={cls}>Class {cls}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Assigned Section *</label>
                        <select
                          value={formData.section}
                          onChange={(e) => setFormData({...formData, section: e.target.value})}
                          className="w-full p-3 border border-border rounded-lg bg-background"
                          required
                        >
                          <option value="">Select Section</option>
                          {sections.map(sec => (
                            <option key={sec} value={sec}>Section {sec}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Password fields */}
                {userType && (
                  <>
                    {/* Password */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Password *
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          placeholder="Create a password"
                          className="pr-10"
                          minLength={6}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          placeholder="Confirm your password"
                          className="pr-10"
                          minLength={6}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Teacher Password Info */}
                {userType === "teacher" && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lock className="h-4 w-4 text-blue-400" />
                      <h4 className="text-sm font-semibold text-blue-400">Password Tips</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Choose a strong password with at least 6 characters. The Principal can reset your password later if needed.
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-gold to-yellow-500 hover:from-gold/80 hover:to-yellow-500/80 text-black font-semibold py-3"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    `Create ${userType === "student" ? "Student" : "Teacher"} Account`
                  )}
                </Button>
              </form>

            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthSignup;
