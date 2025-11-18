import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  ArrowLeft, Crown, Trophy, Medal, Award, Star, GraduationCap, 
  BookOpen, Target, Calendar, MapPin, Phone, Mail, Download,
  ExternalLink, Users, Zap, Heart, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const StudentProfile = () => {
  const { studentId } = useParams();
  const [allStudents, setAllStudents] = useState<any[]>([]);

  // Load students from localStorage
  useEffect(() => {
    const savedStudents = localStorage.getItem('royal-academy-top-scorers');
    if (savedStudents) {
      setAllStudents(JSON.parse(savedStudents));
    }
  }, []);

  // Student data - in a real app, this would come from an API
  const students = {
    "emma-richardson": {
      id: 1,
      name: "Emma Richardson",
      grade: "Grade 12",
      subject: "overall",
      score: "98.5%",
      year: "2024",
      rank: 1,
      achievements: ["Valedictorian", "Science Olympiad Gold", "Math Competition Winner"],
      image: "https://images.unsplash.com/photo-1494790108755-2616c669-b163?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      images: ["https://images.unsplash.com/photo-1494790108755-2616c669-b163?w=400&h=400&fit=crop&crop=face&auto=format&q=80"],
      description: "Outstanding performance across all subjects with exceptional leadership qualities.",
      fullBio: "Emma Richardson has consistently demonstrated exceptional academic prowess throughout her time at Royal Academy. As our current valedictorian, she has maintained the highest GPA in school history while actively participating in numerous extracurricular activities. Her leadership in student government and dedication to community service make her a role model for future students.",
      subjects: [
        { name: "Mathematics", grade: "A+", score: "99%" },
        { name: "Physics", grade: "A+", score: "98%" },
        { name: "Chemistry", grade: "A+", score: "97%" },
        { name: "English Literature", grade: "A+", score: "99%" },
        { name: "History", grade: "A", score: "96%" },
        { name: "Biology", grade: "A+", score: "98%" }
      ],
      extracurricular: [
        "Student Council President",
        "Science Olympiad Team Captain",
        "Math Club President",
        "Debate Team Member",
        "Volunteer Tutor Program"
      ],
      awards: [
        { year: "2024", award: "Valedictorian", description: "Highest academic achievement" },
        { year: "2024", award: "Science Olympiad Gold Medal", description: "National competition winner" },
        { year: "2023", award: "Math Competition State Champion", description: "First place in state mathematics competition" },
        { year: "2023", award: "Leadership Excellence Award", description: "Outstanding student leadership" }
      ],
      futureGoals: "Emma plans to pursue a degree in Biomedical Engineering at Harvard University, with aspirations to contribute to medical research and innovation.",
      universityAcceptances: [
        "Harvard University - Full Scholarship",
        "MIT - Merit Scholarship",
        "Stanford University - Academic Excellence Scholarship",
        "Yale University - Presidential Scholarship"
      ],
      testimonial: "Emma is not just academically brilliant but also possesses the rare combination of intellectual curiosity and genuine care for others. She has been an inspiration to both her peers and teachers.",
      testimonialBy: "Dr. Sarah Johnson, Principal"
    },
    "james-chen": {
      id: 2,
      name: "James Chen",
      grade: "Grade 11",
      subject: "mathematics",
      score: "99.2%",
      year: "2024",
      rank: 1,
      achievements: ["International Math Olympiad", "Regional Champion", "Perfect SAT Math"],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80"],
      description: "Mathematical genius with exceptional problem-solving abilities.",
      fullBio: "James Chen is a mathematical prodigy who has redefined excellence in STEM subjects at Royal Academy. His innovative approach to problem-solving and deep understanding of mathematical concepts have earned him recognition at national and international levels.",
      subjects: [
        { name: "Advanced Calculus", grade: "A+", score: "100%" },
        { name: "Linear Algebra", grade: "A+", score: "99%" },
        { name: "Physics", grade: "A+", score: "98%" },
        { name: "Computer Science", grade: "A+", score: "97%" },
        { name: "Statistics", grade: "A+", score: "99%" },
        { name: "Chemistry", grade: "A", score: "95%" }
      ],
      extracurricular: [
        "Math Olympiad Team Captain",
        "Robotics Club President",
        "Peer Tutoring Coordinator",
        "Chess Club Champion",
        "Programming Competition Team"
      ],
      awards: [
        { year: "2024", award: "International Math Olympiad Gold", description: "Top 10 worldwide" },
        { year: "2024", award: "Perfect SAT Math Score", description: "800/800 achievement" },
        { year: "2023", award: "Regional Math Champion", description: "First place in regional competition" },
        { year: "2023", award: "STEM Excellence Award", description: "Outstanding achievement in STEM fields" }
      ],
      futureGoals: "James aims to pursue Pure Mathematics at MIT, with interests in theoretical research and mathematical modeling for real-world applications.",
      universityAcceptances: [
        "MIT - Early Admission",
        "Caltech - Merit Scholarship",
        "Princeton University - Academic Scholarship",
        "University of Chicago - Full Scholarship"
      ],
      testimonial: "James approaches mathematics with the curiosity of a researcher and the precision of a master craftsman. His ability to see patterns and connections is truly remarkable.",
      testimonialBy: "Prof. Michael Rodriguez, Mathematics Department Head"
    },
    "sophia-martinez": {
      id: 3,
      name: "Sophia Martinez",
      grade: "Grade 10",
      subject: "science",
      score: "97.8%",
      year: "2024",
      rank: 1,
      achievements: ["Science Fair Winner", "Research Publication", "Lab Excellence Award"],
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      images: ["https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face&auto=format&q=80"],
      description: "Brilliant scientist with innovative research in environmental studies.",
      fullBio: "Sophia Martinez combines scientific rigor with environmental passion, conducting groundbreaking research in sustainable technologies. Her work on renewable energy solutions has been recognized by leading scientific institutions.",
      subjects: [
        { name: "Advanced Biology", grade: "A+", score: "99%" },
        { name: "Chemistry", grade: "A+", score: "98%" },
        { name: "Environmental Science", grade: "A+", score: "100%" },
        { name: "Physics", grade: "A+", score: "96%" },
        { name: "Mathematics", grade: "A", score: "94%" },
        { name: "Research Methods", grade: "A+", score: "99%" }
      ],
      extracurricular: [
        "Environmental Club President",
        "Science Fair Coordinator",
        "Research Assistant",
        "Green Initiative Leader",
        "STEM Outreach Volunteer"
      ],
      awards: [
        { year: "2024", award: "National Science Fair Winner", description: "First place in environmental science category" },
        { year: "2024", award: "Research Publication", description: "Published in Journal of Environmental Studies" },
        { year: "2023", award: "Lab Excellence Award", description: "Outstanding laboratory research skills" },
        { year: "2023", award: "Young Scientist Award", description: "Recognition for innovative research" }
      ],
      futureGoals: "Sophia plans to study Environmental Engineering with a focus on developing sustainable solutions for climate change challenges.",
      universityAcceptances: [
        "Stanford University - Environmental Science Program",
        "UC Berkeley - Regents Scholarship",
        "Cornell University - Research Fellowship",
        "Northwestern University - Merit Scholarship"
      ],
      testimonial: "Sophia's passion for environmental science is matched only by her dedication to making a real difference in the world. Her research shows maturity beyond her years.",
      testimonialBy: "Dr. Lisa Chen, Science Department Head"
    },
    "alexander-thompson": {
      id: 4,
      name: "Alexander Thompson",
      grade: "Grade 12",
      subject: "english",
      score: "96.7%",
      year: "2024",
      rank: 1,
      achievements: ["Literary Magazine Editor", "Debate Champion", "Writing Contest Winner"],
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      images: ["https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format&q=80"],
      description: "Exceptional writer and orator with outstanding communication skills.",
      fullBio: "Alexander Thompson has demonstrated exceptional literary talent and communication skills throughout his academic career. His creative writing and analytical essays have earned recognition at state and national levels.",
      subjects: [
        { name: "English Literature", grade: "A+", score: "98%" },
        { name: "Creative Writing", grade: "A+", score: "99%" },
        { name: "History", grade: "A+", score: "96%" },
        { name: "Philosophy", grade: "A", score: "95%" },
        { name: "Public Speaking", grade: "A+", score: "97%" }
      ],
      extracurricular: [
        "Literary Magazine Editor-in-Chief",
        "Debate Team Captain",
        "Drama Club President",
        "Writing Workshop Leader"
      ],
      awards: [
        { year: "2024", award: "State Writing Competition Winner", description: "First place in creative writing" },
        { year: "2024", award: "Debate Championship", description: "Regional debate tournament winner" },
        { year: "2023", award: "Literary Excellence Award", description: "Outstanding contribution to school publications" }
      ],
      futureGoals: "Alexander plans to pursue journalism and creative writing at Columbia University.",
      universityAcceptances: [
        "Columbia University - Journalism Program",
        "Northwestern University - Medill School",
        "Yale University - English Department",
        "Princeton University - Creative Writing"
      ],
      testimonial: "Alexander's command of language and ability to articulate complex ideas makes him a natural leader and communicator.",
      testimonialBy: "Prof. Margaret Wilson, English Department"
    },
    "priya-patel": {
      id: 5,
      name: "Priya Patel",
      grade: "Grade 11",
      subject: "science",
      score: "97.1%",
      year: "2024",
      rank: 2,
      achievements: ["Chemistry Excellence", "Lab Research Assistant", "STEM Leadership"],
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      images: ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face&auto=format&q=80"],
      description: "Chemistry enthusiast with groundbreaking laboratory research.",
      fullBio: "Priya Patel has shown exceptional aptitude in chemistry and laboratory research. Her innovative experiments and analytical skills have contributed to published research papers.",
      subjects: [
        { name: "Advanced Chemistry", grade: "A+", score: "98%" },
        { name: "Organic Chemistry", grade: "A+", score: "97%" },
        { name: "Physics", grade: "A+", score: "96%" },
        { name: "Mathematics", grade: "A", score: "95%" },
        { name: "Biology", grade: "A+", score: "97%" }
      ],
      extracurricular: [
        "Chemistry Club President",
        "Research Assistant",
        "Science Fair Coordinator",
        "STEM Mentorship Program"
      ],
      awards: [
        { year: "2024", award: "Chemistry Excellence Award", description: "Outstanding performance in chemistry" },
        { year: "2024", award: "Research Publication", description: "Co-authored research paper" },
        { year: "2023", award: "Science Fair Winner", description: "First place in regional science fair" }
      ],
      futureGoals: "Priya aims to pursue chemical engineering and pharmaceutical research.",
      universityAcceptances: [
        "MIT - Chemical Engineering",
        "Stanford University - Chemistry Program",
        "UC Berkeley - Research Scholarship",
        "Caltech - Science Fellowship"
      ],
      testimonial: "Priya's dedication to scientific research and her innovative approach to problem-solving make her an exceptional student.",
      testimonialBy: "Dr. Raj Sharma, Chemistry Department"
    },
    "michael-johnson": {
      id: 6,
      name: "Michael Johnson",
      grade: "Grade 10",
      subject: "mathematics",
      score: "96.9%",
      year: "2024",
      rank: 2,
      achievements: ["Calculus Prodigy", "Math Tutor", "Academic Excellence"],
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      images: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face&auto=format&q=80"],
      description: "Mathematical talent with exceptional analytical thinking.",
      fullBio: "Michael Johnson has demonstrated remarkable mathematical abilities from an early age. His understanding of complex mathematical concepts and problem-solving skills are exceptional for his grade level.",
      subjects: [
        { name: "Advanced Calculus", grade: "A+", score: "99%" },
        { name: "Algebra", grade: "A+", score: "98%" },
        { name: "Geometry", grade: "A+", score: "97%" },
        { name: "Statistics", grade: "A+", score: "96%" },
        { name: "Physics", grade: "A", score: "95%" }
      ],
      extracurricular: [
        "Math Club Vice President",
        "Peer Tutor Program",
        "Academic Competition Team",
        "STEM Outreach Volunteer"
      ],
      awards: [
        { year: "2024", award: "Math Excellence Award", description: "Outstanding mathematical achievement" },
        { year: "2024", award: "Tutor of the Year", description: "Exceptional peer tutoring" },
        { year: "2023", award: "Academic Competition Winner", description: "Regional math competition" }
      ],
      futureGoals: "Michael plans to pursue applied mathematics and engineering.",
      universityAcceptances: [
        "MIT - Mathematics Program",
        "Stanford University - Applied Math",
        "Caltech - Engineering",
        "UC Berkeley - Mathematics"
      ],
      testimonial: "Michael's mathematical intuition and ability to explain complex concepts to others is truly remarkable.",
      testimonialBy: "Dr. Robert Chen, Mathematics Department"
    },
    "isabella-rodriguez": {
      id: 7,
      name: "Isabella Rodriguez",
      grade: "Grade 12",
      subject: "overall",
      score: "97.9%",
      year: "2023",
      rank: 1,
      achievements: ["Class Valedictorian", "Student Council President", "Academic Excellence"],
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      images: ["https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face&auto=format&q=80"],
      description: "Exceptional all-around student with strong leadership skills.",
      fullBio: "Isabella Rodriguez exemplified academic excellence and leadership during her time at Royal Academy. As valedictorian and student council president, she balanced outstanding academic performance with meaningful community service.",
      subjects: [
        { name: "Advanced Mathematics", grade: "A+", score: "98%" },
        { name: "Physics", grade: "A+", score: "97%" },
        { name: "Chemistry", grade: "A+", score: "98%" },
        { name: "English Literature", grade: "A+", score: "99%" },
        { name: "History", grade: "A", score: "96%" },
        { name: "Spanish", grade: "A+", score: "99%" }
      ],
      extracurricular: [
        "Student Council President",
        "National Honor Society",
        "Volunteer Coordinator",
        "Academic Mentor Program"
      ],
      awards: [
        { year: "2023", award: "Valedictorian", description: "Highest academic achievement in class" },
        { year: "2023", award: "Leadership Excellence", description: "Outstanding student leadership" },
        { year: "2022", award: "Community Service Award", description: "Exceptional community involvement" }
      ],
      futureGoals: "Isabella is pursuing pre-med studies with a focus on community health.",
      universityAcceptances: [
        "Harvard University - Pre-Med Program",
        "Johns Hopkins - Biomedical Sciences",
        "Stanford University - Biology",
        "Yale University - Pre-Med Track"
      ],
      testimonial: "Isabella's combination of academic excellence and genuine care for others makes her an exceptional leader and role model.",
      testimonialBy: "Dr. Sarah Johnson, Principal"
    },
    "david-kim": {
      id: 8,
      name: "David Kim",
      grade: "Grade 11",
      subject: "science",
      score: "98.3%",
      year: "2023",
      rank: 1,
      achievements: ["Physics Olympiad Gold", "Research Intern", "Innovation Award"],
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      images: ["https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face&auto=format&q=80"],
      description: "Physics prodigy with innovative experimental approaches.",
      fullBio: "David Kim has shown exceptional talent in physics and experimental design. His innovative approaches to complex physics problems and his work as a research intern have earned him national recognition.",
      subjects: [
        { name: "Advanced Physics", grade: "A+", score: "99%" },
        { name: "Quantum Mechanics", grade: "A+", score: "98%" },
        { name: "Advanced Mathematics", grade: "A+", score: "97%" },
        { name: "Computer Science", grade: "A+", score: "96%" },
        { name: "Chemistry", grade: "A", score: "95%" }
      ],
      extracurricular: [
        "Physics Club President",
        "Research Intern",
        "Science Olympiad Team",
        "Innovation Lab Assistant"
      ],
      awards: [
        { year: "2023", award: "Physics Olympiad Gold Medal", description: "National physics competition winner" },
        { year: "2023", award: "Innovation Award", description: "Outstanding experimental design" },
        { year: "2022", award: "Research Excellence", description: "Exceptional research contribution" }
      ],
      futureGoals: "David plans to pursue theoretical physics and quantum computing research.",
      universityAcceptances: [
        "MIT - Physics Program",
        "Caltech - Theoretical Physics",
        "Stanford University - Physics",
        "Princeton University - Quantum Studies"
      ],
      testimonial: "David's innovative thinking and deep understanding of physics concepts make him a natural researcher and scientist.",
      testimonialBy: "Dr. Michael Zhang, Physics Department"
    }
  };

  // First try to find student in localStorage data
  let student = allStudents.find(s => s.slug === studentId);
  
  // If not found in localStorage, try hardcoded data
  if (!student) {
    student = students[studentId as keyof typeof students];
  }

  // If student found in localStorage, create a compatible format
  if (student && !student.fullBio) {
    student = {
      ...student,
      fullBio: student.description || "Outstanding student with exceptional academic performance.",
      subjects: [
        { name: "Overall Performance", grade: "A+", score: student.score }
      ],
      extracurricular: student.achievements || [],
      awards: student.achievements ? student.achievements.map((achievement: string, index: number) => ({
        year: student.year,
        award: achievement,
        description: `Excellence in ${achievement}`
      })) : [],
      futureGoals: "Pursuing higher education with focus on academic excellence.",
      universityAcceptances: [
        "Top University - Merit Scholarship",
        "Prestigious College - Academic Excellence Award"
      ],
      testimonial: `${student.name} is an exceptional student who demonstrates outstanding academic performance and dedication.`,
      testimonialBy: "Faculty Member"
    };
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Student Not Found</h1>
          <Link to="/top-scorers">
            <Button>Back to Top Scorers</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-8 w-8 text-gold" />;
      case 2: return <Medal className="h-8 w-8 text-gray-400" />;
      case 3: return <Award className="h-8 w-8 text-amber-600" />;
      default: return <Star className="h-8 w-8 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal/20 via-background to-gold/20"></div>
        
        <div className="container-wide relative z-10">
          {/* Back Button and Breadcrumb */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <Link to="/top-scorers">
              <Button 
                variant="outline" 
                className="bg-gradient-to-r from-royal/10 to-gold/10 hover:from-royal/20 hover:to-gold/20 border-gold/30 text-gold hover:text-gold/80 transition-all duration-300 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Top Scorers
              </Button>
            </Link>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-gold transition-colors">Home</Link>
              <span>/</span>
              <Link to="/top-scorers" className="hover:text-gold transition-colors">Top Scorers</Link>
              <span>/</span>
              <span className="text-gold">{student.name}</span>
            </div>
          </div>

          {/* Student Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center"
          >
            {/* Student Photo */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-gold to-yellow-500 rounded-full blur opacity-30"></div>
                <img
                  src={student.image}
                  alt={student.name}
                  className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto rounded-full object-cover border-4 border-gold/30 shadow-2xl"
                />
                {/* Rank Badge */}
                <div className="absolute -top-4 -right-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-background to-card border-4 border-gold flex items-center justify-center shadow-lg"
                  >
                    {getRankIcon(student.rank)}
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Student Info */}
            <div className="lg:col-span-2 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2">
                      <span className="text-gradient-gold">{student.name}</span>
                    </h1>
                    <p className="text-xl text-muted-foreground mb-4">{student.grade} • Rank #{student.rank}</p>
                  </div>
                  <div className="text-center lg:text-right">
                    <div className="text-4xl font-bold text-gradient-gold mb-2">{student.score}</div>
                    <div className="text-sm text-muted-foreground">Overall Score</div>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {student.fullBio}
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="text-center p-4 bg-card/50 rounded-xl border border-border">
                    <div className="text-2xl font-bold text-gold mb-1">#{student.rank}</div>
                    <div className="text-xs text-muted-foreground">Class Rank</div>
                  </div>
                  <div className="text-center p-4 bg-card/50 rounded-xl border border-border">
                    <div className="text-2xl font-bold text-gold mb-1">{student.subjects.length}</div>
                    <div className="text-xs text-muted-foreground">Subjects</div>
                  </div>
                  <div className="text-center p-4 bg-card/50 rounded-xl border border-border">
                    <div className="text-2xl font-bold text-gold mb-1">{student.awards.length}</div>
                    <div className="text-xs text-muted-foreground">Awards</div>
                  </div>
                  <div className="text-center p-4 bg-card/50 rounded-xl border border-border">
                    <div className="text-2xl font-bold text-gold mb-1">{student.universityAcceptances.length}</div>
                    <div className="text-xs text-muted-foreground">Universities</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link to="/admissions">
                    <Button className="bg-gradient-to-r from-gold to-yellow-500 hover:from-gold/80 hover:to-yellow-500/80 text-black px-8 py-3">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Apply to Royal Academy
                    </Button>
                  </Link>
                  <Button variant="outline" className="border-gold/30 text-gold hover:text-gold/80 hover:bg-gold/10 px-8 py-3">
                    <Download className="h-4 w-4 mr-2" />
                    Download Profile
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Academic Performance */}
      <section className="section-padding bg-gradient-to-r from-royal/5 to-gold/5">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Academic Performance
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Detailed breakdown of {student.name}'s exceptional academic achievements across all subjects.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {student.subjects.map((subject, index) => (
              <motion.div
                key={subject.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card-3d p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-heading font-bold text-gradient-gold">
                    {subject.name}
                  </h3>
                  <span className="text-2xl font-bold text-gold">{subject.grade}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Score:</span>
                  <span className="text-lg font-semibold text-foreground">{subject.score}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Achievements */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Awards & Recognition
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive list of {student.name}'s outstanding achievements and recognitions.
            </p>
          </motion.div>

          <div className="space-y-6">
            {student.awards.map((award, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card-3d p-6 flex flex-col md:flex-row items-start md:items-center gap-6"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center flex-shrink-0">
                  <Trophy className="h-8 w-8 text-black" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <h3 className="text-xl font-heading font-bold text-gradient-gold">
                      {award.award}
                    </h3>
                    <span className="text-sm text-muted-foreground bg-muted/20 px-3 py-1 rounded-full">
                      {award.year}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {award.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Extracurricular Activities */}
      <section className="section-padding bg-gradient-to-r from-royal/5 to-gold/5">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Leadership & Activities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Beyond academics, {student.name} demonstrates exceptional leadership and community involvement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {student.extracurricular.map((activity, index) => (
              <motion.div
                key={activity}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card-3d p-6 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-royal to-gold flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-heading font-bold text-gradient-gold mb-2">
                  {activity}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* University Acceptances */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-gradient-gold">
              University Acceptances
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {student.name} has been accepted to these prestigious institutions with scholarships and honors.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {student.universityAcceptances.map((university, index) => (
              <motion.div
                key={university}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card-3d p-6 flex items-center space-x-4"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="h-6 w-6 text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-heading font-bold text-gradient-gold">
                    {university}
                  </h3>
                </div>
                <ChevronRight className="h-5 w-5 text-gold" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section-padding bg-gradient-to-r from-royal/10 to-gold/10">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="card-3d p-8 md:p-12">
              <div className="text-6xl text-gold mb-6">"</div>
              <blockquote className="text-xl md:text-2xl text-muted-foreground italic leading-relaxed mb-8">
                {student.testimonial}
              </blockquote>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center">
                  <Crown className="h-6 w-6 text-black" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-foreground">{student.testimonialBy}</div>
                  <div className="text-sm text-muted-foreground">Royal Academy</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Future Goals */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-gradient-gold">
              Future Aspirations
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="card-3d p-8">
                <Target className="h-16 w-16 text-gold mx-auto mb-6" />
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {student.futureGoals}
                </p>
              </div>
            </div>
            
            <div className="mt-12">
              <Link to="/admissions">
                <Button className="bg-gradient-to-r from-gold to-yellow-500 hover:from-gold/80 hover:to-yellow-500/80 text-black px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Heart className="h-5 w-5 mr-2" />
                  Join {student.name}'s Journey at Royal Academy
                  <ExternalLink className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StudentProfile;
