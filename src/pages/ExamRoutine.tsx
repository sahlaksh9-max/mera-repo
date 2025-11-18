import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  ArrowLeft,
  Filter,
  GraduationCap,
  Info,
  AlertCircle,
  ArrowUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { loadExamRoutines, ExamRoutine } from "@/lib/examRoutinesHelper";
import { subscribeToSupabaseChanges } from "@/lib/supabaseHelpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const ExamRoutinePage = () => {
  const navigate = useNavigate();
  const [routines, setRoutines] = useState<ExamRoutine[]>([]);
  const [filteredRoutines, setFilteredRoutines] = useState<ExamRoutine[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      // Show scroll button when user has scrolled 400px OR is near the bottom of the page
      const scrolled = window.scrollY;
      const threshold = 400;
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000;
      
      setShowScrollTop(scrolled > threshold || nearBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchRoutines = async () => {
      const loadedRoutines = await loadExamRoutines();
      setRoutines(loadedRoutines);
      setFilteredRoutines(loadedRoutines);
    };

    fetchRoutines();

    // Subscribe to realtime changes
    const unsubscribe = subscribeToSupabaseChanges<ExamRoutine[]>(
      'royal-academy-exam-routines',
      (newData) => {
        console.log('[ExamRoutine] Received realtime update');
        setRoutines(newData);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    let filtered = routines;

    if (selectedClass !== "all") {
      filtered = filtered.filter(routine => 
        routine.class === selectedClass || routine.class === "All"
      );
    }

    setFilteredRoutines(filtered.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ));
  }, [selectedClass, routines]);

  const resetFilters = () => {
    setSelectedClass("all");
  };

  const groupByMonth = (routines: ExamRoutine[]) => {
    const grouped: Record<string, ExamRoutine[]> = {};
    
    routines.forEach(routine => {
      const date = new Date(routine.date);
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(routine);
    });
    
    return grouped;
  };

  const groupedRoutines = groupByMonth(filteredRoutines);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-background to-accent/10"></div>
        <div className="container-wide relative z-10 px-4 sm:px-6">
          <div className="mb-6 sm:mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="glass-button flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          </div>
          
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center mb-4">
              <Calendar className="h-12 w-12 sm:h-16 sm:w-16 text-accent" />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-bold mb-4 sm:mb-6">
              <span className="text-gradient-gold">Exam Routine</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
              View the examination schedule for all classes. Filter by class and section to see your personalized exam timetable.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-6 border-b border-border bg-muted/20">
        <div className="container-wide px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Filter Exams</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="glass-button w-full sm:w-[180px]">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {Array.from({length: 12}, (_, i) => i + 1).map(num => (
                    <SelectItem key={num} value={String(num)}>Class {num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedClass !== "all" && (
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="glass-button w-full sm:w-auto"
                >
                  Reset Filters
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Exam Routine Content */}
      <section className="section-padding">
        <div className="container-wide px-4 sm:px-6">
          {filteredRoutines.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="h-20 w-20 mx-auto mb-6 text-muted-foreground opacity-30" />
              <h3 className="text-2xl font-heading font-semibold mb-3 text-muted-foreground">
                No Exams Scheduled
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {selectedClass !== "all"
                  ? "No exams found for the selected class. Try adjusting your selection."
                  : "There are no exam routines available at the moment. Please check back later."}
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.keys(groupedRoutines).map(monthYear => (
                <div key={monthYear}>
                  <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-6 flex items-center space-x-3">
                    <GraduationCap className="h-7 w-7 text-accent" />
                    <span>{monthYear}</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedRoutines[monthYear].map((routine) => (
                      <Card 
                        key={routine.id}
                        className={`glass-card ${routine.is_holiday ? 'border-accent/30 bg-accent/5' : ''}`}
                      >
                        <CardHeader>
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant={routine.is_holiday ? "secondary" : "default"} className="glass-badge">
                              {routine.is_holiday ? "Holiday" : "Exam"}
                            </Badge>
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <CardTitle className="text-lg sm:text-xl">
                            {routine.exam_name}
                          </CardTitle>
                          <CardDescription className="flex flex-col space-y-1 mt-2">
                            <span className="text-base font-medium">
                              {new Date(routine.date).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                month: 'long', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </span>
                            <span className="text-sm">
                              Class: {routine.class}
                            </span>
                          </CardDescription>
                        </CardHeader>
                        {routine.notes && (
                          <CardContent>
                            <div className="flex items-start space-x-2 p-3 rounded-lg bg-muted/30">
                              <Info className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-muted-foreground">
                                {routine.notes}
                              </p>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Banner */}
      <section className="py-8 bg-accent/5 border-y border-accent/20">
        <div className="container-wide px-4 sm:px-6">
          <div className="flex items-start space-x-3 p-4 rounded-lg bg-background/50">
            <AlertCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-semibold">Important Information</p>
              <p className="text-sm text-muted-foreground">
                Students are advised to arrive 15 minutes before the exam start time. Bring your ID card and necessary stationery. 
                Check with your class teacher for any last-minute updates or changes to the schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-gold hover:bg-gold/90 text-black shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-6 w-6" />
        </motion.button>
      )}

      <Footer />
    </div>
  );
};

export default ExamRoutinePage;
