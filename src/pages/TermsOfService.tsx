import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, FileText, Users, CreditCard, AlertTriangle, Scale, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const TermsOfService = () => {
  const sections = [
    {
      icon: Users,
      title: "Acceptance of Terms",
      content: [
        "By accessing and using Royal Academy's website and services, you accept and agree to be bound by these Terms of Service.",
        "These terms apply to all visitors, users, students, parents, and others who access or use our services.",
        "If you disagree with any part of these terms, you may not access our website or use our services.",
        "We reserve the right to modify these terms at any time with notice to users."
      ]
    },
    {
      icon: BookOpen,
      title: "Educational Services",
      content: [
        "Royal Academy provides educational services including but not limited to academic instruction, extracurricular activities, and student support services.",
        "Enrollment is subject to application approval and availability of space in requested programs.",
        "Students are expected to maintain academic and behavioral standards as outlined in our Student Handbook.",
        "We reserve the right to modify curriculum, schedules, and policies as needed for educational excellence."
      ]
    },
    {
      icon: CreditCard,
      title: "Payment Terms",
      content: [
        "Tuition and fees are due according to the payment schedule provided at enrollment.",
        "Late payments may result in late fees and potential suspension of services.",
        "Refunds are subject to our refund policy as outlined in the enrollment agreement.",
        "All payments are processed securely through approved third-party payment processors.",
        "Additional fees may apply for special programs, activities, or services."
      ]
    },
    {
      icon: AlertTriangle,
      title: "Code of Conduct",
      content: [
        "All users must conduct themselves respectfully and professionally when interacting with staff, students, and other community members.",
        "Harassment, discrimination, or inappropriate behavior will not be tolerated.",
        "Students and parents are expected to follow all school policies and procedures.",
        "Violations may result in disciplinary action, including suspension or termination of services."
      ]
    },
    {
      icon: Scale,
      title: "Intellectual Property",
      content: [
        "All content on our website, including text, images, logos, and educational materials, is protected by copyright and trademark laws.",
        "Users may not reproduce, distribute, or modify our content without written permission.",
        "Student work and achievements may be used for promotional purposes with appropriate consent.",
        "Third-party content is used with permission and remains the property of respective owners."
      ]
    },
    {
      icon: FileText,
      title: "Limitation of Liability",
      content: [
        "Royal Academy strives to provide accurate information but makes no warranties about the completeness or accuracy of website content.",
        "We are not liable for any indirect, incidental, or consequential damages arising from use of our services.",
        "Our liability is limited to the amount of tuition paid for the current academic period.",
        "Users assume responsibility for their own actions and decisions based on information provided."
      ]
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
            <h1 className="text-2xl font-heading font-bold text-gradient-gold">Terms of Service</h1>
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
              <FileText className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-4xl font-heading font-bold mb-4 text-gradient-gold">
              Terms of Service
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These terms govern your use of Royal Academy's website and educational services. 
              Please read them carefully to understand your rights and responsibilities.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Effective Date: {new Date().toLocaleDateString()} | Last Updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-royal to-gold flex items-center justify-center">
                      <section.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-heading font-bold mb-4 text-gradient-gold">
                      {section.title}
                    </h3>
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-3">
                          <div className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-8"
          >
            <div className="flex items-start space-x-4">
              <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-heading font-bold mb-3 text-amber-800 dark:text-amber-200">
                  Important Notice
                </h3>
                <p className="text-amber-700 dark:text-amber-300 leading-relaxed mb-4">
                  These terms constitute a legally binding agreement between you and Royal Academy. 
                  By continuing to use our services, you acknowledge that you have read, understood, 
                  and agree to be bound by these terms.
                </p>
                <p className="text-amber-600 dark:text-amber-400 text-sm">
                  For questions about these terms, please contact our legal department at legal@royalacademy.edu
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-8 bg-gradient-to-r from-royal/10 to-gold/10 border border-border rounded-lg p-8 text-center"
          >
            <Scale className="h-12 w-12 text-gold mx-auto mb-4" />
            <h3 className="text-2xl font-heading font-bold mb-4 text-gradient-gold">
              Questions About These Terms?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              If you have any questions about these Terms of Service or need clarification on any provisions, 
              our legal and administrative team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
              <a href="mailto:legal@royalacademy.edu" className="text-gold hover:text-gold/80 transition-colors">
                legal@royalacademy.edu
              </a>
              <span className="hidden sm:block text-muted-foreground">•</span>
              <a href="tel:+15551234567" className="text-gold hover:text-gold/80 transition-colors">
                +1 (555) 123-4567
              </a>
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

export default TermsOfService;
