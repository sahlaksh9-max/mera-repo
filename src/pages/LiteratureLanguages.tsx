import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, BookOpen, Globe, Feather, Users, Award, Clock, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useState } from "react";

const LiteratureLanguages = () => {
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
      name: "Advanced English",
      description: "Master advanced grammar, composition, and literary analysis through comprehensive study of classic and contemporary works.",
      details: [
        "Advanced grammar and syntax analysis",
        "Persuasive and analytical essay writing",
        "Literary criticism and interpretation",
        "Research methodology and citation",
        "Public speaking and presentation skills"
      ],
      prerequisites: "Completion of English 10 with B+ or higher",
      duration: "Full academic year",
      credits: "4 credits"
    },
    {
      name: "World Literature",
      description: "Explore literary masterpieces from diverse cultures and time periods, developing global perspective and cultural understanding.",
      details: [
        "Ancient epics and classical literature",
        "Medieval and Renaissance works",
        "Modern and contemporary global literature",
        "Comparative literary analysis",
        "Cultural context and historical significance"
      ],
      prerequisites: "Advanced English or equivalent",
      duration: "Full academic year",
      credits: "4 credits"
    },
    {
      name: "Creative Writing",
      description: "Develop your unique voice through poetry, short stories, and creative non-fiction with personalized feedback and peer workshops.",
      details: [
        "Poetry composition and analysis",
        "Short story writing techniques",
        "Creative non-fiction and memoir",
        "Character development and dialogue",
        "Publishing and submission process"
      ],
      prerequisites: "Teacher recommendation",
      duration: "Semester or full year",
      credits: "2-4 credits"
    },
    {
      name: "Foreign Languages",
      description: "Achieve fluency in Spanish, French, German, or Mandarin through immersive learning and cultural exploration.",
      details: [
        "Conversational fluency development",
        "Grammar and vocabulary mastery",
        "Cultural immersion activities",
        "Literature in target language",
        "Exchange program opportunities"
      ],
      prerequisites: "Varies by level",
      duration: "Full academic year",
      credits: "4 credits per level"
    }
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Literary Excellence",
      description: "Comprehensive study of literature from classical to contemporary works across cultures."
    },
    {
      icon: Globe,
      title: "Global Perspective",
      description: "Multilingual education and cross-cultural understanding through diverse literary traditions."
    },
    {
      icon: Feather,
      title: "Creative Expression",
      description: "Develop your unique voice through creative writing workshops and publishing opportunities."
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Peer workshops, discussion groups, and collaborative projects enhance learning experience."
    }
  ];

  const faqs = [
    {
      question: "What foreign languages are offered?",
      answer: "We offer Spanish, French, German, and Mandarin Chinese. Each language program includes 4 levels from beginner to advanced, with opportunities for native speaker conversation practice and cultural immersion activities."
    },
    {
      question: "Can I take multiple language courses simultaneously?",
      answer: "Yes, motivated students can take multiple languages. However, we recommend focusing on one language for the first two years to build a strong foundation before adding a second language."
    },
    {
      question: "Are there opportunities to publish creative writing?",
      answer: "Absolutely! We publish an annual literary magazine featuring student work, and we regularly submit to national high school writing competitions. Outstanding pieces may also be featured on our website and social media."
    },
    {
      question: "Do you offer AP Literature and Language courses?",
      answer: "Yes, we offer both AP English Literature and Composition and AP English Language and Composition. These courses prepare students for college-level analysis and writing."
    },
    {
      question: "Are there study abroad opportunities?",
      answer: "We partner with several international schools for summer exchange programs in Spain, France, Germany, and China. These programs provide immersive language and cultural experiences."
    },
    {
      question: "How do you support students with different learning styles?",
      answer: "Our literature and language programs incorporate visual, auditory, and kinesthetic learning approaches. We offer additional support through peer tutoring, writing centers, and individualized instruction plans."
    }
  ];

  const achievements = [
    { stat: "95%", label: "College Writing Readiness" },
    { stat: "88%", label: "AP Exam Pass Rate" },
    { stat: "12+", label: "Languages Offered" },
    { stat: "25+", label: "Literary Awards Won" }
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
            <h1 className="text-2xl font-heading font-bold text-gradient-gold">Literature & Languages</h1>
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
              <BookOpen className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              Literature & <span className="text-gradient-gold">Languages</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Comprehensive language arts program covering English, Foreign languages, and Creative Writing. 
              Develop communication skills, cultural understanding, and creative expression through diverse literary traditions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Achievements Stats */}
      <section className="section-padding bg-gradient-to-r from-purple-500/10 via-background to-blue-500/10">
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
              Program Highlights
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive approach to literature and languages prepares students for global communication and cultural understanding.
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
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
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
              Detailed breakdown of our literature and language courses with comprehensive curriculum information.
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
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-white" />
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

      {/* FAQ Section */}
      <section className="section-padding">
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
              Get answers to common questions about our Literature & Languages program.
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
      <section className="section-padding bg-gradient-to-r from-purple-500/10 to-blue-500/10">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Clock className="h-16 w-16 text-gold mx-auto mb-6" />
            <h3 className="text-3xl font-heading font-bold mb-6 text-gradient-gold">
              Ready to Master Language & Literature?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our comprehensive literature and languages program and develop the communication skills essential for success in any field.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/admissions">
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                  Apply Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">
                  Schedule Department Visit
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LiteratureLanguages;
