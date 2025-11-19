import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Clock, 
  User, 
  LogOut, 
  Star, 
  BarChart3, 
  FileText, 
  GraduationCap,
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  Trophy,
  Award,
  Bell,
  CreditCard,
  DollarSign,
  Calendar as CalendarIcon,
  Edit,
  MessageSquare,
  Send,
  Trash2,
  Eye,
  CheckCircle,
  UserPlus,
  Plus,
  AlertCircle,
  Download,
  Upload,
  Lock,
  Image,
  Volume2, // Import Volume2 icon for Principal Audio
  Video, // Import Video icon for Live Teaching
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { textarea } from "@/components/ui/textarea";
import StudentManager from "@/components/StudentManager";
import LiveClassroom from "@/components/LiveClassroom";
import CircleGrid from "@/components/CircleGrid";
import { setSupabaseData, subscribeToSupabaseChanges } from "@/lib/supabaseHelpers";
import { Textarea } from "@/components/ui/textarea";

interface Student {
  id: string;
  name: string;
  fullName?: string;
  rollNumber: string;
  class: string;
  section: string;
  email: string;
  parentEmail: string;
  phone: string;
  image: string;
  status?: 'active' | 'banned';
  attendance: {
    date: string;
    status: 'present' | 'absent' | 'late';
    remarks?: string;
  }[];
  remarks: {
    id?: string;
    date: string;
    type: 'good' | 'bad';
    message: string;
    subject: string;
    image?: string; // For backward compatibility
    images?: string[]; // New multiple images support
  }[];
}

interface Homework {
  id: string;
  title: string;
  description: string;
  subject: string;
  class: string;
  section: string;
  dueDate: string;
  attachments: string[];
  createdAt: string;
  createdBy: string;
}

interface AttendanceRecord {
  id: string;
  date: string;
  class: string;
  section: string;
  students: {
    studentId: string;
    status: 'present' | 'absent' | 'late';
    remarks?: string;
  }[];
  teacherId: string;
}

interface StudentReport {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  reportImage: string;
  notes: string;
  createdAt: string;
  class: string;
  section: string;
}

interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  month: string;
  year: number;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  paymentDate?: string;
  notes?: string;
  teacherId: string;
  createdAt: string;
}

interface PaymentRequest {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  amount: number;
  months: string[];
  notes: string;
  teacherId: string;
  teacherName: string;
  createdAt: string;
  status: 'pending' | 'paid';
}

interface Notification {
  id: string;
  fromId: string;
  fromName: string;
  fromType: 'teacher' | 'principal';
  toId: string;
  toName: string;
  toType: 'teacher' | 'principal';
  subject: string;
  message: string;
  photo1?: string;
  photo2?: string;
  createdAt: string;
  status: 'unread' | 'read';
  replies?: NotificationReply[];
}

interface NotificationReply {
  id: string;
  fromId: string;
  fromName: string;
  fromType: 'teacher' | 'principal';
  message: string;
  createdAt: string;
}

interface PrincipalRemark {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  type: 'good' | 'bad';
  message: string;
  subject: string;
  principalId: string;
  principalName: string;
  createdAt: string;
}

const TeacherDashboard = () => {
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherSubject, setTeacherSubject] = useState("");
  const navigate = useNavigate();

  // Load teacher info from localStorage on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("teacherEmail") || "";
    const storedName = localStorage.getItem("teacherName") || "";
    const storedSubject = localStorage.getItem("teacherSubject") || "";

    setTeacherEmail(storedEmail);
    setTeacherName(storedName);
    setTeacherSubject(storedSubject);
  }, []);
  const [activeSection, setActiveSection] = useState<"dashboard" | "homework" | "attendance" | "students" | "createstudent" | "remarks" | "studentreport" | "profile" | "fees">("dashboard");
  const [selectedClass, setSelectedClass] = useState("8");
  const [selectedSection, setSelectedSection] = useState("A");
  const [feeFilterRoll, setFeeFilterRoll] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [showHomeworkModal, setShowHomeworkModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showLiveClassroom, setShowLiveClassroom] = useState(false);
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<Student | null>(null);
  const [reportForm, setReportForm] = useState({
    reportImage: "",
    notes: "",
    subject: ""
  });
  const [studentReports, setStudentReports] = useState<StudentReport[]>([]);
  const [showViewSentReportsModal, setShowViewSentReportsModal] = useState(false);
  const [selectedStudentForViewReports, setSelectedStudentForViewReports] = useState<Student | null>(null);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [attendanceView, setAttendanceView] = useState<'today' | 'calendar' | 'holidays' | 'editday'>('today');
  const [holidays, setHolidays] = useState<string[]>([]);
  const [newHoliday, setNewHoliday] = useState('');
  const [selectedEditDate, setSelectedEditDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingHomework, setEditingHomework] = useState<Homework | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportImageInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  // Student creation form state
  const [studentForm, setStudentForm] = useState({
    fullName: "",
    email: "",
    rollNumber: "",
    parentEmail: "",
    phone: "",
    class: "8",
    section: "A",
    image: ""
  });

  // Classes and Sections as per your requirement
  const subjects = [
    "Mathematics", "Science", "Physics", "Chemistry", "Biology", 
    "English Literature", "Hindi", "History", "Geography", "Civics/Political Science",
    "Economics", "Computer Science", "Information Technology", "Physical Education", 
    "Arts & Crafts", "Music", "Dance", "Drawing & Painting", "Home Science",
    "Agriculture", "Commerce", "Accountancy", "Business Studies", "Psychology",
    "Sociology", "Philosophy", "Sanskrit", "Urdu", "French", "German", "Spanish"
  ];
  const classes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const sections = ["A", "B", "C", "D", "E"];

  // Homework form state
  const [homeworkForm, setHomeworkForm] = useState({
    title: "",
    description: "",
    subject: "",
    class: "8",
    section: "A",
    dueDate: "",
    attachments: [] as string[]
  });

  // Remarks form state
  const [remarksForm, setRemarksForm] = useState({
    studentId: "",
    type: "good" as "good" | "bad",
    message: "",
    subject: "",
    images: [] as string[]
  });
  const [editingRemark, setEditingRemark] = useState<any>(null);
  const [editingRemarkIndex, setEditingRemarkIndex] = useState<number>(-1);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{src: string, title: string} | null>(null);

  // Fee management state
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedStudentForPayment, setSelectedStudentForPayment] = useState<Student | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    months: [] as string[],
    notes: ''
  });
  // Payment modal filter state
  const [paymentFilterClass, setPaymentFilterClass] = useState<string>(classes[0] || "");
  const [paymentFilterSection, setPaymentFilterSection] = useState<string>(sections[0] || "");
  const [paymentFilterRoll, setPaymentFilterRoll] = useState<string>("");

  // When payment modal opens, pre-fill filters from current selection
  useEffect(() => {
    if (showPaymentModal) {
      setPaymentFilterClass(selectedClass || classes[0] || "");
      setPaymentFilterSection(selectedSection || sections[0] || "");
      setPaymentFilterRoll("");
      setSelectedStudentForPayment(null);
    }
  }, [showPaymentModal]);
  const [showFeeStatusModal, setShowFeeStatusModal] = useState(false);

  // Notification state
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationForm, setNotificationForm] = useState({
    subject: '',
    message: '',
    photo1: '',
    photo2: ''
  });
  const [showTeacherNotifications, setShowTeacherNotifications] = useState(false);
  const [teacherNotifications, setTeacherNotifications] = useState<Notification[]>([]);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  // Unread count for header bell
  const unreadTeacherNotifications = teacherNotifications.filter(n => n.status === 'unread').length;
  const [showEditNotificationModal, setShowEditNotificationModal] = useState(false);
  const [editNotificationForm, setEditNotificationForm] = useState({
    subject: '',
    message: ''
  });
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedNotificationForReply, setSelectedNotificationForReply] = useState<Notification | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  // Student notification state
  const [showStudentNotificationModal, setShowStudentNotificationModal] = useState(false);
  const [studentNotificationForm, setStudentNotificationForm] = useState({
    subject: '',
    message: '',
    targetType: 'all' as 'all' | 'class' | 'section' | 'student',
    targetClass: '',
    targetSection: '',
    targetStudentId: '',
    photo1: '',
    photo2: ''
  });
  const [sentStudentNotifications, setSentStudentNotifications] = useState<any[]>([]);
  const [showSentNotificationsModal, setShowSentNotificationsModal] = useState(false);
  const [editingStudentNotification, setEditingStudentNotification] = useState<any>(null);
  const [showEditStudentNotificationModal, setShowEditStudentNotificationModal] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentYear = new Date().getFullYear();

  // Profile state
  const [teacherProfile, setTeacherProfile] = useState({
    name: teacherName,
    photo: "",
    bio: "",
    phone: "",
    qualification: ""
  });

  // CircleGrid state
  const [showCircleGrid, setShowCircleGrid] = useState(false);
  const [tempProfilePhoto, setTempProfilePhoto] = useState("");

  // Current attendance state
  const [currentAttendance, setCurrentAttendance] = useState<{[key: string]: 'present' | 'absent' | 'late'}>({});
  const [attendanceRemarks, setAttendanceRemarks] = useState<{[key: string]: string}>({});

  // State for editing reports
  const [showEditReportModal, setShowEditReportModal] = useState(false);
  const [editingReport, setEditingReport] = useState<StudentReport | null>(null);

  // Load teacher info from localStorage on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("teacherEmail") || "";
    const storedName = localStorage.getItem("teacherName") || "";
    const storedSubject = localStorage.getItem("teacherSubject") || "";

    setTeacherEmail(storedEmail);
    setTeacherName(storedName);
    setTeacherSubject(storedSubject);

    // Set up real-time subscription for holidays
    const unsubscribeHolidays = subscribeToSupabaseChanges(
      'royal-academy-holidays',
      (newHolidays: string[]) => {
        console.log('[TeacherDashboard] Holidays updated from Supabase');
        setHolidays(newHolidays);
      }
    );

    // Load students from localStorage
    const storedStudents = localStorage.getItem('royal-academy-students');
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    }

    const storedHomework = localStorage.getItem('royal-academy-homework');
    if (storedHomework) {
      setHomework(JSON.parse(storedHomework));
    }

    const storedAttendance = localStorage.getItem('royal-academy-attendance');
    if (storedAttendance) {
      setAttendanceRecords(JSON.parse(storedAttendance));
    }

    const storedReports = localStorage.getItem('royal-academy-student-reports');
    if (storedReports) {
      setStudentReports(JSON.parse(storedReports));
    }

    // Load holidays from localStorage
    const storedHolidays = localStorage.getItem('royal-academy-holidays');
    if (storedHolidays) {
      setHolidays(JSON.parse(storedHolidays));
    }

    // Load teacher profile
    const storedProfile = localStorage.getItem(`teacher-profile-${teacherEmail}`);
    if (storedProfile) {
      setTeacherProfile(JSON.parse(storedProfile));
    }

    // Load fee records and payment requests
    const storedFeeRecords = localStorage.getItem('royal-academy-fee-records');
    if (storedFeeRecords) {
      setFeeRecords(JSON.parse(storedFeeRecords));
    }

    const storedPaymentRequests = localStorage.getItem('royal-academy-payment-requests');
    if (storedPaymentRequests) {
      setPaymentRequests(JSON.parse(storedPaymentRequests));
    }

    // Load teacher notifications (sent by this teacher)
    const storedNotifications = localStorage.getItem('royal-academy-notifications');
    if (storedNotifications) {
      const allNotifications: Notification[] = JSON.parse(storedNotifications);
      // Filter notifications sent by this teacher
      const myNotifications = allNotifications.filter(n => n.fromId === teacherEmail);
      setTeacherNotifications(myNotifications);
    }

    // Load sent student notifications
    const storedStudentNotifications = localStorage.getItem('royal-academy-student-notifications');
    if (storedStudentNotifications) {
      const allStudentNotifications = JSON.parse(storedStudentNotifications);
      // Filter notifications sent by this teacher
      const mySentNotifications = allStudentNotifications.filter((n: any) => n.senderId === teacherEmail);
      setSentStudentNotifications(mySentNotifications);
    }

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      unsubscribeHolidays();
    };
  }, [navigate, teacherEmail]);

  const saveData = () => {
    localStorage.setItem('royal-academy-students', JSON.stringify(students));
    localStorage.setItem('royal-academy-homework', JSON.stringify(homework));
    localStorage.setItem('royal-academy-attendance', JSON.stringify(attendanceRecords));
  };
  const handleLogout = () => {
    // Clear all teacher authentication data
    localStorage.removeItem("teacherAuth");
    localStorage.removeItem("teacherEmail");
    localStorage.removeItem("teacherName");
    localStorage.removeItem("teacherSubject");

    // Also clear any session storage
    sessionStorage.clear();

    // Small delay to ensure all state is cleared before redirecting
    setTimeout(() => {
      // Force a complete redirect to ensure clean state
      window.location.href = "/teacher";
    }, 100);
  };

  // Image upload handler
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageUpload = async (files: FileList | null, type: 'homework' | 'student') => {
    if (!files) return;

    const newImages: string[] = [];
    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        try {
          const base64 = await convertToBase64(file);
          newImages.push(base64);
        } catch (error) {
          console.error('Error converting image:', error);
        }
      }
    }

    if (type === 'homework') {
      setHomeworkForm(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newImages]
      }));
    } else if (type === 'student') {
      setStudentForm(prev => ({
        ...prev,
        image: newImages[0] || prev.image
      }));
    }
  };

  // Create or update homework
  const handleCreateHomework = async () => {
    if (editingHomework) {
      // Update existing homework
      const updatedHomework = homework.map(hw => 
        hw.id === editingHomework.id 
          ? {
              ...hw,
              ...homeworkForm,
              subject: teacherSubject,
              createdBy: teacherName
            }
          : hw
      );
      setHomework(updatedHomework);
      localStorage.setItem('royal-academy-homework', JSON.stringify(updatedHomework));
      await setSupabaseData('royal-academy-homework', updatedHomework);
      alert(`Homework "${homeworkForm.title}" updated successfully!`);
    } else {
      // Create new homework
      const newHomework: Homework = {
        id: Date.now().toString(),
        ...homeworkForm,
        subject: teacherSubject,
        createdAt: new Date().toISOString(),
        createdBy: teacherName
      };

      const updatedHomework = [...homework, newHomework];
      setHomework(updatedHomework);
      localStorage.setItem('royal-academy-homework', JSON.stringify(updatedHomework));
      await setSupabaseData('royal-academy-homework', updatedHomework);
      alert(`Homework "${newHomework.title}" has been sent to Class ${newHomework.class}-${newHomework.section} students!`);
    }

    setShowHomeworkModal(false);
    setEditingHomework(null);
    setHomeworkForm({
      title: "",
      description: "",
      subject: "",
      class: "8",
      section: "A",
      dueDate: "",
      attachments: []
    });
  };

  // Handle editing homework
  const handleEditHomework = (hw: Homework) => {
    setEditingHomework(hw);
    setHomeworkForm({
      title: hw.title,
      description: hw.description,
      subject: hw.subject,
      class: hw.class,
      section: hw.section,
      dueDate: hw.dueDate,
      attachments: hw.attachments
    });
    setShowHomeworkModal(true);
  };

  // Handle deleting homework
  const handleDeleteHomework = async (homeworkId: string) => {
    if (confirm('Are you sure you want to delete this homework? This action cannot be undone.')) {
      const updatedHomework = homework.filter(hw => hw.id !== homeworkId);
      setHomework(updatedHomework);
      localStorage.setItem('royal-academy-homework', JSON.stringify(updatedHomework));
      await setSupabaseData('royal-academy-homework', updatedHomework);
      alert('Homework deleted successfully!');
    }
  };

  // Handle student creation/editing
  const handleCreateStudent = async () => {
    // Validation
    if (!studentForm.fullName || !studentForm.email || !studentForm.rollNumber || !studentForm.class || !studentForm.section) {
      alert("Please fill all required fields");
      return;
    }

    try {
      if (editingStudentId) {
        // Edit existing student
        const updatedStudents = students.map(student => 
          student.id === editingStudentId 
            ? {
                ...student,
                name: studentForm.fullName,
                rollNumber: studentForm.rollNumber,
                class: studentForm.class,
                section: studentForm.section,
                email: studentForm.email,
                parentEmail: studentForm.parentEmail,
                phone: studentForm.phone,
                image: studentForm.image || student.image
              }
            : student
        );

        setStudents(updatedStudents);
        localStorage.setItem('royal-academy-students', JSON.stringify(updatedStudents));

        // Also update auth students
        const authStudents = JSON.parse(localStorage.getItem('royal-academy-auth-students') || '[]');
        const updatedAuthStudents = authStudents.map((s: any) => 
          s.studentId === editingStudentId 
            ? {
                ...s,
                username: studentForm.fullName,
                email: studentForm.email,
                name: studentForm.fullName,
                rollNumber: studentForm.rollNumber,
                class: studentForm.class,
                section: studentForm.section,
                parentEmail: studentForm.parentEmail,
                phone: studentForm.phone
              }
            : s
        );
        localStorage.setItem('royal-academy-auth-students', JSON.stringify(updatedAuthStudents));

        alert('Student updated successfully!');
        setEditingStudentId(null);
      } else {
        // Create new student
        const studentId = `STU${Date.now().toString().slice(-6)}`;
        const defaultPassword = `${studentForm.fullName.split(' ')[0].toLowerCase()}123`;

        const newStudent: Student = {
          id: studentId,
          name: studentForm.fullName,
          rollNumber: studentForm.rollNumber,
          class: studentForm.class,
          section: studentForm.section,
          email: studentForm.email,
          parentEmail: studentForm.parentEmail,
          phone: studentForm.phone,
          image: studentForm.image || "/placeholder-student.jpg",
          status: 'active',
          attendance: [],
          remarks: []
        };

        // Save to localStorage
        const existingStudents: Student[] = JSON.parse(localStorage.getItem('royal-academy-students') || '[]');
        localStorage.setItem('royal-academy-students', JSON.stringify([...existingStudents, newStudent]));

        // Also save to auth students for login
        const existingAuthStudents = JSON.parse(localStorage.getItem('royal-academy-auth-students') || '[]');
        const authStudent = { 
          ...newStudent, 
          username: studentForm.fullName, 
          studentId, 
          type: 'student',
          password: defaultPassword,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem('royal-academy-auth-students', JSON.stringify([...existingAuthStudents, authStudent]));

        alert(`Student account created successfully!

Login Credentials:
Email: ${studentForm.email}
Password: ${defaultPassword}
Student ID: ${studentId}`);

        setStudents(prev => [...prev, newStudent]);
      }

      setActiveSection('students');
      setStudentForm({
        fullName: "",
        email: "",
        rollNumber: "",
        parentEmail: "",
        phone: "",
        class: "1",
        section: "A",
        image: ""
      });
    } catch (error) {
      alert(`Failed to ${editingStudentId ? 'update' : 'create'} student account. Please try again.`);
      console.error(`Error ${editingStudentId ? 'updating' : 'creating'} student:`, error);
    }
  };


  // Take attendance
  const handleTakeAttendance = async () => {
    const classStudents = students.filter(s => s.class === selectedClass && s.section === selectedSection);

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const attendanceRecord: AttendanceRecord = {
      id: Date.now().toString(),
      date: dateStr,
      class: selectedClass,
      section: selectedSection,
      students: classStudents.map(student => ({
        studentId: student.id,
        status: currentAttendance[student.id] || 'present',
        remarks: attendanceRemarks[student.id] || ''
      })),
      teacherId: teacherEmail
    };

    const updatedAttendance = [...attendanceRecords, attendanceRecord];
    setAttendanceRecords(updatedAttendance);
    localStorage.setItem('royal-academy-attendance', JSON.stringify(updatedAttendance));

    // Update student attendance records in main students array
    const updatedStudents = students.map(student => {
      if (student.class === selectedClass && student.section === selectedSection) {
        const existingAttendance = student.attendance || [];
        // Remove any existing attendance for today
        const filteredAttendance = existingAttendance.filter(a => a.date !== dateStr);
        // Add new attendance
        return {
          ...student,
          attendance: [...filteredAttendance, {
            date: dateStr,
            status: currentAttendance[student.id] || 'present',
            remarks: attendanceRemarks[student.id] || ''
          }]
        };
      }
      return student;
    });

    setStudents(updatedStudents);
    localStorage.setItem('royal-academy-students', JSON.stringify(updatedStudents));
    await setSupabaseData('royal-academy-students', updatedStudents);

    // Critical: Update auth students for student dashboard access
    const authStudents = JSON.parse(localStorage.getItem('royal-academy-auth-students') || '[]');
    const updatedAuthStudents = authStudents.map((authStudent: any) => {
      const matchingStudent = updatedStudents.find(s => 
        s.id === authStudent.studentId || 
        s.id === authStudent.id ||
        s.email === authStudent.email ||
        s.rollNumber === authStudent.rollNumber
      );
      if (matchingStudent) {
        return {
          ...authStudent,
          attendance: matchingStudent.attendance || []
        };
      }
      return authStudent;
    });
    localStorage.setItem('royal-academy-auth-students', JSON.stringify(updatedAuthStudents));
    await setSupabaseData('royal-academy-auth-students', updatedAuthStudents);

    console.log('Attendance updated:', {
      date: dateStr,
      studentsUpdated: classStudents.length,
      authStudentsUpdated: updatedAuthStudents.filter(s => 
        classStudents.some(cs => cs.id === s.studentId || cs.email === s.email)
      ).length
    });

    alert(`Attendance taken for Class ${selectedClass}-${selectedSection}!`);
    setCurrentAttendance({});
    setAttendanceRemarks({});
  };

  // Handle editing attendance for any specific day
  const handleEditDayAttendance = async (studentId: string, status: 'present' | 'absent' | 'late' | 'remove') => {
    const updatedStudents = students.map(student => {
      if (student.id === studentId) {
        let updatedAttendance = [...(student.attendance || [])];

        // Find existing attendance record for this date
        const existingIndex = updatedAttendance.findIndex(a => a.date === selectedEditDate);

        if (status === 'remove') {
          // Remove attendance record
          if (existingIndex !== -1) {
            updatedAttendance.splice(existingIndex, 1);
          }
        } else {
          // Add or update attendance record
          const attendanceRecord = {
            date: selectedEditDate,
            status: status,
            remarks: ''
          };

          if (existingIndex !== -1) {
            // Update existing record
            updatedAttendance[existingIndex] = attendanceRecord;
          } else {
            // Add new record
            updatedAttendance.push(attendanceRecord);
          }
        }

        return {
          ...student,
          attendance: updatedAttendance
        };
      }
      return student;
    });

    setStudents(updatedStudents);
    localStorage.setItem('royal-academy-students', JSON.stringify(updatedStudents));
    await setSupabaseData('royal-academy-students', updatedStudents);

    // Critical: Update auth students for student dashboard access with comprehensive matching
    const authStudents = JSON.parse(localStorage.getItem('royal-academy-auth-students') || '[]');
    const updatedAuthStudents = authStudents.map((authStudent: any) => {
      const matchingStudent = updatedStudents.find(s => 
        s.id === authStudent.studentId || 
        s.id === authStudent.id ||
        s.email === authStudent.email ||
        s.name === authStudent.name ||
        s.name === authStudent.fullName ||
        s.name === authStudent.name ||
        s.rollNumber === authStudent.rollNumber
      );
      if (matchingStudent) {
        return {
          ...authStudent,
          attendance: matchingStudent.attendance || []
        };
      }
      return authStudent;
    });
    localStorage.setItem('royal-academy-auth-students', JSON.stringify(updatedAuthStudents));
    await setSupabaseData('royal-academy-auth-students', updatedAuthStudents);

    console.log('Edit day attendance updated:', {
      date: selectedEditDate,
      studentId,
      status,
      authStudentUpdated: updatedAuthStudents.some(s => 
        s.studentId === studentId || s.id === studentId
      )
    });

    // Show success message
    const studentName = students.find(s => s.id === studentId)?.name || 'Student';
    const dateStr = new Date(selectedEditDate).toLocaleDateString();

    if (status === 'remove') {
      alert(`Attendance removed for ${studentName} on ${dateStr}`);
    } else {
      alert(`${studentName} marked as ${status} for ${dateStr}`);
    }
  };

  // Add or update remarks
  const handleAddRemarks = async () => {
    if (!remarksForm.studentId || !remarksForm.message) {
      alert('Please select a student and enter a message');
      return;
    }

    const targetStudent = students.find(s => s.id === remarksForm.studentId);
    if (!targetStudent) {
      alert('Student not found in teacher\'s student list');
      return;
    }


    const remarkData = {
      id: editingRemark ? editingRemark.id : Date.now().toString(),
      date: editingRemark ? editingRemark.date : new Date().toISOString().split('T')[0],
      type: remarksForm.type,
      message: remarksForm.message,
      subject: remarksForm.subject || teacherSubject,
      images: remarksForm.images || []
    };

    const updatedStudents = students.map(student => {
      if (student.id === targetStudent.id) {
        let updatedRemarks = [...(student.remarks || [])];

        if (editingRemark && editingRemarkIndex >= 0) {
          // Update existing remark
          updatedRemarks[editingRemarkIndex] = remarkData;
        } else {
          // Add new remark
          updatedRemarks.push(remarkData);
        }

        return {
          ...student,
          remarks: updatedRemarks
        };
      }
      return student;
    });

    setStudents(updatedStudents);
    localStorage.setItem('royal-academy-students', JSON.stringify(updatedStudents));
    await setSupabaseData('royal-academy-students', updatedStudents);

    // Also update auth students for student dashboard access
    const authStudents = JSON.parse(localStorage.getItem('royal-academy-auth-students') || '[]');
    console.log('Updating auth students for remarks sync...');
    console.log('Target student:', targetStudent);
    console.log('Current auth students:', authStudents);

    // Find and update the auth student record
    let authStudentUpdated = false;
    const updatedAuthStudents = authStudents.map((authStudent: any) => {
      // Check multiple matching criteria with more comprehensive matching
      const isMatch = 
        authStudent.studentId === targetStudent.id ||
        authStudent.id === targetStudent.id ||
        authStudent.email === targetStudent.email ||
        authStudent.name === targetStudent.name ||
        authStudent.fullName === targetStudent.name ||
        authStudent.name === targetStudent.fullName ||
        authStudent.rollNumber === targetStudent.rollNumber;

      if (isMatch) {
        console.log('Found matching auth student, updating remarks...');
        authStudentUpdated = true;
        return {
          ...authStudent,
          remarks: updatedStudents.find(s => s.id === targetStudent.id)?.remarks || []
        };
      }
      return authStudent;
    });

    // If no auth student was found, create one
    if (!authStudentUpdated) {
      console.log('No matching auth student found, creating new one...');
      const newAuthStudent = {
        id: targetStudent.id,
        studentId: targetStudent.id,
        email: targetStudent.email,
        name: targetStudent.name,
        fullName: targetStudent.name,
        class: targetStudent.class,
        section: targetStudent.section,
        rollNumber: targetStudent.rollNumber,
        remarks: updatedStudents.find(s => s.id === targetStudent.id)?.remarks || []
      };
      updatedAuthStudents.push(newAuthStudent);
      console.log('Created new auth student:', newAuthStudent);
    }

    localStorage.setItem('royal-academy-auth-students', JSON.stringify(updatedAuthStudents));
    await setSupabaseData('royal-academy-auth-students', updatedAuthStudents);
    console.log('Updated auth students saved:', updatedAuthStudents);

    alert(`${remarksForm.type === 'good' ? 'Good' : 'Bad'} remark ${editingRemark ? 'updated' : 'added'} for ${targetStudent.name}!`);

    setShowRemarksModal(false);
    setEditingRemark(null);
    setEditingRemarkIndex(-1);
    setRemarksForm({
      studentId: "",
      type: "good",
      message: "",
      subject: "",
      images: []
    });
  };

  // Edit remark
  const handleEditRemark = (remark: any, index: number, studentId: string) => {
    setEditingRemark(remark);
    setEditingRemarkIndex(index);
    setRemarksForm({
      studentId: studentId,
      type: remark.type,
      message: remark.message,
      subject: remark.subject,
      images: remark.images || remark.image ? [remark.image] : [] // Handle backward compatibility
    });
  };

  // Delete remark
  const handleDeleteRemark = (index: number, studentId: string) => {
    if (confirm('Are you sure you want to delete this remark?')) {
      const updatedStudents = students.map(student => {
        if (student.id === studentId) {
          const updatedRemarks = (student.remarks || []).filter((_, i) => i !== index);
          return {
            ...student,
            remarks: updatedRemarks
          };
        }
        return student;
      });

      setStudents(updatedStudents);
      localStorage.setItem('royal-academy-students', JSON.stringify(updatedStudents));

      // Also update auth students with comprehensive matching
      const authStudents = JSON.parse(localStorage.getItem('royal-academy-auth-students') || '[]');
      const updatedAuthStudents = authStudents.map((authStudent: any) => {
        const matchingStudent = updatedStudents.find(s => 
          s.id === authStudent.studentId || 
          s.id === authStudent.id ||
          s.email === authStudent.email ||
          s.name === authStudent.name ||
          s.rollNumber === authStudent.rollNumber
        );
        if (matchingStudent) {
          console.log('Updating auth student remarks after deletion:', authStudent);
          return {
            ...authStudent,
            remarks: matchingStudent.remarks
          };
        }
        return authStudent;
      });
      localStorage.setItem('royal-academy-auth-students', JSON.stringify(updatedAuthStudents));
      console.log('Auth students updated after remark deletion:', updatedAuthStudents);

      alert('Remark deleted successfully!');
    }
  };

  const getClassStudents = () => {
    return students.filter(s => s.class === selectedClass && s.section === selectedSection);
  };

  const getFeeFilteredStudents = () => {
    return students.filter(s => {
      const byClass = s.class === selectedClass;
      const bySection = s.section === selectedSection;
      const byRoll = feeFilterRoll ? s.rollNumber.toString() === feeFilterRoll : true;
      return byClass && bySection && byRoll;
    });
  };

  // Students filtered in payment modal by local class/section/roll
  const getPaymentFilteredStudents = () => {
    return students.filter(s => {
      const byClass = paymentFilterClass ? s.class === paymentFilterClass : true;
      const bySection = paymentFilterSection ? s.section === paymentFilterSection : true;
      const byRoll = paymentFilterRoll ? s.rollNumber.toString() === paymentFilterRoll : true;
      return byClass && bySection && byRoll;
    });
  };

  // Handle report image upload
  const handleReportImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setReportForm({ ...reportForm, reportImage: base64 });
      } catch (error) {
        alert('Error uploading image. Please try again.');
      }
    }
  };

  // Send report to student
  const handleSendReport = async () => {
    if (!selectedStudentForReport || !reportForm.reportImage || !reportForm.notes) {
      alert('Please select a student, upload an image, and add notes');
      return;
    }

    const newReport: StudentReport = {
      id: Date.now().toString(),
      studentId: selectedStudentForReport.id,
      studentName: selectedStudentForReport.name,
      teacherId: teacherEmail,
      teacherName: teacherName,
      subject: reportForm.subject || teacherSubject,
      reportImage: reportForm.reportImage,
      notes: reportForm.notes,
      createdAt: new Date().toISOString(),
      class: selectedStudentForReport.class,
      section: selectedStudentForReport.section
    };

    const updatedReports = [...studentReports, newReport];
    setStudentReports(updatedReports);
    localStorage.setItem('royal-academy-student-reports', JSON.stringify(updatedReports));
    await setSupabaseData('royal-academy-student-reports', updatedReports);

    alert(`Report sent to ${selectedStudentForReport.name} successfully!`);

    // Reset form
    setReportForm({ reportImage: "", notes: "", subject: "" });
    setSelectedStudentForReport(null);
    setShowReportModal(false);
  };

  // Delete report
  const handleDeleteReport = async (reportId: string) => {
    if (confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      const updatedReports = studentReports.filter(report => report.id !== reportId);
      setStudentReports(updatedReports);
      localStorage.setItem('royal-academy-student-reports', JSON.stringify(updatedReports));
      await setSupabaseData('royal-academy-student-reports', updatedReports);
      alert('Report deleted successfully!');
    }
  };

  // Update report (new function)
  const handleUpdateReport = async () => {
    if (!editingReport || !reportForm.reportImage || !reportForm.notes) {
      alert('Please ensure all fields are filled and an image is uploaded.');
      return;
    }

    const updatedReports = studentReports.map(report =>
      report.id === editingReport.id
        ? {
            ...report,
            subject: reportForm.subject,
            reportImage: reportForm.reportImage,
            notes: reportForm.notes,
            // Optionally update teacher info if it could change
            teacherId: teacherEmail,
            teacherName: teacherName
          }
        : report
    );

    setStudentReports(updatedReports);
    localStorage.setItem('royal-academy-student-reports', JSON.stringify(updatedReports));
    await setSupabaseData('royal-academy-student-reports', updatedReports);

    alert(`Report for ${editingReport.studentName} updated successfully!`);

    setShowEditReportModal(false);
    setEditingReport(null);
    setReportForm({ reportImage: "", notes: "", subject: "" });
  };

  // Handle editing report
  const handleEditReport = (report: StudentReport) => {
    setEditingReport(report);
    setReportForm({
      subject: report.subject,
      reportImage: report.reportImage,
      notes: report.notes
    });
    setShowEditReportModal(true);
  };

  // Fee management functions
  const handleCreatePaymentRequest = async () => {
    if (!selectedStudentForPayment || !paymentForm.amount || paymentForm.months.length === 0) {
      alert('Please select a student, enter amount, and select at least one month');
      return;
    }

    const newPaymentRequest: PaymentRequest = {
      id: Date.now().toString(),
      studentId: selectedStudentForPayment.id,
      studentName: selectedStudentForPayment.name,
      class: selectedStudentForPayment.class,
      section: selectedStudentForPayment.section,
      amount: parseFloat(paymentForm.amount),
      months: paymentForm.months,
      notes: paymentForm.notes,
      teacherId: teacherEmail,
      teacherName: teacherName,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    const updatedRequests = [...paymentRequests, newPaymentRequest];
    setPaymentRequests(updatedRequests);
    localStorage.setItem('royal-academy-payment-requests', JSON.stringify(updatedRequests));
    // Write to Supabase for real-time sync
    await setSupabaseData('royal-academy-payment-requests', updatedRequests);

    // Create fee records for each month
    const newFeeRecords: FeeRecord[] = paymentForm.months.map(month => ({
      id: `${Date.now()}-${month}`,
      studentId: selectedStudentForPayment.id,
      studentName: selectedStudentForPayment.name,
      class: selectedStudentForPayment.class,
      section: selectedStudentForPayment.section,
      month: month,
      year: currentYear,
      amount: parseFloat(paymentForm.amount) / paymentForm.months.length,
      status: 'pending',
      notes: paymentForm.notes,
      teacherId: teacherEmail,
      createdAt: new Date().toISOString()
    }));

    const updatedFeeRecords = [...feeRecords, ...newFeeRecords];
    setFeeRecords(updatedFeeRecords);
    localStorage.setItem('royal-academy-fee-records', JSON.stringify(updatedFeeRecords));
    // Write to Supabase for real-time sync
    await setSupabaseData('royal-academy-fee-records', updatedFeeRecords);

    alert(`Payment request created for ${selectedStudentForPayment.name}!\nAmount: ₹${paymentForm.amount}\nMonths: ${paymentForm.months.join(', ')}`);

    // Reset form
    setPaymentForm({ amount: '', months: [], notes: '' });
    setSelectedStudentForPayment(null);
    setShowPaymentModal(false);
  };

  const getStudentFeeStatus = (studentId: string) => {
    const studentFees = feeRecords.filter(fee => fee.studentId === studentId);
    const pendingMonths = studentFees.filter(fee => fee.status === 'pending').map(fee => fee.month);
    const paidMonths = studentFees.filter(fee => fee.status === 'paid').map(fee => fee.month);
    const totalPending = studentFees.filter(fee => fee.status === 'pending').reduce((sum, fee) => sum + fee.amount, 0);

    return {
      pendingMonths,
      paidMonths,
      totalPending,
      totalRecords: studentFees.length
    };
  };

  const handleMonthToggle = (month: string) => {
    setPaymentForm(prev => ({
      ...prev,
      months: prev.months.includes(month)
        ? prev.months.filter(m => m !== month)
        : [...prev.months, month]
    }));
  };

  const redirectToStudentPayment = (studentId: string) => {
    // Store payment info for student dashboard
    const paymentInfo = {
      studentId,
      redirectFrom: 'teacher',
      teacherId: teacherEmail,
      teacherName: teacherName,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('payment-redirect-info', JSON.stringify(paymentInfo));

    // Navigate to student auth with payment flag
    navigate('/student-auth?action=payment');
  };

  // Notification functions
  const handleSendNotification = () => {
    if (!notificationForm.subject || !notificationForm.message) {
      alert('Please fill in both subject and message');
      return;
    }

    const newNotification: Notification = {
      id: Date.now().toString(),
      fromId: teacherEmail,
      fromName: teacherName,
      fromType: 'teacher',
      toId: 'principal@royalacademy.edu',
      toName: 'Principal',
      toType: 'principal',
      subject: notificationForm.subject,
      message: notificationForm.message,
      photo1: notificationForm.photo1,
      photo2: notificationForm.photo2,
      createdAt: new Date().toISOString(),
      status: 'unread',
      replies: []
    };

    // Save to localStorage
    const existingNotifications = JSON.parse(localStorage.getItem('royal-academy-notifications') || '[]');
    const updatedNotifications = [...existingNotifications, newNotification];
    localStorage.setItem('royal-academy-notifications', JSON.stringify(updatedNotifications));

    alert(`Notification sent to Principal successfully!\nSubject: ${notificationForm.subject}`);

    // Reset form
    setNotificationForm({ subject: '', message: '', photo1: '', photo2: '' });
    setShowNotificationModal(false);
  };

  // Teacher notification management functions
  const handleEditNotification = (notification: Notification) => {
    setEditingNotification(notification);
    setEditNotificationForm({
      subject: notification.subject,
      message: notification.message
    });
    setShowEditNotificationModal(true);
  };

  const handleUpdateNotification = () => {
    if (!editingNotification || !editNotificationForm.subject || !editNotificationForm.message) {
      alert('Please fill in both subject and message');
      return;
    }

    const updatedNotification = {
      ...editingNotification,
      subject: editNotificationForm.subject,
      message: editNotificationForm.message
    };

    // Update localStorage
    const allNotifications = JSON.parse(localStorage.getItem('royal-academy-notifications') || '[]');
    const updatedAllNotifications = allNotifications.map((n: Notification) => 
      n.id === editingNotification.id ? updatedNotification : n
    );
    localStorage.setItem('royal-academy-notifications', JSON.stringify(updatedAllNotifications));

    // Update local state
    setTeacherNotifications(prev => prev.map(n => n.id === editingNotification.id ? updatedNotification : n));

    alert('Notification updated successfully!');
    setShowEditNotificationModal(false);
    setEditingNotification(null);
    setEditNotificationForm({ subject: '', message: '' });
  };

  const handleDeleteNotification = (notificationId: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    // Update localStorage
    const allNotifications = JSON.parse(localStorage.getItem('royal-academy-notifications') || '[]');
    const updatedAllNotifications = allNotifications.filter((n: Notification) => n.id !== notificationId);
    localStorage.setItem('royal-academy-notifications', JSON.stringify(updatedAllNotifications));

    // Update local state
    setTeacherNotifications(prev => prev.filter(n => n.id !== notificationId));

    alert('Notification deleted successfully!');
  };

  const handleReplyToNotification = (notification: Notification) => {
    setSelectedNotificationForReply(notification);
    setShowReplyModal(true);
  };

  const handleSendReply = () => {
    if (!selectedNotificationForReply || !replyMessage) {
      alert('Please enter a reply message');
      return;
    }

    const newReply: NotificationReply = {
      id: Date.now().toString(),
      fromId: teacherEmail,
      fromName: teacherName,
      fromType: 'teacher',
      message: replyMessage,
      createdAt: new Date().toISOString()
    };

    const updatedNotification = {
      ...selectedNotificationForReply,
      replies: [...(selectedNotificationForReply.replies || []), newReply]
    };

    // Update localStorage
    const allNotifications = JSON.parse(localStorage.getItem('royal-academy-notifications') || '[]');
    const updatedAllNotifications = allNotifications.map((n: Notification) => 
      n.id === selectedNotificationForReply.id ? updatedNotification : n
    );
    localStorage.setItem('royal-academy-notifications', JSON.stringify(updatedAllNotifications));

    // Update local state
    setTeacherNotifications(prev => prev.map(n => n.id === selectedNotificationForReply.id ? updatedNotification : n));

    alert('Reply sent successfully!');
    setReplyMessage('');
    setShowReplyModal(false);
    setSelectedNotificationForReply(null);
  };

  // Student notification functions
  const handleSendStudentNotification = () => {
    if (!studentNotificationForm.subject || !studentNotificationForm.message) {
      alert('Please fill in both subject and message');
      return;
    }

    // Validate target selection
    if (studentNotificationForm.targetType === 'class' && !studentNotificationForm.targetClass) {
      alert('Please select a class');
      return;
    }
    if (studentNotificationForm.targetType === 'section' && (!studentNotificationForm.targetClass || !studentNotificationForm.targetSection)) {
      alert('Please select both class and section');
      return;
    }
    if (studentNotificationForm.targetType === 'student' && !studentNotificationForm.targetStudentId) {
      alert('Please select a student');
      return;
    }

    const newStudentNotification = {
      id: Date.now().toString(),
      subject: studentNotificationForm.subject,
      message: studentNotificationForm.message,
      senderType: 'teacher',
      senderId: teacherEmail,
      senderName: teacherName,
      targetType: studentNotificationForm.targetType,
      targetClass: studentNotificationForm.targetClass,
      targetSection: studentNotificationForm.targetSection,
      targetStudentId: studentNotificationForm.targetStudentId,
      photo1: studentNotificationForm.photo1,
      photo2: studentNotificationForm.photo2,
      createdAt: new Date().toISOString(),
      status: 'unread'
    };

    // Save to localStorage
    const existingNotifications = JSON.parse(localStorage.getItem('royal-academy-student-notifications') || '[]');
    const updatedNotifications = [...existingNotifications, newStudentNotification];
    localStorage.setItem('royal-academy-student-notifications', JSON.stringify(updatedNotifications));

    let targetDescription = '';
    switch (studentNotificationForm.targetType) {
      case 'all':
        targetDescription = 'all students';
        break;
      case 'class':
        targetDescription = `Class ${studentNotificationForm.targetClass}`;
        break;
      case 'section':
        targetDescription = `Class ${studentNotificationForm.targetClass}-${studentNotificationForm.targetSection}`;
        break;
      case 'student':
        const selectedStudent = students.find(s => s.id === studentNotificationForm.targetStudentId);
        targetDescription = selectedStudent ? selectedStudent.name : 'selected student';
        break;
    }

    alert(`Notification sent to ${targetDescription} successfully!\nSubject: ${studentNotificationForm.subject}`);

    // Reset form
    setStudentNotificationForm({
      subject: '',
      message: '',
      targetType: 'all',
      targetClass: '',
      targetSection: '',
      targetStudentId: '',
      photo1: '',
      photo2: ''
    });
    setShowStudentNotificationModal(false);

    // Reload sent notifications
    const updatedSentNotifications = [...sentStudentNotifications, newStudentNotification];
    setSentStudentNotifications(updatedSentNotifications);
  };

  // Student notification management functions
  const handleEditStudentNotification = (notification: any) => {
    setEditingStudentNotification(notification);
    setStudentNotificationForm({
      subject: notification.subject,
      message: notification.message,
      targetType: notification.targetType,
      targetClass: notification.targetClass,
      targetSection: notification.targetSection,
      targetStudentId: notification.targetStudentId,
      photo1: notification.photo1 || '',
      photo2: notification.photo2 || ''
    });
    setShowEditStudentNotificationModal(true);
  };

  const handleUpdateStudentNotification = () => {
    if (!editingStudentNotification || !studentNotificationForm.subject || !studentNotificationForm.message) {
      alert('Please fill in both subject and message');
      return;
    }

    const updatedNotification = {
      ...editingStudentNotification,
      subject: studentNotificationForm.subject,
      message: studentNotificationForm.message,
      targetType: studentNotificationForm.targetType,
      targetClass: studentNotificationForm.targetClass,
      targetSection: studentNotificationForm.targetSection,
      targetStudentId: studentNotificationForm.targetStudentId
    };

    // Update localStorage
    const allNotifications = JSON.parse(localStorage.getItem('royal-academy-student-notifications') || '[]');
    const updatedAllNotifications = allNotifications.map((n: any) => 
      n.id === editingStudentNotification.id ? updatedNotification : n
    );
    localStorage.setItem('royal-academy-student-notifications', JSON.stringify(updatedAllNotifications));

    // Update local state
    setSentStudentNotifications(prev => prev.map(n => n.id === editingStudentNotification.id ? updatedNotification : n));

    alert('Student notification updated successfully!');
    setShowEditStudentNotificationModal(false);
    setEditingStudentNotification(null);
    setStudentNotificationForm({
      subject: '',
      message: '',
      targetType: 'all',
      targetClass: '',
      targetSection: '',
      targetStudentId: '',
      photo1: '',
      photo2: ''
    });
  };

  const handleDeleteStudentNotification = (notificationId: string) => {
    if (!confirm('Are you sure you want to delete this student notification?')) {
      return;
    }

    // Update localStorage
    const allNotifications = JSON.parse(localStorage.getItem('royal-academy-student-notifications') || '[]');
    const updatedAllNotifications = allNotifications.filter((n: any) => n.id !== notificationId);
    localStorage.setItem('royal-academy-student-notifications', JSON.stringify(updatedAllNotifications));

    // Update local state
    setSentStudentNotifications(prev => prev.filter(n => n.id !== notificationId));

    alert('Student notification deleted successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal via-royal/90 to-gold/20">
      {/* Royal Header */}
      <div className="bg-gradient-to-r from-royal via-purple-900 to-royal backdrop-blur-md border-b border-gold/30 sticky top-0 z-40 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-gold/10"></div>
        <div className="px-2 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            {/* Profile Section - Mobile Optimized */}
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <div className="relative flex-shrink-0">
                {teacherProfile.photo ? (
                  <img
                    src={teacherProfile.photo}
                    alt="Profile"
                    className="h-10 w-10 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-full object-cover border-2 border-gold shadow-lg ring-2 ring-gold/20"
                  />
                ) : (
                  <div className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-gold via-yellow-400 to-gold flex items-center justify-center shadow-lg ring-2 ring-gold/20">
                    <User className="h-5 w-5 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-royal" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-base md:text-lg lg:text-2xl font-heading font-bold text-white mb-0.5 sm:mb-1 tracking-wide leading-tight truncate">
                  {(teacherProfile.name || teacherName)}
                </h1>
                <div className="flex flex-col space-y-0.5 sm:space-y-1">
                  <p className="text-gold/90 text-[10px] sm:text-xs md:text-sm font-medium flex items-center">
                    <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">{teacherSubject} Teacher</span>
                  </p>
                  <p className="hidden md:block text-white/80 text-[10px] sm:text-xs font-medium">Royal Academy • Excellence in Education</p>
                </div>
              </div>
            </div>

            {/* Navigation & Actions - Mobile Optimized */}
            <div className="flex flex-col lg:flex-row lg:items-center space-y-3 lg:space-y-0 lg:space-x-6">
              {/* Royal Navigation - Hidden on Mobile */}
              <div className="hidden lg:flex items-center space-x-6">
                <button
                  onClick={() => navigate('/')}
                  className="text-white/80 hover:text-gold transition-all duration-300 text-sm font-medium hover:scale-105"
                >
                  Home
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="text-white/80 hover:text-gold transition-all duration-300 text-sm font-medium hover:scale-105"
                >
                  About
                </button>
                <button
                  onClick={() => navigate('/courses')}
                  className="text-white/80 hover:text-gold transition-all duration-300 text-sm font-medium hover:scale-105"
                >
                  Courses
                </button>
                <button
                  onClick={() => navigate('/admissions')}
                  className="text-white/80 hover:text-gold transition-all duration-300 text-sm font-medium hover:scale-105"
                >
                  Admissions
                </button>
                <button
                  onClick={() => navigate('/gallery')}
                  className="text-white/80 hover:text-gold transition-all duration-300 text-sm font-medium hover:scale-105"
                >
                  Gallery
                </button>
              </div>

              {/* Action Buttons Container - Mobile Optimized */}
              <div className="flex items-center justify-center lg:justify-end space-x-1 sm:space-x-2 w-full lg:w-auto">

              {/* Teacher Notifications Bell */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTeacherNotifications(!showTeacherNotifications)}
                  className="relative bg-white/10 border-white/20 text-white dark:text-white hover:bg-white/20 hover:border-gold/50 transition-all duration-300 backdrop-blur-sm rounded-lg overflow-hidden w-8 h-8 sm:w-9 sm:h-9 p-1.5 sm:p-2 lg:w-auto lg:h-auto lg:px-3 lg:py-2"
                >
                  <Bell className="h-4 w-4" />
                  {teacherNotifications.filter(n => n.status === 'unread').length > 0 && (
                    <span className="pointer-events-none absolute top-0.5 right-0.5 h-4 w-4 lg:h-5 lg:w-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] rounded-full flex items-center justify-center shadow-lg">
                      {teacherNotifications.filter(n => n.status === 'unread').length}
                    </span>
                  )}
                </Button>

                {/* Teacher Notifications Dropdown / Modal (responsive) */}
                {showTeacherNotifications && (
                  isMobile ? (
                    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3" onClick={() => setShowTeacherNotifications(false)}>
                      <div className="bg-card border border-border rounded-xl w-full max-w-[calc(100vw-24px)] max-h-[85vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
                          <h3 className="font-semibold text-foreground text-sm sm:text-base">Notifications</h3>
                          <Button variant="ghost" size="sm" onClick={() => setShowTeacherNotifications(false)} className="h-8 w-8 p-0">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/50" style={{ maxHeight: 'calc(85vh - 60px)' }}>
                          {teacherNotifications.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground text-sm">No notifications</div>
                          ) : (
                            teacherNotifications.map((notification) => (
                              <div key={notification.id} className="p-3 sm:p-4 border-b border-border hover:bg-muted/50">
                                <div className="flex items-start justify-between mb-2 gap-2">
                                  <h4 className="text-sm font-medium text-foreground break-words flex-1">{notification.subject}</h4>
                                  <span className={`px-2 py-1 rounded text-xs flex-shrink-0 ${notification.status === 'unread' ? 'bg-blue-500/20 text-blue-400' : 'bg-muted text-muted-foreground'}`}>
                                    {notification.status === 'unread' ? 'New' : 'Read'}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">To: {notification.toName} • {new Date(notification.createdAt).toLocaleDateString()}</p>
                                <p className="text-xs text-muted-foreground mb-2 break-words whitespace-pre-wrap">{notification.message}</p>
                                {notification.replies && notification.replies.length > 0 && (
                                  <div className="mt-2 p-2 bg-green-500/10 rounded border-l-2 border-green-500">
                                    <p className="text-xs font-medium text-green-400 mb-1">Principal Reply:</p>
                                    <p className="text-xs text-foreground break-words whitespace-pre-wrap">{notification.replies[notification.replies.length - 1].message}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{new Date(notification.replies[notification.replies.length - 1].createdAt).toLocaleDateString()}</p>
                                  </div>
                                )}
                                <div className="flex flex-wrap gap-1 mt-2">
                                  <Button variant="ghost" size="sm" onClick={() => handleEditNotification(notification)} className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700">
                                    <Edit className="h-3 w-3 mr-1" />
                                    Edit
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleReplyToNotification(notification)} className="h-6 px-2 text-xs text-green-600 hover:text-green-700">
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    Reply
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleDeleteNotification(notification.id)} className="h-6 px-2 text-xs text-red-600 hover:text-red-700">
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowTeacherNotifications(false)} />
                      <div className="absolute right-0 top-full mt-2 w-[calc(100vw-4rem)] sm:w-80 teacher-notification-dropdown bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-border">
                          <h3 className="font-semibold text-foreground">My Notifications & Replies</h3>
                          <Button variant="ghost" size="sm" onClick={() => setShowTeacherNotifications(false)} className="h-8 w-8 p-0 hover:bg-muted">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/50">
                          {teacherNotifications.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">No notifications</div>
                          ) : (
                            teacherNotifications.map((notification) => (
                              <div key={notification.id} className="p-4 border-b border-border hover:bg-muted/50">
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="text-sm font-medium text-foreground">{notification.subject}</h4>
                                  <span className={`px-2 py-1 rounded text-xs ${notification.status === 'unread' ? 'bg-blue-500/20 text-blue-400' : 'bg-muted text-muted-foreground'}`}>
                                    {notification.status === 'unread' ? 'New Reply' : 'Read'}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">To: {notification.toName} • {new Date(notification.createdAt).toLocaleDateString()}</p>
                                <p className="text-xs text-muted-foreground mb-2 break-words whitespace-pre-wrap">{notification.message}</p>
                                {notification.replies && notification.replies.length > 0 && (
                                  <div className="mt-2 p-2 bg-green-500/10 rounded border-l-2 border-green-500">
                                    <p className="text-xs font-medium text-green-400 mb-1">Principal Reply:</p>
                                    <p className="text-xs text-foreground break-words whitespace-pre-wrap">{notification.replies[notification.replies.length - 1].message}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{new Date(notification.replies[notification.replies.length - 1].createdAt).toLocaleDateString()}</p>
                                  </div>
                                )}
                                <div className="flex items-center space-x-2 mt-2">
                                  <Button variant="ghost" size="sm" onClick={() => handleEditNotification(notification)} className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700">
                                    <Edit className="h-3 w-3 mr-1" />
                                    Edit
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleReplyToNotification(notification)} className="h-6 px-2 text-xs text-green-600 hover:text-green-700">
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    Reply
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleDeleteNotification(notification.id)} className="h-6 px-2 text-xs text-red-600 hover:text-red-700">
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </>
                  )
                )}
              </div>

                {/* Notify Students Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowStudentNotificationModal(true)}
                  className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border-purple-400/30 text-white dark:text-white hover:from-purple-500/30 hover:to-purple-600/30 hover:border-purple-300/50 transition-all duration-300 backdrop-blur-sm shadow-lg px-1.5 py-1.5 sm:px-2 sm:py-2 lg:px-3 lg:py-2"
                >
                  <Bell className="h-3 w-3 sm:h-4 sm:w-4 lg:mr-2" />
                  <span className="hidden lg:inline font-medium">Notify Students</span>
                  <span className="hidden sm:inline lg:hidden text-xs font-medium ml-1">Notify</span>
                </Button>

                {/* Manage Sent Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSentNotificationsModal(true)}
                  className="bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 border-indigo-400/30 text-white dark:text-white hover:from-indigo-500/30 hover:to-indigo-600/30 hover:border-indigo-300/50 transition-all duration-300 backdrop-blur-sm shadow-lg relative px-1.5 py-1.5 sm:px-2 sm:py-2 lg:px-3 lg:py-2"
                >
                  <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 lg:mr-2" />
                  <span className="hidden lg:inline font-medium">Manage Sent</span>
                  <span className="hidden sm:inline lg:hidden text-xs font-medium ml-1">Manage</span>
                  {sentStudentNotifications.length > 0 && (
                    <span className="absolute top-0.5 right-0.5 lg:relative lg:top-0 lg:right-0 lg:ml-2 px-1 py-0.5 lg:px-2 lg:py-1 bg-gradient-to-r from-gold to-yellow-500 text-royal text-xs rounded-full font-bold shadow-md">
                      {sentStudentNotifications.length}
                    </span>
                  )}
                </Button>

                {/* Notify Principal Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNotificationModal(true)}
                  className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-400/30 text-white dark:text-white hover:from-blue-500/30 hover:to-blue-600/30 hover:border-blue-300/50 transition-all duration-300 backdrop-blur-sm shadow-lg px-1.5 py-1.5 sm:px-2 sm:py-2 lg:px-3 lg:py-2"
                >
                  <Bell className="h-3 w-3 sm:h-4 sm:w-4 lg:mr-2" />
                  <span className="hidden lg:inline font-medium">Notify Principal</span>
                  <span className="hidden sm:inline lg:hidden text-xs font-medium ml-1">Principal</span>
                </Button>

                {/* Logout Button - Mobile Optimized */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500/20 to-red-600/20 border-red-400/30 text-white dark:text-white hover:from-red-500/30 hover:to-red-600/30 hover:border-red-300/50 transition-all duration-300 backdrop-blur-sm shadow-lg px-1.5 py-1.5 sm:px-2 sm:py-2 lg:px-3 lg:py-2"
                >
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4 lg:mr-2" />
                  <span className="hidden lg:inline font-medium">Logout</span>
                  <span className="hidden sm:inline lg:hidden text-xs font-medium ml-1">Exit</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 lg:py-6">
        {/* Dashboard Overview */}
        {activeSection === "dashboard" && (
          <div className="space-y-3 lg:space-y-6 max-w-7xl mx-auto">
            {/* Quick Stats - Mobile Optimized */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card/95 backdrop-blur-md rounded-lg lg:rounded-xl p-3 lg:p-6 border border-border/50"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-3 space-y-1.5 lg:space-y-0">
                  <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto lg:mx-0">
                    <Users className="h-4 w-4 lg:h-6 lg:w-6 text-blue-400" />
                  </div>
                  <div className="text-center lg:text-left">
                    <p className="text-lg lg:text-2xl font-bold text-foreground">{students.length}</p>
                    <p className="text-[11px] lg:text-sm text-muted-foreground">Total Students</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card/95 backdrop-blur-md rounded-lg lg:rounded-xl p-3 lg:p-6 border border-border/50"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-3 space-y-1.5 lg:space-y-0">
                  <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto lg:mx-0">
                    <BookOpen className="h-4 w-4 lg:h-6 lg:w-6 text-green-400" />
                  </div>
                  <div className="text-center lg:text-left">
                    <p className="text-lg lg:text-2xl font-bold text-foreground">{homework.length}</p>
                    <p className="text-[11px] lg:text-sm text-muted-foreground">Homework Assigned</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card/95 backdrop-blur-md rounded-lg lg:rounded-xl p-3 lg:p-6 border border-border/50"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-3 space-y-1.5 lg:space-y-0">
                  <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto lg:mx-0">
                    <CheckCircle className="h-4 w-4 lg:h-6 lg:w-6 text-purple-400" />
                  </div>
                  <div className="text-center lg:text-left">
                    <p className="text-lg lg:text-2xl font-bold text-foreground">{attendanceRecords.length}</p>
                    <p className="text-[11px] lg:text-sm text-muted-foreground">Attendance Records</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card/95 backdrop-blur-md rounded-lg lg:rounded-xl p-3 lg:p-6 border border-border/50"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-3 space-y-1.5 lg:space-y-0">
                  <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-gold/20 flex items-center justify-center mx-auto lg:mx-0">
                    <Star className="h-4 w-4 lg:h-6 lg:w-6 text-gold" />
                  </div>
                  <div className="text-center lg:text-left">
                    <p className="text-lg lg:text-2xl font-bold text-foreground">{classes.length}</p>
                    <p className="text-[11px] lg:text-sm text-muted-foreground">Classes Available</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions - Fully Responsive */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card/95 backdrop-blur-md rounded-lg lg:rounded-xl p-3 sm:p-4 lg:p-6 border border-gold/40"
            >
              <h2 className="text-base sm:text-lg lg:text-xl font-heading font-bold bg-gradient-to-r from-gold via-yellow-400 to-sky-400 bg-clip-text text-transparent mb-2 sm:mb-3 lg:mb-6">Quick Actions</h2>
              <div className="rounded-md overflow-hidden bg-border/30 sm:bg-transparent">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 sm:gap-3 lg:gap-4">
                {[
                  { title: "Send Homework", desc: "Assign homework with photos", icon: BookOpen, action: () => setActiveSection("homework") },
                  { title: "Take Attendance", desc: "Mark student attendance", icon: CheckCircle, action: () => setActiveSection("attendance") },
                  { title: "Create Student ID", desc: "Register new students", icon: UserPlus, action: () => setActiveSection("createstudent") },
                  { title: "View Students", desc: "Manage student records", icon: Users, action: () => setActiveSection("students") },
                  { title: "Add Remarks", desc: "Give good/bad remarks", icon: MessageSquare, action: () => setActiveSection("remarks") },
                  { title: "Fee Management", desc: "Manage student fees", icon: CreditCard, action: () => setActiveSection("fees") },
                  { title: "Principal Audio", desc: "Listen to Principal messages", icon: Volume2, action: () => {
                    console.log('[TeacherDashboard] Navigating to principal audio with teacher info:', { teacherEmail, teacherName });
                    navigate('/principal-audio');
                  } }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    onClick={item.action}
                    className="p-2 sm:p-2 lg:p-4 rounded-xl bg-gradient-to-br from-sky-500/10 via-royal/80 to-gold/20 border border-gold/40 hover:from-sky-500/20 hover:via-royal hover:to-gold/30 hover:border-gold/70 transition-all duration-300 cursor-pointer min-h-[80px] sm:min-h-[90px] lg:min-h-auto flex shadow-md hover:shadow-xl"
                  >
                    <div className="flex flex-col items-center justify-center text-center space-y-1 sm:space-y-1 lg:space-y-3 w-full">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-gold via-yellow-400 to-sky-400 flex items-center justify-center flex-shrink-0 shadow-md">
                        <item.icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-royal" />
                      </div>
                      <div className="flex-1 min-w-0 w-full">
                        <h3 className="font-semibold text-gold text-[10px] sm:text-xs lg:text-sm leading-tight text-center px-1 break-words hyphens-auto">
                          {item.title}
                        </h3>
                        <p className="text-[8px] sm:text-[10px] lg:text-xs text-sky-100 leading-tight hidden sm:block text-center px-1 break-words mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
                }
              </div>
              </div>
            </motion.div>

            {/* Recent Activity - Responsive */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-card/95 backdrop-blur-md rounded-lg lg:rounded-xl p-4 lg:p-6 border border-border/50"
            >
              <h2 className="text-lg lg:text-xl font-heading font-bold text-foreground mb-4 lg:mb-6">Recent Activity</h2>
              <div className="space-y-3 lg:space-y-4">
                {homework.slice(-3).map((hw, index) => (
                  <div key={hw.id} className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors duration-200">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-4 w-4 lg:h-5 lg:w-5 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm lg:text-base truncate">{hw.title}</p>
                      <p className="text-xs lg:text-sm text-muted-foreground truncate">Class {hw.class}-{hw.section} • Due: {hw.dueDate}</p>
                    </div>
                  </div>
                ))}
                {homework.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No recent homework assigned</p>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
          {[
            { id: "dashboard", label: "Dashboard", icon: BarChart3 },
            { id: "homework", label: "Homework", icon: BookOpen },
            { id: "attendance", label: "Attendance", icon: CheckCircle },
            { id: "students", label: "Students", icon: Users },
            { id: "createstudent", label: "Create Student", icon: UserPlus },
            { id: "remarks", label: "Remarks", icon: MessageSquare },
            { id: "studentreport", label: "Student Report", icon: FileText },
            { id: "fees", label: "Fee Management", icon: CreditCard }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeSection === tab.id ? "default" : "outline"}
              onClick={() => setActiveSection(tab.id as any)}
              size="sm"
              className={`flex items-center space-x-1 sm:space-x-2 h-9 px-2 sm:px-3 ${
                activeSection === tab.id 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-white dark:bg-background text-black dark:text-foreground border-gray-300 dark:border-border hover:bg-gray-100 dark:hover:bg-muted"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline text-xs sm:text-sm">{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Homework Section */}
        {activeSection === "homework" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 sm:space-y-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
              <h2 className="text-lg sm:text-2xl font-heading font-bold text-black dark:text-foreground">Homework Management</h2>
              <Button
                onClick={() => setShowHomeworkModal(true)}
                className="bg-gradient-to-r from-gold to-yellow-500 text-black h-9 sm:h-10 w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="text-sm sm:text-base">Create Homework</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {homework.map((hw) => (
                <motion.div
                  key={hw.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-card/95 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-border/50"
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <h3 className="font-bold text-black dark:text-foreground text-sm sm:text-base">{hw.title}</h3>
                    <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded-full flex-shrink-0">
                      {hw.class}-{hw.section}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">{hw.description}</p>
                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground mb-3 sm:mb-4">
                    <span>Due: {hw.dueDate}</span>
                    <span>{hw.attachments.length} attachments</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2 border-t border-border/30">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditHomework(hw)}
                      className="flex-1 text-xs h-8 sm:h-9"
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteHomework(hw.id)}
                      className="flex-1 text-xs h-8 sm:h-9"
                    >
                      🗑️ Delete
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Other sections would continue here... */}
      </div>

      {/* Homework Modal */}
      {showHomeworkModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-white text-black rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
              <h3 className="text-base sm:text-xl font-heading font-bold text-black dark:text-foreground">
                {editingHomework ? 'Edit Homework' : 'Create Homework'}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => {
                setShowHomeworkModal(false);
                setEditingHomework(null);
              }} className="h-8 w-8 sm:h-9 sm:w-9 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2 text-black dark:text-foreground">Title *</label>
                  <Input
                    value={homeworkForm.title}
                    onChange={(e) => setHomeworkForm({...homeworkForm, title: e.target.value})}
                    placeholder="Enter homework title"
                    className="h-9 sm:h-10 text-sm text-black dark:text-black placeholder:text-gray-500 dark:placeholder:text-gray-400 bg-white dark:bg-white border border-gray-300 dark:border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2 text-black dark:text-foreground">Description *</label>
                  <textarea
                    value={homeworkForm.description}
                    onChange={(e) => setHomeworkForm({...homeworkForm, description: e.target.value})}
                    placeholder="Enter homework description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-300 rounded-lg resize-none text-sm text-black dark:text-black placeholder:text-gray-500 dark:placeholder:text-gray-400 bg-white dark:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2 text-black dark:text-foreground">Class *</label>
                    <select
                      value={homeworkForm.class}
                      onChange={(e) => setHomeworkForm({...homeworkForm, class: e.target.value})}
                      className="w-full p-2 sm:p-3 rounded-lg bg-white dark:bg-white text-sm text-black dark:text-black border border-gray-300 dark:border-gray-300"
                    >
                      {classes.map(cls => (
                        <option key={cls} value={cls}>Class {cls}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2 text-black dark:text-foreground">Section *</label>
                    <select
                      value={homeworkForm.section}
                      onChange={(e) => setHomeworkForm({...homeworkForm, section: e.target.value})}
                      className="w-full p-2 sm:p-3 rounded-lg bg-white dark:bg-white text-sm text-black dark:text-black border border-gray-300 dark:border-gray-300"
                    >
                      {sections.map(sec => (
                        <option key={sec} value={sec}>Section {sec}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2 text-black dark:text-foreground">Due Date *</label>
                  <Input
                    type="date"
                    value={homeworkForm.dueDate}
                    onChange={(e) => setHomeworkForm({...homeworkForm, dueDate: e.target.value})}
                    className="h-9 sm:h-10 text-sm text-black dark:text-black placeholder:text-gray-500 dark:placeholder:text-gray-400 bg-white dark:bg-white border border-gray-300 dark:border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2 text-black dark:text-foreground">Attach Photos</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e.target.files, 'homework')}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-9 sm:h-10 text-sm bg-gradient-to-r from-sky-400 via-sky-500 to-gold text-white font-medium border-none shadow-md hover:from-sky-500 hover:via-sky-600 hover:to-yellow-400"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Upload Photos ({homeworkForm.attachments.length})
                  </Button>
                </div>

                {homeworkForm.attachments.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {homeworkForm.attachments.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Attachment ${index + 1}`}
                        className="w-full h-16 sm:h-20 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 sm:space-x-0 p-4 sm:p-6 border-t border-border">
              <Button variant="outline" onClick={() => setShowHomeworkModal(false)} className="h-9 sm:h-10 text-sm">
                Cancel
              </Button>
              <Button
                onClick={handleCreateHomework}
                className="bg-gradient-to-r from-gold to-yellow-500 text-black h-9 sm:h-10 text-sm"
              >
                <Send className="h-4 w-4 mr-2" />
                {editingHomework ? 'Update Homework' : 'Send Homework'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Student Section */}
      {activeSection === "createstudent" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 sm:mt-8"
        >
          <div className="bg-card/95 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-border/50">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="text-base sm:text-xl font-heading font-bold text-foreground">Create Student ID</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">Register new students and generate login credentials</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setActiveSection("dashboard")}
                className="text-muted-foreground hover:text-foreground h-8 w-8 sm:h-9 sm:w-9 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Student Form */}
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">Full Name *</label>
                  <Input
                    value={studentForm.fullName}
                    onChange={(e) => setStudentForm({...studentForm, fullName: e.target.value})}
                    placeholder="Enter student's full name"
                    className="w-full h-9 sm:h-10 text-sm text-black dark:text-foreground placeholder:text-gray-500 dark:placeholder:text-gray-400 bg-white dark:bg-background border-gray-300 dark:border-border"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">Email Address *</label>
                  <Input
                    type="email"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
                    placeholder="Enter student's email"
                    className="w-full h-9 sm:h-10 text-sm text-black dark:text-foreground placeholder:text-gray-500 dark:placeholder:text-gray-400 bg-white dark:bg-background border-gray-300 dark:border-border"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">Roll Number *</label>
                  <Input
                    value={studentForm.rollNumber}
                    onChange={(e) => setStudentForm({...studentForm, rollNumber: e.target.value})}
                    placeholder="Enter roll number"
                    className="w-full h-9 sm:h-10 text-sm text-black dark:text-foreground placeholder:text-gray-500 dark:placeholder:text-gray-400 bg-white dark:bg-background border-gray-300 dark:border-border"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">Parent Email</label>
                  <Input
                    type="email"
                    value={studentForm.parentEmail}
                    onChange={(e) => setStudentForm({...studentForm, parentEmail: e.target.value})}
                    placeholder="Enter parent's email"
                    className="w-full h-9 sm:h-10 text-sm text-black dark:text-foreground placeholder:text-gray-500 dark:placeholder:text-gray-400 bg-white dark:bg-background border-gray-300 dark:border-border"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">Phone Number</label>
                  <Input
                    value={studentForm.phone}
                    onChange={(e) => setStudentForm({...studentForm, phone: e.target.value})}
                    placeholder="Enter phone number"
                    className="w-full h-9 sm:h-10 text-sm"
                  />
                </div>
              </div>

              {/* Class & Section */}
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">Class *</label>
                    <select
                      value={studentForm.class}
                      onChange={(e) => setStudentForm({...studentForm, class: e.target.value})}
                      className="w-full p-2 sm:p-3 border border-border rounded-lg bg-background text-sm"
                    >
                      {classes.map(cls => (
                        <option key={cls} value={cls}>Class {cls}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">Section *</label>
                    <select
                      value={studentForm.section}
                      onChange={(e) => setStudentForm({...studentForm, section: e.target.value})}
                      className="w-full p-2 sm:p-3 border border-border rounded-lg bg-background text-sm"
                    >
                      {sections.map(sec => (
                        <option key={sec} value={sec}>Section {sec}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Password Information */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lock className="h-4 w-4 text-blue-400" />
                    <h4 className="text-xs sm:text-sm font-semibold text-blue-400">Password Information</h4>
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    Student passwords are automatically generated using the format: firstname123
                    (e.g., john123). Login credentials will be displayed after account creation.
                  </p>
                </div>

                {/* Create Button */}
                <Button
                  onClick={handleCreateStudent}
                  className="w-full bg-gradient-to-r from-gold to-yellow-500 text-black font-semibold py-3 h-10 sm:h-11 text-sm"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Student Account
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* View Students Section */}
      {activeSection === "students" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 sm:mt-8"
        >
          <div className="bg-card/95 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-border/50">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="text-base sm:text-xl font-heading font-bold text-foreground">View Students</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">Manage student records and information</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setActiveSection("dashboard")}
                className="text-muted-foreground hover:text-foreground h-8 w-8 sm:h-9 sm:w-9 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Class and Section Selector */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full p-2 sm:p-3 border border-border rounded-lg bg-background text-sm"
                >
                  {classes.map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">Section</label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full p-2 sm:p-3 border border-border rounded-lg bg-background text-sm"
                >
                  {sections.map(sec => (
                    <option key={sec} value={sec}>Section {sec}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Students List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {getClassStudents().length > 0 ? (
                getClassStudents().map((student) => (
                  <div key={student.id} className="bg-muted/20 rounded-lg p-3 sm:p-4 border border-border/30">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-black font-semibold text-xs sm:text-sm">
                          {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{student.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">Roll: {student.rollNumber}</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs sm:text-sm mb-2 sm:mb-3">
                      <p className="truncate"><span className="text-muted-foreground">Email:</span> {student.email}</p>
                      <p><span className="text-muted-foreground">Class:</span> {student.class}-{student.section}</p>
                      <p><span className="text-muted-foreground">Phone:</span> {student.phone}</p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate min-w-0"><span className="text-muted-foreground">ID:</span> {student.id}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(student.id);
                            alert('Student ID copied to clipboard!');
                          }}
                          title="Copy Student ID"
                          className="h-6 sm:h-7 px-2 text-[10px] sm:text-xs flex-shrink-0"
                        >
                          Copy ID
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 text-[10px] sm:text-xs rounded-full ${
                          student.status === 'banned' 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/30' 
                            : 'bg-green-500/10 text-green-400 border border-green-500/30'
                        }`}>
                          {student.status === 'banned' ? 'Banned' : 'Active'}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-1 flex-wrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updatedStudents = students.map(s => 
                            s.id === student.id 
                              ? { ...s, status: (s.status === 'banned' ? 'active' : 'banned') as 'active' | 'banned' }
                              : s
                          );
                          setStudents(updatedStudents);
                          localStorage.setItem('royal-academy-students', JSON.stringify(updatedStudents));

                          // Also update auth students
                          const authStudents = JSON.parse(localStorage.getItem('royal-academy-auth-students') || '[]');
                          const updatedAuthStudents = authStudents.map((s: any) => 
                            s.studentId === student.id 
                              ? { ...s, status: s.status === 'banned' ? 'active' : 'banned' }
                              : s
                          );
                          localStorage.setItem('royal-academy-auth-students', JSON.stringify(updatedAuthStudents));

                          alert(`Student ${student.status === 'banned' ? 'unbanned' : 'banned'} successfully!`);
                        }}
                        title={student.status === 'banned' ? 'Unban Student' : 'Ban Student'}
                        className={`h-6 px-2 text-xs ${
                          student.status === 'banned' 
                            ? 'text-green-600 hover:text-green-700' 
                            : 'text-red-600 hover:text-red-700'
                        }`}
                      >
                        {student.status === 'banned' ? 'Unban' : 'Ban'}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setStudentForm({
                            fullName: student.name,
                            email: student.email,
                            rollNumber: student.rollNumber,
                            class: student.class,
                            section: student.section,
                            parentEmail: student.parentEmail || '',
                            phone: student.phone || '',
                            image: student.image || ''
                          });
                          setEditingStudentId(student.id);
                          setActiveSection('createstudent');
                        }}
                        title="Edit Student"
                        className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${student.name}? This action cannot be undone.`)) {
                            const updatedStudents = students.filter(s => s.id !== student.id);
                            setStudents(updatedStudents);
                            localStorage.setItem('royal-academy-students', JSON.stringify(updatedStudents));

                            // Also remove from auth students
                            const authStudents = JSON.parse(localStorage.getItem('royal-academy-auth-students') || '[]');
                            const updatedAuthStudents = authStudents.filter((s: any) => s.studentId !== student.id);
                            localStorage.setItem('royal-academy-auth-students', JSON.stringify(updatedAuthStudents));

                            alert(`Student ${student.name} deleted successfully!`);
                          }
                        }}
                        title="Delete Student"
                        className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-muted-foreground py-8">
                  No students found in Class {selectedClass}-{selectedSection}
                </div>
              )}
            </div>

            {/* Add Student Button */}
            <div className="text-center mt-6">
              <Button
                onClick={() => setActiveSection("createstudent")}
                className="bg-gradient-to-r from-gold to-yellow-500 text-black"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add New Student
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Enhanced Attendance Section */}
      {activeSection === "attendance" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-3 sm:mt-8"
        >
          <div className="bg-card/95 backdrop-blur-md rounded-xl p-3 sm:p-6 border border-border/50">
            <div className="flex items-center justify-between mb-3 sm:mb-6">
              <div className="flex-1 min-w-0 pr-2">
                <h2 className="text-sm sm:text-xl font-heading font-bold text-foreground">Attendance Management</h2>
                <p className="text-xs text-muted-foreground hidden sm:block">Mark attendance and manage holidays</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setActiveSection("dashboard")}
                className="text-muted-foreground hover:text-foreground h-7 w-7 sm:h-9 sm:w-9 p-0 flex-shrink-0"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-1 mb-3 sm:mb-6 border-b border-border/50 pb-2">
              <Button
                variant={attendanceView === 'today' ? 'default' : 'ghost'}
                onClick={() => setAttendanceView('today')}
                className="text-xs h-7 px-2 sm:text-sm sm:h-9 sm:px-3"
              >
                Today's Attendance
              </Button>
              <Button
                variant={attendanceView === 'editday' ? 'default' : 'ghost'}
                onClick={() => setAttendanceView('editday')}
                className="text-xs h-7 px-2 sm:text-sm sm:h-9 sm:px-3"
              >
                <span className="hidden sm:inline">Edit Any Day</span>
                <span className="sm:hidden">Edit Day</span>
              </Button>
              <Button
                variant={attendanceView === 'calendar' ? 'default' : 'ghost'}
                onClick={() => setAttendanceView('calendar')}
                className="text-xs h-7 px-2 sm:text-sm sm:h-9 sm:px-3"
              >
                <span className="hidden sm:inline">Attendance Calendar</span>
                <span className="sm:hidden">Calendar</span>
              </Button>
              <Button
                variant={attendanceView === 'holidays' ? 'default' : 'ghost'}
                onClick={() => setAttendanceView('holidays')}
                className="text-xs h-7 px-2 sm:text-sm sm:h-9 sm:px-3"
              >
                <span className="hidden sm:inline">Manage Holidays</span>
                <span className="sm:hidden">Holidays</span>
              </Button>
            </div>

            {/* Class and Section Selector */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full p-2 sm:p-3 border border-border rounded-lg bg-background text-sm"
                >
                  {classes.map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Section</label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full p-2 sm:p-3 border border-border rounded-lg bg-background text-sm"
                >
                  {sections.map(sec => (
                    <option key={sec} value={sec}>Section {sec}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Today's Attendance */}
            {attendanceView === 'today' && (
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Date: {new Date().toLocaleDateString()} ({new Date().toLocaleDateString('en-US', { weekday: 'long' })})
                  </p>
                  {new Date().getDay() === 0 && (
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 self-start sm:self-auto">
                      Sunday - Holiday
                    </span>
                  )}
                </div>

                {getClassStudents().length > 0 ? (
                  <>
                    {getClassStudents().map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-2 sm:p-4 bg-muted/20 rounded-lg border border-border/30 gap-2">
                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-black font-semibold text-xs">
                              {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-foreground text-sm sm:text-base truncate">{student.name}</h4>
                            <p className="text-xs text-muted-foreground">Roll: {student.rollNumber}</p>
                          </div>
                        </div>
                        <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
                          <Button
                            size="sm"
                            onClick={() => setCurrentAttendance(prev => ({ ...prev, [student.id]: 'present' }))}
                            className={`text-xs px-2 py-1 h-7 sm:h-8 sm:px-3 ${
                              currentAttendance[student.id] === 'present' 
                                ? 'bg-green-600 hover:bg-green-700 text-white' 
                                : 'bg-green-100 hover:bg-green-200 text-green-800 border border-green-300'
                            }`}
                          >
                            <span className="hidden sm:inline">✓ Present</span>
                            <span className="sm:hidden">✓</span>
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setCurrentAttendance(prev => ({ ...prev, [student.id]: 'absent' }))}
                            className={`text-xs px-2 py-1 h-7 sm:h-8 sm:px-3 ${
                              currentAttendance[student.id] === 'absent' 
                                ? 'bg-red-600 hover:bg-red-700 text-white' 
                                : 'bg-red-100 hover:bg-red-200 text-red-800 border border-red-300'
                            }`}
                          >
                            <span className="hidden sm:inline">✗ Absent</span>
                            <span className="sm:hidden">✗</span>
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setCurrentAttendance(prev => ({ ...prev, [student.id]: 'late' }))}
                            className={`text-xs px-2 py-1 h-7 sm:h-8 sm:px-3 ${
                              currentAttendance[student.id] === 'late' 
                                ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                                : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border border-yellow-300'
                            }`}
                          >
                            <span className="hidden sm:inline">⏰ Late</span>
                            <span className="sm:hidden">⏰</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="text-center mt-4 sm:mt-6">
                      <Button
                        onClick={handleTakeAttendance}
                        className="bg-gradient-to-r from-gold to-yellow-500 text-black w-full sm:w-auto h-9 sm:h-10"
                      >
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Submit Attendance
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground py-6 sm:py-8 text-sm">
                    No students found in Class {selectedClass}-{selectedSection}
                  </div>
                )}
              </div>
            )}

            {/* Edit Any Day Attendance */}
            {attendanceView === 'editday' && (
              <div className="space-y-4 sm:space-y-6">
                {/* Date Selector */}
                <div className="bg-muted/20 rounded-lg p-3 sm:p-4 border border-border/30">
                  <h4 className="font-semibold mb-2 sm:mb-3 text-foreground text-sm sm:text-base">Select Date to Edit:</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <input
                      type="date"
                      value={selectedEditDate}
                      onChange={(e) => setSelectedEditDate(e.target.value)}
                      className="p-2 sm:p-3 border border-border rounded-lg bg-background text-sm"
                    />
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {new Date(selectedEditDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>

                {/* Student List for Selected Date */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
                    <h4 className="font-semibold text-foreground text-sm sm:text-base">
                      Edit Attendance for {new Date(selectedEditDate).toLocaleDateString()}
                    </h4>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      Class {selectedClass}-{selectedSection}
                    </div>
                  </div>

                  {getClassStudents().length > 0 ? (
                    <>
                      {getClassStudents().map((student) => {
                        // Get existing attendance for this date
                        const existingAttendance = student.attendance?.find(a => a.date === selectedEditDate);
                        const currentStatus = existingAttendance?.status || 'not-marked';

                        return (
                          <div key={student.id} className="flex items-center justify-between p-2 sm:p-4 bg-muted/20 rounded-lg border border-border/30 gap-2">
                            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center flex-shrink-0">
                                <span className="text-black font-semibold text-xs">
                                  {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-medium text-foreground text-sm sm:text-base truncate">{student.name}</h4>
                                <p className="text-xs text-muted-foreground">Roll: {student.rollNumber}</p>
                                {existingAttendance && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Current: <span className={`font-medium ${
                                      currentStatus === 'present' ? 'text-green-600' :
                                      currentStatus === 'absent' ? 'text-red-600' :
                                      currentStatus === 'late' ? 'text-yellow-600' : 'text-gray-600'
                                    }`}>
                                      {currentStatus === 'not-marked' ? 'Not Marked' : currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 sm:space-x-2 flex-shrink-0">
                              <Button
                                size="sm"
                                onClick={() => handleEditDayAttendance(student.id, 'present')}
                                className={`text-xs px-2 py-1 h-7 sm:h-8 sm:px-3 ${
                                  currentStatus === 'present' 
                                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                                    : 'bg-green-100 hover:bg-green-200 text-green-800 border border-green-300'
                                }`}
                              >
                                <span className="hidden sm:inline">✓ Present</span>
                                <span className="sm:hidden">✓</span>
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleEditDayAttendance(student.id, 'absent')}
                                className={`text-xs px-2 py-1 h-7 sm:h-8 sm:px-3 ${
                                  currentStatus === 'absent' 
                                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                                    : 'bg-red-100 hover:bg-red-200 text-red-800 border border-red-300'
                                }`}
                              >
                                <span className="hidden sm:inline">✗ Absent</span>
                                <span className="sm:hidden">✗</span>
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleEditDayAttendance(student.id, 'late')}
                                className={`text-xs px-2 py-1 h-7 sm:h-8 sm:px-3 ${
                                  currentStatus === 'late' 
                                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                                    : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border border-yellow-300'
                                }`}
                              >
                                <span className="hidden sm:inline">⏰ Late</span>
                                <span className="sm:hidden">⏰</span>
                              </Button>
                              {existingAttendance && (
                                <Button
                                  size="sm"
                                  onClick={() => handleEditDayAttendance(student.id, 'remove')}
                                  className="text-xs px-2 py-1 h-7 sm:h-8 sm:px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300"
                                >
                                  <span className="hidden sm:inline">✕ Remove</span>
                                  <span className="sm:hidden">✕</span>
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground py-6 sm:py-8 text-sm">
                      No students found in Class {selectedClass}-{selectedSection}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Attendance Calendar */}
            {attendanceView === 'calendar' && (
              <div className="space-y-3 sm:space-y-4">
                <div className="text-center mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">Attendance Calendar - {new Date().getFullYear()}</h3>
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded"></div>
                      <span>Present</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full"></div>
                      <span>Absent</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-gray-400"></div>
                      <span className="ml-2">Not Updated</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded"></div>
                      <span>Holiday</span>
                    </div>
                  </div>
                </div>

                {getClassStudents().length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left py-2 pr-2 sm:pr-4 sticky left-0 bg-card text-xs sm:text-sm">Student</th>
                          {Array.from({ length: 30 }, (_, i) => (
                            <th key={i} className="text-center py-2 px-1 min-w-[20px] sm:min-w-[24px] text-xs">
                              {i + 1}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {getClassStudents().map((student) => (
                          <tr key={student.id} className="border-b border-border/30">
                            <td className="py-2 pr-2 sm:pr-4 font-medium sticky left-0 bg-card text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">
                              <span className="block truncate">{student.name}</span>
                            </td>
                            {Array.from({ length: 30 }, (_, dayIndex) => {
                              const date = new Date();
                              date.setDate(dayIndex + 1);
                              const dateStr = date.toISOString().split('T')[0];
                              const isHoliday = date.getDay() === 0 || holidays.includes(dateStr);
                              const attendance = student.attendance?.find(a => a.date === dateStr);

                              return (
                                <td key={dayIndex} className="text-center py-2 px-1">
                                  {isHoliday ? (
                                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded mx-auto" title="Holiday"></div>
                                  ) : attendance ? (
                                    attendance.status === 'present' ? (
                                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded mx-auto" title="Present"></div>
                                    ) : attendance.status === 'absent' ? (
                                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full mx-auto" title="Absent"></div>
                                    ) : (
                                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded mx-auto" title="Late"></div>
                                    )
                                  ) : (
                                    <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-gray-400 mx-auto" title="Not Updated"></div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-6 sm:py-8 text-sm">
                    No students found in Class {selectedClass}-{selectedSection}
                  </div>
                )}
              </div>
            )}

            {/* Holiday Management */}
            {attendanceView === 'holidays' && (
              <div className="space-y-3 sm:space-y-4">
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Manage Holidays</h3>

                  {/* Add Holiday */}
                  <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    <input
                      type="date"
                      value={newHoliday}
                      onChange={(e) => setNewHoliday(e.target.value)}
                      className="flex-1 p-2 sm:p-3 border border-border rounded-lg bg-background text-sm"
                    />
                    <Button
                      onClick={async () => {
                        if (newHoliday && !holidays.includes(newHoliday)) {
                          const updatedHolidays = [...holidays, newHoliday];
                          setHolidays(updatedHolidays);
                          // Save to localStorage first
                          localStorage.setItem('royal-academy-holidays', JSON.stringify(updatedHolidays));
                          // Then sync to Supabase for real-time updates
                          await setSupabaseData('royal-academy-holidays', updatedHolidays);
                          setNewHoliday('');
                          alert('Holiday added successfully!');
                        }
                      }}
                      className="bg-gradient-to-r from-gold to-yellow-500 text-black h-9 sm:h-10 w-full sm:w-auto text-sm"
                    >
                      Add Holiday
                    </Button>
                  </div>

                  {/* Holiday List */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm sm:text-base">Current Holidays:</h4>
                    {holidays.length > 0 ? (
                      <div className="grid gap-2">
                        {holidays.map((holiday, index) => (
                          <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-muted/20 rounded-lg border border-border/30 gap-2">
                            <span className="text-xs sm:text-sm flex-1 min-w-0 truncate">
                              {new Date(holiday).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={async () => {
                                const updatedHolidays = holidays.filter((_, i) => i !== index);
                                setHolidays(updatedHolidays);
                                // Save to localStorage first
                                localStorage.setItem('royal-academy-holidays', JSON.stringify(updatedHolidays));
                                // Then sync to Supabase for real-time updates
                                await setSupabaseData('royal-academy-holidays', updatedHolidays);
                                alert('Holiday removed successfully!');
                              }}
                              className="text-xs h-7 px-2 sm:h-8 sm:px-3 flex-shrink-0"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-xs sm:text-sm">No holidays added yet.</p>
                    )}
                  </div>

                  {/* Default Sundays Note */}
                  <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <p className="text-xs sm:text-sm text-blue-400">
                      📅 Note: All Sundays are automatically marked as holidays and will appear in blue on the calendar.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Remarks Section */}
      {activeSection === "remarks" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 sm:mt-8"
        >
          <div className="bg-card/95 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-border/50">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex-1 min-w-0 pr-2">
                <h2 className="text-base sm:text-xl font-heading font-bold text-foreground">
                  {editingRemark ? 'Edit Remark | रिमार्क एडिट करें' : 'Add Remarks | रिमार्क जोड़ें'}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {editingRemark 
                    ? 'Modify the selected remark | चुने गए रिमार्क को बदलें'
                    : 'Give positive or constructive feedback to students | छात्रों को सकारात्मक या रचनात्मक फीडबैक दें'
                  }
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setActiveSection("dashboard")}
                className="text-muted-foreground hover:text-foreground h-8 w-8 sm:h-9 sm:w-9 p-0 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Remarks Form */}
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Class</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg bg-background"
                  >
                    {classes.map(cls => (
                      <option key={cls} value={cls}>Class {cls}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Section</label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg bg-background"
                  >
                    {sections.map(sec => (
                      <option key={sec} value={sec}>Section {sec}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Search by Roll Number (Optional)</label>
                <input
                  type="text"
                  placeholder="Enter roll number to filter student..."
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                  onChange={(e) => {
                    const rollNum = e.target.value.trim();
                    if (rollNum) {
                      const filteredStudent = getClassStudents().find(s => s.rollNumber.toString() === rollNum);
                      if (filteredStudent) {
                        setRemarksForm({...remarksForm, studentId: filteredStudent.id});
                      }
                    }
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Select Student</label>
                <select
                  value={remarksForm.studentId}
                  onChange={(e) => setRemarksForm({...remarksForm, studentId: e.target.value})}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                >
                  <option value="">Choose a student...</option>
                  {getClassStudents().map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} (Roll: {student.rollNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Remark Type</label>
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant={remarksForm.type === 'good' ? 'default' : 'outline'}
                    onClick={() => setRemarksForm({...remarksForm, type: 'good'})}
                    className="flex items-center space-x-2"
                  >
                    <Star className="h-4 w-4" />
                    <span>Positive</span>
                  </Button>
                  <Button
                    type="button"
                    variant={remarksForm.type === 'bad' ? 'destructive' : 'outline'}
                    onClick={() => setRemarksForm({...remarksForm, type: 'bad'})}
                    className="flex items-center space-x-2"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span>Needs Improvement</span>
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <Input
                  value={remarksForm.subject}
                  onChange={(e) => setRemarksForm({...remarksForm, subject: e.target.value})}
                  placeholder="e.g., Mathematics, Behavior, Homework"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  value={remarksForm.message}
                  onChange={(e) => setRemarksForm({...remarksForm, message: e.target.value})}
                  placeholder="Enter your remark or feedback..."
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Attach Images (Optional) - Max 6 Photos</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      // Check if adding these files would exceed the limit
                      if (remarksForm.images.length + files.length > 6) {
                        alert('Maximum 6 images allowed per remark');
                        return;
                      }

                      // Convert all files to base64
                      Promise.all(files.map(file => convertToBase64(file)))
                        .then(base64Images => {
                          setRemarksForm({
                            ...remarksForm, 
                            images: [...remarksForm.images, ...base64Images as string[]]
                          });
                        });
                    }
                  }}
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                />

                {/* Image Preview Grid */}
                {remarksForm.images.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Attached Images ({remarksForm.images.length}/6)</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setRemarksForm({...remarksForm, images: []})}
                      >
                        Remove All
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {remarksForm.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Remark attachment ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-border cursor-pointer"
                            onClick={() => {
                              setSelectedImage({
                                src: image,
                                title: `Remark Image ${index + 1}`
                              });
                              setShowImageModal(true);
                            }}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const newImages = remarksForm.images.filter((_, i) => i !== index);
                              setRemarksForm({...remarksForm, images: newImages});
                            }}
                            className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center">
                <Button
                  onClick={handleAddRemarks}
                  className="bg-gradient-to-r from-gold to-yellow-500 text-black"
                  disabled={!remarksForm.studentId || !remarksForm.message}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {editingRemark ? 'Update Remark' : 'Add Remark'}
                </Button>
              </div>
            </div>

            {/* Existing Remarks Display */}
            {remarksForm.studentId && (() => {
              const currentStudent = students.find(s => s.id === remarksForm.studentId);
              return currentStudent && currentStudent.remarks && currentStudent.remarks.length > 0;
            })() && (
              <div className="mt-8 border-t border-border/30 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Existing Remarks for {students.find(s => s.id === remarksForm.studentId)?.name}</h3>
                  <Button
                    onClick={() => {
                      // Clear form for new remark
                      setEditingRemark(null);
                      setEditingRemarkIndex(-1);
                      setRemarksForm({
                        ...remarksForm,
                        type: "good",
                        message: "",
                        subject: "",
                        images: []
                      });
                    }}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Remark
                  </Button>
                </div>

                {/* Instructions */}
                <div className="mb-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <h4 className="font-semibold text-blue-400 mb-2">📝 How to Edit Remarks | रिमार्क कैसे एडिट करें</h4>
                  <div className="text-sm text-blue-100 space-y-1">
                    <p><strong>English:</strong> Click the "✏️ Edit" button on any remark to modify it. Click "🗑️ Delete" to remove it permanently.</p>
                    <p><strong>हिंदी:</strong> किसी भी रिमार्क को बदलने के लिए "✏️ Edit" बटन पर क्लिक करें। इसे हमेशा के लिए हटाने के लिए "🗑️ Delete" पर क्लिक करें।</p>
                    <p><strong>English:</strong> You can add images to remarks and edit them later. Changes are saved automatically.</p>
                    <p><strong>हिंदी:</strong> आप रिमार्क में इमेज जोड़ सकते हैं और बाद में उन्हें एडिट कर सकते हैं। बदलाव अपने आप सेव हो जाते हैं।</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {students.find(s => s.id === remarksForm.studentId)?.remarks?.map((remark: any, index: number) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        remark.type === 'good' 
                          ? 'bg-green-500/10 border-green-500/30' 
                          : 'bg-red-500/10 border-red-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {remark.type === 'good' ? (
                            <Star className="h-4 w-4 text-green-400 fill-green-400" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-400" />
                          )}
                          <span className={`font-medium text-sm ${
                            remark.type === 'good' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {remark.type === 'good' ? 'Good Remark' : 'Area to Improve'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(remark.date).toLocaleDateString()}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditRemark(remark, index, remarksForm.studentId)}
                            className="h-6 px-2 text-xs"
                          >
                            ✏️ Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteRemark(index, remarksForm.studentId)}
                            className="h-6 px-2 text-xs"
                          >
                            🗑️ Delete
                          </Button>
                        </div>
                      </div>

                      <p className={`text-sm mb-2 ${
                        remark.type === 'good' ? 'text-green-100' : 'text-red-100'
                      }`}>
                        {remark.message}
                      </p>

                      {/* Multiple Images Display */}
                      {((remark.images && remark.images.length > 0) || remark.image) && (
                        <div className="mb-2">
                          <div className="grid grid-cols-3 gap-2">
                            {/* Handle both new images array and old single image for backward compatibility */}
                            {(remark.images || (remark.image ? [remark.image] : [])).map((image: string, imgIndex: number) => (
                              <div key={imgIndex} className="relative group">
                                <img
                                  src={image}
                                  alt={`Remark attachment ${imgIndex + 1}`}
                                  className="w-full h-24 object-cover rounded-lg border border-border cursor-pointer"
                                  onClick={() => {
                                    setSelectedImage({
                                      src: image,
                                      title: `Remark Image ${imgIndex + 1} - ${remark.subject || 'General'}`
                                    });
                                    setShowImageModal(true);
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                          {(remark.images?.length > 0 || remark.image) && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {remark.images?.length || 1} image{(remark.images?.length || 1) > 1 ? 's' : ''} attached
                            </div>
                          )}
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground">
                        Subject: {remark.subject || 'General'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Student Report Section */}
      {activeSection === "studentreport" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 sm:mt-8"
        >
          <div className="bg-card/95 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-border/50">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex-1 min-w-0 pr-2">
                <h2 className="text-base sm:text-xl font-heading font-bold text-foreground">Student Report</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">Generate and view detailed student performance reports</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setActiveSection("dashboard")}
                className="text-muted-foreground hover:text-foreground h-8 w-8 sm:h-9 sm:w-9 p-0 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Class and Section Selection */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full p-2 sm:p-3 border border-border rounded-lg bg-background text-sm"
                >
                  {classes.map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Section</label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                >
                  {sections.map(sec => (
                    <option key={sec} value={sec}>Section {sec}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Student Report Cards */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                <h3 className="text-sm sm:text-lg font-semibold text-foreground">
                  Class {selectedClass}-{selectedSection} Student Reports
                </h3>
                <Button
                  variant="outline"
                  className="flex items-center space-x-2 h-8 sm:h-9 text-xs sm:text-sm w-full sm:w-auto"
                  onClick={() => {
                    const classStudents = getClassStudents();
                    if (classStudents.length === 0) {
                      alert('No students found in this class');
                      return;
                    }
                    alert(`Generating reports for ${classStudents.length} students...`);
                  }}
                >
                  <Download className="h-4 w-4" />
                  <span>Export All Reports</span>
                </Button>
              </div>

              {getClassStudents().length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {getClassStudents().map((student) => {
                    const attendanceRate = student.attendance.length > 0 
                      ? Math.round((student.attendance.filter(a => a.status === 'present').length / student.attendance.length) * 100)
                      : 0;
                    const goodRemarks = student.remarks.filter(r => r.type === 'good').length;
                    const badRemarks = student.remarks.filter(r => r.type === 'bad').length;

                    return (
                      <motion.div
                        key={student.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-muted/20 rounded-lg p-4 border border-border/30 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-royal to-gold flex items-center justify-center text-white font-bold">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{student.name}</h4>
                            <p className="text-sm text-muted-foreground">Roll: {student.rollNumber}</p>
                          </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Attendance</span>
                            <span className={`text-sm font-medium ${
                              attendanceRate >= 90 ? 'text-green-500' :
                              attendanceRate >= 75 ? 'text-yellow-500' : 'text-red-500'
                            }`}>
                              {attendanceRate}%
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Good Remarks</span>
                            <span className="text-sm font-medium text-green-500">{goodRemarks}</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Areas to Improve</span>
                            <span className="text-sm font-medium text-red-500">{badRemarks}</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Overall Grade</span>
                            <span className={`text-sm font-bold px-2 py-1 rounded ${
                              attendanceRate >= 90 && goodRemarks >= badRemarks ? 'bg-green-100 text-green-800' :
                              attendanceRate >= 75 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {attendanceRate >= 90 && goodRemarks >= badRemarks ? 'A' :
                               attendanceRate >= 75 ? 'B' : 'C'}
                            </span>
                          </div>
                        </div>

                        {/* Recent Remarks */}
                        {student.remarks.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-border/30">
                            <h5 className="text-xs font-medium text-muted-foreground mb-2">Recent Remarks</h5>
                            <div className="space-y-1">
                              {student.remarks.slice(-2).map((remark, idx) => (
                                <div key={idx} className="text-xs p-2 rounded bg-muted/30">
                                  <div className="flex items-center space-x-1 mb-1">
                                    {remark.type === 'good' ? (
                                      <Star className="h-3 w-3 text-green-500" />
                                    ) : (
                                      <AlertCircle className="h-3 w-3 text-red-500" />
                                    )}
                                    <span className="font-medium">{remark.subject}</span>
                                  </div>
                                  <p className="text-muted-foreground">{remark.message}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-4 flex flex-col gap-2">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs"
                              onClick={() => {
                                setSelectedStudentForReport(student);
                                setShowReportModal(true);
                              }}
                            >
                              <Upload className="h-3 w-3 mr-1" />
                              Send Report
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs"
                              onClick={() => {
                                const studentReportsForThisStudent = studentReports.filter(r => r.studentId === student.id);
                                if (studentReportsForThisStudent.length === 0) {
                                  alert('No reports sent to this student yet');
                                } else {
                                  setSelectedStudentForViewReports(student);
                                  setShowViewSentReportsModal(true);
                                }
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View Sent
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="w-full text-xs"
                            onClick={() => {
                              const studentReportsForThisStudent = studentReports.filter(r => r.studentId === student.id);
                              if (studentReportsForThisStudent.length === 0) {
                                alert('No reports sent to this student yet');
                              } else {
                                setSelectedStudentForViewReports(student);
                                setShowViewSentReportsModal(true);
                              }
                            }}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete Report
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No students found in Class {selectedClass}-{selectedSection}</p>
                  <p className="text-sm">Add students to generate reports</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Fee Management Section */}
      {activeSection === "fees" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 sm:space-y-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <h2 className="text-lg sm:text-2xl font-heading font-bold text-foreground">Fee Management</h2>
            <Button
              onClick={() => setShowPaymentModal(true)}
              className="bg-gradient-to-r from-gold to-yellow-500 text-black h-9 sm:h-10 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="text-sm sm:text-base">Create Payment Request</span>
            </Button>
          </div>

          {/* Fee Overview Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-card/95 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-border/50">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    {feeRecords.filter(f => f.status === 'paid').length}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Paid Fees</p>
                </div>
              </div>
            </div>

            <div className="bg-card/95 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-border/50">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    {feeRecords.filter(f => f.status === 'pending').length}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Pending Fees</p>
                </div>
              </div>
            </div>

            <div className="bg-card/95 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-border/50">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    {paymentRequests.length}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Payment Requests</p>
                </div>
              </div>
            </div>
          </div>

          {/* Students Fee Status */}
          <div className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">Students Fee Status</h3>

            {/* Class and Section Filter */}
            <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6 gap-3">
              <div className="w-full sm:w-auto">
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                >
                  {classes.map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-auto">
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Section</label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                >
                  {sections.map(sec => (
                    <option key={sec} value={sec}>Section {sec}</option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-auto">
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Roll (Optional)</label>
                <input
                  type="text"
                  value={feeFilterRoll}
                  onChange={(e) => setFeeFilterRoll(e.target.value.trim())}
                  placeholder="Enter roll number"
                  className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFeeFilterRoll("")}
              >
                Clear Roll Filter
              </Button>
            </div>

            {/* Students List */}
            <div className="space-y-4">
              {getFeeFilteredStudents().map((student) => {
                const feeStatus = getStudentFeeStatus(student.id);
                return (
                  <div key={student.id} className="border border-border/30 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={student.image || "/placeholder-student.jpg"}
                          alt={student.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-foreground text-sm sm:text-base">{student.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Roll: {student.rollNumber} • Class {student.class}-{student.section}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">
                            Pending: ₹{feeStatus.totalPending}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {feeStatus.pendingMonths.length} months due
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1 sm:space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm"
                            onClick={() => {
                              setSelectedStudentForPayment(student);
                              setShowFeeStatusModal(true);
                            }}
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="hidden xs:inline">View</span>
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm"
                            onClick={() => {
                              setSelectedStudentForPayment(student);
                              setShowPaymentModal(true);
                            }}
                          >
                            <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="hidden xs:inline">Request</span>
                          </Button>

                          {feeStatus.pendingMonths.length > 0 && (
                            <Button
                              size="sm"
                              onClick={() => redirectToStudentPayment(student.id)}
                              className="bg-gradient-to-r from-gold to-yellow-500 text-black h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm"
                            >
                              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              <span className="hidden xs:inline">Pay</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Fee Status Details */}
                    {(feeStatus.pendingMonths.length > 0 || feeStatus.paidMonths.length > 0) && (
                      <div className="mt-4 pt-4 border-t border-border/30">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {feeStatus.pendingMonths.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-red-400 mb-2">
                                Pending Months ({feeStatus.pendingMonths.length}):
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {feeStatus.pendingMonths.map(month => (
                                  <span
                                    key={month}
                                    className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs"
                                  >
                                    {month}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {feeStatus.paidMonths.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-green-400 mb-2">
                                Paid Months ({feeStatus.paidMonths.length}):
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {feeStatus.paidMonths.map(month => (
                                  <span
                                    key={month}
                                    className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs"
                                  >
                                    {month}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {getFeeFilteredStudents().length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">{ feeFilterRoll ? `No students found with Roll ${feeFilterRoll} in Class ${selectedClass}-${selectedSection}` : `No students found in Class ${selectedClass}-${selectedSection}` }</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Profile Section */}
      {activeSection === "profile" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <div className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-heading font-bold text-foreground">Profile Settings</h2>
                <p className="text-sm text-muted-foreground">Manage your profile information and photo</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setActiveSection("dashboard")}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Profile Photo Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Profile Photo</h3>
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
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = async (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            const base64 = await convertToBase64(file);
                            setTempProfilePhoto(base64 as string);
                            setShowCircleGrid(true);
                          }
                        };
                        input.click();
                      }}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>

                    {teacherProfile.photo && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setTempProfilePhoto(teacherProfile.photo);
                          setShowCircleGrid(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}

                    {teacherProfile.photo && (
                      <Button
                        variant="destructive"
                        onClick={() => setTeacherProfile({ ...teacherProfile, photo: "" })}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Profile Information</h3>

                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input
                    value={teacherProfile.name}
                    onChange={(e) => setTeacherProfile({ ...teacherProfile, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input
                    value={teacherProfile.phone}
                    onChange={(e) => setTeacherProfile({ ...teacherProfile, phone: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Qualification</label>
                  <Input
                    value={teacherProfile.qualification}
                    onChange={(e) => setTeacherProfile({ ...teacherProfile, qualification: e.target.value })}
                    placeholder="e.g., M.Ed, B.Sc, Ph.D"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    value={teacherProfile.bio}
                    onChange={(e) => setTeacherProfile({ ...teacherProfile, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground resize-none"
                  />
                </div>

                <Button
                  onClick={() => {
                    localStorage.setItem(`teacher-profile-${teacherEmail}`, JSON.stringify(teacherProfile));
                    alert('Profile updated successfully!');
                  }}
                  className="w-full bg-gradient-to-r from-gold to-yellow-500 text-black"
                >
                  <User className="h-4 w-4 mr-2" />
                  Save Profile
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Report Upload Modal */}
      {showReportModal && selectedStudentForReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl p-6 w-full max-w-md border border-border/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Send Report to {selectedStudentForReport.name}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowReportModal(false);
                  setSelectedStudentForReport(null);
                  setReportForm({ reportImage: "", notes: "", subject: "" });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Subject Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <Input
                  value={reportForm.subject}
                  onChange={(e) => setReportForm({ ...reportForm, subject: e.target.value })}
                  placeholder={`e.g., ${teacherSubject} or Behavior`}
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Report Image</label>
                <div className="border-2 border-dashed border-border rounded-lg p-4">
                  {reportForm.reportImage ? (
                    <div className="space-y-2">
                      <img
                        src={reportForm.reportImage}
                        alt="Report preview"
                        className="w-full h-32 object-cover rounded"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReportForm({ ...reportForm, reportImage: "" })}
                        className="w-full"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload report image (test paper, assignment, etc.)
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => reportImageInputRef.current?.click()}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Choose Image
                      </Button>
                      <input
                        ref={reportImageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleReportImageUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-2">Notes for Student</label>
                <textarea
                  value={reportForm.notes}
                  onChange={(e) => setReportForm({ ...reportForm, notes: e.target.value })}
                  placeholder="Add notes about the report, feedback, or instructions..."
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReportModal(false);
                    setSelectedStudentForReport(null);
                    setReportForm({ reportImage: "", notes: "", subject: "" });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendReport}
                  className="flex-1 bg-gradient-to-r from-gold to-yellow-500 text-black"
                  disabled={!reportForm.reportImage || !reportForm.notes}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Report
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* View Sent Reports Modal */}
      {showViewSentReportsModal && selectedStudentForViewReports && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl p-6 w-full max-w-4xl max-h-[85vh] overflow-y-auto border border-border/50"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-heading font-bold text-foreground">
                Reports Sent to {selectedStudentForViewReports.name} 
                <span className="ml-2 text-sm text-muted-foreground">
                  ({studentReports.filter(r => r.studentId === selectedStudentForViewReports.id).length} reports)
                </span>
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowViewSentReportsModal(false);
                  setSelectedStudentForViewReports(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {studentReports.filter(r => r.studentId === selectedStudentForViewReports.id).length > 0 ? (
              <div className="space-y-4">
                {studentReports
                  .filter(r => r.studentId === selectedStudentForViewReports.id)
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((report) => (
                    <div key={report.id} className="bg-muted/20 rounded-lg p-4 border border-border/30">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-foreground">{report.subject}</h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(report.createdAt).toLocaleDateString()} • Sent by {report.teacherName}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditReport(report)}
                            className="text-gold hover:text-gold/80"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteReport(report.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {report.reportImage && (
                        <div className="mb-3">
                          <img
                            src={report.reportImage}
                            alt="Report"
                            className="w-full max-w-md rounded-lg border border-border/30 cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => {
                              setSelectedImage({
                                src: report.reportImage,
                                title: `${report.subject} Report`
                              });
                              setShowImageModal(true);
                            }}
                          />
                        </div>
                      )}

                      {report.notes && (
                        <div className="bg-muted/30 rounded-lg p-3">
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No reports sent to this student yet.</p>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Edit Report Modal */}
      {showEditReportModal && editingReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-border/50"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-heading font-bold text-foreground">
                Edit Report
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowEditReportModal(false);
                  setEditingReport(null);
                  setReportForm({ reportImage: "", notes: "", subject: "" });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Input
                  value={reportForm.subject}
                  onChange={(e) => setReportForm({ ...reportForm, subject: e.target.value })}
                  placeholder="Report subject"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Report Image</label>
                <div className="space-y-3">
                  {reportForm.reportImage && (
                    <div className="relative">
                      <img
                        src={reportForm.reportImage}
                        alt="Report"
                        className="w-full max-w-md rounded-lg border border-border/30"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReportForm({ ...reportForm, reportImage: "" })}
                        className="absolute top-2 right-2 bg-red-500/80 text-white hover:bg-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <input
                    ref={reportImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleReportImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => reportImageInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {reportForm.reportImage ? 'Change Image' : 'Upload Image'}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Notes</label>
                <Textarea
                  value={reportForm.notes}
                  onChange={(e) => setReportForm({ ...reportForm, notes: e.target.value })}
                  placeholder="Add notes about the report..."
                  rows={4}
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowEditReportModal(false);
                  setEditingReport(null);
                  setReportForm({ reportImage: "", notes: "", subject: "" });
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateReport}
                className="bg-gradient-to-r from-royal to-gold text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Update Report
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Payment Request Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl p-6 w-full max-w-md border border-border/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Create Payment Request
                {selectedStudentForPayment && ` for ${selectedStudentForPayment.name}`}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedStudentForPayment(null);
                  setPaymentForm({ amount: '', months: [], notes: '' });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Student Selection & Filters */}
              {!selectedStudentForPayment && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Class</label>
                      <select
                        value={paymentFilterClass}
                        onChange={(e) => {
                          setPaymentFilterClass(e.target.value);
                          setSelectedStudentForPayment(null);
                        }}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      >
                        {classes.map(cls => (
                          <option key={cls} value={cls}>Class {cls}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Section</label>
                      <select
                        value={paymentFilterSection}
                        onChange={(e) => {
                          setPaymentFilterSection(e.target.value);
                          setSelectedStudentForPayment(null);
                        }}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      >
                        {sections.map(sec => (
                          <option key={sec} value={sec}>Section {sec}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Roll (Optional)</label>
                      <input
                        type="text"
                        value={paymentFilterRoll}
                        onChange={(e) => {
                          const r = e.target.value.trim();
                          setPaymentFilterRoll(r);
                          setSelectedStudentForPayment(null);
                          if (r) {
                            const found = getPaymentFilteredStudents().find(s => s.rollNumber.toString() === r);
                            if (found) setSelectedStudentForPayment(found);
                          }
                        }}
                        placeholder="Enter roll number"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setPaymentFilterClass(classes[0] || "");
                        setPaymentFilterSection(sections[0] || "");
                        setPaymentFilterRoll("");
                        setSelectedStudentForPayment(null);
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Select Student</label>
                    <select
                      onChange={(e) => {
                        const student = students.find(s => s.id === e.target.value);
                        setSelectedStudentForPayment(student || null);
                      }}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    >
                      <option value="">Choose a student...</option>
                      {getPaymentFilteredStudents().map(student => (
                        <option key={student.id} value={student.id}>
                          {student.name} - Class {student.class}-{student.section} (Roll: {student.rollNumber})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}


              {selectedStudentForPayment && (
                <>
                  {/* Amount Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Total Amount (₹)</label>
                    <Input
                      type="number"
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                      placeholder="Enter total amount"
                      min="0"
                    />
                  </div>

                  {/* Month Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Select Months ({paymentForm.months.length} selected)
                    </label>
                    <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                      {months.map(month => (
                        <label key={month} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={paymentForm.months.includes(month)}
                            onChange={() => handleMonthToggle(month)}
                            className="rounded"
                          />
                          <span className="text-sm">{month.slice(0, 3)}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                    <textarea
                      value={paymentForm.notes}
                      onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                      placeholder="Add any additional notes for the student..."
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground resize-none"
                    />
                  </div>

                  {/* Summary */}
                  {paymentForm.amount && paymentForm.months.length > 0 && (
                    <div className="bg-muted/20 rounded-lg p-3">
                      <p className="text-sm font-medium text-foreground mb-1">Payment Summary:</p>
                      <p className="text-sm text-muted-foreground">
                        Total: ₹{paymentForm.amount} for {paymentForm.months.length} month(s)
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Per month: ₹{(parseFloat(paymentForm.amount) / paymentForm.months.length).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Months: {paymentForm.months.join(', ')}
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedStudentForPayment(null);
                    setPaymentForm({ amount: '', months: [], notes: '' });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePaymentRequest}
                  className="flex-1 bg-gradient-to-r from-gold to-yellow-500 text-black"
                  disabled={!selectedStudentForPayment || !paymentForm.amount || paymentForm.months.length === 0}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Create Request
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Fee Status Modal */}
      {showFeeStatusModal && selectedStudentForPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl p-6 w-full max-w-2xl border border-border/50 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Fee Status - {selectedStudentForPayment.name}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowFeeStatusModal(false);
                  setSelectedStudentForPayment(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Student Info */}
              <div className="flex items-center space-x-4 p-4 bg-muted/20 rounded-lg">
                <img
                  src={selectedStudentForPayment.image || "/placeholder-student.jpg"}
                  alt={selectedStudentForPayment.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-foreground">{selectedStudentForPayment.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Roll: {selectedStudentForPayment.rollNumber} • Class {selectedStudentForPayment.class}-{selectedStudentForPayment.section}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Email: {selectedStudentForPayment.email}
                  </p>
                </div>
              </div>

              {/* Fee Records */}
              <div>
                <h4 className="font-semibold text-foreground mb-4">Fee Records ({currentYear})</h4>
                <div className="space-y-3">
                  {feeRecords
                    .filter(fee => fee.studentId === selectedStudentForPayment.id)
                    .map(fee => (
                      <div key={fee.id} className="flex items-center justify-between p-3 border border-border/30 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{fee.month} {fee.year}</p>
                          <p className="text-sm text-muted-foreground">₹{fee.amount}</p>
                          {fee.notes && (
                            <p className="text-xs text-muted-foreground mt-1">{fee.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            fee.status === 'paid' 
                              ? 'bg-green-500/20 text-green-400'
                              : fee.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {fee.status.toUpperCase()}
                          </span>
                          {fee.paymentDate && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Paid: {new Date(fee.paymentDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  }

                  {feeRecords.filter(fee => fee.studentId === selectedStudentForPayment.id).length === 0 && (
                    <div className="text-center py-8">
                      <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No fee records found</p>
                      <p className="text-sm text-muted-foreground">Create a payment request to add fee records</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Requests */}
              <div>
                <h4 className="font-semibold text-foreground mb-4">Payment Requests</h4>
                <div className="space-y-3">
                  {paymentRequests
                    .filter(req => req.studentId === selectedStudentForPayment.id)
                    .map(request => (
                      <div key={request.id} className="p-3 border border-border/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-foreground">₹{request.amount}</p>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            request.status === 'paid'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {request.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Months: {request.months.join(', ')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                        {request.notes && (
                          <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted/20 rounded">
                            {request.notes}
                          </p>
                        )}
                      </div>
                    ))
                  }

                  {paymentRequests.filter(req => req.studentId === selectedStudentForPayment.id).length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground text-sm">No payment requests found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex space-x-2 pt-4 border-t border-border/30">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowFeeStatusModal(false);
                    setShowPaymentModal(true);
                  }}
                  className="flex-1"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Create Payment Request
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Notification Modal */}
      {showEditNotificationModal && editingNotification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl p-4 sm:p-6 w-full max-w-md border border-border/50"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">
                Edit Notification
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowEditNotificationModal(false);
                  setEditingNotification(null);
                  setEditNotificationForm({ subject: '', message: '' });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <Input
                  value={editNotificationForm.subject}
                  onChange={(e) => setEditNotificationForm({ ...editNotificationForm, subject: e.target.value })}
                  placeholder="Enter notification subject"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  value={editNotificationForm.message}
                  onChange={(e) => setEditNotificationForm({ ...editNotificationForm, message: e.target.value })}
                  placeholder="Enter your message to the principal..."
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditNotificationModal(false);
                    setEditingNotification(null);
                    setEditNotificationForm({ subject: '', message: '' });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateNotification}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  disabled={!editNotificationForm.subject || !editNotificationForm.message}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Update Notification
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedNotificationForReply && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl p-6 w-full max-w-2xl border border-border/50 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Reply to Notification
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowReplyModal(false);
                  setSelectedNotificationForReply(null);
                  setReplyMessage('');
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Original Notification */}
              <div className="bg-muted/20 rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">{selectedNotificationForReply.subject}</h4>
                <p className="text-sm text-muted-foreground mb-2">{selectedNotificationForReply.message}</p>
                <p className="text-xs text-muted-foreground">
                  Sent: {new Date(selectedNotificationForReply.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Previous Replies */}
              {selectedNotificationForReply.replies && selectedNotificationForReply.replies.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Previous Replies:</h4>
                  <div className="space-y-2">
                    {selectedNotificationForReply.replies.map((reply) => (
                      <div key={reply.id} className="bg-muted/10 rounded-lg p-3 border-l-4 border-blue-500">
                        <p className="text-sm text-blue-400 mb-1">
                          {reply.fromName} ({reply.fromType})
                        </p>
                        <p className="text-sm text-foreground mb-1">{reply.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reply Message */}
              <div>
                <label className="block text-sm font-medium mb-2">Your Reply</label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Enter your reply message..."
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReplyModal(false);
                    setSelectedNotificationForReply(null);
                    setReplyMessage('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendReply}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white"
                  disabled={!replyMessage}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Reply
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Manage Sent Student Notifications Modal */}
      {showSentNotificationsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl p-3 sm:p-6 w-full max-w-[calc(100vw-1rem)] sm:max-w-4xl max-h-[85vh] overflow-y-auto border border-border/50"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
              <h3 className="text-sm sm:text-lg font-semibold text-foreground leading-tight">
                Manage Sent Student Notifications ({sentStudentNotifications.length})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSentNotificationsModal(false)}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {sentStudentNotifications.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <Bell className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base text-muted-foreground">No student notifications sent yet</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Click "Notify Students" to send your first notification</p>
                </div>
              ) : (
                sentStudentNotifications
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((notification) => (
                    <div key={notification.id} className="bg-muted/20 rounded-lg p-3 sm:p-4 border border-border/30">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 sm:mb-3 gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground mb-1 text-sm sm:text-base break-words">{notification.subject}</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-2 break-words line-clamp-2">{notification.message}</p>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                            <span className="whitespace-nowrap">Sent: {new Date(notification.createdAt).toLocaleDateString()}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="px-2 py-0.5 sm:py-1 bg-purple-500/20 text-purple-400 rounded text-[10px] sm:text-xs whitespace-nowrap">
                              Target: {notification.targetType === 'all' ? 'All Students' : 
                                      notification.targetType === 'class' ? `Class ${notification.targetClass}` :
                                      notification.targetType === 'section' ? `Class ${notification.targetClass}-${notification.targetSection}` :
                                      'Individual Student'}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 sm:gap-2 sm:ml-4 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditStudentNotification(notification)}
                            className="h-7 px-2 sm:h-8 sm:px-3 text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteStudentNotification(notification.id)}
                            className="h-7 px-2 sm:h-8 sm:px-3 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Student Notification Modal */}
      {showEditStudentNotificationModal && editingStudentNotification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl p-4 sm:p-6 w-full max-w-lg border border-border/50"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">
                Edit Student Notification
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowEditStudentNotificationModal(false);
                  setEditingStudentNotification(null);
                  setStudentNotificationForm({
                    subject: '',
                    message: '',
                    targetType: 'all',
                    targetClass: '',
                    targetSection: '',
                    targetStudentId: '',
                    photo1: '',
                    photo2: ''
                  });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <Input
                  value={studentNotificationForm.subject}
                  onChange={(e) => setStudentNotificationForm({ ...studentNotificationForm, subject: e.target.value })}
                  placeholder="Enter notification subject"
                  className="h-8 sm:h-9 text-sm"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  value={studentNotificationForm.message}
                  onChange={(e) => setStudentNotificationForm({ ...studentNotificationForm, message: e.target.value })}
                  placeholder="Enter your message to students..."
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground resize-none"
                />
              </div>

              {/* Current Target Info */}
              <div className="bg-muted/20 rounded-lg p-3">
                <p className="text-sm font-medium text-foreground mb-1">Current Target:</p>
                <p className="text-xs text-muted-foreground">
                  {editingStudentNotification.targetType === 'all' && 'All Students'}
                  {editingStudentNotification.targetType === 'class' && `Class ${editingStudentNotification.targetClass}`}
                  {editingStudentNotification.targetType === 'section' && `Class ${editingStudentNotification.targetClass}-${editingStudentNotification.targetSection}`}
                  {editingStudentNotification.targetType === 'student' && 'Individual Student'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditStudentNotificationModal(false);
                    setEditingStudentNotification(null);
                    setStudentNotificationForm({
                      subject: '',
                      message: '',
                      targetType: 'all',
                      targetClass: '',
                      targetSection: '',
                      targetStudentId: '',
                      photo1: '',
                      photo2: ''
                    });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateStudentNotification}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  disabled={!studentNotificationForm.subject || !studentNotificationForm.message}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Update Notification
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Send Student Notification Modal */}
      {showStudentNotificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl p-6 w-full max-w-lg border border-border/50 max-h-[85vh] overflow-y-auto"
          >
            <div className="sticky top-0 -mx-6 -mt-6 px-4 sm:px-6 pt-4 sm:pt-6 pb-3 bg-card/95 backdrop-blur z-10 border-b border-border/50 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">
                Send Notification to Students
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowStudentNotificationModal(false);
                  setStudentNotificationForm({
                    subject: '',
                    message: '',
                    targetType: 'all',
                    targetClass: '',
                    targetSection: '',
                    targetStudentId: '',
                    photo1: '',
                    photo2: ''
                  });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {/* Target Type Selection */}
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Send To</label>
                <select
                  value={studentNotificationForm.targetType}
                  onChange={(e) => setStudentNotificationForm({ 
                    ...studentNotificationForm, 
                    targetType: e.target.value as 'all' | 'class' | 'section' | 'student',
                    targetClass: '',
                    targetSection: '',
                    targetStudentId: ''
                  })}
                  className="w-full h-8 sm:h-9 px-2 py-1 sm:py-1.5 text-xs sm:text-sm border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="all">All Students</option>
                  <option value="class">Specific Class</option>
                  <option value="section">Specific Section</option>
                  <option value="student">Individual Student</option>
                </select>
              </div>

              {/* Class Selection */}
              {(studentNotificationForm.targetType === 'class' || studentNotificationForm.targetType === 'section' || studentNotificationForm.targetType === 'student') && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Select Class</label>
                  <select
                    value={studentNotificationForm.targetClass}
                    onChange={(e) => setStudentNotificationForm({ 
                      ...studentNotificationForm, 
                      targetClass: e.target.value,
                      targetSection: '',
                      targetStudentId: ''
                    })}
                    className="w-full h-8 sm:h-9 px-2 py-1 sm:py-1.5 text-xs sm:text-sm border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="">Choose a class...</option>
                    {Array.from(new Set(students.map(s => s.class))).map(className => (
                      <option key={className} value={className}>Class {className}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Section Selection */}
              {(studentNotificationForm.targetType === 'section' || studentNotificationForm.targetType === 'student') && studentNotificationForm.targetClass && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Select Section</label>
                  <select
                    value={studentNotificationForm.targetSection}
                    onChange={(e) => setStudentNotificationForm({ 
                      ...studentNotificationForm, 
                      targetSection: e.target.value,
                      targetStudentId: ''
                    })}
                    className="w-full h-9 sm:h-10 px-3 py-1.5 sm:py-2 text-sm border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="">Choose a section...</option>
                    {Array.from(new Set(
                      students
                        .filter(s => s.class === studentNotificationForm.targetClass)
                        .map(s => s.section)
                    )).map(section => (
                      <option key={section} value={section}>Section {section}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Student Selection */}
              {studentNotificationForm.targetType === 'student' && studentNotificationForm.targetClass && studentNotificationForm.targetSection && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Select Student</label>
                  <select
                    value={studentNotificationForm.targetStudentId}
                    onChange={(e) => setStudentNotificationForm({ 
                      ...studentNotificationForm, 
                      targetStudentId: e.target.value
                    })}
                    className="w-full h-9 sm:h-10 px-3 py-1.5 sm:py-2 text-sm border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="">Choose a student...</option>
                    {students
                      .filter(s => s.class === studentNotificationForm.targetClass && s.section === studentNotificationForm.targetSection)
                      .map(student => (
                        <option key={student.id} value={student.id}>
                          {student.name} - Roll: {student.rollNumber}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Subject</label>
                <Input
                  value={studentNotificationForm.subject}
                  onChange={(e) => setStudentNotificationForm({ ...studentNotificationForm, subject: e.target.value })}
                  placeholder="Enter notification subject"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Message</label>
                <textarea
                  value={studentNotificationForm.message}
                  onChange={(e) => setStudentNotificationForm({ ...studentNotificationForm, message: e.target.value })}
                  placeholder="Enter your message to students..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground resize-none"
                />
              </div>

              {/* Photo Attachments */}
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Photo Attachments (Optional)</label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Photo 1</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const base64 = event.target?.result as string;
                            setStudentNotificationForm({ ...studentNotificationForm, photo1: base64 });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full h-8 sm:h-9 px-2 py-1 text-xs sm:text-sm border border-border rounded-lg bg-background text-foreground file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {studentNotificationForm.photo1 && (
                      <div className="mt-2 relative">
                        <img 
                          src={studentNotificationForm.photo1} 
                          alt="Photo 1 preview" 
                          className="w-20 h-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => setStudentNotificationForm({ ...studentNotificationForm, photo1: '' })}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Photo 2</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const base64 = event.target?.result as string;
                            setStudentNotificationForm({ ...studentNotificationForm, photo2: base64 });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full h-8 sm:h-9 px-2 py-1 text-xs sm:text-sm border border-border rounded-lg bg-background text-foreground file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {studentNotificationForm.photo2 && (
                      <div className="mt-2 relative">
                        <img 
                          src={studentNotificationForm.photo2} 
                          alt="Photo 2 preview" 
                          className="w-20 h-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => setStudentNotificationForm({ ...studentNotificationForm, photo2: '' })}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Bell className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground mb-1">Notification Target</p>
                    <p className="text-xs text-muted-foreground">
                      {studentNotificationForm.targetType === 'all' && 'This notification will be sent to all students in the school.'}
                      {studentNotificationForm.targetType === 'class' && studentNotificationForm.targetClass && `This notification will be sent to all students in Class ${studentNotificationForm.targetClass}.`}
                      {studentNotificationForm.targetType === 'section' && studentNotificationForm.targetClass && studentNotificationForm.targetSection && `This notification will be sent to all students in Class ${studentNotificationForm.targetClass}-${studentNotificationForm.targetSection}.`}
                      {studentNotificationForm.targetType === 'student' && studentNotificationForm.targetStudentId && 'This notification will be sent to the selected student only.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2 sticky bottom-0 bg-card/95 -mx-6 px-6 pb-2 pt-3 border-t border-border/50">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowStudentNotificationModal(false);
                    setStudentNotificationForm({
                      subject: '',
                      message: '',
                      targetType: 'all',
                      targetClass: '',
                      targetSection: '',
                      targetStudentId: '',
                      photo1: '',
                      photo2: ''
                    });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendStudentNotification}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                  disabled={!studentNotificationForm.subject || !studentNotificationForm.message}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Send Notification
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Send Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl p-6 w-full max-w-md border border-border/50 max-h-[85vh] overflow-y-auto"
          >
            <div className="sticky top-0 -mx-6 -mt-6 px-4 sm:px-6 pt-4 sm:pt-6 pb-3 bg-card/95 backdrop-blur z-10 border-b border-border/50 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">
                Send Notification to Principal
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowNotificationModal(false);
                  setNotificationForm({ subject: '', message: '', photo1: '', photo2: '' });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {/* Subject */}
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Subject</label>
                <Input
                  value={notificationForm.subject}
                  onChange={(e) => setNotificationForm({ ...notificationForm, subject: e.target.value })}
                  placeholder="Enter notification subject"
                  className="h-8 sm:h-9 text-sm"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Message</label>
                <textarea
                  value={notificationForm.message}
                  onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
                  placeholder="Enter your message to the principal..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground resize-none"
                />
              </div>

              {/* Photo Attachments */}
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Photo Attachments (Optional)</label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Photo 1</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const base64 = event.target?.result as string;
                            setNotificationForm({ ...notificationForm, photo1: base64 });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {notificationForm.photo1 && (
                      <div className="mt-2 relative">
                        <img 
                          src={notificationForm.photo1} 
                          alt="Photo 1 preview" 
                          className="w-20 h-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => setNotificationForm({ ...notificationForm, photo1: '' })}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Photo 2</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const base64 = event.target?.result as string;
                            setNotificationForm({ ...notificationForm, photo2: base64 });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {notificationForm.photo2 && (
                      <div className="mt-2 relative">
                        <img 
                          src={notificationForm.photo2} 
                          alt="Photo 2 preview" 
                          className="w-20 h-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => setNotificationForm({ ...notificationForm, photo2: '' })}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Bell className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs sm:text-sm">
                    <p className="font-medium text-foreground mb-1">Notification Info</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Attachments are optional. They will be sent to the principal along with your subject and message.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2 sticky bottom-0 bg-card/95 -mx-6 px-6 pb-2 pt-3 border-t border-border/50">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNotificationModal(false);
                    setNotificationForm({ subject: '', message: '', photo1: '', photo2: '' });
                  }}
                  className="flex-1 sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendNotification}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  disabled={!notificationForm.subject || !notificationForm.message}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Send Notification
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-[90vw] max-h-[90vh]"
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowImageModal(false);
                setSelectedImage(null);
              }}
              className="absolute top-2 right-2 z-10 bg-black/50 text-white hover:bg-black/70"
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Image Title */}
            <div className="absolute top-2 left-2 z-10 bg-black/50 text-white px-3 py-1 rounded text-sm">
              {selectedImage.title}
            </div>

            {/* Image */}
            <img
              src={selectedImage.src}
              alt="Remark attachment"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />

            {/* Click outside to close */}
            <div
              className="absolute inset-0 -z-10"
              onClick={() => {
                setShowImageModal(false);
                setSelectedImage(null);
              }}
            />
          </motion.div>
        </div>
      )}

      {/* CircleGrid Modal */}
      {showCircleGrid && (
        <CircleGrid
          image={tempProfilePhoto}
          onSave={(processedImage) => {
            setTeacherProfile({ ...teacherProfile, photo: processedImage });
            setShowCircleGrid(false);
            // Save to Supabase
            const profileKey = `teacher-profile-${teacherEmail}`;
            const updatedProfile = { ...teacherProfile, photo: processedImage };
            localStorage.setItem(profileKey, JSON.stringify(updatedProfile));
            setSupabaseData(profileKey, updatedProfile);
          }}
          onCancel={() => setShowCircleGrid(false)}
        />
      )}

      {/* Live Classroom Modal */}
      {showLiveClassroom && (
        <LiveClassroom
          teacherName={teacherName}
          teacherEmail={teacherEmail}
          teacherClass={selectedClass}
          teacherSection={selectedSection}
          onClose={() => setShowLiveClassroom(false)}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;