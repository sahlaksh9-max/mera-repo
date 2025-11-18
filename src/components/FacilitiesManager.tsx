import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Save, X, BookOpen, Beaker, Dumbbell, Theater, Cpu, Heart, Coffee, Car } from "lucide-react";
import { Button } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getSupabaseData, setSupabaseData, subscribeToSupabaseChanges } from "@/lib/supabaseHelpers";

const iconMap: { [key: string]: any } = {
  BookOpen, Beaker, Dumbbell, Theater, Cpu, Heart, Coffee, Car
};

interface Facility {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  image: string;
}

interface Stat {
  id: string;
  value: string;
  label: string;
}

const FacilitiesManager = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [editingStat, setEditingStat] = useState<Stat | null>(null);
  const [showFacilityForm, setShowFacilityForm] = useState(false);
  const [showStatForm, setShowStatForm] = useState(false);
  const [facilityForm, setFacilityForm] = useState<Partial<Facility>>({
    icon: 'BookOpen',
    title: '',
    description: '',
    features: [],
    image: 'bg-gradient-to-br from-blue-600/20 to-purple-600/20'
  });
  const [statForm, setStatForm] = useState<Partial<Stat>>({
    value: '',
    label: ''
  });
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    loadData();
    
    const unsubFacilities = subscribeToSupabaseChanges<Facility[]>(
      'royal-academy-facilities',
      (newData) => setFacilities(newData)
    );
    
    const unsubStats = subscribeToSupabaseChanges<Stat[]>(
      'royal-academy-facility-stats',
      (newData) => setStats(newData)
    );
    
    return () => {
      unsubFacilities();
      unsubStats();
    };
  }, []);

  const loadData = async () => {
    try {
      const defaultFacilities: Facility[] = [
        {
          id: '1',
          icon: 'BookOpen',
          title: 'Royal Library',
          description: 'A magnificent 3-story library with over 100,000 books, digital resources, and quiet study spaces.',
          features: ['Digital Archives', 'Research Stations', 'Group Study Rooms', 'Reading Gardens'],
          image: 'bg-gradient-to-br from-blue-600/20 to-purple-600/20'
        },
        {
          id: '2',
          icon: 'Beaker',
          title: 'Science Laboratories',
          description: 'State-of-the-art labs for Biology, Chemistry, Physics, and Environmental Science research.',
          features: ['Advanced Equipment', 'Safety Systems', 'Research Facilities', 'Greenhouse Complex'],
          image: 'bg-gradient-to-br from-green-600/20 to-blue-600/20'
        },
        {
          id: '3',
          icon: 'Cpu',
          title: 'Technology Center',
          description: 'Modern computer labs with latest hardware, robotics workshop, and maker spaces.',
          features: ['3D Printing Lab', 'Robotics Workshop', 'Computer Labs', 'Innovation Studio'],
          image: 'bg-gradient-to-br from-purple-600/20 to-pink-600/20'
        },
        {
          id: '4',
          icon: 'Dumbbell',
          title: 'Athletic Complex',
          description: 'Comprehensive sports facilities including gymnasium, swimming pool, and outdoor fields.',
          features: ['Olympic Pool', 'Fitness Center', 'Sports Fields', 'Indoor Courts'],
          image: 'bg-gradient-to-br from-orange-600/20 to-red-600/20'
        },
        {
          id: '5',
          icon: 'Theater',
          title: 'Performing Arts Center',
          description: 'Professional-grade theater, music halls, and practice rooms for artistic excellence.',
          features: ['Main Theater', 'Concert Hall', 'Practice Rooms', 'Recording Studio'],
          image: 'bg-gradient-to-br from-pink-600/20 to-purple-600/20'
        },
        {
          id: '6',
          icon: 'Heart',
          title: 'Health & Wellness Center',
          description: 'Complete healthcare facility with medical staff, counseling services, and wellness programs.',
          features: ['Medical Clinic', 'Counseling Center', 'Wellness Programs', 'Nutrition Services'],
          image: 'bg-gradient-to-br from-red-600/20 to-pink-600/20'
        },
        {
          id: '7',
          icon: 'Coffee',
          title: 'Student Commons',
          description: 'Central hub for student life with dining facilities, lounges, and collaborative spaces.',
          features: ['Dining Hall', 'Student Lounges', 'Collaborative Spaces', 'Outdoor Terraces'],
          image: 'bg-gradient-to-br from-yellow-600/20 to-orange-600/20'
        },
        {
          id: '8',
          icon: 'Car',
          title: 'Transportation',
          description: 'Safe and reliable transportation services connecting students to the academy.',
          features: ['School Buses', 'Shuttle Service', 'Parking Facilities', 'Bike Storage'],
          image: 'bg-gradient-to-br from-blue-600/20 to-green-600/20'
        }
      ];

      const defaultStats: Stat[] = [
        { id: '1', value: '150', label: 'Acres Campus' },
        { id: '2', value: '50+', label: 'Modern Facilities' },
        { id: '3', value: '24/7', label: 'Security & Support' },
        { id: '4', value: '100%', label: 'WiFi Coverage' }
      ];

      const facs = await getSupabaseData<Facility[]>('royal-academy-facilities', defaultFacilities);
      const sts = await getSupabaseData<Stat[]>('royal-academy-facility-stats', defaultStats);
      
      setFacilities(facs);
      setStats(sts);
      
      if (facs.length === 0) {
        await setSupabaseData('royal-academy-facilities', defaultFacilities);
        setFacilities(defaultFacilities);
      }
      
      if (sts.length === 0) {
        await setSupabaseData('royal-academy-facility-stats', defaultStats);
        setStats(defaultStats);
      }
    } catch (error) {
      console.error('[FacilitiesManager] Error loading data:', error);
    }
  };

  const handleSaveFacility = async () => {
    if (!facilityForm.title || !facilityForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    const newFacility: Facility = {
      id: editingFacility?.id || Date.now().toString(),
      icon: facilityForm.icon || 'BookOpen',
      title: facilityForm.title || '',
      description: facilityForm.description || '',
      features: facilityForm.features || [],
      image: facilityForm.image || 'bg-gradient-to-br from-blue-600/20 to-purple-600/20'
    };

    let updated: Facility[];
    if (editingFacility) {
      updated = facilities.map(f => f.id === editingFacility.id ? newFacility : f);
    } else {
      updated = [...facilities, newFacility];
    }

    setFacilities(updated);
    await setSupabaseData('royal-academy-facilities', updated);
    
    setShowFacilityForm(false);
    setEditingFacility(null);
    setFacilityForm({
      icon: 'BookOpen',
      title: '',
      description: '',
      features: [],
      image: 'bg-gradient-to-br from-blue-600/20 to-purple-600/20'
    });
  };

  const handleDeleteFacility = async (id: string) => {
    if (!confirm('Are you sure you want to delete this facility?')) return;
    
    const updated = facilities.filter(f => f.id !== id);
    setFacilities(updated);
    await setSupabaseData('royal-academy-facilities', updated);
  };

  const handleSaveStat = async () => {
    if (!statForm.value || !statForm.label) {
      alert('Please fill in all fields');
      return;
    }

    const newStat: Stat = {
      id: editingStat?.id || Date.now().toString(),
      value: statForm.value || '',
      label: statForm.label || ''
    };

    let updated: Stat[];
    if (editingStat) {
      updated = stats.map(s => s.id === editingStat.id ? newStat : s);
    } else {
      updated = [...stats, newStat];
    }

    setStats(updated);
    await setSupabaseData('royal-academy-facility-stats', updated);
    
    setShowStatForm(false);
    setEditingStat(null);
    setStatForm({ value: '', label: '' });
  };

  const handleDeleteStat = async (id: string) => {
    if (!confirm('Are you sure you want to delete this stat?')) return;
    
    const updated = stats.filter(s => s.id !== id);
    setStats(updated);
    await setSupabaseData('royal-academy-facility-stats', updated);
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFacilityForm({
        ...facilityForm,
        features: [...(facilityForm.features || []), featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    const updated = [...(facilityForm.features || [])];
    updated.splice(index, 1);
    setFacilityForm({ ...facilityForm, features: updated });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Facilities Content Manager</h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Facilities</h3>
          <Button onClick={() => { setShowFacilityForm(true); setEditingFacility(null); setFacilityForm({ icon: 'BookOpen', title: '', description: '', features: [], image: 'bg-gradient-to-br from-blue-600/20 to-purple-600/20' }); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Facility
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facilities.map((facility) => {
            const IconComponent = iconMap[facility.icon] || BookOpen;
            return (
              <motion.div
                key={facility.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 border rounded-lg bg-card space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-5 w-5 text-gold" />
                    <h4 className="font-semibold">{facility.title}</h4>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingFacility(facility);
                        setFacilityForm(facility);
                        setShowFacilityForm(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteFacility(facility.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{facility.description}</p>
                <div className="text-xs space-y-1">
                  {facility.features.map((feature, idx) => (
                    <div key={idx} className="text-gold">• {feature}</div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {showFacilityForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 border rounded-lg bg-card space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">
                {editingFacility ? 'Edit Facility' : 'Add Facility'}
              </h4>
              <Button size="sm" variant="ghost" onClick={() => { setShowFacilityForm(false); setEditingFacility(null); }}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Icon</label>
                <select
                  className="w-full mt-1 p-2 border rounded"
                  value={facilityForm.icon}
                  onChange={(e) => setFacilityForm({ ...facilityForm, icon: e.target.value })}
                >
                  {Object.keys(iconMap).map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Background Gradient</label>
                <Input
                  value={facilityForm.image}
                  onChange={(e) => setFacilityForm({ ...facilityForm, image: e.target.value })}
                  placeholder="bg-gradient-to-br from-blue-600/20 to-purple-600/20"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={facilityForm.title}
                onChange={(e) => setFacilityForm({ ...facilityForm, title: e.target.value })}
                placeholder="Facility title"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={facilityForm.description}
                onChange={(e) => setFacilityForm({ ...facilityForm, description: e.target.value })}
                placeholder="Facility description"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Key Features</label>
              <div className="flex space-x-2 mt-1">
                <Input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="Feature name"
                  onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                />
                <Button type="button" onClick={addFeature}>Add</Button>
              </div>
              <div className="mt-2 space-y-1">
                {facilityForm.features?.map((feature, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">{feature}</span>
                    <Button size="sm" variant="ghost" onClick={() => removeFeature(idx)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => { setShowFacilityForm(false); setEditingFacility(null); }}>
                Cancel
              </Button>
              <Button onClick={handleSaveFacility}>
                <Save className="h-4 w-4 mr-2" />
                Save Facility
              </Button>
            </div>
          </motion.div>
        )}

        <div className="flex items-center justify-between pt-8">
          <h3 className="text-2xl font-semibold">Campus Statistics</h3>
          <Button onClick={() => { setShowStatForm(true); setEditingStat(null); setStatForm({ value: '', label: '' }); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Stat
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              whileHover={{ scale: 1.05 }}
              className="p-6 border rounded-lg bg-card text-center space-y-3"
            >
              <div className="text-3xl font-bold text-gold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="flex justify-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditingStat(stat);
                    setStatForm(stat);
                    setShowStatForm(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteStat(stat.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {showStatForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 border rounded-lg bg-card space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">
                {editingStat ? 'Edit Stat' : 'Add Stat'}
              </h4>
              <Button size="sm" variant="ghost" onClick={() => { setShowStatForm(false); setEditingStat(null); }}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Value</label>
                <Input
                  value={statForm.value}
                  onChange={(e) => setStatForm({ ...statForm, value: e.target.value })}
                  placeholder="150"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Label</label>
                <Input
                  value={statForm.label}
                  onChange={(e) => setStatForm({ ...statForm, label: e.target.value })}
                  placeholder="Acres Campus"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => { setShowStatForm(false); setEditingStat(null); }}>
                Cancel
              </Button>
              <Button onClick={handleSaveStat}>
                <Save className="h-4 w-4 mr-2" />
                Save Stat
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FacilitiesManager;
