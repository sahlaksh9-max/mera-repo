import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, GraduationCap, BookOpen, Users, Award, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

const Undergraduate = () => {
  const stats = [
    { number: "45+", label: "Undergraduate Majors" },
    { number: "12:1", label: "Student-Faculty Ratio" },
    { number: "98%", label: "Graduate Employment Rate" },
    { number: "4 Years", label: "Degree Completion" }
  ];

  const majors = [
    {
      category: "Liberal Arts & Sciences",
      programs: [
        "English Literature", "History", "Philosophy", "Psychology", 
        "Political Science", "Sociology", "Anthropology", "Economics"
      ],
      color: "from-purple-500 to-pink-500"
    },
    {
      category: "STEM Fields",
      programs: [
        "Computer Science", "Mathematics", "Physics", "Chemistry", 
        "Biology", "Environmental Science", "Engineering", "Data Science"
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      category: "Business & Management",
      programs: [
        "Business Administration", "Finance", "Marketing", "International Business", 
        "Entrepreneurship", "Supply Chain Management", "Human Resources", "Accounting"
      ],
      color: "from-green-500 to-emerald-500"
    },
    {
      category: "Arts & Creative Studies",
      programs: [
        "Fine Arts", "Graphic Design", "Music", "Theater Arts", 
        "Creative Writing", "Film Studies", "Art History", "Digital Media"
      ],
      color: "from-orange-500 to-red-500"
    }
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Comprehensive Curriculum",
      description: "Well-rounded education combining major coursework with liberal arts foundation."
    },
    {
      icon: Users,
      title: "Small Class Sizes",
      description: "Personalized attention with average class sizes of 20 students or fewer."
    },
    {
      icon: Award,
      title: "Research Opportunities",
      description: "Undergraduate research programs with faculty mentorship and publication opportunities."
    },
    {
      icon: GraduationCap,
      title: "Career Preparation",
      description: "Internships, career counseling, and job placement services for post-graduation success."
    }
  ];

  const requirements = [
    {
      category: "General Education",
      credits: "42 credits",
      description: "Foundation courses in humanities, sciences, mathematics, and social sciences.",
      courses: ["English Composition", "Mathematics", "Natural Sciences", "Social Sciences", "Humanities", "Foreign Language"]
    },
    {
      category: "Major Requirements",
      credits: "48-60 credits",
      description: "Specialized coursework in your chosen field of study.",
      courses: ["Core Major Courses", "Advanced Electives", "Capstone Project", "Internship/Practicum"]
    },
    {
      category: "Free Electives",
      credits: "18-30 credits",
      description: "Flexible coursework to explore interests or complete minors.",
      courses: ["Minor Coursework", "Interest-Based Electives", "Study Abroad", "Independent Study"]
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
            <h1 className="text-2xl font-heading font-bold text-gradient-gold">Undergraduate Programs</h1>
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
              <GraduationCap className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              Undergraduate <span className="text-gradient-gold">Programs</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover your passion and build the foundation for your career through our comprehensive 
              undergraduate programs designed to prepare you for success in an ever-changing world.
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
              Why Choose Our Undergraduate Programs?
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience excellence in undergraduate education with personalized attention and comprehensive support.
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
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-royal to-gold flex items-center justify-center mx-auto mb-4">
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

      {/* Academic Majors */}
      <section className="section-padding bg-gradient-to-b from-muted/20 to-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Academic Majors
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from over 45 undergraduate majors across diverse fields of study.
            </p>
          </motion.div>

          <div className="space-y-8">
            {majors.map((category, index) => (
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {category.programs.map((program, pIndex) => (
                      <div key={pIndex} className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-gold flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{program}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Degree Requirements */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Degree Requirements
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A balanced curriculum designed to provide both breadth and depth in your education.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {requirements.map((req, index) => (
              <motion.div
                key={req.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-royal to-gold flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">{req.credits.split(' ')[0]}</span>
                  </div>
                  <h4 className="text-2xl font-heading font-bold text-gradient-gold mb-2">
                    {req.category}
                  </h4>
                  <p className="text-gold font-medium">{req.credits}</p>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed text-center">
                  {req.description}
                </p>
                <div className="space-y-2">
                  {req.courses.map((course, cIndex) => (
                    <div key={cIndex} className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-gold flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{course}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-royal/20 to-gold/20 px-8 py-4 rounded-lg">
              <GraduationCap className="h-6 w-6 text-gold" />
              <span className="font-semibold text-foreground text-lg">Total: 120 Credits Required for Graduation</span>
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
              Ready to Begin Your Journey?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Take the first step towards your undergraduate degree and discover the opportunities that await you at Royal Academy.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/admissions">
                <Button className="bg-gradient-to-r from-royal to-gold hover:from-royal/80 hover:to-gold/80 text-white">
                  Apply Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">
                  Schedule Campus Visit
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Undergraduate;
