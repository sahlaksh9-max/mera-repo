import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Ban, Eye, Trash2, UserPlus, X, Phone, Mail, GraduationCap, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  phone: string;
  assignedClass: string;
  assignedSection: string;
  status: 'active' | 'suspended' | 'banned';
  joinDate: string;
  avatar?: string;
  teacherId?: string;
}

const ManageTeachers: React.FC = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Load teachers from localStorage
  useEffect(() => {
    const loadTeachers = () => {
      try {
        const storedTeachers = JSON.parse(localStorage.getItem('royal-academy-teachers') || '[]');
        const mappedTeachers: Teacher[] = storedTeachers.map((teacher: any) => ({
          id: teacher.id,
          name: teacher.name,
          email: teacher.email,
          subject: teacher.subject,
          phone: teacher.phone || 'N/A',
          assignedClass: teacher.assignedClass || 'N/A',
          assignedSection: teacher.assignedSection || 'N/A',
          status: (['active', 'suspended', 'banned'].includes(teacher.status) ? teacher.status : 'active') as 'active' | 'suspended' | 'banned',
          joinDate: teacher.createdAt || new Date().toISOString(),
          teacherId: teacher.teacherId || teacher.id,
          avatar: teacher.avatar
        }));
        setTeachers(mappedTeachers);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading teachers:', error);
        setTeachers([]);
        setIsLoading(false);
      }
    };

    loadTeachers();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'royal-academy-teachers') {
        loadTeachers();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleBanStatus = (id: string) => {
    const updatedTeachers = teachers.map(teacher => {
      if (teacher.id === id) {
        const newStatus: 'active' | 'banned' | 'suspended' = teacher.status === 'banned' ? 'active' : 'banned';
        return { ...teacher, status: newStatus };
      }
      return teacher;
    });
    
    setTeachers(updatedTeachers);
    
    // Update localStorage
    try {
      const storedTeachers = JSON.parse(localStorage.getItem('royal-academy-teachers') || '[]');
      const updatedStoredTeachers = storedTeachers.map((teacher: any) => 
        teacher.id === id ? { ...teacher, status: teacher.status === 'banned' ? 'active' as const : 'banned' as const } : teacher
      );
      localStorage.setItem('royal-academy-teachers', JSON.stringify(updatedStoredTeachers));
      
      // Also update auth teachers
      const authTeachers = JSON.parse(localStorage.getItem('royal-academy-auth-teachers') || '[]');
      const updatedAuthTeachers = authTeachers.map((teacher: any) => 
        (teacher.id === id || teacher.teacherId === id) ? { ...teacher, status: teacher.status === 'banned' ? 'active' : 'banned' } : teacher
      );
      localStorage.setItem('royal-academy-auth-teachers', JSON.stringify(updatedAuthTeachers));
      
      const teacher = updatedTeachers.find(t => t.id === id);
      toast.success(`Teacher ${teacher?.status === 'banned' ? 'banned' : 'unbanned'} successfully`);
    } catch (error) {
      console.error('Error updating teacher status:', error);
      toast.error('Failed to update teacher status');
    }
  };

  const handleDelete = (id: string) => {
    const teacher = teachers.find(t => t.id === id);
    if (window.confirm(`Are you sure you want to permanently delete ${teacher?.name}? This action cannot be undone.`)) {
      try {
        // Remove from state
        const updatedTeachers = teachers.filter(teacher => teacher.id !== id);
        setTeachers(updatedTeachers);
        
        // Remove from localStorage
        const storedTeachers = JSON.parse(localStorage.getItem('royal-academy-teachers') || '[]');
        const updatedStoredTeachers = storedTeachers.filter((teacher: any) => teacher.id !== id);
        localStorage.setItem('royal-academy-teachers', JSON.stringify(updatedStoredTeachers));
        
        // Remove from auth teachers
        const authTeachers = JSON.parse(localStorage.getItem('royal-academy-auth-teachers') || '[]');
        const updatedAuthTeachers = authTeachers.filter((teacher: any) => teacher.id !== id && teacher.teacherId !== id);
        localStorage.setItem('royal-academy-auth-teachers', JSON.stringify(updatedAuthTeachers));
        
        toast.success('Teacher deleted successfully');
      } catch (error) {
        console.error('Error deleting teacher:', error);
        toast.error('Failed to delete teacher');
      }
    }
  };

  const handleCreateTeacher = () => {
    // Navigate to principal dashboard to create teacher
    navigate('/principal-dashboard');
    toast.info('Redirecting to Principal Dashboard to create teacher account');
  };

  const handleViewProfile = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setSelectedTeacher(null);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Teacher Management</h1>
          <p className="text-muted-foreground">Manage all teachers and their accounts</p>
        </div>
        <Button onClick={handleCreateTeacher} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add New Teacher
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachers.length}</div>
            <p className="text-xs text-muted-foreground">Total registered teachers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Teachers</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachers.filter(t => t.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banned Teachers</CardTitle>
            <Ban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachers.filter(t => t.status === 'banned').length}</div>
            <p className="text-xs text-muted-foreground">Accounts suspended</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachers.filter(t => {
              const joinDate = new Date(t.joinDate);
              const oneMonthAgo = new Date();
              oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
              return joinDate >= oneMonthAgo;
            }).length}</div>
            <p className="text-xs text-muted-foreground">Since last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Teachers List</CardTitle>
              <CardDescription>Manage all teacher accounts and permissions</CardDescription>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search teachers..."
                className="w-full sm:w-64 pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Class/Section</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeachers.length > 0 ? (
                    filteredTeachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={teacher.avatar} alt={teacher.name} />
                              <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{teacher.name}</div>
                              <div className="text-sm text-muted-foreground">{teacher.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{teacher.subject}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{teacher.assignedClass}</div>
                            <div className="text-muted-foreground">Section {teacher.assignedSection}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            teacher.status === 'banned' ? 'destructive' : 
                            teacher.status === 'suspended' ? 'secondary' : 
                            'default'
                          }>
                            {teacher.status === 'banned' ? 'Banned' : 
             teacher.status === 'suspended' ? 'Suspended' : 
             'Active'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(teacher.joinDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleBanStatus(teacher.id)}
                              title={teacher.status === 'banned' ? 'Unban Teacher' : 'Ban Teacher'}
                              className={teacher.status === 'banned' ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              title="View Profile"
                              onClick={() => handleViewProfile(teacher)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(teacher.id)}
                              title="Delete Teacher"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No teachers found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Teacher Profile Modal */}
      <AnimatePresence>
        {showProfileModal && selectedTeacher && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={closeProfileModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-2xl shadow-2xl border border-border/50 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <h2 className="text-xl font-bold">Teacher Profile</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeProfileModal}
                  className="rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Avatar and Basic Info */}
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedTeacher.avatar} alt={selectedTeacher.name} />
                    <AvatarFallback className="text-lg">
                      {selectedTeacher.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{selectedTeacher.name}</h3>
                    <p className="text-muted-foreground">{selectedTeacher.subject} Teacher</p>
                    <Badge 
                      variant={
                        selectedTeacher.status === 'banned' ? 'destructive' : 
                        selectedTeacher.status === 'suspended' ? 'secondary' : 
                        'default'
                      }
                      className="mt-2"
                    >
                      {selectedTeacher.status === 'banned' ? 'Banned' : 
                       selectedTeacher.status === 'suspended' ? 'Suspended' : 
                       'Active'}
                    </Badge>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{selectedTeacher.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{selectedTeacher.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Assigned Class</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedTeacher.assignedClass} - Section {selectedTeacher.assignedSection}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Join Date</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedTeacher.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {selectedTeacher.teacherId && (
                    <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                      <UserPlus className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Teacher ID</p>
                        <p className="text-sm text-muted-foreground">{selectedTeacher.teacherId}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toggleBanStatus(selectedTeacher.id);
                      closeProfileModal();
                    }}
                    className={selectedTeacher.status === 'banned' ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    {selectedTeacher.status === 'banned' ? 'Unban' : 'Ban'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleDelete(selectedTeacher.id);
                      closeProfileModal();
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageTeachers;
