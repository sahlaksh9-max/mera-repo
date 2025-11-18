import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, TrendingUp, Calculator, Building, DollarSign, BarChart3, PieChart, Award, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

const CommerceStream = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Business Acumen",
      description: "Develop essential business skills and entrepreneurial mindset for the modern economy."
    },
    {
      icon: Calculator,
      title: "Financial Literacy",
      description: "Master accounting principles, financial analysis, and economic decision-making."
    },
    {
      icon: BarChart3,
      title: "Market Analysis",
      description: "Learn to analyze market trends, consumer behavior, and business strategies."
    },
    {
      icon: Building,
      title: "Corporate Exposure",
      description: "Gain real-world experience through internships and industry partnerships."
    }
  ];

  const subjects = [
    {
      name: "Accountancy",
      icon: Calculator,
      description: "Comprehensive study of financial accounting, cost accounting, and management accounting principles.",
      topics: ["Financial Statements", "Cost Analysis", "Budgeting", "Auditing"],
      skills: ["Financial Analysis", "Record Keeping", "Tax Preparation", "Budget Planning"]
    },
    {
      name: "Business Studies",
      icon: Building,
      description: "Understanding business operations, management principles, and organizational behavior.",
      topics: ["Management Functions", "Marketing", "Human Resources", "Operations"],
      skills: ["Strategic Planning", "Leadership", "Team Management", "Decision Making"]
    },
    {
      name: "Economics",
      icon: TrendingUp,
      description: "Study of micro and macroeconomic principles, market dynamics, and economic policies.",
      topics: ["Market Structures", "National Income", "Money & Banking", "International Trade"],
      skills: ["Economic Analysis", "Policy Evaluation", "Market Research", "Forecasting"]
    },
    {
      name: "Mathematics",
      icon: PieChart,
      description: "Applied mathematics for business including statistics, probability, and financial mathematics.",
      topics: ["Statistics", "Probability", "Linear Programming", "Financial Mathematics"],
      skills: ["Data Analysis", "Statistical Modeling", "Optimization", "Risk Assessment"]
    }
  ];

  const careerPaths = [
    {
      category: "Finance & Banking",
      careers: ["Investment Banker", "Financial Analyst", "Portfolio Manager", "Credit Analyst", "Insurance Agent", "Tax Consultant"],
      color: "from-green-500 to-emerald-500"
    },
    {
      category: "Business & Management",
      careers: ["Business Manager", "Marketing Manager", "HR Manager", "Operations Manager", "Project Manager", "Business Consultant"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      category: "Accounting & Audit",
      careers: ["Chartered Accountant", "Cost Accountant", "Auditor", "Tax Advisor", "Financial Controller", "Forensic Accountant"],
      color: "from-purple-500 to-indigo-500"
    },
    {
      category: "Entrepreneurship",
      careers: ["Business Owner", "Startup Founder", "E-commerce Entrepreneur", "Franchise Owner", "Social Entrepreneur", "Business Innovator"],
      color: "from-orange-500 to-red-500"
    }
  ];

  const achievements = [
    { stat: "92%", label: "CA Foundation Pass Rate" },
    { stat: "85%", label: "Business School Admission" },
    { stat: "25+", label: "Industry Partnerships" },
    { stat: "78%", label: "Entrepreneurship Rate" }
  ];

  const programs = [
    {
      title: "Chartered Accountancy Preparation",
      description: "Specialized coaching for CA Foundation and Intermediate examinations.",
      benefits: ["Expert faculty", "Mock tests", "Study materials", "Career guidance"]
    },
    {
      title: "Business Incubation Program",
      description: "Support for student entrepreneurs to develop and launch their business ideas.",
      benefits: ["Mentorship", "Seed funding", "Market research", "Legal support"]
    },
    {
      title: "Industry Internships",
      description: "Practical experience in leading companies and financial institutions.",
      benefits: ["Real-world exposure", "Professional networking", "Skill development", "Job opportunities"]
    },
    {
      title: "Financial Markets Workshop",
      description: "Hands-on training in stock markets, trading, and investment strategies.",
      benefits: ["Market simulation", "Trading platforms", "Investment analysis", "Risk management"]
    }
  ];

  const facilities = [
    {
      name: "Business Lab",
      description: "Simulated business environment for practical learning and case studies.",
      features: ["Business simulation software", "Case study library", "Presentation facilities", "Group discussion rooms"]
    },
    {
      name: "Accounting Lab",
      description: "Computer lab with accounting software and financial analysis tools.",
      features: ["Tally software", "Excel for finance", "QuickBooks", "Financial calculators"]
    },
    {
      name: "Economics Resource Center",
      description: "Research facility with economic databases and analysis tools.",
      features: ["Economic databases", "Statistical software", "Research journals", "Market data access"]
    },
    {
      name: "Entrepreneurship Cell",
      description: "Dedicated space for budding entrepreneurs to develop their ideas.",
      features: ["Mentorship programs", "Pitch presentation area", "Networking events", "Startup resources"]
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
              <Link to="/higher-secondary">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Higher Secondary</span>
                </Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Button>
              </Link>
            </div>
            <h1 className="text-2xl font-heading font-bold text-gradient-gold">Commerce Stream</h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-background to-emerald-500/20"></div>
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
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-6"
            >
              <TrendingUp className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              Commerce <span className="text-gradient-gold">Stream</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Master the world of business, finance, and economics through comprehensive education 
              that prepares you for leadership roles in the corporate world and entrepreneurial ventures.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Achievements Stats */}
      <section className="section-padding bg-gradient-to-r from-green-500/10 via-background to-emerald-500/10">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-gradient-gold mb-2">
                  {achievement.stat}
                </div>
                <div className="text-muted-foreground font-medium">
                  {achievement.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Why Choose Commerce Stream?
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our commerce program combines theoretical knowledge with practical business skills for career success.
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
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
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

      {/* Core Subjects */}
      <section className="section-padding bg-gradient-to-b from-muted/20 to-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Core Commerce Subjects
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive curriculum covering all aspects of business, finance, and economics.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                    <subject.icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-2xl font-heading font-bold text-gradient-gold">
                    {subject.name}
                  </h4>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {subject.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold mb-3">Key Topics:</h5>
                    <div className="space-y-2">
                      {subject.topics.map((topic, tIndex) => (
                        <div key={tIndex} className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-gold" />
                          <span className="text-sm text-muted-foreground">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-3">Skills Developed:</h5>
                    <div className="space-y-2">
                      {subject.skills.map((skill, sIndex) => (
                        <div key={sIndex} className="flex items-center space-x-2">
                          <Award className="h-4 w-4 text-gold" />
                          <span className="text-sm text-muted-foreground">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Paths */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Career Opportunities
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Commerce stream opens doors to diverse career paths in business, finance, and entrepreneurship.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {careerPaths.map((category, index) => (
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
                  <div className="grid grid-cols-2 gap-3">
                    {category.careers.map((career, cIndex) => (
                      <div key={cIndex} className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gold flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{career}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Programs */}
      <section className="section-padding bg-gradient-to-b from-muted/20 to-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Special Programs
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Additional programs designed to enhance your business skills and career prospects.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 hover:shadow-lg transition-all duration-300"
              >
                <h4 className="text-2xl font-heading font-bold mb-4 text-gradient-gold">
                  {program.title}
                </h4>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {program.description}
                </p>
                <div>
                  <h5 className="font-semibold mb-4">Program Benefits:</h5>
                  <div className="grid grid-cols-2 gap-3">
                    {program.benefits.map((benefit, bIndex) => (
                      <div key={bIndex} className="flex items-center space-x-3">
                        <Award className="h-5 w-5 text-gold flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Modern Learning Facilities
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              State-of-the-art facilities designed to provide practical business education experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {facilities.map((facility, index) => (
              <motion.div
                key={facility.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 hover:shadow-lg transition-all duration-300"
              >
                <h4 className="text-2xl font-heading font-bold mb-4 text-gradient-gold">
                  {facility.name}
                </h4>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {facility.description}
                </p>
                <div>
                  <h5 className="font-semibold mb-4">Key Features:</h5>
                  <div className="grid grid-cols-1 gap-3">
                    {facility.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center space-x-3">
                        <Building className="h-5 w-5 text-gold flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-green-500/10 to-emerald-500/10">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Clock className="h-16 w-16 text-gold mx-auto mb-6" />
            <h3 className="text-3xl font-heading font-bold mb-6 text-gradient-gold">
              Ready to Lead in Business?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our commerce stream and develop the skills needed to succeed in the dynamic world of business and finance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/admissions">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                  Apply Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">
                  Schedule Business Lab Visit
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CommerceStream;
