import { useState, useEffect } from "react";
import { Shield, Target, Eye, Heart } from "lucide-react";
import { getSupabaseData } from "@/lib/supabaseHelpers"; // Import Supabase helper

interface HomepageData {
  aboutTitle: string;
  aboutSubtitle: string;
  legacyTitle: string;
  legacyContent: string;
  missionTitle: string;
  missionContent: string;
  values: {
    excellence: { title: string; description: string };
    innovation: { title: string; description: string };
    vision: { title: string; description: string };
    community: { title: string; description: string };
  };
  fonts: {
    heading: string;
    body: string;
  };
}

const About = () => {
  const [homepageData, setHomepageData] = useState<HomepageData>({
    aboutTitle: "About Royal Academy",
    aboutSubtitle: "Established in 1875, Royal Academy has been a beacon of educational excellence for over 148 years, nurturing minds and shaping the future of countless students.",
    legacyTitle: "Our Legacy",
    legacyContent: "Founded by visionary educators, Royal Academy began as a small institution with big dreams. Today, we stand as one of the nation's premier educational establishments, combining time-honored traditions with innovative approaches to learning.\n\nOur commitment to excellence extends beyond academics. We believe in developing well-rounded individuals who are prepared to make meaningful contributions to society.",
    missionTitle: "Our Mission",
    missionContent: "To provide exceptional education that empowers students to achieve their highest potential, fostering critical thinking, creativity, and moral leadership in a rapidly changing world.",
    values: {
      excellence: {
        title: "Excellence",
        description: "Committed to the highest standards in education and character development."
      },
      innovation: {
        title: "Innovation",
        description: "Embracing cutting-edge teaching methods and technological advancement."
      },
      vision: {
        title: "Vision",
        description: "Preparing students to become global leaders and responsible citizens."
      },
      community: {
        title: "Community",
        description: "Building strong bonds within our diverse and inclusive school family."
      }
    },
    fonts: {
      heading: "Inter",
      body: "Inter"
    }
  });

  // Load homepage data from Supabase
  useEffect(() => {
    getSupabaseData('royal-academy-homepage', { // Ensure this matches the key used in Hero.tsx
      aboutTitle: "About Royal Academy",
      aboutSubtitle: "Established in 1875, Royal Academy has been a beacon of educational excellence for over 148 years, nurturing minds and shaping the future of countless students.",
      legacyTitle: "Our Legacy",
      legacyContent: "Founded by visionary educators, Royal Academy began as a small institution with big dreams. Today, we stand as one of the nation's premier educational establishments, combining time-honored traditions with innovative approaches to learning.\n\nOur commitment to excellence extends beyond academics. We believe in developing well-rounded individuals who are prepared to make meaningful contributions to society.",
      missionTitle: "Our Mission",
      missionContent: "To provide exceptional education that empowers students to achieve their highest potential, fostering critical thinking, creativity, and moral leadership in a rapidly changing world.",
      values: {
        excellence: {
          title: "Excellence",
          description: "Committed to the highest standards in education and character development."
        },
        innovation: {
          title: "Innovation",
          description: "Embracing cutting-edge teaching methods and technological advancement."
        },
        vision: {
          title: "Vision",
          description: "Preparing students to become global leaders and responsible citizens."
        },
        community: {
          title: "Community",
          description: "Building strong bonds within our diverse and inclusive school family."
        }
      },
      fonts: {
        heading: "Inter",
        body: "Inter"
      }
    }).then(data => {
      setHomepageData({
        aboutTitle: data.aboutTitle || "About Royal Academy",
        aboutSubtitle: data.aboutSubtitle || "Established in 1875, Royal Academy has been a beacon of educational excellence for over 148 years, nurturing minds and shaping the future of countless students.",
        legacyTitle: data.legacyTitle || "Our Legacy",
        legacyContent: data.legacyContent || "Founded by visionary educators, Royal Academy began as a small institution with big dreams. Today, we stand as one of the nation's premier educational establishments, combining time-honored traditions with innovative approaches to learning.\n\nOur commitment to excellence extends beyond academics. We believe in developing well-rounded individuals who are prepared to make meaningful contributions to society.",
        missionTitle: data.missionTitle || "Our Mission",
        missionContent: data.missionContent || "To provide exceptional education that empowers students to achieve their highest potential, fostering critical thinking, creativity, and moral leadership in a rapidly changing world.",
        values: {
          excellence: {
            title: data.values?.excellence?.title || "Excellence",
            description: data.values?.excellence?.description || "Committed to the highest standards in education and character development."
          },
          innovation: {
            title: data.values?.innovation?.title || "Innovation",
            description: data.values?.innovation?.description || "Embracing cutting-edge teaching methods and technological advancement."
          },
          vision: {
            title: data.values?.vision?.title || "Vision",
            description: data.values?.vision?.description || "Preparing students to become global leaders and responsible citizens."
          },
          community: {
            title: data.values?.community?.title || "Community",
            description: data.values?.community?.description || "Building strong bonds within our diverse and inclusive school family."
          }
        },
        fonts: {
          heading: data.fonts?.heading || "Inter",
          body: data.fonts?.body || "Inter"
        }
      });
    }).catch(error => {
      console.error("Error loading About page data from Supabase:", error);
      // Fallback to initial state if Supabase data loading fails
      setHomepageData(prevState => ({ ...prevState })); 
    });
  }, []);

  const values = [
    {
      icon: Shield,
      title: homepageData.values.excellence.title,
      description: homepageData.values.excellence.description,
    },
    {
      icon: Target,
      title: homepageData.values.innovation.title,
      description: homepageData.values.innovation.description,
    },
    {
      icon: Eye,
      title: homepageData.values.vision.title,
      description: homepageData.values.vision.description,
    },
    {
      icon: Heart,
      title: homepageData.values.community.title,
      description: homepageData.values.community.description,
    },
  ];

  return (
    <section className="py-8 sm:py-16 px-4 sm:px-6 bg-gradient-to-b from-background to-muted/20">
      <div className="container-wide">
        <div className="text-center mb-8 sm:mb-16 animate-fade-in">
          <h2 
            className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 sm:mb-6 px-2 sm:px-0"
            style={{ fontFamily: homepageData.fonts.heading }}
          >
            {homepageData.aboutTitle.split(' ').map((word, index) => 
              word === 'Royal' || word === 'Academy' ? (
                <span key={index} className="text-gradient-gold">{word} </span>
              ) : (
                <span key={index}>{word} </span>
              )
            )}
          </h2>
          <p 
            className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2 sm:px-0"
            style={{ fontFamily: homepageData.fonts.body }}
          >
            {homepageData.aboutSubtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center mb-12 sm:mb-20">
          {/* History & Mission */}
          <div className="space-y-6 sm:space-y-8 animate-slide-up px-2 sm:px-0">
            <div className="space-y-4 sm:space-y-6">
              <h3 
                className="text-xl sm:text-3xl font-heading font-semibold"
                style={{ fontFamily: homepageData.fonts.heading }}
              >
                {homepageData.legacyTitle}
              </h3>
              {homepageData.legacyContent.split('\n\n').map((paragraph, index) => (
                <p 
                  key={index}
                  className="text-base sm:text-lg text-muted-foreground leading-relaxed"
                  style={{ fontFamily: homepageData.fonts.body }}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="space-y-4">
              <h4 
                className="text-lg sm:text-2xl font-heading font-semibold text-gradient-gold"
                style={{ fontFamily: homepageData.fonts.heading }}
              >
                {homepageData.missionTitle}
              </h4>
              <p 
                className="text-base sm:text-lg text-muted-foreground italic bg-card/50 p-4 sm:p-6 rounded-lg border border-border"
                style={{ fontFamily: homepageData.fonts.body }}
              >
                "{homepageData.missionContent}"
              </p>
            </div>
          </div>

          {/* Values Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 px-2 sm:px-0">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="card-3d p-4 sm:p-6 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold/20 to-gold/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <value.icon className="h-6 w-6 text-gold" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-heading font-semibold">{value.title}</h4>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vision Statement */}
        <div className="text-center bg-gradient-to-r from-royal/10 via-crimson/5 to-royal/10 p-6 sm:p-12 rounded-2xl border border-border animate-fade-in mx-2 sm:mx-0">
          <h3 className="text-xl sm:text-3xl font-heading font-semibold mb-4 sm:mb-6">Our Vision</h3>
          <p className="text-base sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-2 sm:px-0">
            To be the world's leading educational institution, recognized for academic excellence, 
            innovative teaching, and the development of ethical leaders who will shape a better future for humanity.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
