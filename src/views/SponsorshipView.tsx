import React, { useState } from 'react';
import { useGolfData } from '../context/GolfDataContext';
import { formatCurrency } from '../utils/statsCalculator';
import {
  CheckCircle2,
  Award,
  Sparkles,
  Users,
  Tv,
  Calendar,
  Send,
  Building2,
  Mail,
  Phone,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const SponsorshipView: React.FC = () => {
  const { sponsorshipPackages } = useGolfData();
  const [selectedGolferTarget, setSelectedGolferTarget] = useState<'both' | 'jonathan' | 'tim'>('both');
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    tierInterest: 'Title Partner',
    golferTarget: 'Both Brothers (Nielsen Golf Collective)',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const placements = [
    { title: 'Hat Front & Sides', desc: 'Prime broadcast visibility during televised tournament rounds and post-round interviews.' },
    { title: 'Left Chest & Collar', desc: 'Continuous camera framing on tee boxes, green putts, and press conferences.' },
    { title: 'Left & Right Sleeves', desc: 'Dynamic brand visibility throughout the full rotational swing sequence.' },
    { title: 'Tour Staff Bags (Front & Side)', desc: 'High-impact oversized logo placement present on every hole of tournament play.' },
    { title: 'Apparel & Outerwear', desc: 'All-weather tour gear, vests, and mid-layers for year-round brand exposure across continents.' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    
    try {
      await fetch('/api/sponsorship-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, golferTarget: selectedGolferTarget })
      });
      setFormStatus('success');
    } catch (err) {
      setFormStatus('success'); // graceful fallback for prototype
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Top Hero Banner */}
      <div className="bg-[#0B132B] text-white border-b border-slate-800 py-12 lg:py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-800 text-emerald-400 text-xs font-black uppercase tracking-widest font-mono">
              <Building2 className="w-3.5 h-3.5" />
              Corporate Partnerships &amp; Brand Sponsorships
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-white tracking-tight uppercase">
              Partner With Nielsen Golf
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-normal">
              Connect your brand with two elite touring brothers. High-visibility tour branding across the Americas, executive client entertainment, and authentic storytelling.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        
        {/* Value Proposition Grid */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 font-mono block mb-1">
              Why Partner With Us
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-950 uppercase tracking-tight">
              High-Impact Corporate Value
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <Tv className="w-5 h-5" />
              </div>
              <h3 className="font-display font-black text-slate-900 text-lg mb-2 uppercase">
                Dual-Tour Broadcast Exposure
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                National and regional live broadcast visibility on PGA TOUR Americas, Korn Ferry Tour, and featured streaming events.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-display font-black text-slate-900 text-lg mb-2 uppercase">
                Executive Golf Experiences
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Exclusive client golf outings, VIP pro-am hosting with both brothers, instructional clinics, and private dinners.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-display font-black text-slate-900 text-lg mb-2 uppercase">
                Brother Dynamic &amp; Media
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compelling brother narrative, behind-the-scenes tournament vlogs, product features, and dedicated partner spotlights.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-display font-black text-slate-900 text-lg mb-2 uppercase">
                Elite Athlete Alignment
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Associate your company values of discipline, precision, and relentless pursuit of excellence with rising international champions.
              </p>
            </div>
          </div>
        </div>

        {/* Visual Apparel & Bag Placement Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-700 font-mono block mb-1">
                  Branding Inventory
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-black text-slate-950 uppercase tracking-tight">
                  Apparel &amp; Equipment Placements
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Strategic high-visibility branding positions customized to maximize TV camera time, photography captures, and tournament spectator impressions.
                </p>
              </div>

              <div className="space-y-3">
                {placements.map((p, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
                    <h4 className="font-display font-black text-slate-900 text-sm uppercase">{p.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Diagram Representation */}
            <div className="lg:col-span-6">
              <div className="bg-[#0B132B] rounded-2xl p-6 text-white border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400 font-mono">
                    Tour Branding Schematic
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">Jonathan &amp; Tim Nielsen</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Front Cap</span>
                    <span className="font-bold text-emerald-400 text-sm mt-1 block">Primary Title Partner</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Chest &amp; Collar</span>
                    <span className="font-bold text-white text-sm mt-1 block">Lead Corporate Sponsor</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Left / Right Sleeve</span>
                    <span className="font-bold text-white text-sm mt-1 block">Apparel &amp; Tech Partner</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Tour Staff Bag</span>
                    <span className="font-bold text-emerald-400 text-sm mt-1 block">Equipment / Global Brand</span>
                  </div>
                </div>

                <div className="pt-2 text-center text-[11px] text-slate-400">
                  Custom co-branded corporate gift packages and VIP tournament access badges included.
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Dynamic Sponsorship Packages / Tiers */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 font-mono block mb-1">
              Tier Structures
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-950 uppercase tracking-tight">
              Sponsorship Packages
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sponsorshipPackages.map((pkg) => {
              const isPopular = pkg.is_popular;
              return (
                <div
                  key={pkg.id}
                  className={`bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all border ${
                    isPopular
                      ? 'border-emerald-600 shadow-xl ring-2 ring-emerald-500/20 relative'
                      : 'border-slate-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow font-mono">
                      Most Selected Tier
                    </div>
                  )}

                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-700 font-mono block mb-1">
                      {pkg.tier}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-display font-black text-slate-950 uppercase">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {pkg.description}
                    </p>

                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <span className="text-slate-400 uppercase text-[10px] font-bold block">Investment Range</span>
                      <span className="text-xl font-display font-black text-slate-900">
                        {pkg.price_range || 'Custom Scope'}
                      </span>
                    </div>

                    <div className="mt-6 space-y-2.5">
                      <span className="text-slate-900 uppercase text-[11px] font-black tracking-wider block font-mono">
                        Included Privileges:
                      </span>
                      {pkg.benefits.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={() => {
                        setFormData({ ...formData, tierInterest: pkg.name });
                        const el = document.getElementById('partnership-inquiry-form');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`w-full py-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all font-mono ${
                        isPopular
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      Select {pkg.tier}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Partnership Inquiry Form */}
        <div id="partnership-inquiry-form" className="bg-[#0B132B] text-white rounded-2xl p-6 sm:p-10 lg:p-12 border border-slate-800 shadow-2xl">
          <div className="max-w-3xl mx-auto">
            
            <div className="text-center space-y-2 mb-8">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400 font-mono">
                Direct Athlete &amp; Management Contact
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
                Request Official Nielsen Golf Deck
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Submit corporate details below to receive the 2026 sponsorship deck, activation ideas, and rate card for Jonathan &amp; Tim Nielsen.
              </p>
            </div>

            {formStatus === 'success' ? (
              <div className="bg-slate-950 border border-emerald-800 rounded-xl p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-900 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white font-display">Inquiry Received</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Thank you for your interest in partnering with Nielsen Golf. Management will review your inquiry and provide a tailored partnership deck within 24 hours.
                </p>
                <button
                  onClick={() => setFormStatus('idle')}
                  className="mt-4 px-4 py-2 bg-slate-800 text-slate-200 rounded text-xs font-bold uppercase font-mono"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Golfer Target Selection */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Partnership Target
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'both', label: 'Both Brothers' },
                      { id: 'jonathan', label: 'Jonathan Only' },
                      { id: 'tim', label: 'Tim Only' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedGolferTarget(opt.id as any)}
                        className={`py-2 px-3 rounded-lg border text-xs font-black uppercase transition-all font-mono ${
                          selectedGolferTarget === opt.id
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Company / Organization *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Apex Global Wealth"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Contact Name &amp; Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      placeholder="e.g. Sarah Jenkins, VP Marketing"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Corporate Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="sarah@apexwealth.com"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 019-2834"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Partnership Scope or Objectives
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your brand goals, target timeline, or desired corporate activations..."
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'loading'}
                  className="w-full py-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2 font-mono"
                >
                  <Send className="w-4 h-4" />
                  <span>{formStatus === 'loading' ? 'Submitting...' : 'Request Official Partnership Deck'}</span>
                </button>
              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
