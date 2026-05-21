import { useState } from 'react';
import { Send, CheckCircle, ArrowLeft } from 'lucide-react';
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
    <div className="relative min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 overflow-hidden font-sans">
      {/* Premium blurred light spots for SaaS feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-lg z-10">
        {/* Logo and Headings */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <span>Inquiry Portal</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight">
            Connect With Our Team
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Fill out the form below and an agent will reach out shortly.
          </p>
        </div>

        {/* Card Body */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl p-8 sm:p-10 transition-all duration-300">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Connor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/80 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sarah@cyberdyne.co"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/80 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. +1 (555) 019-2831"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/80 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Inquiry Source / Event
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/80 transition-all bg-no-repeat cursor-pointer"
                >
                  <option value="Website" className="bg-slate-950 text-white">Website Landing Form</option>
                  <option value="LinkedIn" className="bg-slate-950 text-white">LinkedIn Ad</option>
                  <option value="Advertisement" className="bg-slate-950 text-white">Search Advertisement</option>
                  <option value="Referral" className="bg-slate-950 text-white">Friend/Colleague Referral</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center space-x-2 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-indigo-500/10 transition-all duration-150 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <span>Submit Inquiry</span>
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Premium Success State with Animation */
            <div className="text-center py-6 flex flex-col items-center">
              <div className="h-16 w-16 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center border border-green-500/20 shadow-lg mb-5 animate-bounce">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-display font-bold text-white mb-2">
                Thank You!
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
                Your inquiry has been successfully captured. Our account executives will review the request and get in touch with you shortly.
              </p>
              <button
                onClick={() => {
                  setName('');
                  setEmail('');
                  setPhone('');
                  setSubmitted(false);
                }}
                className="mt-8 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer"
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
            className="inline-flex items-center space-x-1 text-slate-500 hover:text-slate-300 transition-colors text-xs font-semibold"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Go to Admin Portal</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LeadCaptureForm;
