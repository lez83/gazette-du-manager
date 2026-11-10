import React from 'react';
import { Newspaper, Flame, Archive, Users, Printer } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  activeTab: 'une' | 'archives' | 'ecuries';
  setActiveTab: (tab: 'une' | 'archives' | 'ecuries') => void;
  onOpenRotative: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenRotative,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#fbf9f5] border-b border-stone-300 shadow-xs px-4 md:px-8 py-3.5 no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark in single-element display face */}
        <button
          onClick={() => {
            sound.playTypewriter();
            setActiveTab('une');
          }}
          className="text-lg md:text-xl font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 flex items-center gap-2 hover:opacity-85 transition-opacity"
        >
          <Newspaper className="w-5 h-5 text-amber-800" />
          <span className="font-['Fraunces',Georgia,serif] tracking-normal font-black uppercase text-amber-950">
            La Gazette du Manager
          </span>
        </button>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button
            onClick={() => {
              sound.playTypewriter();
              setActiveTab('une');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'une'
                ? 'text-amber-900 font-bold border-b-2 border-amber-900'
                : 'hover:text-stone-900'
            }`}
          >
            La Une du Jour
          </button>
          <button
            onClick={() => {
              sound.playTypewriter();
              setActiveTab('archives');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'archives'
                ? 'text-amber-900 font-bold border-b-2 border-amber-900'
                : 'hover:text-stone-900'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Archives des Éditions</span>
          </button>
          <button
            onClick={() => {
              sound.playTypewriter();
              setActiveTab('ecuries');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'ecuries'
                ? 'text-amber-900 font-bold border-b-2 border-amber-900'
                : 'hover:text-stone-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Dossier des 7 Écuries</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              sound.playRotative();
              onOpenRotative();
            }}
            className="px-4 py-2 text-xs md:text-sm font-semibold tracking-wide text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 shadow-sm"
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Lancer la Rotative</span>
          </button>
        </div>
      </div>
    </header>
  );
};
