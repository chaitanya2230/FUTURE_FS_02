import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { API_ROUTES } from '../utils/api';

const LeadModal = ({ lead, onClose, refreshLeads }) => {
  const [status, setStatus] = useState(lead.status);
  const [note, setNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const payload = { status };
      if (note.trim()) {
        payload.note = note;
      }

      await fetch(API_ROUTES.leadDetail(lead._id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      
      setNote('');
      refreshLeads();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-900 opacity-50 backdrop-blur-sm"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl leading-6 font-display font-bold text-gray-900">{lead.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{lead.email} {lead.phone && `• ${lead.phone}`}</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-1 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-900 focus:border-brand-900 sm:text-sm rounded-lg border shadow-sm"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Notes Timeline</h4>
              <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {lead.notes && lead.notes.length > 0 ? (
                  lead.notes.map((n, i) => (
                    <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <p className="text-sm text-gray-800">{n.text}</p>
                      <p className="text-xs text-gray-400 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No notes yet.</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Add Note</label>
              <div className="flex items-start space-x-3">
                <textarea
                  rows="2"
                  className="shadow-sm focus:ring-brand-900 focus:border-brand-900 block w-full sm:text-sm border border-gray-300 rounded-lg p-3 resize-none"
                  placeholder="Type a note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-100">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-brand-900 text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-900 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
              onClick={handleUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-900 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadModal;
