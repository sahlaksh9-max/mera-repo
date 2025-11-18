import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  authKey?: string; // The localStorage key to check for authentication
  redirectTo?: string; // Where to redirect if not authenticated
  requiredRole?: 'student' | 'teacher' | 'principal' | 'bus'; // Role-based access
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  authKey, 
  redirectTo,
  requiredRole
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const checkAuth = () => {
      // Role-based authentication
      if (requiredRole) {
        if (requiredRole === 'student') {
          const studentAuth = localStorage.getItem('studentAuth');
          setIsAuthenticated(studentAuth === "true");
        } else if (requiredRole === 'teacher') {
          const teacherAuth = localStorage.getItem('teacherAuth');
          setIsAuthenticated(teacherAuth === "true");
        } else if (requiredRole === 'principal') {
          const principalAuth = localStorage.getItem('principalAuth');
          setIsAuthenticated(principalAuth === "true");
        } else if (requiredRole === 'bus') {
          const busAuth = localStorage.getItem('busAuth');
          const busUserId = localStorage.getItem('busUserId');
          // Strict: must have auth flag and a concrete user id
          const valid = busAuth === 'true' && !!busUserId;
          setIsAuthenticated(valid);
        }
      } 
      // Legacy authKey-based authentication
      else if (authKey) {
        const authStatus = localStorage.getItem(authKey);
        setIsAuthenticated(authStatus === "true");
      }
    };

    checkAuth();

    // Listen for storage changes (in case user logs out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (authKey && e.key === authKey) {
        checkAuth();
      } else if (requiredRole && (
        e.key === 'studentAuth' || 
        e.key === 'teacherAuth' || 
        e.key === 'principalAuth' ||
        e.key === 'busAuth' ||
        e.key === 'busUserId'
      )) {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [authKey, requiredRole]);

  // Retry authentication check if it failed initially (handles temporary issues)
  useEffect(() => {
    if (isAuthenticated === false && retryCount < 3) {
      const retryTimer = setTimeout(() => {
        const authStatus = localStorage.getItem(authKey);
        if (authStatus === "true") {
          setIsAuthenticated(true);
        } else {
          setRetryCount(prev => prev + 1);
        }
      }, 500);
      
      return () => clearTimeout(retryTimer);
    }
  }, [isAuthenticated, retryCount, authKey]);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    // Determine redirect path based on role
    let redirectPath = redirectTo;
    if (!redirectPath && requiredRole) {
      if (requiredRole === 'student') redirectPath = '/student-login';
      else if (requiredRole === 'teacher') redirectPath = '/teacher';
      else if (requiredRole === 'principal') redirectPath = '/principal';
      else if (requiredRole === 'bus') redirectPath = '/buses';
    }
    return <Navigate to={redirectPath || '/'} replace />;
  }

  // Render protected content if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;