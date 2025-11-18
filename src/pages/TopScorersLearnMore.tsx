import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Trophy, Medal, Award, Star, GraduationCap, BookOpen, Target, 
  TrendingUp, Crown, Zap, Users, Calendar, MapPin, Phone, Mail,
  ChevronRight, ArrowLeft, ExternalLink, Download, Share2,
  LucideProps
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getSupabaseData } from "@/lib/supabaseHelpers";
import { ForwardRefExoticComponent, RefAttributes } from "react";

const TopScorersLearnMore = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  // Content state
  const [heroContent, setHeroContent] = useState({
    title: "Academic Excellence",
    subtitle: "Discover the comprehensive programs, achievements, and support systems that make our top scorers exceptional leaders of tomorrow.",
    description: "At Royal Academy, we believe every student has the potential for greatness. Our comprehensive approach to education combines rigorous academics, innovative teaching methods, and personalized support to help students achieve their highest potential."
  });

  const [stats, setStats] = useState([
    { number: "98.5%", label: "Average Score", description: "Highest in school history" },
    { number: "100%", label: "University Acceptance", description: "Top-tier institutions" },
    { number: "15", label: "International Qualifiers", description: "Olympic competitions" },
    { number: "12", label: "Research Publications", description: "Student-led studies" }
  ]);

  const [features, setFeatures] = useState([
    {
      title: "Personalized Learning",
      description: "Tailored educational paths that adapt to each student's unique strengths and learning style.",
      icon: "Target",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Expert Faculty",
      description: "World-class educators with advanced degrees and industry experience.",
      icon: "GraduationCap",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Innovation Focus",
      description: "Cutting-edge technology and research opportunities in every discipline.",
      icon: "Zap",
      color: "from-green-500 to-emerald-500"
    }
  ]);

  const [achievements, setAchievements] = useState([
    {
      year: "2024",
      title: "Record Breaking Performance",
      description: "98.5% average score across all subjects - highest in school history",
      icon: "Crown",
      color: "from-gold to-yellow-500"
    },
    {
      year: "2024",
      title: "International Recognition",
      description: "15 students qualified for international olympiads",
      icon: "Trophy",
      color: "from-blue-500 to-cyan-500"
    },
    {
      year: "2023-2024",
      title: "University Admissions",
      description: "100% acceptance rate to top-tier universities",
      icon: "GraduationCap",
      color: "from-purple-500 to-pink-500"
    },
    {
      year: "2024",
      title: "Research Publications",
      description: "12 student research papers published in academic journals",
      icon: "BookOpen",
      color: "from-green-500 to-emerald-500"
    }
  ]);

  const [programs, setPrograms] = useState([
    {
      name: "Advanced Placement Program",
      description: "Rigorous college-level courses with university credit opportunities",
      features: ["25+ AP Courses", "Expert Faculty", "College Credit", "University Partnerships"],
      icon: "Target"
    },
    {
      name: "Research & Innovation Track",
      description: "Independent research projects with mentorship from industry experts",
      features: ["1-on-1 Mentoring", "Lab Access", "Publication Support", "Conference Presentations"],
      icon: "Zap"
    },
    {
      name: "Leadership Development",
      description: "Comprehensive leadership training and real-world application",
      features: ["Student Government", "Community Projects", "Internships", "Global Exchanges"],
      icon: "Users"
    },
    {
      name: "Academic Excellence Support",
      description: "Personalized support system for high-achieving students",
      features: ["Tutoring", "Study Groups", "Exam Prep", "Career Counseling"],
      icon: "Star"
    }
  ]);

  const [testimonials, setTestimonials] = useState([
    {
      name: "Emma Richardson",
      role: "Valedictorian 2024",
      quote: "Royal Academy provided me with the perfect environment to excel. The teachers pushed me to reach my potential while supporting every step of my journey.",
      image: "https://images.unsplash.com/photo-1494790108755-2616c669-b163?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      achievement: "Harvard University - Full Scholarship"
    },
    {
      name: "James Chen",
      role: "Math Olympiad Gold Medalist",
      quote: "The advanced mathematics program here is exceptional. I was able to compete at international levels thanks to the rigorous training and support.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      achievement: "MIT - Early Admission"
    },
    {
      name: "Dr. Sarah Williams",
      role: "Parent & Alumni",
      quote: "As both a parent and alumna, I've seen firsthand how Royal Academy transforms students into confident, capable leaders ready for any challenge.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      achievement: "Parent of 2024 Top Scorer"
    }
  ]);

  const [contacts, setContacts] = useState([
    {
      title: "Admissions Office",
      icon: "GraduationCap",
      details: [
        { icon: "Phone", text: "+1 (555) 123-4567" },
        { icon: "Mail", text: "admissions@royalacademy.edu" },
        { icon: "Calendar", text: "Mon-Fri: 8:00 AM - 5:00 PM" }
      ]
    },
    {
      title: "Academic Affairs",
      icon: "BookOpen",
      details: [
        { icon: "Phone", text: "+1 (555) 123-4568" },
        { icon: "Mail", text: "academics@royalacademy.edu" },
        { icon: "Calendar", text: "Mon-Fri: 9:00 AM - 4:00 PM" }
      ]
    },
    {
      title: "Campus Location",
      icon: "MapPin",
      details: [
        { icon: "MapPin", text: "123 Excellence Boulevard" },
        { icon: "MapPin", text: "Academic City, AC 12345" },
        { icon: "ExternalLink", text: "View on Maps" }
      ]
    }
  ]);

  // Icon mapping
  const iconMap: Record<string, ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>> = {
    Target,
    GraduationCap,
    Zap,
    Crown,
    Trophy,
    BookOpen,
    Users,
    Star,
    Phone,
    Mail,
    Calendar,
    MapPin,
    ExternalLink,
    ChevronRight
  };

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load all content sections from Supabase
        const heroData = await getSupabaseData('top-scorers-learn-more-hero', heroContent);
        const statsData = await getSupabaseData('top-scorers-learn-more-stats', stats);
        const featuresData = await getSupabaseData('top-scorers-learn-more-features', features);
        const achievementsData = await getSupabaseData('top-scorers-learn-more-achievements', achievements);
        const programsData = await getSupabaseData('top-scorers-learn-more-programs', programs);
        const testimonialsData = await getSupabaseData('top-scorers-learn-more-testimonials', testimonials);
        const contactsData = await getSupabaseData('top-scorers-learn-more-contacts', contacts);

        // Update state with loaded data
        setHeroContent(heroData);
        setStats(statsData);
        setFeatures(featuresData);
        setAchievements(achievementsData);
        setPrograms(programsData);
        setTestimonials(testimonialsData);
        setContacts(contactsData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal/20 via-background to-gold/20"></div>
        
        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3 px-4">
              <Link to="/top-scorers">
                <Button 
                  variant="outline" 
                  className="bg-gradient-to-r from-royal/10 to-gold/10 hover:from-royal/20 hover:to-gold/20 border-gold/30 text-gold hover:text-gold/80 transition-all duration-300 px-4 py-2 sm:px-6 sm:py-3 rounded-xl shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                  Back
                </Button>
              </Link>
              
              <div className="flex items-center space-x-1 text-xs sm:text-sm text-muted-foreground">
                <Link to="/" className="hover:text-gold transition-colors">Home</Link>
                <span>/</span>
                <Link to="/top-scorers" className="hover:text-gold transition-colors">Top Scorers</Link>
                <span>/</span>
                <span className="text-gold">Learn More</span>
              </div>
            </div>
            
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center space-x-2 mb-4"
            >
              <Crown className="h-8 w-8 sm:h-12 sm:w-12 text-gold animate-pulse" />
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-heading font-bold">
                {heroContent.title}
              </h1>
              <Trophy className="h-8 w-8 sm:h-12 sm:w-12 text-gold animate-pulse" style={{ animationDelay: '0.5s' }} />
            </motion.div>
            
            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-6 px-4">
              {heroContent.subtitle}
            </p>
            
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-r from-royal/10 to-gold/10 py-8">
        <div className="container-wide">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-3 sm:p-4 md:p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border hover:shadow-lg transition-all duration-300"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-gold mb-1">
                  {stat.number}
                </div>
                <div className="font-semibold text-foreground mb-1 text-xs sm:text-sm md:text-base">
                  {stat.label}
                </div>
                <div className="text-[0.6rem] sm:text-xs md:text-sm text-muted-foreground px-1">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content with Tabs */}
      <section className="section-padding pt-8">
        <div className="container-wide">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-1 mb-8 overflow-x-auto scrollbar-none px-2">
            {[
              { id: "overview", label: "Overview", icon: "BookOpen" },
              { id: "achievements", label: "Achievements", icon: "Trophy" },
              { id: "programs", label: "Programs", icon: "GraduationCap" },
              { id: "testimonials", label: "Testimonials", icon: "Users" },
              { id: "contact", label: "Contact", icon: "Phone" }
            ].map((tab, index) => {
              const IconComponent = iconMap[tab.icon];
              return (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 whitespace-nowrap text-xs sm:text-sm ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-gold to-yellow-500 text-black shadow-lg"
                      : "bg-card/50 hover:bg-card text-muted-foreground hover:text-foreground border border-border"
                  }`}
                >
                  {IconComponent && <IconComponent className="h-3 w-3 sm:h-4 sm:w-4" />}
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-4 text-gradient-gold">
                    Excellence in Education
                  </h2>
                  <p className="text-base sm:text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4">
                    {heroContent.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
                  {features.map((feature, index) => {
                    const IconComponent = iconMap[feature.icon];
                    return (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="card-3d p-4 sm:p-6 text-center"
                      >
                        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                          {IconComponent && <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-white" />}
                        </div>
                        <h3 className="text-lg sm:text-xl font-heading font-bold mb-2 sm:mb-3 text-gradient-gold">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "achievements" && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-4 text-gradient-gold">
                    Outstanding Achievements
                  </h2>
                  <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
                    Our students consistently achieve remarkable results across all academic disciplines and extracurricular activities.
                  </p>
                </div>
                
                <div className="space-y-4 px-4">
                  {achievements.map((achievement, index) => {
                    const IconComponent = iconMap[achievement.icon];
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="card-3d p-4 sm:p-6 flex flex-col gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r ${achievement.color} flex items-center justify-center flex-shrink-0`}>
                            {IconComponent && <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-white" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                              <h3 className="text-lg sm:text-xl font-heading font-bold text-gradient-gold">
                                {achievement.title}
                              </h3>
                              <span className="text-xs sm:text-sm text-muted-foreground bg-muted/20 px-2 py-1 rounded-full">
                                {achievement.year}
                              </span>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "programs" && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-4 text-gradient-gold">
                    Academic Programs
                  </h2>
                  <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
                    Comprehensive programs designed to challenge, inspire, and prepare students for success in higher education and beyond.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
                  {programs.map((program, index) => {
                    const IconComponent = iconMap[program.icon];
                    return (
                      <motion.div
                        key={program.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="card-3d p-4 sm:p-6"
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center">
                            {IconComponent && <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-black" />}
                          </div>
                          <h3 className="text-lg sm:text-xl font-heading font-bold text-gradient-gold">
                            {program.name}
                          </h3>
                        </div>
                        <p className="text-muted-foreground mb-4 text-sm sm:text-base leading-relaxed">
                          {program.description}
                        </p>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-foreground text-sm">Key Features:</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {program.features.map((feature, idx) => {
                              const IconComponent = iconMap["ChevronRight"];
                              return (
                                <div key={idx} className="flex items-center space-x-2">
                                  {IconComponent && <IconComponent className="h-3 w-3 sm:h-4 sm:w-4 text-gold flex-shrink-0" />}
                                  <span className="text-xs sm:text-sm text-muted-foreground">{feature}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "testimonials" && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-4 text-gradient-gold">
                    Success Stories
                  </h2>
                  <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
                    Hear from our top scorers, parents, and alumni about their transformative experiences at Royal Academy.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
                  {testimonials.map((testimonial, index) => (
                    <motion.div
                      key={testimonial.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="card-3d p-4 sm:p-6 text-center"
                    >
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-3 object-cover border-4 border-gold/20"
                      />
                      <h3 className="text-base sm:text-lg font-heading font-bold text-gradient-gold mb-1">
                        {testimonial.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3">{testimonial.role}</p>
                      <blockquote className="text-muted-foreground italic mb-3 leading-relaxed text-xs sm:text-sm">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="text-[0.6rem] sm:text-xs text-gold font-medium bg-gold/10 px-2 py-1 rounded-full">
                        {testimonial.achievement}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-4 text-gradient-gold">
                    Get In Touch
                  </h2>
                  <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
                    Ready to join our community of academic excellence? Contact us to learn more about our programs and admission process.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
                  {contacts.map((contact, index) => {
                    const IconComponent = iconMap[contact.icon];
                    return (
                      <motion.div
                        key={contact.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="card-3d p-4 sm:p-6 text-center"
                      >
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center mx-auto mb-3">
                          {IconComponent && <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-black" />}
                        </div>
                        <h3 className="text-lg sm:text-xl font-heading font-bold mb-3 text-gradient-gold">
                          {contact.title}
                        </h3>
                        <div className="space-y-2">
                          {contact.details.map((detail, idx) => {
                            const DetailIconComponent = iconMap[detail.icon];
                            return (
                              <div key={idx} className="flex items-center justify-center space-x-2 text-muted-foreground">
                                {DetailIconComponent && <DetailIconComponent className="h-3 w-3 sm:h-4 sm:w-4 text-gold flex-shrink-0" />}
                                <span className="text-xs sm:text-sm">{detail.text}</span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                
                <div className="text-center mt-8">
                  <Link to="/admissions">
                    <Button className="bg-gradient-to-r from-gold to-yellow-500 hover:from-gold/80 hover:to-yellow-500/80 text-black px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Start Your Application
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TopScorersLearnMore;