import React, { useState, useRef, useEffect } from 'react';
import { useGolfData } from '../context/GolfDataContext';
import { Menu, X, ExternalLink, Calendar, ShieldCheck, ChevronRight, ChevronDown, Radio } from 'lucide-react';

export const Navigation: React.FC = () => {
  const {
    activeView,
    setActiveView,
    jonathanCurrentTournament,
    timCurrentTournament,
    jonathanNextTournament,
    timNextTournament,
    setSelectedTournamentSlug
  } = useGolfData();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [liveDropdownOpen, setLiveDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: 'home', label: 'HOME' },
    { id: 'jonathan', label: 'JONATHAN' },
    { id: 'tim', label: 'TIM' },
    { id: 'schedule', label: 'SCHEDULE' },
    { id: 'results', label: 'RESULTS' },
    { id: 'partner-with-us', label: 'PARTNER WITH US' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const handleNavClick = (viewId: string) => {
    setSelectedTournamentSlug(null);
    setActiveView(viewId);
    setMobileMenuOpen(false);
    setLiveDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLiveDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isJonathanActive = Boolean(jonathanCurrentTournament);
  const isTimActive = Boolean(timCurrentTournament);
  const isBothActive = isJonathanActive && isTimActive;
  const isAnyActive = isJonathanActive || isTimActive;

  return (
    <header className="sticky top-0 z-50 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E2DFD7] text-[#202421] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Tag */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-md bg-[#244437] flex items-center justify-center font-display font-extrabold text-white text-base tracking-wider shadow-sm group-hover:bg-[#1b342a] transition-colors">
              NG
            </div>
            <div>
              <span className="block font-display font-black text-xl tracking-wider text-[#202421] uppercase group-hover:text-[#244437] transition-colors">
                Nielsen Golf
              </span>
              <span className="block text-[11px] font-semibold tracking-widest text-[#656A65] uppercase">
                Jonathan &amp; Tim Nielsen • Professional Golf
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = activeView === item.id || 
                (item.id === 'partner-with-us' && (activeView === 'partners' || activeView === 'sponsorship')) ||
                (item.id === 'jonathan' && activeView === 'profile');
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 text-xs font-bold tracking-widest transition-colors uppercase ${
                    isActive
                      ? 'text-[#244437] border-b-2 border-[#244437] -mb-0.5'
                      : 'text-[#656A65] hover:text-[#202421] hover:bg-[#ECEAE4]/80 rounded'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action / Contextual Button */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Contextual Live Button Logic */}
            {isBothActive ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setLiveDropdownOpen(!liveDropdownOpen)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#244437] hover:bg-[#1b342a] text-white text-xs font-extrabold tracking-wider uppercase shadow-sm transition-all"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B49A6A] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                  </span>
                  <span>FOLLOW LIVE</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${liveDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {liveDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-[#FAF9F6] border border-[#D9D6CC] rounded-lg shadow-xl overflow-hidden py-1 z-50">
                    <div className="px-3.5 py-2.5 border-b border-[#E2DFD7] bg-[#ECEAE4]">
                      <p className="text-[10px] font-bold tracking-widest text-[#244437] uppercase">Live Tournaments</p>
                      <p className="text-xs text-[#656A65]">Both Jonathan &amp; Tim are competing today</p>
                    </div>

                    <a
                      href={jonathanCurrentTournament?.leaderboard_url || 'https://www.pgatour.com/americas/leaderboard'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-3.5 py-3 hover:bg-[#ECEAE4] transition-colors border-b border-[#E2DFD7]"
                      onClick={() => setLiveDropdownOpen(false)}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                          <span className="text-xs font-bold text-[#202421] uppercase">Jonathan Live</span>
                        </div>
                        <p className="text-[11px] text-[#656A65] mt-0.5">{jonathanCurrentTournament?.name} ({jonathanCurrentTournament?.final_finish || '-9'})</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-[#244437] ml-2" />
                    </a>

                    <a
                      href={timCurrentTournament?.leaderboard_url || 'https://www.pgatour.com/americas/leaderboard'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-3.5 py-3 hover:bg-[#ECEAE4] transition-colors"
                      onClick={() => setLiveDropdownOpen(false)}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                          <span className="text-xs font-bold text-[#202421] uppercase">Tim Live</span>
                        </div>
                        <p className="text-[11px] text-[#656A65] mt-0.5">{timCurrentTournament?.name} ({timCurrentTournament?.final_finish || '-4'})</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-[#244437] ml-2" />
                    </a>
                  </div>
                )}
              </div>
            ) : isJonathanActive ? (
              <a
                href={jonathanCurrentTournament?.leaderboard_url || 'https://www.pgatour.com/americas/leaderboard'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#244437] hover:bg-[#1b342a] text-white text-xs font-extrabold tracking-wider uppercase shadow-sm transition-all"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B49A6A] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                </span>
                <span>FOLLOW JONATHAN LIVE</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-90" />
              </a>
            ) : isTimActive ? (
              <a
                href={timCurrentTournament?.leaderboard_url || 'https://www.pgatour.com/americas/leaderboard'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#244437] hover:bg-[#1b342a] text-white text-xs font-extrabold tracking-wider uppercase shadow-sm transition-all"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B49A6A] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                </span>
                <span>FOLLOW TIM LIVE</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-90" />
              </a>
            ) : (
              <button
                onClick={() => handleNavClick('schedule')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#ECEAE4] hover:bg-[#dedad0] text-[#202421] text-xs font-bold tracking-wider uppercase border border-[#D9D6CC] transition-all"
              >
                <Calendar className="w-3.5 h-3.5 text-[#244437]" />
                <span>SCHEDULE</span>
              </button>
            )}

            {/* Quick Admin Access */}
            <button
              onClick={() => handleNavClick('admin')}
              title="Nielsen Golf Admin Control Panel"
              className={`p-2 rounded-md text-[#656A65] hover:text-[#202421] hover:bg-[#ECEAE4] text-xs transition-colors ${
                activeView === 'admin' ? 'text-[#244437] bg-[#ECEAE4]' : ''
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {isAnyActive && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#244437] text-white text-[10px] font-bold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                <span>LIVE</span>
              </span>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className="p-2.5 rounded-lg text-[#202421] hover:bg-[#ECEAE4] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E2DFD7] bg-[#FAF9F6] px-4 pt-3 pb-6 space-y-3 shadow-xl">
          
          {/* Active Tournament Cards for Mobile */}
          {isJonathanActive && jonathanCurrentTournament && (
            <div className="p-3 bg-[#ECEAE4] border border-[#D9D6CC] rounded-lg flex items-center justify-between">
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest text-[#244437] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                  Jonathan • Live ({jonathanCurrentTournament.final_score_to_par})
                </span>
                <p className="text-xs font-bold text-[#202421] leading-tight mt-0.5">{jonathanCurrentTournament.name}</p>
              </div>
              <a
                href={jonathanCurrentTournament.leaderboard_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 bg-[#244437] text-white text-[11px] font-bold rounded flex items-center gap-1"
              >
                <span>LEADERBOARD</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {isTimActive && timCurrentTournament && (
            <div className="p-3 bg-[#ECEAE4] border border-[#D9D6CC] rounded-lg flex items-center justify-between">
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest text-[#244437] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                  Tim • Live ({timCurrentTournament.final_score_to_par})
                </span>
                <p className="text-xs font-bold text-[#202421] leading-tight mt-0.5">{timCurrentTournament.name}</p>
              </div>
              <a
                href={timCurrentTournament.leaderboard_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 bg-[#244437] text-white text-[11px] font-bold rounded flex items-center gap-1"
              >
                <span>LEADERBOARD</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const isActive = activeView === item.id || 
                (item.id === 'partner-with-us' && (activeView === 'partners' || activeView === 'sponsorship')) ||
                (item.id === 'jonathan' && activeView === 'profile');
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded text-sm font-bold tracking-wider text-left transition-colors uppercase ${
                    isActive
                      ? 'bg-[#ECEAE4] text-[#244437] border-l-4 border-[#244437]'
                      : 'text-[#656A65] hover:bg-[#ECEAE4]/60 hover:text-[#202421]'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#656A65]" />
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#E2DFD7] flex items-center justify-between">
            <button
              onClick={() => handleNavClick('admin')}
              className="flex items-center gap-2 text-xs font-semibold text-[#656A65] hover:text-[#202421] py-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#244437]" />
              <span>Nielsen Golf Admin Hub</span>
            </button>
            <span className="text-[11px] text-[#656A65]">PGA TOUR Americas</span>
          </div>
        </div>
      )}
    </header>
  );
};
