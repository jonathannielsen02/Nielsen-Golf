import React from 'react';
import { useGolfData } from '../context/GolfDataContext';
import { ShieldCheck, Instagram, Twitter, Linkedin, Heart, TrendingUp, Briefcase } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, setSelectedTournamentSlug, jonathan, tim } = useGolfData();

  const handleNav = (view: string) => {
    setSelectedTournamentSlug(null);
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#ECEAE4] text-[#656A65] border-t border-[#D9D6CC] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#244437] flex items-center justify-center font-display font-extrabold text-white text-base tracking-tight shadow-sm">
                NG
              </div>
              <div>
                <span className="block font-display font-black text-lg text-[#202421] tracking-wider uppercase">
                  Nielsen Golf
                </span>
                <span className="block text-[11px] font-semibold tracking-widest text-[#656A65] uppercase">
                  Jonathan &amp; Tim Nielsen • Professional Golf
                </span>
              </div>
            </div>

            <p className="text-[#656A65] leading-relaxed text-xs max-w-sm">
              The official digital platform of Danish professional golfers Jonathan Nielsen and Tim Nielsen. Competing across PGA TOUR Americas, DP World Tour Qualifying, and global developmental circuits.
            </p>

            <div className="flex items-center gap-3 pt-2 text-[#202421]">
              <a
                href={jonathan?.instagram_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#FAF9F6] border border-[#D9D6CC] flex items-center justify-center hover:bg-[#244437] hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={jonathan?.x_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#FAF9F6] border border-[#D9D6CC] flex items-center justify-center hover:bg-[#244437] hover:text-white transition-colors"
                aria-label="X / Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={jonathan?.linkedin_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#FAF9F6] border border-[#D9D6CC] flex items-center justify-center hover:bg-[#244437] hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="font-display font-bold text-[#202421] text-xs uppercase tracking-widest mb-4">
              Athletes &amp; Play
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-[#244437] transition-colors">
                  Home Hub
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('jonathan')} className="hover:text-[#244437] transition-colors">
                  Jonathan Nielsen Profile
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('tim')} className="hover:text-[#244437] transition-colors">
                  Tim Nielsen Profile
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('schedule')} className="hover:text-[#244437] transition-colors">
                  Tournament Schedule
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('results')} className="hover:text-[#244437] transition-colors">
                  Season Results &amp; Stats
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Corporate & Commercial */}
          <div>
            <h4 className="font-display font-bold text-[#202421] text-xs uppercase tracking-widest mb-4">
              Partner With Us
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => handleNav('partner-with-us')} className="hover:text-[#244437] transition-colors font-medium">
                  Partnership Overview
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('partner-with-us')} className="hover:text-[#244437] transition-colors flex items-center gap-1.5">
                  <Heart className="w-3 h-3 text-[#B49A6A]" /> Donate (Supporter Club)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('partner-with-us')} className="hover:text-[#244437] transition-colors flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3 text-[#26364A]" /> Invest (Performance Equity)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('partner-with-us')} className="hover:text-[#244437] transition-colors flex items-center gap-1.5">
                  <Briefcase className="w-3 h-3 text-[#244437]" /> Sponsor (Brand Deals)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-[#244437] transition-colors">
                  General Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Athlete Management & Admin */}
          <div>
            <h4 className="font-display font-bold text-[#202421] text-xs uppercase tracking-widest mb-4">
              Administration
            </h4>
            <div className="space-y-3 text-xs">
              <p className="text-[#656A65]">
                Tours: PGA TOUR Americas • ECCO Tour
              </p>
              <p className="text-[#656A65]">
                Representing Denmark
              </p>
              
              <div className="pt-2">
                <button
                  onClick={() => handleNav('admin')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#FAF9F6] border border-[#D9D6CC] text-[#202421] hover:text-[#244437] hover:border-[#244437] transition-colors font-medium text-xs shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#244437]" />
                  <span>Admin Hub</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-[#D9D6CC] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#656A65] text-[11px]">
          <p>© {new Date().getFullYear()} Nielsen Golf. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <span>Jonathan &amp; Tim Nielsen • Professional Tour Athletes</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
