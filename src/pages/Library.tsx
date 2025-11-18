import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, BookOpen, Search, Clock, Users, Wifi, Computer, Award, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

const Library = () => {
  const stats = [
    { number: "250,000+", label: "Books & Resources" },
    { number: "50,000+", label: "Digital Resources" },
    { number: "500+", label: "Study Seats" },
    { number: "24/7", label: "Digital Access" }
  ];

  const collections = [
    {
      title: "General Collection",
      description: "Comprehensive collection covering all academic subjects and general interest topics.",
      items: "180,000+ books",
      icon: BookOpen
    },
    {
      title: "Reference Collection",
      description: "Encyclopedias, dictionaries, atlases, and specialized reference materials.",
      items: "15,000+ references",
      icon: Search
    },
    {
      title: "Digital Library",
      description: "E-books, online databases, digital journals, and multimedia resources.",
      items: "50,000+ digital items",
      icon: Computer
    },
    {
      title: "Special Collections",
      description: "Rare books, historical documents, and unique archival materials.",
      items: "5,000+ rare items",
      icon: Award
    }
  ];

  const services = [
    {
      service: "Research Assistance",
      description: "Professional librarians available to help with research projects and information literacy.",
      hours: "Monday-Friday: 8 AM - 6 PM"
    },
    {
      service: "Study Rooms",
      description: "Private and group study rooms available for reservation by students and faculty.",
      hours: "Available 24/7 with student ID"
    },
    {
      service: "Computer Lab",
      description: "High-speed computers with specialized software for academic and research purposes.",
      hours: "Monday-Sunday: 6 AM - 12 AM"
    },
    {
      service: "Printing & Scanning",
      description: "Professional printing, copying, and scanning services for academic materials.",
      hours: "Monday-Friday: 8 AM - 8 PM"
    },
    {
      service: "Interlibrary Loans",
      description: "Access to materials from other libraries worldwide through our lending network.",
      hours: "Processing: 2-5 business days"
    },
    {
      service: "Digital Archives",
      description: "Access to historical documents, theses, and institutional publications online.",
      hours: "Available 24/7 online"
    }
  ];

  const facilities = [
    {
      name: "Main Reading Hall",
      capacity: "200 seats",
      features: ["Silent study area", "Natural lighting", "Climate controlled", "WiFi access"]
    },
    {
      name: "Group Study Rooms",
      capacity: "12 rooms (4-8 people each)",
      features: ["Whiteboards", "Projectors", "Video conferencing", "Reservable online"]
    },
    {
      name: "Computer Laboratory",
      capacity: "50 workstations",
      features: ["Latest software", "High-speed internet", "Printing access", "Technical support"]
    },
    {
      name: "Multimedia Center",
      capacity: "25 seats",
      features: ["Audio/video editing", "Presentation practice", "Recording studio", "Equipment loans"]
    }
  ];

  const hours = [
    { day: "Monday - Thursday", hours: "7:00 AM - 11:00 PM" },
    { day: "Friday", hours: "7:00 AM - 9:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 8:00 PM" },
    { day: "Sunday", hours: "10:00 AM - 10:00 PM" },
    { day: "Holidays", hours: "Varies (Check website)" }
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
            <h1 className="text-2xl font-heading font-bold text-gradient-gold">Library</h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-background to-purple-500/20"></div>
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
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-6"
            >
              <BookOpen className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              Royal Academy <span className="text-gradient-gold">Library</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A world-class learning resource center providing access to vast collections, 
              cutting-edge technology, and expert research support for our academic community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-r from-blue-500/10 via-background to-purple-500/10">
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

      {/* Collections */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Our Collections
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive resources spanning all academic disciplines and research areas.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                  <collection.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-heading font-bold mb-3 text-gradient-gold">
                  {collection.title}
                </h4>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {collection.description}
                </p>
                <div className="text-sm font-medium text-gold">
                  {collection.items}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-gradient-to-b from-muted/20 to-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Library Services
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive support services to enhance your research and learning experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.service}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300"
              >
                <h4 className="text-xl font-heading font-bold mb-3 text-gradient-gold">
                  {service.service}
                </h4>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {service.description}
                </p>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gold" />
                  <span className="text-sm font-medium text-gold">{service.hours}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Library Facilities
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Modern spaces designed to support various learning and research activities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {facilities.map((facility, index) => (
              <motion.div
                key={facility.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-2xl font-heading font-bold text-gradient-gold">
                    {facility.name}
                  </h4>
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full text-sm font-medium text-gold">
                    {facility.capacity}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {facility.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-center space-x-2">
                      <Wifi className="h-4 w-4 text-gold flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hours */}
      <section className="section-padding bg-gradient-to-b from-muted/20 to-background">
        <div className="container-wide">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h3 className="text-4xl font-heading font-bold mb-6 text-gradient-gold">
                Library Hours
              </h3>
              <p className="text-xl text-muted-foreground">
                We're here when you need us most.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8"
            >
              <div className="space-y-4">
                {hours.map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                    <span className="font-medium text-foreground">{schedule.day}</span>
                    <span className="text-gold font-medium">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <BookOpen className="h-16 w-16 text-gold mx-auto mb-6" />
            <h3 className="text-3xl font-heading font-bold mb-6 text-gradient-gold">
              Start Your Research Journey
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover the wealth of resources available at Royal Academy Library. 
              Our expert staff is ready to help you succeed in your academic pursuits.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                <Search className="h-4 w-4 mr-2" />
                Search Catalog
              </Button>
              <Link to="/contact">
                <Button variant="outline">
                  Contact Librarian
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Library;
