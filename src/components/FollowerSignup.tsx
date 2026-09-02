import React, { useState } from 'react';
import { useGolfData } from '../context/GolfDataContext';
import { Mail, CheckCircle2, Send, Sparkles, BellRing, ArrowRight, Check } from 'lucide-react';

export const FollowerSignup: React.FC = () => {
  const { subscribeFollower } = useGolfData();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [targetGolfer, setTargetGolfer] = useState<'both' | 'jonathan' | 'tim'>('both');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [showSampleNotification, setShowSampleNotification] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    try {
      setStatus('loading');
      const res = await subscribeFollower(email, firstName);
      setStatus('success');
      setMessage(res.message || 'You are now following Nielsen Golf tournament updates!');
      setEmail('');
      setFirstName('');
    } catch (err) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <section className="py-16 md:py-24 bg-[#ECEAE4] text-[#202421] relative overflow-hidden border-t border-[#D9D6CC]">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF9F6] border border-[#D9D6CC] text-[#244437] text-xs font-bold uppercase tracking-widest mb-4">
          <BellRing className="w-3.5 h-3.5 text-[#B49A6A]" />
          <span>Direct Supporter Dispatch</span>
        </div>

        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-[#202421] tracking-tight uppercase">
          Follow The Journey
        </h2>

        <p className="mt-4 text-base sm:text-lg text-[#656A65] max-w-2xl mx-auto leading-relaxed">
          Receive post-round tournament scoring digests, upcoming tee times, and career milestones for Jonathan and Tim Nielsen directly in your inbox.
        </p>

        {/* Signup Form Container */}
        <div className="mt-8 max-w-xl mx-auto bg-[#FAF9F6] border border-[#D9D6CC] rounded-xl p-6 sm:p-8 shadow-sm">
          {status === 'success' ? (
            <div className="py-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 mx-auto flex items-center justify-center text-[#244437]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#202421]">You're on the list!</h3>
              <p className="text-xs text-[#656A65]">{message}</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-2 text-xs font-bold text-[#244437] hover:underline"
              >
                Add another email address
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              
              {/* Golfer Select Pills */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#656A65] mb-1.5">
                  Follow Updates For:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'both', label: 'Both Brothers' },
                    { id: 'jonathan', label: 'Jonathan Only' },
                    { id: 'tim', label: 'Tim Only' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setTargetGolfer(option.id as any)}
                      className={`py-2 px-2 text-center rounded-lg text-xs font-bold uppercase tracking-wider transition-colors border ${
                        targetGolfer === option.id
                          ? 'bg-[#244437] text-white border-[#244437]'
                          : 'bg-white text-[#656A65] border-[#D9D6CC] hover:bg-[#ECEAE4]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#656A65] mb-1">
                    First Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Marcus"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D9D6CC] rounded-lg text-xs text-[#202421] placeholder-slate-400 focus:outline-none focus:border-[#244437]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#656A65] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@domain.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D9D6CC] rounded-lg text-xs text-[#202421] placeholder-slate-400 focus:outline-none focus:border-[#244437]"
                  />
                </div>
              </div>

              {status === 'error' && (
                <p className="text-xs text-rose-600 font-bold">{message}</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3.5 px-6 rounded-md bg-[#244437] hover:bg-[#1b342a] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <span>Subscribing...</span>
                ) : (
                  <>
                    <span>Subscribe to Tour Updates</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-1 text-[11px] text-[#656A65]">
                <span>Automated round digests. Unsubscribe anytime.</span>
                <button
                  type="button"
                  onClick={() => setShowSampleNotification(!showSampleNotification)}
                  className="text-[#244437] hover:underline font-bold"
                >
                  {showSampleNotification ? 'Hide Preview' : 'Preview Digest Sample'}
                </button>
              </div>
            </form>
          )}

          {/* Sample Notification Modal */}
          {showSampleNotification && (
            <div className="mt-4 pt-4 border-t border-[#D9D6CC] text-left bg-white p-4 rounded-lg border border-[#E2DFD7] text-xs">
              <div className="flex items-center justify-between text-[#656A65] pb-2 border-b border-[#E2DFD7]">
                <span className="font-bold text-[#202421]">Sample Post-Round Digest</span>
                <span className="text-[10px] text-[#244437] font-bold">Delivered Post-Round</span>
              </div>
              <div className="mt-2 space-y-1.5 text-[#202421]">
                <p className="font-bold text-xs">Subject: Jonathan Nielsen — ATB Classic Round 2 Score: 68 (-4)</p>
                <p className="text-xs text-[#656A65] leading-relaxed">
                  "Jonathan followed his opening 67 with a 4-under 68 Friday at Northern Bear Golf Club, carding five birdies against one bogey to move into T8 at 9-under par heading into the weekend."
                </p>
                <div className="pt-2 flex items-center gap-3 font-mono text-[#244437] text-[11px] font-bold">
                  <span>Total: 135 (-9)</span>
                  <span>•</span>
                  <span>Position: T8</span>
                  <span>•</span>
                  <span>Weekend Tee Time: 10:42 AM</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
