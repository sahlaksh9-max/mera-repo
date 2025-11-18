import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, GraduationCap, Users, BookOpen, Heart, Star, Clock, Award, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

const PrimaryEducation = () => {
  const features = [
    {
      icon: Heart,
      title: "Nurturing Environment",
      description: "Creating a safe, supportive atmosphere where young minds can flourish and develop confidence."
    },
    {
      icon: BookOpen,
      title: "Foundational Learning",
      description: "Building strong foundations in literacy, numeracy, and critical thinking skills."
    },
    {
      icon: Users,
      title: "Small Class Sizes",
      description: "Maximum 15 students per class ensuring personalized attention for every child."
    },
    {
      icon: Play,
      title: "Play-Based Learning",
      description: "Learning through play, exploration, and hands-on activities that engage young learners."
    }
  ];

  const curriculum = [
    {
      subject: "English Language Arts",
      description: "Reading, writing, speaking, and listening skills development through engaging literature and creative activities.",
      highlights: ["Phonics instruction", "Creative writing", "Reading comprehension", "Oral communication"]
    },
    {
      subject: "Mathematics",
      description: "Building number sense, problem-solving skills, and mathematical reasoning through concrete and visual methods.",
      highlights: ["Number operations", "Geometry basics", "Measurement", "Problem solving"]
    },
    {
      subject: "Science",
      description: "Exploring the natural world through observation, experimentation, and discovery-based learning.",
      highlights: ["Nature studies", "Simple experiments", "Scientific method", "Environmental awareness"]
    },
    {
      subject: "Social Studies",
      description: "Understanding community, culture, and basic geography while developing citizenship skills.",
      highlights: ["Community helpers", "Cultural awareness", "Basic geography", "Civic responsibility"]
    },
    {
      subject: "Arts & Creativity",
      description: "Fostering creativity through visual arts, music, drama, and creative expression.",
      highlights: ["Drawing & painting", "Music appreciation", "Drama activities", "Craft projects"]
    },
    {
      subject: "Physical Education",
      description: "Developing gross motor skills, coordination, and healthy lifestyle habits through fun activities.",
      highlights: ["Motor skill development", "Team games", "Health awareness", "Physical fitness"]
    }
  ];

  const ageGroups = [
    {
      grade: "Kindergarten",
      age: "Ages 5-6",
      focus: "Social skills, basic literacy, and number recognition through play and exploration.",
      activities: ["Story time", "Art projects", "Music & movement", "Outdoor play"]
    },
    {
      grade: "Grade 1",
      age: "Ages 6-7",
      focus: "Introduction to formal learning with emphasis on reading, writing, and basic math concepts.",
      activities: ["Phonics lessons", "Math manipulatives", "Science observations", "Group projects"]
    },
    {
      grade: "Grade 2",
      age: "Ages 7-8",
      focus: "Building fluency in reading and writing while expanding mathematical understanding.",
      activities: ["Independent reading", "Creative writing", "Math problem solving", "Science experiments"]
    },
    {
      grade: "Grade 3",
      age: "Ages 8-9",
      focus: "Developing critical thinking skills and preparing for more advanced academic concepts.",
      activities: ["Research projects", "Advanced math concepts", "Scientific inquiry", "Public speaking"]
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
            <h1 className="text-2xl font-heading font-bold text-gradient-gold">Primary Education</h1>
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
              Primary <span className="text-gradient-gold">Education</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Building strong foundations for lifelong learning through engaging, age-appropriate education 
              that nurtures curiosity, creativity, and character development.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Features */}
      <section className="section-padding bg-gradient-to-b from-background to-muted/20">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Why Choose Our Primary Program?
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our primary education program is designed to provide the perfect foundation for your child's educational journey.
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

      {/* Age Groups */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Grade Levels & Age Groups
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Each grade level is carefully designed to meet the developmental needs of children at that stage.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ageGroups.map((group, index) => (
              <motion.div
                key={group.grade}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-royal to-gold flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-heading font-bold text-gradient-gold">
                      {group.grade}
                    </h4>
                    <p className="text-muted-foreground font-medium">{group.age}</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {group.focus}
                </p>
                <div>
                  <h5 className="font-semibold mb-3">Key Activities:</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {group.activities.map((activity, actIndex) => (
                      <div key={actIndex} className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gold" />
                        <span className="text-sm text-muted-foreground">{activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="section-padding bg-gradient-to-b from-muted/20 to-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Comprehensive Curriculum
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our well-rounded curriculum ensures balanced development across all learning areas.
            </p>
          </motion.div>

          <div className="space-y-8">
            {curriculum.map((subject, index) => (
              <motion.div
                key={subject.subject}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8"
              >
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-royal to-gold flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-heading font-bold mb-3 text-gradient-gold">
                      {subject.subject}
                    </h4>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {subject.description}
                    </p>
                    <div>
                      <h5 className="font-semibold mb-3">Key Learning Areas:</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {subject.highlights.map((highlight, hIndex) => (
                          <div key={hIndex} className="flex items-center space-x-2">
                            <Award className="h-4 w-4 text-gold flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-royal/10 to-gold/10 border border-border rounded-lg p-12 text-center"
          >
            <Clock className="h-16 w-16 text-gold mx-auto mb-6" />
            <h3 className="text-3xl font-heading font-bold mb-6 text-gradient-gold">
              Ready to Begin Your Child's Journey?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Give your child the best start in their educational journey with our comprehensive primary education program.
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

export default PrimaryEducation;
