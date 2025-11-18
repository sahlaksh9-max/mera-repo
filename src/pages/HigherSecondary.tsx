import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, GraduationCap, Users, BookOpen, Target, Brain, Trophy, Award, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

const HigherSecondary = () => {
  const features = [
    {
      icon: Brain,
      title: "Advanced Learning",
      description: "Sophisticated curriculum designed for college-bound students with advanced placement options."
    },
    {
      icon: Target,
      title: "University Preparation",
      description: "Comprehensive college counseling and preparation for top universities worldwide."
    },
    {
      icon: Users,
      title: "Research Opportunities",
      description: "Independent research projects and mentorship with faculty members."
    },
    {
      icon: Trophy,
      title: "Leadership Excellence",
      description: "Student government, peer mentoring, and community leadership programs."
    }
  ];

  const streams = [
    {
      name: "Science Stream",
      path: "/science-stream",
      subjects: ["Physics", "Chemistry", "Biology", "Mathematics"],
      careers: ["Medicine", "Engineering", "Research", "Technology"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Commerce Stream",
      path: "/commerce-stream", 
      subjects: ["Accounting", "Economics", "Business Studies", "Mathematics"],
      careers: ["Business", "Finance", "Accounting", "Economics"],
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Arts Stream",
      path: "/arts-stream",
      subjects: ["Literature", "History", "Psychology", "Political Science"],
      careers: ["Law", "Journalism", "Psychology", "Public Service"],
      color: "from-purple-500 to-pink-500"
    }
  ];

  const programs = [
    {
      title: "Advanced Placement (AP)",
      description: "College-level courses that allow students to earn university credits while in high school.",
      benefits: ["College credit", "University preparation", "Academic challenge", "Scholarship opportunities"]
    },
    {
      title: "International Baccalaureate (IB)",
      description: "Globally recognized program that develops critical thinking and international mindedness.",
      benefits: ["Global recognition", "Holistic education", "Critical thinking", "University advantage"]
    },
    {
      title: "Dual Enrollment",
      description: "Partnership with local universities allowing students to take college courses.",
      benefits: ["Early college experience", "Cost savings", "Academic acceleration", "University connections"]
    },
    {
      title: "Research Program",
      description: "Independent research projects under faculty mentorship in various disciplines.",
      benefits: ["Research skills", "Faculty mentorship", "Publication opportunities", "Graduate school preparation"]
    }
  ];

  const achievements = [
    { stat: "99%", label: "University Acceptance" },
    { stat: "92%", label: "AP Exam Success" },
    { stat: "$2.5M", label: "Scholarships Awarded" },
    { stat: "45+", label: "University Partners" }
  ];

  const grades = [
    {
      grade: "Grade 11",
      title: "Foundation Year",
      focus: "Stream selection and foundational courses in chosen specialization.",
      highlights: ["Stream orientation", "Core subjects", "Skill development", "Career counseling"]
    },
    {
      grade: "Grade 12",
      title: "Specialization Year", 
      focus: "Advanced study in chosen stream with university preparation and board examinations.",
      highlights: ["Advanced coursework", "Board exam preparation", "University applications", "Final projects"]
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
            <h1 className="text-2xl font-heading font-bold text-gradient-gold">Higher Secondary</h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal/20 via-background to-gold/20"></div>
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
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-royal to-gold mb-6"
            >
              <GraduationCap className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              Higher <span className="text-gradient-gold">Secondary</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              The final step in your school journey - specialized education that prepares you for university success 
              and career excellence through advanced academics and comprehensive preparation programs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Achievements Stats */}
      <section className="section-padding bg-gradient-to-r from-royal/10 via-background to-gold/10">
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
              Excellence in Higher Secondary Education
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced learning opportunities designed to prepare students for university and career success.
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
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-royal to-gold flex items-center justify-center mx-auto mb-4">
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

      {/* Academic Streams */}
      <section className="section-padding bg-gradient-to-b from-muted/20 to-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Choose Your Academic Stream
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Specialized programs designed to align with your interests and career aspirations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {streams.map((stream, index) => (
              <motion.div
                key={stream.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className={`bg-gradient-to-r ${stream.color} p-6 text-white`}>
                  <h4 className="text-2xl font-heading font-bold mb-2">{stream.name}</h4>
                  <p className="opacity-90">Specialized education pathway</p>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <h5 className="font-semibold mb-3">Core Subjects:</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {stream.subjects.map((subject, sIndex) => (
                        <div key={sIndex} className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-gold" />
                          <span className="text-sm text-muted-foreground">{subject}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mb-6">
                    <h5 className="font-semibold mb-3">Career Paths:</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {stream.careers.map((career, cIndex) => (
                        <div key={cIndex} className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-gold" />
                          <span className="text-sm text-muted-foreground">{career}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link to={stream.path}>
                    <Button className="w-full" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Grade Structure */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Two-Year Program Structure
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A carefully designed progression that builds expertise and prepares for university entrance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {grades.map((grade, index) => (
              <motion.div
                key={grade.grade}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-royal to-gold flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-heading font-bold text-gradient-gold">
                      {grade.title}
                    </h4>
                    <p className="text-muted-foreground font-medium">{grade.grade}</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {grade.focus}
                </p>
                <div>
                  <h5 className="font-semibold mb-4">Key Highlights:</h5>
                  <div className="grid grid-cols-1 gap-3">
                    {grade.highlights.map((highlight, hIndex) => (
                      <div key={hIndex} className="flex items-center space-x-3">
                        <Award className="h-5 w-5 text-gold flex-shrink-0" />
                        <span className="text-muted-foreground">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Programs */}
      <section className="section-padding bg-gradient-to-b from-muted/20 to-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Advanced Academic Programs
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Specialized programs that provide university-level learning experiences and competitive advantages.
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
                  <div className="grid grid-cols-1 gap-3">
                    {program.benefits.map((benefit, bIndex) => (
                      <div key={bIndex} className="flex items-center space-x-3">
                        <Trophy className="h-5 w-5 text-gold flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
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
      <section className="section-padding bg-gradient-to-r from-royal/10 to-gold/10">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Clock className="h-16 w-16 text-gold mx-auto mb-6" />
            <h3 className="text-3xl font-heading font-bold mb-6 text-gradient-gold">
              Ready for University Success?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our higher secondary program and take the final step towards your university and career goals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/admissions">
                <Button className="bg-gradient-to-r from-royal to-gold hover:from-royal/80 hover:to-gold/80 text-white">
                  Apply Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">
                  Schedule a Visit
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HigherSecondary;
