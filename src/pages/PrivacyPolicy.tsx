import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, Shield, Eye, Lock, Database, UserCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Shield,
      title: "Information We Collect",
      content: [
        "Personal information such as name, email address, phone number, and mailing address when you contact us or apply for admission.",
        "Academic records and educational history for enrolled students.",
        "Payment information for tuition and fees (processed securely through third-party providers).",
        "Website usage data including IP addresses, browser information, and pages visited."
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        "To process applications and provide educational services.",
        "To communicate with students, parents, and prospective families.",
        "To improve our website and educational programs.",
        "To comply with legal and regulatory requirements.",
        "To send important updates about school activities and events."
      ]
    },
    {
      icon: Lock,
      title: "Information Security",
      content: [
        "We implement industry-standard security measures to protect your personal information.",
        "All sensitive data is encrypted during transmission and storage.",
        "Access to personal information is restricted to authorized personnel only.",
        "We regularly update our security protocols and conduct security audits."
      ]
    },
    {
      icon: Database,
      title: "Data Retention",
      content: [
        "Student records are maintained according to educational regulations and accreditation requirements.",
        "Marketing and communication data is retained for 3 years unless you opt out.",
        "Website analytics data is retained for 2 years.",
        "You may request deletion of your personal data subject to legal requirements."
      ]
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: [
        "Right to access your personal information we hold.",
        "Right to correct inaccurate or incomplete information.",
        "Right to request deletion of your personal data.",
        "Right to opt out of marketing communications.",
        "Right to file a complaint with relevant data protection authorities."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-card">
      {/* Header with Back Button - Mobile Optimized */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="px-4 py-3 sm:container-wide sm:py-4">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Link to="/" className="flex-shrink-0">
                <Button variant="outline" size="icon" className="h-9 w-9 p-0 sm:h-10 sm:w-auto sm:px-3 sm:py-2">
                  <ArrowLeft className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
              </Link>
              <Link to="/" className="flex-shrink-0">
                <Button variant="ghost" size="icon" className="h-9 w-9 p-0 sm:h-10 sm:w-auto sm:px-3 sm:py-2">
                  <Home className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Home</span>
                </Button>
              </Link>
            </div>
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-gradient-gold whitespace-nowrap overflow-hidden text-ellipsis ml-2">
              Privacy Policy
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 sm:container-wide sm:section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Introduction */}
          <div className="text-center mb-8 sm:mb-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-gold/20 to-yellow-500/20 mb-4 sm:mb-6"
            >
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-gold" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-3 sm:mb-4 px-2">
              Our Commitment to Your Privacy
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto px-2">
              At Royal Academy, we protect your personal information and are transparent about how we use it.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-4 sm:space-y-6">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px 0px 0px 0px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-gold/10 to-yellow-500/10 flex-shrink-0">
                    <section.icon className="h-5 w-5 sm:h-6 sm:w-6 text-gold" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mt-0.5">
                    {section.title}
                  </h3>
                </div>
                <ul className="space-y-2 pl-0">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-gold mr-2 mt-1.5 text-xs sm:text-sm">•</span>
                      <span className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Contact Information */}
          <div className="mt-12 sm:mt-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px 0px 0px 0px" }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-gold/5 to-yellow-500/5 border border-gold/20 rounded-xl p-6 sm:p-8 max-w-2xl mx-auto"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-gold/20 to-yellow-500/20 mb-4 sm:mb-6">
                <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-gold" />
              </div>
              <h3 className="text-xl sm:text-2xl font-heading font-bold mb-3 sm:mb-4">
                Questions About Our Privacy Policy?
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base mb-5 sm:mb-6">
                If you have any questions about our privacy practices, please contact us.
              </p>
              <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button className="w-full bg-gradient-to-r from-gold to-yellow-500 hover:from-gold/90 hover:to-yellow-500/90 text-black text-sm sm:text-base">
                    Contact Us
                  </Button>
                </Link>
                <Link to="/terms" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full text-sm sm:text-base">
                    View Terms
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Back to Top */}
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

export default PrivacyPolicy;
