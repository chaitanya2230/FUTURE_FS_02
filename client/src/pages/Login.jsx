import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, ShieldAlert, Sparkles, Mail, Lock } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { auth } from '../utils/firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      // Configure prompt to always select account for developer convenience
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      // Cache session particulars locally
      localStorage.setItem('token', idToken);
      localStorage.setItem('user', JSON.stringify({
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        uid: user.uid
      }));

      navigate('/');
      window.location.reload();
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Google Sign-In popup was closed before completion.');
      } else if (err.code === 'auth/configuration-not-found') {
        setError('Google Authentication is not enabled in your Firebase Console. Please follow instructions to enable it.');
      } else {
        setError(err.message.replace('Firebase:', '').trim() || 'Google Authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all credentials.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let userCredential;
      if (isRegisterMode) {
        // Create new Admin Account in Firebase
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // Authenticate existing Admin Account in Firebase
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      const user = userCredential.user;
      const idToken = await user.getIdToken();

      // Cache session particulars locally
      localStorage.setItem('token', idToken);
      localStorage.setItem('user', JSON.stringify({
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        uid: user.uid
      }));

      navigate('/');
      window.location.reload();
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Invalid credentials or no admin account found. Toggle "Register Mode" below to create an email credentials account, or use Google Authentication above.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Invalid administrator credentials.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This administrator email is already registered.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.');
      } else {
        setError(err.message.replace('Firebase:', '').trim() || 'Authentication failed. Please verify configuration.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
      {/* Dynamic colorful gradients to wow the user */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      
      {/* Tech Grid Mask */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 text-center">
        <div className="inline-flex items-center space-x-2 bg-zinc-900/80 border border-zinc-800 px-4 py-1.5 rounded-full mb-6 shadow-xl animate-pulse">
          <Sparkles className="h-4 w-4 text-violet-400" />
          <span className="text-xs text-zinc-300 font-semibold uppercase tracking-wider">Apex Lead Flow CRM</span>
        </div>
        <h2 className="text-4xl font-display font-extrabold text-white tracking-tight leading-none">
          {isRegisterMode ? 'Register Admin Portal' : 'Admin CRM Portal'}
        </h2>
        <p className="mt-2.5 text-sm text-zinc-400 max-w-xs mx-auto">
          {isRegisterMode 
            ? 'Initialize your master administrator credentials with secure Firebase Authentication.'
            : 'Securely access your lead pipelines, activity feeds, and notes timeline.'
          }
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-zinc-950/60 backdrop-blur-xl py-10 px-8 border border-zinc-800/80 shadow-[0_0_50px_-12px_rgba(139,92,246,0.15)] rounded-2xl sm:px-10 transition-all duration-300">
          
          {error && (
            <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-lg flex items-center space-x-2 leading-relaxed">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Primary Action: Google Authentication */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex justify-center items-center space-x-2.5 py-3.5 px-4 border border-zinc-800 rounded-lg shadow-lg text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-850 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-violet-500 cursor-pointer disabled:opacity-50 transition-all duration-150 group"
            >
              <svg className="h-5 w-5 text-white shrink-0 group-hover:scale-105 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>Sign in with Google</span>
            </button>

            {/* Separator line */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-900"></div>
              </div>
              <span className="relative bg-zinc-950 px-3 text-[10px] font-extrabold uppercase tracking-widest text-zinc-500">
                or continue with credentials
              </span>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleAuth}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-zinc-500" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@apex.com"
                  className="w-full pl-10 pr-4 py-3 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/80 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Access Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-zinc-500" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-650 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/80 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center space-x-2 py-3.5 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-violet-500 cursor-pointer disabled:opacity-50 transition-all duration-150"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span>{isRegisterMode ? 'Create Master Account' : 'Authenticate Admin'}</span>
                    {isRegisterMode ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Flexible Mode Toggler */}
          <div className="mt-6 pt-5 border-t border-zinc-900 text-center">
            <button
              onClick={() => {
                setError('');
                setIsRegisterMode(!isRegisterMode);
              }}
              className="text-xs text-zinc-400 hover:text-violet-400 font-semibold tracking-wide uppercase transition-colors"
            >
              {isRegisterMode 
                ? 'Already configured? Return to Sign In' 
                : 'Need credentials setup? Enable Admin Register Mode'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
