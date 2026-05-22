import { LayoutDashboard, Users, FileText, Settings, LogOut, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';

const Sidebar = ({ activeView, setActiveView }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Firebase signout error:', err);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  const navItems = [
    { id: 'overview', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', name: 'Leads Directory', icon: Users },
    { id: 'notes', name: 'Notes Timeline', icon: FileText },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-zinc-950 text-zinc-100 flex flex-col h-full border-r border-zinc-900/60 shadow-[4px_0_24px_rgba(0,0,0,0.8)] font-sans">
      {/* Dynamic Branding */}
      <div className="p-6 flex items-center space-x-3 border-b border-zinc-900/50">
        <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/10">
          <LayoutDashboard className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="text-lg font-display font-extrabold tracking-wide bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">ApexCRM</span>
          <p className="text-[10px] text-violet-400 font-semibold tracking-widest uppercase">Admin Panel</p>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center space-x-3.5 px-4 py-3 w-full text-left rounded-xl transition-all duration-250 group cursor-pointer ${
                isActive 
                  ? 'bg-zinc-900 text-white font-semibold border border-zinc-800 shadow-[0_0_15px_-3px_rgba(139,92,246,0.1)]' 
                  : 'text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200 hover:pl-5'
              }`}
            >
              <Icon className={`h-5 w-5 transition-colors duration-250 ${
                isActive ? 'text-violet-400' : 'text-zinc-500 group-hover:text-zinc-400'
              }`} />
              <span className="text-sm tracking-wide">{item.name}</span>
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_#a78bfa]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout Action */}
      <div className="p-4 mt-auto border-t border-zinc-900/50">
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3.5 px-4 py-3.5 w-full text-left text-zinc-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200 cursor-pointer group"
        >
          <LogOut className="h-5 w-5 text-zinc-500 group-hover:text-red-400 transition-colors" />
          <span className="text-sm font-semibold tracking-wide">Logout Session</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
