import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PrincipalLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Corrected password to match original and applied intended persistence logic
    if (email === "principal.1025@gmail.com" && password === "principal.1025") {
      localStorage.setItem("principalAuth", "true");
      localStorage.setItem("principalEmail", email);
      console.log('[PrincipalLogin] Login successful, auth set');
      navigate("/principal-dashboard", { replace: true });
    } else {
      setError("Invalid email or password. Please try again.");
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
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-royal to-gold flex items-center justify-center"
            >
              <Shield className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
              Principal Access
            </h1>
            <p className="text-muted-foreground text-sm">
              Secure login for administrative access
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-8 sm:space-y-6">
            <div className="space-y-3 sm:space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="principal.1025@gmail.com"
                className="h-12"
                required
              />
            </div>

            <div className="space-y-3 sm:space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="h-12"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-royal to-gold hover:from-royal/80 hover:to-gold/80 text-white font-medium"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 p-4 rounded-lg bg-muted/20 border border-border/30">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-foreground mb-1">
                  Security Notice
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This is a secure administrative area. All access attempts are logged and monitored.
                  Only authorized personnel should access this system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PrincipalLogin;