import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, Users, Award, Globe, Briefcase, Calendar, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

const AlumniNetwork = () => {
  const stats = [
    { number: "50,000+", label: "Alumni Worldwide" },
    { number: "150+", label: "Countries Represented" },
    { number: "85%", label: "Career Success Rate" },
    { number: "25+", label: "Alumni Chapters" }
  ];

  const featuredAlumni = [
    {
      name: "Dr. Sarah Johnson",
      class: "Class of 1995",
      position: "Chief Medical Officer",
      company: "Global Health Initiative",
      image: "/api/placeholder/300/400",
      achievement: "Leading COVID-19 research initiatives worldwide",
      location: "New York, USA"
    },
    {
      name: "Prof. Michael Chen",
      class: "Class of 1988",
      position: "Professor of Engineering",
      company: "MIT",
      image: "/api/placeholder/300/400",
      achievement: "Pioneering renewable energy technologies",
      location: "Boston, USA"
    },
    {
      name: "Ms. Priya Sharma",
      class: "Class of 2005",
      position: "CEO & Founder",
      company: "TechVision Solutions",
      image: "/api/placeholder/300/400",
      achievement: "Built a billion-dollar tech company",
      location: "Silicon Valley, USA"
    },
    {
      name: "Dr. James Wilson",
      class: "Class of 1992",
      position: "Ambassador",
      company: "United Nations",
      image: "/api/placeholder/300/400",
      achievement: "Promoting global peace and diplomacy",
      location: "Geneva, Switzerland"
    }
  ];

  const benefits = [
    {
      icon: Globe,
      title: "Global Network",
      description: "Connect with alumni across 150+ countries and diverse industries worldwide."
    },
    {
      icon: Briefcase,
      title: "Career Opportunities",
      description: "Access exclusive job postings, mentorship programs, and career advancement resources."
    },
    {
      icon: Users,
      title: "Mentorship Programs",
      description: "Both mentor and be mentored by fellow Royal Academy graduates in your field."
    },
    {
      icon: Calendar,
      title: "Exclusive Events",
      description: "Attend alumni reunions, networking events, and professional development workshops."
    }
  ];

  const chapters = [
    { city: "New York", members: "2,500+", established: "1920" },
    { city: "London", members: "1,800+", established: "1925" },
    { city: "Singapore", members: "1,200+", established: "1960" },
    { city: "Dubai", members: "900+", established: "1985" },
    { city: "Toronto", members: "1,100+", established: "1950" },
    { city: "Sydney", members: "800+", established: "1965" }
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
            <h1 className="text-2xl font-heading font-bold text-gradient-gold">Alumni Network</h1>
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
              Alumni <span className="text-gradient-gold">Network</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Join a global community of Royal Academy graduates making a difference in every field imaginable. 
              Connect, collaborate, and continue the legacy of excellence.
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

      {/* Benefits */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Alumni Benefits
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Exclusive benefits and opportunities available to Royal Academy alumni worldwide.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-royal to-gold flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-heading font-bold mb-3 text-gradient-gold">
                  {benefit.title}
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Alumni */}
      <section className="section-padding bg-gradient-to-b from-muted/20 to-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Distinguished Alumni
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Meet some of our outstanding graduates who are making a global impact.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredAlumni.map((alumni, index) => (
              <motion.div
                key={alumni.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-royal to-gold mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                  <h4 className="text-xl font-heading font-bold text-gradient-gold mb-2">
                    {alumni.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-1">{alumni.class}</p>
                  <p className="text-sm font-medium text-foreground">{alumni.position}</p>
                  <p className="text-sm text-muted-foreground">{alumni.company}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-gold" />
                    <span className="text-sm text-muted-foreground">{alumni.achievement}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gold" />
                    <span className="text-sm text-muted-foreground">{alumni.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni Chapters */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Global Chapters
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with local alumni chapters in major cities around the world.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((chapter, index) => (
              <motion.div
                key={chapter.city}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-heading font-bold text-gradient-gold">
                    {chapter.city}
                  </h4>
                  <span className="px-3 py-1 bg-gradient-to-r from-royal/20 to-gold/20 rounded-full text-sm font-medium text-gold">
                    Est. {chapter.established}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-gold" />
                  <span className="text-muted-foreground">{chapter.members} active members</span>
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
              Join the Alumni Network
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with fellow graduates, access exclusive opportunities, and continue your Royal Academy journey.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button className="bg-gradient-to-r from-royal to-gold hover:from-royal/80 hover:to-gold/80 text-white">
                <Mail className="h-4 w-4 mr-2" />
                Register as Alumni
              </Button>
              <Link to="/contact">
                <Button variant="outline">
                  Contact Alumni Office
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AlumniNetwork;
