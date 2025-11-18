import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, 
  Upload, 
  Eye, 
  EyeOff, 
  Palette, 
  Type, 
  Image as ImageIcon,
  RotateCcw,
  Plus,
  Trash2,
  Edit,
  Settings,
  RefreshCw,
  Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

interface HomepageData {
  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroButtonPrimary: string;
  heroButtonSecondary: string;
  bannerImages: string[];
  autoRotate: boolean;
  rotationInterval: number; // in seconds
  
  // Statistics
  stats: {
    students: { number: string; label: string };
    programs: { number: string; label: string };
    awards: { number: string; label: string };
  };
  
  // About Section
  aboutTitle: string;
  aboutSubtitle: string;
  legacyTitle: string;
  legacyContent: string;
  missionTitle: string;
  missionContent: string;
  
  // Values Section
  values: {
    excellence: { title: string; description: string };
    innovation: { title: string; description: string };
    vision: { title: string; description: string };
    community: { title: string; description: string };
  };
  
  // Styling
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

const HomepageEditor = () => {
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
    
    colors: {
      primary: "#1e40af", // royal blue
      secondary: "#f59e0b", // gold
      accent: "#10b981", // emerald
      background: "#ffffff",
      text: "#1f2937"
    },
    
    fonts: {
      heading: "Inter",
      body: "Inter"
    }
  });

  const [activeTab, setActiveTab] = useState<"content" | "design" | "images">("content");
  const [message, setMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('royal-academy-homepage');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setHomepageData({
        ...homepageData,
        ...parsedData,
        stats: {
          students: parsedData.stats?.students || homepageData.stats.students,
          programs: parsedData.stats?.programs || homepageData.stats.programs,
          awards: parsedData.stats?.awards || homepageData.stats.awards
        },
        values: {
          excellence: parsedData.values?.excellence || homepageData.values.excellence,
          innovation: parsedData.values?.innovation || homepageData.values.innovation,
          vision: parsedData.values?.vision || homepageData.values.vision,
          community: parsedData.values?.community || homepageData.values.community
        },
        colors: {
          primary: parsedData.colors?.primary || homepageData.colors.primary,
          secondary: parsedData.colors?.secondary || homepageData.colors.secondary,
          accent: parsedData.colors?.accent || homepageData.colors.accent,
          background: parsedData.colors?.background || homepageData.colors.background,
          text: parsedData.colors?.text || homepageData.colors.text
        },
        fonts: {
          heading: parsedData.fonts?.heading || homepageData.fonts.heading,
          body: parsedData.fonts?.body || homepageData.fonts.body
        }
      });
    }
  }, []);

  const saveData = () => {
    localStorage.setItem('royal-academy-homepage', JSON.stringify(homepageData));
    setMessage("Homepage updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target?.result as string;
          setHomepageData(prev => ({
            ...prev,
            bannerImages: [...prev.bannerImages, imageData]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeBannerImage = (index: number) => {
    setHomepageData(prev => ({
      ...prev,
      bannerImages: prev.bannerImages.filter((_, i) => i !== index)
    }));
  };

  const updateField = (path: string, value: any) => {
    setHomepageData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const fontOptions = [
    "Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins", 
    "Source Sans Pro", "Nunito", "Raleway", "Ubuntu"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">Homepage Editor</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Customize your homepage content, design, and banner images</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <Button
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
          >
            {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          <Button onClick={saveData} className="w-full sm:w-auto bg-gradient-to-r from-royal to-gold text-white">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 bg-muted p-1 rounded-lg">
        {[
          { id: "content", label: "Content", icon: Edit },
          { id: "design", label: "Design", icon: Palette },
          { id: "images", label: "Banner Images", icon: ImageIcon }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center justify-center sm:justify-start space-x-2 px-3 sm:px-4 py-2 rounded-md transition-all touch-manipulation ${
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="text-sm sm:text-base">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Tab */}
      {activeTab === "content" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Hero Section */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Hero Section</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Main Title</label>
                <Input
                  value={homepageData.heroTitle}
                  onChange={(e) => updateField('heroTitle', e.target.value)}
                  placeholder="Royal Academy"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Subtitle</label>
                <Textarea
                  value={homepageData.heroSubtitle}
                  onChange={(e) => updateField('heroSubtitle', e.target.value)}
                  placeholder="Shaping tomorrow's leaders..."
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Primary Button Text</label>
                <Input
                  value={homepageData.heroButtonPrimary}
                  onChange={(e) => updateField('heroButtonPrimary', e.target.value)}
                  placeholder="Apply for Admission"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Secondary Button Text</label>
                <Input
                  value={homepageData.heroButtonSecondary}
                  onChange={(e) => updateField('heroButtonSecondary', e.target.value)}
                  placeholder="Discover Our Legacy"
                />
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Statistics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {Object.entries(homepageData.stats).map(([key, stat]) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium block capitalize">{key}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={stat.number}
                      onChange={(e) => updateField(`stats.${key}.number`, e.target.value)}
                      placeholder="2,500+"
                    />
                    <Input
                      value={stat.label}
                      onChange={(e) => updateField(`stats.${key}.label`, e.target.value)}
                      placeholder="Students"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* About Section */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4">About Section</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">About Title</label>
                <Input
                  value={homepageData.aboutTitle}
                  onChange={(e) => updateField('aboutTitle', e.target.value)}
                  placeholder="About Royal Academy"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">About Subtitle</label>
                <Textarea
                  value={homepageData.aboutSubtitle}
                  onChange={(e) => updateField('aboutSubtitle', e.target.value)}
                  placeholder="Established in 1875..."
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Legacy Title</label>
                  <Input
                    value={homepageData.legacyTitle}
                    onChange={(e) => updateField('legacyTitle', e.target.value)}
                    placeholder="Our Legacy"
                  />
                  <Textarea
                    value={homepageData.legacyContent}
                    onChange={(e) => updateField('legacyContent', e.target.value)}
                    placeholder="Founded by visionary educators..."
                    rows={4}
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Mission Title</label>
                  <Input
                    value={homepageData.missionTitle}
                    onChange={(e) => updateField('missionTitle', e.target.value)}
                    placeholder="Our Mission"
                  />
                  <Textarea
                    value={homepageData.missionContent}
                    onChange={(e) => updateField('missionContent', e.target.value)}
                    placeholder="To provide exceptional education..."
                    rows={4}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Core Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(homepageData.values).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium block capitalize">{key}</label>
                  <Input
                    value={value.title}
                    onChange={(e) => updateField(`values.${key}.title`, e.target.value)}
                    placeholder="Excellence"
                  />
                  <Textarea
                    value={value.description}
                    onChange={(e) => updateField(`values.${key}.description`, e.target.value)}
                    placeholder="Description..."
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Design Tab */}
      {activeTab === "design" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Colors */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
              <Palette className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Color Scheme
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {Object.entries(homepageData.colors).map(([key, color]) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium block capitalize">{key}</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => updateField(`colors.${key}`, e.target.value)}
                      className="w-12 h-10 rounded border border-border cursor-pointer"
                    />
                    <Input
                      value={color}
                      onChange={(e) => updateField(`colors.${key}`, e.target.value)}
                      placeholder="#1e40af"
                      className="flex-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fonts */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
              <Type className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Typography
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Heading Font</label>
                <Select
                  value={homepageData.fonts.heading}
                  onValueChange={(value) => updateField('fonts.heading', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map(font => (
                      <SelectItem key={font} value={font}>{font}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Body Font</label>
                <Select
                  value={homepageData.fonts.body}
                  onValueChange={(value) => updateField('fonts.body', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map(font => (
                      <SelectItem key={font} value={font}>{font}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Images Tab */}
      {activeTab === "images" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Banner Settings */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
              <Settings className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Banner Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Auto-rotate Images</label>
                  <p className="text-xs text-muted-foreground">Automatically cycle through banner images</p>
                </div>
                <Switch
                  checked={homepageData.autoRotate}
                  onCheckedChange={(checked) => updateField('autoRotate', checked)}
                />
              </div>
              
              {homepageData.autoRotate && (
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Rotation Interval: {homepageData.rotationInterval} seconds
                  </label>
                  <Slider
                    value={[homepageData.rotationInterval]}
                    onValueChange={([value]) => updateField('rotationInterval', value)}
                    min={2}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
              <Upload className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Banner Images
            </h3>
            
            <div className="space-y-4">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="banner-upload"
                />
                <label htmlFor="banner-upload">
                  <Button variant="outline" asChild className="cursor-pointer">
                    <span>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Banner Images
                    </span>
                  </Button>
                </label>
              </div>

              {homepageData.bannerImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {homepageData.bannerImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Banner ${index + 1}`}
                        className="w-full h-24 sm:h-32 object-cover rounded-lg border border-border"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeBannerImage(index)}
                          className="h-8 w-8 p-0 sm:h-auto sm:w-auto sm:px-3"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline ml-2">Delete</span>
                        </Button>
                      </div>
                      <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-black/70 text-white text-xs px-1 sm:px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {homepageData.bannerImages.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No banner images uploaded yet.</p>
                  <p className="text-sm">Upload images to customize your homepage banner.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Preview Link */}
      {showPreview && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Live Preview</h3>
              <p className="text-sm text-muted-foreground">View how your homepage looks to visitors</p>
            </div>
            <Button variant="outline" asChild>
              <a href="/" target="_blank" rel="noopener noreferrer">
                <Eye className="h-4 w-4 mr-2" />
                Open Homepage
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomepageEditor;
