import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Ban, 
  Eye, 
  Trash2, 
  UserPlus, 
  ArrowLeft,
  Copy,
  RefreshCw,
  Edit,
  Key,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  X,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface TeacherID {
  id: string;
  teacherId: string;
  name: string;
  email: string;
  subject: string;
  username: string;
  password: string;
  status: 'active' | 'suspended' | 'banned';
  createdAt: string;
  lastLogin?: string;
  loginAttempts: number;
}

const ManageTeacherID: React.FC = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<TeacherID[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherID | null>(null);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherID | null>(null);

  // Load teacher IDs from localStorage
  useEffect(() => {
    const loadTeacherIDs = () => {
      try {
        const authTeachers = JSON.parse(localStorage.getItem('royal-academy-auth-teachers') || '[]');
        const mappedTeachers = authTeachers.map((teacher: any) => ({
          id: teacher.id || teacher.teacherId,
          teacherId: teacher.teacherId || teacher.id,
          name: teacher.username || teacher.name,
          email: teacher.email,
          subject: teacher.subject || 'N/A',
          username: teacher.username || teacher.name,
          password: teacher.password || 'N/A',
          status: teacher.status || 'active',
          createdAt: teacher.createdAt || new Date().toISOString(),
          lastLogin: teacher.lastLogin,
          loginAttempts: teacher.loginAttempts || 0
        }));
        
        // Remove duplicates based on teacherId
        const uniqueTeachers = mappedTeachers.filter((teacher: any, index: number, self: any[]) => 
          index === self.findIndex((t: any) => t.teacherId === teacher.teacherId)
        );
        
        setTeachers(uniqueTeachers);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading teacher IDs:', error);
        setTeachers([]);
        setIsLoading(false);
      }
    };

    loadTeacherIDs();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'royal-academy-auth-teachers') {
        loadTeacherIDs();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.teacherId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetPassword = (teacherId: string) => {
    const newPassword = generatePassword();
    
    try {
      // Update auth teachers
      const authTeachers = JSON.parse(localStorage.getItem('royal-academy-auth-teachers') || '[]');
      const updatedAuthTeachers = authTeachers.map((teacher: any) => 
        (teacher.id === teacherId || teacher.teacherId === teacherId) 
          ? { ...teacher, password: newPassword, loginAttempts: 0 }
          : teacher
      );
      localStorage.setItem('royal-academy-auth-teachers', JSON.stringify(updatedAuthTeachers));
      
      // Update local state
      setTeachers(prev => prev.map(teacher => 
        teacher.id === teacherId 
          ? { ...teacher, password: newPassword, loginAttempts: 0 }
          : teacher
      ));
      
      toast.success(`Password reset successfully! New password: ${newPassword}`);
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Failed to reset password');
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const toggleStatus = (teacherId: string) => {
    try {
      const teacher = teachers.find(t => t.id === teacherId);
      const newStatus = teacher?.status === 'banned' ? 'active' : 'banned';
      
      // Update auth teachers
      const authTeachers = JSON.parse(localStorage.getItem('royal-academy-auth-teachers') || '[]');
      const updatedAuthTeachers = authTeachers.map((teacher: any) => 
        (teacher.id === teacherId || teacher.teacherId === teacherId) 
          ? { ...teacher, status: newStatus }
          : teacher
      );
      localStorage.setItem('royal-academy-auth-teachers', JSON.stringify(updatedAuthTeachers));
      
      // Update teachers list
      const regularTeachers = JSON.parse(localStorage.getItem('royal-academy-teachers') || '[]');
      const updatedRegularTeachers = regularTeachers.map((teacher: any) => 
        teacher.id === teacherId ? { ...teacher, status: newStatus } : teacher
      );
      localStorage.setItem('royal-academy-teachers', JSON.stringify(updatedRegularTeachers));
      
      // Update local state
      setTeachers(prev => prev.map(teacher => 
        teacher.id === teacherId ? { ...teacher, status: newStatus } : teacher
      ));
      
      toast.success(`Teacher ${newStatus === 'banned' ? 'banned' : 'activated'} successfully`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update teacher status');
    }
  };

  const deleteTeacherID = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (window.confirm(`Are you sure you want to delete ${teacher?.name}'s ID? This will permanently remove their login access.`)) {
      try {
        // Remove from auth teachers
        const authTeachers = JSON.parse(localStorage.getItem('royal-academy-auth-teachers') || '[]');
        const updatedAuthTeachers = authTeachers.filter((teacher: any) => 
          teacher.id !== teacherId && teacher.teacherId !== teacherId
        );
        localStorage.setItem('royal-academy-auth-teachers', JSON.stringify(updatedAuthTeachers));
        
        // Remove from teachers list
        const regularTeachers = JSON.parse(localStorage.getItem('royal-academy-teachers') || '[]');
        const updatedRegularTeachers = regularTeachers.filter((teacher: any) => teacher.id !== teacherId);
        localStorage.setItem('royal-academy-teachers', JSON.stringify(updatedRegularTeachers));
        
        // Update local state
        setTeachers(prev => prev.filter(teacher => teacher.id !== teacherId));
        
        toast.success('Teacher ID deleted successfully');
      } catch (error) {
        console.error('Error deleting teacher ID:', error);
        toast.error('Failed to delete teacher ID');
      }
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard!`);
    });
  };

  const viewCredentials = (teacher: TeacherID) => {
    setSelectedTeacher(teacher);
    setShowCredentialsModal(true);
  };

  const editTeacher = (teacher: TeacherID) => {
    setEditingTeacher(teacher);
    setShowEditModal(true);
  };

  const updateTeacher = (updatedTeacher: TeacherID) => {
    try {
      // Update auth teachers
      const authTeachers = JSON.parse(localStorage.getItem('royal-academy-auth-teachers') || '[]');
      const updatedAuthTeachers = authTeachers.map((teacher: any) => 
        (teacher.id === updatedTeacher.id || teacher.teacherId === updatedTeacher.id) 
          ? { 
              ...teacher, 
              username: updatedTeacher.name,
              name: updatedTeacher.name,
              email: updatedTeacher.email,
              subject: updatedTeacher.subject
            }
          : teacher
      );
      localStorage.setItem('royal-academy-auth-teachers', JSON.stringify(updatedAuthTeachers));
      
      // Update teachers list
      const regularTeachers = JSON.parse(localStorage.getItem('royal-academy-teachers') || '[]');
      const updatedRegularTeachers = regularTeachers.map((teacher: any) => 
        teacher.id === updatedTeacher.id 
          ? { 
              ...teacher, 
              name: updatedTeacher.name,
              email: updatedTeacher.email,
              subject: updatedTeacher.subject
            }
          : teacher
      );
      localStorage.setItem('royal-academy-teachers', JSON.stringify(updatedRegularTeachers));
      
      // Update local state
      setTeachers(prev => prev.map(teacher => 
        teacher.id === updatedTeacher.id ? updatedTeacher : teacher
      ));
      
      setShowEditModal(false);
      setEditingTeacher(null);
      toast.success('Teacher information updated successfully');
    } catch (error) {
      console.error('Error updating teacher:', error);
      toast.error('Failed to update teacher information');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'banned':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'suspended':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal via-royal/90 to-gold/20 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/principal-dashboard')}
              className="rounded-full text-white hover:bg-white/10"
              title="Go Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Manage Teacher IDs</h1>
              <p className="text-white/80">Manage teacher login credentials and access control</p>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/create-teacher-id')} 
            variant="outline"
            className="gap-2 text-white border-white/20 hover:bg-white/10"
          >
            <Plus className="h-4 w-4" />
            Go to Create Teacher ID
          </Button>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card/95 backdrop-blur-md border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Teacher IDs</CardTitle>
                <Key className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teachers.length}</div>
                <p className="text-xs text-muted-foreground">Total registered IDs</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card/95 backdrop-blur-md border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active IDs</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teachers.filter(t => t.status === 'active').length}</div>
                <p className="text-xs text-muted-foreground">Can login</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card/95 backdrop-blur-md border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Banned IDs</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teachers.filter(t => t.status === 'banned').length}</div>
                <p className="text-xs text-muted-foreground">Access blocked</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-card/95 backdrop-blur-md border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Login Issues</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teachers.filter(t => t.loginAttempts > 3).length}</div>
                <p className="text-xs text-muted-foreground">Failed attempts</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Teacher IDs Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-card/95 backdrop-blur-md border-border/50">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Teacher Login IDs</CardTitle>
                  <CardDescription>Manage teacher authentication credentials and access</CardDescription>
                </div>
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by name, email, or ID..."
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
                        <TableHead>Teacher ID</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Login Attempts</TableHead>
                        <TableHead>Created</TableHead>
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
                                  <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{teacher.name}</div>
                                  <div className="text-sm text-muted-foreground">{teacher.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <code className="text-sm bg-muted px-2 py-1 rounded">{teacher.teacherId}</code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(teacher.teacherId, 'Teacher ID')}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>{teacher.subject}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(teacher.status)}
                                <Badge variant={
                                  teacher.status === 'banned' ? 'destructive' : 
                                  teacher.status === 'suspended' ? 'secondary' : 
                                  'default'
                                }>
                                  {teacher.status === 'banned' ? 'Banned' : 
                                   teacher.status === 'suspended' ? 'Suspended' : 
                                   'Active'}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className={`text-sm ${teacher.loginAttempts > 3 ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                                  {teacher.loginAttempts}
                                </span>
                                {teacher.loginAttempts > 3 && (
                                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{new Date(teacher.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => viewCredentials(teacher)}
                                  title="View Credentials"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => editTeacher(teacher)}
                                  title="Edit Teacher Info"
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => resetPassword(teacher.id)}
                                  title="Reset Password"
                                  className="text-purple-600 hover:text-purple-700"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => toggleStatus(teacher.id)}
                                  title={teacher.status === 'banned' ? 'Activate' : 'Ban'}
                                  className={teacher.status === 'banned' ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'}
                                >
                                  <Ban className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteTeacherID(teacher.id)}
                                  title="Delete ID"
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            No teacher IDs found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Credentials Modal */}
        {showCredentialsModal && selectedTeacher && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCredentialsModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-2xl shadow-2xl border border-border/50 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <h2 className="text-xl font-bold">Login Credentials</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCredentialsModal(false)}
                  className="rounded-full"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="text-center mb-6">
                  <Avatar className="h-16 w-16 mx-auto mb-3">
                    <AvatarFallback className="text-lg">
                      {selectedTeacher.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-bold">{selectedTeacher.name}</h3>
                  <p className="text-muted-foreground">{selectedTeacher.subject}</p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-medium">Teacher ID</label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(selectedTeacher.teacherId, 'Teacher ID')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <code className="text-sm">{selectedTeacher.teacherId}</code>
                  </div>

                  <div className="p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-medium">Username</label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(selectedTeacher.username, 'Username')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <code className="text-sm">{selectedTeacher.username}</code>
                  </div>

                  <div className="p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-medium">Password</label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(selectedTeacher.password, 'Password')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <code className="text-sm">{selectedTeacher.password}</code>
                  </div>

                  <div className="p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-medium">Email</label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(selectedTeacher.email, 'Email')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <code className="text-sm">{selectedTeacher.email}</code>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      resetPassword(selectedTeacher.id);
                      setShowCredentialsModal(false);
                    }}
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset Password
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toggleStatus(selectedTeacher.id);
                      setShowCredentialsModal(false);
                    }}
                    className={selectedTeacher.status === 'banned' ? 'text-green-600' : 'text-red-600'}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    {selectedTeacher.status === 'banned' ? 'Activate' : 'Ban'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Edit Teacher Modal */}
        {showEditModal && editingTeacher && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-2xl shadow-2xl border border-border/50 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <h2 className="text-xl font-bold">Edit Teacher Information</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowEditModal(false)}
                  className="rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-6">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  updateTeacher(editingTeacher);
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Teacher Name</label>
                      <Input
                        value={editingTeacher.name}
                        onChange={(e) => setEditingTeacher({...editingTeacher, name: e.target.value})}
                        placeholder="Full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        type="email"
                        value={editingTeacher.email}
                        onChange={(e) => setEditingTeacher({...editingTeacher, email: e.target.value})}
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Subject</label>
                      <Input
                        value={editingTeacher.subject}
                        onChange={(e) => setEditingTeacher({...editingTeacher, subject: e.target.value})}
                        placeholder="Mathematics, Physics, etc."
                        required
                      />
                    </div>
                    
                    <div className="bg-muted/20 p-3 rounded-lg">
                      <label className="text-sm font-medium text-muted-foreground">Teacher ID (Read-only)</label>
                      <p className="text-sm font-mono">{editingTeacher.teacherId}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-6">
                    <Button type="submit" className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowEditModal(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ManageTeacherID;
