import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Search, Plus, Ban, Eye, Trash2, Edit, RefreshCw, ArrowLeft, Save, X, Bus } from 'lucide-react';
import { getSupabaseData, setSupabaseData } from '@/lib/supabaseHelpers';

const BUS_KEY = 'royal-academy-auth-buses';

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

const ManageBusID: React.FC = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState<BusAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBus, setSelectedBus] = useState<BusAccount | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editing, setEditing] = useState<BusAccount | null>(null);

  const ownerEmail = (localStorage.getItem('principalEmail') || 'principal.1025@gmail.com').trim().toLowerCase();

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getSupabaseData<BusAccount[]>(BUS_KEY, []);
        const filtered = (list || []).filter((b) => (b.owner || '').toLowerCase() === ownerEmail);
        setBuses(filtered);
      } catch (e) {
        console.error(e);
        setBuses([]);
      }
      setIsLoading(false);
    };
    load();

    const onStorage = (e: StorageEvent) => {
      if (e.key === BUS_KEY) {
        load();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const filteredBuses = buses.filter((b) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      (b.username || '').toLowerCase().includes(q) ||
      (b.busId || '').toLowerCase().includes(q) ||
      (b.busNumber || '').toLowerCase().includes(q) ||
      (b.routeName || '').toLowerCase().includes(q)
    );
  });

  const randomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let p = '';
    for (let i = 0; i < 8; i++) p += chars.charAt(Math.floor(Math.random() * chars.length));
    return p;
  };

  const resetPassword = async (id: string) => {
    const newPass = randomPassword();
    try {
      const list = await getSupabaseData<BusAccount[]>(BUS_KEY, []);
      const updated = (list || []).map((b) => (b.id === id ? { ...b, password: newPass, loginAttempts: 0 } : b));
      await setSupabaseData(BUS_KEY, updated);
      setBuses((prev) => prev.map((b) => (b.id === id ? { ...b, password: newPass, loginAttempts: 0 } : b)));
      toast.success(`Password reset: ${newPass}`);
    } catch (e) {
      console.error(e);
      toast.error('Failed to reset password');
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      const list = await getSupabaseData<BusAccount[]>(BUS_KEY, []);
      const updated = (list || []).map((b) => (b.id === id ? { ...b, status: b.status === 'banned' ? 'active' : 'banned' } : b));
      await setSupabaseData(BUS_KEY, updated);
      setBuses((prev) => prev.map((b) => (b.id === id ? { ...b, status: b.status === 'banned' ? 'active' : 'banned' } : b)));
      toast.success('Status updated');
    } catch (e) {
      console.error(e);
      toast.error('Failed to update status');
    }
  };

  const deleteBus = async (id: string) => {
    if (!window.confirm('Delete this bus ID? This will remove its login access.')) return;
    try {
      const list = await getSupabaseData<BusAccount[]>(BUS_KEY, []);
      const updated = (list || []).filter((b) => b.id !== id);
      await setSupabaseData(BUS_KEY, updated);
      setBuses((prev) => prev.filter((b) => b.id !== id));
      toast.success('Bus ID deleted');
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete');
    }
  };

  const startEdit = (b: BusAccount) => {
    setEditing({ ...b });
    setShowEdit(true);
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      const list = await getSupabaseData<BusAccount[]>(BUS_KEY, []);
      const updated = (list || []).map((b) => (b.id === editing.id ? { ...editing } : b));
      await setSupabaseData(BUS_KEY, updated);
      setBuses((prev) => prev.map((b) => (b.id === editing.id ? { ...editing } : b)));
      setShowEdit(false);
      setEditing(null);
      toast.success('Bus details updated');
    } catch (e) {
      console.error(e);
      toast.error('Failed to update');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal via-royal/90 to-gold/20 p-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/principal-dashboard')} className="rounded-full text-white hover:bg-white/10" title="Go Back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Manage Bus IDs</h1>
              <p className="text-white/80">Edit, ban/unban, or delete bus tracker accounts</p>
            </div>
          </div>
          <Button onClick={() => navigate('/create-bus-id')} variant="outline" className="gap-2 text-white border-white/20 hover:bg-white/10">
            <Plus className="h-4 w-4" />
            Go to Create Bus ID
          </Button>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card className="bg-card/95 backdrop-blur-md border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bus IDs</CardTitle>
              <Bus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{buses.length}</div>
              <p className="text-xs text-muted-foreground">Total registered IDs</p>
            </CardContent>
          </Card>
          <Card className="bg-card/95 backdrop-blur-md border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Badge>ON</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{buses.filter((b) => b.status === 'active').length}</div>
              <p className="text-xs text-muted-foreground">Can login</p>
            </CardContent>
          </Card>
          <Card className="bg-card/95 backdrop-blur-md border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Banned</CardTitle>
              <Badge variant="destructive">OFF</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{buses.filter((b) => b.status === 'banned').length}</div>
              <p className="text-xs text-muted-foreground">Access blocked</p>
            </CardContent>
          </Card>
          <Card className="bg-card/95 backdrop-blur-md border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Search</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search by user, ID, route..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-card/95 backdrop-blur-md border-border/50">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Bus Login IDs</CardTitle>
                  <CardDescription>Manage bus tracker authentication and access</CardDescription>
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
                        <TableHead>Account</TableHead>
                        <TableHead>Bus ID</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBuses.length > 0 ? (
                        filteredBuses.map((b) => (
                          <TableRow key={b.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                  <AvatarFallback>{(b.username || 'B')[0]?.toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{b.username}</div>
                                  <div className="text-sm text-muted-foreground">{b.busNumber || 'N/A'}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="text-sm bg-muted px-2 py-1 rounded">{b.busId}</code>
                            </TableCell>
                            <TableCell>{b.routeName || 'N/A'}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge variant={b.status === 'banned' ? 'destructive' : 'default'}>
                                  {b.status === 'banned' ? 'Banned' : 'Active'}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>{new Date(b.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="icon" onClick={() => startEdit(b)} title="Edit">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => resetPassword(b.id)} title="Reset Password" className="text-purple-600 hover:text-purple-700">
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => toggleStatus(b.id)} title={b.status === 'banned' ? 'Activate' : 'Ban'} className={b.status === 'banned' ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'}>
                                  <Ban className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => deleteBus(b.id)} title="Delete" className="text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">No bus IDs found.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {showEdit && editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowEdit(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-card rounded-2xl shadow-2xl border border-border/50 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <h2 className="text-xl font-bold">Edit Bus Account</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowEdit(false)} className="rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-6">
                <form onSubmit={(e) => { e.preventDefault(); saveEdit(); }}>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Username</label>
                      <Input value={editing.username} onChange={(e) => setEditing({ ...editing, username: e.target.value })} placeholder="tracker.username" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Route Name</label>
                      <Input value={editing.routeName || ''} onChange={(e) => setEditing({ ...editing, routeName: e.target.value })} placeholder="Route" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Bus Number</label>
                      <Input value={editing.busNumber || ''} onChange={(e) => setEditing({ ...editing, busNumber: e.target.value })} placeholder="RJ14-1234" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Driver Name</label>
                      <Input value={editing.driverName || ''} onChange={(e) => setEditing({ ...editing, driverName: e.target.value })} placeholder="Name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Driver Phone</label>
                      <Input value={editing.driverPhone || ''} onChange={(e) => setEditing({ ...editing, driverPhone: e.target.value })} placeholder="+91-..." />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <Button type="submit" className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowEdit(false)}>Cancel</Button>
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

export default ManageBusID;
