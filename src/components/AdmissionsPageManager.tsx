import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Save, 
  BookOpen, 
  Calendar, 
  DollarSign, 
  GraduationCap, 
  HelpCircle, 
  Phone, 
  Upload, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Award,
  FileText,
  Loader2
} from "lucide-react";
import { Button } from './ui/button-variants';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { getSupabaseData, setSupabaseData } from '../lib/supabaseHelpers';
import { initSupaStorage } from '../lib/supaStorage';

interface AdmissionsData {
  hero: {
    title: string;
    subtitle: string;
    stats: {
      applicationFee: string;
      decisionTime: string;
      studentsReceiveAid: string;
      countriesRepresented: string;
    };
  };
  process: {
    title: string;
    subtitle: string;
    steps: Array<{
      id: string;
      title: string;
      timeline: string;
      description: string;
      features: string[];
    }>;
  };
  requirements: {
    title: string;
    subtitle: string;
    categories: Array<{
      id: string;
      title: string;
      items: string[];
    }>;
    specialSections: Array<{
      id: string;
      title: string;
      description: string;
    }>;
  };
  dates: {
    title: string;
    subtitle: string;
    deadlines: Array<{
      id: string;
      month: string;
      day: string;
      tag: string;
      title: string;
      description: string;
      features: string[];
    }>;
  };
  affordability: {
    title: string;
    subtitle: string;
    tabs: string[];
    content: {
      tuition: string;
      scholarships: string;
      payments: string;
    };
  };
  campus: {
    title: string;
    subtitle: string;
    description: string;
    images: string[];
  };
  faqs: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
  contact: {
    title: string;
    email: string;
    phone: string;
    hours: string;
    address: {
      name: string;
      street: string;
      city: string;
    };
  };
}

const AdmissionsPageManager: React.FC = () => {
  const [admissionsData, setAdmissionsData] = useState<AdmissionsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [editingFAQ, setEditingFAQ] = useState<string | null>(null);
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '' });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Backup initialization function
  const ensureDataInitialized = () => {
    if (!admissionsData) {
      console.log('Initializing with default data as backup');
      setAdmissionsData(getDefaultAdmissionsData());
    }
  };

  // Default data structure
  const getDefaultAdmissionsData = (): AdmissionsData => ({
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
    process: {
      title: "How it works",
      subtitle: "Your path to admission",
      steps: [
        {
          id: "1",
          title: "Submit Application",
          timeline: "By March 1st",
          description: "Complete our comprehensive application form with all required documents.",
          features: ["Secure", "Save-as-you-go"]
        },
        {
          id: "2",
          title: "Campus Interview",
          timeline: "March - April",
          description: "Meet with our admissions team for a personal interview and campus tour.",
          features: ["Secure", "Save-as-you-go"]
        },
        {
          id: "3",
          title: "Assessment Review",
          timeline: "April - May",
          description: "Our committee reviews academic records, recommendations, and achievements.",
          features: ["Secure", "Save-as-you-go"]
        },
        {
          id: "4",
          title: "Admission Decision",
          timeline: "By May 15th",
          description: "Receive your admission decision and enrollment information.",
          features: ["Secure", "Save-as-you-go"]
        }
      ]
    },
    requirements: {
      title: "Requirements",
      subtitle: "What you'll need to apply",
      categories: [
        {
          id: "academic",
          title: "Academic Records",
          items: ["Transcripts", "Grade Reports", "Test Scores", "Academic Portfolio"]
        },
        {
          id: "personal",
          title: "Personal Documents",
          items: ["Application Form", "Personal Statement", "Letters of Recommendation", "Interview"]
        },
        {
          id: "additional",
          title: "Additional",
          items: ["Extracurricular Activities", "Awards & Achievements", "Community Service", "Special Talents"]
        }
      ],
      specialSections: [
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
      ]
    },
    dates: {
      title: "Important dates",
      subtitle: "Application deadlines",
      deadlines: [
        {
          id: "early",
          month: "Nov",
          day: "15",
          tag: "Early Action",
          title: "Early Action",
          description: "Fall Intake – Early Action",
          features: ["Merit aid", "Priority housing"]
        },
        {
          id: "regular",
          month: "Jan",
          day: "15",
          tag: "Regular",
          title: "Regular",
          description: "Fall Intake – Regular",
          features: ["Need-based aid", "Rolling review"]
        },
        {
          id: "spring",
          month: "Apr",
          day: "01",
          tag: "Spring",
          title: "Spring",
          description: "Spring Intake",
          features: ["Rolling"]
        },
        {
          id: "transfer",
          month: "Rolling",
          day: "+",
          tag: "Transfer",
          title: "Transfer",
          description: "Transfer Applicants",
          features: []
        }
      ]
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
    },
    faqs: [
      {
        id: "1",
        question: "Is there an application fee?",
        answer: "No, there is no application fee for Royal Academy."
      },
      {
        id: "2",
        question: "Are test scores required?",
        answer: "Test scores are optional but recommended for scholarship consideration."
      },
      {
        id: "3",
        question: "Can I apply before all documents arrive?",
        answer: "Yes, you can submit your application and send documents as they become available."
      },
      {
        id: "4",
        question: "What if I need accommodations?",
        answer: "We provide reasonable accommodations. Contact our admissions office to discuss your needs."
      },
      {
        id: "5",
        question: "When will I receive my admission decision?",
        answer: "Expect a decision within 2-3 weeks of completing your application."
      },
      {
        id: "6",
        question: "Do you offer financial aid?",
        answer: "Yes, we offer need-based and merit-based financial aid to qualified students."
      }
    ],
    contact: {
      title: "Contact Admissions",
      email: "admissions@royalacademy.edu",
      phone: "+1 (555) 123-4567",
      hours: "Mon–Fri, 9am–5pm",
      address: {
        name: "Royal Academy",
        street: "123 Excellence Boulevard",
        city: "Academic City, AC 12345"
      }
    }
  });

  // Initialize Supabase storage and load data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Initialize Supabase storage first
        await initSupaStorage();
        
        // Load data from Supabase with fallback to default
        const data = await getSupabaseData('royal-academy-admissions-content', getDefaultAdmissionsData());
        
        // Ensure we always have valid data
        if (data && typeof data === 'object' && data.hero) {
          setAdmissionsData(data);
        } else {
          console.warn('Invalid data structure from Supabase, using defaults');
          setAdmissionsData(getDefaultAdmissionsData());
        }
        
      } catch (err) {
        console.error('Failed to initialize admissions data:', err);
        // Always fall back to default data on any error
        setAdmissionsData(getDefaultAdmissionsData());
        setError(null); // Don't show error, just use defaults
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Save data to Supabase
  const saveData = async () => {
    if (!admissionsData) {
      console.warn('Cannot save: admissionsData is null');
      return;
    }
    
    try {
      setSaveStatus('saving');
      const success = await setSupabaseData('royal-academy-admissions-content', admissionsData);
      
      if (success) {
        setSaveStatus('saved');
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('admissions-data-updated'));
        
        // Reset save status after 2 seconds
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch (err) {
      console.error('Save failed:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // Add new FAQ
  const addFAQ = () => {
    if (!admissionsData || !newFAQ.question || !newFAQ.answer) return;
    
    // Get the next sequential ID number
    const existingIds = (admissionsData.faqs || []).map(faq => parseInt(faq.id)).filter(id => !isNaN(id));
    const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    
    setAdmissionsData(prev => {
      if (!prev) return getDefaultAdmissionsData();
      return {
        ...prev,
        faqs: [...(prev.faqs || []), { id: nextId.toString(), ...newFAQ }]
      };
    });
    setNewFAQ({ question: '', answer: '' });
  };

  // Delete FAQ
  const deleteFAQ = (id: string) => {
    if (!admissionsData) return;
    
    setAdmissionsData(prev => {
      if (!prev) return getDefaultAdmissionsData();
      return {
        ...prev,
        faqs: (prev.faqs || []).filter(faq => faq.id !== id)
      };
    });
  };

  // Update FAQ
  const updateFAQ = (id: string, field: 'question' | 'answer', value: string) => {
    if (!admissionsData) return;
    
    setAdmissionsData(prev => {
      if (!prev) return getDefaultAdmissionsData();
      return {
        ...prev,
        faqs: (prev.faqs || []).map(faq => 
          faq.id === id ? { ...faq, [field]: value } : faq
        )
      };
    });
  };

  const sections = [
    { id: 'hero', title: 'Hero Section', icon: Award },
    { id: 'process', title: 'Application Process', icon: FileText },
    { id: 'requirements', title: 'Requirements', icon: BookOpen },
    { id: 'dates', title: 'Important Dates', icon: Calendar },
    { id: 'affordability', title: 'Affordability', icon: DollarSign },
    { id: 'campus', title: 'Campus Tours', icon: GraduationCap },
    { id: 'faqs', title: 'FAQs', icon: HelpCircle },
    { id: 'contact', title: 'Contact Info', icon: Phone }
  ];

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading admissions data...</span>
        </div>
      </div>
    );
  }

  // Ensure we always have data to work with
  if (!admissionsData) {
    console.warn('AdmissionsData is null, initializing with defaults');
    setAdmissionsData(getDefaultAdmissionsData());
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Initializing admissions data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b-2 border-gold/30">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold bg-gradient-to-r from-gold via-yellow-400 to-gold bg-clip-text text-transparent">Admissions Page Manager</h2>
          <p className="text-xs sm:text-sm text-white/70">Edit all content on the admissions page</p>
        </div>
        <Button 
          onClick={saveData} 
          disabled={saveStatus === 'saving'}
          className="bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-black font-semibold shadow-lg shadow-gold/20 border-2 border-yellow-400/50 w-full sm:w-auto"
        >
          {saveStatus === 'saving' ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : saveStatus === 'saved' ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Saved!
            </>
          ) : saveStatus === 'error' ? (
            <>
              <X className="h-4 w-4 mr-2" />
              Error
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save All Changes
            </>
          )}
        </Button>
      </div>

      {/* Section Navigation */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant={activeSection === section.id ? "default" : "outline"}
            onClick={() => setActiveSection(section.id)}
            size="sm"
            className={`flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm ${
              activeSection === section.id 
                ? 'bg-gradient-to-r from-gold to-yellow-500 text-black border-2 border-yellow-400/50 shadow-md' 
                : 'border-2 border-gold/30 text-white hover:bg-gold/10 hover:border-gold/50'
            }`}
          >
            <section.icon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{section.title}</span>
            <span className="sm:hidden text-[10px]">{section.title.split(' ')[0]}</span>
          </Button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="bg-card/95 backdrop-blur-sm rounded-xl p-3 sm:p-6 border-2 border-gold/30 shadow-xl shadow-gold/10">
        {/* Hero Section */}
        {activeSection === 'hero' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-base sm:text-lg font-semibold text-gold border-b border-gold/30 pb-2">Hero Section</h3>
            
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2 text-white/80">Main Title</label>
                <Input
                  value={admissionsData?.hero?.title || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      hero: { ...prev.hero, title: e.target.value }
                    };
                  })}
                  placeholder="Main hero title"
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2 text-white/80">Subtitle</label>
                <Textarea
                  value={admissionsData?.hero?.subtitle || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      hero: { ...prev.hero, subtitle: e.target.value }
                    };
                  })}
                  placeholder="Hero subtitle"
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2 text-white/80">Application Fee</label>
                <Input
                  value={admissionsData?.hero?.stats?.applicationFee || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      hero: { 
                        ...prev.hero, 
                        stats: { ...prev.hero.stats, applicationFee: e.target.value }
                      }
                    };
                  })}
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2 text-white/80">Decision Time</label>
                <Input
                  value={admissionsData?.hero?.stats?.decisionTime || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      hero: { 
                        ...prev.hero, 
                        stats: { ...prev.hero.stats, decisionTime: e.target.value }
                      }
                    };
                  })}
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2 text-white/80">Students Receive Aid</label>
                <Input
                  value={admissionsData?.hero?.stats?.studentsReceiveAid || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      hero: { 
                        ...prev.hero, 
                        stats: { ...prev.hero.stats, studentsReceiveAid: e.target.value }
                      }
                    };
                  })}
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2 text-white/80">Countries Represented</label>
                <Input
                  value={admissionsData?.hero?.stats?.countriesRepresented || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      hero: { 
                        ...prev.hero, 
                        stats: { ...prev.hero.stats, countriesRepresented: e.target.value }
                      }
                    };
                  })}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Process Section */}
        {activeSection === 'process' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-base sm:text-lg font-semibold text-gold border-b border-gold/30 pb-2">Admission Process Section</h3>
            
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Section Title</label>
                <Input
                  value={admissionsData?.process?.title || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      process: { ...prev.process, title: e.target.value }
                    };
                  })}
                  placeholder="Section title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Section Subtitle</label>
                <Input
                  value={admissionsData?.process?.subtitle || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      process: { ...prev.process, subtitle: e.target.value }
                    };
                  })}
                  placeholder="Section subtitle"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Process Steps</h4>
              {admissionsData?.process?.steps?.map((step, index) => (
                <div key={step.id} className="bg-muted/20 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">Step {index + 1}</h5>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!admissionsData) return;
                        const updatedSteps = (admissionsData.process.steps || []).filter(s => s.id !== step.id);
                        setAdmissionsData(prev => {
                          if (!prev) return getDefaultAdmissionsData();
                          return {
                            ...prev,
                            process: { ...prev.process, steps: updatedSteps }
                          };
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Step Title</label>
                      <Input
                        value={step.title}
                        onChange={(e) => {
                          if (!admissionsData) return;
                          const updatedSteps = (admissionsData.process.steps || []).map(s => 
                            s.id === step.id ? { ...s, title: e.target.value } : s
                          );
                          setAdmissionsData(prev => {
                            if (!prev) return getDefaultAdmissionsData();
                            return {
                              ...prev,
                              process: { ...prev.process, steps: updatedSteps }
                            };
                          });
                        }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Timeline</label>
                      <Input
                        value={step.timeline}
                        onChange={(e) => {
                          if (!admissionsData) return;
                          const updatedSteps = (admissionsData.process.steps || []).map(s => 
                            s.id === step.id ? { ...s, timeline: e.target.value } : s
                          );
                          setAdmissionsData(prev => {
                            if (!prev) return getDefaultAdmissionsData();
                            return {
                              ...prev,
                              process: { ...prev.process, steps: updatedSteps }
                            };
                          });
                        }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={step.description}
                      onChange={(e) => {
                        if (!admissionsData) return;
                        const updatedSteps = (admissionsData.process.steps || []).map(s => 
                          s.id === step.id ? { ...s, description: e.target.value } : s
                        );
                        setAdmissionsData(prev => {
                          if (!prev) return getDefaultAdmissionsData();
                          return {
                            ...prev,
                            process: { ...prev.process, steps: updatedSteps }
                          };
                        });
                      }}
                      rows={3}
                    />
                  </div>
                </div>
              ))}
              
              <Button
                onClick={() => {
                  if (!admissionsData) return;
                  const newStep = {
                    id: (() => {
                      const existingIds = (admissionsData.process.steps || []).map(step => parseInt(step.id)).filter(id => !isNaN(id));
                      return (existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1).toString();
                    })(),
                    title: 'New Step',
                    timeline: 'TBD',
                    description: 'Step description',
                    features: ['Secure', 'Save-as-you-go']
                  };
                  setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      process: { ...prev.process, steps: [...(prev.process.steps || []), newStep] }
                    };
                  });
                }}
                className="w-fit"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Process Step
              </Button>
            </div>
          </motion.div>
        )}

        {/* Requirements Section */}
        {activeSection === 'requirements' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-base sm:text-lg font-semibold text-gold border-b border-gold/30 pb-2">Requirements Section</h3>
            
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Section Title</label>
                <Input
                  value={admissionsData?.requirements?.title || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      requirements: { ...prev.requirements, title: e.target.value }
                    };
                  })}
                  placeholder="Section title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Section Subtitle</label>
                <Input
                  value={admissionsData?.requirements?.subtitle || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      requirements: { ...prev.requirements, subtitle: e.target.value }
                    };
                  })}
                  placeholder="Section subtitle"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Requirement Categories</h4>
              {(admissionsData?.requirements?.categories || []).map((category, index) => (
                <div key={category.id} className="bg-muted/20 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">Category {index + 1}</h5>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!admissionsData) return;
                        const updatedCategories = (admissionsData.requirements.categories || []).filter(c => c.id !== category.id);
                        setAdmissionsData(prev => {
                          if (!prev) return getDefaultAdmissionsData();
                          return {
                            ...prev,
                            requirements: { ...prev.requirements, categories: updatedCategories }
                          };
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Category Title</label>
                    <Input
                      value={category.title}
                      onChange={(e) => {
                        if (!admissionsData) return;
                        const updatedCategories = (admissionsData.requirements.categories || []).map(c => 
                          c.id === category.id ? { ...c, title: e.target.value } : c
                        );
                        setAdmissionsData(prev => {
                          if (!prev) return getDefaultAdmissionsData();
                          return {
                            ...prev,
                            requirements: { ...prev.requirements, categories: updatedCategories }
                          };
                        });
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Items (one per line)</label>
                    <Textarea
                      value={category.items.join('\n')}
                      onChange={(e) => {
                        if (!admissionsData) return;
                        const items = e.target.value.split('\n').filter(item => item.trim());
                        const updatedCategories = (admissionsData.requirements.categories || []).map(c => 
                          c.id === category.id ? { ...c, items } : c
                        );
                        setAdmissionsData(prev => {
                          if (!prev) return getDefaultAdmissionsData();
                          return {
                            ...prev,
                            requirements: { ...prev.requirements, categories: updatedCategories }
                          };
                        });
                      }}
                      rows={4}
                      placeholder="Enter each requirement item on a new line"
                    />
                  </div>
                </div>
              ))}
              
              <Button
                onClick={() => {
                  if (!admissionsData) return;
                  const newCategory = {
                    id: (() => {
                      const existingIds = (admissionsData.requirements.categories || []).map(cat => cat.id).filter(id => /^\d+$/.test(id)).map(id => parseInt(id));
                      return (existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1).toString();
                    })(),
                    title: 'New Category',
                    items: ['Item 1', 'Item 2']
                  };
                  setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      requirements: { ...prev.requirements, categories: [...(prev.requirements.categories || []), newCategory] }
                    };
                  });
                }}
                className="w-fit"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
          </motion.div>
        )}

        {/* Dates/Deadlines Section */}
        {activeSection === 'dates' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold">Important Dates & Deadlines</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Section Title</label>
                <Input
                  value={admissionsData?.dates?.title || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      dates: { ...prev.dates, title: e.target.value }
                    };
                  })}
                  placeholder="Section title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Section Subtitle</label>
                <Input
                  value={admissionsData?.dates?.subtitle || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      dates: { ...prev.dates, subtitle: e.target.value }
                    };
                  })}
                  placeholder="Section subtitle"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Deadlines</h4>
              {(admissionsData?.dates?.deadlines || []).map((deadline, index) => (
                <div key={deadline.id} className="bg-muted/20 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">Deadline {index + 1}</h5>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!admissionsData) return;
                        const updatedDeadlines = (admissionsData.dates.deadlines || []).filter(d => d.id !== deadline.id);
                        setAdmissionsData(prev => {
                          if (!prev) return getDefaultAdmissionsData();
                          return {
                            ...prev,
                            dates: { ...prev.dates, deadlines: updatedDeadlines }
                          };
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Month</label>
                      <Input
                        value={deadline.month}
                        onChange={(e) => {
                          if (!admissionsData) return;
                          const updatedDeadlines = (admissionsData.dates.deadlines || []).map(d => 
                            d.id === deadline.id ? { ...d, month: e.target.value } : d
                          );
                          setAdmissionsData(prev => {
                            if (!prev) return getDefaultAdmissionsData();
                            return {
                              ...prev,
                              dates: { ...prev.dates, deadlines: updatedDeadlines }
                            };
                          });
                        }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Day</label>
                      <Input
                        value={deadline.day}
                        onChange={(e) => {
                          if (!admissionsData) return;
                          const updatedDeadlines = (admissionsData.dates.deadlines || []).map(d => 
                            d.id === deadline.id ? { ...d, day: e.target.value } : d
                          );
                          setAdmissionsData(prev => {
                            if (!prev) return getDefaultAdmissionsData();
                            return {
                              ...prev,
                              dates: { ...prev.dates, deadlines: updatedDeadlines }
                            };
                          });
                        }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Tag</label>
                      <Input
                        value={deadline.tag}
                        onChange={(e) => {
                          if (!admissionsData) return;
                          const updatedDeadlines = (admissionsData.dates.deadlines || []).map(d => 
                            d.id === deadline.id ? { ...d, tag: e.target.value } : d
                          );
                          setAdmissionsData(prev => {
                            if (!prev) return getDefaultAdmissionsData();
                            return {
                              ...prev,
                              dates: { ...prev.dates, deadlines: updatedDeadlines }
                            };
                          });
                        }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Deadline Title</label>
                    <Input
                      value={deadline.title}
                      onChange={(e) => {
                        if (!admissionsData) return;
                        const updatedDeadlines = admissionsData.dates.deadlines.map(d => 
                          d.id === deadline.id ? { ...d, title: e.target.value } : d
                        );
                        setAdmissionsData(prev => {
                          if (!prev) return getDefaultAdmissionsData();
                          return {
                            ...prev,
                            dates: { ...prev.dates, deadlines: updatedDeadlines }
                          };
                        });
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={deadline.description}
                      onChange={(e) => {
                        if (!admissionsData) return;
                        const updatedDeadlines = admissionsData.dates.deadlines.map(d => 
                          d.id === deadline.id ? { ...d, description: e.target.value } : d
                        );
                        setAdmissionsData(prev => {
                          if (!prev) return getDefaultAdmissionsData();
                          return {
                            ...prev,
                            dates: { ...prev.dates, deadlines: updatedDeadlines }
                          };
                        });
                      }}
                      rows={2}
                    />
                  </div>
                </div>
              ))}
              
              <Button
                onClick={() => {
                  if (!admissionsData) return;
                  const newDeadline = {
                    id: (() => {
                      const existingIds = (admissionsData.dates.deadlines || []).map(deadline => deadline.id).filter(id => /^\d+$/.test(id)).map(id => parseInt(id));
                      return (existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1).toString();
                    })(),
                    month: 'Jan',
                    day: '15',
                    tag: 'Regular',
                    title: 'New Deadline',
                    description: 'Deadline description',
                    features: []
                  };
                  setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      dates: { ...prev.dates, deadlines: [...prev.dates.deadlines, newDeadline] }
                    };
                  });
                }}
                className="w-fit"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Deadline
              </Button>
            </div>
          </motion.div>
        )}

        {/* Affordability Section */}
        {activeSection === 'affordability' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold">Tuition & Financial Aid</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Section Title</label>
                <Input
                  value={admissionsData?.affordability?.title || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      affordability: { ...prev.affordability, title: e.target.value }
                    };
                  })}
                  placeholder="Section title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Section Subtitle</label>
                <Input
                  value={admissionsData?.affordability?.subtitle || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      affordability: { ...prev.affordability, subtitle: e.target.value }
                    };
                  })}
                  placeholder="Section subtitle"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Content Sections</h4>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tuition Information</label>
                <Textarea
                  value={admissionsData?.affordability?.content?.tuition || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      affordability: { 
                        ...prev.affordability, 
                        content: { ...prev.affordability.content, tuition: e.target.value }
                      }
                    };
                  })}
                  rows={3}
                  placeholder="Tuition and fees information"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Scholarships & Grants</label>
                <Textarea
                  value={admissionsData?.affordability?.content?.scholarships || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      affordability: { 
                        ...prev.affordability, 
                        content: { ...prev.affordability.content, scholarships: e.target.value }
                      }
                    };
                  })}
                  rows={3}
                  placeholder="Scholarships and grants information"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Payment Plans</label>
                <Textarea
                  value={admissionsData?.affordability?.content?.payments || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      affordability: { 
                        ...prev.affordability, 
                        content: { ...prev.affordability.content, payments: e.target.value }
                      }
                    };
                  })}
                  rows={3}
                  placeholder="Payment plans information"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Campus Section */}
        {activeSection === 'campus' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold">Campus Information</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Section Title</label>
                <Input
                  value={admissionsData?.campus?.title || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      campus: { ...prev.campus, title: e.target.value }
                    };
                  })}
                  placeholder="Section title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Section Subtitle</label>
                <Input
                  value={admissionsData?.campus?.subtitle || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      campus: { ...prev.campus, subtitle: e.target.value }
                    };
                  })}
                  placeholder="Section subtitle"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={admissionsData?.campus?.description || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      campus: { ...prev.campus, description: e.target.value }
                    };
                  })}
                  rows={3}
                  placeholder="Campus description"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Contact Section */}
        {activeSection === 'contact' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Section Title</label>
                <Input
                  value={admissionsData?.contact?.title || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      contact: { ...prev.contact, title: e.target.value }
                    };
                  })}
                  placeholder="Contact section title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  value={admissionsData?.contact?.email || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      contact: { ...prev.contact, email: e.target.value }
                    };
                  })}
                  placeholder="Contact email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <Input
                  value={admissionsData?.contact?.phone || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      contact: { ...prev.contact, phone: e.target.value }
                    };
                  })}
                  placeholder="Contact phone"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Office Hours</label>
                <Input
                  value={admissionsData?.contact?.hours || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      contact: { ...prev.contact, hours: e.target.value }
                    };
                  })}
                  placeholder="Office hours"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Address</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Institution Name</label>
                  <Input
                    value={admissionsData?.contact?.address?.name || ''}
                    onChange={(e) => setAdmissionsData(prev => {
                      if (!prev) return getDefaultAdmissionsData();
                      return {
                        ...prev,
                        contact: { 
                          ...prev.contact, 
                          address: { ...prev.contact.address, name: e.target.value }
                        }
                      };
                    })}
                    placeholder="Institution name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Street Address</label>
                  <Input
                    value={admissionsData?.contact?.address?.street || ''}
                    onChange={(e) => setAdmissionsData(prev => {
                      if (!prev) return getDefaultAdmissionsData();
                      return {
                        ...prev,
                        contact: { 
                          ...prev.contact, 
                          address: { ...prev.contact.address, street: e.target.value }
                        }
                      };
                    })}
                    placeholder="Street address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">City, State, ZIP</label>
                  <Input
                    value={admissionsData?.contact?.address?.city || ''}
                    onChange={(e) => setAdmissionsData(prev => {
                      if (!prev) return getDefaultAdmissionsData();
                      return {
                        ...prev,
                        contact: { 
                          ...prev.contact, 
                          address: { ...prev.contact.address, city: e.target.value }
                        }
                      };
                    })}
                    placeholder="City, state, ZIP code"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {activeSection === 'faqs' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
            
            {/* Add New FAQ */}
            <div className="bg-muted/20 rounded-lg p-4 space-y-4">
              <h4 className="font-medium">Add New FAQ</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Question</label>
                  <Input
                    value={newFAQ.question}
                    onChange={(e) => setNewFAQ(prev => ({ ...prev, question: e.target.value }))}
                    placeholder="Enter the question"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Answer</label>
                  <Textarea
                    value={newFAQ.answer}
                    onChange={(e) => setNewFAQ(prev => ({ ...prev, answer: e.target.value }))}
                    placeholder="Enter the answer"
                    rows={3}
                  />
                </div>
                <Button onClick={addFAQ} className="w-fit">
                  <Plus className="h-4 w-4 mr-2" />
                  Add FAQ
                </Button>
              </div>
            </div>

            {/* Existing FAQs */}
            <div className="space-y-4">
              {(admissionsData?.faqs || []).length > 0 ? (
                (admissionsData?.faqs || []).map((faq) => (
                  <div key={faq.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-medium">FAQ #{faq.id}</h4>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteFAQ(faq.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Question</label>
                        <Input
                          value={faq.question}
                          onChange={(e) => updateFAQ(faq.id, 'question', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Answer</label>
                        <Textarea
                          value={faq.answer}
                          onChange={(e) => updateFAQ(faq.id, 'answer', e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No FAQs yet. Add your first FAQ above.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Contact Section */}
        {activeSection === 'contact' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Section Title</label>
                  <Input
                    value={admissionsData?.contact?.title || ''}
                    onChange={(e) => setAdmissionsData(prev => {
                      if (!prev) return getDefaultAdmissionsData();
                      return {
                        ...prev,
                        contact: { ...prev.contact, title: e.target.value }
                      };
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    value={admissionsData?.contact?.email || ''}
                    onChange={(e) => setAdmissionsData(prev => {
                      if (!prev) return getDefaultAdmissionsData();
                      return {
                        ...prev,
                        contact: { ...prev.contact, email: e.target.value }
                      };
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <Input
                    value={admissionsData?.contact?.phone || ''}
                    onChange={(e) => setAdmissionsData(prev => {
                      if (!prev) return getDefaultAdmissionsData();
                      return {
                        ...prev,
                        contact: { ...prev.contact, phone: e.target.value }
                      };
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Hours</label>
                  <Input
                    value={admissionsData?.contact?.hours || ''}
                    onChange={(e) => setAdmissionsData(prev => {
                      if (!prev) return getDefaultAdmissionsData();
                      return {
                        ...prev,
                        contact: { ...prev.contact, hours: e.target.value }
                      };
                    })}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Mailing Address</h4>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Institution Name</label>
                  <Input
                    value={admissionsData?.contact?.address?.name || ''}
                    onChange={(e) => setAdmissionsData(prev => {
                      if (!prev) return getDefaultAdmissionsData();
                      return {
                        ...prev,
                        contact: { 
                          ...prev.contact, 
                          address: { ...prev.contact.address, name: e.target.value }
                        }
                      };
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Street Address</label>
                  <Input
                    value={admissionsData?.contact?.address?.street || ''}
                    onChange={(e) => setAdmissionsData(prev => {
                      if (!prev) return getDefaultAdmissionsData();
                      return {
                        ...prev,
                        contact: { 
                          ...prev.contact, 
                          address: { ...prev.contact.address, street: e.target.value }
                        }
                      };
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">City, State, ZIP</label>
                  <Input
                    value={admissionsData?.contact?.address?.city || ''}
                    onChange={(e) => setAdmissionsData(prev => {
                      if (!prev) return getDefaultAdmissionsData();
                      return {
                        ...prev,
                        contact: { 
                          ...prev.contact, 
                          address: { ...prev.contact.address, city: e.target.value }
                        }
                      };
                    })}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Application Process Section */}
        {activeSection === 'process' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold">Application Process</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Section Title</label>
                <Input
                  value={admissionsData?.process?.title || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      process: { ...prev.process, title: e.target.value }
                    };
                  })}
                  placeholder="How it works"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Section Subtitle</label>
                <Input
                  value={admissionsData?.process?.subtitle || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      process: { ...prev.process, subtitle: e.target.value }
                    };
                  })}
                  placeholder="Your path to admission"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Process Steps</h4>
              {admissionsData?.process?.steps?.map((step, index) => (
                <div key={step.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-medium">Step {step.id}</h5>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setAdmissionsData(prev => ({
                          ...prev,
                          process: {
                            ...prev.process,
                            steps: (prev.process.steps || []).filter(s => s.id !== step.id)
                          }
                        }));
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Step Title</label>
                      <Input
                        value={step.title}
                        onChange={(e) => {
                          setAdmissionsData(prev => ({
                            ...prev,
                            process: {
                              ...prev.process,
                              steps: (prev.process.steps || []).map(s => 
                                s.id === step.id ? { ...s, title: e.target.value } : s
                              )
                            }
                          }));
                        }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Timeline</label>
                      <Input
                        value={step.timeline}
                        onChange={(e) => {
                          setAdmissionsData(prev => ({
                            ...prev,
                            process: {
                              ...prev.process,
                              steps: (prev.process.steps || []).map(s => 
                                s.id === step.id ? { ...s, timeline: e.target.value } : s
                              )
                            }
                          }));
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={step.description}
                      onChange={(e) => {
                        setAdmissionsData(prev => ({
                          ...prev,
                          process: {
                            ...prev.process,
                            steps: prev.process.steps.map(s => 
                              s.id === step.id ? { ...s, description: e.target.value } : s
                            )
                          }
                        }));
                      }}
                      rows={3}
                    />
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Features (comma separated)</label>
                    <Input
                      value={step.features.join(', ')}
                      onChange={(e) => {
                        setAdmissionsData(prev => ({
                          ...prev,
                          process: {
                            ...prev.process,
                            steps: prev.process.steps.map(s => 
                              s.id === step.id ? { ...s, features: e.target.value.split(', ').filter(f => f.trim()) } : s
                            )
                          }
                        }));
                      }}
                      placeholder="Secure, Save-as-you-go"
                    />
                  </div>
                </div>
              ))}
              
              <Button
                onClick={() => {
                  if (!admissionsData) return;
                  const newStep = {
                    id: ((admissionsData?.process?.steps?.length || 0) + 1).toString(),
                    title: "New Step",
                    timeline: "Timeline",
                    description: "Step description",
                    features: ["Feature"]
                  };
                  setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      process: {
                        ...prev.process,
                        steps: [...prev.process.steps, newStep]
                      }
                    };
                  });
                }}
                className="w-fit"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Step
              </Button>
            </div>
          </motion.div>
        )}

        {/* Requirements Section */}
        {activeSection === 'requirements' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold">Requirements</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Section Title</label>
                <Input
                  value={admissionsData?.requirements?.title || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      requirements: { ...prev.requirements, title: e.target.value }
                    };
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Section Subtitle</label>
                <Input
                  value={admissionsData?.requirements?.subtitle || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      requirements: { ...prev.requirements, subtitle: e.target.value }
                    };
                  })}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Requirement Categories</h4>
                {admissionsData?.requirements?.categories?.map((category) => (
                  <div key={category.id} className="border border-border rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-medium">{category.title}</h5>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setAdmissionsData(prev => ({
                            ...prev,
                            requirements: {
                              ...prev.requirements,
                              categories: prev.requirements.categories.filter(c => c.id !== category.id)
                            }
                          }));
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Category Title</label>
                        <Input
                          value={category.title}
                          onChange={(e) => {
                            setAdmissionsData(prev => ({
                              ...prev,
                              requirements: {
                                ...prev.requirements,
                                categories: prev.requirements.categories.map(c => 
                                  c.id === category.id ? { ...c, title: e.target.value } : c
                                )
                              }
                            }));
                          }}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Items (one per line)</label>
                        <Textarea
                          value={category.items.join('\n')}
                          onChange={(e) => {
                            setAdmissionsData(prev => ({
                              ...prev,
                              requirements: {
                                ...prev.requirements,
                                categories: prev.requirements.categories.map(c => 
                                  c.id === category.id ? { ...c, items: e.target.value.split('\n').filter(item => item.trim()) } : c
                                )
                              }
                            }));
                          }}
                          rows={4}
                          placeholder="Transcripts&#10;Grade Reports&#10;Test Scores"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button
                  onClick={() => {
                    const newCategory = {
                      id: (() => {
                        const existingIds = (admissionsData.requirements.categories || []).map(cat => cat.id).filter(id => /^\d+$/.test(id)).map(id => parseInt(id));
                        return (existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1).toString();
                      })(),
                      title: "New Category",
                      items: ["Item 1", "Item 2"]
                    };
                    setAdmissionsData(prev => ({
                      ...prev,
                      requirements: {
                        ...prev.requirements,
                        categories: [...prev.requirements.categories, newCategory]
                      }
                    }));
                  }}
                  className="w-fit"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>

              <div>
                <h4 className="font-medium mb-4">Special Sections</h4>
                {admissionsData?.requirements?.specialSections?.map((section) => (
                  <div key={section.id} className="border border-border rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-medium">{section.title}</h5>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setAdmissionsData(prev => {
                            if (!prev) return getDefaultAdmissionsData();
                            return {
                              ...prev,
                              requirements: {
                                ...prev.requirements,
                                specialSections: prev.requirements.specialSections.filter(s => s.id !== section.id)
                              }
                            };
                          });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Section Title</label>
                        <Input
                          value={section.title}
                          onChange={(e) => {
                            setAdmissionsData(prev => {
                              if (!prev) return getDefaultAdmissionsData();
                              return {
                                ...prev,
                                requirements: {
                                  ...prev.requirements,
                                  specialSections: prev.requirements.specialSections.map(s => 
                                    s.id === section.id ? { ...s, title: e.target.value } : s
                                  )
                                }
                              };
                            });
                          }}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <Textarea
                          value={section.description}
                          onChange={(e) => {
                            setAdmissionsData(prev => {
                              if (!prev) return getDefaultAdmissionsData();
                              return {
                                ...prev,
                                requirements: {
                                  ...prev.requirements,
                                  specialSections: prev.requirements.specialSections.map(s => 
                                    s.id === section.id ? { ...s, description: e.target.value } : s
                                  )
                                }
                              };
                            });
                          }}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button
                  onClick={() => {
                    if (!admissionsData) return;
                    const newSection = {
                      id: (() => {
                        const existingIds = (admissionsData.requirements.specialSections || []).map(section => section.id).filter(id => /^\d+$/.test(id)).map(id => parseInt(id));
                        return (existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1).toString();
                      })(),
                      title: "New Special Section",
                      description: "Description for this special section"
                    };
                    setAdmissionsData(prev => {
                      if (!prev) return getDefaultAdmissionsData();
                      return {
                        ...prev,
                        requirements: {
                          ...prev.requirements,
                          specialSections: [...prev.requirements.specialSections, newSection]
                        }
                      };
                    });
                  }}
                  className="w-fit"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Special Section
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Important Dates Section */}
        {activeSection === 'dates' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold">Important Dates</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Section Title</label>
                <Input
                  value={admissionsData?.dates?.title || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      dates: { ...prev.dates, title: e.target.value }
                    };
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Section Subtitle</label>
                <Input
                  value={admissionsData?.dates?.subtitle || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      dates: { ...prev.dates, subtitle: e.target.value }
                    };
                  })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Application Deadlines</h4>
              {admissionsData?.dates?.deadlines?.map((deadline) => (
                <div key={deadline.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-medium">{deadline.title}</h5>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setAdmissionsData(prev => ({
                          ...prev,
                          dates: {
                            ...prev.dates,
                            deadlines: prev.dates.deadlines.filter(d => d.id !== deadline.id)
                          }
                        }));
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Month</label>
                      <Input
                        value={deadline.month}
                        onChange={(e) => {
                          setAdmissionsData(prev => ({
                            ...prev,
                            dates: {
                              ...prev.dates,
                              deadlines: (prev.dates.deadlines || []).map(d => 
                                d.id === deadline.id ? { ...d, month: e.target.value } : d
                              )
                            }
                          }));
                        }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Day</label>
                      <Input
                        value={deadline.day}
                        onChange={(e) => {
                          setAdmissionsData(prev => ({
                            ...prev,
                            dates: {
                              ...prev.dates,
                              deadlines: (prev.dates.deadlines || []).map(d => 
                                d.id === deadline.id ? { ...d, day: e.target.value } : d
                              )
                            }
                          }));
                        }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <Input
                        value={deadline.title}
                        onChange={(e) => {
                          setAdmissionsData(prev => ({
                            ...prev,
                            dates: {
                              ...prev.dates,
                              deadlines: (prev.dates.deadlines || []).map(d => 
                                d.id === deadline.id ? { ...d, title: e.target.value } : d
                              )
                            }
                          }));
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={deadline.description}
                      onChange={(e) => {
                        setAdmissionsData(prev => ({
                          ...prev,
                          dates: {
                            ...prev.dates,
                            deadlines: prev.dates.deadlines.map(d => 
                              d.id === deadline.id ? { ...d, description: e.target.value } : d
                            )
                          }
                        }));
                      }}
                      rows={2}
                    />
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Features (comma separated)</label>
                    <Input
                      value={deadline.features.join(', ')}
                      onChange={(e) => {
                        setAdmissionsData(prev => ({
                          ...prev,
                          dates: {
                            ...prev.dates,
                            deadlines: prev.dates.deadlines.map(d => 
                              d.id === deadline.id ? { ...d, features: e.target.value.split(', ').filter(f => f.trim()) } : d
                            )
                          }
                        }));
                      }}
                      placeholder="Merit aid, Priority housing"
                    />
                  </div>
                </div>
              ))}
              
              <Button
                onClick={() => {
                  const newDeadline = {
                    id: (() => {
                      const existingIds = (admissionsData.dates.deadlines || []).map(deadline => deadline.id).filter(id => /^\d+$/.test(id)).map(id => parseInt(id));
                      return (existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1).toString();
                    })(),
                    month: "Jan",
                    day: "15",
                    tag: "Regular",
                    title: "New Deadline",
                    description: "Deadline description",
                    features: ["Feature"]
                  };
                  setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      dates: {
                        ...prev.dates,
                        deadlines: [...prev.dates.deadlines, newDeadline]
                      }
                    };
                  });
                }}
                className="w-fit"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Deadline
              </Button>
            </div>
          </motion.div>
        )}

        {/* Affordability Section */}
        {activeSection === 'affordability' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold">Affordability</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Section Title</label>
                <Input
                  value={admissionsData?.affordability?.title || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      affordability: { ...prev.affordability, title: e.target.value }
                    };
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Section Subtitle</label>
                <Input
                  value={admissionsData?.affordability?.subtitle || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      affordability: { ...prev.affordability, subtitle: e.target.value }
                    };
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tab Names (comma separated)</label>
                <Input
                  value={admissionsData?.affordability?.tabs?.join(', ') || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      affordability: { 
                        ...prev.affordability, 
                        tabs: e.target.value.split(', ').filter(tab => tab.trim()) 
                      }
                    };
                  })}
                  placeholder="Tuition & Fees (2025), Scholarships & Grants, Payment Plans"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Tab Content</h4>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tuition & Fees Content</label>
                <Textarea
                  value={admissionsData?.affordability?.content?.tuition || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      affordability: { 
                        ...prev.affordability, 
                        content: { ...prev.affordability.content, tuition: e.target.value }
                      }
                    };
                  })}
                  rows={3}
                  placeholder="Estimated tuition: $28,500 per year..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Scholarships & Grants Content</label>
                <Textarea
                  value={admissionsData?.affordability?.content?.scholarships || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      affordability: { 
                        ...prev.affordability, 
                        content: { ...prev.affordability.content, scholarships: e.target.value }
                      }
                    };
                  })}
                  rows={3}
                  placeholder="Automatic merit scholarships are awarded..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Payment Plans Content</label>
                <Textarea
                  value={admissionsData?.affordability?.content?.payments || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      affordability: { 
                        ...prev.affordability, 
                        content: { ...prev.affordability.content, payments: e.target.value }
                      }
                    };
                  })}
                  rows={3}
                  placeholder="Monthly, interest-free plans available..."
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Campus Tours Section */}
        {activeSection === 'campus' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold">Campus Tours</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Section Title</label>
                <Input
                  value={admissionsData?.campus?.title || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      campus: { ...prev.campus, title: e.target.value }
                    };
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Section Subtitle</label>
                <Input
                  value={admissionsData?.campus?.subtitle || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      campus: { ...prev.campus, subtitle: e.target.value }
                    };
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={admissionsData?.campus?.description || ''}
                  onChange={(e) => setAdmissionsData(prev => {
                    if (!prev) return getDefaultAdmissionsData();
                    return {
                      ...prev,
                      campus: { ...prev.campus, description: e.target.value }
                    };
                  })}
                  rows={3}
                  placeholder="Can't visit? Join a virtual info session or book a 1:1 with our admissions team."
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Campus Images (Up to 10)</h4>
              
              {/* Image Upload */}
              <div className="border-2 border-dashed border-border rounded-lg p-6">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    if (!admissionsData) return;
                    const files = Array.from(e.target.files || []);
                    files.forEach(file => {
                      if ((admissionsData?.campus?.images?.length || 0) < 10) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const imageUrl = event.target?.result as string;
                          setAdmissionsData(prev => {
                            if (!prev) return getDefaultAdmissionsData();
                            return {
                              ...prev,
                              campus: {
                                ...prev.campus,
                                images: [...(prev.campus.images || []), imageUrl]
                              }
                            };
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    });
                  }}
                  className="hidden"
                  id="campus-images"
                />
                <label
                  htmlFor="campus-images"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    Click to upload campus images<br />
                    <span className="text-xs">({admissionsData?.campus?.images?.length || 0}/10 images)</span>
                  </p>
                </label>
              </div>
              
              {/* Image Gallery */}
              {(admissionsData?.campus?.images?.length || 0) > 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {admissionsData?.campus?.images?.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Campus ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setAdmissionsData(prev => ({
                              ...prev,
                              campus: {
                                ...prev.campus,
                                images: prev.campus.images.filter((_, i) => i !== index)
                              }
                            }));
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
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdmissionsPageManager;