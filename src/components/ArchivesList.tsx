import React from 'react';
import { GazetteEdition } from '../types';
import { BookOpen, Calendar, ArrowRight, Quote } from 'lucide-react';
import { sound } from '../utils/audio';

interface ArchivesListProps {
  editions: GazetteEdition[];
  currentEditionId: string;
  onSelectEdition: (edition: GazetteEdition) => void;
}

export const ArchivesList: React.FC<ArchivesListProps> = ({
  editions,
  currentEditionId,
  onSelectEdition,
}) => {
  return (
    <div className="w-full">
      <div className="border-b-2 border-stone-900 pb-3 mb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-600 font-bold mb-1">
          <span>Salle des Reliures du Quotidien</span>
          <span>·</span>
          <span>{editions.length} Numéros Archivés</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-['Fraunces',Georgia,serif] text-stone-950 uppercase tracking-tight">
          ARCHIVES & NUMÉROS HISTORIQUES
        </h2>
        <p className="text-sm font-serif italic text-stone-700 mt-1 max-w-2xl">
          Retrouvez les scandales passés, les débâcles légendaires et les déclarations d'après-match qui ont fait trembler la ligue MPG.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {editions.map((edition, idx) => {
          const isCurrent = edition.id === currentEditionId;
          return (
            <div
              key={edition.id || idx}
              className={`border-2 transition-all p-5 flex flex-col justify-between ${
                isCurrent
                  ? 'border-amber-800 bg-[#fdfaf3] shadow-md ring-2 ring-amber-800/20'
                  : 'border-stone-400 bg-white hover:border-stone-900 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-stone-500 border-b border-stone-200 pb-2 mb-3">
                  <span className="font-bold uppercase text-stone-800">
                    {edition.edition}
                  </span>
                  <span>{edition.dateStr || 'Saison 1986'}</span>
                </div>

                <h3 className="font-['Oswald',sans-serif] text-lg sm:text-xl font-bold uppercase text-stone-950 leading-snug line-clamp-2 mb-2">
                  {edition.headline}
                </h3>

                <p className="font-serif italic text-xs text-stone-700 line-clamp-3 mb-4 leading-relaxed">
                  « {edition.subheadline} »
                </p>

                {/* Micro quote preview */}
                {edition.quotes_of_the_week?.[0] && (
                  <div className="bg-stone-100 p-2 text-[11px] font-serif border-l-2 border-amber-800 mb-4">
                    <span className="font-mono font-bold text-stone-900 block">
                      {edition.quotes_of_the_week[0].author} :
                    </span>
                    <span className="italic text-stone-700 line-clamp-2">
                      « {edition.quotes_of_the_week[0].quote} »
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between mt-auto">
                {isCurrent ? (
                  <span className="text-xs font-mono font-bold text-amber-900 uppercase">
                    ★ En cours de lecture
                  </span>
                ) : (
                  <span className="text-xs font-mono text-stone-400">
                    Archivé
                  </span>
                )}
                <button
                  onClick={() => {
                    sound.playTypewriter();
                    onSelectEdition(edition);
                  }}
                  className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-colors ${
                    isCurrent
                      ? 'bg-amber-900 text-white'
                      : 'bg-stone-900 hover:bg-stone-800 text-stone-100'
                  }`}
                >
                  <span>Feuilleter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
