import { useState } from 'react';
import { supabase } from '../supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LockKeyhole, Mail, LogIn } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setError('');
    setSuccessMessage('');
    setLoading(true);
    
    try {
      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        setError(error.message);
        return;
      }
      
      // Check for admin role
      const { data: { user } } = await supabase.auth.getUser();
      const isAdmin = user?.app_metadata?.role === 'admin';
      
      if (!isAdmin) {
        setError('Access denied: You need administrator privileges to access this area');
        // Sign out non-admin users
        await supabase.auth.signOut();
        return;
      }
      
      // Success! Show message and reload
      setSuccessMessage('Login successful! Redirecting to admin dashboard...');
      
      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-800 bg-[size:40px_40px] opacity-[0.2]" />
      
      <div className="relative z-10 w-full max-w-md px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
          <img 
            src="/lovable-uploads/Indrasol company logo_.png" 
            alt="Indrasol Logo" 
            className="h-12"
          />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Admin Portal</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your credentials to access the dashboard
          </p>
        </div>
        
        <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
          <CardHeader className="pb-4 space-y-1">
            <CardTitle className="text-xl font-semibold text-center">Login In</CardTitle>
            <CardDescription className="text-center">
              Secure access for authorized personnel
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/50">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}
            
            {successMessage && (
              <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/50">
                <AlertDescription className="text-green-700 dark:text-green-400 text-sm">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@indrasol.com"
                    disabled={loading || !!successMessage}
                    autoComplete="email"
                    autoFocus
                    required
                    className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockKeyhole className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading || !!successMessage}
                    autoComplete="current-password"
                    required
                    className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>
              
              <Button 
                type="submit"
                className="w-full bg-indrasol-blue hover:bg-indrasol-darkblue text-white flex items-center justify-center gap-2 h-11 transition-transform active:scale-[0.98]" 
                disabled={loading || !!successMessage}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </>
                ) : successMessage ? (
                  'Redirecting...'
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Login In
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center text-xs text-gray-600 dark:text-gray-400">
          Indrasol Admin Portal &copy; {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;










// import { useState } from 'react';
// import { supabase } from '../supabase';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// const AdminLogin = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!email || !password) {
//       setError('Please enter both email and password');
//       return;
//     }
    
//     setError('');
//     setSuccessMessage('');
//     setLoading(true);
    
//     try {
//       // Attempt to sign in
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password
//       });
      
//       if (error) {
//         setError(error.message);
//         return;
//       }
      
//       // Check for admin role
//       const { data: { user } } = await supabase.auth.getUser();
//       const isAdmin = user?.app_metadata?.role === 'admin';
      
//       if (!isAdmin) {
//         setError('Access denied: You need administrator privileges to access this area');
//         // Sign out non-admin users
//         await supabase.auth.signOut();
//         return;
//       }
      
//       // Success! Show message and reload
//       setSuccessMessage('Login successful! Redirecting to admin dashboard...');
      
//       // Reload the page after a short delay
//       setTimeout(() => {
//         window.location.reload();
//       }, 1000);
      
//     } catch (err) {
//       setError('An unexpected error occurred. Please try again.');
//       console.error('Login error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <Card className="w-full max-w-md shadow-lg">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
//           <CardDescription>
//             Enter your credentials to access the admin dashboard
//           </CardDescription>
//         </CardHeader>
        
//         <CardContent>
//           {error && (
//             <Alert variant="destructive" className="mb-4">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}
          
//           {successMessage && (
//             <Alert className="mb-4 bg-green-50 border-green-300">
//               <AlertDescription className="text-green-700">
//                 {successMessage}
//               </AlertDescription>
//             </Alert>
//           )}
          
//           <form onSubmit={handleLogin} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="admin@example.com"
//                 disabled={loading || !!successMessage}
//                 autoComplete="email"
//                 autoFocus
//                 required
//               />
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 disabled={loading || !!successMessage}
//                 autoComplete="current-password"
//                 required
//               />
//             </div>
            
//             <Button 
//               type="submit"
//               className="w-full" 
//               disabled={loading || !!successMessage}
//             >
//               {loading ? 'Logging in...' : successMessage ? 'Logged In' : 'Login'}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AdminLogin;