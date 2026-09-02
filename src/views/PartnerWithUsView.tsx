import React, { useState } from 'react';
import { useGolfData } from '../context/GolfDataContext';
import { formatCurrency } from '../utils/statsCalculator';
import {
  Heart,
  TrendingUp,
  Briefcase,
  ShieldAlert,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Users,
  Target,
  Mail,
  Building,
  DollarSign,
  Award,
  ChevronDown,
  Info,
  Check,
  Send,
  Lock
} from 'lucide-react';

interface PartnerWithUsViewProps {
  defaultSection?: 'donate' | 'invest' | 'sponsor' | 'partners';
}

export const PartnerWithUsView: React.FC<PartnerWithUsViewProps> = ({ defaultSection }) => {
  const {
    sponsors,
    sponsorshipPackages,
    donations,
    investmentOpportunities,
    createDonation,
    submitInvestorInquiry,
    submitSponsorInquiry,
    jonathan,
    tim
  } = useGolfData();

  // Athlete filter state
  const [selectedAthleteFilter, setSelectedAthleteFilter] = useState<'all' | 'jonathan' | 'tim'>('all');

  // Donation form state
  const [selectedDonationAmount, setSelectedDonationAmount] = useState<number | 'custom'>(250);
  const [customDonationAmount, setCustomDonationAmount] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorTarget, setDonorTarget] = useState<'both' | 'jonathan' | 'tim'>('both');
  const [donorMessage, setDonorMessage] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [donationSuccess, setDonationSuccess] = useState<boolean>(false);
  const [isSubmittingDonation, setIsSubmittingDonation] = useState<boolean>(false);

  // Investor Inquiry modal / form state
  const [showInvestorModal, setShowInvestorModal] = useState<boolean>(false);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string>('');
  const [investorName, setInvestorName] = useState<string>('');
  const [investorEmail, setInvestorEmail] = useState<string>('');
  const [investorPhone, setInvestorPhone] = useState<string>('');
  const [investorRange, setInvestorRange] = useState<string>('$10,000 - $25,000');
  const [investorAthletePref, setInvestorAthletePref] = useState<'both' | 'jonathan' | 'tim'>('both');
  const [isAccredited, setIsAccredited] = useState<boolean>(true);
  const [investorMessage, setInvestorMessage] = useState<string>('');
  const [investorSuccess, setInvestorSuccess] = useState<boolean>(false);
  const [isSubmittingInvestor, setIsSubmittingInvestor] = useState<boolean>(false);

  // Sponsor Inquiry modal / form state
  const [showSponsorModal, setShowSponsorModal] = useState<boolean>(false);
  const [selectedPackageName, setSelectedPackageName] = useState<string>('');
  const [sponsorName, setSponsorName] = useState<string>('');
  const [sponsorCompany, setSponsorCompany] = useState<string>('');
  const [sponsorEmail, setSponsorEmail] = useState<string>('');
  const [sponsorPhone, setSponsorPhone] = useState<string>('');
  const [sponsorAthletePref, setSponsorAthletePref] = useState<'both' | 'jonathan' | 'tim'>('both');
  const [sponsorBudget, setSponsorBudget] = useState<string>('$15,000 - $35,000');
  const [sponsorAreas, setSponsorAreas] = useState<string[]>(['Hat / Apparel Branding']);
  const [sponsorMessage, setSponsorMessage] = useState<string>('');
  const [sponsorSuccess, setSponsorSuccess] = useState<boolean>(false);
  const [isSubmittingSponsor, setIsSubmittingSponsor] = useState<boolean>(false);

  // Quick jump helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = selectedDonationAmount === 'custom' ? parseFloat(customDonationAmount) : selectedDonationAmount;
    if (!finalAmount || finalAmount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }
    if (!donorEmail) {
      alert('Please provide an email address for your receipt.');
      return;
    }

    try {
      setIsSubmittingDonation(true);
      await createDonation({
        amount: finalAmount,
        donor_name: isAnonymous ? 'Anonymous Supporter' : (donorName || 'Supporter'),
        email: donorEmail,
        supports_both: donorTarget === 'both',
        player_id: donorTarget === 'jonathan' ? 'jonathan-nielsen-1' : donorTarget === 'tim' ? 'tim-nielsen-2' : undefined,
        anonymous: isAnonymous,
        public_recognition: !isAnonymous,
        message: donorMessage,
        payment_provider: 'Stripe'
      });
      setDonationSuccess(true);
    } catch (err) {
      console.error(err);
      alert('There was an error processing your contribution. Please try again.');
    } finally {
      setIsSubmittingDonation(false);
    }
  };

  const handleInvestorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!investorName || !investorEmail) {
      alert('Please provide your name and email address.');
      return;
    }

    try {
      setIsSubmittingInvestor(true);
      await submitInvestorInquiry({
        name: investorName,
        email: investorEmail,
        phone: investorPhone,
        investment_interest: investorRange,
        player_preference: investorAthletePref,
        accredited_investor: isAccredited,
        message: `${selectedOpportunityId ? `[Opportunity ID: ${selectedOpportunityId}] ` : ''}${investorMessage}`
      });
      setInvestorSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Error submitting inquiry. Please try again.');
    } finally {
      setIsSubmittingInvestor(false);
    }
  };

  const handleSponsorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorName || !sponsorCompany || !sponsorEmail) {
      alert('Please provide your name, company, and email address.');
      return;
    }

    try {
      setIsSubmittingSponsor(true);
      await submitSponsorInquiry({
        name: sponsorName,
        company: sponsorCompany,
        email: sponsorEmail,
        phone: sponsorPhone,
        player_preference: sponsorAthletePref,
        budget_range: sponsorBudget,
        areas_of_interest: sponsorAreas,
        message: `${selectedPackageName ? `[Package: ${selectedPackageName}] ` : ''}${sponsorMessage}`
      });
      setSponsorSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Error submitting sponsorship inquiry. Please try again.');
    } finally {
      setIsSubmittingSponsor(false);
    }
  };

  const toggleSponsorArea = (area: string) => {
    if (sponsorAreas.includes(area)) {
      setSponsorAreas(sponsorAreas.filter(a => a !== area));
    } else {
      setSponsorAreas([...sponsorAreas, area]);
    }
  };

  // Filtered sponsors
  const activeSponsors = sponsors.filter(s => s.active !== false);
  const filteredSponsors = activeSponsors.filter(s => {
    if (selectedAthleteFilter === 'jonathan') return s.supports_jonathan || s.sponsored_players === 'jonathan' || s.sponsored_players === 'both';
    if (selectedAthleteFilter === 'tim') return s.supports_tim || s.sponsored_players === 'tim' || s.sponsored_players === 'both';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F5F3EE] text-[#202421]">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-16 pb-20 border-b border-[#E2DFD7] bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ECEAE4] border border-[#D9D6CC] text-[#244437] text-xs font-bold tracking-wider uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#B49A6A]" />
            Partnership &amp; Investment Portal
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#202421] max-w-4xl mx-auto leading-none mb-6">
            PARTNER WITH NIELSEN GOLF
          </h1>

          <p className="text-xl sm:text-2xl text-[#244437] font-serif font-medium max-w-3xl mx-auto mb-8 leading-relaxed">
            Join Jonathan and Tim Nielsen as they pursue professional golf at the highest level.
          </p>

          <p className="text-base sm:text-lg text-[#656A65] max-w-3xl mx-auto leading-relaxed mb-10">
            Professional golf requires significant annual capital investment in tournament entry fees, weekly travel, lodging, world-class coaching, fitness programming, and specialized equipment. Nielsen Golf offers supporters, private investors, and corporate partners three structured, transparent pathways to participate in our journey to the PGA TOUR.
          </p>

          {/* Quick jump navigation buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => scrollToSection('donate-section')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[#244437] hover:bg-[#1b342a] text-white font-bold text-sm tracking-wider uppercase transition-colors shadow-sm"
            >
              <Heart className="w-4 h-4 text-[#B49A6A]" />
              01. Donate
            </button>
            <button
              onClick={() => scrollToSection('invest-section')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[#26364A] hover:bg-[#1d2a3a] text-white font-bold text-sm tracking-wider uppercase transition-colors shadow-sm"
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              02. Invest
            </button>
            <button
              onClick={() => scrollToSection('sponsor-section')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[#FAF9F6] border-2 border-[#244437] hover:bg-[#ECEAE4] text-[#244437] font-bold text-sm tracking-wider uppercase transition-colors"
            >
              <Briefcase className="w-4 h-4 text-[#244437]" />
              03. Sponsor
            </button>
            <button
              onClick={() => scrollToSection('partners-wall')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[#ECEAE4] hover:bg-[#dedad0] text-[#656A65] hover:text-[#202421] font-semibold text-sm tracking-wider uppercase transition-colors border border-[#D9D6CC]"
            >
              <Building className="w-4 h-4" />
              Current Partners
            </button>
          </div>
        </div>
      </section>

      {/* ================= 3 PILLARS OVERVIEW ================= */}
      <section className="py-12 border-b border-[#E2DFD7] bg-[#ECEAE4]/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Donate Pillar */}
            <div
              onClick={() => scrollToSection('donate-section')}
              className="p-6 rounded-lg bg-[#FAF9F6] border border-[#E2DFD7] hover:border-[#244437] transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-[#244437]/10 flex items-center justify-center text-[#244437] mb-4 group-hover:scale-105 transition-transform">
                  <Heart className="w-6 h-6 text-[#244437]" />
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#B49A6A] mb-1">Pillar One</div>
                <h3 className="font-display font-black text-xl text-[#202421] mb-2">DONATE</h3>
                <p className="text-sm text-[#656A65] leading-relaxed mb-4">
                  Grassroots fan support directly offsetting weekly tour expenses, airfare, and equipment. Simple, instant, and transparent.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#244437] group-hover:underline">
                Make a Contribution <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Invest Pillar */}
            <div
              onClick={() => scrollToSection('invest-section')}
              className="p-6 rounded-lg bg-[#FAF9F6] border border-[#E2DFD7] hover:border-[#26364A] transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-[#26364A]/10 flex items-center justify-center text-[#26364A] mb-4 group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-6 h-6 text-[#26364A]" />
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#B49A6A] mb-1">Pillar Two</div>
                <h3 className="font-display font-black text-xl text-[#202421] mb-2">INVEST</h3>
                <p className="text-sm text-[#656A65] leading-relaxed mb-4">
                  Performance-backed athlete contracts for private backers seeking structured return sharing, percentage terms, and seasonal budget allocations.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#26364A] group-hover:underline">
                View Investment Terms <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Sponsor Pillar */}
            <div
              onClick={() => scrollToSection('sponsor-section')}
              className="p-6 rounded-lg bg-[#FAF9F6] border border-[#E2DFD7] hover:border-[#244437] transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-[#B49A6A]/15 flex items-center justify-center text-[#B49A6A] mb-4 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-6 h-6 text-[#244437]" />
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#B49A6A] mb-1">Pillar Three</div>
                <h3 className="font-display font-black text-xl text-[#202421] mb-2">SPONSOR</h3>
                <p className="text-sm text-[#656A65] leading-relaxed mb-4">
                  High-profile corporate branding on hats, apparel, and tour bags, paired with client corporate golf days and digital brand reach.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#244437] group-hover:underline">
                Explore Packages <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 01. DONATE SECTION ================= */}
      <section id="donate-section" className="py-20 border-b border-[#E2DFD7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#244437]/10 text-[#244437] text-xs font-bold tracking-wider uppercase mb-3">
              <Heart className="w-3.5 h-3.5 text-[#B49A6A]" />
              Pillar 01
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#202421] tracking-tight mb-4">
              DONATE — FAN &amp; SUPPORTER CONTRIBUTIONS
            </h2>
            <p className="text-base sm:text-lg text-[#656A65] leading-relaxed">
              Every professional golf season entails substantial out-of-pocket costs for entry fees, caddies, long-haul flights, and accommodation. Supporter contributions provide direct, immediate fuel for competition weeks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Donation Form Card */}
            <div className="lg:col-span-7 bg-[#FAF9F6] border border-[#E2DFD7] rounded-xl p-6 sm:p-8 shadow-sm">
              {donationSuccess ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-black text-2xl text-[#202421]">Thank You For Your Support!</h3>
                  <p className="text-sm text-[#656A65] max-w-md mx-auto">
                    Your contribution has been recorded and directly supports the Nielsen brothers' tournament travel and preparation. A confirmation has been sent to your email.
                  </p>
                  <button
                    onClick={() => {
                      setDonationSuccess(false);
                      setDonorName('');
                      setDonorEmail('');
                      setDonorMessage('');
                    }}
                    className="mt-4 px-6 py-2.5 rounded-md bg-[#244437] text-white text-xs font-bold tracking-wider uppercase hover:bg-[#1b342a]"
                  >
                    Make Another Contribution
                  </button>
                </div>
              ) : (
                <form onSubmit={handleDonationSubmit} className="space-y-6">
                  
                  {/* Select Recipient */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#202421] mb-2">
                      Who would you like to support?
                    </label>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => setDonorTarget('both')}
                        className={`py-3 px-3 rounded-lg text-xs font-bold tracking-wider text-center border transition-all ${
                          donorTarget === 'both'
                            ? 'bg-[#244437] text-white border-[#244437] shadow-sm'
                            : 'bg-white text-[#656A65] border-[#E2DFD7] hover:border-[#244437]'
                        }`}
                      >
                        Both Brothers (50/50)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDonorTarget('jonathan')}
                        className={`py-3 px-3 rounded-lg text-xs font-bold tracking-wider text-center border transition-all ${
                          donorTarget === 'jonathan'
                            ? 'bg-[#244437] text-white border-[#244437] shadow-sm'
                            : 'bg-white text-[#656A65] border-[#E2DFD7] hover:border-[#244437]'
                        }`}
                      >
                        Jonathan Nielsen
                      </button>
                      <button
                        type="button"
                        onClick={() => setDonorTarget('tim')}
                        className={`py-3 px-3 rounded-lg text-xs font-bold tracking-wider text-center border transition-all ${
                          donorTarget === 'tim'
                            ? 'bg-[#244437] text-white border-[#244437] shadow-sm'
                            : 'bg-white text-[#656A65] border-[#E2DFD7] hover:border-[#244437]'
                        }`}
                      >
                        Tim Nielsen
                      </button>
                    </div>
                  </div>

                  {/* Select Donation Amount */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#202421] mb-2">
                      Contribution Amount (USD)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-3">
                      {[250, 500, 1000, 2500].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setSelectedDonationAmount(amt);
                            setCustomDonationAmount('');
                          }}
                          className={`py-3 px-2 rounded-lg font-bold text-sm border transition-all ${
                            selectedDonationAmount === amt
                              ? 'bg-[#244437] text-white border-[#244437] shadow-sm'
                              : 'bg-white text-[#202421] border-[#E2DFD7] hover:border-[#244437]'
                          }`}
                        >
                          ${amt.toLocaleString()}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setSelectedDonationAmount('custom')}
                        className={`py-3 px-2 rounded-lg font-bold text-sm border col-span-2 sm:col-span-1 transition-all ${
                          selectedDonationAmount === 'custom'
                            ? 'bg-[#244437] text-white border-[#244437] shadow-sm'
                            : 'bg-white text-[#202421] border-[#E2DFD7] hover:border-[#244437]'
                        }`}
                      >
                        Custom Amount
                      </button>
                    </div>

                    {selectedDonationAmount === 'custom' && (
                      <div className="relative mt-2">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#656A65] font-bold text-base">$</span>
                        <input
                          type="number"
                          min="5"
                          step="5"
                          placeholder="Enter custom dollar amount"
                          value={customDonationAmount}
                          onChange={(e) => setCustomDonationAmount(e.target.value)}
                          className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-[#D9D6CC] bg-white text-[#202421] font-bold focus:outline-none focus:ring-2 focus:ring-[#244437]"
                          required
                        />
                      </div>
                    )}
                  </div>

                  {/* Donor Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#202421] mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        disabled={isAnonymous}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D6CC] bg-white text-[#202421] text-sm focus:outline-none focus:ring-2 focus:ring-[#244437] disabled:bg-[#ECEAE4] disabled:text-[#656A65]"
                        required={!isAnonymous}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#202421] mb-1.5">
                        Email Address (for receipt)
                      </label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D6CC] bg-white text-[#202421] text-sm focus:outline-none focus:ring-2 focus:ring-[#244437]"
                        required
                      />
                    </div>
                  </div>

                  {/* Anonymous Toggle */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="anonymous-toggle"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 rounded text-[#244437] focus:ring-[#244437] border-[#D9D6CC]"
                    />
                    <label htmlFor="anonymous-toggle" className="text-xs text-[#656A65] cursor-pointer">
                      Keep my contribution anonymous on the public supporter recognition wall
                    </label>
                  </div>

                  {/* Message of Encouragement */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#202421] mb-1.5">
                      Message of Encouragement (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Good luck at the upcoming PGA TOUR Americas events! Rooting for you both."
                      value={donorMessage}
                      onChange={(e) => setDonorMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D6CC] bg-white text-[#202421] text-sm focus:outline-none focus:ring-2 focus:ring-[#244437]"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmittingDonation}
                    className="w-full py-4 rounded-lg bg-[#244437] hover:bg-[#1b342a] text-white font-bold text-sm tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    {isSubmittingDonation ? (
                      'Processing Contribution...'
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-[#B49A6A]" />
                        Complete Contribution — ${selectedDonationAmount === 'custom' ? (customDonationAmount || '0') : selectedDonationAmount}
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-[#656A65]">
                    <ShieldAlert className="w-3.5 h-3.5 text-[#B49A6A]" />
                    Secure processing • 100% of proceeds go directly toward competitive season operations
                  </div>
                </form>
              )}
            </div>

            {/* Supporter Recognition Sidebar */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-[#ECEAE4] border border-[#D9D6CC] rounded-xl p-6">
                <h3 className="font-display font-black text-lg text-[#202421] mb-2 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#244437]" />
                  Recent Fan Supporters
                </h3>
                <p className="text-xs text-[#656A65] mb-4">
                  Thank you to the community members and supporters powering our tour schedule:
                </p>

                <div className="space-y-3">
                  {donations && donations.length > 0 ? (
                    donations.slice(0, 5).map((don) => (
                      <div key={don.id} className="p-3 bg-[#FAF9F6] rounded-lg border border-[#E2DFD7] text-xs">
                        <div className="flex items-center justify-between font-bold text-[#202421] mb-1">
                          <span>{don.anonymous ? 'Anonymous Supporter' : don.donor_name}</span>
                          <span className="text-[#244437]">{formatCurrency(don.amount)}</span>
                        </div>
                        {don.message && (
                          <p className="text-[#656A65] italic text-[11px] mb-1">"{don.message}"</p>
                        )}
                        <div className="text-[10px] text-[#656A65] uppercase tracking-wider">
                          {don.supports_both ? 'Supported Both Brothers' : don.player_id?.includes('jonathan') ? 'Supported Jonathan' : 'Supported Tim'} • {don.donation_date}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-[#656A65] italic p-4 text-center">
                      Be the first supporter to contribute this season!
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-[#FAF9F6] border border-[#E2DFD7] rounded-xl p-6 text-xs text-[#656A65] space-y-3">
                <h4 className="font-bold text-[#202421] uppercase tracking-wider text-xs">How Your Contribution Is Used:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#244437] shrink-0 mt-0.5" />
                    <span>Tournament entry fees ($1,500 - $3,000 per stage/event)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#244437] shrink-0 mt-0.5" />
                    <span>Air travel, vehicle rentals, and lodging for 20+ tour events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#244437] shrink-0 mt-0.5" />
                    <span>Caddie fees, fitness coaching, and practice facility access</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= 02. INVEST SECTION ================= */}
      <section id="invest-section" className="py-20 border-b border-[#E2DFD7] bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#26364A]/10 text-[#26364A] text-xs font-bold tracking-wider uppercase mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
              Pillar 02
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#202421] tracking-tight mb-4 uppercase">
              INVEST — PLAYER INVESTMENT PRESENTATIONS
            </h2>
            <p className="text-base sm:text-lg text-[#656A65] leading-relaxed">
              For accredited investors, syndicates, and private backers seeking performance participation agreements. Request our confidential Player Investment Presentations detailing contractual agreement terms, return percentage structures, seasonal expense schedules, and tour qualifying pathways.
            </p>
          </div>

          {/* Two Player Investment Presentation Request Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            
            {/* Box 1: Jonathan Nielsen */}
            <div className="bg-[#F5F3EE] border-2 border-[#D9D6CC] hover:border-emerald-800 rounded-2xl p-7 sm:p-9 flex flex-col justify-between transition-all shadow-sm group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded bg-emerald-900 text-emerald-200 text-xs font-black tracking-wider uppercase font-mono">
                    PGA TOUR Americas • APGA Tour
                  </span>
                  <span className="text-xs font-extrabold tracking-wider text-emerald-800 uppercase">
                    Jonathan Nielsen
                  </span>
                </div>

                <h3 className="font-display font-black text-2xl sm:text-3xl text-[#202421] mb-3">
                  Jonathan Nielsen — Player Investment Presentation
                </h3>
                <p className="text-xs sm:text-sm text-[#656A65] leading-relaxed mb-6">
                  Comprehensive performance investment proposal outlining Jonathan’s 2026-2027 competitive campaign across PGA TOUR Americas, APGA Tour, and Korn Ferry Tour / PGA TOUR qualifying stages.
                </p>

                {/* What Presentation Contains */}
                <div className="bg-white p-5 rounded-xl border border-[#D9D6CC] mb-6 space-y-3">
                  <span className="text-xs font-black text-[#202421] uppercase tracking-wider block">
                    Presentation Deck Includes:
                  </span>
                  <ul className="space-y-2.5 text-xs text-[#202421]">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span><strong>Terms of the Agreement:</strong> Multi-stage contractual participation terms, preferred return hurdles, and distribution timelines.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span><strong>Contractual Percentages:</strong> Detailed breakdown of pro-rata return percentages across sanctioned tour events and promotion bonuses.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span><strong>Tour Expense Budgets:</strong> Itemized schedule for tournament entries, elite swing coaching, caddie fees, and international logistics.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span><strong>Career Metrics &amp; Milestones:</strong> All-American collegiate record, scoring averages, and developmental trajectory milestones.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <button
                  onClick={() => {
                    setSelectedOpportunityId('inv-opp-jonathan');
                    setInvestorAthletePref('jonathan');
                    setShowInvestorModal(true);
                    setInvestorSuccess(false);
                  }}
                  className="w-full py-4 rounded-xl bg-[#244437] hover:bg-[#1b342a] text-white font-black text-xs tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                >
                  <span>Request Jonathan's Investment Presentation</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>

            {/* Box 2: Tim Nielsen */}
            <div className="bg-[#F5F3EE] border-2 border-[#D9D6CC] hover:border-blue-800 rounded-2xl p-7 sm:p-9 flex flex-col justify-between transition-all shadow-sm group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded bg-blue-900 text-blue-200 text-xs font-black tracking-wider uppercase font-mono">
                    Asian Development Tour (ADT)
                  </span>
                  <span className="text-xs font-extrabold tracking-wider text-blue-800 uppercase">
                    Tim Nielsen
                  </span>
                </div>

                <h3 className="font-display font-black text-2xl sm:text-3xl text-[#202421] mb-3">
                  Tim Nielsen — Player Investment Presentation
                </h3>
                <p className="text-xs sm:text-sm text-[#656A65] leading-relaxed mb-6">
                  Structured performance investment proposal supporting Tim’s full campaign across the Asian Development Tour (ADT), international staging events, and Asian Tour qualifying pathway.
                </p>

                {/* What Presentation Contains */}
                <div className="bg-white p-5 rounded-xl border border-[#D9D6CC] mb-6 space-y-3">
                  <span className="text-xs font-black text-[#202421] uppercase tracking-wider block">
                    Presentation Deck Includes:
                  </span>
                  <ul className="space-y-2.5 text-xs text-[#202421]">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                      <span><strong>Terms of the Agreement:</strong> Formal athlete participation contract, investment horizons, and capital governance structure.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                      <span><strong>Contractual Percentages:</strong> Specific return share percentages on ADT Order of Merit events and Asian Tour qualification milestones.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                      <span><strong>Tour Expense Budgets:</strong> Itemized operational budget for Asia-Pacific travel logistics, performance coaching, and equipment preparation.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                      <span><strong>Tour Pathway Trajectory:</strong> ADT schedule roadmap, historical performance markers, and strategic advancement projections.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <button
                  onClick={() => {
                    setSelectedOpportunityId('inv-opp-tim');
                    setInvestorAthletePref('tim');
                    setShowInvestorModal(true);
                    setInvestorSuccess(false);
                  }}
                  className="w-full py-4 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] text-white font-black text-xs tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                >
                  <span>Request Tim's Investment Presentation</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>

          </div>

          {/* Mandatory Regulatory / Risk Disclosure Banner */}
          <div className="p-6 rounded-xl bg-[#ECEAE4] border border-[#D9D6CC] text-xs text-[#656A65] flex items-start gap-4">
            <ShieldAlert className="w-6 h-6 text-[#B49A6A] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold uppercase tracking-wider text-[#202421]">Important Investment &amp; Risk Disclosure:</div>
              <p>
                Professional tournament golf involves substantial financial and competitive athletic risk. Past performance and collegiate achievements do not guarantee future competitive outcomes. Participation agreements and return schedules are governed by formal private contracts with qualified backers and accredited investors where applicable.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ================= 03. SPONSOR SECTION ================= */}
      <section id="sponsor-section" className="py-20 border-b border-[#E2DFD7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#B49A6A]/20 text-[#244437] text-xs font-bold tracking-wider uppercase mb-3">
              <Briefcase className="w-3.5 h-3.5 text-[#244437]" />
              Pillar 03
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#202421] tracking-tight mb-4">
              SPONSOR — CORPORATE BRANDING &amp; PARTNERSHIPS
            </h2>
            <p className="text-base sm:text-lg text-[#656A65] leading-relaxed">
              Align your company with two of professional golf's most promising rising talents. Our sponsorship packages combine high-frequency brand exposure on national television and social channels with bespoke corporate golf experiences for your key executives and clients.
            </p>
          </div>

          {/* Sponsorship Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {sponsorshipPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-xl p-6 sm:p-7 flex flex-col justify-between border transition-all shadow-sm ${
                  pkg.tier.includes('Title') || pkg.tier.includes('Primary')
                    ? 'bg-[#FAF9F6] border-2 border-[#244437] ring-1 ring-[#244437]/20'
                    : 'bg-[#FAF9F6] border-[#E2DFD7] hover:border-[#244437]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-extrabold tracking-widest text-[#B49A6A] uppercase">
                      {pkg.tier}
                    </span>
                    <span className="text-[10px] font-semibold text-[#656A65] uppercase px-2 py-0.5 rounded bg-[#ECEAE4]">
                      {pkg.billing_frequency}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-2xl text-[#202421] mb-2">{pkg.name}</h3>
                  <div className="text-lg font-bold text-[#244437] mb-4">{pkg.price}</div>
                  <p className="text-xs text-[#656A65] leading-relaxed mb-6">{pkg.description}</p>

                  {/* Key Package Deliverables */}
                  <div className="space-y-2.5 text-xs text-[#202421] mb-6 pt-4 border-t border-[#E2DFD7]">
                    {pkg.logo_placements && pkg.logo_placements.length > 0 && (
                      <div>
                        <span className="font-bold text-[11px] uppercase tracking-wider text-[#656A65] block mb-1">Logo Placement:</span>
                        <div className="flex flex-wrap gap-1">
                          {pkg.logo_placements.map((loc, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-[#ECEAE4] text-[11px] font-medium text-[#202421]">
                              {loc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {pkg.corporate_golf_days && (
                      <div className="flex justify-between py-1 border-b border-[#E2DFD7]">
                        <span className="text-[#656A65]">Corporate Golf Days:</span>
                        <span className="font-bold">{pkg.corporate_golf_days}</span>
                      </div>
                    )}

                    {pkg.appearance_days && (
                      <div className="flex justify-between py-1 border-b border-[#E2DFD7]">
                        <span className="text-[#656A65]">Appearance Days:</span>
                        <span className="font-bold">{pkg.appearance_days}</span>
                      </div>
                    )}

                    {pkg.exclusivity && (
                      <div className="flex justify-between py-1">
                        <span className="text-[#656A65]">Industry Exclusivity:</span>
                        <span className="font-bold">{pkg.exclusivity}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => {
                      setSelectedPackageName(pkg.name);
                      setShowSponsorModal(true);
                      setSponsorSuccess(false);
                    }}
                    className={`w-full py-3 rounded-lg font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 ${
                      pkg.tier.includes('Title') || pkg.tier.includes('Primary')
                        ? 'bg-[#244437] hover:bg-[#1b342a] text-white'
                        : 'bg-[#ECEAE4] hover:bg-[#dedad0] text-[#202421]'
                    }`}
                  >
                    Inquire For Package <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Brand Partnership CTA */}
          <div className="bg-[#244437] text-white rounded-xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl">
              <h3 className="font-display font-black text-2xl sm:text-3xl tracking-tight mb-2">
                Need a Custom Corporate Partnership?
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                We craft tailored partnerships for equipment manufacturers, apparel brands, corporate clients, hospitality sponsors, and regional Danish and North American enterprises.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedPackageName('Custom Partnership Inquiry');
                setShowSponsorModal(true);
                setSponsorSuccess(false);
              }}
              className="px-6 py-3.5 rounded-md bg-[#FAF9F6] text-[#244437] hover:bg-white font-bold text-xs tracking-wider uppercase transition-colors shrink-0 shadow-sm"
            >
              Contact Partnership Team
            </button>
          </div>

        </div>
      </section>

      {/* ================= 04. PROUDLY SUPPORTED BY LOGO WALL ================= */}
      <section id="partners-wall" className="py-20 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#ECEAE4] text-[#656A65] text-xs font-bold tracking-wider uppercase mb-3">
                <Building className="w-3.5 h-3.5 text-[#244437]" />
                Corporate Family
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-[#202421] tracking-tight">
                PROUDLY SUPPORTED BY
              </h2>
              <p className="text-sm text-[#656A65] mt-1 max-w-xl">
                We are proud to represent industry-leading companies and organizations on tour around the world.
              </p>
            </div>

            {/* Filter by player */}
            <div className="flex items-center gap-2 bg-[#ECEAE4] p-1 rounded-lg border border-[#D9D6CC] self-start md:self-auto">
              <button
                onClick={() => setSelectedAthleteFilter('all')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold tracking-wider uppercase transition-colors ${
                  selectedAthleteFilter === 'all'
                    ? 'bg-white text-[#202421] shadow-sm'
                    : 'text-[#656A65] hover:text-[#202421]'
                }`}
              >
                All Partners ({activeSponsors.length})
              </button>
              <button
                onClick={() => setSelectedAthleteFilter('jonathan')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold tracking-wider uppercase transition-colors ${
                  selectedAthleteFilter === 'jonathan'
                    ? 'bg-white text-[#202421] shadow-sm'
                    : 'text-[#656A65] hover:text-[#202421]'
                }`}
              >
                Jonathan
              </button>
              <button
                onClick={() => setSelectedAthleteFilter('tim')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold tracking-wider uppercase transition-colors ${
                  selectedAthleteFilter === 'tim'
                    ? 'bg-white text-[#202421] shadow-sm'
                    : 'text-[#656A65] hover:text-[#202421]'
                }`}
              >
                Tim
              </button>
            </div>
          </div>

          {/* Logo Wall Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className="bg-[#F5F3EE] border border-[#E2DFD7] rounded-xl p-6 hover:border-[#244437] transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="h-28 flex items-center justify-center p-4 bg-white rounded-lg border border-[#E2DFD7] mb-5 overflow-hidden">
                    <img
                      src={sponsor.logo}
                      alt={sponsor.company_name}
                      referrerPolicy="no-referrer"
                      className="max-h-16 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#244437]">
                      {sponsor.tier}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#ECEAE4] text-[#656A65]">
                      {sponsor.category}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-xl text-[#202421] mb-2">{sponsor.company_name}</h3>
                  <p className="text-xs text-[#656A65] leading-relaxed mb-4">{sponsor.description}</p>
                </div>

                <div className="pt-4 border-t border-[#E2DFD7] flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-[#656A65]">
                    {sponsor.supports_both || sponsor.sponsored_players === 'both'
                      ? 'Jonathan & Tim Nielsen'
                      : sponsor.supports_jonathan || sponsor.sponsored_players === 'jonathan'
                      ? 'Jonathan Nielsen'
                      : 'Tim Nielsen'}
                  </span>

                  {sponsor.website && (
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-[#244437] hover:underline"
                    >
                      Visit Site <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= INVESTOR MODAL ================= */}
      {showInvestorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF9F6] border border-[#E2DFD7] rounded-xl max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setShowInvestorModal(false)}
              className="absolute top-4 right-4 text-[#656A65] hover:text-[#202421] text-lg font-bold"
            >
              ✕
            </button>

            {investorSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-display font-black text-2xl text-[#202421]">Presentation Request Received</h3>
                <p className="text-sm text-[#656A65]">
                  Thank you for your interest in Nielsen Golf. Our management team will send the confidential Player Investment Presentation containing contractual agreement terms, pro-rata percentages, seasonal budgets, and distribution schedules.
                </p>
                <button
                  onClick={() => setShowInvestorModal(false)}
                  className="mt-4 px-6 py-2.5 rounded-md bg-[#244437] text-white text-xs font-bold tracking-wider uppercase"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleInvestorSubmit} className="space-y-4">
                <div className="mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">Pillar 02 • Investment Presentation</span>
                  <h3 className="font-display font-black text-2xl text-[#202421]">Request Player Investment Presentation</h3>
                  <p className="text-xs text-[#656A65] mt-1">
                    Receive the complete athlete presentation deck detailing terms of the agreement, percentages, tour budget allocations, and performance payout structures.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#202421] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Smith"
                    value={investorName}
                    onChange={(e) => setInvestorName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D6CC] bg-white text-[#202421] text-sm focus:ring-2 focus:ring-[#26364A] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#202421] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={investorEmail}
                      onChange={(e) => setInvestorEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D6CC] bg-white text-[#202421] text-sm focus:ring-2 focus:ring-[#26364A] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#202421] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={investorPhone}
                      onChange={(e) => setInvestorPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D6CC] bg-white text-[#202421] text-sm focus:ring-2 focus:ring-[#26364A] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#202421] mb-1">
                      Target Investment Range
                    </label>
                    <select
                      value={investorRange}
                      onChange={(e) => setInvestorRange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D6CC] bg-white text-[#202421] text-sm focus:ring-2 focus:ring-[#26364A] outline-none"
                    >
                      <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                      <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                      <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                      <option value="$50,000+">$50,000+ (Full Season Underwriting)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#202421] mb-1">
                      Player Preference
                    </label>
                    <select
                      value={investorAthletePref}
                      onChange={(e) => setInvestorAthletePref(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D6CC] bg-white text-[#202421] text-sm focus:ring-2 focus:ring-[#26364A] outline-none"
                    >
                      <option value="both">Both Brothers (Combined Syndicate)</option>
                      <option value="jonathan">Jonathan Nielsen</option>
                      <option value="tim">Tim Nielsen</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="accredited-check"
                    checked={isAccredited}
                    onChange={(e) => setIsAccredited(e.target.checked)}
                    className="w-4 h-4 rounded text-[#26364A] focus:ring-[#26364A] border-[#D9D6CC]"
                  />
                  <label htmlFor="accredited-check" className="text-xs text-[#656A65] cursor-pointer">
                    I am an accredited investor or represent a qualified investment entity
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#202421] mb-1">
                    Questions or Specific Areas of Interest
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tell us about your background or any specific contract term requirements..."
                    value={investorMessage}
                    onChange={(e) => setInvestorMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D6CC] bg-white text-[#202421] text-sm focus:ring-2 focus:ring-[#26364A] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingInvestor}
                  className="w-full py-3.5 rounded-lg bg-[#244437] hover:bg-[#1b342a] text-white font-bold text-xs tracking-wider uppercase transition-colors"
                >
                  {isSubmittingInvestor ? 'Submitting Request...' : 'Submit Presentation Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= SPONSOR MODAL ================= */}
      {showSponsorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF9F6] border border-[#E2DFD7] rounded-xl max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setShowSponsorModal(false)}
              className="absolute top-4 right-4 text-[#656A65] hover:text-[#202421] text-lg font-bold"
            >
              ✕
            </button>

            {sponsorSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-display font-black text-2xl text-[#202421]">Sponsorship Inquiry Received</h3>
                <p className="text-sm text-[#656A65]">
                  Thank you for your interest in partnering with Nielsen Golf. Our corporate partnership team will prepare a tailored presentation and contact you within 24–48 hours.
                </p>
                <button
                  onClick={() => setShowSponsorModal(false)}
                  className="mt-4 px-6 py-2.5 rounded-md bg-[#244437] text-white text-xs font-bold tracking-wider uppercase"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSponsorSubmit} className="space-y-4">
                <div className="mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#B49A6A]">Pillar 03 • Brand Partnership</span>
                  <h3 className="font-display font-black text-2xl text-[#202421]">Corporate Sponsorship Inquiry</h3>
                  {selectedPackageName && (
                    <p className="text-xs font-bold text-[#244437] mt-1">Package: {selectedPackageName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#202421] mb-1">
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Alex Taylor"
                      value={sponsorName}
                      onChange={(e) => setSponsorName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D6CC] bg-white text-[#202421] text-sm focus:ring-2 focus:ring-[#244437] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#202421] mb-1">
                      Company / Organization *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Acme Corp"
                      value={sponsorCompany}
                      onChange={(e) => setSponsorCompany(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D6CC] bg-white text-[#202421] text-sm focus:ring-2 focus:ring-[#244437] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#202421] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@acme.com"
                      value={sponsorEmail}
                      onChange={(e) => setSponsorEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D6CC] bg-white text-[#202421] text-sm focus:ring-2 focus:ring-[#244437] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#202421] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={sponsorPhone}
                      onChange={(e) => setSponsorPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D6CC] bg-white text-[#202421] text-sm focus:ring-2 focus:ring-[#244437] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#202421] mb-1">
                      Athlete Focus
                    </label>
                    <select
                      value={sponsorAthletePref}
                      onChange={(e) => setSponsorAthletePref(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D6CC] bg-white text-[#202421] text-sm focus:ring-2 focus:ring-[#244437] outline-none"
                    >
                      <option value="both">Both Jonathan &amp; Tim Nielsen</option>
                      <option value="jonathan">Jonathan Nielsen</option>
                      <option value="tim">Tim Nielsen</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#202421] mb-1">
                      Estimated Budget
                    </label>
                    <select
                      value={sponsorBudget}
                      onChange={(e) => setSponsorBudget(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D6CC] bg-white text-[#202421] text-sm focus:ring-2 focus:ring-[#244437] outline-none"
                    >
                      <option value="$5,000 - $15,000">$5,000 - $15,000 (Supporting Partner)</option>
                      <option value="$15,000 - $35,000">$15,000 - $35,000 (Official Apparel / Bag Partner)</option>
                      <option value="$35,000 - $75,000">$35,000 - $75,000 (Primary Hat / Title Partner)</option>
                      <option value="$75,000+">$75,000+ (Global Season Lead Sponsor)</option>
                    </select>
                  </div>
                </div>

                {/* Areas of interest checkboxes */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#202421] mb-1.5">
                    Assets of Interest
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['Hat Front Branding', 'Apparel Sleeve / Chest', 'Tour Bag Placement', 'Corporate Golf Days', 'Social & Digital Campaigns', 'Product Endorsement'].map((item) => (
                      <label key={item} className="flex items-center gap-2 cursor-pointer text-[#656A65]">
                        <input
                          type="checkbox"
                          checked={sponsorAreas.includes(item)}
                          onChange={() => toggleSponsorArea(item)}
                          className="rounded text-[#244437] focus:ring-[#244437] border-[#D9D6CC]"
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#202421] mb-1">
                    Partnership Goals &amp; Timeline
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tell us about your brand objectives and upcoming corporate golf needs..."
                    value={sponsorMessage}
                    onChange={(e) => setSponsorMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D6CC] bg-white text-[#202421] text-sm focus:ring-2 focus:ring-[#244437] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingSponsor}
                  className="w-full py-3.5 rounded-lg bg-[#244437] hover:bg-[#1b342a] text-white font-bold text-xs tracking-wider uppercase transition-colors"
                >
                  {isSubmittingSponsor ? 'Submitting Inquiry...' : 'Submit Partnership Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
