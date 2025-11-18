import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, HelpCircle, Plus, Minus, GraduationCap, CreditCard, Users, BookOpen, Calendar, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqCategories = [
    {
      category: "Admissions",
      icon: GraduationCap,
      color: "from-blue-500 to-purple-500",
      questions: [
        {
          question: "What are the admission requirements for Royal Academy?",
          answer: "Admission requirements vary by grade level. Generally, we require completed application forms, academic transcripts, letters of recommendation, and an entrance exam. For specific requirements by grade, please contact our admissions office at admissions@royalacademy.edu or call (555) 123-4568."
        },
        {
          question: "When is the application deadline?",
          answer: "Application deadlines are: Fall semester - March 15th, Spring semester - October 15th. We recommend applying early as spaces are limited. Late applications may be considered on a case-by-case basis depending on availability."
        },
        {
          question: "Do you offer scholarships or financial aid?",
          answer: "Yes, Royal Academy offers need-based financial aid and merit scholarships. Financial aid applications are due by February 1st for the following academic year. We also offer payment plans to help families manage tuition costs."
        },
        {
          question: "Can I schedule a campus tour?",
          answer: "Absolutely! Campus tours are available Monday through Friday at 10 AM and 2 PM, and Saturdays at 10 AM. You can schedule a tour online through our website or by calling our admissions office. Virtual tours are also available."
        }
      ]
    },
    {
      category: "Academics",
      icon: BookOpen,
      color: "from-green-500 to-teal-500",
      questions: [
        {
          question: "What curriculum does Royal Academy follow?",
          answer: "We follow a comprehensive curriculum that combines traditional academic excellence with innovative teaching methods. Our program includes Advanced Placement (AP) courses, International Baccalaureate (IB) options, and specialized STEM and Arts programs."
        },
        {
          question: "What is the student-to-teacher ratio?",
          answer: "Royal Academy maintains a low student-to-teacher ratio of 12:1, ensuring personalized attention and support for each student. In specialized classes and laboratories, this ratio is even lower."
        },
        {
          question: "Do you offer online or hybrid learning options?",
          answer: "Yes, we offer flexible learning options including hybrid programs and fully online courses for certain subjects. Our digital learning platform provides interactive lessons, virtual labs, and real-time collaboration tools."
        },
        {
          question: "How do you support students with different learning needs?",
          answer: "We have a dedicated Learning Support Center with specialized teachers and resources. We provide individualized education plans (IEPs), tutoring services, and accommodations for students with learning differences."
        }
      ]
    },
    {
      category: "Tuition & Fees",
      icon: CreditCard,
      color: "from-orange-500 to-red-500",
      questions: [
        {
          question: "What is the annual tuition fee?",
          answer: "Tuition varies by grade level. Elementary: $18,000/year, Middle School: $22,000/year, High School: $26,000/year. This includes most educational materials, technology access, and basic extracurricular activities. Additional fees may apply for specialized programs."
        },
        {
          question: "Are there payment plan options available?",
          answer: "Yes, we offer flexible payment plans including monthly, quarterly, and semester payment options. There's also a 5% discount for full annual payment made before August 1st."
        },
        {
          question: "What additional costs should I expect?",
          answer: "Additional costs may include uniforms ($200-400), textbooks for advanced courses ($300-500), field trips ($100-300), and optional activities like music lessons or sports camps. We provide a detailed cost breakdown upon enrollment."
        },
        {
          question: "Do you accept education savings accounts or vouchers?",
          answer: "Yes, we accept various education funding options including 529 education savings plans, education vouchers where applicable, and employer education benefits. Our finance office can help you navigate these options."
        }
      ]
    },
    {
      category: "Student Life",
      icon: Users,
      color: "from-purple-500 to-pink-500",
      questions: [
        {
          question: "What extracurricular activities are available?",
          answer: "We offer over 50 clubs and activities including academic clubs, sports teams, arts programs, community service groups, and student government. Popular options include robotics club, debate team, theater productions, and various sports."
        },
        {
          question: "Do you provide transportation services?",
          answer: "Yes, we offer bus transportation covering most areas within a 25-mile radius. Transportation fees are $1,200 per year. We also have partnerships with local transportation services for extended coverage."
        },
        {
          question: "What are the school hours?",
          answer: "Regular school hours are 8:00 AM to 3:30 PM, Monday through Friday. Extended care is available from 7:00 AM to 6:00 PM for an additional fee. Half-day programs are available for younger students."
        },
        {
          question: "Do you provide meals and dining services?",
          answer: "Yes, we have a full-service cafeteria offering nutritious breakfast and lunch options. We accommodate dietary restrictions and allergies. Meal plans range from $800-1,200 per year depending on the option selected."
        }
      ]
    },
    {
      category: "General Information",
      icon: HelpCircle,
      color: "from-indigo-500 to-blue-500",
      questions: [
        {
          question: "How long has Royal Academy been established?",
          answer: "Royal Academy was founded in 1875, making us one of the oldest and most prestigious educational institutions in the region with over 148 years of educational excellence."
        },
        {
          question: "What makes Royal Academy different from other schools?",
          answer: "Our unique combination of traditional academic rigor, innovative teaching methods, small class sizes, and comprehensive character development programs sets us apart. We focus on developing not just academic excellence but also leadership, creativity, and moral values."
        },
        {
          question: "Do you have international students?",
          answer: "Yes, we welcome international students and have a dedicated International Student Services office. We provide English language support, cultural orientation, and assistance with visa requirements."
        },
        {
          question: "How can parents stay involved and informed?",
          answer: "We encourage parent involvement through our Parent-Teacher Association, volunteer opportunities, regular parent-teacher conferences, and our online parent portal where you can track grades, attendance, and school communications."
        }
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
              <Link to="/contact">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Contact</span>
                </Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Button>
              </Link>
            </div>
            <h1 className="text-2xl font-heading font-bold text-gradient-gold">FAQ</h1>
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
              <HelpCircle className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-4xl font-heading font-bold mb-4 text-gradient-gold">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find quick answers to the most common questions about Royal Academy. 
              If you can't find what you're looking for, feel free to contact us directly.
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg overflow-hidden"
              >
                {/* Category Header */}
                <div className={`bg-gradient-to-r ${category.color} p-6`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <category.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-white">
                      {category.category}
                    </h3>
                  </div>
                </div>

                {/* Questions */}
                <div className="p-6">
                  <div className="space-y-4">
                    {category.questions.map((faq, faqIndex) => {
                      const itemIndex = categoryIndex * 100 + faqIndex;
                      const isOpen = openItems.includes(itemIndex);
                      
                      return (
                        <motion.div
                          key={faqIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: (categoryIndex * 0.1) + (faqIndex * 0.05) }}
                          className="border border-border rounded-lg overflow-hidden"
                        >
                          <button
                            onClick={() => toggleItem(itemIndex)}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/20 transition-colors"
                          >
                            <span className="font-semibold text-foreground pr-4">
                              {faq.question}
                            </span>
                            <motion.div
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex-shrink-0"
                            >
                              {isOpen ? (
                                <Minus className="h-5 w-5 text-gold" />
                              ) : (
                                <Plus className="h-5 w-5 text-gold" />
                              )}
                            </motion.div>
                          </button>
                          
                          <motion.div
                            initial={false}
                            animate={{
                              height: isOpen ? "auto" : 0,
                              opacity: isOpen ? 1 : 0
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
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 bg-gradient-to-r from-royal/10 to-gold/10 border border-border rounded-lg p-8 text-center"
          >
            <Phone className="h-12 w-12 text-gold mx-auto mb-4" />
            <h3 className="text-2xl font-heading font-bold mb-4 text-gradient-gold">
              Still Have Questions?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our friendly team is here to help. 
              Contact us directly and we'll get back to you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link to="/contact">
                <Button variant="outline" className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Contact Us</span>
                </Button>
              </Link>
              <a href="mailto:info@royalacademy.edu">
                <Button className="bg-gradient-to-r from-royal to-gold hover:from-royal/80 hover:to-gold/80 text-white">
                  <Calendar className="h-4 w-4 mr-2" />
                  Email Us
                </Button>
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

export default FAQ;
