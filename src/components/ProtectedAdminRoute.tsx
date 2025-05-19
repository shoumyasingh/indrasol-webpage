import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabase';
import AdminLogin from './AdminLogin';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const [authState, setAuthState] = useState({
    loading: true,
    isAuthenticated: false,
    isAdmin: false
  });

  // Use a simple solution - force check admin status manually
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log("Checking current authentication status...");
        
        // First check if there's a session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No session found, user not authenticated");
          setAuthState({
            loading: false,
            isAuthenticated: false,
            isAdmin: false
          });
          return;
        }
        
        console.log("Session found, checking admin status");
        
        // Then check if user has admin role
        const { data: { user } } = await supabase.auth.getUser();
        const isAdmin = user?.app_metadata?.role === 'admin';
        
        console.log("User admin status:", isAdmin);
        
        // Update auth state
        setAuthState({
          loading: false,
          isAuthenticated: true,
          isAdmin: isAdmin
        });
      } catch (error) {
        console.error("Error checking auth:", error);
        setAuthState({
          loading: false,
          isAuthenticated: false,
          isAdmin: false
        });
      }
    };
    
    // Check auth status on mount
    checkAuthStatus();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        
        // Trigger a re-check of auth status
        checkAuthStatus();
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const { loading, isAuthenticated, isAdmin } = authState;
  console.log("Current auth state:", { loading, isAuthenticated, isAdmin });
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indrasol-blue mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <AdminLogin />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedAdminRoute;