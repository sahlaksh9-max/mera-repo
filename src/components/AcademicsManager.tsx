import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Save, X, Book, Calculator, Microscope, Globe, Palette, Music, Cpu, Users } from "lucide-react";
import { Button } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getSupabaseData, setSupabaseData, subscribeToSupabaseChanges } from "@/lib/supabaseHelpers";

const iconMap: { [key: string]: any } = {
  Book, Calculator, Microscope, Globe, Palette, Music, Cpu, Users
};

interface Department {
  id: string;
  icon: string;
  title: string;
  description: string;
  programs: string[];
  color: string;
}

interface Achievement {
  id: string;
  value: string;
  label: string;
}

const AcademicsManager = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [showDeptForm, setShowDeptForm] = useState(false);
  const [showAchievementForm, setShowAchievementForm] = useState(false);
  const [deptForm, setDeptForm] = useState<Partial<Department>>({
    icon: 'Book',
    title: '',
    description: '',
    programs: [],
    color: 'from-blue-500/20 to-purple-500/20'
  });
  const [achievementForm, setAchievementForm] = useState<Partial<Achievement>>({
    value: '',
    label: ''
  });
  const [programInput, setProgramInput] = useState('');

  useEffect(() => {
    loadData();
    
    const unsubDepts = subscribeToSupabaseChanges<Department[]>(
      'royal-academy-academic-departments',
      (newData) => setDepartments(newData)
    );
    
    const unsubAchievements = subscribeToSupabaseChanges<Achievement[]>(
      'royal-academy-academic-achievements',
      (newData) => setAchievements(newData)
    );
    
    return () => {
      unsubDepts();
      unsubAchievements();
    };
  }, []);

  const loadData = async () => {
    try {
      const defaultDepartments: Department[] = [
        {
          id: '1',
          icon: 'Book',
          title: 'Literature & Languages',
          description: 'Comprehensive language arts program covering English, Foreign languages, and Creative Writing.',
          programs: ['Advanced English', 'World Literature', 'Creative Writing', 'Foreign Languages'],
          color: 'from-blue-500/20 to-purple-500/20'
        },
        {
          id: '2',
          icon: 'Calculator',
          title: 'Mathematics & Statistics',
          description: 'Advanced mathematical concepts from algebra to calculus and statistical analysis.',
          programs: ['Pre-Calculus', 'Advanced Calculus', 'Statistics', 'Applied Mathematics'],
          color: 'from-green-500/20 to-blue-500/20'
        },
        {
          id: '3',
          icon: 'Microscope',
          title: 'Sciences',
          description: 'Hands-on laboratory experiences in Biology, Chemistry, Physics, and Environmental Science.',
          programs: ['Advanced Biology', 'Organic Chemistry', 'Quantum Physics', 'Environmental Science'],
          color: 'from-purple-500/20 to-pink-500/20'
        },
        {
          id: '4',
          icon: 'Globe',
          title: 'Social Studies',
          description: 'Understanding human civilization, governance, economics, and cultural diversity.',
          programs: ['World History', 'Government & Politics', 'Economics', 'Cultural Studies'],
          color: 'from-orange-500/20 to-red-500/20'
        },
        {
          id: '5',
          icon: 'Palette',
          title: 'Fine Arts',
          description: 'Creative expression through visual arts, design, and multimedia production.',
          programs: ['Studio Art', 'Digital Design', 'Art History', 'Multimedia Production'],
          color: 'from-pink-500/20 to-purple-500/20'
        },
        {
          id: '6',
          icon: 'Music',
          title: 'Performing Arts',
          description: 'Musical excellence through choir, orchestra, band, and individual instruction.',
          programs: ['Concert Choir', 'Symphony Orchestra', 'Jazz Band', 'Music Theory'],
          color: 'from-yellow-500/20 to-orange-500/20'
        },
        {
          id: '7',
          icon: 'Cpu',
          title: 'Technology & Engineering',
          description: 'Cutting-edge computer science, robotics, and engineering fundamentals.',
          programs: ['Computer Science', 'Robotics', 'Engineering Design', 'Data Science'],
          color: 'from-blue-500/20 to-green-500/20'
        },
        {
          id: '8',
          icon: 'Users',
          title: 'Leadership & Ethics',
          description: 'Character development, leadership skills, and ethical decision-making.',
          programs: ['Student Government', 'Ethics & Philosophy', 'Community Service', 'Debate Team'],
          color: 'from-red-500/20 to-pink-500/20'
        }
      ];

      const defaultAchievements: Achievement[] = [
        { id: '1', value: '98%', label: 'College Acceptance Rate' },
        { id: '2', value: '1450', label: 'Average SAT Score' },
        { id: '3', value: '32', label: 'Average ACT Score' },
        { id: '4', value: '$2.3M', label: 'Scholarships Awarded Annually' }
      ];

      const depts = await getSupabaseData<Department[]>('royal-academy-academic-departments', defaultDepartments);
      const achieves = await getSupabaseData<Achievement[]>('royal-academy-academic-achievements', defaultAchievements);
      
      setDepartments(depts);
      setAchievements(achieves);
      
      if (depts.length === 0) {
        await setSupabaseData('royal-academy-academic-departments', defaultDepartments);
        setDepartments(defaultDepartments);
      }
      
      if (achieves.length === 0) {
        await setSupabaseData('royal-academy-academic-achievements', defaultAchievements);
        setAchievements(defaultAchievements);
      }
    } catch (error) {
      console.error('[AcademicsManager] Error loading data:', error);
    }
  };

  const handleSaveDepartment = async () => {
    if (!deptForm.title || !deptForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    const newDept: Department = {
      id: editingDept?.id || Date.now().toString(),
      icon: deptForm.icon || 'Book',
      title: deptForm.title || '',
      description: deptForm.description || '',
      programs: deptForm.programs || [],
      color: deptForm.color || 'from-blue-500/20 to-purple-500/20'
    };

    let updated: Department[];
    if (editingDept) {
      updated = departments.map(d => d.id === editingDept.id ? newDept : d);
    } else {
      updated = [...departments, newDept];
    }

    setDepartments(updated);
    await setSupabaseData('royal-academy-academic-departments', updated);
    
    setShowDeptForm(false);
    setEditingDept(null);
    setDeptForm({
      icon: 'Book',
      title: '',
      description: '',
      programs: [],
      color: 'from-blue-500/20 to-purple-500/20'
    });
  };

  const handleDeleteDepartment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    
    const updated = departments.filter(d => d.id !== id);
    setDepartments(updated);
    await setSupabaseData('royal-academy-academic-departments', updated);
  };

  const handleSaveAchievement = async () => {
    if (!achievementForm.value || !achievementForm.label) {
      alert('Please fill in all fields');
      return;
    }

    const newAchievement: Achievement = {
      id: editingAchievement?.id || Date.now().toString(),
      value: achievementForm.value || '',
      label: achievementForm.label || ''
    };

    let updated: Achievement[];
    if (editingAchievement) {
      updated = achievements.map(a => a.id === editingAchievement.id ? newAchievement : a);
    } else {
      updated = [...achievements, newAchievement];
    }

    setAchievements(updated);
    await setSupabaseData('royal-academy-academic-achievements', updated);
    
    setShowAchievementForm(false);
    setEditingAchievement(null);
    setAchievementForm({ value: '', label: '' });
  };

  const handleDeleteAchievement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return;
    
    const updated = achievements.filter(a => a.id !== id);
    setAchievements(updated);
    await setSupabaseData('royal-academy-academic-achievements', updated);
  };

  const addProgram = () => {
    if (programInput.trim()) {
      setDeptForm({
        ...deptForm,
        programs: [...(deptForm.programs || []), programInput.trim()]
      });
      setProgramInput('');
    }
  };

  const removeProgram = (index: number) => {
    const updated = [...(deptForm.programs || [])];
    updated.splice(index, 1);
    setDeptForm({ ...deptForm, programs: updated });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Academic Content Manager</h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Departments</h3>
          <Button onClick={() => { setShowDeptForm(true); setEditingDept(null); setDeptForm({ icon: 'Book', title: '', description: '', programs: [], color: 'from-blue-500/20 to-purple-500/20' }); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Department
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => {
            const IconComponent = iconMap[dept.icon] || Book;
            return (
              <motion.div
                key={dept.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 border rounded-lg bg-card space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-5 w-5 text-gold" />
                    <h4 className="font-semibold">{dept.title}</h4>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingDept(dept);
                        setDeptForm(dept);
                        setShowDeptForm(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteDepartment(dept.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{dept.description}</p>
                <div className="text-xs space-y-1">
                  {dept.programs.map((program, idx) => (
                    <div key={idx} className="text-gold">• {program}</div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {showDeptForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 border rounded-lg bg-card space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">
                {editingDept ? 'Edit Department' : 'Add Department'}
              </h4>
              <Button size="sm" variant="ghost" onClick={() => { setShowDeptForm(false); setEditingDept(null); }}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Icon</label>
                <select
                  className="w-full mt-1 p-2 border rounded"
                  value={deptForm.icon}
                  onChange={(e) => setDeptForm({ ...deptForm, icon: e.target.value })}
                >
                  {Object.keys(iconMap).map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Color Gradient</label>
                <Input
                  value={deptForm.color}
                  onChange={(e) => setDeptForm({ ...deptForm, color: e.target.value })}
                  placeholder="from-blue-500/20 to-purple-500/20"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={deptForm.title}
                onChange={(e) => setDeptForm({ ...deptForm, title: e.target.value })}
                placeholder="Department title"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={deptForm.description}
                onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                placeholder="Department description"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Programs</label>
              <div className="flex space-x-2 mt-1">
                <Input
                  value={programInput}
                  onChange={(e) => setProgramInput(e.target.value)}
                  placeholder="Program name"
                  onKeyPress={(e) => e.key === 'Enter' && addProgram()}
                />
                <Button type="button" onClick={addProgram}>Add</Button>
              </div>
              <div className="mt-2 space-y-1">
                {deptForm.programs?.map((program, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">{program}</span>
                    <Button size="sm" variant="ghost" onClick={() => removeProgram(idx)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => { setShowDeptForm(false); setEditingDept(null); }}>
                Cancel
              </Button>
              <Button onClick={handleSaveDepartment}>
                <Save className="h-4 w-4 mr-2" />
                Save Department
              </Button>
            </div>
          </motion.div>
        )}

        <div className="flex items-center justify-between pt-8">
          <h3 className="text-2xl font-semibold">Academic Achievements</h3>
          <Button onClick={() => { setShowAchievementForm(true); setEditingAchievement(null); setAchievementForm({ value: '', label: '' }); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Achievement
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.05 }}
              className="p-6 border rounded-lg bg-card text-center space-y-3"
            >
              <div className="text-3xl font-bold text-gold">{achievement.value}</div>
              <div className="text-sm text-muted-foreground">{achievement.label}</div>
              <div className="flex justify-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditingAchievement(achievement);
                    setAchievementForm(achievement);
                    setShowAchievementForm(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteAchievement(achievement.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {showAchievementForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 border rounded-lg bg-card space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">
                {editingAchievement ? 'Edit Achievement' : 'Add Achievement'}
              </h4>
              <Button size="sm" variant="ghost" onClick={() => { setShowAchievementForm(false); setEditingAchievement(null); }}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Value</label>
                <Input
                  value={achievementForm.value}
                  onChange={(e) => setAchievementForm({ ...achievementForm, value: e.target.value })}
                  placeholder="98%"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Label</label>
                <Input
                  value={achievementForm.label}
                  onChange={(e) => setAchievementForm({ ...achievementForm, label: e.target.value })}
                  placeholder="College Acceptance Rate"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => { setShowAchievementForm(false); setEditingAchievement(null); }}>
                Cancel
              </Button>
              <Button onClick={handleSaveAchievement}>
                <Save className="h-4 w-4 mr-2" />
                Save Achievement
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AcademicsManager;
