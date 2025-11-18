import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, FileText, Users, CheckCircle, Clock, DollarSign, GraduationCap, Award, ChevronRight, ChevronLeft, X, Menu, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useMemo, useCallback } from "react";
import { getSupabaseData, setSupabaseData, subscribeToSupabaseChanges } from "@/lib/supabaseHelpers";

// Admission record type for localStorage sync with Admissions page
interface AdmissionRecord {
  id: string;
  createdAt: string;
  paymentStatus: 'paid' | 'test';
  paymentMethod?: 'razorpay' | 'paypal' | 'stripe' | 'test' | null;
  subscriptionType: 'monthly' | 'yearly';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  citizenship: string;
  level: string;
  term: string;
  program: string;
  essay: string;
  ref1: string;
  refEmail: string;
  // Additional properties for student records
  class?: string;
  fatherName?: string;
  motherName?: string;
  studentAge?: string;
  studentPhoto?: string | null;
  aadhaarCard?: string | null;
  birthCertificate?: string | null;
}

const Admissions = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    class: "",
    rollNumber: "", // This will be removed, but keeping for now to avoid breaking existing logic during transition
    fatherName: "",
    motherName: "",
    studentAge: "",
    aadhaarCard: null as File | null,
    birthCertificate: null as File | null,
    studentPhoto: null as File | null
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'razorpay' | 'paypal' | 'stripe' | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState<'monthly' | 'yearly'>('monthly');
  const [showSecondaryNav, setShowSecondaryNav] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [counters, setCounters] = useState({ fee: 0, decision: 0, aid: 0, countries: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const [pricing, setPricing] = useState({ monthly: 5000, yearly: 50000 });
  const [admissionsData, setAdmissionsData] = useState<any>({
    hero: {
      title: "Admissions that put your future first",
      subtitle: "Join a vibrant, supportive community. Our application is fast, holistic, and designed to highlight what makes you, you.",
      stats: {
        applicationFee: "$0",
        decisionTime: "14 days",
        studentsReceiveAid: "92%",
        countriesRepresented: "70+"
      }
    },
    affordability: {
      title: "Affordability",
      subtitle: "Tuition and financial aid",
      tabs: ["Tuition & Fees (2025)", "Scholarships & Grants", "Payment Plans"],
      content: {
        tuition: "Estimated tuition: $28,500 per year. Fees vary by program and credits. Contact us for a personalized breakdown.",
        scholarships: "Automatic merit scholarships are awarded at the time of admission. Need-based grants available via aid application.",
        payments: "Monthly, interest-free plans available. Third-party sponsorships supported."
      }
    },
    campus: {
      title: "See the campus",
      subtitle: "Tour, info sessions, and counselor chats",
      description: "Can't visit? Join a virtual info session or book a 1:1 with our admissions team.",
      images: []
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [admissionStatus, setAdmissionStatus] = useState(true); // true = ON, false = OFF
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    name: "",
    class: "",
    phone: "",
    email: ""
  });
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Load pricing and admissions data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load pricing from Supabase
        const savedPricing = await getSupabaseData<typeof pricing>('royal-academy-pricing', { monthly: 5000, yearly: 50000 });
        setPricing(savedPricing);

        // Load admissions page content from Supabase (using separate key from AdmissionsPageManager)
        const savedAdmissionsData = await getSupabaseData<any>('royal-academy-admissions-content', null);
        if (savedAdmissionsData) {
          setAdmissionsData(savedAdmissionsData);
        }

        // Load admission status from Supabase
        const savedAdmissionStatus = await getSupabaseData<boolean>('royal-academy-admission-status', true);
        setAdmissionStatus(savedAdmissionStatus);
      } catch (error) {
        // Silently handle errors and use defaults
      }
    };

    // Load data initially
    loadData();

    // Listen for storage changes (when Principal updates data)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'royal-academy-admissions-content' || e.key === 'royal-academy-pricing' || e.key === 'royal-academy-admission-status') {
        loadData();
      }
    };

    // Listen for custom events (for same-tab updates)
    const handleCustomUpdate = () => {
      loadData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('admissions-data-updated', handleCustomUpdate);

    // Subscribe to real-time changes from Supabase (reduced logging)
    const unsubscribeAdmissions = subscribeToSupabaseChanges<any>(
      'royal-academy-admissions-content',
      (newData) => {
        if (newData) {
          setAdmissionsData(newData);
        }
      }
    );

    const unsubscribePricing = subscribeToSupabaseChanges<typeof pricing>(
      'royal-academy-pricing',
      (newData) => {
        if (newData) {
          setPricing(newData);
        }
      }
    );

    const unsubscribeAdmissionStatus = subscribeToSupabaseChanges<boolean>(
      'royal-academy-admission-status',
      (newData) => {
        setAdmissionStatus(newData);
      }
    );

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('admissions-data-updated', handleCustomUpdate);
      unsubscribeAdmissions();
      unsubscribePricing();
      unsubscribeAdmissionStatus();
    };
  }, []);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll progress tracking (throttled for performance)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = (window.scrollY / totalHeight) * 100;
          setScrollProgress(progress);

          // Show secondary nav when scrolling past hero
          setShowSecondaryNav(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Counter animation (optimized)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            // Simplified counter animation
            setCounters({ fee: 0, decision: 14, aid: 92, countries: 70 });
          }
        });
      },
      { threshold: 0.5 }
    );

    const statsElement = document.getElementById('stats-section');
    if (statsElement) {
      observer.observe(statsElement);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  // Handle Apply Now click with admission status check (memoized)
  const handleApplyNowClick = useCallback(() => {
    if (!admissionStatus) {
      alert('Admissions are currently closed. Please check back later or contact the admissions office for more information.');
      return;
    }
    setShowModal(true);
  }, [admissionStatus]);

  // Handle Contact Form submission
  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactFormData.name || !contactFormData.email || !contactFormData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const contactEntry = {
        id: Date.now().toString(),
        ...contactFormData,
        submittedAt: new Date().toISOString(),
        status: 'new'
      };

      // Save to Supabase
      const existingContacts = await getSupabaseData<any[]>('royal-academy-contact-forms', []);
      await setSupabaseData('royal-academy-contact-forms', [...existingContacts, contactEntry]);

      alert('Contact form submitted successfully! We will get back to you soon.');
      setContactFormData({ name: '', class: '', phone: '', email: '' });
      setShowContactModal(false);
    } catch (error) {
      alert('Failed to submit contact form. Please try again.');
    }
  };

  // Handle contact form input changes
  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setContactFormData({ ...contactFormData, [e.target.name]: e.target.value });
  };

  const admissionProcess = useMemo(() => [
    {
      icon: FileText,
      title: "Submit Application",
      description: "Complete our comprehensive application form with all required documents.",
      timeline: "By March 1st"
    },
    {
      icon: Users,
      title: "Campus Interview",
      description: "Meet with our admissions team for a personal interview and campus tour.",
      timeline: "March - April"
    },
    {
      icon: CheckCircle,
      title: "Assessment Review",
      description: "Our committee reviews academic records, recommendations, and achievements.",
      timeline: "April - May"
    },
    {
      icon: GraduationCap,
      title: "Admission Decision",
      description: "Receive your admission decision and enrollment information.",
      timeline: "By May 15th"
    }
  ], []);

  const requirements = [
    { category: "Academic Records", items: ["Transcripts", "Grade Reports", "Test Scores", "Academic Portfolio"] },
    { category: "Personal Documents", items: ["Application Form", "Personal Statement", "Letters of Recommendation", "Interview"] },
    { category: "Additional", items: ["Extracurricular Activities", "Awards & Achievements", "Community Service", "Special Talents"] }
  ];

  const tuitionInfo = [
    { label: "Annual Tuition", amount: "$28,500", description: "Comprehensive academic program" },
    { label: "Room & Board", amount: "$12,800", description: "On-campus residential experience" },
    { label: "Activity Fees", amount: "$2,200", description: "Sports, clubs, and activities" },
    { label: "Total Investment", amount: "$43,500", description: "Complete Royal Academy experience" }
  ];

  const faqData = [
    { question: "Is there an application fee?", answer: "No—your application is completely free." },
    { question: "Are test scores required?", answer: "No. Scores are optional and never required for scholarship consideration." },
    { question: "Can I apply before all documents arrive?", answer: "Yes. Submit your application and we'll help collect the remaining materials." },
    { question: "What if I need accommodations?", answer: "We work with students individually—contact admissions@royalacademy.edu to get started." },
    { question: "When will I receive my admission decision?", answer: "Expect a decision within 2-3 weeks of completing your application." },
    { question: "Do you offer financial aid?", answer: "Yes, we offer both need-based aid and merit scholarships. Over 92% of students receive some form of financial assistance." }
  ];

  const deadlines = [
    { month: "Nov", day: "15", tag: "Early Action", title: "Fall Intake – Early Action", description: "Non-binding. Priority scholarship consideration.", badges: ["Merit aid", "Priority housing"] },
    { month: "Jan", day: "15", tag: "Regular", title: "Fall Intake – Regular", description: "Full consideration for admission and need-based aid.", badges: ["Need-based aid", "Rolling review"] },
    { month: "Apr", day: "01", tag: "Spring", title: "Spring Intake", description: "Limited programs. Speak with an advisor to confirm availability.", badges: [] },
    { month: "Rolling", day: "+", tag: "Transfer", title: "Transfer Applicants", description: "Evaluated as space permits. Priority given to early submissions.", badges: [] }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Get current pricing
  const getCurrentAmount = () => {
    return subscriptionType === 'monthly' ? pricing.monthly : pricing.yearly;
  };

  const getCurrentAmountInPaise = () => {
    return getCurrentAmount() * 100; // Convert to paise for Razorpay
  };

  // Payment processing functions
  const processRazorpayPayment = async () => {
    setPaymentProcessing(true);
    try {
      // Demo mode - simulate payment success after 2 seconds
      setTimeout(() => {
        setPaymentSuccess(true);
        setPaymentProcessing(false);
        handleFormSubmission('paid', 'razorpay');
        alert('Demo Payment Successful! ✅\n\nThis is a demo payment. In production, integrate your Razorpay API key.');
      }, 2000);
    } catch (error) {
      setPaymentProcessing(false);
      alert('Payment failed. Please try again.');
    }
  };

  const processPayPalPayment = async () => {
    setPaymentProcessing(true);
    try {
      // PayPal integration would go here
      // This is a simulation
      setTimeout(() => {
        setPaymentSuccess(true);
        setPaymentProcessing(false);
        handleFormSubmission('paid', 'paypal');
      }, 2000);
    } catch (error) {
      setPaymentProcessing(false);
    }
  };

  const processStripePayment = async () => {
    setPaymentProcessing(true);
    try {
      // Stripe integration would go here
      // This is a simulation
      setTimeout(() => {
        setPaymentSuccess(true);
        setPaymentProcessing(false);
        handleFormSubmission('paid', 'stripe');
      }, 2000);
    } catch (error) {
      setPaymentProcessing(false);
    }
  };

  const handlePayment = () => {
    switch (selectedPaymentMethod) {
      case 'razorpay':
        processRazorpayPayment();
        break;
      case 'paypal':
        processPayPalPayment();
        break;
      case 'stripe':
        processStripePayment();
        break;
      default:
        alert('Please select a payment method');
    }
  };

  // Helper function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Save admission to Supabase
  const saveAdmission = async (paymentStatus: 'paid' | 'test', paymentMethod?: 'razorpay' | 'paypal' | 'stripe' | null) => {
    try {
      console.log('[Admissions] Saving admission to Supabase...');

      // Convert files to base64 for storage
      let aadhaarCardBase64 = null;
      let birthCertificateBase64 = null;
      let studentPhotoBase64 = null;

      if (formData.aadhaarCard) {
        aadhaarCardBase64 = await fileToBase64(formData.aadhaarCard);
      }
      if (formData.birthCertificate) {
        birthCertificateBase64 = await fileToBase64(formData.birthCertificate);
      }
      if (formData.studentPhoto) {
        studentPhotoBase64 = await fileToBase64(formData.studentPhoto);
      }

      // Get existing admissions from Supabase and ensure it's always an array
      const rawExisting = await getSupabaseData<any[]>('royal-academy-admissions', []);
      console.log('[Admissions] Raw existing data type:', typeof rawExisting);
      console.log('[Admissions] Raw existing data:', rawExisting);

      // Extra safety: handle both array and non-array cases
      let existing: any[] = [];
      if (Array.isArray(rawExisting)) {
        existing = rawExisting;
      } else if (rawExisting && typeof rawExisting === 'object') {
        // Try to convert array-like objects
        try {
          existing = Array.from(rawExisting as any);
        } catch (e) {
          console.warn('[Admissions] Could not convert to array, using empty array');
          existing = [];
        }
      } else {
        console.warn('[Admissions] Existing data is not an array, using empty array');
        existing = [];
      }

      console.log('[Admissions] Safe existing records count:', existing.length);

      // Create new admission record with base64 encoded files and default values for missing properties
      const record: AdmissionRecord = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        paymentStatus,
        paymentMethod: paymentStatus === 'paid' ? paymentMethod ?? selectedPaymentMethod : 'test',
        subscriptionType,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        class: formData.class,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        studentAge: formData.studentAge,
        aadhaarCard: aadhaarCardBase64,
        birthCertificate: birthCertificateBase64,
        studentPhoto: studentPhotoBase64,
        // Add default values for missing properties to match AdmissionRecord interface
        citizenship: 'Indian', // Default value
        level: 'Secondary', // Default value
        term: 'Regular', // Default value
        program: 'General Education', // Default value
        essay: '', // Default empty
        ref1: '', // Default empty
        refEmail: '' // Default empty
      };

      console.log('[Admissions] Saving admission record (files converted to base64)');
      console.log('[Admissions] New record:', record);
      console.log('[Admissions] Existing records to merge:', existing.length);

      // Safely create new array with additional validation
      const updatedRecords = [record, ...existing];
      console.log('[Admissions] Total records after merge:', updatedRecords.length);

      // Save to Supabase (this also saves to localStorage as fallback)
      const success = await setSupabaseData('royal-academy-admissions', updatedRecords);

      if (success) {
        console.log('[Admissions] Admission saved successfully. Total records:', updatedRecords.length);
        alert(`Admission saved successfully!

Record ID: ${record.id}
Name: ${record.firstName} ${record.lastName}
Status: ${record.paymentStatus}

The principal can now view this in the dashboard.`);
      } else {
        console.warn('[Admissions] Supabase save failed, but saved to localStorage');
        alert(`Admission saved to local storage!

Record ID: ${record.id}
Name: ${record.firstName} ${record.lastName}
Status: ${record.paymentStatus}`);
      }
    } catch (err) {
      console.error('[Admissions] Failed to save admission:', err);
      alert('Error saving admission: ' + err);
    }
  };

  const handleFormSubmission = async (
    paymentStatus: 'paid' | 'test',
    paymentMethod?: 'razorpay' | 'paypal' | 'stripe' | null
  ) => {
    await saveAdmission(paymentStatus, paymentMethod);
    console.log("[Admissions] Application submitted:", { ...formData, paymentStatus, paymentMethod });
    setShowModal(false);
    setCurrentStep(0);
    setPaymentSuccess(false);
    setSelectedPaymentMethod(null);
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      class: "",
      rollNumber: "", // Removed
      fatherName: "",
      motherName: "",
      studentAge: "",
      aadhaarCard: null,
      birthCertificate: null,
      studentPhoto: null
    });
  };

  // Validation for Step 0 and Step 1
  const validateStep1 = () => {
    const requiredTextFields = [
      formData.firstName,
      formData.lastName,
      formData.email,
    ];

    if (requiredTextFields.some(v => !v || !v.trim())) {
      alert('Please complete all required text fields (Personal Info).');
      setCurrentStep(0);
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const requiredTextFields = [
      formData.class,
      formData.fatherName,
      formData.motherName,
      formData.studentAge,
    ];

    const requiredFiles = [
      formData.aadhaarCard,
      formData.birthCertificate,
      formData.studentPhoto
    ];

    if (requiredTextFields.some(v => !v || !v.trim())) {
      alert('Please complete all required fields in Academic Details.');
      setCurrentStep(1);
      return false;
    }

    if (requiredFiles.some(file => !file)) {
      alert('Please upload all required documents (Aadhaar Card, Birth Certificate, and Student Photo).');
      setCurrentStep(1);
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 0) {
      if (validateStep1()) {
        setCurrentStep(currentStep + 1);
      }
    } else if (currentStep === 1) {
      if (validateStep2()) {
        handlePayment();
      }
    }
  };

  // Remove loading screen - always show content

  return (
    <div className="min-h-screen bg-background">
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-gold to-crimson z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      <Navigation />

      {/* Enhanced Secondary Navigation */}
      <AnimatePresence>
        {showSecondaryNav && (
          <motion.nav
            initial={{ y: -80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -80, opacity: 0, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.4
            }}
            className="fixed top-20 left-0 right-0 z-40 bg-gradient-to-r from-background/98 via-royal/5 to-background/98 backdrop-blur-xl border-b border-gold/20 shadow-lg"
          >
            <div className="container-wide">
              <div className="flex items-center justify-between py-3 px-2 sm:py-4 sm:px-4">
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                  {[
                    { href: "#process", label: "Process" },
                    { href: "#requirements", label: "Requirements" },
                    { href: "#deadlines", label: "Deadlines" },
                    { href: "#tuition", label: "Tuition & Aid" },
                    { href: "#faq", label: "FAQs" }
                  ].map((item, index) => (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative px-4 py-2 text-sm font-medium text-foreground hover:text-gold transition-all duration-300 rounded-lg hover:bg-gold/10 group"
                    >
                      {item.label}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold to-crimson opacity-0 group-hover:opacity-100 transition-opacity"
                        layoutId="activeTab"
                      />
                    </motion.a>
                  ))}
                </div>

                {/* Mobile Navigation Menu */}
                <div className="md:hidden flex items-center space-x-2 overflow-x-auto scrollbar-none w-full">
                  {[
                    { href: "#process", label: "Process", icon: "📋" },
                    { href: "#requirements", label: "Requirements", icon: "📚" },
                    { href: "#deadlines", label: "Deadlines", icon: "📅" },
                    { href: "#tuition", label: "Tuition", icon: "💰" },
                    { href: "#faq", label: "FAQ", icon: "❓" }
                  ].map((item, index) => (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex flex-col items-center min-w-[50px] px-2 py-2 text-xs font-medium text-foreground hover:text-gold transition-all duration-300 rounded-lg hover:bg-gold/10"
                    >
                      <span className="text-lg mb-1">{item.icon}</span>
                      <span className="whitespace-nowrap text-center leading-tight text-xs">
                        {item.label}
                      </span>
                    </motion.a>
                  ))}
                </div>

                {/* Apply Now Button - Desktop Only */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden md:block flex-shrink-0"
                >
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={handleApplyNowClick}
                    className="shadow-lg hover:shadow-xl transition-all duration-300 text-yellow-600 font-bold border-2 border-sky-400 hover:border-sky-500 bg-transparent hover:bg-sky-50"
                  >
                    {admissionStatus ? 'Apply Now' : 'Admission Closed'}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal/20 via-background to-crimson/20"></div>

        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-10 right-10 w-64 h-64 rounded-full bg-gradient-radial from-gold/20 to-transparent blur-xl"
          />
          <motion.div
            animate={{
              y: [0, 15, 0],
              x: [0, -8, 0],
              scale: [1, 0.95, 1]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-gradient-radial from-crimson/20 to-transparent blur-xl"
          />
        </div>

        <div className="container-wide relative z-10 px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-bold mb-4 sm:mb-6 leading-tight text-gradient-gold">
                  {admissionsData?.hero?.title || "Admissions that put your future first"}
                </h1>

                {/* Admission Status Banner */}
                {!admissionStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <div>
                        <h3 className="font-semibold text-red-700">Admissions Currently Closed</h3>
                        <p className="text-sm text-red-600">Applications are not being accepted at this time. Please check back later or contact our admissions office for more information.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
                <p className="text-base sm:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-6 sm:mb-8">
                  {admissionsData?.hero?.subtitle || "Join a vibrant, supportive community. Our application is fast, holistic, and designed to highlight what makes you, you."}
                </p>
                <div className="flex flex-wrap gap-4 mb-12">
                  <Button
                    variant="hero"
                    size="xl"
                    onClick={handleApplyNowClick}
                    className={`font-bold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-sky-400 hover:border-sky-500 ${
                      admissionStatus
                        ? 'text-yellow-600 bg-transparent hover:bg-sky-50'
                        : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                    }`}
                  >
                    {admissionStatus ? 'Apply Now - Start your application' : 'Admissions Currently Closed'}
                  </Button>
                  <Button
                    variant="outline"
                    size="xl"
                    onClick={() => setShowContactModal(true)}
                    className="text-yellow-600 font-bold border-2 border-sky-400 hover:border-sky-500 bg-transparent hover:bg-sky-50"
                  >
                    Contact Admissions
                  </Button>
                  <Button variant="ghost" size="xl" asChild>
                    <a href="#process">Explore the process</a>
                  </Button>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                id="stats-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
              >
                <div className="card-3d p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-heading font-bold text-gradient-gold">
                    {admissionsData?.hero?.stats?.applicationFee || "$0"}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium">Application Fee</div>
                </div>
                <div className="card-3d p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-heading font-bold text-gradient-gold">
                    {admissionsData?.hero?.stats?.decisionTime || "14 days"}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium">Avg. Decision Time</div>
                </div>
                <div className="card-3d p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-heading font-bold text-gradient-gold">
                    {admissionsData?.hero?.stats?.studentsReceiveAid || "92%"}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium">Students Receive Aid</div>
                </div>
                <div className="card-3d p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-heading font-bold text-gradient-gold">
                    {admissionsData?.hero?.stats?.countriesRepresented || "70+"}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium">Countries Represented</div>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-card to-muted/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-crimson/10" />
                <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-gold/30 to-crimson/30 blur-sm" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Admission Process */}
      <section id="process" className="section-padding bg-gradient-to-b from-background to-muted/20">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-16"
          >
            <div className="text-sm font-bold text-gold uppercase tracking-wider mb-4">
              {admissionsData?.process?.title || "How it works"}
            </div>
            <h2 className="text-4xl font-heading font-bold mb-6">
              {admissionsData?.process?.subtitle || "Your path to admission"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A clear, supportive process from inquiry to enrollment. Each step unlocks as you're ready.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-gold to-crimson opacity-30 hidden lg:block" />

            <div className="space-y-8">
              {(admissionsData?.process?.steps || admissionProcess).map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  {/* Step Number */}
                  <div className="lg:col-span-2 flex justify-center lg:justify-start">
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-gold to-crimson flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {index + 1}
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-gold/40" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:col-span-10">
                    <div className="card-3d p-8">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-2xl font-heading font-bold text-gradient-gold">{step.title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{step.timeline}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-4">{step.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-gold/10 text-gold rounded-full text-sm font-medium">Secure</span>
                        <span className="px-3 py-1 bg-crimson/10 text-crimson rounded-full text-sm font-medium">Save-as-you-go</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section id="requirements" className="section-padding bg-gradient-to-r from-royal/5 via-background to-crimson/5">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="text-sm font-bold text-gold uppercase tracking-wider mb-4">
              {admissionsData?.requirements?.title || "Requirements"}
            </div>
            <h2 className="text-4xl font-heading font-bold mb-6">
              {admissionsData?.requirements?.subtitle || "What you'll need to apply"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We review every application in context. If anything's hard to get, let us know and we'll help you find a path forward.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {(admissionsData?.requirements?.categories || requirements).map((req, index) => (
              <motion.div
                key={req.title || req.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{
                  scale: 1.02,
                  y: -10
                }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300
                }}
                className="card-3d p-8"
              >
                <h3 className="text-2xl font-heading font-semibold mb-6 text-gradient-gold">{req.title || req.category}</h3>
                <div className="space-y-4">
                  {(req.items || []).map((item, idx) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + idx * 0.05 }}
                      className="flex items-center space-x-3 group"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CheckCircle className="h-5 w-5 text-gold flex-shrink-0" />
                      </motion.div>
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Requirements Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(admissionsData?.requirements?.specialSections || [
              {
                id: "international",
                title: "International Students",
                description: "English proficiency (IELTS/TOEFL/Duolingo), credential evaluation, financial documentation."
              },
              {
                id: "transfer",
                title: "Transfer Applicants",
                description: "College transcripts and course syllabi for credit evaluation."
              },
              {
                id: "accommodations",
                title: "Accommodations",
                description: "We provide reasonable accommodations—contact us to discuss your needs."
              }
            ]).map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-3d p-6"
              >
                <h3 className="text-xl font-heading font-semibold mb-4 text-gradient-gold">{section.title}</h3>
                <p className="text-muted-foreground">{section.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deadlines */}
      <section id="deadlines" className="section-padding bg-gradient-to-b from-background to-muted/20">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="text-sm font-bold text-gold uppercase tracking-wider mb-4">
              {admissionsData?.dates?.title || "Important dates"}
            </div>
            <h2 className="text-4xl font-heading font-bold mb-6">
              {admissionsData?.dates?.subtitle || "Application deadlines"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We offer multiple rounds. Applications are reviewed on a rolling basis after each deadline.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(admissionsData?.dates?.deadlines || deadlines).map((deadline, index) => (
              <motion.div
                key={deadline.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300
                }}
                className="card-3d p-8 flex items-center space-x-6"
              >
                <motion.div
                  whileHover={{ rotateY: 180 }}
                  transition={{ duration: 0.6 }}
                  className="flex-shrink-0 w-24 h-24 rounded-xl bg-gradient-to-br from-gold to-crimson text-white flex flex-col items-center justify-center shadow-lg"
                >
                  <div className="text-xs font-bold uppercase opacity-90">{deadline.month}</div>
                  <div className="text-2xl font-bold">{deadline.day}</div>
                  <div className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full mt-1">{deadline.tag}</div>
                </motion.div>

                <div className="flex-1">
                  <h3 className="text-xl font-heading font-semibold mb-2 text-gradient-gold">{deadline.title}</h3>
                  <p className="text-muted-foreground mb-3">{deadline.description}</p>
                  {(deadline.features || deadline.badges)?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {(deadline.features || deadline.badges || []).map((badge, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gold/10 text-gold rounded-full text-sm font-medium">
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tuition & Financial Aid */}
      <section id="tuition" className="section-padding bg-gradient-to-b from-background to-muted/20">
        <div className="container-wide">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="text-sm font-bold text-gold uppercase tracking-wider mb-4">
              {admissionsData?.affordability?.title || "Affordability"}
            </div>
            <h2 className="text-4xl font-heading font-bold mb-6">
              {admissionsData?.affordability?.subtitle || "Tuition and financial aid"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We work with every admitted student to build a smart, sustainable plan.
            </p>
          </motion.div>

          {/* Accordion-style tuition details */}
          <div className="max-w-4xl mx-auto space-y-4 mb-12">
            <motion.details
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card-3d p-6 group"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="text-xl font-heading font-semibold">
                  {admissionsData?.affordability?.tabs?.[0] || "Tuition & Fees (2025)"}
                </span>
                <ChevronRight className="h-5 w-5 text-gold transition-transform group-open:rotate-90" />
              </summary>
              <div className="mt-4 pt-4 border-t border-border text-muted-foreground">
                {admissionsData?.affordability?.content?.tuition || "Estimated tuition: $28,500 per year. Fees vary by program and credits. Contact us for a personalized breakdown."}
              </div>
            </motion.details>

            <motion.details
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card-3d p-6 group"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="text-xl font-heading font-semibold">
                  {admissionsData?.affordability?.tabs?.[1] || "Scholarships & Grants"}
                </span>
                <ChevronRight className="h-5 w-5 text-gold transition-transform group-open:rotate-90" />
              </summary>
              <div className="mt-4 pt-4 border-t border-border text-muted-foreground">
                {admissionsData?.affordability?.content?.scholarships || "Automatic merit scholarships are awarded at the time of admission. Need-based grants available via aid application."}
              </div>
            </motion.details>

            <motion.details
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card-3d p-6 group"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="text-xl font-heading font-semibold">
                  {admissionsData?.affordability?.tabs?.[2] || "Payment Plans"}
                </span>
                <ChevronRight className="h-5 w-5 text-gold transition-transform group-open:rotate-90" />
              </summary>
              <div className="mt-4 pt-4 border-t border-border text-muted-foreground">
                {admissionsData?.affordability?.content?.payments || "Monthly, interest-free plans available. Third-party sponsorships supported."}
              </div>
            </motion.details>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card-3d p-8 bg-gradient-to-r from-gold/5 via-transparent to-crimson/5 border-dashed"
          >
            <div className="text-center">
              <div className="text-sm font-bold text-gold uppercase tracking-wider mb-4">
                {admissionsData?.campus?.title || "See the campus"}
              </div>
              <h3 className="text-3xl font-heading font-bold mb-4">
                {admissionsData?.campus?.subtitle || "Tour, info sessions, and counselor chats"}
              </h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                {admissionsData?.campus?.description || "Can't visit? Join a virtual info session or book a 1:1 with our admissions team."}
              </p>

              {/* Campus Image Carousel */}
              {admissionsData?.campus?.images && admissionsData.campus.images.length > 0 && (
                <div className="mb-8 max-w-4xl mx-auto">
                  <div className="relative">
                    {/* Main Image */}
                    <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
                      <img
                        src={admissionsData.campus.images[currentImageIndex]}
                        alt={`Campus view ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Navigation Buttons */}
                      {admissionsData.campus.images.length > 1 && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentImageIndex(prev =>
                              prev === 0 ? admissionsData.campus.images.length - 1 : prev - 1
                            )}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentImageIndex(prev =>
                              prev === admissionsData.campus.images.length - 1 ? 0 : prev + 1
                            )}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      {/* Image Counter */}
                      <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                        {currentImageIndex + 1} / {admissionsData.campus.images.length}
                      </div>
                    </div>

                    {/* Thumbnail Navigation */}
                    {admissionsData.campus.images.length > 1 && (
                      <div className="flex justify-center mt-4 gap-2 overflow-x-auto">
                        {admissionsData.campus.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                              index === currentImageIndex
                                ? 'border-gold shadow-lg'
                                : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`Campus thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="ghost" size="lg" onClick={() => setShowContactModal(true)}>Contact Admissions</Button>
                <Button
                  variant={admissionStatus ? "gold" : "outline"}
                  size="lg"
                  onClick={handleApplyNowClick}
                  className={admissionStatus
                    ? 'text-yellow-600 font-bold border-2 border-sky-400 hover:border-sky-500 bg-transparent hover:bg-sky-50'
                    : 'border-red-500 text-red-500 hover:bg-red-50'
                  }
                >
                  {admissionStatus ? 'Apply Now' : 'Admissions Closed'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="text-sm font-bold text-gold uppercase tracking-wider mb-4">FAQs</div>
            <h2 className="text-4xl font-heading font-bold mb-6">Answers to common questions</h2>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {(admissionsData?.faqs || faqData).map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-3d overflow-hidden"
              >
                <motion.button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/5 transition-colors"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-lg font-heading font-semibold pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openFAQ === index ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronRight className="h-5 w-5 text-gold flex-shrink-0" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {openFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-muted-foreground border-t border-border pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-gradient-to-b from-background to-muted/20">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="card-3d p-8"
            >
              <h3 className="text-2xl font-heading font-semibold mb-6 text-gradient-gold">
                {admissionsData?.contact?.title || "Contact Admissions"}
              </h3>
              <div className="space-y-4 text-muted-foreground">
                <p>Email: {admissionsData?.contact?.email || "admissions@royalacademy.edu"}</p>
                <p>Phone: {admissionsData?.contact?.phone || "+1 (555) 123-4567"}</p>
                <p>Hours: {admissionsData?.contact?.hours || "Mon–Fri, 9am–5pm"}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card-3d p-8"
            >
              <h3 className="text-2xl font-heading font-semibold mb-6 text-gradient-gold">Mailing Address</h3>
              <div className="text-muted-foreground">
                <p>{admissionsData?.contact?.address?.name || "Royal Academy"}</p>
                <p>{admissionsData?.contact?.address?.street || "123 Excellence Boulevard"}</p>
                <p>{admissionsData?.contact?.address?.city || "Academic City, AC 12345"}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Application Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-gold/5 to-crimson/5">
                <div>
                  <h2 className="text-2xl font-heading font-bold">Start your application</h2>
                  <p className="text-sm text-muted-foreground">3 quick steps. You can save and finish later.</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowModal(false)}
                  className="rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="px-6 py-4">
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-gold to-crimson h-2 rounded-full"
                    initial={{ width: "50%" }}
                    animate={{ width: `${((currentStep + 1) / 2) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span className={currentStep >= 0 ? "text-gold" : ""}>Personal Info</span>
                  <span className={currentStep >= 1 ? "text-gold" : ""}>Academic Details & Payment</span>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 modal-scroll" style={{ maxHeight: 'calc(95vh - 200px)', minHeight: '400px' }}>
                <div className="p-6">
                  <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">
                    {currentStep === 0 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 1 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="class">Class *</Label>
                            <select
                              id="class"
                              name="class"
                              value={formData.class}
                              onChange={handleInputChange}
                              required
                              className="w-full p-3 border border-border rounded-lg bg-background"
                            >
                              <option value="">Select Class...</option>
                              <option value="1">Class 1</option>
                              <option value="2">Class 2</option>
                              <option value="3">Class 3</option>
                              <option value="4">Class 4</option>
                              <option value="5">Class 5</option>
                              <option value="6">Class 6</option>
                              <option value="7">Class 7</option>
                              <option value="8">Class 8</option>
                              <option value="9">Class 9</option>
                              <option value="10">Class 10</option>
                              <option value="11">Class 11</option>
                              <option value="12">Class 12</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="fatherName">Father's Name *</Label>
                            <Input
                              id="fatherName"
                              name="fatherName"
                              placeholder="Enter father's name"
                              value={formData.fatherName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="motherName">Mother's Name *</Label>
                            <Input
                              id="motherName"
                              name="motherName"
                              placeholder="Enter mother's name"
                              value={formData.motherName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="studentAge">Student Age *</Label>
                            <Input
                              id="studentAge"
                              name="studentAge"
                              type="number"
                              placeholder="Enter student's age"
                              value={formData.studentAge}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="aadhaarCard">Aadhaar Card *</Label>
                            <input
                              id="aadhaarCard"
                              name="aadhaarCard"
                              type="file"
                              accept="image/*,.pdf"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                setFormData(prev => ({ ...prev, aadhaarCard: file }));
                              }}
                              required
                              className="w-full p-3 border border-border rounded-lg bg-background file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-black hover:file:bg-gold/90"
                            />
                            <p className="text-sm text-muted-foreground">Upload Aadhaar card (Image or PDF)</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="birthCertificate">Birth Certificate *</Label>
                            <input
                              id="birthCertificate"
                              name="birthCertificate"
                              type="file"
                              accept="image/*,.pdf"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                setFormData(prev => ({ ...prev, birthCertificate: file }));
                              }}
                              required
                              className="w-full p-3 border border-border rounded-lg bg-background file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-black hover:file:bg-gold/90"
                            />
                            <p className="text-sm text-muted-foreground">Upload birth certificate (Image or PDF)</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="studentPhoto">Student Photo *</Label>
                            <input
                              id="studentPhoto"
                              name="studentPhoto"
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                setFormData(prev => ({ ...prev, studentPhoto: file }));
                              }}
                              required
                              className="w-full p-3 border border-border rounded-lg bg-background file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-black hover:file:bg-gold/90"
                            />
                            <p className="text-sm text-muted-foreground">Upload student's passport-size photo (Image only)</p>
                          </div>
                        </div>

                        {/* Payment Section */}
                        <div className="mt-8 pt-6 border-t border-border/50">
                          <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold mb-2">Choose Your Plan</h3>
                            <p className="text-muted-foreground">Select a subscription plan to complete your admission</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div
                              className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                                subscriptionType === 'monthly'
                                  ? 'border-gold bg-gold/5'
                                  : 'border-border hover:border-gold/50'
                              }`}
                              onClick={() => setSubscriptionType('monthly')}
                            >
                              <div className="text-center">
                                <h4 className="text-xl font-bold mb-2">Monthly Plan</h4>
                                <div className="text-3xl font-bold text-gold mb-2">₹{pricing.monthly.toLocaleString()}</div>
                                <p className="text-sm text-muted-foreground mb-4">Per month</p>
                                <ul className="text-sm space-y-2 text-left">
                                  <li>✓ Full access to all courses</li>
                                  <li>✓ Monthly assessments</li>
                                  <li>✓ Teacher support</li>
                                  <li>✓ Study materials</li>
                                </ul>
                              </div>
                            </div>

                            <div
                              className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                                subscriptionType === 'yearly'
                                  ? 'border-gold bg-gold/5'
                                  : 'border-border hover:border-gold/50'
                              }`}
                              onClick={() => setSubscriptionType('yearly')}
                            >
                              <div className="text-center">
                                <h4 className="text-xl font-bold mb-2">Yearly Plan</h4>
                                <div className="text-3xl font-bold text-gold mb-2">₹{pricing.yearly.toLocaleString()}</div>
                                <p className="text-sm text-muted-foreground mb-2">Per year</p>
                                <p className="text-xs text-green-600 mb-4">Save ₹{((pricing.monthly * 12) - pricing.yearly).toLocaleString()}!</p>
                                <ul className="text-sm space-y-2 text-left">
                                  <li>✓ Everything in Monthly</li>
                                  <li>✓ Priority support</li>
                                  <li>✓ Extra study materials</li>
                                  <li>✓ Annual progress reports</li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          {/* Current Selection Display */}
                          <div className="text-center p-4 bg-muted/20 rounded-lg border border-border mb-6">
                            <div className="text-3xl font-bold text-gradient-gold mb-2">₹{getCurrentAmount().toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">
                              {subscriptionType === 'monthly' ? 'Monthly subscription fee' : 'Yearly subscription fee'}
                            </div>
                          </div>

                          {/* Payment Methods */}
                          <div className="space-y-3">
                            <h4 className="font-semibold mb-3">Choose Payment Method:</h4>

                            {/* Razorpay Option */}
                            <div
                              onClick={() => setSelectedPaymentMethod('razorpay')}
                              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                selectedPaymentMethod === 'razorpay'
                                  ? 'border-gold bg-gold/5'
                                  : 'border-border hover:border-gold/50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                                    Razorpay
                                  </div>
                                  <div>
                                    <div className="font-semibold">Razorpay</div>
                                    <div className="text-sm text-muted-foreground">UPI, Cards, Net Banking</div>
                                  </div>
                                </div>
                                <div className={`w-4 h-4 rounded-full border-2 ${
                                  selectedPaymentMethod === 'razorpay' ? 'border-gold bg-gold' : 'border-muted-foreground'
                                }`} />
                              </div>
                            </div>

                            {/* PayPal Option - REMOVED */}
                            {/* Stripe Option - REMOVED */}
                          </div>
                          {/* Payment Buttons */}
                          <div className="mt-6">
                            <Button
                              type="button"
                              variant="default"
                              onClick={handlePayment}
                              disabled={!selectedPaymentMethod || paymentProcessing}
                              className="w-full bg-[#ffbe00] hover:bg-[#e6ac00] text-white font-semibold cursor-default"
                            >
                              {paymentProcessing ? 'Processing...' : 'Pay & Submit'}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Simple Navigation */}
                  <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        if (currentStep === 1) {
                          if (validateStep2()) { // Ensure step 2 is valid before going back
                            setCurrentStep(currentStep - 1);
                          }
                        } else {
                          setCurrentStep(Math.max(0, currentStep - 1));
                        }
                      }}
                      disabled={currentStep === 0 || paymentProcessing}
                      className={currentStep === 0 ? "invisible" : ""}
                    >
                      Back
                    </Button>

                    {currentStep < 1 && (
                      <Button
                        type="button"
                        variant="default"
                        onClick={() => {
                          if (currentStep === 0) {
                            if (validateStep1()) {
                              setCurrentStep(currentStep + 1);
                            }
                          }
                        }}
                        className="bg-[#ffbe00] text-white font-semibold cursor-default hover:bg-[#e6ac00]"
                      >
                        Next
                      </Button>
                    )}
                  </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-background rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-gold/5 to-crimson/5">
                <div>
                  <h2 className="text-xl font-heading font-bold">Contact Admissions</h2>
                  <p className="text-sm text-muted-foreground">We'll get back to you soon</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowContactModal(false)}
                  className="rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <form onSubmit={handleContactFormSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Full Name *</Label>
                    <Input
                      id="contactName"
                      name="name"
                      value={contactFormData.name}
                      onChange={handleContactInputChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactClass">Class/Grade</Label>
                    <select
                      id="contactClass"
                      name="class"
                      value={contactFormData.class}
                      onChange={handleContactInputChange}
                      className="w-full p-2 border border-border rounded-md bg-background"
                    >
                      <option value="">Select Class</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Phone Number *</Label>
                    <Input
                      id="contactPhone"
                      name="phone"
                      type="tel"
                      value={contactFormData.phone}
                      onChange={handleContactInputChange}
                      required
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email Address *</Label>
                    <Input
                      id="contactEmail"
                      name="email"
                      type="email"
                      value={contactFormData.email}
                      onChange={handleContactInputChange}
                      required
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowContactModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-[#ffbe00] hover:bg-[#e6ac00] text-white font-bold cursor-default"
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Admissions;