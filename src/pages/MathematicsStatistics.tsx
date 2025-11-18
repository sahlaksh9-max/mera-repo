import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, Calculator, BarChart3, TrendingUp, Brain, Award, Clock, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useState } from "react";

const MathematicsStatistics = () => {
  const [openFAQ, setOpenFAQ] = useState<number[]>([]);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const courses = [
    {
      name: "Pre-Calculus",
      description: "Advanced algebraic concepts, trigonometry, and analytical geometry preparing students for calculus-level mathematics.",
      details: [
        "Advanced algebraic functions and equations",
        "Trigonometric functions and identities",
        "Analytical geometry and conic sections",
        "Exponential and logarithmic functions",
        "Sequences, series, and mathematical induction"
      ],
      prerequisites: "Algebra II with B or higher",
      duration: "Full academic year",
      credits: "4 credits"
    },
    {
      name: "Advanced Calculus",
      description: "Comprehensive study of differential and integral calculus with applications in science, engineering, and economics.",
      details: [
        "Limits and continuity theory",
        "Differential calculus and applications",
        "Integral calculus and techniques",
        "Multivariable calculus fundamentals",
        "Real-world applications and modeling"
      ],
      prerequisites: "Pre-Calculus with B+ or higher",
      duration: "Full academic year",
      credits: "5 credits (AP weighted)"
    },
    {
      name: "Statistics",
      description: "Data analysis, probability theory, and statistical inference with emphasis on real-world applications and research methods.",
      details: [
        "Descriptive statistics and data visualization",
        "Probability distributions and theory",
        "Hypothesis testing and confidence intervals",
        "Regression analysis and correlation",
        "Experimental design and sampling methods"
      ],
      prerequisites: "Algebra II or concurrent enrollment",
      duration: "Full academic year",
      credits: "4 credits (AP option available)"
    },
    {
      name: "Applied Mathematics",
      description: "Mathematical modeling, optimization, and computational methods for solving real-world problems across disciplines.",
      details: [
        "Mathematical modeling techniques",
        "Linear programming and optimization",
        "Discrete mathematics and graph theory",
        "Numerical methods and computation",
        "Interdisciplinary problem-solving projects"
      ],
      prerequisites: "Advanced Calculus or concurrent enrollment",
      duration: "Semester",
      credits: "3 credits"
    }
  ];

  const features = [
    {
      icon: Calculator,
      title: "Advanced Problem Solving",
      description: "Develop analytical thinking and problem-solving skills through challenging mathematical concepts."
    },
    {
      icon: BarChart3,
      title: "Data Analysis",
      description: "Master statistical methods and data interpretation for evidence-based decision making."
    },
    {
      icon: TrendingUp,
      title: "Real-World Applications",
      description: "Apply mathematical concepts to solve problems in science, economics, and technology."
    },
    {
      icon: Brain,
      title: "Critical Thinking",
      description: "Enhance logical reasoning and abstract thinking through rigorous mathematical training."
    }
  ];

  const faqs = [
    {
      question: "What calculators are required for advanced mathematics courses?",
      answer: "We recommend the TI-84 Plus CE or TI-Nspire CX II for most courses. For Advanced Calculus and Applied Mathematics, a graphing calculator with CAS (Computer Algebra System) capabilities is beneficial. The school provides calculators for classroom use, but students often prefer having their own for homework and practice."
    },
    {
      question: "Are there opportunities for mathematics competitions?",
      answer: "Yes! We participate in the American Mathematics Competitions (AMC), Math League competitions, and local university math contests. We also have a Math Club that meets weekly to prepare for competitions and explore advanced mathematical topics."
    },
    {
      question: "How do you support students who struggle with advanced mathematics?",
      answer: "We offer multiple support systems including peer tutoring, teacher office hours, study groups, and individualized learning plans. Our math lab is open daily with qualified tutors, and we use technology tools to provide additional practice and visualization."
    },
    {
      question: "Can students take multiple mathematics courses simultaneously?",
      answer: "Exceptional students may take concurrent mathematics courses with department approval. Common combinations include Statistics with Advanced Calculus, or Applied Mathematics as an additional course for students who have completed the standard sequence."
    },
    {
      question: "What college credit opportunities are available?",
      answer: "We offer AP Calculus AB, AP Calculus BC, and AP Statistics, which can earn college credit. Additionally, our partnership with the local university allows qualified students to take dual enrollment courses in advanced mathematics."
    },
    {
      question: "How is technology integrated into mathematics instruction?",
      answer: "We use graphing calculators, computer algebra systems, statistical software (R, Python), and online platforms like Desmos and GeoGebra. Students learn to use technology as a tool for exploration, visualization, and problem-solving while maintaining strong computational skills."
    }
  ];

  const achievements = [
    { stat: "92%", label: "AP Exam Pass Rate" },
    { stat: "85%", label: "STEM College Enrollment" },
    { stat: "15+", label: "Math Competition Awards" },
    { stat: "98%", label: "College Math Readiness" }
  ];

  const pathways = [
    {
      title: "STEM Preparation",
      description: "Strong foundation for engineering, computer science, and natural sciences",
      courses: ["Pre-Calculus", "Advanced Calculus", "Statistics", "Applied Mathematics"]
    },
    {
      title: "Business & Economics",
      description: "Mathematical skills for business analysis and economic modeling",
      courses: ["Statistics", "Applied Mathematics", "Pre-Calculus", "Business Calculus"]
    },
    {
      title: "Data Science Track",
      description: "Preparation for careers in data analysis and statistical modeling",
      courses: ["Statistics", "Applied Mathematics", "Computer Science", "Research Methods"]
    },
    {
      title: "Advanced Research",
      description: "Preparation for graduate-level mathematics and research",
      courses: ["Advanced Calculus", "Applied Mathematics", "Independent Study", "Math Competitions"]
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
              <Link to="/academics">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Academics</span>
                </Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Button>
              </Link>
            </div>
            <h1 className="text-2xl font-heading font-bold text-gradient-gold">Mathematics & Statistics</h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-background to-green-500/20"></div>
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
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-green-500 mb-6"
            >
              <Calculator className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              Mathematics & <span className="text-gradient-gold">Statistics</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Advanced mathematical concepts from algebra to calculus and statistical analysis. 
              Build analytical thinking skills and prepare for STEM careers through rigorous mathematical training.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Achievements Stats */}
      <section className="section-padding bg-gradient-to-r from-blue-500/10 via-background to-green-500/10">
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
              Program Excellence
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our mathematics program develops analytical thinking and problem-solving skills essential for success in STEM fields.
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
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center mx-auto mb-4">
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

      {/* Course Details */}
      <section className="section-padding bg-gradient-to-b from-muted/20 to-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Course Offerings
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive mathematics curriculum from pre-calculus through advanced applied mathematics.
            </p>
          </motion.div>

          <div className="space-y-8">
            {courses.map((course, index) => (
              <motion.div
                key={course.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center flex-shrink-0">
                    <Calculator className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-heading font-bold mb-3 text-gradient-gold">
                      {course.name}
                    </h4>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {course.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h5 className="font-semibold mb-4 text-foreground">Course Content:</h5>
                        <ul className="space-y-2">
                          {course.details.map((detail, dIndex) => (
                            <li key={dIndex} className="flex items-start space-x-3">
                              <Award className="h-4 w-4 text-gold mt-1 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h6 className="font-semibold text-foreground mb-2">Prerequisites:</h6>
                          <p className="text-sm text-muted-foreground">{course.prerequisites}</p>
                        </div>
                        <div>
                          <h6 className="font-semibold text-foreground mb-2">Duration:</h6>
                          <p className="text-sm text-muted-foreground">{course.duration}</p>
                        </div>
                        <div>
                          <h6 className="font-semibold text-foreground mb-2">Credits:</h6>
                          <p className="text-sm text-muted-foreground">{course.credits}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Pathways */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Career Pathways
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our mathematics program prepares students for diverse career paths in STEM and beyond.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pathways.map((pathway, index) => (
              <motion.div
                key={pathway.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300"
              >
                <h4 className="text-xl font-heading font-bold mb-3 text-gradient-gold">
                  {pathway.title}
                </h4>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {pathway.description}
                </p>
                <div>
                  <h5 className="font-semibold mb-3 text-foreground">Recommended Courses:</h5>
                  <div className="flex flex-wrap gap-2">
                    {pathway.courses.map((course, cIndex) => (
                      <span
                        key={cIndex}
                        className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-border rounded-full text-xs text-muted-foreground"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-gradient-to-b from-muted/20 to-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Frequently Asked Questions
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get answers to common questions about our Mathematics & Statistics program.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/20 transition-colors"
                >
                  <span className="font-semibold text-foreground pr-4">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openFAQ.includes(index) ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    {openFAQ.includes(index) ? (
                      <Minus className="h-5 w-5 text-gold" />
                    ) : (
                      <Plus className="h-5 w-5 text-gold" />
                    )}
                  </motion.div>
                </button>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: openFAQ.includes(index) ? "auto" : 0,
                    opacity: openFAQ.includes(index) ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 pt-2 border-t border-border">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-blue-500/10 to-green-500/10">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Clock className="h-16 w-16 text-gold mx-auto mb-6" />
            <h3 className="text-3xl font-heading font-bold mb-6 text-gradient-gold">
              Ready to Excel in Mathematics?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our advanced mathematics program and develop the analytical skills needed for success in STEM careers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/admissions">
                <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white">
                  Apply Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">
                  Visit Math Department
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default MathematicsStatistics;
