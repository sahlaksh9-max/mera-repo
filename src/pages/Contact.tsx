import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, User, Building, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import SubscriptionForm from "@/components/SubscriptionForm";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    class: "",
    subject: "",
    message: ""
  });
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      // Show scroll button when user has scrolled 400px OR is near the bottom of the page
      const scrolled = window.scrollY;
      const threshold = 400;
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000;
      
      setShowScrollTop(scrolled > threshold || nearBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["123 Royal Academy Drive", "Excellence City, EC 12345", "United States"],
      color: "from-blue-500/20 to-purple-500/20"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["Main Office: (555) 123-4567", "Admissions: (555) 123-4568", "Emergency: (555) 123-4569"],
      color: "from-green-500/20 to-blue-500/20"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@royalacademy.edu", "admissions@royalacademy.edu", "support@royalacademy.edu"],
      color: "from-purple-500/20 to-pink-500/20"
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: ["Monday - Friday: 8:00 AM - 5:00 PM", "Saturday: 9:00 AM - 2:00 PM", "Sunday: Closed"],
      color: "from-orange-500/20 to-red-500/20"
    }
  ];

  const departments = [
    { name: "Admissions Office", contact: "admissions@royalacademy.edu", phone: "(555) 123-4568" },
    { name: "Academic Affairs", contact: "academics@royalacademy.edu", phone: "(555) 123-4570" },
    { name: "Student Services", contact: "students@royalacademy.edu", phone: "(555) 123-4571" },
    { name: "Finance Office", contact: "finance@royalacademy.edu", phone: "(555) 123-4572" },
    { name: "Alumni Relations", contact: "alumni@royalacademy.edu", phone: "(555) 123-4573" },
    { name: "Media & Communications", contact: "media@royalacademy.edu", phone: "(555) 123-4574" }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    // Handle form submission
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal/20 via-background to-crimson/20"></div>
        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              Contact <span className="text-gradient-gold">Us</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're here to help and answer any questions you may have. Reach out to us and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="section-padding bg-gradient-to-b from-background to-muted/20">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-heading font-bold mb-6">Get In Touch</h2>
            <p className="text-xl text-muted-foreground">Multiple ways to reach our team</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 10 
                }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300
                }}
                className="card-3d p-6 text-center group cursor-pointer"
              >
                <div className={`h-32 ${info.color} relative overflow-hidden rounded-lg mb-6`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <info.icon className="h-12 w-12 text-white" />
                  </motion.div>
                </div>
                
                <h3 className="text-xl font-heading font-semibold mb-4 text-gradient-gold">{info.title}</h3>
                <div className="space-y-2">
                  {info.details.map((detail, idx) => (
                    <motion.p
                      key={detail}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + idx * 0.1 }}
                      className="text-muted-foreground text-sm"
                    >
                      {detail}
                    </motion.p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="section-padding bg-gradient-to-r from-royal/5 via-background to-crimson/5">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="card-3d p-8"
            >
              <div className="mb-8">
                <h3 className="text-3xl font-heading font-bold mb-4">Send us a Message</h3>
                <p className="text-muted-foreground">Fill out the form below and we'll get back to you shortly.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10 transition-all duration-300 focus:scale-105"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 transition-all duration-300 focus:scale-105"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10 transition-all duration-300 focus:scale-105"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class">Class/Grade</Label>
                    <select
                      id="class"
                      name="class"
                      value={formData.class}
                      onChange={(e) => setFormData({...formData, class: e.target.value})}
                      className="w-full p-2 border border-border rounded-md bg-background"
                    >
                      <option value="">Select Class</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="pl-10 transition-all duration-300 focus:scale-105"
                      placeholder="What is this regarding?"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="transition-all duration-300 focus:scale-105"
                    placeholder="Tell us how we can help you..."
                    required
                  />
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button type="submit" variant="hero" size="xl" className="w-full group">
                    Send Message
                    <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </form>
            </motion.div>

            {/* Map & Departments */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Subscription Form */}
              <div className="card-3d p-8">
                <h3 className="text-2xl font-heading font-bold mb-6">Stay Updated</h3>
                <p className="text-muted-foreground mb-4">
                  Subscribe to our newsletter and we'll notify you about our new updates.
                </p>
                <SubscriptionForm />
              </div>

              {/* Interactive Map Placeholder */}
              <div className="card-3d p-8">
                <h3 className="text-2xl font-heading font-bold mb-6">Our Location</h3>
                <div className="h-64 bg-gradient-to-br from-royal/20 to-crimson/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="text-center text-white">
                    <MapPin className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg font-semibold">Interactive Map</p>
                    <p className="text-sm opacity-80">123 Royal Academy Drive</p>
                  </div>
                </div>
              </div>

              {/* Department Contacts */}
              <div className="card-3d p-8">
                <h3 className="text-2xl font-heading font-bold mb-6">Department Contacts</h3>
                <div className="space-y-4">
                  {departments.map((dept, index) => (
                    <motion.div
                      key={dept.name}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02, x: 10 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-all duration-300 cursor-pointer"
                    >
                      <Building className="h-5 w-5 text-gold flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{dept.name}</h4>
                        <div className="flex flex-col sm:flex-row sm:space-x-4 text-xs text-muted-foreground">
                          <span>{dept.contact}</span>
                          <span>{dept.phone}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-gold hover:bg-gold/90 text-black shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-6 w-6" />
        </motion.button>
      )}

      <Footer />
    </div>
  );
};

export default Contact;