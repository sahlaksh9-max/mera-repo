import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getSupabaseData, setSupabaseData } from "@/lib/supabaseHelpers";
import { motion } from "framer-motion";

const BrandingManager = () => {
  const [brandingData, setBrandingData] = useState({
    schoolName: "Royal Academy",
    tagline: "Preparing minds for the future",
    logoUrl: "/placeholder.svg"
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load current branding data
  useEffect(() => {
    const loadBrandingData = async () => {
      try {
        const data = await getSupabaseData('royal-academy-branding', {
          schoolName: "Royal Academy",
          tagline: "Preparing minds for the future",
          logoUrl: "/placeholder.svg"
        });
        
        setBrandingData({
          schoolName: data.schoolName || "Royal Academy",
          tagline: data.tagline || "Preparing minds for the future",
          logoUrl: data.logoUrl || "/placeholder.svg"
        });
      } catch (error) {
        console.error("Error loading branding data:", error);
      }
    };
    
    loadBrandingData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBrandingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBrandingData(prev => ({
            ...prev,
            logoUrl: event.target.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    
    try {
      await setSupabaseData('royal-academy-branding', brandingData);
      setSuccess(true);
      
      // Update all components that use branding data
      window.dispatchEvent(new CustomEvent('branding-updated'));
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving branding data:", error);
      alert("Failed to save branding data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">School Branding</h2>
        <p className="text-muted-foreground">
          Customize your school's name, tagline, and logo across the entire website.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Branding Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="schoolName" className="text-foreground">
                School Name
              </Label>
              <Input
                id="schoolName"
                name="schoolName"
                value={brandingData.schoolName}
                onChange={handleInputChange}
                placeholder="Enter your school name"
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline" className="text-foreground">
                Tagline
              </Label>
              <Textarea
                id="tagline"
                name="tagline"
                value={brandingData.tagline}
                onChange={handleInputChange}
                placeholder="Enter your school tagline"
                rows={3}
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">
                Choose Logo from Your Device
              </Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Button 
                  type="button" 
                  onClick={triggerFileInput}
                  className="bg-gradient-to-r from-gold to-yellow-500 text-black font-bold hover:from-gold/90 hover:to-yellow-500/90 w-full sm:w-auto"
                >
                  Choose Logo from Device
                </Button>
                <span className="text-sm text-muted-foreground">
                  {brandingData.logoUrl && brandingData.logoUrl !== "/placeholder.svg" 
                    ? "Logo selected ✓" 
                    : "No logo chosen"}
                </span>
              </div>
              {brandingData.logoUrl && brandingData.logoUrl !== "/placeholder.svg" && (
                <div className="mt-3 p-3 bg-muted/20 rounded-lg border border-border/30">
                  <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                  <img 
                    src={brandingData.logoUrl} 
                    alt="Logo preview" 
                    className="w-16 h-16 object-contain rounded border border-border"
                  />
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Upload your logo image (PNG, JPG, SVG). For best results, use a square image with transparent background.
              </p>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-gold to-yellow-500 text-black font-bold hover:from-gold/90 hover:to-yellow-500/90"
              >
                {loading ? "Saving..." : "Save Branding"}
              </Button>
              
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-600 text-center"
                >
                  Branding updated successfully!
                </motion.div>
              )}
            </div>
          </form>
        </motion.div>

        {/* Preview Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-6"
        >
          <div className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50">
            <h3 className="text-lg font-heading font-bold text-foreground mb-4">Preview</h3>
            
            <div className="space-y-6">
              {/* Navigation Preview */}
              <div className="bg-muted/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center">
                      <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-heading font-bold text-gradient-gold">
                        {brandingData.schoolName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {brandingData.tagline}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loading Screen Preview */}
              <div className="bg-muted/20 rounded-lg p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gold to-yellow-500 opacity-20"></div>
                  <div className="absolute inset-1 rounded-full bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center">
                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-heading font-bold text-gradient-gold mb-1">
                  {brandingData.schoolName}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {brandingData.tagline}
                </p>
                <div className="h-1 bg-gradient-to-r from-gold to-yellow-500 mt-4 rounded-full w-3/4 mx-auto"></div>
              </div>

              {/* Footer Preview */}
              <div className="bg-muted/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-heading font-bold text-gradient-gold text-sm">
                      {brandingData.schoolName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {brandingData.tagline}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Nurturing minds, shaping futures. For over 148 years, {brandingData.schoolName} has been 
                  committed to providing world-class education.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BrandingManager;