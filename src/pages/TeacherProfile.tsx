import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Home, GraduationCap, Award, BookOpen, Mail, Phone, Calendar, MapPin, Star, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

const TeacherProfile = () => {
  const { teacherId } = useParams();
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load teacher data from localStorage
    const savedData = localStorage.getItem('royal-academy-teachers');
    if (savedData) {
      const departments = JSON.parse(savedData);
      // Find the teacher by ID across all departments
      let foundTeacher = null;
      for (const department of departments) {
        foundTeacher = department.teachers.find((t: any) => t.id === teacherId);
        if (foundTeacher) break;
      }
      
      if (foundTeacher) {
        // Enhance teacher data with additional profile information
        const enhancedTeacher = {
          ...foundTeacher,
          email: foundTeacher.email || `${foundTeacher.name.toLowerCase().replace(/\s+/g, '.')}@royalacademy.edu`,
          phone: foundTeacher.phone || "(555) 123-4567",
          office: foundTeacher.office || "Main Building, Room 101",
          officeHours: foundTeacher.officeHours || "Monday-Friday: 2:00-4:00 PM",
          biography: foundTeacher.biography || `${foundTeacher.name} brings ${foundTeacher.experience} of expertise to Royal Academy. With ${foundTeacher.education}, they have dedicated their career to making ${foundTeacher.subject} accessible and engaging for students. Their innovative teaching methods have helped countless students excel in their field.`,
          courses: foundTeacher.courses && foundTeacher.courses.length > 0 ? foundTeacher.courses : [
            {
              name: foundTeacher.subject,
              description: `Comprehensive course covering ${foundTeacher.subject}`,
              level: "Grades 11-12",
              prerequisites: "Previous coursework in related subjects"
            }
          ],
          philosophy: foundTeacher.philosophy || `"Education is about inspiring students to reach their full potential. I believe every student can succeed when given the right support, encouragement, and real-world connections."`,
          awards: foundTeacher.awards || [
            { year: "2023", award: "Excellence in Teaching - Royal Academy" },
            { year: "2022", award: "Outstanding Faculty Member" }
          ]
        };
        setTeacher(enhancedTeacher);
      }
    }
    setLoading(false);
  }, [teacherId]);

  // Default fallback data if teacher not found
  const defaultTeacher = {
    name: "Teacher Not Found",
    position: "Faculty Member",
    subject: "Various Subjects",
    image: "/api/placeholder/400/500",
    experience: "0 years",
    education: "N/A",
    email: "contact@royalacademy.edu",
    phone: "(555) 123-4567",
    office: "Main Building",
    officeHours: "By appointment",
    specialties: [],
    achievements: [],
    biography: "Teacher profile not found.",
    courses: [],
    philosophy: "Education is the key to success.",
    awards: []
  };

  const currentTeacher = teacher || defaultTeacher;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-royal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading teacher profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header with Back Button */}
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container-wide py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/our-teachers">
                <Button variant="outline" size="sm" className="flex items-center space-x-2 text-black dark:text-white">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Teachers</span>
                </Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-black dark:text-white">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Button>
              </Link>
            </div>
            <h1 className="text-2xl font-heading font-bold text-gradient-gold text-black dark:text-gold">Teacher Profile</h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal/20 via-background to-gold/20"></div>
        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              {/* Teacher Photo and Basic Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-1"
              >
                <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 text-center">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-r from-royal to-gold mx-auto mb-6 flex items-center justify-center overflow-hidden">
                    {currentTeacher.image && currentTeacher.image.startsWith('data:') ? (
                      <img src={currentTeacher.image} alt={currentTeacher.name} className="w-full h-full object-cover" />
                    ) : (
                      <GraduationCap className="h-24 w-24 text-white" />
                    )}
                  </div>
                  <h2 className="text-3xl font-heading font-bold text-gradient-gold mb-2">
                    {currentTeacher.name}
                  </h2>
                  <p className="text-lg font-medium text-black dark:text-foreground mb-2">{currentTeacher.position}</p>
                  <p className="text-muted-foreground mb-6">{currentTeacher.subject}</p>
                  
                  <div className="space-y-3 text-left">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gold" />
                      <span className="text-sm text-muted-foreground">{currentTeacher.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gold" />
                      <span className="text-sm text-muted-foreground">{currentTeacher.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-gold" />
                      <span className="text-sm text-muted-foreground">{currentTeacher.office}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-gold" />
                      <span className="text-sm text-muted-foreground">{currentTeacher.officeHours}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-2 space-y-8"
              >
                {/* Biography */}
                <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8">
                  <h3 className="text-2xl font-heading font-bold text-gradient-gold mb-4">About {currentTeacher.name.split(' ')[1] || currentTeacher.name}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{currentTeacher.biography}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-black dark:text-foreground mb-3">Experience & Education</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gold" />
                          <span className="text-sm text-muted-foreground">{currentTeacher.experience} teaching experience</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <GraduationCap className="h-4 w-4 text-gold" />
                          <span className="text-sm text-muted-foreground">{currentTeacher.education}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-black dark:text-foreground mb-3">Specialties</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentTeacher.specialties.map((specialty: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gradient-to-r from-royal/20 to-gold/20 border border-border rounded-full text-xs text-muted-foreground"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Teaching Philosophy */}
                <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8">
                  <h3 className="text-2xl font-heading font-bold text-gradient-gold mb-4">Teaching Philosophy</h3>
                  <p className="text-muted-foreground leading-relaxed italic">"{currentTeacher.philosophy}"</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Courses Taught */}
      <section className="section-padding bg-gradient-to-b from-muted/20 to-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Courses Taught
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Current courses and curriculum developed by {currentTeacher.name.split(' ')[1] || currentTeacher.name}.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentTeacher.courses.map((course: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <BookOpen className="h-6 w-6 text-gold" />
                  <h4 className="text-xl font-heading font-bold text-gradient-gold">{course.name}</h4>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">{course.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gold" />
                    <span className="text-sm text-muted-foreground">{course.level}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-gold" />
                    <span className="text-sm text-muted-foreground">{course.prerequisites}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements and Awards */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Recent Achievements */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-3xl font-heading font-bold mb-8 text-gradient-gold">Recent Achievements</h3>
              <div className="space-y-4">
                {currentTeacher.achievements.map((achievement: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-4 bg-card/30 rounded-lg"
                  >
                    <Award className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{achievement}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Awards Timeline */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-3xl font-heading font-bold mb-8 text-gradient-gold">Awards & Recognition</h3>
              <div className="space-y-6">
                {currentTeacher.awards.map((award: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-royal to-gold flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">{award.year}</span>
                    </div>
                    <div className="pt-2">
                      <h4 className="font-semibold text-foreground">{award.award}</h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-gradient-to-r from-royal/10 to-gold/10">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Mail className="h-16 w-16 text-gold mx-auto mb-6" />
            <h3 className="text-3xl font-heading font-bold mb-6 text-gradient-gold">
              Get in Touch
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Have questions about courses or want to schedule a meeting? {currentTeacher.name.split(' ')[1] || currentTeacher.name} is available during office hours or by appointment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a href={`mailto:${currentTeacher.email}`}>
                <Button className="bg-gradient-to-r from-royal to-gold hover:from-royal/80 hover:to-gold/80 text-white">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </a>
              <Link to="/our-teachers">
                <Button variant="outline">
                  View All Teachers
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TeacherProfile;
