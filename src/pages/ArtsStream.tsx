import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, Palette, BookOpen, Globe, Users, Feather, Theater, Award, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

const ArtsStream = () => {
  const features = [
    {
      icon: Palette,
      title: "Creative Expression",
      description: "Develop artistic skills and creative thinking through various forms of artistic expression."
    },
    {
      icon: BookOpen,
      title: "Literary Excellence",
      description: "Master language, literature, and communication skills for effective expression."
    },
    {
      icon: Globe,
      title: "Cultural Understanding",
      description: "Explore diverse cultures, histories, and social perspectives for global awareness."
    },
    {
      icon: Users,
      title: "Social Impact",
      description: "Understand society, human behavior, and develop skills for positive social change."
    }
  ];

  const subjects = [
    {
      name: "English Literature",
      icon: Feather,
      description: "Study of classic and contemporary literature, poetry, drama, and creative writing.",
      topics: ["Poetry Analysis", "Drama Studies", "Novel Criticism", "Creative Writing"],
      skills: ["Critical Analysis", "Creative Writing", "Communication", "Research Skills"]
    },
    {
      name: "History",
      icon: BookOpen,
      description: "Comprehensive study of world history, civilizations, and historical analysis.",
      topics: ["Ancient Civilizations", "Modern History", "World Wars", "Cultural History"],
      skills: ["Historical Analysis", "Research Methods", "Critical Thinking", "Documentation"]
    },
    {
      name: "Psychology",
      icon: Users,
      description: "Understanding human behavior, mental processes, and psychological principles.",
      topics: ["Cognitive Psychology", "Social Psychology", "Developmental Psychology", "Abnormal Psychology"],
      skills: ["Behavioral Analysis", "Counseling Basics", "Research Design", "Statistical Analysis"]
    },
    {
      name: "Political Science",
      icon: Globe,
      description: "Study of government systems, political theories, and international relations.",
      topics: ["Political Theory", "Comparative Politics", "International Relations", "Public Administration"],
      skills: ["Policy Analysis", "Debate Skills", "Leadership", "Civic Engagement"]
    }
  ];

  const careerPaths = [
    {
      category: "Law & Justice",
      careers: ["Lawyer", "Judge", "Legal Advisor", "Human Rights Activist", "Legal Researcher", "Court Reporter"],
      color: "from-blue-500 to-indigo-500"
    },
    {
      category: "Media & Communication",
      careers: ["Journalist", "News Anchor", "Content Writer", "Public Relations Officer", "Social Media Manager", "Documentary Filmmaker"],
      color: "from-purple-500 to-pink-500"
    },
    {
      category: "Education & Research",
      careers: ["Teacher", "Professor", "Educational Researcher", "Curriculum Developer", "Academic Writer", "Librarian"],
      color: "from-green-500 to-teal-500"
    },
    {
      category: "Public Service",
      careers: ["Civil Servant", "Diplomat", "Policy Analyst", "Social Worker", "NGO Worker", "Government Officer"],
      color: "from-orange-500 to-red-500"
    }
  ];

  const achievements = [
    { stat: "88%", label: "Law School Admission" },
    { stat: "92%", label: "Civil Services Success" },
    { stat: "35+", label: "Literary Awards" },
    { stat: "95%", label: "University Acceptance" }
  ];

  const programs = [
    {
      title: "Creative Writing Workshop",
      description: "Develop writing skills through poetry, short stories, and creative non-fiction.",
      benefits: ["Published anthology", "Writing mentorship", "Literary competitions", "Author interactions"]
    },
    {
      title: "Debate & Public Speaking",
      description: "Master the art of persuasion and effective communication through structured debates.",
      benefits: ["Competition participation", "Confidence building", "Critical thinking", "Leadership skills"]
    },
    {
      title: "Model United Nations",
      description: "Simulate UN proceedings to understand international relations and diplomacy.",
      benefits: ["Global perspective", "Negotiation skills", "Research abilities", "Cultural awareness"]
    },
    {
      title: "Community Service Program",
      description: "Engage with local communities to understand social issues and develop empathy.",
      benefits: ["Social awareness", "Leadership experience", "Networking", "Personal growth"]
    }
  ];

  const facilities = [
    {
      name: "Literature Library",
      description: "Extensive collection of classic and contemporary literature from around the world.",
      features: ["Rare book collection", "Digital archives", "Reading spaces", "Research databases"]
    },
    {
      name: "Art Studio",
      description: "Creative space for visual arts, painting, sculpture, and multimedia projects.",
      features: ["Art supplies", "Exhibition space", "Digital art tools", "Pottery wheel"]
    },
    {
      name: "Drama Theater",
      description: "Professional theater space for dramatic performances and public speaking events.",
      features: ["Stage lighting", "Sound system", "Costume room", "Rehearsal spaces"]
    },
    {
      name: "Research Center",
      description: "Dedicated facility for historical research and social science projects.",
      features: ["Historical archives", "Research tools", "Interview rooms", "Documentation equipment"]
    }
  ];

  const electives = [
    {
      name: "Philosophy",
      description: "Explore fundamental questions about existence, knowledge, and ethics."
    },
    {
      name: "Sociology",
      description: "Study society, social relationships, and cultural patterns."
    },
    {
      name: "Fine Arts",
      description: "Develop artistic skills in painting, sculpture, and visual arts."
    },
    {
      name: "Music",
      description: "Learn music theory, composition, and performance skills."
    },
    {
      name: "Foreign Languages",
      description: "Master additional languages like French, Spanish, or German."
    },
    {
      name: "Journalism",
      description: "Learn news writing, reporting, and media ethics."
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
            <h1 className="text-2xl font-heading font-bold text-gradient-gold">Arts Stream</h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-background to-pink-500/20"></div>
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
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-6"
            >
              <Palette className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              Arts <span className="text-gradient-gold">Stream</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explore the richness of human culture, creativity, and expression through literature, history, 
              social sciences, and the arts. Develop critical thinking and communication skills for impactful careers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Achievements Stats */}
      <section className="section-padding bg-gradient-to-r from-purple-500/10 via-background to-pink-500/10">
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
              Why Choose Arts Stream?
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our arts program nurtures creativity, critical thinking, and cultural understanding for well-rounded development.
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
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
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
              Core Arts Subjects
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive curriculum covering humanities, social sciences, and creative disciplines.
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
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
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

      {/* Elective Subjects */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Elective Subjects
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from a variety of elective subjects to customize your learning experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {electives.map((elective, index) => (
              <motion.div
                key={elective.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300"
              >
                <h4 className="text-lg font-heading font-bold mb-3 text-gradient-gold">
                  {elective.name}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {elective.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Paths */}
      <section className="section-padding bg-gradient-to-b from-muted/20 to-background">
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
              Arts stream graduates excel in diverse fields requiring creativity, communication, and critical thinking.
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
                        <Theater className="h-4 w-4 text-gold flex-shrink-0" />
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
      <section className="section-padding">
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
              Enrichment programs designed to enhance your creative and intellectual development.
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
      <section className="section-padding bg-gradient-to-b from-muted/20 to-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Creative Learning Spaces
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Inspiring facilities designed to nurture creativity and intellectual exploration.
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
                        <Palette className="h-5 w-5 text-gold flex-shrink-0" />
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
      <section className="section-padding bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Clock className="h-16 w-16 text-gold mx-auto mb-6" />
            <h3 className="text-3xl font-heading font-bold mb-6 text-gradient-gold">
              Ready to Express Your Creativity?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our arts stream and discover your potential in literature, history, social sciences, and creative arts.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/admissions">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  Apply Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">
                  Visit Creative Spaces
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ArtsStream;
