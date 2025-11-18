import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Cookie, X, Settings, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
}

const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    functional: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('royal-academy-cookie-consent');
    if (!cookieConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      functional: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    saveCookiePreferences(allAccepted);
    setShowBanner(false);
  };

  const handleAcceptSelected = () => {
    saveCookiePreferences(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      functional: false,
      marketing: false,
    };
    setPreferences(essentialOnly);
    saveCookiePreferences(essentialOnly);
    setShowBanner(false);
  };

  const saveCookiePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('royal-academy-cookie-consent', JSON.stringify({
      preferences: prefs,
      timestamp: new Date().toISOString(),
    }));
    
    // Here you would typically integrate with your analytics/tracking services
    console.log('Cookie preferences saved:', prefs);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Essential cookies cannot be disabled
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const cookieTypes = [
    {
      key: 'essential' as keyof CookiePreferences,
      title: 'Essential Cookies',
      description: 'Required for basic website functionality and security.',
      required: true,
    },
    {
      key: 'analytics' as keyof CookiePreferences,
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors use our website.',
      required: false,
    },
    {
      key: 'functional' as keyof CookiePreferences,
      title: 'Functional Cookies',
      description: 'Enable enhanced features and personalization.',
      required: false,
    },
    {
      key: 'marketing' as keyof CookiePreferences,
      title: 'Marketing Cookies',
      description: 'Used to deliver relevant advertisements.',
      required: false,
    },
  ];

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4"
        >
          <div className="container-wide">
            <div className="bg-card/95 backdrop-blur-md border border-border rounded-lg shadow-2xl overflow-hidden">
              {!showSettings ? (
                // Main Banner
                <div className="p-3 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-royal to-gold flex items-center justify-center">
                          <Cookie className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-heading font-bold text-foreground mb-2">
                          We Value Your Privacy
                        </h3>
                        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                          Royal Academy uses cookies to enhance your browsing experience, provide personalized content, 
                          and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                        </p>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                          <span>Learn more:</span>
                          <Link to="/privacy" className="text-gold hover:text-gold/80 transition-colors underline">
                            Privacy Policy
                          </Link>
                          <span className="hidden sm:inline">•</span>
                          <Link to="/cookies" className="text-gold hover:text-gold/80 transition-colors underline">
                            Cookie Policy
                          </Link>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowBanner(false)}
                      className="flex-shrink-0 self-start sm:self-auto h-8 w-8 p-0 sm:h-auto sm:w-auto sm:p-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSettings(true)}
                      className="w-full sm:w-auto h-10 sm:h-auto text-xs sm:text-sm"
                    >
                      <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Cookie Settings
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRejectAll}
                      className="w-full sm:w-auto h-10 sm:h-auto text-xs sm:text-sm"
                    >
                      Reject All
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAcceptAll}
                      className="w-full sm:w-auto h-10 sm:h-auto text-xs sm:text-sm bg-gradient-to-r from-royal to-gold hover:from-royal/80 hover:to-gold/80 text-white font-medium"
                    >
                      Accept All
                    </Button>
                  </div>
                </div>
              ) : (
                // Settings Panel
                <div className="p-3 sm:p-6 max-h-[80vh] sm:max-h-96 overflow-y-auto">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-heading font-bold text-foreground">
                      Cookie Preferences
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSettings(false)}
                      className="h-8 w-8 p-0 sm:h-auto sm:w-auto sm:p-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    {cookieTypes.map((type) => (
                      <div
                        key={type.key}
                        className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-4 sm:p-5 rounded-xl border border-border/50 bg-gradient-to-r from-muted/5 to-muted/10 hover:from-muted/10 hover:to-muted/15 transition-all duration-200 space-y-3 sm:space-y-0 shadow-sm hover:shadow-md"
                      >
                        <div className="flex-1 sm:pr-4">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-2">
                            <h4 className="font-semibold text-foreground text-sm">
                              {type.title}
                            </h4>
                            {type.required && (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 dark:from-amber-900/30 dark:to-amber-800/30 dark:text-amber-300 self-start sm:self-auto shadow-sm border border-amber-200 dark:border-amber-700/50">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-muted-foreground text-xs leading-relaxed">
                            {type.description}
                          </p>
                        </div>
                        <div className="flex-shrink-0 flex justify-end sm:justify-start">
                          <button
                            onClick={() => togglePreference(type.key)}
                            disabled={type.required}
                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-background touch-manipulation ${
                              preferences[type.key]
                                ? 'bg-gradient-to-r from-royal to-gold shadow-lg scale-105'
                                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 shadow-inner'
                            } ${type.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
                          >
                            <span
                              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-all duration-300 ease-in-out shadow-lg border-2 ${
                                preferences[type.key] 
                                  ? 'translate-x-7 border-white/30 shadow-xl' 
                                  : 'translate-x-1 border-gray-200 dark:border-gray-400 hover:shadow-xl'
                              }`}
                            >
                              {/* Inner dot for active state */}
                              {preferences[type.key] && (
                                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-royal/30 to-gold/30" />
                              )}
                            </span>
                            {/* Glow effect for active state */}
                            {preferences[type.key] && (
                              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-royal/10 to-gold/10 blur-sm animate-pulse" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-3 sm:pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSettings(false)}
                      className="w-full sm:w-auto h-10 sm:h-auto text-xs sm:text-sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAcceptSelected}
                      className="w-full sm:w-auto h-10 sm:h-auto text-xs sm:text-sm bg-gradient-to-r from-royal to-gold hover:from-royal/80 hover:to-gold/80 text-white font-medium"
                    >
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsentBanner;
