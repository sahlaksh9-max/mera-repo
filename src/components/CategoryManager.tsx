import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Save, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getSupabaseData, setSupabaseData } from "@/lib/supabaseHelpers";

interface Category {
  id: string;
  name: string;
  color: string;
  description: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: "academic", name: "Academic", color: "#3b82f6", description: "Academic events and programs" },
  { id: "sports", name: "Sports", color: "#f97316", description: "Athletic and sports activities" },
  { id: "arts", name: "Arts", color: "#ec4899", description: "Arts and cultural events" },
  { id: "social", name: "Social", color: "#fbbf24", description: "Social gatherings and community events" },
  { id: "cultural", name: "Cultural", color: "#8b5cf6", description: "Cultural celebrations and events" },
  { id: "technology", name: "Technology", color: "#10b981", description: "Technology and innovation events" }
];

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await getSupabaseData<Category[]>('royal-academy-event-categories', DEFAULT_CATEGORIES);
    setCategories(data);
  };

  const handleAddCategory = () => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: "",
      color: "#3b82f6",
      description: ""
    };
    setEditingCategory(newCategory);
    setIsAddingNew(true);
    setIsEditing(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory({ ...category });
    setIsAddingNew(false);
    setIsEditing(true);
  };

  const handleSaveCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      alert("Please enter a category name");
      return;
    }

    const duplicateCategory = categories.find(
      c => c.id !== editingCategory.id && c.name.toLowerCase() === editingCategory.name.trim().toLowerCase()
    );
    
    if (duplicateCategory) {
      alert("A category with this name already exists. Please choose a different name.");
      return;
    }

    const updatedCategories = isAddingNew
      ? [...categories, { ...editingCategory, name: editingCategory.name.trim() }]
      : categories.map(c => c.id === editingCategory.id ? { ...editingCategory, name: editingCategory.name.trim() } : c);

    try {
      const success = await setSupabaseData('royal-academy-event-categories', updatedCategories);
      if (success) {
        setCategories(updatedCategories);
        setIsEditing(false);
        setEditingCategory(null);
        setMessage(isAddingNew ? "Category created successfully!" : "Category updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to save category. Please try again.");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error saving category:", error);
      setMessage("Error saving category. Please check your connection and try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      const updatedCategories = categories.filter(c => c.id !== id);
      try {
        const success = await setSupabaseData('royal-academy-event-categories', updatedCategories);
        if (success) {
          setCategories(updatedCategories);
          setMessage("Category deleted successfully!");
          setTimeout(() => setMessage(""), 3000);
        } else {
          setMessage("Failed to delete category. Please try again.");
          setTimeout(() => setMessage(""), 3000);
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        setMessage("Error deleting category. Please check your connection and try again.");
        setTimeout(() => setMessage(""), 3000);
      }
    }
  };

  const updateCategoryField = (field: keyof Category, value: any) => {
    if (!editingCategory) return;
    setEditingCategory({
      ...editingCategory,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">Category Manager</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Manage event categories</p>
        </div>
        <Button onClick={handleAddCategory} className="w-full sm:w-auto bg-gradient-to-r from-royal to-gold text-white">
          <Plus className="h-4 w-4 mr-2" />
          New Category
        </Button>
      </div>

      {/* Success Message */}
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && editingCategory && (
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
              className="bg-card rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto mx-4"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-heading font-bold">
                  {isAddingNew ? "Create New Category" : "Edit Category"}
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
                <div>
                  <label className="text-sm font-medium mb-2 block">Category Name</label>
                  <Input
                    value={editingCategory.name}
                    onChange={(e) => updateCategoryField('name', e.target.value)}
                    placeholder="Enter category name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={editingCategory.color}
                      onChange={(e) => updateCategoryField('color', e.target.value)}
                      className="h-10 w-20 rounded border cursor-pointer"
                    />
                    <Input
                      value={editingCategory.color}
                      onChange={(e) => updateCategoryField('color', e.target.value)}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Input
                    value={editingCategory.description}
                    onChange={(e) => updateCategoryField('description', e.target.value)}
                    placeholder="Brief description of this category"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveCategory} className="bg-gradient-to-r from-royal to-gold text-white">
                  <Save className="h-4 w-4 mr-2" />
                  {isAddingNew ? "Create" : "Update"} Category
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Tag className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>No categories created yet.</p>
            <p className="text-sm">Create your first category to get started.</p>
          </div>
        ) : (
          categories.map((category) => (
            <motion.div
              key={category.id}
              layout
              className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-6 h-6 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <div>
                    <h3 className="font-semibold text-foreground">{category.name}</h3>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditCategory(category)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
