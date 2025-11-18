import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye,
  EyeOff,
  BookOpen,
  Calendar,
  Filter,
  ExternalLink,
  Upload,
  CalendarPlus
} from "lucide-react";
import { Button } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  loadYearlyBooks, 
  addYearlyBook, 
  updateYearlyBook, 
  deleteYearlyBook,
  YearlyBook 
} from "@/lib/booksHelper";
import { subscribeToSupabaseChanges, getSupabaseData, setSupabaseData } from "@/lib/supabaseHelpers";
import { toast } from "sonner";

const YearlyBookManager = () => {
  const [books, setBooks] = useState<YearlyBook[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBook, setEditingBook] = useState<YearlyBook | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [message, setMessage] = useState("");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterYear, setFilterYear] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingYear, setIsAddingYear] = useState(false);
  const [newYearInput, setNewYearInput] = useState("");
  const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string>("");
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  useEffect(() => {
    loadBooksData();
    loadAvailableYears();

    const unsubscribeBooks = subscribeToSupabaseChanges<YearlyBook[]>(
      'royal-academy-yearly-books',
      (newBooks) => {
        console.log('[YearlyBookManager] Received realtime update for books');
        setBooks(newBooks);
      }
    );

    const unsubscribeYears = subscribeToSupabaseChanges<string[]>(
      'royal-academy-available-years',
      (newYears) => {
        console.log('[YearlyBookManager] Received realtime update for years');
        setAvailableYears(newYears);
      }
    );

    return () => {
      unsubscribeBooks();
      unsubscribeYears();
    };
  }, []);

  const loadBooksData = async () => {
    setIsLoading(true);
    try {
      const data = await loadYearlyBooks();
      setBooks(data);
    } catch (error) {
      console.error("Error loading books:", error);
      toast.error("Failed to load books");
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableYears = async () => {
    try {
      const years = await getSupabaseData<string[]>('royal-academy-available-years', []);
      setAvailableYears(years);
    } catch (error) {
      console.error('[YearlyBookManager] Error loading years:', error);
    }
  };

  const handleAddBook = () => {
    const newBook: Omit<YearlyBook, 'id' | 'createdAt'> = {
      class: 1,
      year: "",
      title: "",
      author: "",
      description: "",
      buying_link: ""
    };
    setEditingBook(newBook as YearlyBook);
    setIsAddingNew(true);
    setIsEditing(true);
    setCoverPhotoFile(null);
    setCoverPhotoPreview("");
  };

  const handleAddYear = () => {
    setNewYearInput("");
    setIsAddingYear(true);
  };

  const handleCreateYear = async () => {
    const yearPattern = /^\d{4}-\d{4}$/;
    if (!yearPattern.test(newYearInput.trim())) {
      toast.error("Year must be in academic year format (e.g., 2024-2025)");
      return;
    }

    const trimmedYear = newYearInput.trim();

    // Add year to available years list
    if (!availableYears.includes(trimmedYear)) {
      const updatedYears = [...availableYears, trimmedYear].sort();
      setAvailableYears(updatedYears);
      await setSupabaseData('royal-academy-available-years', updatedYears);
      toast.success(`Academic year ${trimmedYear} created!`);
    } else {
      toast.error(`Academic year ${trimmedYear} already exists.`);
    }

    setIsAddingYear(false);
    setNewYearInput("");
  };

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setCoverPhotoFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhotoPreview(reader.result as string);
        updateBookField('cover_photo' as any, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditBook = (book: YearlyBook) => {
    setEditingBook({ ...book });
    setIsAddingNew(false);
    setIsEditing(true);
    setCoverPhotoFile(null);
    setCoverPhotoPreview((book as any).cover_photo || "");
  };

  const validateURL = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateAcademicYear = (year: string): boolean => {
    const academicYearRegex = /^\d{4}-\d{4}$/;
    if (!academicYearRegex.test(year)) return false;

    const [startYear, endYear] = year.split('-').map(Number);
    return endYear === startYear + 1;
  };

  const handleSaveBook = async () => {
    if (!editingBook) return;

    if (!editingBook.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!editingBook.author.trim()) {
      toast.error("Author is required");
      return;
    }

    if (!editingBook.description.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!editingBook.year.trim()) {
      toast.error("Year is required");
      return;
    }

    if (!validateAcademicYear(editingBook.year)) {
      toast.error("Year must be in academic year format (e.g., 2024-2025)");
      return;
    }

    if (!editingBook.buying_link.trim()) {
      toast.error("Buying link is required");
      return;
    }

    if (!validateURL(editingBook.buying_link)) {
      toast.error("Please enter a valid URL for the buying link");
      return;
    }

    if (editingBook.class < 1 || editingBook.class > 12) {
      toast.error("Class must be between 1 and 12");
      return;
    }

    try {
      if (isAddingNew) {
        const { id, createdAt, ...bookData } = editingBook;
        const newBook = await addYearlyBook(bookData);
        if (newBook) {
          await loadBooksData();
          toast.success("Book added successfully!");
          setMessage("Book added successfully!");
        } else {
          toast.error("Failed to add book");
        }
      } else {
        const success = await updateYearlyBook(editingBook.id, editingBook);
        if (success) {
          await loadBooksData();
          toast.success("Book updated successfully!");
          setMessage("Book updated successfully!");
        } else {
          toast.error("Failed to update book");
        }
      }

      setIsEditing(false);
      setEditingBook(null);
      setIsAddingNew(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error saving book:", error);
      toast.error("An error occurred while saving the book");
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      try {
        const success = await deleteYearlyBook(bookId);
        if (success) {
          await loadBooksData();
          toast.success("Book deleted successfully!");
          setMessage("Book deleted successfully!");
          setTimeout(() => setMessage(""), 3000);
        } else {
          toast.error("Failed to delete book");
        }
      } catch (error) {
        console.error("Error deleting book:", error);
        toast.error("An error occurred while deleting the book");
      }
    }
  };

  const updateBookField = (field: keyof YearlyBook, value: any) => {
    if (!editingBook) return;
    setEditingBook({
      ...editingBook,
      [field]: value
    });
  };

  const filteredBooks = books.filter(book => {
    const classMatch = filterClass === "all" || book.class.toString() === filterClass;
    const yearMatch = filterYear === "all" || book.year === filterYear;
    return classMatch && yearMatch;
  });

  const uniqueYears = Array.from(new Set(books.map(book => book.year))).sort();

  const groupedBooks = filteredBooks.reduce((acc, book) => {
    const classKey = `Class ${book.class}`;
    if (!acc[classKey]) {
      acc[classKey] = [];
    }
    acc[classKey].push(book);
    return acc;
  }, {} as Record<string, YearlyBook[]>);

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
      {/* Mobile-optimized header */}
      <div className="flex flex-col space-y-3 sm:space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="text-center sm:text-left">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-heading font-bold text-foreground">Yearly Book Manager</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Manage recommended books for classes 1-12</p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2 lg:space-x-3">
          <Button
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
          >
            {showPreview ? <EyeOff className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> : <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />}
            <span className="hidden xs:inline">{showPreview ? "Hide Preview" : "Show Preview"}</span>
            <span className="xs:hidden">{showPreview ? "Hide" : "Preview"}</span>
          </Button>
          <Button
            onClick={handleAddYear}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
          >
            <CalendarPlus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Create Year</span>
            <span className="xs:hidden">Add Year</span>
          </Button>
          <Button onClick={handleAddBook} className="w-full sm:w-auto bg-gradient-to-r from-royal to-gold text-white text-xs sm:text-sm h-8 sm:h-9">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Add Book</span>
            <span className="xs:hidden">Add</span>
          </Button>
        </div>
      </div>

      {message && (
        <Alert className="mx-2 sm:mx-0">
          <AlertDescription className="text-xs sm:text-sm">{message}</AlertDescription>
        </Alert>
      )}

      {/* Mobile-optimized filters */}
      <div className="bg-card border border-border rounded-lg p-3 sm:p-4 mx-2 sm:mx-0">
        <div className="flex items-center space-x-2 mb-3 sm:mb-4">
          <Filter className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          <h3 className="text-xs sm:text-sm font-semibold text-foreground">Filters</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <div>
            <label className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 block">Filter by Class</label>
            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger className="h-8 sm:h-9 text-xs sm:text-sm">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                  <SelectItem key={num} value={num.toString()}>Class {num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 block">Filter by Academic Year</label>
            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger className="h-8 sm:h-9 text-xs sm:text-sm">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isAddingYear && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 w-full max-w-xs sm:max-w-md mx-2"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-heading font-bold">Create Academic Year</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingYear(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Academic Year <span className="text-red-500">*</span></label>
                  <Input
                    value={newYearInput}
                    onChange={(e) => setNewYearInput(e.target.value)}
                    placeholder="e.g., 2024-2025"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Format: YYYY-YYYY (e.g., 2024-2025)</p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t">
                <Button variant="outline" onClick={() => setIsAddingYear(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateYear} className="bg-gradient-to-r from-royal to-gold text-white">
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Create Year
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {isEditing && editingBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-heading font-bold">
                  {isAddingNew ? "Add New Book" : "Edit Book"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Class <span className="text-red-500">*</span></label>
                    <Select
                      value={editingBook.class.toString()}
                      onValueChange={(value) => updateBookField('class', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                          <SelectItem key={num} value={num.toString()}>Class {num}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Academic Year <span className="text-red-500">*</span></label>
                    <Input
                      value={editingBook.year}
                      onChange={(e) => updateBookField('year', e.target.value)}
                      placeholder="e.g., 2024-2025"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Format: YYYY-YYYY</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Title <span className="text-red-500">*</span></label>
                  <Input
                    value={editingBook.title}
                    onChange={(e) => updateBookField('title', e.target.value)}
                    placeholder="Enter book title"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Author <span className="text-red-500">*</span></label>
                  <Input
                    value={editingBook.author}
                    onChange={(e) => updateBookField('author', e.target.value)}
                    placeholder="Enter author name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description <span className="text-red-500">*</span></label>
                  <Textarea
                    value={editingBook.description}
                    onChange={(e) => updateBookField('description', e.target.value)}
                    placeholder="Enter book description and why it's recommended"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Book Cover Photo <span className="text-red-500">*</span></label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverPhotoChange}
                        className="flex-1"
                        id="cover-photo-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('cover-photo-upload')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Upload an image file for the book cover (max 5MB)</p>
                    {coverPhotoPreview && (
                      <div className="mt-2">
                        <img 
                          src={coverPhotoPreview} 
                          alt="Book cover preview" 
                          className="w-32 h-44 object-cover rounded border shadow-md"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Buying Link <span className="text-red-500">*</span></label>
                  <Input
                    value={editingBook.buying_link}
                    onChange={(e) => updateBookField('buying_link', e.target.value)}
                    placeholder="https://example.com/book"
                    type="url"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Enter a valid URL where students can purchase the book</p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveBook} className="bg-gradient-to-r from-royal to-gold text-white">
                  <Save className="h-4 w-4 mr-2" />
                  {isAddingNew ? "Add" : "Update"} Book
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50 animate-pulse" />
            <p>Loading books...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="font-semibold mb-2">No books available for the selected criteria.</p>
            <p className="text-sm">Click "Add Book" to add recommended books for students.</p>
          </div>
        ) : (
          Object.entries(groupedBooks).sort((a, b) => {
            const classA = parseInt(a[0].replace('Class ', ''));
            const classB = parseInt(b[0].replace('Class ', ''));
            return classA - classB;
          }).map(([className, classBooks]) => (
            <div key={className} className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4">
                <h3 className="text-xl font-heading font-bold text-white">
                  {className} ({classBooks.length} {classBooks.length === 1 ? 'book' : 'books'})
                </h3>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {classBooks.map((book) => (
                    <motion.div
                      key={book.id}
                      layout
                      className="bg-background/50 border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        {(book as any).cover_photo && (
                          <img 
                            src={(book as any).cover_photo} 
                            alt={book.title}
                            className="w-16 h-20 object-cover rounded border flex-shrink-0"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground mb-1">{book.title}</h4>
                          <p className="text-sm text-muted-foreground">by {book.author}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditBook(book)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteBook(book.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{book.description}</p>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{book.year}</span>
                        </div>
                        <a
                          href={book.buying_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <span>Buy Book</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showPreview && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <div>
              <h3 className="font-semibold text-foreground">Live Preview</h3>
              <p className="text-sm text-muted-foreground">View how books appear to students</p>
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              <Eye className="h-4 w-4 mr-2" />
              Preview Book List
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default YearlyBookManager;