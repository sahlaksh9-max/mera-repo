import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Bus, Eye, EyeOff } from 'lucide-react';
import { getSupabaseData, setSupabaseData } from '@/lib/supabaseHelpers';

interface BusUser {
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
}

const BUS_KEY = 'royal-academy-auth-buses';

const BusLogin: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const accounts = await getSupabaseData<BusUser[]>(BUS_KEY, []);
      const user = (accounts || []).find(
        (a) => (a.username || '').trim().toLowerCase() === username.trim().toLowerCase()
      );

      if (!user) {
        setError('Invalid username or password.');
        setIsLoading(false);
        return;
      }

      if (user.status === 'banned' || user.status === 'suspended') {
        setError('Your account is not active. Contact the Principal.');
        setIsLoading(false);
        return;
      }

      if ((user.password || '') !== password) {
        const updated = (accounts || []).map((a) =>
          a.id === user.id ? { ...a, loginAttempts: (a.loginAttempts || 0) + 1 } : a
        );
        await setSupabaseData(BUS_KEY, updated);
        setError('Invalid username or password.');
        setIsLoading(false);
        return;
      }

      // Success
      localStorage.setItem('busAuth', 'true');
      localStorage.setItem('busUsername', user.username);
      localStorage.setItem('busId', user.busId);
      localStorage.setItem('busUserId', user.id);

      const updated = (accounts || []).map((a) =>
        a.id === user.id
          ? { ...a, lastLogin: new Date().toISOString(), loginAttempts: 0 }
          : a
      );
      await setSupabaseData(BUS_KEY, updated);

      navigate('/bus-dashboard', { replace: true });
    } catch (err) {
      setError('Login failed. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal via-royal/90 to-gold/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-card/95 backdrop-blur-md rounded-2xl shadow-2xl border border-border/50 p-6 sm:p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-royal to-gold flex items-center justify-center"
            >
              <Bus className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Bus Tracker Login</h1>
            <p className="text-muted-foreground text-sm">Enter your credentials to continue</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-foreground">
                Username
              </label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-12 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-12 bg-gradient-to-r from-royal to-gold text-white">
              {isLoading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default BusLogin;
