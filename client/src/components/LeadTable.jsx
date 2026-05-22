import { Trash2 } from 'lucide-react';
import { API_ROUTES } from '../utils/api';

const LeadTable = ({ leads, onRowClick, refreshLeads }) => {
  
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to permanently delete this lead?')) {
      try {
        await fetch(API_ROUTES.leadDetail(id), {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        refreshLeads();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new': 
        return (
          <span className="px-3 py-1 inline-flex items-center space-x-1.5 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            <span>New</span>
          </span>
        );
      case 'contacted': 
        return (
          <span className="px-3 py-1 inline-flex items-center space-x-1.5 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
            <span>Contacted</span>
          </span>
        );
      case 'converted': 
        return (
          <span className="px-3 py-1 inline-flex items-center space-x-1.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span>Converted</span>
          </span>
        );
      case 'lost': 
        return (
          <span className="px-3 py-1 inline-flex items-center space-x-1.5 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_8px_#f87171]" />
            <span>Lost</span>
          </span>
        );
      default: 
        return null;
    }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'LD';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-zinc-900/60">
        <thead>
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Lead</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Contact Details</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Source</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Date Created</th>
            <th className="px-6 py-4 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-900/50">
          {leads.map((lead) => (
            <tr 
              key={lead._id} 
              onClick={() => onRowClick(lead)}
              className="hover:bg-zinc-900/30 cursor-pointer transition-colors duration-150 group"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-gradient-to-tr from-zinc-900 to-zinc-800 text-zinc-300 font-bold flex items-center justify-center border border-zinc-800 shadow-md group-hover:scale-105 transition-transform duration-200">
                    {getInitials(lead.name)}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-semibold text-zinc-200 tracking-wide group-hover:text-violet-400 transition-colors">
                      {lead.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-zinc-200">{lead.email}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{lead.phone || 'No phone registered'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400 font-medium">
                {lead.source}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(lead.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                {new Date(lead.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  onClick={(e) => handleDelete(e, lead._id)}
                  className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 p-2.5 rounded-xl transition-all duration-150 cursor-pointer"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {leads.length === 0 && (
        <div className="text-center py-14 text-zinc-500 font-medium italic">No pipelines found in database.</div>
      )}
    </div>
  );
};

export default LeadTable;
