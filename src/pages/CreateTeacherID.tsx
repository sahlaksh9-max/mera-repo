import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Eye, 
  EyeOff, 
  Copy, 
  RefreshCw, 
  Save, 
  ArrowLeft,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Users,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface TeacherFormData {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  assignedClass: string;
  assignedSection: string;
  qualification: string;
}

interface GeneratedCredentials {
  teacherId: string;
  username: string;
  password: string;
  email: string;
}

const CreateTeacherID: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<TeacherFormData>({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    assignedClass: '',
    assignedSection: '',
    qualification: ''
  });
  const [generatedCredentials, setGeneratedCredentials] = useState<GeneratedCredentials | null>(null);
  const [isCreated, setIsCreated] = useState(false);

  const generateTeacherId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TCH${timestamp}${randomNum}`;
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateCredentials = () => {
    if (!formData.fullName || !formData.email || !formData.subject) {
      toast.error('Please fill in required fields (Name, Email, Subject)');
      return;
    }

    const credentials: GeneratedCredentials = {
      teacherId: generateTeacherId(),
      username: formData.fullName,
      password: generatePassword(),
      email: formData.email
    };

    setGeneratedCredentials(credentials);
    toast.success('Teacher credentials generated successfully!');
  };

  const regeneratePassword = () => {
    if (generatedCredentials) {
      setGeneratedCredentials({
        ...generatedCredentials,
        password: generatePassword()
      });
      toast.success('New password generated!');
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard!`);
    });
  };

  const saveTeacher = async () => {
    if (!generatedCredentials) {
      toast.error('Please generate credentials first');
      return;
    }

    setIsLoading(true);

    try {
      const newTeacher = {
        id: generatedCredentials.teacherId,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone || 'N/A',
        subject: formData.subject,
        assignedClass: formData.assignedClass || 'N/A',
        assignedSection: formData.assignedSection || 'N/A',
        qualification: formData.qualification || 'N/A',
        status: 'active',
        createdAt: new Date().toISOString(),
        teacherId: generatedCredentials.teacherId
      };

      // Save to teachers list - check for duplicates
      const existingTeachers = JSON.parse(localStorage.getItem('royal-academy-teachers') || '[]');
      const teacherExists = existingTeachers.some((t: any) => t.id === newTeacher.id || t.teacherId === newTeacher.teacherId);
      
      if (!teacherExists) {
        localStorage.setItem('royal-academy-teachers', JSON.stringify([...existingTeachers, newTeacher]));
      }

      // Save to auth teachers - check for duplicates
      const authTeacher = {
        ...newTeacher,
        username: generatedCredentials.username,
        password: generatedCredentials.password,
        type: 'teacher'
      };
      const existingAuthTeachers = JSON.parse(localStorage.getItem('royal-academy-auth-teachers') || '[]');
      const authTeacherExists = existingAuthTeachers.some((t: any) => t.id === authTeacher.id || t.teacherId === authTeacher.teacherId);
      
      if (!authTeacherExists) {
        localStorage.setItem('royal-academy-auth-teachers', JSON.stringify([...existingAuthTeachers, authTeacher]));
      }

      setIsCreated(true);
      toast.success('Teacher account created successfully!');
    } catch (error) {
      console.error('Error creating teacher:', error);
      toast.error('Failed to create teacher account');
    }

    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      assignedClass: '',
      assignedSection: '',
      qualification: ''
    });
    setGeneratedCredentials(null);
    setIsCreated(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal via-royal/90 to-gold/20 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/principal-dashboard')}
              className="rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Create New Teacher ID</h1>
              <p className="text-white/80">Generate teacher login credentials and create account</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
            <UserPlus className="h-4 w-4 mr-2" />
            New Teacher
          </Badge>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Teacher Information Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card/95 backdrop-blur-md border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Teacher Information
                </CardTitle>
                <CardDescription>
                  Fill in the teacher's details to generate login credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name *</label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter teacher's full name"
                    disabled={isCreated}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="teacher@example.com"
                      className="pl-10"
                      disabled={isCreated}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className="pl-10"
                      disabled={isCreated}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject *</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Mathematics, Physics, English, etc."
                      className="pl-10"
                      disabled={isCreated}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Assigned Class</label>
                    <Input
                      name="assignedClass"
                      value={formData.assignedClass}
                      onChange={handleInputChange}
                      placeholder="Grade 10, 11, 12"
                      disabled={isCreated}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Section</label>
                    <Input
                      name="assignedSection"
                      value={formData.assignedSection}
                      onChange={handleInputChange}
                      placeholder="A, B, C"
                      disabled={isCreated}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Qualification</label>
                  <Input
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    placeholder="B.Ed, M.Sc, Ph.D, etc."
                    disabled={isCreated}
                  />
                </div>

                {!isCreated && (
                  <Button
                    onClick={generateCredentials}
                    className="w-full mt-6"
                    disabled={!formData.fullName || !formData.email || !formData.subject}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate Login Credentials
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Generated Credentials */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card/95 backdrop-blur-md border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Generated Credentials
                  {isCreated && <CheckCircle className="h-5 w-5 text-green-500" />}
                </CardTitle>
                <CardDescription>
                  {generatedCredentials 
                    ? 'Teacher login credentials generated successfully'
                    : 'Fill the form and generate credentials'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedCredentials ? (
                  <div className="space-y-4">
                    {/* Teacher ID */}
                    <div className="p-4 bg-muted/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Teacher ID</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(generatedCredentials.teacherId, 'Teacher ID')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="font-mono text-lg font-bold text-primary">
                        {generatedCredentials.teacherId}
                      </p>
                    </div>

                    {/* Username */}
                    <div className="p-4 bg-muted/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Username</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(generatedCredentials.username, 'Username')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="font-mono text-lg">
                        {generatedCredentials.username}
                      </p>
                    </div>

                    {/* Password */}
                    <div className="p-4 bg-muted/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Password</label>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(generatedCredentials.password, 'Password')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          {!isCreated && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={regeneratePassword}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="font-mono text-lg">
                        {showPassword ? generatedCredentials.password : '••••••••'}
                      </p>
                    </div>

                    {/* Email */}
                    <div className="p-4 bg-muted/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Email</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(generatedCredentials.email, 'Email')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="font-mono text-lg">
                        {generatedCredentials.email}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4">
                      {!isCreated ? (
                        <>
                          <Button
                            onClick={saveTeacher}
                            disabled={isLoading}
                            className="flex-1"
                          >
                            {isLoading ? (
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4 mr-2" />
                            )}
                            Create Teacher Account
                          </Button>
                          <Button
                            variant="outline"
                            onClick={resetForm}
                          >
                            Reset
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => navigate('/manage-teacher-id')}
                            className="flex-1"
                          >
                            Manage Teacher IDs
                          </Button>
                          <Button
                            variant="outline"
                            onClick={resetForm}
                          >
                            Create Another
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Fill in the teacher information and generate credentials to see them here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreateTeacherID;
