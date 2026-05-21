import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopAnalytics from '../components/TopAnalytics';
import LeadTable from '../components/LeadTable';
import LeadModal from '../components/LeadModal';
import AddLeadModal from '../components/AddLeadModal';
import { API_ROUTES } from '../utils/api';
import { Search, Plus, FileText, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeView, setActiveView] = useState('overview');

  const fetchLeads = async () => {
    try {
      const res = await fetch(API_ROUTES.leads, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setLeads(data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const openLeadModal = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  // Client-side search and status filtering
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.phone && lead.phone.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesStatus = 
      statusFilter === 'all' || 
      lead.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });

  const renderContent = () => {
    switch (activeView) {
      case 'leads':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-display font-bold text-gray-800">Leads Directory</h2>
                <p className="text-xs text-gray-500 mt-0.5">Manage and track all customer interactions</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 w-64 transition-all"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>

                {/* Status Dropdown */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 bg-white transition-all text-gray-600 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <LeadTable leads={filteredLeads} onRowClick={openLeadModal} refreshLeads={fetchLeads} />
            )}
          </div>
        );

      case 'notes':
        // Aggregate all notes from all leads
        const allNotes = [];
        leads.forEach(lead => {
          if (lead.notes && lead.notes.length > 0) {
            lead.notes.forEach(note => {
              allNotes.push({
                ...note,
                leadId: lead._id,
                leadName: lead.name,
                leadEmail: lead.email
              });
            });
          }
        });
        
        // Sort notes by date (latest first)
        allNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-display font-bold text-gray-800">Unified Notes Timeline</h2>
              <p className="text-xs text-gray-500 mt-0.5">Aggregated recent agent notes and remarks across all leads</p>
            </div>

            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : allNotes.length === 0 ? (
              <div className="text-center py-12 text-gray-500 italic">No notes found across leads.</div>
            ) : (
              <div className="relative border-l border-gray-200 ml-4 pl-6 space-y-6">
                {allNotes.map((note, index) => (
                  <div key={index} className="relative">
                    {/* Timeline Node dot */}
                    <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-100 border border-indigo-300">
                      <span className="h-2 w-2 rounded-full bg-indigo-600" />
                    </span>
                    
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm max-w-2xl hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div className="cursor-pointer" onClick={() => {
                          const matchingLead = leads.find(l => l._id === note.leadId);
                          if (matchingLead) openLeadModal(matchingLead);
                        }}>
                          <span className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
                            {note.leadName}
                          </span>
                          <span className="text-xs text-gray-400 ml-2">• {note.leadEmail}</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 font-sans leading-relaxed">{note.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'settings':
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : { name: 'Chaitanya', email: 'chaitanya2230@gmail.com' };

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-display font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                User Profile
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xl shadow-md border-2 border-indigo-200">
                    {user.name ? user.name[0].toUpperCase() : 'C'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-base">{user.name || 'Chaitanya'}</h3>
                    <p className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded inline-block font-semibold mt-1">
                      System Administrator
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 grid grid-cols-1 gap-y-3">
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Mail Address</span>
                    <span className="text-sm text-gray-700 font-medium">{user.email || 'chaitanya2230@gmail.com'}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Account Access Level</span>
                    <span className="text-sm text-gray-700 font-medium">Root Superuser</span>
                  </div>
                </div>
              </div>
            </div>

            {/* System / Connection status card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-display font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                Database Status
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 text-green-800 rounded-xl border border-green-100 flex items-center space-x-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <div>
                    <h4 className="font-semibold text-sm">MongoDB Connected</h4>
                    <p className="text-xs text-green-600 font-medium mt-0.5">Atlas Cluster Online (ac-3nvnwes-shard-01)</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs text-gray-500 font-medium">
                    <span>Database Mode</span>
                    <span className="font-bold text-gray-700">Cloud Cluster</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 font-medium">
                    <span>Proxy Configuration</span>
                    <span className="font-bold text-gray-700">Active (/api)</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 font-medium">
                    <span>Total Document Count</span>
                    <span className="font-bold text-gray-700">{leads.length} leads loaded</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'overview':
      default:
        return (
          <>
            <TopAnalytics leads={leads} />
            
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-lg font-display font-semibold text-gray-800">Recent Leads</h2>
                
                <div className="flex flex-wrap items-center gap-3">
                  {/* Search Bar */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search name, email, phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 w-64 transition-all"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 bg-white transition-all text-gray-600 cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <LeadTable leads={filteredLeads} onRowClick={openLeadModal} refreshLeads={fetchLeads} />
              )}
            </div>
          </>
        );
    }
  };

  const getHeaderTitle = () => {
    switch (activeView) {
      case 'leads': return 'Leads Directory';
      case 'notes': return 'Unified Timeline';
      case 'settings': return 'CRM Settings';
      case 'overview':
      default: return 'Overview';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center z-10 shadow-sm">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-800">{getHeaderTitle()}</h1>
            <p className="text-xs text-gray-500 mt-0.5">Manage your client inquiries and notes</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm hover:shadow transition-all duration-150 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Lead</span>
            </button>
            <div className="h-10 w-10 rounded-full bg-brand-900 flex items-center justify-center text-white font-bold shadow-md border-2 border-white">
              C
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          {renderContent()}
        </main>
      </div>

      {isModalOpen && (
        <LeadModal 
          lead={selectedLead} 
          onClose={() => setIsModalOpen(false)} 
          refreshLeads={fetchLeads} 
        />
      )}

      {isAddModalOpen && (
        <AddLeadModal 
          onClose={() => setIsAddModalOpen(false)} 
          refreshLeads={fetchLeads} 
        />
      )}
    </div>
  );
};

export default Dashboard;
