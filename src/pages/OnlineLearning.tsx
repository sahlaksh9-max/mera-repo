import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, Monitor, Users, Clock, Award, Play, Download, Wifi, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

const OnlineLearning = () => {
  const stats = [
    { number: "200+", label: "Online Courses" },
    { number: "24/7", label: "Access Available" },
    { number: "15,000+", label: "Online Students" },
    { number: "95%", label: "Completion Rate" }
  ];

  const features = [
    {
      icon: Monitor,
      title: "Interactive Learning",
      description: "Engaging multimedia content with interactive simulations and virtual labs."
    },
    {
      icon: Users,
      title: "Live Sessions",
      description: "Real-time classes with expert instructors and peer collaboration opportunities."
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Learn at your own pace with 24/7 access to course materials and resources."
    },
    {
      icon: Award,
      title: "Accredited Programs",
      description: "Fully accredited courses and degrees recognized by employers worldwide."
    }
  ];

  const programs = [
    {
      category: "Undergraduate Online",
      courses: [
        { name: "Bachelor of Business Administration", duration: "4 years", format: "Hybrid" },
        { name: "Bachelor of Computer Science", duration: "4 years", format: "Fully Online" },
        { name: "Bachelor of Psychology", duration: "4 years", format: "Hybrid" },
        { name: "Bachelor of Education", duration: "4 years", format: "Fully Online" }
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      category: "Graduate Online",
      courses: [
        { name: "Master of Business Administration (MBA)", duration: "2 years", format: "Hybrid" },
        { name: "Master of Data Science", duration: "1.5 years", format: "Fully Online" },
        { name: "Master of Education", duration: "2 years", format: "Hybrid" },
        { name: "Master of Public Health", duration: "2 years", format: "Fully Online" }
      ],
      color: "from-green-500 to-emerald-500"
    },
    {
      category: "Professional Certificates",
      courses: [
        { name: "Digital Marketing Certificate", duration: "6 months", format: "Self-Paced" },
        { name: "Project Management Certificate", duration: "4 months", format: "Self-Paced" },
        { name: "Data Analytics Certificate", duration: "8 months", format: "Self-Paced" },
        { name: "Cybersecurity Certificate", duration: "6 months", format: "Self-Paced" }
      ],
      color: "from-purple-500 to-pink-500"
    },
    {
      category: "Continuing Education",
      courses: [
        { name: "Professional Development Workshops", duration: "Varies", format: "Live Online" },
        { name: "Industry-Specific Training", duration: "Varies", format: "Self-Paced" },
        { name: "Leadership Development", duration: "3 months", format: "Hybrid" },
        { name: "Technical Skills Bootcamps", duration: "12 weeks", format: "Live Online" }
      ],
      color: "from-orange-500 to-red-500"
    }
  ];

  const platforms = [
    {
      name: "Learning Management System",
      description: "Comprehensive platform for course delivery, assignments, and progress tracking.",
      features: ["Course materials", "Assignment submission", "Grade tracking", "Discussion forums"]
    },
    {
      name: "Virtual Classroom",
      description: "Interactive online classroom environment for live lectures and seminars.",
      features: ["HD video conferencing", "Screen sharing", "Breakout rooms", "Recording capabilities"]
    },
    {
      name: "Mobile Learning App",
      description: "Learn on-the-go with our mobile application for iOS and Android devices.",
      features: ["Offline content", "Push notifications", "Progress sync", "Mobile-optimized content"]
    },
    {
      name: "Virtual Labs",
      description: "Simulated laboratory environments for hands-on learning experiences.",
      features: ["3D simulations", "Virtual experiments", "Real-time feedback", "Safety protocols"]
    }
  ];

  const support = [
    {
      service: "Technical Support",
      description: "24/7 technical assistance for platform issues and troubleshooting.",
      availability: "24/7"
    },
    {
      service: "Academic Advising",
      description: "Personalized guidance for course selection and academic planning.",
      availability: "Business Hours"
    },
    {
      service: "Tutoring Services",
      description: "One-on-one and group tutoring sessions with qualified instructors.",
      availability: "Scheduled"
    },
    {
      service: "Career Services",
      description: "Job placement assistance and career counseling for online students.",
      availability: "Business Hours"
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
              <Link to="/">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Home</span>
                </Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Button>
              </Link>
            </div>
            <h1 className="text-2xl font-heading font-bold text-gradient-gold">Online Learning</h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-background to-blue-500/20"></div>
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
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 mb-6"
            >
              <Monitor className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              Online <span className="text-gradient-gold">Learning</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Experience world-class education from anywhere in the world. Our comprehensive online programs 
              offer the same rigorous academics and personal attention as our on-campus experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-r from-cyan-500/10 via-background to-blue-500/10">
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

      {/* Features */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Why Choose Online Learning?
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the benefits of flexible, high-quality education designed for modern learners.
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
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
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

      {/* Online Programs */}
      <section className="section-padding bg-gradient-to-b from-muted/20 to-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Online Programs
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from a wide range of online programs designed to fit your schedule and career goals.
            </p>
          </motion.div>

          <div className="space-y-8">
            {programs.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className={`bg-gradient-to-r ${category.color} p-6 text-white`}>
                  <h4 className="text-2xl font-heading font-bold">{category.category}</h4>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {category.courses.map((course, cIndex) => (
                      <div key={cIndex} className="bg-muted/20 rounded-lg p-4">
                        <h5 className="font-semibold text-foreground mb-2">{course.name}</h5>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{course.duration}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Monitor className="h-4 w-4" />
                            <span>{course.format}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Platforms */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Learning Platforms
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              State-of-the-art technology platforms designed to enhance your online learning experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {platforms.map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 hover:shadow-lg transition-all duration-300"
              >
                <h4 className="text-2xl font-heading font-bold mb-4 text-gradient-gold">
                  {platform.name}
                </h4>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {platform.description}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {platform.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-center space-x-2">
                      <Play className="h-4 w-4 text-gold flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Support */}
      <section className="section-padding bg-gradient-to-b from-muted/20 to-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Student Support Services
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive support services to ensure your success in online learning.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {support.map((service, index) => (
              <motion.div
                key={service.service}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-heading font-bold text-gradient-gold">
                    {service.service}
                  </h4>
                  <span className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full text-sm font-medium text-gold">
                    {service.availability}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Wifi className="h-16 w-16 text-gold mx-auto mb-6" />
            <h3 className="text-3xl font-heading font-bold mb-6 text-gradient-gold">
              Start Your Online Journey
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of students who are advancing their careers through our flexible online programs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/admissions">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                  <Play className="h-4 w-4 mr-2" />
                  Enroll Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Brochure
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default OnlineLearning;
