import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Shield, Target, Eye, Heart, Users, Award, BookOpen, Globe } from "lucide-react";

const AboutFixed = () => {
  // Core values data
  const values = [
    {
      icon: Shield,
      title: "Excellence",
      description: "We strive for the highest standards in everything we do, from academic achievement to character development."
    },
    {
      icon: Target,
      title: "Innovation",
      description: "We embrace new ideas, technologies, and teaching methods to enhance the learning experience."
    },
    {
      icon: Eye,
      title: "Integrity",
      description: "We uphold the highest ethical standards and promote honesty, respect, and responsibility."
    },
    {
      icon: Heart,
      title: "Community",
      description: "We foster a supportive, inclusive environment where everyone can thrive and contribute."
    }
  ];

  // Staff data
  const staffMembers = [
    {
      id: "principal-1",
      name: "Dr. Sarah Johnson",
      position: "Principal",
      description: "Dr. Sarah Johnson brings over 20 years of educational leadership experience to Royal Academy.",
      photos: ["https://images.unsplash.com/photo-1494790108755-2616c669-b163?w=400&h=400&fit=crop&crop=face&auto=format&q=80"],
      email: "principal@royalacademy.edu",
      phone: "+1 (555) 123-4567",
      qualifications: "Ph.D. in Educational Administration",
      experience: "20+ years in educational leadership"
    },
    {
      id: "vice-principal-1",
      name: "Prof. Michael Chen",
      position: "Vice Principal",
      description: "Prof. Michael Chen oversees academic affairs and curriculum development at Royal Academy.",
      photos: ["https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format&q=80"],
      email: "vp@royalacademy.edu",
      qualifications: "M.S. in Mathematics, M.Ed. in Educational Technology",
      experience: "15+ years in academic administration"
    },
    {
      id: "teacher-1",
      name: "Dr. Emily Rodriguez",
      position: "Head of Science Department",
      description: "Dr. Emily Rodriguez leads our science department with expertise in biology and environmental science.",
      photos: ["https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face&auto=format&q=80"],
      qualifications: "Ph.D. in Biology, M.S. in Environmental Science",
      experience: "12+ years in science education"
    }
  ];

  // Statistics data
  const achievements = [
    { icon: Users, value: "2,500+", label: "Students" },
    { icon: Award, value: "180+", label: "Faculty Members" },
    { icon: BookOpen, value: "45+", label: "Academic Programs" },
    { icon: Globe, value: "148+", label: "Years of Excellence" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal/20 via-background to-crimson/20"></div>
        <div className="container-wide relative z-10 px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-bold mb-4 sm:mb-6">
              <span className="text-gradient-gold">About Royal Academy</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2 sm:px-0 mb-4">
              Excellence in Education Since 1875
            </p>
            <p className="text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
              Royal Academy has been a beacon of educational excellence for over 148 years, 
              nurturing minds and shaping the future of countless students through innovative 
              teaching and character development.
            </p>
          </div>
        </div>
      </section>

      {/* History & Mission */}
      <section className="section-padding bg-gradient-to-b from-background to-muted/20">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-4xl font-heading font-semibold">Our Rich History</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Founded in 1875 by visionary educators, Royal Academy began as a small 
                  institution with big dreams. Today, we stand as one of the nation's premier 
                  educational establishments, combining time-honored traditions with innovative 
                  approaches to learning.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our commitment to excellence extends beyond academics. We believe in developing 
                  well-rounded individuals who are prepared to make meaningful contributions to society.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-heading font-semibold text-gradient-royal">Our Mission</h3>
                <div className="text-lg text-muted-foreground italic bg-card/50 p-6 rounded-lg border border-border">
                  "To provide exceptional education that empowers students to achieve their 
                  highest potential, fostering critical thinking, creativity, and moral 
                  leadership in a rapidly changing world."
                </div>
              </div>
            </div>

            {/* Values Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className="bg-card/50 border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold/20 to-gold/40 flex items-center justify-center">
                      <value.icon className="h-6 w-6 text-gold" />
                    </div>
                    <h4 className="text-xl font-heading font-semibold">{value.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="section-padding bg-gradient-to-r from-royal/5 via-background to-crimson/5">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold mb-6">Our Achievements</h2>
            <p className="text-xl text-muted-foreground">Numbers that reflect our commitment to excellence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div
                key={achievement.label}
                className="card-3d p-8 text-center group cursor-pointer"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-gold/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <achievement.icon className="h-8 w-8 text-gold" />
                  </div>
                  <div className="text-4xl font-heading font-bold text-gradient-gold">
                    {achievement.value}
                  </div>
                  <p className="text-muted-foreground text-lg">{achievement.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center bg-gradient-to-r from-royal/10 via-crimson/5 to-royal/10 p-12 rounded-2xl border border-border cursor-pointer">
            <h3 className="text-3xl font-heading font-semibold mb-6">Our Vision</h3>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              To be the world's leading educational institution, recognized for academic excellence,
              innovative teaching, and the development of ethical leaders who will shape a better future for humanity.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-6">Principal and Teacher Section</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Meet our dedicated leadership team and faculty members who guide Royal Academy towards excellence in education.
            </p>
          </div>

          {/* Staff Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {staffMembers.map((staff, index) => (
              <div
                key={staff.id}
                className="bg-card/50 border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                {/* Staff Photo */}
                {staff.photos[0] && (
                  <div className="relative mb-4">
                    <img
                      src={staff.photos[0]}
                      alt={staff.name}
                      className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-gold/30"
                    />
                  </div>
                )}

                {/* Staff Info */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-heading font-bold text-foreground mb-1">{staff.name}</h3>
                  <p className="text-gold font-medium mb-2">{staff.position}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{staff.description}</p>
                </div>

                {/* Additional Info */}
                <div className="space-y-2 text-sm">
                  {staff.qualifications && (
                    <div>
                      <span className="font-medium text-foreground">Qualifications: </span>
                      <span className="text-muted-foreground">{staff.qualifications}</span>
                    </div>
                  )}
                  {staff.experience && (
                    <div>
                      <span className="font-medium text-foreground">Experience: </span>
                      <span className="text-muted-foreground">{staff.experience}</span>
                    </div>
                  )}
                  {staff.email && (
                    <div>
                      <span className="font-medium text-foreground">Email: </span>
                      <a href={`mailto:${staff.email}`} className="text-gold hover:text-gold/80 transition-colors">
                        {staff.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutFixed;
