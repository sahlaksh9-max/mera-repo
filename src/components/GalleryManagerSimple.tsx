import React, { useState, useEffect } from "react";

const GalleryManagerSimple = () => {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [formData, setFormData] = useState({ name: "", title: "", description: "", imageUrl: "", selectedCategory: "" });
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const savedGallery = localStorage.getItem('royal-academy-gallery');
    if (savedGallery) {
      try {
        const parsed = JSON.parse(savedGallery);
        setCategories(parsed);
      } catch (e) {
        console.error('Error parsing gallery data:', e);
        setCategories([]);
      }
    }
  }, []);

  // Optimized category addition
  const addCategory = () => {
    setShowCategoryForm(true);
    setFormData({ name: "", title: "", description: "", imageUrl: "", selectedCategory: "" });
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      setIsLoading(true);
      const newCategory = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        description: `Images for ${formData.name.trim()}`,
        images: []
      };
      const updated = [...categories, newCategory];
      setCategories(updated);
      localStorage.setItem('royal-academy-gallery', JSON.stringify(updated));
      setMessage("Category added successfully! 👑");
      setTimeout(() => setMessage(""), 3000);
      setShowCategoryForm(false);
      setFormData({ name: "", title: "", description: "", imageUrl: "", selectedCategory: "" });
      setIsLoading(false);
    }
  };

  // Optimized photo addition
  const addPhoto = () => {
    if (categories.length === 0) {
      setMessage("Please create a category first! 📁");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    setShowPhotoForm(true);
    setFormData({ name: "", title: "", description: "", imageUrl: "", selectedCategory: categories[0]?.id || "" });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setFormData({ ...formData, imageUrl: imageData });
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim() && formData.selectedCategory) {
      setIsLoading(true);
      const categoryId = formData.selectedCategory;
      const newPhoto = {
        id: Date.now().toString(),
        title: formData.title.trim(),
        description: formData.description.trim() || "",
        imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        category: categoryId,
        date: new Date().toISOString().split('T')[0]
      };
      
      const updated = categories.map(cat => {
        if (cat.id === categoryId) {
          return { ...cat, images: [...(cat.images || []), newPhoto] };
        }
        return cat;
      });
      
      setCategories(updated);
      localStorage.setItem('royal-academy-gallery', JSON.stringify(updated));
      setMessage("Photo added successfully! 📸👑");
      setTimeout(() => setMessage(""), 3000);
      setShowPhotoForm(false);
      setFormData({ name: "", title: "", description: "", imageUrl: "", selectedCategory: "" });
      setIsLoading(false);
    }
  };

  const deleteCategory = (categoryId) => {
    if (confirm("Delete this category and all its photos?")) {
      setIsLoading(true);
      const updated = categories.filter(cat => cat.id !== categoryId);
      setCategories(updated);
      localStorage.setItem('royal-academy-gallery', JSON.stringify(updated));
      setMessage("Category deleted! 🗑️");
      setTimeout(() => setMessage(""), 3000);
      setIsLoading(false);
    }
  };

  const deletePhoto = (categoryId, photoId) => {
    if (confirm("Delete this photo?")) {
      setIsLoading(true);
      const updated = categories.map(cat => {
        if (cat.id === categoryId) {
          return { ...cat, images: cat.images.filter(img => img.id !== photoId) };
        }
        return cat;
      });
      setCategories(updated);
      localStorage.setItem('royal-academy-gallery', JSON.stringify(updated));
      setMessage("Photo deleted! 🗑️");
      setTimeout(() => setMessage(""), 3000);
      setIsLoading(false);
    }
  };

  const editPhoto = (categoryId, photoId) => {
    const category = categories.find(cat => cat.id === categoryId);
    const photo = category?.images?.find(img => img.id === photoId);
    if (photo) {
      setEditingPhoto({ categoryId, photoId, photo });
      setFormData({ name: "", title: photo.title, description: photo.description, imageUrl: photo.imageUrl, selectedCategory: photo.category });
      setShowEditForm(true);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim() && formData.selectedCategory && editingPhoto) {
      setIsLoading(true);
      // If category changed, we need to move the photo
      const oldCategoryId = editingPhoto.categoryId;
      const newCategoryId = formData.selectedCategory;
      
      let updated = categories.map(cat => {
        // Remove photo from old category
        if (cat.id === oldCategoryId) {
          return {
            ...cat,
            images: cat.images.filter(img => img.id !== editingPhoto.photoId)
          };
        }
        return cat;
      });

      // Add updated photo to new category
      updated = updated.map(cat => {
        if (cat.id === newCategoryId) {
          const updatedPhoto = {
            ...editingPhoto.photo,
            title: formData.title.trim(),
            description: formData.description.trim(),
            category: newCategoryId,
            imageUrl: formData.imageUrl
          };
          return {
            ...cat,
            images: [...cat.images, updatedPhoto]
          };
        }
        return cat;
      });

      setCategories(updated);
      localStorage.setItem('royal-academy-gallery', JSON.stringify(updated));
      setMessage("Photo updated! ✏️👑");
      setTimeout(() => setMessage(""), 3000);
      setShowEditForm(false);
      setEditingPhoto(null);
      setFormData({ name: "", title: "", description: "", imageUrl: "", selectedCategory: "" });
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 sm:p-6 overflow-hidden">
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-gray-700 font-medium">Processing...</p>
          </div>
        </div>
      )}
      
      {/* Animated Background */}
      <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-2xl"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Royal Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center space-x-2 sm:space-x-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-yellow-500/30 shadow-2xl">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-2xl sm:text-3xl">👑</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-1 sm:mb-2">
                Royal Gallery Manager
              </h1>
              <p className="text-sm sm:text-xl text-gray-300 flex items-center justify-center space-x-1 sm:space-x-2">
                <span className="hidden sm:inline">✨</span>
                <span>Manage your royal photo collection</span>
                <span className="hidden sm:inline">⭐</span>
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mb-6 sm:mb-8 text-center">
            <div className="inline-block bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg animate-bounce">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-sm sm:text-base">⭐</span>
                <span className="font-bold text-sm sm:text-lg">{message}</span>
                <span className="text-sm sm:text-base">✨</span>
              </div>
            </div>
          </div>
        )}

        {/* Royal Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-12">
          <button
            onClick={addCategory}
            className="group relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-500 hover:via-purple-500 hover:to-indigo-500 text-white px-4 sm:px-8 py-4 sm:py-6 rounded-2xl sm:rounded-3xl font-bold text-lg sm:text-2xl shadow-2xl transform hover:scale-105 hover:-translate-y-2 sm:hover:-translate-y-3 transition-all duration-300 border-2 border-white/20 hover:border-white/40"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl sm:rounded-3xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
            <div className="relative flex flex-col items-center space-y-2 sm:space-y-3">
              <div className="text-3xl sm:text-5xl animate-bounce drop-shadow-lg">📁</div>
              <span className="drop-shadow-md">Add Category</span>
              <div className="text-xs sm:text-sm opacity-90 font-medium">Create new photo categories</div>
            </div>
          </button>

          <button
            onClick={addPhoto}
            className="group relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 text-white px-4 sm:px-8 py-4 sm:py-6 rounded-2xl sm:rounded-3xl font-bold text-lg sm:text-2xl shadow-2xl transform hover:scale-105 hover:-translate-y-2 sm:hover:-translate-y-3 transition-all duration-300 border-2 border-white/20 hover:border-white/40"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl sm:rounded-3xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
            <div className="relative flex flex-col items-center space-y-2 sm:space-y-3">
              <div className="text-3xl sm:text-5xl animate-pulse drop-shadow-lg">📸</div>
              <span className="drop-shadow-md">Add Photo</span>
              <div className="text-xs sm:text-sm opacity-90 font-medium">Upload beautiful images</div>
            </div>
          </button>
        </div>

        {/* Royal Forms */}
        {/* Add Category Form */}
        {showCategoryForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="relative w-full max-w-xs sm:max-w-md">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl blur opacity-50"></div>
              <div className="relative bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 w-full shadow-2xl border border-white/20">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex-1 text-center">
                    <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">👑</div>
                    <h3 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Create Category
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCategoryForm(false)}
                    className="absolute top-2 sm:top-4 right-2 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-base sm:text-lg font-bold">×</span>
                  </button>
                </div>
                
                <form onSubmit={handleCategorySubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">Category Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter category name..."
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-purple-200 rounded-lg sm:rounded-xl bg-white focus:border-purple-500 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-purple-200 transition-all duration-300 font-medium text-gray-900 placeholder-gray-500"
                      required
                      autoFocus
                    />
                  </div>
                  
                  <div className="flex space-x-2 sm:space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowCategoryForm(false)}
                      className="flex-1 px-3 py-2 sm:px-6 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-3 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 font-semibold shadow-lg text-sm sm:text-base"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating..." : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Add Photo Form */}
        {showPhotoForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="relative w-full max-w-xs sm:max-w-md">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl sm:rounded-3xl blur opacity-50"></div>
              <div className="relative bg-gradient-to-br from-white via-emerald-50 to-teal-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 w-full shadow-2xl border border-white/20">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex-1 text-center">
                    <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">📸</div>
                    <h3 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      Add Photo
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPhotoForm(false)}
                    className="absolute top-2 sm:top-4 right-2 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-base sm:text-lg font-bold">×</span>
                  </button>
                </div>
                
                <form onSubmit={handlePhotoSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">Photo Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Enter photo title..."
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-emerald-200 rounded-lg sm:rounded-xl bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-emerald-200 transition-all duration-300 font-medium text-gray-900 placeholder-gray-500"
                      required
                      autoFocus
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Enter photo description..."
                      rows={2}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-emerald-200 rounded-lg sm:rounded-xl bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-emerald-200 transition-all duration-300 font-medium resize-none text-gray-900 placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">📁 Select Category</label>
                    <select
                      value={formData.selectedCategory}
                      onChange={(e) => setFormData({...formData, selectedCategory: e.target.value})}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-emerald-200 rounded-lg sm:rounded-xl bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-emerald-200 transition-all duration-300 font-medium text-gray-900"
                      required
                    >
                      <option value="">Choose category...</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          🏰 {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">Upload Photo</label>
                    {formData.imageUrl && (
                      <div className="mb-3 sm:mb-4">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-full h-32 sm:h-48 object-cover rounded-lg sm:rounded-xl border-2 border-emerald-200"
                        />
                      </div>
                    )}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="photo-upload"
                        disabled={isLoading}
                      />
                      <label
                        htmlFor="photo-upload"
                        className={`w-full flex items-center justify-center px-3 py-2 sm:px-4 sm:py-3 border-2 border-dashed border-emerald-300 rounded-lg sm:rounded-xl bg-emerald-50 hover:bg-emerald-100 cursor-pointer transition-all duration-300 text-emerald-700 font-medium ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="text-center">
                          <div className="text-xl sm:text-3xl mb-1 sm:mb-2">📸</div>
                          <div className="text-xs sm:text-base">{formData.imageUrl ? "Change Photo" : "Choose Photo"}</div>
                          <div className="text-[10px] sm:text-xs opacity-70">Click to upload your image</div>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 sm:space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowPhotoForm(false)}
                      className="flex-1 px-3 py-2 sm:px-6 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-3 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg sm:rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 font-semibold shadow-lg text-sm sm:text-base"
                      disabled={isLoading}
                    >
                      {isLoading ? "Adding..." : "Add Photo"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Photo Form */}
        {showEditForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="relative w-full max-w-xs sm:max-w-md">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-2xl sm:rounded-3xl blur opacity-50"></div>
              <div className="relative bg-gradient-to-br from-white via-yellow-50 to-orange-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 w-full shadow-2xl border border-white/20">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex-1 text-center">
                    <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">✏️</div>
                    <h3 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                      Edit Photo
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="absolute top-2 sm:top-4 right-2 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-base sm:text-lg font-bold">×</span>
                  </button>
                </div>
                
                <form onSubmit={handleEditSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">Photo Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Enter photo title..."
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-yellow-200 rounded-lg sm:rounded-xl bg-white focus:border-yellow-500 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-yellow-200 transition-all duration-300 font-medium text-gray-900 placeholder-gray-500"
                      required
                      autoFocus
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Enter photo description..."
                      rows={2}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-yellow-200 rounded-lg sm:rounded-xl bg-white focus:border-yellow-500 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-yellow-200 transition-all duration-300 font-medium resize-none text-gray-900 placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">📁 Change Category</label>
                    <select
                      value={formData.selectedCategory}
                      onChange={(e) => setFormData({...formData, selectedCategory: e.target.value})}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-yellow-200 rounded-lg sm:rounded-xl bg-white focus:border-yellow-500 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-yellow-200 transition-all duration-300 font-medium text-gray-900"
                      required
                    >
                      <option value="">Choose category...</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          🏰 {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex space-x-2 sm:space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowEditForm(false)}
                      className="flex-1 px-3 py-2 sm:px-6 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-3 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg sm:rounded-xl hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 font-semibold shadow-lg text-sm sm:text-base"
                      disabled={isLoading}
                    >
                      {isLoading ? "Updating..." : "Update Photo"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Status */}
        <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-purple-500/30 shadow-2xl">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 sm:mb-4">
              🏰 Gallery Status
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 text-center">
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-blue-400/30">
              <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">📚</div>
              <div className="text-lg sm:text-2xl font-bold text-blue-300">{categories.length}</div>
              <div className="text-xs sm:text-blue-200">Categories</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-green-400/30">
              <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">🖼️</div>
              <div className="text-lg sm:text-2xl font-bold text-green-300">
                {categories.reduce((total, cat) => total + (cat.images?.length || 0), 0)}
              </div>
              <div className="text-xs sm:text-green-200">Total Photos</div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-yellow-400/30">
              <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">👑</div>
              <div className="text-lg sm:text-2xl font-bold text-yellow-300">Royal</div>
              <div className="text-xs sm:text-yellow-200">Quality</div>
            </div>
          </div>

          {categories.length > 0 && (
            <div className="mt-6 sm:mt-8">
              <h3 className="text-base sm:text-xl font-bold text-white mb-3 sm:mb-4 text-center">📋 Your Categories:</h3>
              <div className="space-y-6">
                {categories.map((category, index) => (
                  <div key={category.id || index} className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-purple-400/30 overflow-hidden">
                    {/* Category Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <span className="text-lg sm:text-2xl">🏰</span>
                          <div>
                            <div className="font-bold text-white text-sm sm:text-lg">{category.name}</div>
                            <div className="text-xs text-purple-100">{category.images?.length || 0} photos</div>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteCategory(category.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 transform hover:scale-105"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                    
                    {/* Photos Grid */}
                    <div className="p-3 sm:p-6">
                      {(!category.images || category.images.length === 0) ? (
                        <div className="text-center py-4 sm:py-8 text-gray-400">
                          <div className="text-3xl sm:text-6xl mb-2 sm:mb-4">📷</div>
                          <p className="text-sm sm:text-lg">No photos in this category yet.</p>
                          <button
                            onClick={addPhoto}
                            className="mt-3 sm:mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white px-4 sm:px-6 py-1 sm:py-2 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm"
                          >
                            📸 Add Photo
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                          {category.images.map((photo) => (
                            <div
                              key={photo.id}
                              className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-lg sm:rounded-xl overflow-hidden border border-gray-600/30 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                            >
                              {/* Photo Image */}
                              <div className="aspect-video overflow-hidden">
                                <img
                                  src={photo.imageUrl}
                                  alt={photo.title}
                                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                              
                              {/* Photo Info */}
                              <div className="p-3 sm:p-4">
                                <h4 className="font-bold text-white mb-1 text-xs sm:text-sm">{photo.title}</h4>
                                <p className="text-xs text-gray-300 mb-2 line-clamp-2">{photo.description}</p>
                                
                                {/* Photo Actions */}
                                <div className="flex items-center justify-between">
                                  <div className="text-[10px] sm:text-xs text-gray-400 flex items-center space-x-1">
                                    <span>📅</span>
                                    <span>{new Date(photo.date).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex space-x-1 sm:space-x-2">
                                    <button
                                      onClick={() => editPhoto(category.id, photo.id)}
                                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-[10px] sm:text-xs font-semibold transition-all duration-300 transform hover:scale-110"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => deletePhoto(category.id, photo.id)}
                                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-[10px] sm:text-xs font-semibold transition-all duration-300 transform hover:scale-110"
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
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 sm:mt-12">
          <div className="inline-flex items-center space-x-2 sm:space-x-4 bg-gradient-to-r from-gray-900/60 to-gray-800/60 backdrop-blur-lg rounded-xl sm:rounded-2xl px-4 sm:px-8 py-2 sm:py-4 border border-gray-600/30">
            <span className="text-xs sm:text-base animate-pulse">✨</span>
            <span className="text-gray-300 font-medium text-xs sm:text-sm">Royal Academy Gallery Management</span>
            <span className="text-xs sm:text-base animate-bounce">👑</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryManagerSimple;
