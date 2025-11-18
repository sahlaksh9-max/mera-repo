import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, GraduationCap, BookOpen, Users, Award, Calendar, Clock, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

const Graduate = () => {
  const stats = [
    { number: "25+", label: "Master's Programs" },
    { number: "8:1", label: "Student-Faculty Ratio" },
    { number: "95%", label: "Career Advancement Rate" },
    { number: "2 Years", label: "Average Completion Time" }
  ];

  const programs = [
    {
      category: "Business & Management",
      degrees: [
        { name: "Master of Business Administration (MBA)", duration: "2 years", credits: "60" },
        { name: "Master of Finance (MF)", duration: "1.5 years", credits: "45" },
        { name: "Master of Marketing (MM)", duration: "1.5 years", credits: "45" },
        { name: "Master of International Business (MIB)", duration: "2 years", credits: "54" }
      ],
      color: "from-green-500 to-emerald-500"
    },
    {
      category: "Science & Technology",
      degrees: [
        { name: "Master of Science in Computer Science (MS CS)", duration: "2 years", credits: "36" },
        { name: "Master of Data Science (MDS)", duration: "1.5 years", credits: "42" },
        { name: "Master of Engineering (MEng)", duration: "2 years", credits: "48" },
        { name: "Master of Environmental Science (MES)", duration: "2 years", credits: "45" }
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      category: "Arts & Humanities",
      degrees: [
        { name: "Master of Arts in English (MA English)", duration: "2 years", credits: "36" },
        { name: "Master of Fine Arts (MFA)", duration: "2 years", credits: "60" },
        { name: "Master of Arts in History (MA History)", duration: "2 years", credits: "36" },
        { name: "Master of Arts in Psychology (MA Psychology)", duration: "2 years", credits: "48" }
      ],
      color: "from-purple-500 to-pink-500"
    },
    {
      category: "Education & Social Sciences",
      degrees: [
        { name: "Master of Education (MEd)", duration: "1.5 years", credits: "36" },
        { name: "Master of Social Work (MSW)", duration: "2 years", credits: "60" },
        { name: "Master of Public Administration (MPA)", duration: "2 years", credits: "48" },
        { name: "Master of Arts in Teaching (MAT)", duration: "1 year", credits: "30" }
      ],
      color: "from-orange-500 to-red-500"
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "Advanced Research",
      description: "Conduct cutting-edge research with world-class faculty mentors and state-of-the-art facilities."
    },
    {
      icon: Users,
      title: "Small Cohorts",
      description: "Intimate learning environment with personalized attention and collaborative peer relationships."
    },
    {
      icon: Award,
      title: "Industry Connections",
      description: "Strong partnerships with leading organizations providing internships and career opportunities."
    },
    {
      icon: GraduationCap,
      title: "Expert Faculty",
      description: "Learn from distinguished professors who are leaders in their respective fields."
    }
  ];

  const admissionRequirements = [
    {
      requirement: "Bachelor's Degree",
      description: "Completed undergraduate degree from an accredited institution with minimum 3.0 GPA"
    },
    {
      requirement: "Standardized Tests",
      description: "GRE/GMAT scores required for most programs (specific requirements vary by program)"
    },
    {
      requirement: "Letters of Recommendation",
      description: "Three letters from academic or professional references who can speak to your abilities"
    },
    {
      requirement: "Statement of Purpose",
      description: "Personal statement outlining your academic goals and research interests"
    },
    {
      requirement: "Transcripts",
      description: "Official transcripts from all previously attended institutions"
    },
    {
      requirement: "English Proficiency",
      description: "TOEFL/IELTS scores required for international students (minimum scores vary by program)"
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
            <h1 className="text-2xl font-heading font-bold text-gradient-gold">Graduate Programs</h1>
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
              Graduate <span className="text-gradient-gold">Programs</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Advance your career and expertise through our comprehensive graduate programs designed 
              for working professionals and full-time students seeking specialized knowledge and research opportunities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-r from-royal/10 via-background to-crimson/10">
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
              Graduate Education Excellence
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience advanced learning with personalized mentorship and cutting-edge research opportunities.
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

      {/* Graduate Programs */}
      <section className="section-padding bg-gradient-to-b from-muted/20 to-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Master's Degree Programs
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from over 25 graduate programs across diverse fields of study.
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
                    {category.degrees.map((degree, dIndex) => (
                      <div key={dIndex} className="bg-muted/20 rounded-lg p-4">
                        <h5 className="font-semibold text-foreground mb-2">{degree.name}</h5>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{degree.duration}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{degree.credits} credits</span>
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

      {/* Admission Requirements */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Admission Requirements
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              General requirements for graduate program admission. Specific programs may have additional requirements.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {admissionRequirements.map((req, index) => (
              <motion.div
                key={req.requirement}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Award className="h-6 w-6 text-gold" />
                  <h4 className="text-lg font-heading font-bold text-gradient-gold">
                    {req.requirement}
                  </h4>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {req.description}
                </p>
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
              Ready to Advance Your Career?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Take the next step in your professional journey with our comprehensive graduate programs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/admissions">
                <Button className="bg-gradient-to-r from-royal to-crimson hover:from-royal/80 hover:to-crimson/80 text-white">
                  Apply Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">
                  Request Information
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Graduate;
