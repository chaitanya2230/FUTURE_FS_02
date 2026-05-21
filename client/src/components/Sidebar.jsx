import { LayoutDashboard, Users, FileText, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeView, setActiveView }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  return (
    <div className="w-64 bg-brand-900 text-white flex flex-col h-full shadow-xl">
      <div className="p-6 flex items-center space-x-3">
        <div className="bg-white/10 p-2 rounded-lg">
          <LayoutDashboard className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-display font-bold tracking-wide">Nexus CRM</span>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-2">
        <button 
          onClick={() => setActiveView('overview')}
          className={`flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg transition-colors cursor-pointer ${
            activeView === 'overview' ? 'bg-white/10 text-white font-semibold' : 'text-gray-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </button>
        <button 
          onClick={() => setActiveView('leads')}
          className={`flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg transition-colors cursor-pointer ${
            activeView === 'leads' ? 'bg-white/10 text-white font-semibold' : 'text-gray-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Users className="h-5 w-5" />
          <span>Leads</span>
        </button>
        <button 
          onClick={() => setActiveView('notes')}
          className={`flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg transition-colors cursor-pointer ${
            activeView === 'notes' ? 'bg-white/10 text-white font-semibold' : 'text-gray-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          <FileText className="h-5 w-5" />
          <span>Notes Timeline</span>
        </button>
        <button 
          onClick={() => setActiveView('settings')}
          className={`flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg transition-colors cursor-pointer ${
            activeView === 'settings' ? 'bg-white/10 text-white font-semibold' : 'text-gray-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </button>
      </nav>

      <div className="p-4 mt-auto">
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full text-left text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
