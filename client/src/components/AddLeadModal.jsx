import { useState } from 'react';
import { X, User, Mail, Phone, Tag, PlaySquare, Send } from 'lucide-react';
import { API_ROUTES } from '../utils/api';

const AddLeadModal = ({ onClose, refreshLeads }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState('Website');
  const [status, setStatus] = useState('new');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Name and Email are required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        name,
        email,
        phone: phone.trim() || undefined,
        source,
        status,
        note: note.trim() || undefined
      };

      const res = await fetch(API_ROUTES.leads, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        refreshLeads();
        onClose();
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to create lead.');
      }
    } catch (err) {
      console.error(err);
      setError('Server connection error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal content body */}
        <div className="inline-block align-bottom bg-zinc-950 border border-zinc-900/80 rounded-2xl text-left overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full z-50">
          <form onSubmit={handleSubmit}>
            <div className="bg-zinc-950 px-6 pt-6 pb-4">
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-zinc-900/60">
                <div>
                  <h3 className="text-lg font-display font-bold text-white tracking-wide">Create CRM Pipeline</h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5 uppercase tracking-wider font-semibold">Manually ingest new account inquiries</p>
                </div>
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 p-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Error messages */}
              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-lg">
                  {error}
                </div>
              )}

              {/* Inputs */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Account/Lead Name *
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-zinc-600" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Connor"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-black border border-zinc-850 rounded-lg text-white placeholder-zinc-650 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/80 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-zinc-600" />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="john@resistance.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-black border border-zinc-850 rounded-lg text-white placeholder-zinc-650 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/80 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-zinc-600" />
                      </div>
                      <input
                        type="text"
                        placeholder="+1 (555) 382-9011"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-black border border-zinc-850 rounded-lg text-white placeholder-zinc-650 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/80 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Lead Origin Source
                    </label>
                    <div className="relative">
                      <select
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="w-full pl-3 pr-8 py-2.5 bg-black border border-zinc-855 rounded-lg text-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/80 cursor-pointer font-medium"
                      >
                        <option value="Website">Website</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Referral">Referral</option>
                        <option value="Cold Call">Cold Call</option>
                        <option value="Advertisement">Advertisement</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Initial Pipeline Status
                    </label>
                    <div className="relative">
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full pl-3 pr-8 py-2.5 bg-black border border-zinc-855 rounded-lg text-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/80 cursor-pointer font-medium"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Initial Context Remark (Optional)
                  </label>
                  <textarea
                    rows="2.5"
                    placeholder="Enter context, request remarks, or preliminary notes..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black border border-zinc-850 rounded-lg text-white placeholder-zinc-650 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/80 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Actions footer */}
            <div className="bg-zinc-950/60 px-6 py-4.5 sm:flex sm:flex-row-reverse border-t border-zinc-900/60 gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex justify-center items-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg hover:shadow-violet-500/10 active:scale-95 transition-all cursor-pointer disabled:opacity-40"
              >
                <span>{isSubmitting ? 'Creating Influx...' : 'Submit Lead'}</span>
              </button>
              <button
                type="button"
                className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center py-2.5 px-4 rounded-xl text-xs font-semibold text-zinc-400 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200 transition-colors cursor-pointer"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLeadModal;
