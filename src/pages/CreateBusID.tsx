import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Bus, UserPlus, Eye, EyeOff, Copy, RefreshCw, Save, ArrowLeft, Phone, Hash } from 'lucide-react';
import { getSupabaseData, setSupabaseData } from '@/lib/supabaseHelpers';

const BUS_KEY = 'royal-academy-auth-buses';

interface BusFormData {
  username: string;
  password: string;
  routeName: string;
  busNumber: string;
  driverName: string;
  driverPhone: string;
}

interface BusAccount {
  id: string;
  busId: string;
  username: string;
  password: string;
  status: 'active' | 'banned' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  loginAttempts?: number;
  routeName?: string;
  busNumber?: string;
  driverName?: string;
  driverPhone?: string;
  owner?: string;
}

const CreateBusID: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [generated, setGenerated] = useState<{ busId: string } | null>(null);
  const [form, setForm] = useState<BusFormData>({
    username: '',
    password: '',
    routeName: '',
    busNumber: '',
    driverName: '',
    driverPhone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const generateBusId = () => {
    const ts = Date.now().toString().slice(-6);
    const rnd = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const id = `BUS${ts}${rnd}`;
    setGenerated({ busId: id });
    toast.success('Bus ID generated successfully');
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success(`${label} copied`));
  };

  const save = async () => {
    if (!generated?.busId) {
      toast.error('Please generate a Bus ID first');
      return;
    }
    if (!form.username || !form.password) {
      toast.error('Username and Password are required');
      return;
    }

    setIsLoading(true);
    try {
      const ownerEmail = (localStorage.getItem('principalEmail') || 'principal.1025@gmail.com').trim().toLowerCase();
      const list = await getSupabaseData<BusAccount[]>(BUS_KEY, []);
      const myList = (list || []).filter((b) => (b.owner || '').toLowerCase() === ownerEmail);
      const exists = myList.some(
        (b) => b.busId === generated.busId || (b.username || '').toLowerCase() === form.username.toLowerCase()
      );
      if (exists) {
        toast.error('A bus with this ID or username already exists');
        setIsLoading(false);
        return;
      }

      const acct: BusAccount = {
        id: generated.busId,
        busId: generated.busId,
        username: form.username,
        password: form.password,
        status: 'active',
        createdAt: new Date().toISOString(),
        routeName: form.routeName,
        busNumber: form.busNumber,
        driverName: form.driverName,
        driverPhone: form.driverPhone,
        owner: ownerEmail,
      };

      await setSupabaseData(BUS_KEY, [...(list || []), acct]);
      setIsCreated(true);
      toast.success('Bus tracking ID created');
    } catch (e) {
      console.error(e);
      toast.error('Failed to create bus ID');
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setForm({ username: '', password: '', routeName: '', busNumber: '', driverName: '', driverPhone: '' });
    setGenerated(null);
    setIsCreated(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal via-royal/90 to-gold/20 p-2 sm:p-3 md:p-4">
      <div className="w-full max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Button variant="ghost" size="icon" onClick={() => navigate('/principal-dashboard')} className="rounded-full h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0">
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">Create Bus Tracking ID</h1>
              <p className="text-xs sm:text-sm text-white/80 truncate">Generate login for bus tracker</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs sm:text-sm whitespace-nowrap">
            <Bus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            New Bus
          </Badge>
        </motion.div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-card/95 backdrop-blur-md border-border/50">
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  Bus Account
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Fill details and generate credentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0 sm:pt-0">
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-medium">Username *</label>
                  <Input name="username" value={form.username} onChange={handleChange} placeholder="tracker.username" disabled={isCreated} className="text-xs sm:text-sm h-8 sm:h-9" />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-medium">Password *</label>
                  <div className="relative">
                    <Input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Strong password" className="pr-10 text-xs sm:text-sm h-8 sm:h-9" disabled={isCreated} />
                    <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2">
                      {showPassword ? <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-medium">Route Name</label>
                    <Input name="routeName" value={form.routeName} onChange={handleChange} placeholder="Route A / Downtown" disabled={isCreated} className="text-xs sm:text-sm h-8 sm:h-9" />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-medium">Bus Number</label>
                    <div className="relative">
                      <Hash className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                      <Input name="busNumber" value={form.busNumber} onChange={handleChange} placeholder="e.g. RJ14-1234" className="pl-8 text-xs sm:text-sm h-8 sm:h-9" disabled={isCreated} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-medium">Driver Name</label>
                    <Input name="driverName" value={form.driverName} onChange={handleChange} placeholder="Name" disabled={isCreated} className="text-xs sm:text-sm h-8 sm:h-9" />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-medium">Driver Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                      <Input name="driverPhone" value={form.driverPhone} onChange={handleChange} placeholder="+91-..." className="pl-8 text-xs sm:text-sm h-8 sm:h-9" disabled={isCreated} />
                    </div>
                  </div>
                </div>

                {!isCreated && (
                  <div className="flex flex-col sm:flex-row gap-2 pt-1 sm:pt-2">
                    <Button onClick={generateBusId} className="flex-1 text-xs sm:text-sm h-8 sm:h-9"><RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />Generate Bus ID</Button>
                    <Button onClick={save} disabled={!form.username || !form.password || !generated || isLoading} className="flex-1 text-xs sm:text-sm h-8 sm:h-9">
                      {isLoading ? <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" /> : <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />}
                      Create Account
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-card/95 backdrop-blur-md border-border/50">
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg"><Bus className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />Generated Credentials</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Share with the assigned tracker</CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                {generated ? (
                  <div className="space-y-2 sm:space-y-4">
                    <div className="p-2.5 sm:p-4 bg-muted/20 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs sm:text-sm font-medium">Bus ID</label>
                        <Button variant="ghost" size="sm" onClick={() => copy(generated.busId, 'Bus ID')} className="h-6 w-6 sm:h-8 sm:w-8 p-0"><Copy className="h-3 w-3 sm:h-4 sm:w-4" /></Button>
                      </div>
                      <p className="font-mono text-sm sm:text-lg font-bold text-primary break-all">{generated.busId}</p>
                    </div>
                    <div className="p-2.5 sm:p-4 bg-muted/20 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs sm:text-sm font-medium">Username</label>
                        <Button variant="ghost" size="sm" onClick={() => copy(form.username, 'Username')} className="h-6 w-6 sm:h-8 sm:w-8 p-0"><Copy className="h-3 w-3 sm:h-4 sm:w-4" /></Button>
                      </div>
                      <p className="font-mono text-sm sm:text-lg break-all">{form.username || '—'}</p>
                    </div>
                    <div className="p-2.5 sm:p-4 bg-muted/20 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs sm:text-sm font-medium">Password</label>
                        <Button variant="ghost" size="sm" onClick={() => copy(form.password, 'Password')} className="h-6 w-6 sm:h-8 sm:w-8 p-0"><Copy className="h-3 w-3 sm:h-4 sm:w-4" /></Button>
                      </div>
                      <p className="font-mono text-sm sm:text-lg">{form.password ? '••••••••' : '—'}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 pt-1 sm:pt-2">
                      {!isCreated ? (
                        <Button variant="outline" onClick={resetForm} className="w-full text-xs sm:text-sm h-8 sm:h-9">Reset</Button>
                      ) : (
                        <>
                          <Button onClick={() => navigate('/manage-bus-id')} className="flex-1 text-xs sm:text-sm h-8 sm:h-9">Manage Bus IDs</Button>
                          <Button variant="outline" onClick={resetForm} className="flex-1 text-xs sm:text-sm h-8 sm:h-9">Create Another</Button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12 text-muted-foreground">
                    <UserPlus className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4 opacity-50" />
                    <p className="text-xs sm:text-sm">Fill in the details and generate credentials to see them here</p>
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

export default CreateBusID;
