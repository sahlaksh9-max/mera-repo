import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, GraduationCap, Users, BookOpen, Target, Lightbulb, Trophy, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

const SecondaryEducation = () => {
  const features = [
    {
      icon: Target,
      title: "Academic Excellence",
      description: "Rigorous curriculum designed to challenge students and prepare them for higher education."
    },
    {
      icon: Users,
      title: "Expert Faculty",
      description: "Highly qualified teachers with advanced degrees and years of teaching experience."
    },
    {
      icon: Lightbulb,
      title: "Critical Thinking",
      description: "Developing analytical skills, problem-solving abilities, and independent thinking."
    },
    {
      icon: Trophy,
      title: "Leadership Development",
      description: "Opportunities to develop leadership skills through various programs and activities."
    }
  ];

  const subjects = [
    {
      category: "Core Subjects",
      courses: [
        {
          name: "English Literature & Language",
          description: "Advanced reading, writing, and communication skills with focus on literary analysis.",
          highlights: ["Creative writing", "Literary criticism", "Public speaking", "Research skills"]
        },
        {
          name: "Mathematics",
          description: "Algebra, geometry, trigonometry, and introduction to calculus concepts.",
          highlights: ["Problem solving", "Mathematical reasoning", "Statistics", "Applied mathematics"]
        },
        {
          name: "Sciences",
          description: "Physics, Chemistry, and Biology with laboratory work and scientific inquiry.",
          highlights: ["Laboratory experiments", "Scientific method", "Research projects", "STEM integration"]
        },
        {
          name: "Social Studies",
          description: "History, geography, civics, and economics for global citizenship understanding.",
          highlights: ["World history", "Government systems", "Economic principles", "Cultural studies"]
        }
      ]
    },
    {
      category: "Specialized Programs",
      courses: [
        {
          name: "Advanced Placement (AP)",
          description: "College-level courses in various subjects for high-achieving students.",
          highlights: ["College credit", "Advanced curriculum", "University preparation", "Academic challenge"]
        },
        {
          name: "STEM Program",
          description: "Integrated Science, Technology, Engineering, and Mathematics curriculum.",
          highlights: ["Robotics", "Computer programming", "Engineering design", "Innovation projects"]
        },
        {
          name: "Arts & Humanities",
          description: "Visual arts, music, drama, and creative writing programs.",
          highlights: ["Creative expression", "Performance opportunities", "Art exhibitions", "Cultural appreciation"]
        },
        {
          name: "World Languages",
          description: "Foreign language programs including Spanish, French, and Mandarin.",
          highlights: ["Cultural immersion", "Communication skills", "Global perspective", "Exchange programs"]
        }
      ]
    }
  ];

  const gradePrograms = [
    {
      grade: "Grade 6-7",
      title: "Middle School Foundation",
      age: "Ages 11-13",
      focus: "Transition from elementary to more structured academic environment with increased independence.",
      features: ["Subject-specific teachers", "Organizational skills", "Study habits", "Social development"]
    },
    {
      grade: "Grade 8-9",
      title: "Academic Exploration",
      age: "Ages 13-15",
      focus: "Exploring interests and strengths while building strong academic foundations.",
      features: ["Elective courses", "Career exploration", "Leadership opportunities", "Community service"]
    },
    {
      grade: "Grade 10-12",
      title: "College Preparation",
      age: "Ages 15-18",
      focus: "Intensive preparation for higher education and career readiness.",
      features: ["AP courses", "College counseling", "Internship programs", "University partnerships"]
    }
  ];

  const achievements = [
    { stat: "98%", label: "College Acceptance Rate" },
    { stat: "85%", label: "AP Exam Pass Rate" },
    { stat: "15:1", label: "Student-Teacher Ratio" },
    { stat: "50+", label: "Extracurricular Activities" }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header with Back Button */}
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container-wide py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/academics">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Academics</span>
                </Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Button>
              </Link>
            </div>
            <h1 className="text-2xl font-heading font-bold text-gradient-gold">Secondary Education</h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal/20 via-background to-crimson/20"></div>
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
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-royal to-crimson mb-6"
            >
              <GraduationCap className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              Secondary <span className="text-gradient-gold">Education</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Preparing students for success in higher education and beyond through rigorous academics, 
              character development, and comprehensive college preparation programs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Achievements Stats */}
      <section className="section-padding bg-gradient-to-r from-royal/10 via-background to-crimson/10">
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

      {/* Key Features */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Excellence in Secondary Education
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our secondary program combines academic rigor with personal growth opportunities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-royal to-crimson flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-heading font-bold mb-3 text-gradient-gold">
                  {feature.title}
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Grade Programs */}
      <section className="section-padding bg-gradient-to-b from-muted/20 to-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Progressive Learning Stages
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Each stage builds upon the previous, ensuring smooth progression and academic growth.
            </p>
          </motion.div>

          <div className="space-y-8">
            {gradePrograms.map((program, index) => (
              <motion.div
                key={program.grade}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8"
              >
                <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-8">
                  <div className="lg:w-1/3">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-royal to-crimson flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-heading font-bold text-gradient-gold">
                          {program.title}
                        </h4>
                        <p className="text-muted-foreground">{program.grade} • {program.age}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {program.focus}
                    </p>
                  </div>
                  <div className="lg:w-2/3">
                    <h5 className="font-semibold mb-4">Key Features:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {program.features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-center space-x-3">
                          <Award className="h-5 w-5 text-gold flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Comprehensive Curriculum
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A well-rounded education that prepares students for university and career success.
            </p>
          </motion.div>

          <div className="space-y-12">
            {subjects.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
              >
                <h4 className="text-3xl font-heading font-bold mb-8 text-center text-gradient-gold">
                  {category.category}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {category.courses.map((course, courseIndex) => (
                    <motion.div
                      key={course.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.5, delay: courseIndex * 0.1 }}
                      className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300"
                    >
                      <h5 className="text-xl font-heading font-bold mb-3 text-gradient-gold">
                        {course.name}
                      </h5>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {course.description}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {course.highlights.map((highlight, hIndex) => (
                          <div key={hIndex} className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-gold" />
                            <span className="text-sm text-muted-foreground">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-royal/10 to-crimson/10">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Clock className="h-16 w-16 text-gold mx-auto mb-6" />
            <h3 className="text-3xl font-heading font-bold mb-6 text-gradient-gold">
              Prepare for Academic Excellence
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our secondary education program and prepare for success in higher education and beyond.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/admissions">
                <Button className="bg-gradient-to-r from-royal to-crimson hover:from-royal/80 hover:to-crimson/80 text-white">
                  Apply Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">
                  Schedule a Visit
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SecondaryEducation;
