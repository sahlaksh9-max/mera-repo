import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  GraduationCap,
  Award,
  Users,
  BookOpen,
  Plus,
  Minus
} from "lucide-react";
import { getSupabaseData } from "@/lib/supabaseHelpers";
import GlassIcons, { GlassIconsItem } from "@/components/GlassIcons";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // State for collapsible sections on mobile
  const [expandedSections, setExpandedSections] = useState({
    quickLinks: false,
    programs: false,
    resources: false,
    academic: false,
    achievements: false
  });

  // State for dynamic branding data
  const [brandingData, setBrandingData] = useState({
    schoolName: "Royal Academy",
    tagline: "Excellence in Education",
    logoUrl: "/placeholder.svg"
  });

  // Load branding data from Supabase
  useEffect(() => {
    getSupabaseData('royal-academy-branding', {
      schoolName: "Royal Academy",
      tagline: "Excellence in Education",
      logoUrl: "/placeholder.svg"
    }).then(data => {
      setBrandingData({
        schoolName: data.schoolName || "Royal Academy",
        tagline: data.tagline || "Excellence in Education",
        logoUrl: data.logoUrl || "/placeholder.svg"
      });
    });
  }, []);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const quickLinks = [
    { name: "About Us", path: "/about" },
    { name: "Academics", path: "/academics" },
    { name: "Admissions", path: "/admissions" },
    { name: "Facilities", path: "/facilities" },
    { name: "Gallery", path: "/gallery" },
    { name: "Events", path: "/events" }
  ];

  const programs = [
    { name: "Undergraduate", path: "/undergraduate" },
    { name: "Graduate", path: "/graduate" },
    { name: "PhD Programs", path: "/phd-programs" },
    { name: "Online Learning", path: "/online-learning" }
  ];

  const resources = [
    { name: "Faculty", path: "/our-teachers" },
    { name: "Alumni Network", path: "/alumni-network" },
    { name: "Library", path: "/library" },
    { name: "Career Services", path: "/career-services" }
  ];

  const academicPrograms = [
    { name: "Primary Education", path: "/primary-education" },
    { name: "Secondary Education", path: "/secondary-education" },
    { name: "Higher Secondary", path: "/higher-secondary" },
    { name: "Science Stream", path: "/science-stream" },
    { name: "Commerce Stream", path: "/commerce-stream" },
    { name: "Arts Stream", path: "/arts-stream" }
  ];

  const achievements = [
    { icon: Award, text: "148+ Years of Excellence" },
    { icon: GraduationCap, text: "50,000+ Alumni Worldwide" },
    { icon: Users, text: "Expert Faculty Team" },
    { icon: BookOpen, text: "Comprehensive Curriculum" }
  ];

  // Collapsible Section Component for Mobile
  const CollapsibleSection = ({ 
    title, 
    sectionKey, 
    children 
  }: { 
    title: string; 
    sectionKey: keyof typeof expandedSections; 
    children: React.ReactNode;
  }) => (
    <div className="sm:hidden border-b border-border/30 last:border-b-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between py-4 px-2 text-left"
      >
        <h3 className="text-lg font-heading font-bold text-gradient-gold">{title}</h3>
        <motion.div
          animate={{ rotate: expandedSections[sectionKey] ? 180 : 0 }}
          transition={{ duration: 0 }}
        >
          {expandedSections[sectionKey] ? (
            <Minus className="h-5 w-5 text-gold" />
          ) : (
            <Plus className="h-5 w-5 text-gold" />
          )}
        </motion.div>
      </button>
      <AnimatePresence>
        {expandedSections[sectionKey] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-4 px-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <footer className="relative bg-gradient-to-t from-[#0a0a0a] to-[#111] text-foreground overflow-hidden transition-all duration-500" style={{ borderTopLeftRadius: '40px', borderTopRightRadius: '40px' }}>
      {/* Glow Effect in Center */}
      <div className="absolute left-1/2 -translate-x-1/2 w-[200px] sm:w-[300px] h-[100px] sm:h-[150px] pointer-events-none" style={{ top: '-60px', background: 'radial-gradient(circle, #00f5ff 0%, transparent 70%)', filter: 'blur(50px)' }}></div>
      
      {/* Dotted Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-royal/30 to-gold/30 dark:from-royal/20 dark:to-gold/20"></div>
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gold/20 dark:bg-gold/10 blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-royal/20 dark:bg-royal/10 blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-crimson/10 dark:bg-crimson/5 blur-2xl"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container-wide py-6 sm:py-12 px-4 sm:px-6">
          {/* Mobile Compact Footer */}
          <div className="sm:hidden">
            {/* School Info - Always visible on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0 }}
              className="mb-4 pb-4 border-b border-border/30"
            >
              <Link to="/" className="flex items-center space-x-2 mb-3 group">
                <motion.img
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0 }}
                  src={brandingData.logoUrl}
                  alt={brandingData.schoolName}
                  className="h-10 w-10 flex-shrink-0 animate-glow"
                />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-base font-heading font-bold text-gradient-gold truncate">
                    {brandingData.schoolName}
                  </span>
                  <span className="text-[10px] text-black dark:text-muted-foreground tracking-wide truncate">
                    {brandingData.tagline}
                  </span>
                </div>
              </Link>
              
              <p className="text-xs text-black dark:text-muted-foreground leading-relaxed mb-3">
                Nurturing minds, shaping futures. For over 148 years, {brandingData.schoolName} has been 
                committed to providing world-class education.
              </p>

              {/* Contact Info - Compact for 375px */}
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 text-black dark:text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="text-[11px] truncate">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2 text-black dark:text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="text-[11px] truncate">info@royalacademy.edu</span>
                </div>
              </div>
            </motion.div>

            {/* Collapsible Sections */}
            <div className="space-y-0">
              <CollapsibleSection title="Quick Links" sectionKey="quickLinks">
                <ul className="space-y-2">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="text-sm text-black dark:text-muted-foreground hover:text-gold transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Programs" sectionKey="programs">
                <ul className="space-y-2">
                  {programs.map((program) => (
                    <li key={program.name}>
                      <Link
                        to={program.path}
                        className="text-sm text-black dark:text-muted-foreground hover:text-gold transition-colors"
                      >
                        {program.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Resources" sectionKey="resources">
                <ul className="space-y-2">
                  {resources.map((resource) => (
                    <li key={resource.name}>
                      <Link
                        to={resource.path}
                        className="text-sm text-black dark:text-muted-foreground hover:text-gold transition-colors"
                      >
                        {resource.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Academic Levels" sectionKey="academic">
                <ul className="space-y-2">
                  {academicPrograms.slice(0, 4).map((program) => (
                    <li key={program.name}>
                      <Link
                        to={program.path}
                        className="text-sm text-black dark:text-muted-foreground hover:text-gold transition-colors"
                      >
                        {program.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Follow Us" sectionKey="achievements">
                <div className="space-y-4">
                  {/* Achievements */}
                  <div className="space-y-2">
                    {achievements.slice(0, 2).map((achievement) => (
                      <div key={achievement.text} className="flex items-center space-x-2">
                        <achievement.icon className="h-4 w-4 text-gold flex-shrink-0" />
                        <span className="text-xs text-black dark:text-muted-foreground">{achievement.text}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Social Media */}
                  <GlassIcons
                    items={[
                      { icon: <Facebook />, color: "blue", label: "Facebook", href: "#" },
                      { icon: <Twitter />, color: "blue", label: "Twitter", href: "#" },
                      { icon: <Instagram />, color: "purple", label: "Instagram", href: "#" },
                      { icon: <Linkedin />, color: "blue", label: "LinkedIn", href: "#" },
                      { icon: <Youtube />, color: "red", label: "YouTube", href: "#" }
                    ]}
                  />
                </div>
              </CollapsibleSection>
            </div>
          </div>

          {/* Desktop/Tablet Full Footer */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-6 xl:gap-8">
            
            {/* School Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0 }}
              className="lg:col-span-1 pr-4"
            >
              <Link to="/" className="flex items-start space-x-4 mb-8 group max-w-full">
                <motion.img
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0 }}
                  src={brandingData.logoUrl}
                  alt={brandingData.schoolName}
                  className="h-16 w-16 flex-shrink-0 animate-glow"
                />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xl font-heading font-bold text-gradient-gold leading-tight">
                    {brandingData.schoolName}
                  </span>
                  <span className="text-xs text-black dark:text-muted-foreground tracking-wider mt-1">
                    {brandingData.tagline}
                  </span>
                </div>
              </Link>
              
              <p className="text-black dark:text-muted-foreground leading-relaxed mb-6">
                Nurturing minds, shaping futures. For over 148 years, {brandingData.schoolName} has been 
                committed to providing world-class education and developing tomorrow's leaders.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <motion.div 
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0 }}
                  className="flex items-center space-x-3 text-black dark:text-muted-foreground hover:text-gold transition-colors"
                >
                  <MapPin className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">123 Excellence Boulevard, Academic City, AC 12345</span>
                </motion.div>
                <motion.div 
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0 }}
                  className="flex items-center space-x-3 text-black dark:text-muted-foreground hover:text-gold transition-colors"
                >
                  <Phone className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </motion.div>
                <motion.div 
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0 }}
                  className="flex items-center space-x-3 text-black dark:text-muted-foreground hover:text-gold transition-colors"
                >
                  <Mail className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">info@royalacademy.edu</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0, delay: 0 }}
              className="lg:col-span-1"
            >
              <h3 className="text-lg font-heading font-bold text-gradient-gold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0, delay: index * 0 }}
                    whileHover={{ x: 5 }}
                  >
                    <Link
                      to={link.path}
                      className="text-black dark:text-muted-foreground hover:text-gold transition-colors flex items-center space-x-2"
                    >
                      <span className="text-sm">{link.name}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Programs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0, delay: 0 }}
              className="lg:col-span-1"
            >
              <h3 className="text-lg font-heading font-bold text-gradient-gold mb-6">Programs</h3>
              <ul className="space-y-3">
                {programs.map((program, index) => (
                  <motion.li
                    key={program.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0, delay: index * 0 }}
                    whileHover={{ x: 5 }}
                  >
                    <Link
                      to={program.path}
                      className="text-black dark:text-muted-foreground hover:text-gold transition-colors flex items-center space-x-2"
                    >
                      <span className="text-sm">{program.name}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0, delay: 0 }}
              className="lg:col-span-1"
            >
              <h3 className="text-lg font-heading font-bold text-gradient-gold mb-6">Resources</h3>
              <ul className="space-y-3">
                {resources.map((resource, index) => (
                  <motion.li
                    key={resource.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0, delay: index * 0 }}
                    whileHover={{ x: 5 }}
                  >
                    <Link
                      to={resource.path}
                      className="text-black dark:text-muted-foreground hover:text-gold transition-colors flex items-center space-x-2"
                    >
                      <span className="text-sm">{resource.name}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Academic Levels */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0, delay: 0 }}
              className="lg:col-span-1"
            >
              <h3 className="text-lg font-heading font-bold text-gradient-gold mb-6">Academic Levels</h3>
              <ul className="space-y-3">
                {academicPrograms.slice(0, 5).map((program, index) => (
                  <motion.li
                    key={program.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0, delay: index * 0 }}
                    whileHover={{ x: 5 }}
                  >
                    <Link
                      to={program.path}
                      className="text-black dark:text-muted-foreground hover:text-gold transition-colors flex items-center space-x-2"
                    >
                      <span className="text-sm">{program.name}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Achievements & Social */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0, delay: 0 }}
              className="lg:col-span-1"
            >
              <h3 className="text-lg font-heading font-bold text-gradient-gold mb-6">Achievements</h3>
              <div className="space-y-4 mb-8">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.text}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0, delay: index * 0 }}
                    className="flex items-start space-x-3"
                  >
                    <achievement.icon className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-black dark:text-muted-foreground">{achievement.text}</span>
                  </motion.div>
                ))}
              </div>

              <h3 className="text-lg font-heading font-bold text-gradient-gold mb-4">Follow Us</h3>
              <GlassIcons
                items={[
                  { icon: <Facebook />, color: "blue", label: "Facebook", href: "#" },
                  { icon: <Twitter />, color: "blue", label: "Twitter", href: "#" },
                  { icon: <Instagram />, color: "purple", label: "Instagram", href: "#" },
                  { icon: <Linkedin />, color: "blue", label: "LinkedIn", href: "#" },
                  { icon: <Youtube />, color: "red", label: "YouTube", href: "#" }
                ]}
              />
            </motion.div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border/30 py-6 px-4 sm:px-6">
          <div className="container-wide flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-black dark:text-muted-foreground">
              &copy; {currentYear} {brandingData.schoolName}. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <Link to="/privacy" className="text-xs text-black dark:text-muted-foreground hover:text-gold transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-xs text-black dark:text-muted-foreground hover:text-gold transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-xs text-black dark:text-muted-foreground hover:text-gold transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;