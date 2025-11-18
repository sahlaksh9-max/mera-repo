
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Upload,
  Eye,
  Image as ImageIcon,
  Folder,
  Calendar,
  Sparkles,
  FolderPlus,
  ImagePlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GalleryImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  date: string;
}

interface GalleryCategory {
  id: string;
  name: string;
  description: string;
  images: GalleryImage[];
}

const GalleryManager = () => {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    const savedGallery = localStorage.getItem('royal-academy-gallery');
    if (savedGallery) {
      setCategories(JSON.parse(savedGallery));
    } else {
      const defaultCategories: GalleryCategory[] = [
        {
          id: "campus-life",
          name: "Campus Life",
          description: "Daily life and activities at Royal Academy",
          images: []
        },
        {
          id: "events",
          name: "School Events",
          description: "Special events and celebrations",
          images: []
        }
      ];
      setCategories(defaultCategories);
      localStorage.setItem('royal-academy-gallery', JSON.stringify(defaultCategories));
    }
  }, []);

  const saveGallery = () => {
    localStorage.setItem('royal-academy-gallery', JSON.stringify(categories));
    setMessage("✨ Gallery saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleAddImage = () => {
    const newImage: GalleryImage = {
      id: Date.now().toString(),
      title: "",
      description: "",
      imageUrl: "",
      category: categories[0]?.id || "",
      date: new Date().toISOString().split('T')[0]
    };
    setEditingImage(newImage);
    setIsAddingNew(true);
    setIsEditing(true);
  };

  const handleEditImage = (image: GalleryImage) => {
    setEditingImage({ ...image });
    setIsAddingNew(false);
    setIsEditing(true);
  };

  const handleSaveImage = () => {
    if (!editingImage || !editingImage.title.trim()) {
      alert("Please enter a title for the image");
      return;
    }

    const updatedCategories = categories.map(category => {
      if (category.id === editingImage.category) {
        if (isAddingNew) {
          return {
            ...category,
            images: [...category.images, editingImage]
          };
        } else {
          return {
            ...category,
            images: category.images.map(img => 
              img.id === editingImage.id ? editingImage : img
            )
          };
        }
      }
      return category;
    });

    setCategories(updatedCategories);
    localStorage.setItem('royal-academy-gallery', JSON.stringify(updatedCategories));
    setIsEditing(false);
    setEditingImage(null);
    setMessage(isAddingNew ? "📸 Image added successfully!" : "✏️ Image updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDeleteImage = (imageId: string, categoryId: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            images: category.images.filter(img => img.id !== imageId)
          };
        }
        return category;
      });
      setCategories(updatedCategories);
      localStorage.setItem('royal-academy-gallery', JSON.stringify(updatedCategories));
      setMessage("🗑️ Image deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingImage) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setEditingImage({
          ...editingImage,
          imageUrl: imageData
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateImageField = (field: keyof GalleryImage, value: string) => {
    if (!editingImage) return;
    setEditingImage({
      ...editingImage,
      [field]: value
    });
  };

  const addNewCategory = () => {
    const categoryName = prompt("Enter new category name:");
    if (categoryName && categoryName.trim()) {
      const newCategory: GalleryCategory = {
        id: categoryName.toLowerCase().replace(/\s+/g, '-'),
        name: categoryName.trim(),
        description: `Images related to ${categoryName.trim()}`,
        images: []
      };
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      localStorage.setItem('royal-academy-gallery', JSON.stringify(updatedCategories));
      setMessage("📁 Category added successfully!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const deleteCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category && category.images.length > 0) {
      alert("Cannot delete category with images. Please move or delete all images first.");
      return;
    }
    
    if (confirm("Are you sure you want to delete this category?")) {
      const updatedCategories = categories.filter(c => c.id !== categoryId);
      setCategories(updatedCategories);
      localStorage.setItem('royal-academy-gallery', JSON.stringify(updatedCategories));
      setMessage("🗑️ Category deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Memoize filtered categories for performance
  const filteredCategories = useMemo(() => {
    return categories.filter(category => !selectedCategory || category.id === selectedCategory);
  }, [categories, selectedCategory]);

  return (
    <div className="space-y-8 relative min-h-screen">
      {/* Glass Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-royal/5 via-background to-gold/5 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gold/10 to-royal/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-royal/10 to-crimson/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-card/40 border border-border/50 rounded-2xl p-6 shadow-xl"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="p-3 bg-gradient-to-br from-gold/20 to-royal/20 rounded-xl backdrop-blur-sm"
              >
                <ImageIcon className="h-8 w-8 text-gold" />
              </motion.div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gradient-gold">Gallery Manager</h2>
                <p className="text-sm sm:text-base text-muted-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Manage photo galleries with elegance
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={addNewCategory}
                variant="outline"
                className="backdrop-blur-sm bg-card/50 border-royal/30 hover:bg-royal/10"
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
              <Button
                onClick={handleAddImage}
                className="bg-gradient-to-r from-royal to-gold hover:from-royal/90 hover:to-gold/90"
              >
                <ImagePlus className="h-4 w-4 mr-2" />
                Add Photo
              </Button>
              <Button
                onClick={saveGallery}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
              >
                <Save className="h-4 w-4 mr-2" />
                Save All
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
            >
              <Alert className="backdrop-blur-xl bg-emerald-500/10 border-emerald-500/30">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-emerald-700 dark:text-emerald-400 font-medium">
                  {message}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="backdrop-blur-xl bg-card/40 border border-border/50 rounded-xl p-4"
        >
          <div className="flex items-center gap-4">
            <Folder className="h-5 w-5 text-gold" />
            <label className="text-sm font-semibold">Filter by Category:</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 backdrop-blur-sm bg-background/50">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Edit Modal */}
        <AnimatePresence>
          {isEditing && editingImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setIsEditing(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="backdrop-blur-xl bg-card/95 border border-border/50 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-gold/20 to-royal/20 rounded-lg">
                      <ImageIcon className="h-5 w-5 text-gold" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-gradient-gold">
                      {isAddingNew ? "Add New Photo" : "Edit Photo"}
                    </h3>
                  </div>
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
                  <div>
                    <label className="text-sm font-medium mb-2 block">Photo Title *</label>
                    <Input
                      value={editingImage.title}
                      onChange={(e) => updateImageField('title', e.target.value)}
                      placeholder="Enter photo title"
                      className="backdrop-blur-sm bg-background/50"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      value={editingImage.description}
                      onChange={(e) => updateImageField('description', e.target.value)}
                      placeholder="Enter photo description"
                      rows={3}
                      className="backdrop-blur-sm bg-background/50"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Category *</label>
                    <Select
                      value={editingImage.category}
                      onValueChange={(value) => updateImageField('category', value)}
                    >
                      <SelectTrigger className="backdrop-blur-sm bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Date</label>
                    <Input
                      type="date"
                      value={editingImage.date}
                      onChange={(e) => updateImageField('date', e.target.value)}
                      className="backdrop-blur-sm bg-background/50"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Photo</label>
                    {editingImage.imageUrl && (
                      <div className="mb-3 rounded-lg overflow-hidden border border-border/50">
                        <img
                          src={editingImage.imageUrl}
                          alt="Preview"
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload">
                      <Button variant="outline" asChild className="w-full cursor-pointer">
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          {editingImage.imageUrl ? "Change Photo" : "Upload Photo"}
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-6 border-t">
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleSaveImage} className="flex-1 bg-gradient-to-r from-royal to-gold">
                    <Save className="h-4 w-4 mr-2" />
                    {isAddingNew ? "Add" : "Update"}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gallery Categories */}
        <div className="space-y-6">
          {filteredCategories.map((category, catIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
              className="backdrop-blur-xl bg-card/40 border border-border/50 rounded-2xl overflow-hidden shadow-xl"
            >
              <div className="bg-gradient-to-r from-royal/80 to-gold/80 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Folder className="h-5 w-5 text-white" />
                    <div>
                      <h3 className="text-lg font-heading font-bold text-white">
                        {category.name} ({category.images.length})
                      </h3>
                      <p className="text-white/80 text-sm">{category.description}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => deleteCategory(category.id)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-6">
                {category.images.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="mb-4">No photos in this category yet.</p>
                    <Button onClick={handleAddImage} variant="outline">
                      <ImagePlus className="h-4 w-4 mr-2" />
                      Add First Photo
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {category.images.map((image, imgIndex) => (
                      <motion.div
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: imgIndex * 0.05 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        className="backdrop-blur-sm bg-background/50 border border-border/50 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                      >
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={image.imageUrl || "/placeholder.svg"}
                            alt={image.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-sm mb-1 line-clamp-1">{image.title}</h4>
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{image.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(image.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditImage(image)}
                                className="h-7 w-7 p-0"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteImage(image.id, category.id)}
                                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Preview Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="backdrop-blur-xl bg-card/40 border border-border/50 rounded-xl p-4"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-gold" />
              <div>
                <h3 className="font-semibold">Live Preview</h3>
                <p className="text-sm text-muted-foreground">View gallery as visitors see it</p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <a href="/gallery" target="_blank" rel="noopener noreferrer">
                <Eye className="h-4 w-4 mr-2" />
                Open Gallery
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GalleryManager;
