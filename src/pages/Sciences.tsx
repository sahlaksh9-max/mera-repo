import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, Microscope, Atom, Dna, Beaker, Award, Clock, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useState } from "react";

const Sciences = () => {
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
      name: "Advanced Biology",
      description: "Comprehensive study of living systems from molecular biology to ecology with extensive laboratory investigations.",
      details: [
        "Molecular biology and genetics",
        "Cell biology and biochemistry",
        "Anatomy and physiology",
        "Ecology and evolution",
        "Biotechnology applications"
      ],
      prerequisites: "Biology I and Chemistry I with B or higher",
      duration: "Full academic year",
      credits: "5 credits (AP weighted)",
      labs: "3 hours per week"
    },
    {
      name: "Organic Chemistry",
      description: "Advanced study of carbon-based compounds, reaction mechanisms, and synthesis with emphasis on laboratory techniques.",
      details: [
        "Organic compound structure and bonding",
        "Reaction mechanisms and kinetics",
        "Synthesis and purification techniques",
        "Spectroscopic analysis methods",
        "Biochemical applications"
      ],
      prerequisites: "Chemistry I and II with B+ or higher",
      duration: "Full academic year",
      credits: "5 credits",
      labs: "4 hours per week"
    },
    {
      name: "Quantum Physics",
      description: "Introduction to modern physics including quantum mechanics, atomic structure, and nuclear physics.",
      details: [
        "Wave-particle duality and quantum theory",
        "Atomic and molecular structure",
        "Nuclear physics and radioactivity",
        "Solid state physics fundamentals",
        "Modern physics applications"
      ],
      prerequisites: "Physics I and Advanced Calculus",
      duration: "Full academic year",
      credits: "5 credits",
      labs: "3 hours per week"
    },
    {
      name: "Environmental Science",
      description: "Interdisciplinary study of environmental systems, sustainability, and human impact on natural ecosystems.",
      details: [
        "Ecosystem dynamics and biodiversity",
        "Environmental chemistry and toxicology",
        "Climate change and atmospheric science",
        "Renewable energy and sustainability",
        "Environmental policy and ethics"
      ],
      prerequisites: "Biology I and Chemistry I",
      duration: "Full academic year",
      credits: "4 credits (AP option available)",
      labs: "2 hours per week + field work"
    }
  ];

  const features = [
    {
      icon: Microscope,
      title: "Advanced Laboratories",
      description: "State-of-the-art equipment and facilities for hands-on scientific investigation and research."
    },
    {
      icon: Atom,
      title: "Research Opportunities",
      description: "Independent research projects and partnerships with local universities and research institutions."
    },
    {
      icon: Dna,
      title: "Modern Techniques",
      description: "Learn cutting-edge scientific methods including PCR, spectroscopy, and computational modeling."
    },
    {
      icon: Beaker,
      title: "Safety Excellence",
      description: "Comprehensive safety training and protocols ensuring secure learning environment for all experiments."
    }
  ];

  const faqs = [
    {
      question: "What laboratory equipment is available for student use?",
      answer: "Our science facilities include advanced microscopes, spectrophotometers, PCR machines, fume hoods, analytical balances, pH meters, and specialized equipment for each discipline. Students also have access to computer modeling software and data analysis tools."
    },
    {
      question: "Are there opportunities for original research?",
      answer: "Yes! Advanced students can participate in independent research projects under faculty mentorship. We also partner with local universities and research institutions for summer research internships and collaborative projects."
    },
    {
      question: "How do you ensure laboratory safety?",
      answer: "Safety is our top priority. All students complete comprehensive safety training, and we maintain strict protocols for chemical handling, equipment use, and emergency procedures. Our labs are equipped with modern safety equipment and are regularly inspected."
    },
    {
      question: "Can students participate in science competitions?",
      answer: "Absolutely! We participate in Science Olympiad, Intel Science Fair, regional chemistry competitions, and biology olympiads. Our students regularly place at state and national levels in these competitions."
    },
    {
      question: "What college preparation do these courses provide?",
      answer: "Our AP science courses (Biology, Chemistry, Physics, Environmental Science) provide college-level preparation and potential credit. Students are well-prepared for STEM majors and pre-professional programs like pre-med and pre-engineering."
    },
    {
      question: "Are field studies included in the curriculum?",
      answer: "Yes, especially in Environmental Science and Biology. We conduct field studies at local ecosystems, water quality monitoring, and collaborate with environmental organizations for real-world learning experiences."
    }
  ];

  const achievements = [
    { stat: "94%", label: "AP Science Pass Rate" },
    { stat: "78%", label: "STEM Career Pursuit" },
    { stat: "25+", label: "Research Projects Annually" },
    { stat: "12+", label: "Science Competition Awards" }
  ];

  const labFacilities = [
    {
      name: "Biology Research Lab",
      equipment: ["Advanced microscopes", "PCR machines", "Gel electrophoresis", "Cell culture facilities"],
      description: "Modern molecular biology and genetics research capabilities"
    },
    {
      name: "Chemistry Laboratory",
      equipment: ["Fume hoods", "Spectrophotometers", "Analytical balances", "Synthesis equipment"],
      description: "Comprehensive organic and analytical chemistry facilities"
    },
    {
      name: "Physics Laboratory",
      equipment: ["Laser systems", "Oscilloscopes", "Radiation detectors", "Optics equipment"],
      description: "Advanced physics experimentation and measurement tools"
    },
    {
      name: "Environmental Lab",
      equipment: ["Water quality meters", "Soil analysis tools", "Weather station", "GIS software"],
      description: "Field and laboratory analysis for environmental studies"
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
            <h1 className="text-2xl font-heading font-bold text-gradient-gold">Sciences</h1>
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
              <Microscope className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              <span className="text-gradient-gold">Sciences</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Hands-on laboratory experiences in Biology, Chemistry, Physics, and Environmental Science. 
              Discover the natural world through scientific inquiry, experimentation, and cutting-edge research.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Achievements Stats */}
      <section className="section-padding bg-gradient-to-r from-green-500/10 via-background to-blue-500/10">
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
              Scientific Excellence
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our science program combines theoretical knowledge with hands-on laboratory experience and research opportunities.
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
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
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
              Advanced Science Courses
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Rigorous curriculum designed to prepare students for STEM careers and advanced scientific study.
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
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <Microscope className="h-6 w-6 text-white" />
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
                        <div>
                          <h6 className="font-semibold text-foreground mb-2">Lab Time:</h6>
                          <p className="text-sm text-muted-foreground">{course.labs}</p>
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

      {/* Laboratory Facilities */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              State-of-the-Art Facilities
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Modern laboratories equipped with professional-grade equipment for comprehensive scientific education.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {labFacilities.map((lab, index) => (
              <motion.div
                key={lab.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300"
              >
                <h4 className="text-xl font-heading font-bold mb-3 text-gradient-gold">
                  {lab.name}
                </h4>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {lab.description}
                </p>
                <div>
                  <h5 className="font-semibold mb-3 text-foreground">Available Equipment:</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {lab.equipment.map((item, eIndex) => (
                      <div key={eIndex} className="flex items-center space-x-2">
                        <Beaker className="h-4 w-4 text-gold flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
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
              Get answers to common questions about our Sciences program.
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
      <section className="section-padding bg-gradient-to-r from-green-500/10 to-blue-500/10">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Clock className="h-16 w-16 text-gold mx-auto mb-6" />
            <h3 className="text-3xl font-heading font-bold mb-6 text-gradient-gold">
              Ready to Explore Science?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our advanced science program and discover the wonders of the natural world through hands-on research and experimentation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/admissions">
                <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
                  Apply Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">
                  Visit Science Labs
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Sciences;
