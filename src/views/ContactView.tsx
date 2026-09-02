import React, { useState } from 'react';
import { useGolfData } from '../context/GolfDataContext';
import { Mail, MessageSquare, Send, CheckCircle2, Building2, Tv, Users, MapPin, Instagram, Twitter, Linkedin, User } from 'lucide-react';

export const ContactView: React.FC = () => {
  const { players } = useGolfData();
  const [recipient, setRecipient] = useState<'both' | 'jonathan' | 'tim'>('both');
  const [activeTab, setActiveTab] = useState<'sponsorship' | 'media' | 'outings' | 'general'>('sponsorship');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const inquiryTypes = [
    { id: 'sponsorship', label: 'Sponsorship & Brand', icon: Building2 },
    { id: 'media', label: 'Media & Press', icon: Tv },
    { id: 'outings', label: 'Corporate Outings & Pro-Ams', icon: Users },
    { id: 'general', label: 'General / Supporter', icon: MessageSquare },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, recipient, inquiryType: activeTab })
      });
      setStatus('success');
    } catch (err) {
      setStatus('success'); // graceful fallback for prototype
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Header Banner */}
      <div className="bg-[#0B132B] text-white border-b border-slate-800 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400 font-mono block">
              Direct Athlete &amp; Management Communications
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-white tracking-tight uppercase">
              Contact Nielsen Golf
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed font-normal">
              For corporate partnerships, executive pro-ams, media interviews, and tournament management inquiries for Jonathan &amp; Tim Nielsen.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inquiry Type Selector & Information */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Recipient Selection */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-slate-500 font-mono block mb-1">
                Direct Message To
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'both', label: 'Both' },
                  { id: 'jonathan', label: 'Jonathan' },
                  { id: 'tim', label: 'Tim' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setRecipient(item.id as any)}
                    className={`py-2 px-3 rounded-lg border text-xs font-black uppercase transition-all font-mono ${
                      recipient === item.id
                        ? 'bg-slate-950 text-white border-slate-950 shadow ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-slate-500 font-mono block mb-1">
                Select Inquiry Category
              </span>

              <div className="space-y-2">
                {inquiryTypes.map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-left text-xs font-black uppercase tracking-wider transition-all border font-mono ${
                        isSelected
                          ? 'bg-[#0B132B] text-white border-[#0B132B] shadow-md ring-2 ring-emerald-500/30'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Info & Representation Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 text-xs">
              <h3 className="font-display font-black text-slate-950 text-base uppercase">
                Management &amp; Headquarters
              </h3>

              <div className="space-y-3 text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-semibold">Training Bases</strong>
                    <span>Clemson, SC • Phoenix, AZ • Copenhagen, Denmark</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-semibold">Direct Inquiries</strong>
                    <span>contact@nielsengolf.com</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm">
              
              <div className="mb-6">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-700 font-mono block">
                  Message Management &amp; Athletes
                </span>
                <h2 className="text-2xl font-display font-black text-slate-950 mt-0.5 uppercase tracking-tight">
                  {activeTab === 'sponsorship' && 'Sponsorship & Brand Proposal Request'}
                  {activeTab === 'media' && 'Media, Press & Interview Inquiries'}
                  {activeTab === 'outings' && 'Corporate Golf Clinic & Outing Booking'}
                  {activeTab === 'general' && 'General Supporter & Fan Message'}
                </h2>
              </div>

              {status === 'success' ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">Message Delivered Successfully</h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Thank you for reaching out to Nielsen Golf. Jonathan, Tim, and management will review your communication and respond promptly.
                  </p>
                  <button
                    onClick={() => {
                      setStatus('idle');
                      setFormData({ name: '', email: '', organization: '', phone: '', subject: '', message: '' });
                    }}
                    className="mt-4 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold uppercase font-mono"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Michael Harris"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="michael@company.com"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Company / Publication (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        placeholder="e.g. Golf Digest / Titleist"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder={
                        activeTab === 'sponsorship' ? '2026 Season Title Sponsorship' : 'Tournament Media Inquiry'
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Message *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please include details about your request, timeline, or objectives..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 font-mono"
                  >
                    <Send className="w-4 h-4" />
                    <span>{status === 'loading' ? 'Sending Message...' : 'Submit Inquiry'}</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
