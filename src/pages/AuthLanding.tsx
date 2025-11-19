import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Users, GraduationCap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const AuthLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-2 sm:p-6 relative overflow-hidden">
      {/* Neon Background Effects - Gold and Sky Blue */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-full h-full bg-amber-300/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl mx-auto relative z-10"
      >
        <div className="bg-card/95 backdrop-blur-md rounded-2xl border border-gold/30 shadow-xl p-3 sm:p-8 relative overflow-hidden">
          {/* Neon Border Glow */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
            background: 'linear-gradient(45deg, transparent, rgba(255, 193, 7, 0.1), rgba(34, 211, 238, 0.1), transparent)',
            animation: 'shimmer 3s infinite'
          }}></div>

          <div className="flex items-center justify-between mb-4 sm:mb-8 relative z-10">
            <div>
              <h1 className="text-lg sm:text-2xl font-heading font-bold text-white">Welcome</h1>
              <p className="text-xs sm:text-base text-cyan-300/80">Choose how you want to sign in</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-cyan-300/80 hover:text-gold hover:bg-gold/10 h-8 w-8 sm:h-auto sm:w-auto p-1 sm:p-2 transition-all"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 relative z-10">
            <Link to="/teacher" className="group">
              <div className="p-3 sm:p-6 rounded-xl border border-gold/50 bg-gradient-to-br from-gold/10 to-amber-500/10 hover:from-gold/20 hover:to-amber-500/20 transition-all duration-300 h-full hover:border-gold/80 hover:shadow-lg hover:shadow-gold/20">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r from-gold to-amber-400 flex items-center justify-center mb-2 sm:mb-4 shadow-lg shadow-gold/50 group-hover:shadow-gold/70 transition-all">
                  <Users className="h-4 w-4 sm:h-6 sm:w-6 text-black" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-white mb-1">Sign in with Teacher ID</h2>
                <p className="text-xs sm:text-sm text-cyan-300/80 leading-relaxed">
                  Enter your teacher username and teacher ID provided by the Principal to access your dashboard.
                </p>
                <div className="mt-3 sm:mt-4">
                  <Button className="w-full bg-gradient-to-r from-gold to-amber-400 text-black font-semibold h-9 sm:h-10 text-sm shadow-lg shadow-gold/50 hover:shadow-gold/70 transition-all">
                    Continue
                  </Button>
                </div>
              </div>
            </Link>

            <Link to="/student-login" className="group">
              <div className="p-3 sm:p-6 rounded-xl border border-cyan-400/50 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 hover:from-cyan-400/20 hover:to-blue-500/20 transition-all duration-300 h-full hover:border-cyan-400/80 hover:shadow-lg hover:shadow-cyan-400/20">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center justify-center mb-2 sm:mb-4 shadow-lg shadow-cyan-400/50 group-hover:shadow-cyan-400/70 transition-all">
                  <GraduationCap className="h-4 w-4 sm:h-6 sm:w-6 text-black" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-white mb-1">Sign in with Student ID</h2>
                <p className="text-xs sm:text-sm text-cyan-300/80 leading-relaxed">
                  Enter your student username and student ID created by your teacher to access your portal.
                </p>
                <div className="mt-3 sm:mt-4">
                  <Button className="w-full bg-gradient-to-r from-cyan-400 to-blue-400 text-black font-semibold h-9 sm:h-10 text-sm shadow-lg shadow-cyan-400/50 hover:shadow-cyan-400/70 transition-all">
                    Continue
                  </Button>
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-4 sm:mt-6 text-center text-xs text-cyan-300/80 relative z-10">
            For assistance, contact your Teacher or the Principal.
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AuthLanding;