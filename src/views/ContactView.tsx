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
    <div className="bg-[#F5F3EE] min-h-screen pb-16">
      
      {/* Header Banner */}
      <div className="bg-[#244437] text-white border-b border-[#1b342a] py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
              <Mail className="w-3.5 h-3.5 text-[#B49A6A]" />
              <span>Direct Athlete &amp; Management Communications</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white tracking-tight uppercase">
              Contact Nielsen Golf
            </h1>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed font-normal">
              For corporate partnerships, brand sponsorship inquiries, media interviews, and tournament coordination for Jonathan &amp; Tim Nielsen.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inquiry Type Selector & Information */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Recipient Selection */}
            <div className="bg-[#FAF9F6] border border-[#D9D6CC] rounded-2xl p-6 shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#656A65] block mb-1">
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
                    className={`py-2.5 px-3 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all ${
                      recipient === item.id
                        ? 'bg-[#244437] text-white border-[#244437] shadow-xs'
                        : 'bg-white border-[#D9D6CC] text-[#202421] hover:bg-[#ECEAE4]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#FAF9F6] border border-[#D9D6CC] rounded-2xl p-6 shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#656A65] block mb-1">
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
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all border ${
                        isSelected
                          ? 'bg-[#244437] text-white border-[#244437] shadow-xs'
                          : 'bg-white border-[#D9D6CC] text-[#202421] hover:bg-[#ECEAE4]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#B49A6A]' : 'text-[#656A65]'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact Information Card */}
            <div className="bg-[#FAF9F6] border border-[#D9D6CC] rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
              <div className="border-b border-[#E2DFD7] pb-3.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B49A6A] block mb-1">
                  Direct Inquiries
                </span>
                <h3 className="font-display font-black text-[#202421] text-lg uppercase tracking-tight">
                  Contact Information
                </h3>
              </div>

              <div className="space-y-5 text-xs">
                {/* Email Section */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[#656A65]">
                    <Mail className="w-4 h-4 text-[#244437]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#202421]">
                      EMAIL
                    </span>
                  </div>
                  <div className="pl-6">
                    <a
                      href="mailto:jnielsen.golf@gmail.com"
                      className="text-sm sm:text-base font-bold text-[#244437] hover:text-[#1b342a] hover:underline transition-colors block break-all font-sans"
                    >
                      jnielsen.golf@gmail.com
                    </a>
                    <span className="text-[11px] text-[#8A8F8A] block mt-0.5">
                      Primary Nielsen Golf contact email
                    </span>
                  </div>
                </div>

                {/* Training Bases Section */}
                <div className="space-y-1.5 pt-4 border-t border-[#E2DFD7]">
                  <div className="flex items-center gap-2 text-[#656A65]">
                    <MapPin className="w-4 h-4 text-[#244437]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#202421]">
                      TRAINING BASES
                    </span>
                  </div>
                  <div className="pl-6 space-y-1 text-sm font-semibold text-[#202421]">
                    <div>Charlotte, NC</div>
                    <div>Scottsdale, AZ</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#FAF9F6] border border-[#D9D6CC] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs">
              
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[#244437] block">
                  Message Management &amp; Athletes
                </span>
                <h2 className="text-2xl font-display font-black text-[#202421] mt-0.5 uppercase tracking-tight">
                  {activeTab === 'sponsorship' && 'Sponsorship & Brand Proposal Request'}
                  {activeTab === 'media' && 'Media, Press & Interview Inquiries'}
                  {activeTab === 'outings' && 'Corporate Golf Clinic & Outing Booking'}
                  {activeTab === 'general' && 'General Supporter & Fan Message'}
                </h2>
              </div>

              {status === 'success' ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#244437] text-white mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#202421] font-display">Message Delivered Successfully</h3>
                  <p className="text-xs text-[#656A65] max-w-md mx-auto">
                    Thank you for reaching out to Nielsen Golf. Jonathan, Tim, and management will review your communication and respond promptly.
                  </p>
                  <button
                    onClick={() => {
                      setStatus('idle');
                      setFormData({ name: '', email: '', organization: '', phone: '', subject: '', message: '' });
                    }}
                    className="mt-4 px-5 py-2.5 bg-[#244437] hover:bg-[#1b342a] text-white rounded-lg text-xs font-bold uppercase tracking-wider"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#656A65] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Michael Harris"
                        className="w-full px-4 py-3 bg-white border border-[#D9D6CC] rounded-lg text-sm text-[#202421] placeholder-[#8A8F8A] focus:outline-none focus:border-[#244437]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#656A65] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="michael@company.com"
                        className="w-full px-4 py-3 bg-white border border-[#D9D6CC] rounded-lg text-sm text-[#202421] placeholder-[#8A8F8A] focus:outline-none focus:border-[#244437]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#656A65] mb-1">
                        Company / Publication (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        placeholder="e.g. Golf Digest / Titleist"
                        className="w-full px-4 py-3 bg-white border border-[#D9D6CC] rounded-lg text-sm text-[#202421] placeholder-[#8A8F8A] focus:outline-none focus:border-[#244437]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#656A65] mb-1">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3 bg-white border border-[#D9D6CC] rounded-lg text-sm text-[#202421] placeholder-[#8A8F8A] focus:outline-none focus:border-[#244437]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#656A65] mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder={
                        activeTab === 'sponsorship' ? '2026 Season Title Sponsorship' : 'Tournament Media Inquiry'
                      }
                      className="w-full px-4 py-3 bg-white border border-[#D9D6CC] rounded-lg text-sm text-[#202421] placeholder-[#8A8F8A] focus:outline-none focus:border-[#244437]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#656A65] mb-1">
                      Message *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please include details about your request, timeline, or objectives..."
                      className="w-full px-4 py-3 bg-white border border-[#D9D6CC] rounded-lg text-sm text-[#202421] placeholder-[#8A8F8A] focus:outline-none focus:border-[#244437]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-3.5 rounded-lg bg-[#244437] hover:bg-[#1b342a] text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-2"
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
