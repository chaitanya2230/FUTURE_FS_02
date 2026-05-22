import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopAnalytics from '../components/TopAnalytics';
import LeadTable from '../components/LeadTable';
import AddLeadModal from '../components/AddLeadModal';
import { API_ROUTES } from '../utils/api';
import { 
  Search, Plus, FileText, CheckCircle, Database, Sparkles, 
  Send, X, Mail, Phone, Clock, User, ExternalLink, Calendar 
} from 'lucide-react';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeView, setActiveView] = useState('overview');
  
  // Note-taking and status updating in right panel
  const [panelNote, setPanelNote] = useState('');
  const [panelUpdating, setPanelUpdating] = useState(false);
  const [panelError, setPanelError] = useState('');

  const navigate = useNavigate();

  const fetchLeads = async () => {
    try {
      const res = await fetch(API_ROUTES.leads, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setLeads(data);
        
        // Synchronize selected lead state with updated database values
        if (selectedLead) {
          const updated = data.find(l => l._id === selectedLead._id);
          if (updated) {
            setSelectedLead(updated);
          }
        }
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

  const openLeadInspector = (lead) => {
    setSelectedLead(lead);
    setPanelNote('');
    setPanelError('');
  };

  const handlePanelStatusChange = async (newStatus) => {
    if (!selectedLead) return;
    setPanelUpdating(true);
    setPanelError('');
    try {
      const res = await fetch(API_ROUTES.leadDetail(selectedLead._id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        await fetchLeads();
      } else {
        const data = await res.json();
        setPanelError(data.message || 'Failed to update status.');
      }
    } catch (err) {
      console.error(err);
      setPanelError('Network error updating status.');
    } finally {
      setPanelUpdating(false);
    }
  };

  const handleAddPanelNote = async (e) => {
    e.preventDefault();
    if (!selectedLead || !panelNote.trim()) return;
    
    setPanelUpdating(true);
    setPanelError('');
    try {
      const res = await fetch(API_ROUTES.leadDetail(selectedLead._id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ note: panelNote.trim() })
      });
      
      if (res.ok) {
        setPanelNote('');
        await fetchLeads();
      } else {
        const data = await res.json();
        setPanelError(data.message || 'Failed to add note.');
      }
    } catch (err) {
      console.error(err);
      setPanelError('Network error adding note.');
    } finally {
      setPanelUpdating(false);
    }
  };

  // Client-side search and status filtering
  const filteredLeads = leads.filter(lead => {
    const nameMatch = lead.name.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const phoneMatch = lead.phone ? lead.phone.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    
    const matchesSearch = nameMatch || emailMatch || phoneMatch;
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });

  // Aggregate all notes from all leads for the activity feed
  const getAllNotes = () => {
    const allNotes = [];
    leads.forEach(lead => {
      if (lead.notes && lead.notes.length > 0) {
        lead.notes.forEach(note => {
          allNotes.push({
            ...note,
            leadId: lead._id,
            leadName: lead.name,
            leadEmail: lead.email,
            leadStatus: lead.status
          });
        });
      }
    });
    return allNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const renderInspector = () => {
    const allNotes = getAllNotes();

    if (selectedLead) {
      // Get lead initial letter
      const initial = selectedLead.name ? selectedLead.name[0].toUpperCase() : 'L';
      
      return (
        <div className="bg-zinc-950/60 backdrop-blur-xl border border-zinc-900 shadow-[0_4px_24px_rgba(0,0,0,0.8)] rounded-2xl p-6 h-full flex flex-col justify-between">
          <div>
            {/* Header / Dismiss */}
            <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
              <span className="text-xs font-extrabold tracking-widest text-violet-400 uppercase">Lead Inspector</span>
              <button 
                onClick={() => setSelectedLead(null)}
                className="text-zinc-500 hover:text-zinc-200 p-1 hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Error notifications */}
            {panelError && (
              <div className="mt-4 p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-lg">
                {panelError}
              </div>
            )}

            {/* Lead Summary Header */}
            <div className="mt-6 flex items-center space-x-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xl shadow-lg shadow-violet-500/20">
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white truncate leading-snug">{selectedLead.name}</h3>
                <span className="inline-flex items-center text-[10px] text-zinc-500 bg-zinc-900/60 px-2 py-0.5 rounded border border-zinc-800/80 font-medium mt-1 uppercase tracking-wider">
                  Origin: {selectedLead.source}
                </span>
              </div>
            </div>

            {/* Contact details */}
            <div className="mt-6 space-y-3 bg-zinc-900/30 border border-zinc-900 p-4 rounded-xl">
              <div className="flex items-center text-zinc-300 text-xs gap-2.5">
                <Mail className="h-4 w-4 text-zinc-500 shrink-0" />
                <span className="truncate">{selectedLead.email}</span>
              </div>
              <div className="flex items-center text-zinc-300 text-xs gap-2.5">
                <Phone className="h-4 w-4 text-zinc-500 shrink-0" />
                <span>{selectedLead.phone || 'No phone registered'}</span>
              </div>
              <div className="flex items-center text-zinc-400 text-[10px] gap-2.5">
                <Calendar className="h-4 w-4 text-zinc-600 shrink-0" />
                <span>Added: {new Date(selectedLead.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Pipeline Status controller */}
            <div className="mt-6">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-2">Pipeline Status</label>
              <select
                disabled={panelUpdating}
                value={selectedLead.status}
                onChange={(e) => handlePanelStatusChange(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-black border border-zinc-800 rounded-lg text-white font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/60 cursor-pointer disabled:opacity-40"
              >
                <option value="new">New Inquiry</option>
                <option value="contacted">Contacted / Negotiating</option>
                <option value="converted">Converted / Won</option>
                <option value="lost">Lost / Archived</option>
              </select>
            </div>

            {/* Notes Timeline for Lead */}
            <div className="mt-6 flex flex-col">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-3">Remarks History</label>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {selectedLead.notes && selectedLead.notes.length > 0 ? (
                  selectedLead.notes.map((n, i) => (
                    <div key={i} className="bg-zinc-950 border border-zinc-900 p-3 rounded-xl hover:border-zinc-800 transition-all duration-200">
                      <p className="text-xs text-zinc-300 leading-relaxed font-sans">{n.text}</p>
                      <div className="flex justify-between items-center mt-2.5 text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">
                        <span>Agent Remark</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-zinc-600" />
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 italic py-2">No notes recorded yet. Add one below.</p>
                )}
              </div>
            </div>
          </div>

          {/* Add Remark Action */}
          <form onSubmit={handleAddPanelNote} className="mt-6 pt-4 border-t border-zinc-900">
            <div className="relative rounded-lg shadow-sm">
              <textarea
                disabled={panelUpdating}
                rows="2"
                placeholder="Write dynamic lead update remark..."
                value={panelNote}
                onChange={(e) => setPanelNote(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-600 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/80 transition-all resize-none disabled:opacity-40"
              />
              <button
                type="submit"
                disabled={panelUpdating || !panelNote.trim()}
                className="absolute right-2 bottom-3 p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-violet-500/60 text-zinc-400 hover:text-violet-400 transition-all cursor-pointer disabled:opacity-30"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        </div>
      );
    }

    // Default State: CRM unified notes stream feed
    return (
      <div className="bg-zinc-950/60 backdrop-blur-xl border border-zinc-900 shadow-[0_4px_24px_rgba(0,0,0,0.8)] rounded-2xl p-6 h-full flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-900 mb-6">
          <div>
            <h3 className="text-sm font-extrabold tracking-widest text-zinc-200 uppercase">Live CRM Console</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Aggregated recent comments across pipeline</p>
          </div>
          <Sparkles className="h-4.5 w-4.5 text-violet-400 animate-pulse" />
        </div>

        {allNotes.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-zinc-900/10 border border-dashed border-zinc-900 rounded-xl">
            <FileText className="h-8 w-8 text-zinc-700 mb-2.5" />
            <p className="text-xs text-zinc-400 font-semibold">No recent activity detected.</p>
            <p className="text-[10px] text-zinc-600 mt-1 max-w-xs leading-normal">
              Select a lead from the pipeline list on the left to add your first client interaction note.
            </p>
          </div>
        ) : (
          <div className="flex-1 space-y-4 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent max-h-[500px]">
            {allNotes.slice(0, 7).map((note, index) => {
              const badgeColors = {
                new: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
                contacted: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
                converted: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
                lost: 'bg-red-500/10 border-red-500/20 text-red-400'
              };
              
              return (
                <div 
                  key={index}
                  onClick={() => {
                    const lead = leads.find(l => l._id === note.leadId);
                    if (lead) setSelectedLead(lead);
                  }}
                  className="bg-zinc-900/30 border border-zinc-900/80 p-3.5 rounded-xl hover:border-zinc-800 hover:bg-zinc-900/60 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-zinc-200 group-hover:text-violet-400 transition-colors truncate block">
                        {note.leadName}
                      </span>
                    </div>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${badgeColors[note.leadStatus] || 'border-zinc-800 text-zinc-400 bg-zinc-900'}`}>
                      {note.leadStatus}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed line-clamp-3">{note.text}</p>
                  <div className="flex items-center justify-between mt-2.5 text-[9px] text-zinc-500 font-semibold tracking-wider uppercase">
                    <span>Active Stream</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeView) {
      case 'leads':
        return (
          <div className="bg-zinc-950/40 backdrop-blur-md rounded-2xl border border-zinc-900 p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-display font-bold text-white tracking-wide">Leads Directory</h2>
                <p className="text-xs text-zinc-500 mt-1">Detailed repository containing all system pipelines</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search pipelines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2.5 text-xs bg-black border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/80 text-white w-60 transition-all placeholder-zinc-600"
                  />
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-600" />
                </div>

                {/* Status Dropdown */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3.5 py-2.5 text-xs bg-black border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/80 text-zinc-300 cursor-pointer font-medium"
                >
                  <option value="all">All Pipelines</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
              </div>
            ) : (
              <LeadTable leads={filteredLeads} onRowClick={openLeadInspector} refreshLeads={fetchLeads} />
            )}
          </div>
        );

      case 'notes':
        const allNotes = getAllNotes();

        return (
          <div className="bg-zinc-950/40 backdrop-blur-md rounded-2xl border border-zinc-900 p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-xl font-display font-bold text-white tracking-wide">Unified Notes Timeline</h2>
              <p className="text-xs text-zinc-500 mt-1">Chronological aggregate of all remarks across the lead directory</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
              </div>
            ) : allNotes.length === 0 ? (
              <div className="text-center py-16 text-zinc-500 italic font-medium">No system notes recorded across client database.</div>
            ) : (
              <div className="relative border-l border-zinc-900 ml-4 pl-6 space-y-6 max-h-[500px] overflow-y-auto">
                {allNotes.map((note, index) => {
                  const badgeColors = {
                    new: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
                    contacted: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
                    converted: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
                    lost: 'bg-red-500/10 border-red-500/20 text-red-400'
                  };

                  return (
                    <div key={index} className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-[31px] top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_#c084fc]" />
                      </span>
                      
                      <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-900 shadow-sm max-w-3xl hover:border-zinc-800 transition-all group">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                          <div 
                            className="cursor-pointer flex items-center gap-2" 
                            onClick={() => {
                              const matchingLead = leads.find(l => l._id === note.leadId);
                              if (matchingLead) {
                                openLeadInspector(matchingLead);
                                setActiveView('overview');
                              }
                            }}
                          >
                            <span className="text-sm font-semibold text-zinc-200 group-hover:text-violet-400 transition-colors">
                              {note.leadName}
                            </span>
                            <span className="text-[10px] text-zinc-500 truncate hidden sm:inline">• {note.leadEmail}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase ${badgeColors[note.leadStatus] || 'border-zinc-800 text-zinc-400'}`}>
                              {note.leadStatus}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                              {new Date(note.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-zinc-400 font-sans leading-relaxed">{note.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 'settings':
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : { name: 'Chaitanya', email: 'chaitanya2230@gmail.com' };

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User credentials profile info */}
            <div className="bg-zinc-950/40 backdrop-blur-md rounded-2xl border border-zinc-900 p-6 shadow-xl">
              <h2 className="text-base font-bold text-white mb-4 pb-2 border-b border-zinc-900">
                User Profile Config
              </h2>
              <div className="space-y-5">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-2xl shadow-lg shadow-violet-500/20">
                    {user.name ? user.name[0].toUpperCase() : 'C'}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base tracking-wide">{user.name || 'Chaitanya'}</h3>
                    <p className="text-[9px] text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full inline-block font-bold mt-1.5 uppercase tracking-wider">
                      Root Superuser
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 space-y-3.5 border-t border-zinc-900/60">
                  <div>
                    <span className="block text-[9px] font-extrabold uppercase tracking-wider text-zinc-500">Administrator Mail</span>
                    <span className="text-xs text-zinc-300 font-semibold">{user.email || 'chaitanya2230@gmail.com'}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-extrabold uppercase tracking-wider text-zinc-500">Security Clearance</span>
                    <span className="text-xs text-zinc-300 font-semibold">Master CRM Privileges</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Connection and Cluster health info */}
            <div className="bg-zinc-950/40 backdrop-blur-md rounded-2xl border border-zinc-900 p-6 shadow-xl">
              <h2 className="text-base font-bold text-white mb-4 pb-2 border-b border-zinc-900">
                System Integration status
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-500/5 text-emerald-400 rounded-xl border border-emerald-500/10 flex items-center space-x-3.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <div>
                    <h4 className="font-bold text-xs text-zinc-200">MongoDB Connected</h4>
                    <p className="text-[10px] text-emerald-500 font-semibold mt-0.5">Atlas Cluster Online (ac-3nvnwes-shard-01)</p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <div className="flex justify-between text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                    <span>Database Mode</span>
                    <span className="font-bold text-zinc-300">Cloud MERN Cluster</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                    <span>Vite Reverse Proxy</span>
                    <span className="font-bold text-zinc-300">Enabled (/api)</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                    <span>Total Database Inquiries</span>
                    <span className="font-bold text-zinc-300">{leads.length} accounts loaded</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'overview':
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Primary Columns: Stats & Table (Span 2) */}
            <div className="lg:col-span-2 space-y-6">
              <TopAnalytics leads={leads} />
              
              <div className="bg-zinc-950/40 backdrop-blur-md rounded-2xl border border-zinc-900 p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <h2 className="text-base font-bold text-white tracking-wide">Sales pipeline</h2>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Search Input */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search lead..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2.5 text-xs bg-black border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/80 text-white w-52 transition-all placeholder-zinc-600 font-medium"
                      />
                      <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-zinc-600" />
                    </div>

                    {/* Filter status */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2.5 text-xs bg-black border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/80 text-zinc-300 cursor-pointer font-semibold"
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
                  <div className="flex justify-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
                  </div>
                ) : (
                  <LeadTable leads={filteredLeads} onRowClick={openLeadInspector} refreshLeads={fetchLeads} />
                )}
              </div>
            </div>

            {/* Context Panel Column (Span 1) */}
            <div className="lg:col-span-1 h-full min-h-[500px]">
              {renderInspector()}
            </div>
          </div>
        );
    }
  };

  const getHeaderTitle = () => {
    switch (activeView) {
      case 'leads': return 'Leads Directory';
      case 'notes': return 'Unified Timeline';
      case 'settings': return 'CRM Configuration';
      case 'overview':
      default: return 'Overview Control Panel';
    }
  };

  const loggedUserStr = localStorage.getItem('user');
  const loggedUser = loggedUserStr ? JSON.parse(loggedUserStr) : { name: 'Chaitanya', email: 'chaitanya2230@gmail.com' };
  const userInitial = loggedUser.name ? loggedUser.name[0].toUpperCase() : 'C';

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans text-zinc-100 relative">
      {/* Background neon blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Tech grid mask */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />

      {/* Main Layout */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <div className="flex-1 flex flex-col overflow-hidden z-10">
        <header className="bg-zinc-950/50 backdrop-blur-md border-b border-zinc-900/60 px-8 py-4.5 flex justify-between items-center z-10 shadow-sm">
          <div>
            <div className="flex items-center space-x-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <h1 className="text-xl font-display font-extrabold text-white tracking-wide">{getHeaderTitle()}</h1>
            </div>
            <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider font-semibold">Workspace / active database node</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl shadow-lg hover:shadow-violet-500/10 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Lead</span>
            </button>
            <div 
              onClick={() => setActiveView('settings')}
              className="h-10 w-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200 font-extrabold shadow-md cursor-pointer hover:border-violet-500/60 hover:text-white transition-all select-none"
            >
              {userInitial}
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </main>
      </div>

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
