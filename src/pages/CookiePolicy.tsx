import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, Cookie, Settings, BarChart3, Shield, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const CookiePolicy = () => {
  const cookieTypes = [
    {
      icon: Shield,
      title: "Essential Cookies",
      description: "Required for basic website functionality",
      examples: [
        "Session management and user authentication",
        "Security features and fraud prevention",
        "Basic website navigation and functionality",
        "Language and accessibility preferences"
      ],
      canDisable: false
    },
    {
      icon: BarChart3,
      title: "Analytics Cookies",
      description: "Help us understand how visitors use our website",
      examples: [
        "Page views and user interaction tracking",
        "Website performance monitoring",
        "Popular content and feature usage",
        "Error tracking and debugging information"
      ],
      canDisable: true
    },
    {
      icon: Settings,
      title: "Functional Cookies",
      description: "Enhance your experience with personalized features",
      examples: [
        "Remember your preferences and settings",
        "Personalized content recommendations",
        "Social media integration features",
        "Live chat and support functionality"
      ],
      canDisable: true
    },
    {
      icon: Eye,
      title: "Marketing Cookies",
      description: "Used to deliver relevant advertisements",
      examples: [
        "Targeted advertising based on interests",
        "Social media advertising integration",
        "Email marketing campaign tracking",
        "Cross-platform advertising coordination"
      ],
      canDisable: true
    }
  ];

  const managementSteps = [
    {
      title: "Browser Settings",
      description: "Most browsers allow you to control cookies through their settings menu.",
      action: "Check your browser's privacy or security settings"
    },
    {
      title: "Cookie Consent Banner",
      description: "Use our cookie consent banner to customize your preferences.",
      action: "Click 'Cookie Settings' when the banner appears"
    },
    {
      title: "Privacy Settings Page",
      description: "Visit our privacy settings page to manage your preferences anytime.",
      action: "Access through your account settings or contact us"
    }
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
            <h1 className="text-2xl font-heading font-bold text-gradient-gold">Cookie Policy</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-wide section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Introduction */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-royal to-gold mb-6"
            >
              <Cookie className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-4xl font-heading font-bold mb-4 text-gradient-gold">
              Cookie Policy
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn about how Royal Academy uses cookies to improve your browsing experience 
              and provide personalized services on our website.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* What are Cookies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 mb-8"
          >
            <h3 className="text-2xl font-heading font-bold mb-4 text-gradient-gold">
              What are Cookies?
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Cookies are small text files that are stored on your device when you visit a website. 
              They help websites remember your preferences, improve functionality, and provide a better user experience.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Royal Academy uses cookies responsibly and transparently, always respecting your privacy 
              and giving you control over your data.
            </p>
          </motion.div>

          {/* Cookie Types */}
          <div className="space-y-6 mb-12">
            <h3 className="text-3xl font-heading font-bold text-gradient-gold text-center mb-8">
              Types of Cookies We Use
            </h3>
            {cookieTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-royal to-gold flex items-center justify-center">
                      <type.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xl font-heading font-bold text-gradient-gold">
                        {type.title}
                      </h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        type.canDisable 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400'
                      }`}>
                        {type.canDisable ? 'Optional' : 'Essential'}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-4">{type.description}</p>
                    <ul className="space-y-2">
                      {type.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex} className="flex items-start space-x-3">
                          <div className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Cookie Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 mb-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="h-8 w-8 text-gold" />
              <h3 className="text-2xl font-heading font-bold text-gradient-gold">
                Managing Your Cookie Preferences
              </h3>
            </div>
            <p className="text-muted-foreground mb-6">
              You have full control over which cookies you allow. Here's how you can manage your preferences:
            </p>
            <div className="space-y-4">
              {managementSteps.map((step, index) => (
                <div key={step.title} className="flex items-start space-x-4 p-4 rounded-lg bg-muted/10">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-royal to-gold flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                    <p className="text-muted-foreground text-sm mb-2">{step.description}</p>
                    <p className="text-gold text-sm font-medium">{step.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Third-Party Cookies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8 mb-8"
          >
            <h3 className="text-xl font-heading font-bold mb-4 text-blue-800 dark:text-blue-200">
              Third-Party Cookies
            </h3>
            <p className="text-blue-700 dark:text-blue-300 leading-relaxed mb-4">
              Some cookies on our website are set by third-party services we use, such as:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "Google Analytics for website analytics",
                "Social media platforms for sharing features",
                "Payment processors for secure transactions",
                "Customer support chat services"
              ].map((service, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <span className="text-blue-700 dark:text-blue-300 text-sm">{service}</span>
                </li>
              ))}
            </ul>
            <p className="text-blue-600 dark:text-blue-400 text-sm">
              These third parties have their own privacy policies governing their use of cookies.
            </p>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="bg-gradient-to-r from-royal/10 to-gold/10 border border-border rounded-lg p-8 text-center mb-8"
          >
            <Cookie className="h-12 w-12 text-gold mx-auto mb-4" />
            <h3 className="text-2xl font-heading font-bold mb-4 text-gradient-gold">
              Questions About Cookies?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              If you have any questions about our use of cookies or need help managing your preferences, 
              our privacy team is here to assist you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
              <a href="mailto:privacy@royalacademy.edu" className="text-gold hover:text-gold/80 transition-colors">
                privacy@royalacademy.edu
              </a>
              <span className="hidden sm:block text-muted-foreground">•</span>
              <a href="tel:+15551234567" className="text-gold hover:text-gold/80 transition-colors">
                +1 (555) 123-4567
              </a>
            </div>
          </motion.div>

          {/* Back to Home */}
          <div className="text-center">
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

export default CookiePolicy;
