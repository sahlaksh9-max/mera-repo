import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Home, 
  Map, 
  GraduationCap, 
  Users, 
  BookOpen, 
  Building, 
  Camera, 
  Calendar, 
  Phone, 
  Trophy,
  UserPlus,
  Shield,
  FileText,
  Cookie
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Sitemap = () => {
  const siteStructure = [
    {
      category: "Main Pages",
      icon: Home,
      pages: [
        { name: "Home", path: "/", description: "Welcome to Royal Academy" },
        { name: "About Us", path: "/about", description: "Our history and mission" },
        { name: "Contact", path: "/contact", description: "Get in touch with us" }
      ]
    },
    {
      category: "Academic",
      icon: BookOpen,
      pages: [
        { name: "Academics", path: "/academics", description: "Our academic programs and curriculum" },
        { name: "Admissions", path: "/admissions", description: "Join our academic community" },
        { name: "Top Scorers", path: "/top-scorers", description: "Celebrating academic excellence" }
      ]
    },
    {
      category: "School Life",
      icon: Users,
      pages: [
        { name: "Facilities", path: "/facilities", description: "World-class educational facilities" },
        { name: "Gallery", path: "/gallery", description: "Moments from school life" },
        { name: "Events", path: "/events", description: "Upcoming and past events" }
      ]
    },
    {
      category: "Legal & Policies",
      icon: Shield,
      pages: [
        { name: "Privacy Policy", path: "/privacy", description: "How we protect your privacy" },
        { name: "Terms of Service", path: "/terms", description: "Terms and conditions" },
        { name: "Cookie Policy", path: "/cookies", description: "Our cookie usage policy" }
      ]
    }
  ];

  const quickStats = [
    { icon: GraduationCap, label: "Academic Programs", count: "15+" },
    { icon: Users, label: "Faculty Members", count: "200+" },
    { icon: Trophy, label: "Awards Won", count: "500+" },
    { icon: Building, label: "Campus Facilities", count: "25+" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-card">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container-wide py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Button>
              </Link>
            </div>
            <h1 className="text-2xl font-heading font-bold text-gradient-gold">Sitemap</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-wide section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Introduction */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-royal to-gold mb-6"
            >
              <Map className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-4xl font-heading font-bold mb-4 text-gradient-gold">
              Site Navigation
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore all the pages and sections of the Royal Academy website. 
              Find exactly what you're looking for with our comprehensive sitemap.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-royal to-gold flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gradient-gold mb-1">{stat.count}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Site Structure */}
          <div className="space-y-8">
            {siteStructure.map((section, sectionIndex) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-royal to-gold flex items-center justify-center">
                    <section.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-gradient-gold">
                    {section.category}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.pages.map((page, pageIndex) => (
                    <motion.div
                      key={page.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: (sectionIndex * 0.1) + (pageIndex * 0.05) }}
                      className="group"
                    >
                      <Link
                        to={page.path}
                        className="block p-4 rounded-lg border border-border hover:border-gold/50 bg-background/50 hover:bg-card/80 transition-all duration-300 hover:shadow-md"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-foreground group-hover:text-gold transition-colors">
                            {page.name}
                          </h4>
                          <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-gold transition-colors rotate-180" />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {page.description}
                        </p>
                        <div className="mt-3 text-xs text-gold/70 font-mono">
                          {page.path}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Search Tip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8 text-center"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                <Map className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-heading font-bold text-blue-800 dark:text-blue-200">
                Can't Find What You're Looking For?
              </h3>
            </div>
            <p className="text-blue-700 dark:text-blue-300 mb-6 max-w-2xl mx-auto">
              If you can't find a specific page or information, try using the search function 
              or contact our support team for assistance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link to="/contact">
                <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/20">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </Link>
              <Link to="/">
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Back to Home */}
          <div className="text-center mt-12">
            <Link to="/">
              <Button className="bg-gradient-to-r from-royal to-gold hover:from-royal/80 hover:to-gold/80 text-white">
                <Home className="h-4 w-4 mr-2" />
                Return to Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Sitemap;
