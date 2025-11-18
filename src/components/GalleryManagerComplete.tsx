import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Upload,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Folder,
  Calendar,
  Crown,
  Sparkles,
  Camera,
  Star,
  Heart,
  Zap
} from "lucide-react";

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

const GalleryManagerComplete = () => {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Initialize with default data
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
    setMessage("Gallery saved successfully!");
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
    setMessage(isAddingNew ? "Image added successfully!" : "Image updated successfully!");
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
      setMessage("Image deleted successfully!");
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
      setMessage("Category added successfully!");
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
      setMessage("Category deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 rounded-3xl"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-2xl"></div>
      
      <div className="relative z-10">
        {/* Royal Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between space-y-6 sm:space-y-0"
        >
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-2xl border border-yellow-500/30">
              <div className="flex items-center space-x-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                >
                  <Crown className="h-8 w-8 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Royal Gallery Manager
                  </h2>
                  <p className="text-gray-300 flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                    <span>Manage your royal photo collection with elegance</span>
                    <Star className="h-4 w-4 text-yellow-400" />
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <motion.button
              onClick={addNewCategory}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Folder className="h-5 w-5" />
                </motion.div>
                <span>Add Category</span>
                <Sparkles className="h-4 w-4" />
              </div>
            </motion.button>

            <motion.button
              onClick={handleAddImage}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center space-x-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Camera className="h-5 w-5" />
                </motion.div>
                <span>Add Photo</span>
                <Heart className="h-4 w-4" />
              </div>
            </motion.button>

            <motion.button
              onClick={saveGallery}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Save className="h-5 w-5" />
                </motion.div>
                <span>Save All</span>
                <Zap className="h-4 w-4" />
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Royal Success Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur opacity-50"></div>
              <div className="relative bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 text-green-800 px-6 py-4 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Star className="h-6 w-6 text-green-600" />
                  </motion.div>
                  <span className="font-semibold">{message}</span>
                  <Sparkles className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Royal Category Filter */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center space-x-6"
        >
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Crown className="h-6 w-6 text-yellow-400" />
            </motion.div>
            <label className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Filter by Category:
            </label>
          </div>
          <motion.select
            whileHover={{ scale: 1.02 }}
            whileFocus={{ scale: 1.02 }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border-2 border-purple-300 rounded-xl bg-gradient-to-r from-white to-purple-50 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all duration-300 font-medium"
          >
            <option value="">✨ All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                🏰 {category.name}
              </option>
            ))}
          </motion.select>
        </motion.div>

        {/* Royal Edit Modal */}
        <AnimatePresence>
          {isEditing && editingImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 rounded-3xl blur opacity-50"></div>
                <div className="relative bg-gradient-to-br from-white via-purple-50 to-blue-50 rounded-3xl p-8 shadow-2xl border border-purple-200">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                      >
                        <Camera className="h-6 w-6 text-white" />
                      </motion.div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        {isAddingNew ? "✨ Add Royal Photo" : "👑 Edit Royal Photo"}
                      </h3>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsEditing(false)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
                    >
                      <X className="h-6 w-6" />
                    </motion.button>
                  </div>

                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-bold mb-3 text-purple-700 flex items-center space-x-2">
                        <Sparkles className="h-4 w-4" />
                        <span>Photo Title</span>
                      </label>
                      <input
                        type="text"
                        value={editingImage.title}
                        onChange={(e) => updateImageField('title', e.target.value)}
                        placeholder="Enter royal photo title..."
                        className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl bg-gradient-to-r from-white to-purple-50 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all duration-300 font-medium"
                />
              </motion.div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={editingImage.description}
                  onChange={(e) => updateImageField('description', e.target.value)}
                  placeholder="Enter photo description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={editingImage.category}
                  onChange={(e) => updateImageField('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={editingImage.date}
                  onChange={(e) => updateImageField('date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Photo</label>
                {editingImage.imageUrl && (
                  <div className="mb-3">
                    <img
                      src={editingImage.imageUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveImage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isAddingNew ? "Add Photo" : "Update Photo"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
      )}
        </AnimatePresence>

      {/* Gallery Categories */}
      <div className="space-y-8">
        {categories
          .filter(category => !selectedCategory || category.id === selectedCategory)
          .map((category) => (
          <div key={category.id} className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {category.name} ({category.images.length} photos)
                  </h3>
                  <p className="text-blue-100 text-sm">{category.description}</p>
                </div>
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Delete Category
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {category.images.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-6xl mb-4">📷</div>
                  <p>No photos in this category yet.</p>
                  <button
                    onClick={handleAddImage}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Add First Photo
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {category.images.map((image) => (
                    <div
                      key={image.id}
                      className="bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="aspect-video overflow-hidden">
                        {image.imageUrl ? (
                          <img
                            src={image.imageUrl}
                            alt={image.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                            <span className="text-4xl">📷</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-white mb-1 text-sm">{image.title}</h4>
                        <p className="text-xs text-gray-300 mb-2 line-clamp-2">{image.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-400">
                            📅 {new Date(image.date).toLocaleDateString()}
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleEditImage(image)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteImage(image.id, category.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Preview Link */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
          <div>
            <h3 className="font-semibold text-white">Live Preview</h3>
            <p className="text-sm text-gray-300">View how the gallery looks to visitors</p>
          </div>
          <a
            href="/gallery"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors inline-block text-center"
          >
            🔗 Open Gallery Page
          </a>
        </div>
      </div>
      </div>
    </div>
  );
};

export default GalleryManagerComplete;
