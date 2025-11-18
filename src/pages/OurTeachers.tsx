import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, Users, GraduationCap, Award, BookOpen, Globe, Star, Mail, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

const OurTeachers = () => {
  const [departments, setDepartments] = useState([
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
          achievements: ["Teacher of the Year 2023", "Published 12 research papers", "Math Olympiad Coach"]
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
          achievements: ["Science Fair Judge", "NASA Educator Fellow", "Robotics Team Mentor"]
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
          achievements: ["Published Novelist", "Poetry Contest Judge", "Writing Workshop Leader"]
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
          achievements: ["Gallery Exhibitions", "Art Competition Judge", "Student Portfolio Mentor"]
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
          achievements: ["Historical Society Member", "Documentary Consultant", "Debate Team Coach"]
        }
      ]
    }
  ]);

  // Load teacher data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('royal-academy-teachers');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Ensure all departments have a teachers array
        const validDepartments = parsed.map((dept: any) => ({
          ...dept,
          teachers: dept.teachers || []
        }));
        setDepartments(validDepartments);
      } catch (error) {
        console.error('[OurTeachers] Error loading teacher data:', error);
      }
    }
  }, []);

  const stats = [
    { number: "95%", label: "Teachers with Advanced Degrees" },
    { number: "15", label: "Average Years Experience" },
    { number: "12:1", label: "Student-Teacher Ratio" },
    { number: "25+", label: "Teaching Excellence Awards" }
  ];

  const teachingPhilosophy = [
    {
      title: "Student-Centered Learning",
      description: "Every lesson is designed around student needs, interests, and learning styles.",
      icon: Users
    },
    {
      title: "Innovation in Education",
      description: "Incorporating cutting-edge teaching methods and educational technology.",
      icon: Star
    },
    {
      title: "Character Development",
      description: "Building not just academic knowledge but moral character and leadership skills.",
      icon: Award
    },
    {
      title: "Lifelong Learning",
      description: "Inspiring curiosity and a passion for continuous learning and growth.",
      icon: BookOpen
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header with Back Button */}
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container-wide py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/about">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to About</span>
                </Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Button>
              </Link>
            </div>
            <h1 className="text-2xl font-heading font-bold text-gradient-gold">Our Teachers</h1>
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
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-royal to-gold mb-6"
            >
              <Users className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              Our <span className="text-gradient-gold">Teachers</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Meet our exceptional faculty - dedicated educators, researchers, and mentors who bring passion, 
              expertise, and innovation to every classroom at Royal Academy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-r from-royal/10 via-background to-gold/10">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-gradient-gold mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Philosophy */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Our Teaching Philosophy
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide our educators in creating exceptional learning experiences.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teachingPhilosophy.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-royal to-gold flex items-center justify-center mx-auto mb-4">
                  <principle.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-heading font-bold mb-3 text-gradient-gold">
                  {principle.title}
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {principle.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty by Department */}
      <section className="section-padding bg-gradient-to-b from-muted/20 to-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Meet Our Faculty
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the talented educators who make Royal Academy a place of academic excellence.
            </p>
          </motion.div>

          <div className="space-y-16">
            {departments.map((department, deptIndex) => (
              <motion.div
                key={department.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: deptIndex * 0.1 }}
              >
                <div className={`bg-gradient-to-r ${department.color} p-6 rounded-t-lg`}>
                  <h4 className="text-2xl font-heading font-bold text-white">
                    {department.name}
                  </h4>
                </div>
                
                <div className="bg-card/50 backdrop-blur-sm border border-border border-t-0 rounded-b-lg p-8">
                  {(!department.teachers || department.teachers.length === 0) ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No teachers in this department yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {(department.teachers || []).map((teacher, teacherIndex) => (
                      <motion.div
                        key={teacher.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ duration: 0.5, delay: teacherIndex * 0.1 }}
                        className="bg-background/50 border border-border rounded-lg p-4 sm:p-6 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="text-center mb-4 sm:mb-6">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-royal to-gold mx-auto mb-4 flex items-center justify-center overflow-hidden">
                            {teacher.image.startsWith('data:') ? (
                              <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
                            ) : (
                              <GraduationCap className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                            )}
                          </div>
                          <h5 className="text-lg sm:text-xl font-heading font-bold text-gradient-gold mb-1 sm:mb-2">
                            {teacher.name}
                          </h5>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-1">{teacher.position}</p>
                          <p className="text-xs sm:text-sm font-medium text-foreground">{teacher.subject}</p>
                        </div>

                        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gold" />
                            <span className="text-xs sm:text-sm text-muted-foreground">{teacher.experience} experience</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 text-gold" />
                            <span className="text-xs sm:text-sm text-muted-foreground">{teacher.education}</span>
                          </div>
                        </div>

                        {teacher.specialties && teacher.specialties.length > 0 && (
                          <div className="mb-4 sm:mb-6">
                            <h6 className="font-semibold text-xs sm:text-sm mb-2 text-foreground">Specialties:</h6>
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                              {teacher.specialties.map((specialty, sIndex) => (
                                <span
                                  key={sIndex}
                                  className="px-2 py-1 bg-gradient-to-r from-royal/20 to-gold/20 border border-border rounded-full text-xs text-muted-foreground"
                                >
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {teacher.achievements && teacher.achievements.length > 0 && (
                          <div className="mb-4 sm:mb-6">
                            <h6 className="font-semibold text-xs sm:text-sm mb-2 text-foreground">Recent Achievements:</h6>
                            <ul className="space-y-1">
                              {teacher.achievements.slice(0, 2).map((achievement, aIndex) => (
                                <li key={aIndex} className="flex items-start space-x-2">
                                  <Award className="h-3 w-3 text-gold mt-1 flex-shrink-0" />
                                  <span className="text-xs text-muted-foreground">{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <Link to={`/teacher/${teacher.id}`}>
                          <Button className="w-full bg-gradient-to-r from-royal to-gold hover:from-royal/80 hover:to-gold/80 text-white text-sm sm:text-base">
                            Learn More
                          </Button>
                        </Link>
                      </motion.div>
                    ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-royal/10 to-gold/10">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Users className="h-16 w-16 text-gold mx-auto mb-6" />
            <h3 className="text-3xl font-heading font-bold mb-6 text-gradient-gold">
              Join Our Teaching Community
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Are you a passionate educator looking to make a difference? Explore career opportunities at Royal Academy.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/contact">
                <Button className="bg-gradient-to-r from-royal to-gold hover:from-royal/80 hover:to-gold/80 text-white">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact HR Department
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline">
                  Learn About Our School
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default OurTeachers;
