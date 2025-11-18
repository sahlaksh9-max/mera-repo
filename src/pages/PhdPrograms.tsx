import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, GraduationCap, BookOpen, Users, Award, Calendar, Clock, Brain, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

const PhdPrograms = () => {
  const stats = [
    { number: "15+", label: "PhD Programs" },
    { number: "4:1", label: "Student-Faculty Ratio" },
    { number: "100%", label: "Research Funding" },
    { number: "4-6 Years", label: "Average Completion" }
  ];

  const programs = [
    {
      name: "Computer Science",
      description: "Advanced research in AI, machine learning, cybersecurity, and computational theory.",
      duration: "4-5 years",
      funding: "Full funding available"
    },
    {
      name: "Physics",
      description: "Cutting-edge research in quantum mechanics, astrophysics, and condensed matter physics.",
      duration: "5-6 years", 
      funding: "Research assistantships"
    },
    {
      name: "Biology",
      description: "Innovative research in molecular biology, genetics, ecology, and biotechnology.",
      duration: "4-5 years",
      funding: "Full funding available"
    },
    {
      name: "Psychology",
      description: "Advanced study in cognitive, clinical, developmental, and social psychology.",
      duration: "5-6 years",
      funding: "Teaching assistantships"
    },
    {
      name: "Economics",
      description: "Research in microeconomics, macroeconomics, econometrics, and behavioral economics.",
      duration: "4-5 years",
      funding: "Full funding available"
    },
    {
      name: "History",
      description: "Scholarly research in world history, cultural studies, and historical methodology.",
      duration: "5-7 years",
      funding: "Research fellowships"
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
              <Link to="/">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Home</span>
                </Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Button>
              </Link>
            </div>
            <h1 className="text-2xl font-heading font-bold text-gradient-gold">PhD Programs</h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-background to-blue-500/20"></div>
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
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mb-6"
            >
              <Brain className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              PhD <span className="text-gradient-gold">Programs</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Pursue the highest level of academic achievement through our doctoral programs. 
              Conduct groundbreaking research and contribute to the advancement of knowledge in your field.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-r from-purple-500/10 via-background to-blue-500/10">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-gradient-gold mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Doctoral Programs
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from our prestigious PhD programs with full funding and research opportunities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <motion.div
                key={program.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300"
              >
                <h4 className="text-xl font-heading font-bold mb-3 text-gradient-gold">
                  PhD in {program.name}
                </h4>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {program.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gold" />
                    <span className="text-sm text-muted-foreground">{program.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-gold" />
                    <span className="text-sm text-muted-foreground">{program.funding}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-purple-500/10 to-blue-500/10">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Search className="h-16 w-16 text-gold mx-auto mb-6" />
            <h3 className="text-3xl font-heading font-bold mb-6 text-gradient-gold">
              Begin Your Research Journey
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our community of scholars and researchers. Make your mark on the world through groundbreaking research.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/admissions">
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                  Apply Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">
                  Contact Graduate Office
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PhdPrograms;
