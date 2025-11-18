import Navigation from "@/components/Navigation";

const AboutWorking = () => {
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
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section style={{
        padding: '4rem 2rem',
        backgroundColor: '#1a1a2e'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            marginBottom: '3rem',
            textAlign: 'center',
            color: '#e94560'
          }}>
            Our Core Values
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                title: "Excellence",
                description: "We strive for the highest standards in everything we do, from academic achievement to character development."
              },
              {
                title: "Innovation",
                description: "We embrace new ideas, technologies, and teaching methods to enhance the learning experience."
              },
              {
                title: "Integrity",
                description: "We uphold the highest ethical standards and promote honesty, respect, and responsibility."
              },
              {
                title: "Community",
                description: "We foster a supportive, inclusive environment where everyone can thrive and contribute."
              }
            ].map((value, index) => (
              <div key={index} style={{
                backgroundColor: '#0f3460',
                padding: '2rem',
                borderRadius: '10px',
                textAlign: 'center',
                border: '1px solid #16213e'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#e94560',
                  borderRadius: '50%',
                  margin: '0 auto 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  {value.title[0]}
                </div>
                <h3 style={{
                  color: '#e94560',
                  fontSize: '1.3rem',
                  marginBottom: '1rem'
                }}>
                  {value.title}
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  color: '#d0d0d0'
                }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Staff Section */}
      <section style={{
        padding: '4rem 2rem',
        backgroundColor: '#0f3460'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            marginBottom: '2rem',
            textAlign: 'center',
            color: '#e94560'
          }}>
            Principal and Teacher Section
          </h2>
          <p style={{
            textAlign: 'center',
            fontSize: '1.1rem',
            marginBottom: '3rem',
            color: '#d0d0d0'
          }}>
            Meet our dedicated leadership team and faculty members who guide Royal Academy towards excellence in education.
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                name: "Dr. Sarah Johnson",
                position: "Principal",
                description: "Dr. Sarah Johnson brings over 20 years of educational leadership experience to Royal Academy.",
                photo: "https://images.unsplash.com/photo-1494790108755-2616c669-b163?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
                email: "principal@royalacademy.edu",
                qualifications: "Ph.D. in Educational Administration",
                experience: "20+ years in educational leadership"
              },
              {
                name: "Prof. Michael Chen",
                position: "Vice Principal",
                description: "Prof. Michael Chen oversees academic affairs and curriculum development at Royal Academy.",
                photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
                email: "vp@royalacademy.edu",
                qualifications: "M.S. in Mathematics, M.Ed. in Educational Technology",
                experience: "15+ years in academic administration"
              },
              {
                name: "Dr. Emily Rodriguez",
                position: "Head of Science Department",
                description: "Dr. Emily Rodriguez leads our science department with expertise in biology and environmental science.",
                photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
                qualifications: "Ph.D. in Biology, M.S. in Environmental Science",
                experience: "12+ years in science education"
              }
            ].map((staff, index) => (
              <div key={index} style={{
                backgroundColor: '#16213e',
                padding: '2rem',
                borderRadius: '15px',
                textAlign: 'center',
                border: '2px solid #1a1a2e'
              }}>
                <img
                  src={staff.photo}
                  alt={staff.name}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    margin: '0 auto 1rem',
                    border: '4px solid #e94560'
                  }}
                />
                <h3 style={{
                  color: '#e94560',
                  fontSize: '1.3rem',
                  marginBottom: '0.5rem'
                }}>
                  {staff.name}
                </h3>
                <p style={{
                  color: '#ffd700',
                  fontWeight: 'bold',
                  marginBottom: '1rem'
                }}>
                  {staff.position}
                </p>
                <p style={{
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  marginBottom: '1rem',
                  color: '#d0d0d0'
                }}>
                  {staff.description}
                </p>
                <div style={{ textAlign: 'left', fontSize: '0.85rem' }}>
                  <p style={{ marginBottom: '0.5rem' }}>
                    <strong style={{ color: '#e94560' }}>Qualifications:</strong> {staff.qualifications}
                  </p>
                  <p style={{ marginBottom: '0.5rem' }}>
                    <strong style={{ color: '#e94560' }}>Experience:</strong> {staff.experience}
                  </p>
                  {staff.email && (
                    <p>
                      <strong style={{ color: '#e94560' }}>Email:</strong>{' '}
                      <a href={`mailto:${staff.email}`} style={{ color: '#ffd700' }}>
                        {staff.email}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section style={{
        padding: '4rem 2rem',
        backgroundColor: '#1a1a2e'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            marginBottom: '3rem',
            textAlign: 'center',
            color: '#e94560'
          }}>
            Our Achievements
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem'
          }}>
            {[
              { number: "2,500+", label: "Students" },
              { number: "180+", label: "Faculty Members" },
              { number: "45+", label: "Academic Programs" },
              { number: "148+", label: "Years of Excellence" }
            ].map((stat, index) => (
              <div key={index} style={{
                textAlign: 'center',
                padding: '2rem',
                backgroundColor: '#0f3460',
                borderRadius: '10px',
                border: '2px solid #e94560'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: '#ffd700',
                  marginBottom: '0.5rem'
                }}>
                  {stat.number}
                </div>
                <div style={{
                  fontSize: '1.1rem',
                  color: '#d0d0d0'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section style={{
        padding: '4rem 2rem',
        backgroundColor: '#0f3460'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '2.5rem',
            marginBottom: '2rem',
            color: '#e94560'
          }}>
            Our Vision
          </h2>
          <p style={{
            fontSize: '1.2rem',
            lineHeight: '1.8',
            fontStyle: 'italic',
            color: '#f0f0f0'
          }}>
            "To be the world's leading educational institution, recognized for academic excellence, 
            innovative teaching, and the development of ethical leaders who will shape a better 
            future for humanity."
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#16213e',
        padding: '3rem 2rem',
        textAlign: 'center',
        borderTop: '1px solid #0f3460'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 style={{
            color: '#e94560',
            fontSize: '1.5rem',
            marginBottom: '1rem'
          }}>
            Royal Academy
          </h3>
          <p style={{
            marginBottom: '1rem',
            color: '#d0d0d0'
          }}>
            123 Education Boulevard, Academic City, AC 12345
          </p>
          <p style={{
            marginBottom: '1rem',
            color: '#d0d0d0'
          }}>
            Phone: +1 (555) 123-4567 | Email: info@royalacademy.edu
          </p>
          <p style={{
            color: '#888',
            fontSize: '0.9rem'
          }}>
            © 2024 Royal Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AboutWorking;
