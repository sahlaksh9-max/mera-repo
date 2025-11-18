import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  ArrowLeft,
  Filter,
  ExternalLink,
  GraduationCap,
  User,
  Info,
  Plus,
  Minus,
  ArrowUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { loadYearlyBooks, YearlyBook } from "@/lib/booksHelper";
import { subscribeToSupabaseChanges } from "@/lib/supabaseHelpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const YearlyBookPage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<YearlyBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<YearlyBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [showDescriptions, setShowDescriptions] = useState<Record<string, boolean>>({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const loadedBooks = await loadYearlyBooks();
      setBooks(loadedBooks);
      setFilteredBooks(loadedBooks);
      
      const uniqueYears = Array.from(new Set(loadedBooks.map(book => book.year))).sort();
      setAvailableYears(uniqueYears);
      
      setLoading(false);
    };

    fetchBooks();

    // Subscribe to realtime changes
    const unsubscribe = subscribeToSupabaseChanges<YearlyBook[]>(
      'royal-academy-yearly-books',
      (newData) => {
        console.log('[YearlyBook] Received realtime update');
        setBooks(newData);
        const uniqueYears = Array.from(new Set(newData.map(book => book.year))).sort();
        setAvailableYears(uniqueYears);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    let filtered = books;

    if (selectedClass !== "all") {
      filtered = filtered.filter(book => book.class === parseInt(selectedClass));
    }

    if (selectedYear !== "all") {
      filtered = filtered.filter(book => book.year === selectedYear);
    }

    setFilteredBooks(filtered);
  }, [selectedClass, selectedYear, books]);

  const resetFilters = () => {
    setSelectedClass("all");
    setSelectedYear("all");
  };

  const toggleDescription = (bookId: string) => {
    setShowDescriptions(prev => ({
      ...prev,
      [bookId]: !prev[bookId]
    }));
  };

  const groupedBooks = filteredBooks.reduce((acc, book) => {
    if (!acc[book.class]) {
      acc[book.class] = [];
    }
    acc[book.class].push(book);
    return acc;
  }, {} as Record<number, YearlyBook[]>);

  const sortedClasses = Object.keys(groupedBooks).map(Number).sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal/20 via-background to-gold/20"></div>
        <div className="yearly-book-container relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0 }}
            className="mb-4"
          >
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors p-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back</span>
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center mb-3">
              <BookOpen className="h-10 w-10 text-gold animate-pulse" />
            </div>
            <h1 className="text-2xl font-heading font-bold mb-3 yearly-book-title">
              <span className="text-gradient-gold">Yearly Book Collection</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-[340px] mx-auto leading-relaxed">
              Discover our recommended books for each class. Browse by grade level or academic year to find the perfect reading materials for your studies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-4 border-b border-border bg-muted/20">
        <div className="yearly-book-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0 }}
            className="flex flex-col items-start gap-3"
          >
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gold" />
              <h2 className="text-base font-semibold">Filter Books</h2>
            </div>
            
            <div className="flex flex-col items-stretch gap-3 w-full">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" align="start" className="max-h-60 overflow-y-auto">
                  <SelectItem value="all">All Classes</SelectItem>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(cls => (
                    <SelectItem key={cls} value={cls.toString()}>
                      Class {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" align="start" className="max-h-60 overflow-y-auto">
                  <SelectItem value="all">All Years</SelectItem>
                  {availableYears.map(year => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(selectedClass !== "all" || selectedYear !== "all") && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetFilters}
                  className="w-full"
                >
                  Reset Filters
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Books Section */}
      <section className="py-6">
        <div className="yearly-book-container">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-3"></div>
                <p className="text-muted-foreground text-sm">Loading books...</p>
              </div>
            </div>
          ) : filteredBooks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0 }}
              className="text-center py-10"
            >
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Books Found</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                {selectedClass !== "all" || selectedYear !== "all" 
                  ? "Try adjusting your filters to see more books."
                  : "No books have been added yet. Check back soon!"}
              </p>
              {(selectedClass !== "all" || selectedYear !== "all") && (
                <Button onClick={resetFilters} variant="outline" size="sm">
                  Clear Filters
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="space-y-8">
              {sortedClasses.map((classNum, classIndex) => (
                <motion.div
                  key={classNum}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0, delay: classIndex * 0 }}
                >
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <GraduationCap className="h-5 w-5 text-gold" />
                      <h2 className="text-xl font-heading font-bold">
                        Class {classNum}
                      </h2>
                      <Badge variant="secondary" className="text-xs">
                        {groupedBooks[classNum].length} {groupedBooks[classNum].length === 1 ? 'book' : 'books'}
                      </Badge>
                    </div>
                    <div className="h-1 w-16 bg-gradient-to-r from-gold to-royal rounded-full"></div>
                  </div>

                  <div className="yearly-book-grid">
                    {groupedBooks[classNum].map((book, bookIndex) => (
                      <motion.div
                        key={book.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0, delay: bookIndex * 0 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <Card className="yearly-book-card h-full flex flex-col hover:shadow-xl transition-all duration-300 border-border hover:border-gold/50">
                          {(book as any).cover_photo && (
                            <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                              <img 
                                src={(book as any).cover_photo} 
                                alt={book.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <CardHeader className="yearly-book-header p-4">
                            <div className="flex items-start justify-between mb-2">
                              <BookOpen className="h-6 w-6 text-gold flex-shrink-0" />
                              <Badge variant="outline" className="text-xs">
                                {book.year}
                              </Badge>
                            </div>
                            <CardTitle className="text-base font-semibold line-clamp-2 yearly-book-title">
                              {book.title}
                            </CardTitle>
                            <CardDescription className="flex items-center space-x-1 mt-2 yearly-book-author">
                              <User className="h-3 w-3" />
                              <span className="text-xs">{book.author}</span>
                            </CardDescription>
                          </CardHeader>
                          
                          <CardContent className="yearly-book-content flex-grow px-4 pb-2">
                            {/* Mobile Description Toggle - Only visible on small screens */}
                            <div className="sm:hidden mb-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleDescription(book.id)}
                                className="w-full flex items-center justify-between border-gold/30 text-gold hover:bg-gold/10"
                              >
                                <span className="text-xs">Book Description</span>
                                {showDescriptions[book.id] ? (
                                  <Minus className="h-3 w-3" />
                                ) : (
                                  <Plus className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                            
                            {/* Description - Always visible on desktop, toggle on mobile */}
                            <div className={`${showDescriptions[book.id] ? 'block' : 'hidden sm:block'}`}>
                              <div className="flex items-start space-x-2 mb-3">
                                <Info className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-muted-foreground leading-relaxed yearly-book-description">
                                  {book.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                          
                          <CardFooter className="yearly-book-footer px-4 pb-4 pt-2 border-t border-border">
                            <Button 
                              className="w-full bg-gradient-to-r from-gold to-yellow-500 hover:from-gold/90 hover:to-yellow-500/90 text-black font-semibold text-sm h-9"
                              onClick={() => window.open(book.buying_link, '_blank', 'noopener,noreferrer')}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Buy Now
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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

export default YearlyBookPage;