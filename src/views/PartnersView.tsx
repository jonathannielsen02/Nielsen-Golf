import React, { useState } from 'react';
import { useGolfData } from '../context/GolfDataContext';
import { ExternalLink, ShieldCheck, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import { Sponsor } from '../types';

export const PartnersView: React.FC = () => {
  const { sponsors, setActiveView } = useGolfData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Equipment', 'Apparel', 'Financial', 'Corporate', 'Performance'];

  const filteredSponsors = sponsors.filter((s) => {
    if (selectedCategory === 'All') return true;
    return s.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Top Header Banner */}
      <div className="bg-[#0B132B] text-white border-b border-slate-800 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-800 text-emerald-400 text-xs font-black uppercase tracking-widest font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              PROUDLY SUPPORTED BY
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-white tracking-tight uppercase">
              Official Partners &amp; Sponsors
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed font-normal">
              Industry leaders, premium golf brands, and visionary corporate partners powering Jonathan &amp; Tim Nielsen on their journey across professional tours.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        
        {/* Category Filters */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredSponsors.length} Official {filteredSponsors.length === 1 ? 'Partner' : 'Partners'}
          </span>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Logo & Category Header */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="h-12 flex items-center">
                    {sponsor.logo_url ? (
                      <img
                        src={sponsor.logo_url}
                        alt={sponsor.name}
                        className="max-h-10 max-w-[140px] object-contain filter grayscale group-hover:grayscale-0 transition-all"
                      />
                    ) : (
                      <span className="font-display font-black text-xl text-slate-900 tracking-tight">
                        {sponsor.name}
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-mono">
                    {sponsor.tier}
                  </span>
                </div>

                <h3 className="font-display font-black text-xl text-slate-950 mb-2 uppercase">
                  {sponsor.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {sponsor.description}
                </p>

                <span className="inline-block text-[11px] font-medium text-slate-400">
                  Category: <strong className="text-slate-700 font-semibold">{sponsor.category}</strong>
                </span>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
                {sponsor.website_url ? (
                  <a
                    href={sponsor.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group-hover:underline"
                  >
                    <span>Visit Partner Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-slate-400">Official Equipment Partner</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA for Prospective Sponsors */}
        <div className="bg-[#0B132B] text-white rounded-2xl p-8 sm:p-12 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400 font-mono">
              Join Our Team
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
              Interested in Partnering With Nielsen Golf?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              We offer bespoke commercial partnerships including dual-brother broadcast visibility, executive pro-ams, and dynamic digital marketing campaigns.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveView('sponsorship');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider shrink-0 shadow-lg shadow-emerald-950/60 transition-all flex items-center gap-2 font-mono"
          >
            <span>Explore Sponsorship Deck</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
