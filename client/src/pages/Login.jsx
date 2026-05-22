import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, ShieldAlert, Sparkles, Mail, Lock } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      if (err.code === 'auth/user-not-found') {
        setError('No administrator registered under this email. Toggle "Register Mode" below to set up your account.');
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
          <span className="text-xs text-zinc-300 font-semibold uppercase tracking-wider">Apex Lead Flow Integration</span>
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
          <form className="space-y-5" onSubmit={handleAuth}>
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-lg flex items-center space-x-2 leading-relaxed">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

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
                  className="w-full pl-10 pr-4 py-3 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/80 transition-all"
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
                : 'Need setup? Enable Admin Register Mode'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
