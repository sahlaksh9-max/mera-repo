import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

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

const OptimizedGallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [galleryCategories, setGalleryCategories] = useState<GalleryCategory[]>([]);
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);

  // Load gallery data from localStorage
  useEffect(() => {
    const savedGallery = localStorage.getItem('royal-academy-gallery');
    if (savedGallery) {
      try {
        const categories = JSON.parse(savedGallery);
        console.log('Loaded gallery data:', categories);
        setGalleryCategories(categories);
        
        // Flatten all images for display
        const images = categories.flatMap((category: GalleryCategory) => category.images);
        console.log('Flattened images:', images);
        setAllImages(images);
      } catch (error) {
        console.error('Error parsing gallery data:', error);
        // Fallback data if parsing fails
        loadFallbackData();
      }
    } else {
      console.log('No gallery data found in localStorage, using fallback data');
      // Fallback data if no gallery data exists
      loadFallbackData();
    }
  }, []);

  const loadFallbackData = () => {
    console.log('Loading fallback gallery data');
    const fallbackCategories: GalleryCategory[] = [
      {
        id: "campus-life",
        name: "Campus Life",
        description: "Daily life and activities at Royal Academy",
        images: [
          {
            id: "campus-1",
            title: "Main Campus Building",
            description: "Our beautiful main academic building with modern facilities",
            imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
            category: "campus-life",
            date: "2024-09-01"
          },
          {
            id: "campus-2",
            title: "School Library",
            description: "State-of-the-art library with extensive resources",
            imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
            category: "campus-life",
            date: "2024-09-02"
          }
        ]
      },
      {
        id: "events",
        name: "School Events",
        description: "Special events and celebrations",
        images: [
          {
            id: "event-1",
            title: "Annual Sports Day",
            description: "Students participating in various sports competitions",
            imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
            category: "events",
            date: "2024-08-15"
          }
        ]
      }
    ];
    setGalleryCategories(fallbackCategories);
    const images = fallbackCategories.flatMap(category => category.images);
    console.log('Fallback images:', images);
    setAllImages(images);
  };

  // Create categories for filter
  const categories = [
    { id: "all", name: "All" },
    ...galleryCategories.map(cat => ({ id: cat.id, name: cat.name }))
  ];

  // Convert gallery images to display format
  const galleryItems = allImages.map((img, index) => ({
    id: parseInt(img.id) || index + 1,
    category: img.category,
    title: img.title,
    description: img.description,
    image: img.imageUrl || '' // Use imageUrl property
  }));

  console.log('Gallery items to display:', galleryItems);

  const filteredImages = selectedCategory === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImage === null) return;
    
    if (direction === "prev") {
      setSelectedImage(selectedImage > 0 ? selectedImage - 1 : filteredImages.length - 1);
    } else {
      setSelectedImage(selectedImage < filteredImages.length - 1 ? selectedImage + 1 : 0);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Category Filter */}
      <section className="section-padding bg-gradient-to-r from-royal/5 via-background to-crimson/5">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12"
          >
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`category-button px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 text-sm sm:text-base border-2 ${
                  selectedCategory === category.id
                    ? "selected border-gold bg-gold/15 text-gold shadow-lg"
                    : "border-gold/40 bg-card/50 hover:bg-card/70 text-muted-foreground hover:text-foreground hover:border-gold/70"
                }`}
              >
                {category.name}
              </motion.button>
            ))}
          </motion.div>

          {/* Gallery Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          >
            <AnimatePresence>
              {filteredImages.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ 
                    scale: 1.03,
                    z: 20 
                  }}
                  transition={{ 
                    duration: 0.2,
                    type: "spring",
                    stiffness: 300
                  }}
                  className="gallery-card cursor-pointer group relative"
                  onClick={() => openLightbox(index)}
                >
                  <div className="h-48 sm:h-64 relative overflow-hidden bg-muted/20">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        console.error('Image failed to load:', item.image);
                        // Set a fallback image
                        e.currentTarget.src = '/placeholder-image.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 opacity-0 group-hover:opacity-100"
                    >
                      <h3 className="text-white font-heading font-semibold text-base sm:text-lg mb-1 sm:mb-2">{item.title}</h3>
                      <p className="text-white/80 text-xs sm:text-sm">{item.description}</p>
                    </motion.div>
                  </div>
                  

                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
            onClick={closeLightbox}
          >
            <div className="lightbox-container relative w-full max-w-4xl max-h-[90vh] mx-2 sm:mx-4">
              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeLightbox}
                className="lightbox-close-btn absolute -top-10 right-0 text-white hover:text-gold transition-colors z-10"
              >
                <X className="h-6 w-6 sm:h-8 sm:w-8" />
              </motion.button>



              {/* Navigation Buttons */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage("prev");
                }}
                className="lightbox-navigation-btn absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:text-gold transition-colors z-10"
              >
                <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage("next");
                }}
                className="lightbox-navigation-btn absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:text-gold transition-colors z-10"
              >
                <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
              </motion.button>

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-full h-[60vh] sm:h-[70vh] rounded-lg sm:rounded-xl relative overflow-hidden bg-black/20"
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src={filteredImages[selectedImage]?.image} 
                  alt={filteredImages[selectedImage]?.title}
                  className="lightbox-image w-full h-full object-contain sm:object-cover"
                  onError={(e) => {
                    console.error('Lightbox image failed to load:', filteredImages[selectedImage]?.image);
                    // Set a fallback image
                    e.currentTarget.src = '/placeholder-image.svg';
                  }}
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                  <h3 className="text-lg sm:text-2xl font-heading font-bold mb-1 sm:mb-2">
                    {filteredImages[selectedImage]?.title}
                  </h3>
                  <p className="text-white/80 text-sm sm:text-base">{filteredImages[selectedImage]?.description}</p>
                </div>
              </motion.div>

              {/* Image Counter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-8 sm:-bottom-10 left-1/2 transform -translate-x-1/2 text-white/60 text-xs sm:text-sm"
              >
                {selectedImage + 1} / {filteredImages.length}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OptimizedGallery;