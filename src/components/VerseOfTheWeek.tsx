import React from 'react';
import { siteContent } from '../data/siteContent';

export const VerseOfTheWeek: React.FC = () => {
  const { verseOfTheWeek } = siteContent;

  return (
    <section className="bg-[#ECEAE4] border-y border-[#D9D6CC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-10 sm:w-16 bg-[#B49A6A]/70" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#244437]">
              Verse of the Week
            </span>
            <span className="h-px w-10 sm:w-16 bg-[#B49A6A]/70" />
          </div>

          <p className="font-serif text-2xl sm:text-3xl lg:text-4xl leading-relaxed text-[#202421]">
            “{verseOfTheWeek.text}”
          </p>

          <p className="mt-5 text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-[#244437]">
            {verseOfTheWeek.reference}
          </p>

          <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A806C]">
            Grounded in purpose
          </p>
        </div>
      </div>
    </section>
  );
};
