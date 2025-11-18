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
    <div className="min-h-screen bg-gradient-to-br from-royal via-royal/90 to-gold/20 p-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/principal-dashboard')} className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Create Bus Tracking ID</h1>
              <p className="text-white/80">Generate login for bus tracker</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
            <Bus className="h-4 w-4 mr-2" />
            New Bus
          </Badge>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-card/95 backdrop-blur-md border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Bus Account
                </CardTitle>
                <CardDescription>Fill details and generate credentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username *</label>
                  <Input name="username" value={form.username} onChange={handleChange} placeholder="tracker.username" disabled={isCreated} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password *</label>
                  <div className="relative">
                    <Input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Strong password" className="pr-10" disabled={isCreated} />
                    <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Route Name</label>
                    <Input name="routeName" value={form.routeName} onChange={handleChange} placeholder="Route A / Downtown" disabled={isCreated} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bus Number</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input name="busNumber" value={form.busNumber} onChange={handleChange} placeholder="e.g. RJ14-1234" className="pl-10" disabled={isCreated} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Driver Name</label>
                    <Input name="driverName" value={form.driverName} onChange={handleChange} placeholder="Name" disabled={isCreated} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Driver Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input name="driverPhone" value={form.driverPhone} onChange={handleChange} placeholder="+91-..." className="pl-10" disabled={isCreated} />
                    </div>
                  </div>
                </div>

                {!isCreated && (
                  <div className="flex gap-2 pt-2">
                    <Button onClick={generateBusId} className="flex-1"><RefreshCw className="h-4 w-4 mr-2" />Generate Bus ID</Button>
                    <Button onClick={save} disabled={!form.username || !form.password || !generated || isLoading} className="flex-1">
                      {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                      Create Account
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-card/95 backdrop-blur-md border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bus className="h-5 w-5" />Generated Credentials</CardTitle>
                <CardDescription>Share with the assigned tracker</CardDescription>
              </CardHeader>
              <CardContent>
                {generated ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/20 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-sm font-medium">Bus ID</label>
                        <Button variant="ghost" size="sm" onClick={() => copy(generated.busId, 'Bus ID')}><Copy className="h-4 w-4" /></Button>
                      </div>
                      <p className="font-mono text-lg font-bold text-primary">{generated.busId}</p>
                    </div>
                    <div className="p-4 bg-muted/20 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-sm font-medium">Username</label>
                        <Button variant="ghost" size="sm" onClick={() => copy(form.username, 'Username')}><Copy className="h-4 w-4" /></Button>
                      </div>
                      <p className="font-mono text-lg">{form.username || '—'}</p>
                    </div>
                    <div className="p-4 bg-muted/20 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-sm font-medium">Password</label>
                        <Button variant="ghost" size="sm" onClick={() => copy(form.password, 'Password')}><Copy className="h-4 w-4" /></Button>
                      </div>
                      <p className="font-mono text-lg">{form.password ? '••••••••' : '—'}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      {!isCreated ? (
                        <Button variant="outline" onClick={resetForm}>Reset</Button>
                      ) : (
                        <>
                          <Button onClick={() => navigate('/manage-bus-id')} className="flex-1">Manage Bus IDs</Button>
                          <Button variant="outline" onClick={resetForm}>Create Another</Button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Fill in the details and generate credentials to see them here</p>
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
