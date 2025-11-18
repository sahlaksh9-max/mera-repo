import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, Briefcase, Users, Target, TrendingUp, Calendar, Award, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

const CareerServices = () => {
  const stats = [
    { number: "95%", label: "Graduate Employment Rate" },
    { number: "500+", label: "Partner Companies" },
    { number: "1,200+", label: "Job Placements Annually" },
    { number: "85%", label: "Career Satisfaction Rate" }
  ];

  const services = [
    {
      icon: Target,
      title: "Career Counseling",
      description: "One-on-one guidance to help you discover your career path and develop professional goals.",
      features: ["Personal career assessment", "Goal setting sessions", "Industry insights", "Career planning"]
    },
    {
      icon: Users,
      title: "Resume & Interview Prep",
      description: "Professional assistance with resume writing, cover letters, and interview preparation.",
      features: ["Resume review & editing", "Mock interviews", "LinkedIn optimization", "Portfolio development"]
    },
    {
      icon: Briefcase,
      title: "Job Placement",
      description: "Direct connections with employers and exclusive access to job opportunities.",
      features: ["Job matching service", "Employer partnerships", "Campus recruitment", "Internship programs"]
    },
    {
      icon: TrendingUp,
      title: "Professional Development",
      description: "Workshops and training programs to enhance your professional skills and marketability.",
      features: ["Skill workshops", "Leadership training", "Networking events", "Industry certifications"]
    }
  ];

  const programs = [
    {
      title: "Internship Program",
      description: "Gain real-world experience through our extensive internship network with leading companies.",
      duration: "Summer & Semester Programs",
      benefits: ["Paid positions available", "Academic credit options", "Mentorship support", "Performance evaluations"]
    },
    {
      title: "Career Mentorship",
      description: "Connect with alumni and industry professionals for guidance and networking opportunities.",
      duration: "Ongoing Support",
      benefits: ["Alumni mentor network", "Industry connections", "Professional guidance", "Career insights"]
    },
    {
      title: "Entrepreneurship Support",
      description: "Resources and guidance for students interested in starting their own businesses.",
      duration: "Flexible Timeline",
      benefits: ["Business plan development", "Funding guidance", "Legal support", "Networking opportunities"]
    },
    {
      title: "Graduate School Prep",
      description: "Comprehensive support for students planning to pursue advanced degrees.",
      duration: "Application Cycle Support",
      benefits: ["Application guidance", "Test preparation", "Personal statement help", "Interview coaching"]
    }
  ];

  const industries = [
    { name: "Technology", companies: "150+", growth: "+25%" },
    { name: "Healthcare", companies: "120+", growth: "+18%" },
    { name: "Finance", companies: "100+", growth: "+15%" },
    { name: "Education", companies: "80+", growth: "+12%" },
    { name: "Engineering", companies: "90+", growth: "+20%" },
    { name: "Business Services", companies: "110+", growth: "+22%" }
  ];

  const upcomingEvents = [
    {
      title: "Career Fair 2024",
      date: "March 15-16, 2024",
      description: "Meet with 200+ employers from various industries",
      type: "Job Fair"
    },
    {
      title: "Resume Writing Workshop",
      date: "February 28, 2024",
      description: "Learn to create compelling resumes that get noticed",
      type: "Workshop"
    },
    {
      title: "Tech Industry Panel",
      date: "March 5, 2024",
      description: "Industry leaders discuss trends and opportunities",
      type: "Panel Discussion"
    },
    {
      title: "Interview Skills Bootcamp",
      date: "March 10, 2024",
      description: "Intensive training for job interview success",
      type: "Training"
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
            <h1 className="text-2xl font-heading font-bold text-gradient-gold">Career Services</h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-background to-blue-500/20"></div>
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
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-blue-500 mb-6"
            >
              <Briefcase className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              Career <span className="text-gradient-gold">Services</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Comprehensive career support to help you transition from student to professional. 
              From career exploration to job placement, we're here to guide your success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-r from-green-500/10 via-background to-blue-500/10">
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

      {/* Services */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Our Services
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive career support services designed to help you achieve your professional goals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-heading font-bold mb-3 text-gradient-gold text-center">
                  {service.title}
                </h4>
                <p className="text-muted-foreground mb-4 leading-relaxed text-center">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-gold flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="section-padding bg-gradient-to-b from-muted/20 to-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Career Programs
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Specialized programs designed to enhance your career readiness and professional development.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-2xl font-heading font-bold text-gradient-gold">
                    {program.title}
                  </h4>
                  <span className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full text-sm font-medium text-gold">
                    {program.duration}
                  </span>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {program.description}
                </p>
                <div>
                  <h5 className="font-semibold mb-4 text-foreground">Program Benefits:</h5>
                  <div className="grid grid-cols-2 gap-3">
                    {program.benefits.map((benefit, bIndex) => (
                      <div key={bIndex} className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-gold flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Partners */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Industry Partnerships
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Strong relationships with leading companies across various industries.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-heading font-bold text-gradient-gold">
                    {industry.name}
                  </h4>
                  <span className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full text-sm font-medium text-gold">
                    {industry.growth}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-gold" />
                  <span className="text-muted-foreground">{industry.companies} partner companies</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section-padding bg-gradient-to-b from-muted/20 to-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Upcoming Events
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Don't miss these valuable career development opportunities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full text-sm font-medium text-gold">
                    {event.type}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gold" />
                    <span className="text-sm text-muted-foreground">{event.date}</span>
                  </div>
                </div>
                <h4 className="text-xl font-heading font-bold mb-3 text-gradient-gold">
                  {event.title}
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-green-500/10 to-blue-500/10">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Briefcase className="h-16 w-16 text-gold mx-auto mb-6" />
            <h3 className="text-3xl font-heading font-bold mb-6 text-gradient-gold">
              Start Your Career Journey
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Take the first step towards your dream career. Our career services team is ready to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>
              <Link to="/contact">
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Career Services
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CareerServices;
