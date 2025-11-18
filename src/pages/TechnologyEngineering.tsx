import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, Cpu, Cog, Code, Zap, Award, Clock, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useState } from "react";

const TechnologyEngineering = () => {
  const [openFAQ, setOpenFAQ] = useState<number[]>([]);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const courses = [
    {
      name: "Computer Science",
      description: "Comprehensive programming and software development curriculum covering multiple languages and development methodologies.",
      details: [
        "Python, Java, and C++ programming",
        "Data structures and algorithms",
        "Web development (HTML, CSS, JavaScript)",
        "Database design and management",
        "Software engineering principles"
      ],
      prerequisites: "Algebra II or concurrent enrollment",
      duration: "Full academic year",
      credits: "4 credits (AP option available)"
    },
    {
      name: "Robotics",
      description: "Hands-on engineering and programming through robot design, construction, and competition preparation.",
      details: [
        "Mechanical design and CAD modeling",
        "Sensor integration and programming",
        "Motor control and automation",
        "Competition robot development",
        "Team collaboration and project management"
      ],
      prerequisites: "Geometry and basic programming knowledge",
      duration: "Full academic year",
      credits: "3 credits"
    },
    {
      name: "Engineering Design",
      description: "Introduction to engineering principles through design thinking, prototyping, and problem-solving methodologies.",
      details: [
        "Design thinking and innovation process",
        "3D modeling and CAD software",
        "Prototyping and testing methods",
        "Materials science fundamentals",
        "Engineering ethics and sustainability"
      ],
      prerequisites: "Physics I and Algebra II",
      duration: "Full academic year",
      credits: "4 credits"
    },
    {
      name: "Data Science",
      description: "Statistical analysis, machine learning, and data visualization using modern tools and programming languages.",
      details: [
        "Statistical analysis with Python/R",
        "Data visualization and interpretation",
        "Machine learning fundamentals",
        "Big data processing techniques",
        "Real-world data science projects"
      ],
      prerequisites: "Statistics and Computer Science I",
      duration: "Semester",
      credits: "3 credits"
    }
  ];

  const features = [
    {
      icon: Code,
      title: "Modern Programming",
      description: "Learn industry-standard programming languages and development tools used by professionals."
    },
    {
      icon: Cog,
      title: "Hands-On Engineering",
      description: "Design, build, and test real engineering solutions to complex problems."
    },
    {
      icon: Cpu,
      title: "Cutting-Edge Technology",
      description: "Work with the latest technology including AI, robotics, and data science tools."
    },
    {
      icon: Zap,
      title: "Innovation Focus",
      description: "Develop creative problem-solving skills and entrepreneurial thinking."
    }
  ];

  const faqs = [
    {
      question: "What programming languages do students learn?",
      answer: "Students learn Python, Java, C++, JavaScript, HTML/CSS, and SQL. We focus on languages that are widely used in industry and provide a strong foundation for further learning. Advanced students may also explore specialized languages like R for data science."
    },
    {
      question: "Do students participate in robotics competitions?",
      answer: "Yes! Our robotics teams compete in FIRST Robotics Competition, VEX Robotics, and local engineering challenges. Students gain valuable experience in teamwork, project management, and technical problem-solving through these competitions."
    },
    {
      question: "What software and tools do students use?",
      answer: "Students use professional-grade software including AutoCAD, SolidWorks, Arduino IDE, Visual Studio Code, Python IDEs, and various web development tools. We also provide access to cloud computing platforms and version control systems like Git."
    },
    {
      question: "Are there internship opportunities in technology fields?",
      answer: "We partner with local tech companies, engineering firms, and startups to provide internship opportunities. Students can also participate in summer programs at universities and technology camps to gain real-world experience."
    },
    {
      question: "How do you prepare students for technology careers?",
      answer: "Our curriculum emphasizes both technical skills and soft skills like communication, teamwork, and project management. Students work on real-world projects, participate in hackathons, and learn about technology entrepreneurship and ethics."
    },
    {
      question: "Can students earn industry certifications?",
      answer: "Yes, we offer preparation for various industry certifications including Microsoft Office Specialist, Adobe Certified Associate, and programming certifications. These credentials can give students an advantage in college applications and job searches."
    }
  ];

  const achievements = [
    { stat: "96%", label: "College STEM Readiness" },
    { stat: "15+", label: "Robotics Competition Awards" },
    { stat: "85%", label: "AP Computer Science Pass Rate" },
    { stat: "25+", label: "Student-Built Apps" }
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
            <h1 className="text-2xl font-heading font-bold text-gradient-gold">Technology & Engineering</h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-background to-purple-500/20"></div>
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
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 mb-6"
            >
              <Cpu className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              Technology & <span className="text-gradient-gold">Engineering</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Cutting-edge computer science, robotics, and engineering fundamentals. 
              Prepare for the future with hands-on experience in programming, design, and innovation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Achievements Stats */}
      <section className="section-padding bg-gradient-to-r from-cyan-500/10 via-background to-purple-500/10">
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
              Innovation & Technology
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our technology program prepares students for the digital future through hands-on learning and real-world applications.
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
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
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

      {/* Course Details */}
      <section className="section-padding bg-gradient-to-b from-muted/20 to-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Course Offerings
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive technology curriculum from programming fundamentals to advanced engineering design.
            </p>
          </motion.div>

          <div className="space-y-8">
            {courses.map((course, index) => (
              <motion.div
                key={course.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Code className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-heading font-bold mb-3 text-gradient-gold">
                      {course.name}
                    </h4>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {course.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h5 className="font-semibold mb-4 text-foreground">Course Content:</h5>
                        <ul className="space-y-2">
                          {course.details.map((detail, dIndex) => (
                            <li key={dIndex} className="flex items-start space-x-3">
                              <Award className="h-4 w-4 text-gold mt-1 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h6 className="font-semibold text-foreground mb-2">Prerequisites:</h6>
                          <p className="text-sm text-muted-foreground">{course.prerequisites}</p>
                        </div>
                        <div>
                          <h6 className="font-semibold text-foreground mb-2">Duration:</h6>
                          <p className="text-sm text-muted-foreground">{course.duration}</p>
                        </div>
                        <div>
                          <h6 className="font-semibold text-foreground mb-2">Credits:</h6>
                          <p className="text-sm text-muted-foreground">{course.credits}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Frequently Asked Questions
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get answers to common questions about our Technology & Engineering program.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/20 transition-colors"
                >
                  <span className="font-semibold text-foreground pr-4">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openFAQ.includes(index) ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    {openFAQ.includes(index) ? (
                      <Minus className="h-5 w-5 text-gold" />
                    ) : (
                      <Plus className="h-5 w-5 text-gold" />
                    )}
                  </motion.div>
                </button>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: openFAQ.includes(index) ? "auto" : 0,
                    opacity: openFAQ.includes(index) ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 pt-2 border-t border-border">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Clock className="h-16 w-16 text-gold mx-auto mb-6" />
            <h3 className="text-3xl font-heading font-bold mb-6 text-gradient-gold">
              Ready to Innovate?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our technology and engineering program and prepare for the careers of tomorrow through hands-on learning and innovation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/admissions">
                <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white">
                  Apply Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">
                  Visit Tech Labs
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TechnologyEngineering;
