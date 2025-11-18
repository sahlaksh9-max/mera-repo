import { useState, useEffect } from "react";
import { ArrowRight, Award, BookOpen, Users } from "lucide-react";
import { Button } from "./ui/button-variants";
import { Link } from "react-router-dom";
import { getSupabaseData } from "@/lib/supabaseHelpers";
import ShinyText from "@/components/ShinyText";

interface HomepageData {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonPrimary: string;
  heroButtonSecondary: string;
  bannerImages: string[];
  autoRotate: boolean;
  rotationInterval: number;
  stats: {
    students: { number: string; label: string };
    programs: { number: string; label: string };
    awards: { number: string; label: string };
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

const Hero = () => {
  // State for homepage data
  const [homepageData, setHomepageData] = useState<HomepageData>({
    heroTitle: "Royal Academy",
    heroSubtitle: "Shaping tomorrow's leaders through excellence in education, character development, and innovative learning experiences.",
    heroButtonPrimary: "Apply for Admission",
    heroButtonSecondary: "Discover Our Legacy",
    bannerImages: [],
    autoRotate: true,
    rotationInterval: 3,
    stats: {
      students: { number: "2,500+", label: "Students" },
      programs: { number: "150+", label: "Programs" },
      awards: { number: "25+", label: "Awards" }
    },
    colors: {
      primary: "#1e40af",
      secondary: "#f59e0b",
      accent: "#10b981",
      background: "#ffffff",
      text: "#1f2937"
    },
    fonts: {
      heading: "Inter",
      body: "Inter"
    }
  });

  // State for branding data
  const [brandingData, setBrandingData] = useState({
    schoolName: "Royal Academy",
    tagline: "Excellence in Education",
    logoUrl: ""
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Load homepage data from Supabase
  useEffect(() => {
    getSupabaseData('royal-academy-homepage', {
      heroTitle: "Royal Academy",
      heroSubtitle: "Shaping tomorrow's leaders through excellence in education, character development, and innovative learning experiences.",
      heroButtonPrimary: "Apply for Admission",
      heroButtonSecondary: "Discover Our Legacy",
      bannerImages: [],
      autoRotate: true,
      rotationInterval: 5,
      stats: {
        students: { number: "2,500+", label: "Students" },
        programs: { number: "150+", label: "Programs" },
        awards: { number: "25+", label: "Awards" }
      },
      colors: {
        primary: "#1e40af",
        secondary: "#f59e0b",
        accent: "#10b981",
        background: "#ffffff",
        text: "#1f2937"
      },
      fonts: {
        heading: "Inter",
        body: "Inter"
      }
    }).then(data => {
      setHomepageData({
        heroTitle: data.heroTitle || "Royal Academy",
        heroSubtitle: data.heroSubtitle || "Shaping tomorrow's leaders through excellence in education, character development, and innovative learning experiences.",
        heroButtonPrimary: data.heroButtonPrimary || "Apply for Admission",
        heroButtonSecondary: data.heroButtonSecondary || "Discover Our Legacy",
        bannerImages: Array.isArray(data.bannerImages) ? data.bannerImages : [],
        autoRotate: data.autoRotate !== undefined ? data.autoRotate : true,
        rotationInterval: data.rotationInterval || 5,
        stats: {
          students: { 
            number: data.stats?.students?.number || "2,500+", 
            label: data.stats?.students?.label || "Students" 
          },
          programs: { 
            number: data.stats?.programs?.number || "150+", 
            label: data.stats?.programs?.label || "Programs" 
          },
          awards: { 
            number: data.stats?.awards?.number || "25+", 
            label: data.stats?.awards?.label || "Awards" 
          }
        },
        colors: {
          primary: data.colors?.primary || "#1e40af",
          secondary: data.colors?.secondary || "#f59e0b",
          accent: data.colors?.accent || "#10b981",
          background: data.colors?.background || "#ffffff",
          text: data.colors?.text || "#1f2937"
        },
        fonts: {
          heading: data.fonts?.heading || "Inter",
          body: data.fonts?.body || "Inter"
        }
      });
    });
  }, []);

  // Load branding data from Supabase
  useEffect(() => {
    getSupabaseData('royal-academy-branding', {
      schoolName: "Royal Academy",
      tagline: "Excellence in Education",
      logoUrl: ""
    }).then(data => {
      setBrandingData({
        schoolName: data.schoolName || "Royal Academy",
        tagline: data.tagline || "Excellence in Education",
        logoUrl: data.logoUrl || ""
      });
    });
  }, []);


  // Auto-rotate banner images
  useEffect(() => {
    if (homepageData.autoRotate && homepageData.bannerImages && homepageData.bannerImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => 
          (prev + 1) % homepageData.bannerImages.length
        );
      }, homepageData.rotationInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [homepageData.autoRotate, homepageData.rotationInterval, homepageData.bannerImages]);

  const stats = [
    { icon: Users, value: homepageData.stats.students.number, label: homepageData.stats.students.label },
    { icon: BookOpen, value: homepageData.stats.programs.number, label: homepageData.stats.programs.label },
    { icon: Award, value: homepageData.stats.awards.number, label: homepageData.stats.awards.label },
  ];

  const currentBannerImage = homepageData.bannerImages && homepageData.bannerImages.length > 0 
    ? homepageData.bannerImages[currentImageIndex] 
    : brandingData.logoUrl || '/placeholder.svg';

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with banner image rotation */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${currentBannerImage})`,
          }}
        ></div>
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Floating Elements - Hidden on mobile */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gold/20 animate-float hidden sm:block"></div>
      <div className="absolute top-40 right-20 w-16 h-16 rounded-full bg-crimson/20 animate-float hidden sm:block" style={{ animationDelay: "2s" }}></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 rounded-full bg-gold/30 animate-float hidden sm:block" style={{ animationDelay: "4s" }}></div>

      {/* Content */}
      <div className="relative z-10 container-wide px-4 sm:px-6 py-8 sm:py-16 text-center">
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
          {/* Main Heading */}
          <div className="space-y-4 sm:space-y-6">
            <h1 
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight sm:leading-normal text-white"
              style={{ fontFamily: homepageData.fonts.heading }}
            >
              {homepageData.heroTitle}
            </h1>
            <p 
              className="text-sm xs:text-base sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed px-2 sm:px-0 text-white"
              style={{ fontFamily: homepageData.fonts.body }}
            >
              {homepageData.heroSubtitle}
            </p>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center pt-4 sm:pt-8 px-2 sm:px-0">
            <Button variant="hero" size="lg" asChild className="w-full sm:w-auto">
              <Link to="/admissions" className="group">
                {homepageData.heroButtonPrimary}
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
              <Link to="/about">
                {homepageData.heroButtonSecondary}
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 pt-6 sm:pt-16 px-2 sm:px-0">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="card-3d p-4 text-center group"
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-gold/20 to-gold/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-gold" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-gradient-gold">
                      {stat.value}
                    </div>
                    <p className="text-muted-foreground text-sm sm:text-base">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gold/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gold/80 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;