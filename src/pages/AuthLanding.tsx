import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Users, GraduationCap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const AuthLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-2 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl mx-auto"
      >
        <div className="bg-card/95 backdrop-blur-md rounded-2xl border border-border/50 shadow-xl p-3 sm:p-8">
          <div className="flex items-center justify-between mb-4 sm:mb-8">
            <div>
              <h1 className="text-lg sm:text-2xl font-heading font-bold text-foreground">Welcome</h1>
              <p className="text-xs sm:text-base text-muted-foreground">Choose how you want to sign in</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground h-8 w-8 sm:h-auto sm:w-auto p-1 sm:p-2"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
            <Link to="/teacher" className="group">
              <div className="p-3 sm:p-6 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors h-full">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r from-gold/20 to-yellow-500/20 flex items-center justify-center mb-2 sm:mb-4">
                  <Users className="h-4 w-4 sm:h-6 sm:w-6 text-gold" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-1">Sign in with Teacher ID</h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Enter your teacher username and teacher ID provided by the Principal to access your dashboard.
                </p>
                <div className="mt-3 sm:mt-4">
                  <Button className="w-full bg-gradient-to-r from-gold to-yellow-500 text-black font-semibold h-9 sm:h-10 text-sm">
                    Continue
                  </Button>
                </div>
              </div>
            </Link>

            <Link to="/student-login" className="group">
              <div className="p-3 sm:p-6 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors h-full">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r from-royal/20 to-blue-500/20 flex items-center justify-center mb-2 sm:mb-4">
                  <GraduationCap className="h-4 w-4 sm:h-6 sm:w-6 text-royal" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-1">Sign in with Student ID</h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Enter your student username and student ID created by your teacher to access your portal.
                </p>
                <div className="mt-3 sm:mt-4">
                  <Button variant="outline" className="w-full h-9 sm:h-10 text-sm">
                    Continue
                  </Button>
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-4 sm:mt-6 text-center text-xs text-muted-foreground">
            For assistance, contact your Teacher or the Principal.
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLanding;