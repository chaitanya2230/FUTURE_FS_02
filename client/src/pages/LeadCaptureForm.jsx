import { useState } from 'react';
import { Send, CheckCircle, ArrowLeft, User, Mail, Phone, ExternalLink } from 'lucide-react';
import { API_ROUTES } from '../utils/api';

const LeadCaptureForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState('Website');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please fill in both Name and Email fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        name,
        email,
        phone: phone.trim() || undefined,
        source: source || 'Website'
      };

      const res = await fetch(API_ROUTES.leads, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to submit form. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection to the server failed. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col justify-center items-center px-4 overflow-hidden font-sans text-zinc-100">
      {/* Premium blurred light spots for SaaS feel */}
      <div className="absolute top-[-15%] left-[-15%] w-[55%] h-[55%] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[55%] h-[55%] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      
      {/* Tech Grid Mask */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-lg z-10">
        {/* Logo and Headings */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-zinc-900/80 border border-zinc-800/80 px-4.5 py-1.5 rounded-full mb-4 shadow-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-ping" />
            <span className="text-[10px] text-zinc-300 font-extrabold uppercase tracking-widest">Inquiry Portal Gateway</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight sm:text-4xl">
            Connect With Our Team
          </h1>
          <p className="text-xs text-zinc-400 mt-2.5 max-w-xs mx-auto leading-relaxed">
            Fill out your details below and a client partner will reach out to schedule a consultation.
          </p>
        </div>

        {/* Card Body */}
        <div className="bg-zinc-950/60 backdrop-blur-xl border border-zinc-900 shadow-[0_4px_30px_rgba(0,0,0,0.8)] rounded-2xl p-8 sm:p-10 transition-all duration-300">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-lg text-center leading-relaxed">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Full Representative Name *
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-zinc-650" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/80 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Business Mail Address *
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-zinc-650" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="e.g. john@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/80 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Telephone Contact
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-zinc-650" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. +1 (555) 019-2831"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/80 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Discovery Channel
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full px-3 py-3 bg-black border border-zinc-800 rounded-lg text-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/80 transition-all cursor-pointer font-medium"
                >
                  <option value="Website">Website Form Submission</option>
                  <option value="LinkedIn">LinkedIn Social Network</option>
                  <option value="Advertisement">Search Engine Advertisement</option>
                  <option value="Referral">Client/Partner Referral</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center space-x-2 py-3.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-violet-500/10 active:scale-95 transition-all duration-150 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <span>Transmit Request</span>
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Premium Success State */
            <div className="text-center py-6 flex flex-col items-center">
              <div className="h-16 w-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/5 mb-5 animate-bounce">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-display font-extrabold text-white mb-2 tracking-wide">
                Transmission Successful
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto font-medium">
                Your pipeline request has been securely parsed into MongoDB. An administrator has been alerted and will establish communications with you shortly.
              </p>
              <button
                onClick={() => {
                  setName('');
                  setEmail('');
                  setPhone('');
                  setSubmitted(false);
                }}
                className="mt-8 text-[10px] font-extrabold text-violet-400 hover:text-violet-300 transition-colors uppercase tracking-widest flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Submit Another Response</span>
              </button>
            </div>
          )}
        </div>

        {/* Back link to Admin Portal */}
        <div className="text-center mt-6">
          <a
            href="/login"
            className="inline-flex items-center space-x-1.5 text-zinc-500 hover:text-zinc-300 transition-colors text-xs font-semibold"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Return to Admin CRM Portal</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LeadCaptureForm;
