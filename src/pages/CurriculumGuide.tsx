import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, BookOpen, Download, Calendar, Users, Award, Clock, GraduationCap, Target, Globe, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

const CurriculumGuide = () => {
  const gradePrograms = [
    {
      grade: "Grades K-5",
      title: "Elementary Program",
      description: "Foundation building through play-based learning and core skill development",
      subjects: [
        { name: "Language Arts", hours: "90 min/day", description: "Reading, writing, speaking, listening" },
        { name: "Mathematics", hours: "60 min/day", description: "Number sense, basic operations, problem solving" },
        { name: "Science", hours: "45 min/day", description: "Nature studies, simple experiments, observation" },
        { name: "Social Studies", hours: "30 min/day", description: "Community, culture, basic geography" },
        { name: "Arts & Music", hours: "60 min/day", description: "Creative expression, music appreciation" },
        { name: "Physical Education", hours: "45 min/day", description: "Motor skills, health, teamwork" }
      ],
      totalHours: "6.5 hours/day",
      color: "from-green-500 to-emerald-500"
    },
    {
      grade: "Grades 6-8",
      title: "Middle School Program",
      description: "Transition to subject-specific learning with increased academic rigor",
      subjects: [
        { name: "English Language Arts", hours: "50 min/day", description: "Literature, composition, grammar" },
        { name: "Mathematics", hours: "50 min/day", description: "Pre-algebra, algebra, geometry" },
        { name: "Science", hours: "50 min/day", description: "Life science, earth science, physical science" },
        { name: "Social Studies", hours: "50 min/day", description: "World history, geography, civics" },
        { name: "World Languages", hours: "40 min/day", description: "Spanish, French, or Mandarin" },
        { name: "Arts Electives", hours: "40 min/day", description: "Visual arts, music, drama" },
        { name: "Physical Education", hours: "40 min/day", description: "Fitness, sports, health education" }
      ],
      totalHours: "7 hours/day",
      color: "from-blue-500 to-cyan-500"
    },
    {
      grade: "Grades 9-12",
      title: "High School Program",
      description: "College preparatory curriculum with AP courses and specialized tracks",
      subjects: [
        { name: "English", hours: "4 credits", description: "Literature, composition, AP options" },
        { name: "Mathematics", hours: "4 credits", description: "Algebra through Calculus, Statistics" },
        { name: "Science", hours: "4 credits", description: "Biology, Chemistry, Physics, AP options" },
        { name: "Social Studies", hours: "4 credits", description: "World History, US History, Government" },
        { name: "World Languages", hours: "3 credits", description: "Continued language study" },
        { name: "Fine Arts", hours: "2 credits", description: "Visual arts, music, drama" },
        { name: "Electives", hours: "7 credits", description: "Specialized courses, career prep" }
      ],
      totalHours: "28 credits required",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const specialPrograms = [
    {
      title: "Advanced Placement (AP)",
      description: "College-level courses with potential for university credit",
      courses: ["AP English Literature", "AP Calculus BC", "AP Biology", "AP Chemistry", "AP Physics", "AP History", "AP Psychology", "AP Computer Science"],
      icon: Award
    },
    {
      title: "International Baccalaureate (IB)",
      description: "Globally recognized program emphasizing critical thinking",
      courses: ["IB English", "IB Mathematics", "IB Sciences", "IB History", "IB Languages", "Theory of Knowledge"],
      icon: Globe
    },
    {
      title: "STEM Academy",
      description: "Specialized track for science and technology careers",
      courses: ["Engineering Design", "Robotics", "Data Science", "Environmental Science", "Research Methods"],
      icon: Target
    },
    {
      title: "Arts Conservatory",
      description: "Intensive arts education for creative careers",
      courses: ["Studio Art", "Digital Media", "Music Performance", "Theater Arts", "Creative Writing"],
      icon: Palette
    }
  ];

  const graduationRequirements = [
    { subject: "English", credits: 4, description: "Including composition and literature" },
    { subject: "Mathematics", credits: 4, description: "Through Algebra II minimum" },
    { subject: "Science", credits: 4, description: "Including Biology, Chemistry, Physics" },
    { subject: "Social Studies", credits: 4, description: "World History, US History, Government" },
    { subject: "World Languages", credits: 3, description: "Same language for 3 consecutive years" },
    { subject: "Fine Arts", credits: 2, description: "Visual arts, music, or drama" },
    { subject: "Physical Education", credits: 2, description: "Health and fitness education" },
    { subject: "Electives", credits: 5, description: "Career-focused or interest-based courses" }
  ];

  const assessmentMethods = [
    {
      method: "Formative Assessment",
      description: "Ongoing evaluation through quizzes, discussions, and projects",
      frequency: "Daily/Weekly"
    },
    {
      method: "Summative Assessment", 
      description: "Major tests, final projects, and comprehensive evaluations",
      frequency: "End of units/semesters"
    },
    {
      method: "Performance Assessment",
      description: "Real-world applications, presentations, and portfolios",
      frequency: "Throughout semester"
    },
    {
      method: "Standardized Testing",
      description: "State assessments, AP exams, SAT/ACT preparation",
      frequency: "Annual/As scheduled"
    }
  ];

  const achievements = [
    { stat: "28", label: "Credits Required for Graduation" },
    { stat: "25+", label: "AP Courses Offered" },
    { stat: "98%", label: "College Acceptance Rate" },
    { stat: "15:1", label: "Student-Teacher Ratio" }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header with Back Button */}
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container-wide py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link to="/academics">
                <Button variant="outline" size="sm" className="flex items-center space-x-1 sm:space-x-2 touch-manipulation">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back to Academics</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-1 sm:space-x-2 touch-manipulation">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Home</span>
                </Button>
              </Link>
            </div>
            <h1 className="text-lg sm:text-2xl font-heading font-bold text-gradient-gold">Curriculum Guide</h1>
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
              <BookOpen className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              Curriculum <span className="text-gradient-gold">Guide</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Comprehensive overview of our academic programs, graduation requirements, and educational pathways 
              designed to prepare students for success in higher education and beyond.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="section-padding bg-gradient-to-r from-royal/10 via-background to-gold/10">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-gradient-gold mb-2">
                  {achievement.stat}
                </div>
                <div className="text-muted-foreground font-medium">
                  {achievement.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Grade Level Programs */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Academic Programs by Grade Level
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Progressive curriculum designed to build knowledge and skills at each developmental stage.
            </p>
          </motion.div>

          <div className="space-y-12">
            {gradePrograms.map((program, index) => (
              <motion.div
                key={program.grade}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className={`bg-gradient-to-r ${program.color} p-6 text-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-2xl font-heading font-bold mb-2">{program.title}</h4>
                      <p className="text-lg font-medium opacity-90">{program.grade}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{program.totalHours}</div>
                      <div className="text-sm opacity-80">Daily Schedule</div>
                    </div>
                  </div>
                  <p className="mt-4 opacity-90">{program.description}</p>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {program.subjects.map((subject, sIndex) => (
                      <div key={sIndex} className="bg-muted/20 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-foreground">{subject.name}</h5>
                          <span className="text-sm text-gold font-medium">{subject.hours}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{subject.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Programs */}
      <section className="section-padding bg-gradient-to-b from-muted/20 to-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Specialized Academic Programs
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced and specialized programs for students seeking enhanced academic challenges.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {specialPrograms.map((program, index) => (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-royal to-gold flex items-center justify-center">
                    <program.icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-2xl font-heading font-bold text-gradient-gold">
                    {program.title}
                  </h4>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {program.description}
                </p>
                <div>
                  <h5 className="font-semibold mb-4 text-foreground">Available Courses:</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {program.courses.map((course, cIndex) => (
                      <div key={cIndex} className="flex items-center space-x-2">
                        <GraduationCap className="h-4 w-4 text-gold flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{course}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Graduation Requirements */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Graduation Requirements
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Credit requirements for high school graduation and college preparation.
            </p>
          </motion.div>

          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {graduationRequirements.map((req, index) => (
                <motion.div
                  key={req.subject}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start space-x-4 p-4 bg-muted/20 rounded-lg"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-royal to-gold flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">{req.credits}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-heading font-bold text-foreground mb-2">
                      {req.subject}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {req.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-royal/20 to-gold/20 px-6 py-3 rounded-lg">
                <Award className="h-5 w-5 text-gold" />
                <span className="font-semibold text-foreground">Total: 28 Credits Required for Graduation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Methods */}
      <section className="section-padding bg-gradient-to-b from-muted/20 to-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Assessment & Evaluation
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive assessment methods to measure student progress and achievement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {assessmentMethods.map((method, index) => (
              <motion.div
                key={method.method}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-heading font-bold text-gradient-gold">
                    {method.method}
                  </h4>
                  <span className="px-3 py-1 bg-gradient-to-r from-royal/20 to-gold/20 rounded-full text-sm font-medium text-gold">
                    {method.frequency}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {method.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-royal/10 to-gold/10 border border-border rounded-lg p-12 text-center"
          >
            <Download className="h-16 w-16 text-gold mx-auto mb-6" />
            <h3 className="text-3xl font-heading font-bold mb-6 text-gradient-gold">
              Download Complete Curriculum Guide
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get the detailed PDF version of our curriculum guide with course descriptions, 
              prerequisites, and academic planning information.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button className="bg-gradient-to-r from-royal to-gold hover:from-royal/80 hover:to-gold/80 text-white">
                <Download className="h-4 w-4 mr-2" />
                Download PDF Guide
              </Button>
              <Link to="/contact">
                <Button variant="outline">
                  Schedule Academic Consultation
                </Button>
              </Link>
            </div>
          </motion.div>
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
            <Clock className="h-16 w-16 text-gold mx-auto mb-6" />
            <h3 className="text-3xl font-heading font-bold mb-6 text-gradient-gold">
              Ready to Begin Your Academic Journey?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore our comprehensive curriculum and discover the educational opportunities that await you at Royal Academy.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/admissions">
                <Button className="bg-gradient-to-r from-royal to-gold hover:from-royal/80 hover:to-gold/80 text-white">
                  Apply for Admission
                </Button>
              </Link>
              <Link to="/academics">
                <Button variant="outline">
                  Explore Academic Departments
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CurriculumGuide;
