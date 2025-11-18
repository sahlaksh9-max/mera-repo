import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, Atom, Microscope, Calculator, Dna, Beaker, Zap, Award, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

const ScienceStream = () => {
  const features = [
    {
      icon: Microscope,
      title: "Advanced Laboratories",
      description: "State-of-the-art physics, chemistry, and biology labs with modern equipment and safety protocols."
    },
    {
      icon: Calculator,
      title: "Mathematical Excellence",
      description: "Advanced mathematics including calculus, statistics, and applied mathematics for scientific applications."
    },
    {
      icon: Dna,
      title: "Research Projects",
      description: "Independent research opportunities in collaboration with universities and research institutions."
    },
    {
      icon: Zap,
      title: "STEM Integration",
      description: "Integrated approach combining Science, Technology, Engineering, and Mathematics for holistic learning."
    }
  ];

  const subjects = [
    {
      name: "Physics",
      icon: Atom,
      description: "Study of matter, energy, and their interactions through theoretical concepts and practical experiments.",
      topics: ["Mechanics", "Thermodynamics", "Electromagnetism", "Modern Physics"],
      labs: ["Optics Lab", "Electronics Lab", "Mechanics Lab", "Wave Physics Lab"]
    },
    {
      name: "Chemistry",
      icon: Beaker,
      description: "Exploration of chemical reactions, molecular structures, and their applications in real-world scenarios.",
      topics: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Analytical Chemistry"],
      labs: ["Organic Synthesis", "Quantitative Analysis", "Spectroscopy", "Electrochemistry"]
    },
    {
      name: "Biology",
      icon: Dna,
      description: "Comprehensive study of living organisms, from molecular biology to ecosystem dynamics.",
      topics: ["Cell Biology", "Genetics", "Ecology", "Human Physiology"],
      labs: ["Microbiology Lab", "Genetics Lab", "Anatomy Lab", "Biotechnology Lab"]
    },
    {
      name: "Mathematics",
      icon: Calculator,
      description: "Advanced mathematical concepts essential for scientific analysis and problem-solving.",
      topics: ["Calculus", "Statistics", "Probability", "Applied Mathematics"],
      labs: ["Computer Lab", "Statistical Analysis", "Mathematical Modeling", "Data Science"]
    }
  ];

  const careerPaths = [
    {
      category: "Medical Sciences",
      careers: ["Doctor", "Surgeon", "Pharmacist", "Medical Researcher", "Veterinarian", "Dentist"],
      color: "from-red-500 to-pink-500"
    },
    {
      category: "Engineering",
      careers: ["Mechanical Engineer", "Electrical Engineer", "Software Engineer", "Civil Engineer", "Aerospace Engineer", "Biomedical Engineer"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      category: "Research & Academia",
      careers: ["Research Scientist", "University Professor", "Lab Technician", "Scientific Writer", "Patent Analyst", "Science Communicator"],
      color: "from-green-500 to-emerald-500"
    },
    {
      category: "Technology",
      careers: ["Data Scientist", "Biotechnologist", "Environmental Scientist", "Forensic Scientist", "Quality Control Analyst", "Technical Consultant"],
      color: "from-purple-500 to-indigo-500"
    }
  ];

  const achievements = [
    { stat: "95%", label: "Medical Entrance Success" },
    { stat: "88%", label: "Engineering Admission" },
    { stat: "15+", label: "Research Publications" },
    { stat: "92%", label: "Science Olympiad Winners" }
  ];

  const facilities = [
    {
      name: "Physics Laboratory",
      description: "Advanced equipment for mechanics, optics, electronics, and modern physics experiments.",
      equipment: ["Digital oscilloscopes", "Laser systems", "Spectrometers", "Radioactivity detectors"]
    },
    {
      name: "Chemistry Laboratory",
      description: "Fully equipped for organic, inorganic, and analytical chemistry experiments.",
      equipment: ["Fume hoods", "Analytical balances", "pH meters", "Distillation apparatus"]
    },
    {
      name: "Biology Laboratory",
      description: "Modern facilities for microbiology, genetics, and biotechnology research.",
      equipment: ["Microscopes", "Incubators", "Centrifuges", "PCR machines"]
    },
    {
      name: "Computer Lab",
      description: "High-performance computers for mathematical modeling and data analysis.",
      equipment: ["Scientific software", "Programming tools", "Simulation software", "Data analysis tools"]
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
            <h1 className="text-2xl font-heading font-bold text-gradient-gold">Science Stream</h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-background to-cyan-500/20"></div>
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
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 mb-6"
            >
              <Atom className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              Science <span className="text-gradient-gold">Stream</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explore the wonders of science through rigorous academics, hands-on laboratory work, 
              and research opportunities that prepare you for careers in medicine, engineering, and scientific research.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Achievements Stats */}
      <section className="section-padding bg-gradient-to-r from-blue-500/10 via-background to-cyan-500/10">
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
              Why Choose Science Stream?
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our science program combines theoretical knowledge with practical application for comprehensive learning.
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
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
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
              Core Science Subjects
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive curriculum covering all major scientific disciplines with extensive laboratory work.
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
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
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
                    <h5 className="font-semibold mb-3">Laboratory Work:</h5>
                    <div className="space-y-2">
                      {subject.labs.map((lab, lIndex) => (
                        <div key={lIndex} className="flex items-center space-x-2">
                          <Microscope className="h-4 w-4 text-gold" />
                          <span className="text-sm text-muted-foreground">{lab}</span>
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
              Science stream opens doors to diverse and rewarding career paths in various fields.
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
                        <Award className="h-4 w-4 text-gold flex-shrink-0" />
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

      {/* Laboratory Facilities */}
      <section className="section-padding bg-gradient-to-b from-muted/20 to-background">
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
              Modern laboratories equipped with advanced instruments for comprehensive scientific education.
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
                  <h5 className="font-semibold mb-4">Available Equipment:</h5>
                  <div className="grid grid-cols-1 gap-3">
                    {facility.equipment.map((item, eIndex) => (
                      <div key={eIndex} className="flex items-center space-x-3">
                        <Beaker className="h-5 w-5 text-gold flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
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
      <section className="section-padding bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
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
              Join our science stream and embark on a journey of discovery, innovation, and scientific excellence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/admissions">
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                  Apply Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">
                  Schedule Lab Visit
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ScienceStream;
