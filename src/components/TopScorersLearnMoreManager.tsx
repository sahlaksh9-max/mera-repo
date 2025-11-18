import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Save, 
  Plus, 
  Trash2, 
  Edit,
  Target,
  Zap,
  Users,
  BookOpen,
  Crown,
  Trophy,
  GraduationCap,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { getSupabaseData, setSupabaseData } from "@/lib/supabaseHelpers";

// Define types for our content
interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
}

interface StatItem {
  number: string;
  label: string;
  description: string;
}

interface FeatureItem {
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface AchievementItem {
  year: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface ProgramItem {
  name: string;
  description: string;
  features: string[];
  icon: string;
}

interface TestimonialItem {
  name: string;
  role: string;
  quote: string;
  image: string;
  achievement: string;
}

interface ContactItem {
  title: string;
  icon: string;
  details: { icon: string; text: string }[];
}

const TopScorersLearnMoreManager = () => {
  // State for all content sections
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: "Academic Excellence",
    subtitle: "Discover the comprehensive programs, achievements, and support systems that make our top scorers exceptional leaders of tomorrow.",
    description: "At Royal Academy, we believe every student has the potential for greatness. Our comprehensive approach to education combines rigorous academics, innovative teaching methods, and personalized support to help students achieve their highest potential."
  });

  const [stats, setStats] = useState<StatItem[]>([
    { number: "98.5%", label: "Average Score", description: "Highest in school history" },
    { number: "100%", label: "University Acceptance", description: "Top-tier institutions" },
    { number: "15", label: "International Qualifiers", description: "Olympic competitions" },
    { number: "12", label: "Research Publications", description: "Student-led studies" }
  ]);

  const [features, setFeatures] = useState<FeatureItem[]>([
    { title: "Personalized Learning", description: "Tailored educational paths that adapt to each student's unique strengths and learning style.", icon: "Target", color: "from-blue-500 to-cyan-500" },
    { title: "Expert Faculty", description: "World-class educators with advanced degrees and industry experience.", icon: "GraduationCap", color: "from-purple-500 to-pink-500" },
    { title: "Innovation Focus", description: "Cutting-edge technology and research opportunities in every discipline.", icon: "Zap", color: "from-green-500 to-emerald-500" }
  ]);

  const [achievements, setAchievements] = useState<AchievementItem[]>([
    { year: "2024", title: "Record Breaking Performance", description: "98.5% average score across all subjects - highest in school history", icon: "Crown", color: "from-gold to-yellow-500" },
    { year: "2024", title: "International Recognition", description: "15 students qualified for international olympiads", icon: "Trophy", color: "from-blue-500 to-cyan-500" },
    { year: "2023-2024", title: "University Admissions", description: "100% acceptance rate to top-tier universities", icon: "GraduationCap", color: "from-purple-500 to-pink-500" },
    { year: "2024", title: "Research Publications", description: "12 student research papers published in academic journals", icon: "BookOpen", color: "from-green-500 to-emerald-500" }
  ]);

  const [programs, setPrograms] = useState<ProgramItem[]>([
    { name: "Advanced Placement Program", description: "Rigorous college-level courses with university credit opportunities", features: ["25+ AP Courses", "Expert Faculty", "College Credit", "University Partnerships"], icon: "Target" },
    { name: "Research & Innovation Track", description: "Independent research projects with mentorship from industry experts", features: ["1-on-1 Mentoring", "Lab Access", "Publication Support", "Conference Presentations"], icon: "Zap" },
    { name: "Leadership Development", description: "Comprehensive leadership training and real-world application", features: ["Student Government", "Community Projects", "Internships", "Global Exchanges"], icon: "Users" },
    { name: "Academic Excellence Support", description: "Personalized support system for high-achieving students", features: ["Tutoring", "Study Groups", "Exam Prep", "Career Counseling"], icon: "Star" }
  ]);

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([
    { name: "Emma Richardson", role: "Valedictorian 2024", quote: "Royal Academy provided me with the perfect environment to excel. The teachers pushed me to reach my potential while supporting every step of my journey.", image: "https://images.unsplash.com/photo-1494790108755-2616c669-b163?w=400&h=400&fit=crop&crop=face&auto=format&q=80", achievement: "Harvard University - Full Scholarship" },
    { name: "James Chen", role: "Math Olympiad Gold Medalist", quote: "The advanced mathematics program here is exceptional. I was able to compete at international levels thanks to the rigorous training and support.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80", achievement: "MIT - Early Admission" },
    { name: "Dr. Sarah Williams", role: "Parent & Alumni", quote: "As both a parent and alumna, I've seen firsthand how Royal Academy transforms students into confident, capable leaders ready for any challenge.", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face&auto=format&q=80", achievement: "Parent of 2024 Top Scorer" }
  ]);

  const [contacts, setContacts] = useState<ContactItem[]>([
    { title: "Admissions Office", icon: "GraduationCap", details: [{ icon: "Phone", text: "+1 (555) 123-4567" }, { icon: "Mail", text: "admissions@royalacademy.edu" }, { icon: "Calendar", text: "Mon-Fri: 8:00 AM - 5:00 PM" }] },
    { title: "Academic Affairs", icon: "BookOpen", details: [{ icon: "Phone", text: "+1 (555) 123-4568" }, { icon: "Mail", text: "academics@royalacademy.edu" }, { icon: "Calendar", text: "Mon-Fri: 9:00 AM - 4:00 PM" }] },
    { title: "Campus Location", icon: "MapPin", details: [{ icon: "MapPin", text: "123 Excellence Boulevard" }, { icon: "MapPin", text: "Academic City, AC 12345" }, { icon: "ExternalLink", text: "View on Maps" }] }
  ]);

  const [activeTab, setActiveTab] = useState("hero");
  const [loading, setLoading] = useState(true);

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load all content sections from Supabase
        const heroData = await getSupabaseData<HeroContent>('top-scorers-learn-more-hero', heroContent);
        const statsData = await getSupabaseData<StatItem[]>('top-scorers-learn-more-stats', stats);
        const featuresData = await getSupabaseData<FeatureItem[]>('top-scorers-learn-more-features', features);
        const achievementsData = await getSupabaseData<AchievementItem[]>('top-scorers-learn-more-achievements', achievements);
        const programsData = await getSupabaseData<ProgramItem[]>('top-scorers-learn-more-programs', programs);
        const testimonialsData = await getSupabaseData<TestimonialItem[]>('top-scorers-learn-more-testimonials', testimonials);
        const contactsData = await getSupabaseData<ContactItem[]>('top-scorers-learn-more-contacts', contacts);

        // Update state with loaded data
        setHeroContent(heroData);
        setStats(statsData);
        setFeatures(featuresData);
        setAchievements(achievementsData);
        setPrograms(programsData);
        setTestimonials(testimonialsData);
        setContacts(contactsData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save data to Supabase
  const saveData = async () => {
    try {
      setLoading(true);
      await setSupabaseData('top-scorers-learn-more-hero', heroContent);
      await setSupabaseData('top-scorers-learn-more-stats', stats);
      await setSupabaseData('top-scorers-learn-more-features', features);
      await setSupabaseData('top-scorers-learn-more-achievements', achievements);
      await setSupabaseData('top-scorers-learn-more-programs', programs);
      await setSupabaseData('top-scorers-learn-more-testimonials', testimonials);
      await setSupabaseData('top-scorers-learn-more-contacts', contacts);
      alert("Content saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for managing arrays
  const addStat = () => {
    setStats([...stats, { number: "", label: "", description: "" }]);
  };

  const removeStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    setFeatures([...features, { title: "", description: "", icon: "Target", color: "from-blue-500 to-cyan-500" }]);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const addAchievement = () => {
    setAchievements([...achievements, { year: "", title: "", description: "", icon: "Crown", color: "from-gold to-yellow-500" }]);
  };

  const removeAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const addProgram = () => {
    setPrograms([...programs, { name: "", description: "", features: [""], icon: "Target" }]);
  };

  const removeProgram = (index: number) => {
    setPrograms(programs.filter((_, i) => i !== index));
  };

  const addProgramFeature = (programIndex: number) => {
    const updatedPrograms = [...programs];
    updatedPrograms[programIndex].features.push("");
    setPrograms(updatedPrograms);
  };

  const removeProgramFeature = (programIndex: number, featureIndex: number) => {
    const updatedPrograms = [...programs];
    updatedPrograms[programIndex].features = updatedPrograms[programIndex].features.filter((_, i) => i !== featureIndex);
    setPrograms(updatedPrograms);
  };

  const updateProgramFeature = (programIndex: number, featureIndex: number, value: string) => {
    const updatedPrograms = [...programs];
    updatedPrograms[programIndex].features[featureIndex] = value;
    setPrograms(updatedPrograms);
  };

  const addTestimonial = () => {
    setTestimonials([...testimonials, { name: "", role: "", quote: "", image: "", achievement: "" }]);
  };

  const removeTestimonial = (index: number) => {
    setTestimonials(testimonials.filter((_, i) => i !== index));
  };

  const addContact = () => {
    setContacts([...contacts, { title: "", icon: "GraduationCap", details: [{ icon: "Phone", text: "" }] }]);
  };

  const removeContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const addContactDetail = (contactIndex: number) => {
    const updatedContacts = [...contacts];
    updatedContacts[contactIndex].details.push({ icon: "Phone", text: "" });
    setContacts(updatedContacts);
  };

  const removeContactDetail = (contactIndex: number, detailIndex: number) => {
    const updatedContacts = [...contacts];
    updatedContacts[contactIndex].details = updatedContacts[contactIndex].details.filter((_, i) => i !== detailIndex);
    setContacts(updatedContacts);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Top Scorers Learn More Content</h2>
          <p className="text-muted-foreground">Manage the content for the Top Scorers Learn More page</p>
        </div>
        <Button onClick={saveData} className="bg-gradient-to-r from-gold to-yellow-500 text-black">
          <Save className="h-4 w-4 mr-2" />
          Save All Changes
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-border">
        {[
          { id: "hero", label: "Hero Section" },
          { id: "stats", label: "Stats" },
          { id: "features", label: "Features" },
          { id: "achievements", label: "Achievements" },
          { id: "programs", label: "Programs" },
          { id: "testimonials", label: "Testimonials" },
          { id: "contacts", label: "Contact Info" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-lg font-medium text-sm ${
              activeTab === tab.id
                ? "bg-gold text-black"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hero Section */}
      {activeTab === "hero" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="bg-card/50 p-6 rounded-xl border border-border">
            <h3 className="text-lg font-semibold mb-4">Hero Section Content</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={heroContent.title}
                  onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
                  placeholder="Academic Excellence"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subtitle</label>
                <Textarea
                  value={heroContent.subtitle}
                  onChange={(e) => setHeroContent({ ...heroContent, subtitle: e.target.value })}
                  placeholder="Discover the comprehensive programs..."
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={heroContent.description}
                  onChange={(e) => setHeroContent({ ...heroContent, description: e.target.value })}
                  placeholder="At Royal Academy, we believe every student has the potential..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Section */}
      {activeTab === "stats" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Statistics</h3>
            <Button onClick={addStat} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Stat
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-card/50 p-4 rounded-xl border border-border relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  onClick={() => removeStat(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Number</label>
                    <Input
                      value={stat.number}
                      onChange={(e) => {
                        const updatedStats = [...stats];
                        updatedStats[index].number = e.target.value;
                        setStats(updatedStats);
                      }}
                      placeholder="98.5%"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Label</label>
                    <Input
                      value={stat.label}
                      onChange={(e) => {
                        const updatedStats = [...stats];
                        updatedStats[index].label = e.target.value;
                        setStats(updatedStats);
                      }}
                      placeholder="Average Score"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Input
                      value={stat.description}
                      onChange={(e) => {
                        const updatedStats = [...stats];
                        updatedStats[index].description = e.target.value;
                        setStats(updatedStats);
                      }}
                      placeholder="Highest in school history"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Features Section */}
      {activeTab === "features" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Key Features</h3>
            <Button onClick={addFeature} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Feature
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="bg-card/50 p-4 rounded-xl border border-border relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  onClick={() => removeFeature(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <Input
                      value={feature.title}
                      onChange={(e) => {
                        const updatedFeatures = [...features];
                        updatedFeatures[index].title = e.target.value;
                        setFeatures(updatedFeatures);
                      }}
                      placeholder="Personalized Learning"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Textarea
                      value={feature.description}
                      onChange={(e) => {
                        const updatedFeatures = [...features];
                        updatedFeatures[index].description = e.target.value;
                        setFeatures(updatedFeatures);
                      }}
                      placeholder="Tailored educational paths..."
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Icon</label>
                    <select
                      value={feature.icon}
                      onChange={(e) => {
                        const updatedFeatures = [...features];
                        updatedFeatures[index].icon = e.target.value;
                        setFeatures(updatedFeatures);
                      }}
                      className="w-full p-2 border border-border rounded-lg bg-background"
                    >
                      <option value="Target">Target</option>
                      <option value="GraduationCap">GraduationCap</option>
                      <option value="Zap">Zap</option>
                      <option value="BookOpen">BookOpen</option>
                      <option value="Users">Users</option>
                      <option value="Star">Star</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Color Gradient</label>
                    <Input
                      value={feature.color}
                      onChange={(e) => {
                        const updatedFeatures = [...features];
                        updatedFeatures[index].color = e.target.value;
                        setFeatures(updatedFeatures);
                      }}
                      placeholder="from-blue-500 to-cyan-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Achievements Section */}
      {activeTab === "achievements" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Achievements</h3>
            <Button onClick={addAchievement} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Achievement
            </Button>
          </div>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-card/50 p-4 rounded-xl border border-border relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  onClick={() => removeAchievement(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Year</label>
                    <Input
                      value={achievement.year}
                      onChange={(e) => {
                        const updatedAchievements = [...achievements];
                        updatedAchievements[index].year = e.target.value;
                        setAchievements(updatedAchievements);
                      }}
                      placeholder="2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <Input
                      value={achievement.title}
                      onChange={(e) => {
                        const updatedAchievements = [...achievements];
                        updatedAchievements[index].title = e.target.value;
                        setAchievements(updatedAchievements);
                      }}
                      placeholder="Record Breaking Performance"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Textarea
                      value={achievement.description}
                      onChange={(e) => {
                        const updatedAchievements = [...achievements];
                        updatedAchievements[index].description = e.target.value;
                        setAchievements(updatedAchievements);
                      }}
                      placeholder="98.5% average score across all subjects..."
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Icon</label>
                    <select
                      value={achievement.icon}
                      onChange={(e) => {
                        const updatedAchievements = [...achievements];
                        updatedAchievements[index].icon = e.target.value;
                        setAchievements(updatedAchievements);
                      }}
                      className="w-full p-2 border border-border rounded-lg bg-background"
                    >
                      <option value="Crown">Crown</option>
                      <option value="Trophy">Trophy</option>
                      <option value="GraduationCap">GraduationCap</option>
                      <option value="BookOpen">BookOpen</option>
                      <option value="Target">Target</option>
                      <option value="Zap">Zap</option>
                      <option value="Users">Users</option>
                      <option value="Star">Star</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Color Gradient</label>
                    <Input
                      value={achievement.color}
                      onChange={(e) => {
                        const updatedAchievements = [...achievements];
                        updatedAchievements[index].color = e.target.value;
                        setAchievements(updatedAchievements);
                      }}
                      placeholder="from-gold to-yellow-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Programs Section */}
      {activeTab === "programs" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Academic Programs</h3>
            <Button onClick={addProgram} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Program
            </Button>
          </div>
          <div className="space-y-4">
            {programs.map((program, index) => (
              <div key={index} className="bg-card/50 p-4 rounded-xl border border-border relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  onClick={() => removeProgram(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Program Name</label>
                    <Input
                      value={program.name}
                      onChange={(e) => {
                        const updatedPrograms = [...programs];
                        updatedPrograms[index].name = e.target.value;
                        setPrograms(updatedPrograms);
                      }}
                      placeholder="Advanced Placement Program"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Textarea
                      value={program.description}
                      onChange={(e) => {
                        const updatedPrograms = [...programs];
                        updatedPrograms[index].description = e.target.value;
                        setPrograms(updatedPrograms);
                      }}
                      placeholder="Rigorous college-level courses..."
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Icon</label>
                    <select
                      value={program.icon}
                      onChange={(e) => {
                        const updatedPrograms = [...programs];
                        updatedPrograms[index].icon = e.target.value;
                        setPrograms(updatedPrograms);
                      }}
                      className="w-full p-2 border border-border rounded-lg bg-background"
                    >
                      <option value="Target">Target</option>
                      <option value="GraduationCap">GraduationCap</option>
                      <option value="Zap">Zap</option>
                      <option value="BookOpen">BookOpen</option>
                      <option value="Users">Users</option>
                      <option value="Star">Star</option>
                    </select>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium">Features</label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addProgramFeature(index)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Feature
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {program.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <Input
                            value={feature}
                            onChange={(e) => updateProgramFeature(index, featureIndex, e.target.value)}
                            placeholder="Feature description"
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removeProgramFeature(index, featureIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Testimonials Section */}
      {activeTab === "testimonials" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Success Stories</h3>
            <Button onClick={addTestimonial} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-card/50 p-4 rounded-xl border border-border relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  onClick={() => removeTestimonial(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <Input
                      value={testimonial.name}
                      onChange={(e) => {
                        const updatedTestimonials = [...testimonials];
                        updatedTestimonials[index].name = e.target.value;
                        setTestimonials(updatedTestimonials);
                      }}
                      placeholder="Emma Richardson"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <Input
                      value={testimonial.role}
                      onChange={(e) => {
                        const updatedTestimonials = [...testimonials];
                        updatedTestimonials[index].role = e.target.value;
                        setTestimonials(updatedTestimonials);
                      }}
                      placeholder="Valedictorian 2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Quote</label>
                    <Textarea
                      value={testimonial.quote}
                      onChange={(e) => {
                        const updatedTestimonials = [...testimonials];
                        updatedTestimonials[index].quote = e.target.value;
                        setTestimonials(updatedTestimonials);
                      }}
                      placeholder="Royal Academy provided me with the perfect environment..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Image URL</label>
                    <Input
                      value={testimonial.image}
                      onChange={(e) => {
                        const updatedTestimonials = [...testimonials];
                        updatedTestimonials[index].image = e.target.value;
                        setTestimonials(updatedTestimonials);
                      }}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Achievement</label>
                    <Input
                      value={testimonial.achievement}
                      onChange={(e) => {
                        const updatedTestimonials = [...testimonials];
                        updatedTestimonials[index].achievement = e.target.value;
                        setTestimonials(updatedTestimonials);
                      }}
                      placeholder="Harvard University - Full Scholarship"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Contact Info Section */}
      {activeTab === "contacts" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <Button onClick={addContact} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
          <div className="space-y-4">
            {contacts.map((contact, index) => (
              <div key={index} className="bg-card/50 p-4 rounded-xl border border-border relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  onClick={() => removeContact(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <Input
                      value={contact.title}
                      onChange={(e) => {
                        const updatedContacts = [...contacts];
                        updatedContacts[index].title = e.target.value;
                        setContacts(updatedContacts);
                      }}
                      placeholder="Admissions Office"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Icon</label>
                    <select
                      value={contact.icon}
                      onChange={(e) => {
                        const updatedContacts = [...contacts];
                        updatedContacts[index].icon = e.target.value;
                        setContacts(updatedContacts);
                      }}
                      className="w-full p-2 border border-border rounded-lg bg-background"
                    >
                      <option value="GraduationCap">GraduationCap</option>
                      <option value="BookOpen">BookOpen</option>
                      <option value="MapPin">MapPin</option>
                      <option value="Phone">Phone</option>
                      <option value="Mail">Mail</option>
                      <option value="Calendar">Calendar</option>
                      <option value="ExternalLink">ExternalLink</option>
                    </select>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium">Contact Details</label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addContactDetail(index)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Detail
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {contact.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center gap-2">
                          <select
                            value={detail.icon}
                            onChange={(e) => {
                              const updatedContacts = [...contacts];
                              updatedContacts[index].details[detailIndex].icon = e.target.value;
                              setContacts(updatedContacts);
                            }}
                            className="w-32 p-2 border border-border rounded-lg bg-background"
                          >
                            <option value="Phone">Phone</option>
                            <option value="Mail">Mail</option>
                            <option value="Calendar">Calendar</option>
                            <option value="MapPin">MapPin</option>
                            <option value="ExternalLink">ExternalLink</option>
                          </select>
                          <Input
                            value={detail.text}
                            onChange={(e) => {
                              const updatedContacts = [...contacts];
                              updatedContacts[index].details[detailIndex].text = e.target.value;
                              setContacts(updatedContacts);
                            }}
                            placeholder="Contact information"
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removeContactDetail(index, detailIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TopScorersLearnMoreManager;