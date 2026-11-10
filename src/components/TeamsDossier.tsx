import React, { useState } from 'react';
import { TEAMS_LORE } from '../data/lore';
import { TeamLore } from '../types';
import { Shield, Target, Swords, Quote, Flame, Trophy, AlertTriangle } from 'lucide-react';
import { sound } from '../utils/audio';

interface TeamsDossierProps {
  onTriggerStoryForTeam: (teamName: string) => void;
}

export const TeamsDossier: React.FC<TeamsDossierProps> = ({
  onTriggerStoryForTeam,
}) => {
  const [selectedTeam, setSelectedTeam] = useState<TeamLore>(TEAMS_LORE[0]);

  return (
    <div className="w-full">
      {/* Dossier Header */}
      <div className="border-b-2 border-stone-900 pb-3 mb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-900 font-bold mb-1">
          <span>Dossier Secret des Renseignements Généraux du District</span>
          <span>·</span>
          <span>Top Secret</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-['Fraunces',Georgia,serif] text-stone-950 uppercase tracking-tight">
          LE LORE DES 7 ÉCURIES DE LA LIGUE MPG
        </h2>
        <p className="text-sm font-serif italic text-stone-700 mt-1 max-w-3xl">
          Psychologie des managers, rancœurs historiques, dettes d'honneur et fiches anthropométriques des sept belligérants du championnat.
        </p>
      </div>

      {/* Team Selector Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-stone-300 pb-4">
        {TEAMS_LORE.map((team) => {
          const isSelected = selectedTeam.id === team.id;
          return (
            <button
              key={team.id}
              onClick={() => {
                sound.playTypewriter();
                setSelectedTeam(team);
              }}
              className={`px-3 py-2 text-xs font-mono uppercase tracking-wider font-bold transition-all border ${
                isSelected
                  ? 'bg-stone-900 text-amber-200 border-stone-900 shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
              }`}
            >
              {team.name}
            </button>
          );
        })}
      </div>

      {/* Main Selected Team File */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-stone-50/80 border-2 border-stone-900 p-6 shadow-xs">
        {/* Left Column: Dossier Card & Stats (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="border border-stone-400 bg-white p-4">
            <div className="flex items-center justify-between border-b border-stone-300 pb-2 mb-3">
              <span className="text-[11px] font-mono text-stone-500 uppercase">
                Fiche Matricule N°{selectedTeam.championshipRank}
              </span>
              <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 border border-amber-300">
                Rang Actuel : #{selectedTeam.championshipRank}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black font-['Fraunces',Georgia,serif] text-stone-950 uppercase">
              {selectedTeam.name}
            </h3>
            <div className="text-xs font-serif italic text-stone-600 mt-0.5">
              « {selectedTeam.nickname} »
            </div>

            <div className="mt-4 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-stone-200 py-1">
                <span className="text-stone-500">Bastion :</span>
                <span className="font-semibold text-stone-900">{selectedTeam.region}</span>
              </div>
              <div className="flex items-center justify-between border-b border-stone-200 py-1">
                <span className="text-stone-500">Couleurs :</span>
                <span className="font-semibold text-stone-900">{selectedTeam.colors}</span>
              </div>
              <div className="flex items-center justify-between border-b border-stone-200 py-1">
                <span className="text-stone-500">Ennemi Juré :</span>
                <span className="font-semibold text-red-900">{selectedTeam.nemesis}</span>
              </div>
            </div>

            {/* Season Metrics Table */}
            <div className="mt-5 pt-3 border-t-2 border-stone-900">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-700 mb-2">
                Bilan de la Campagne en Cours
              </div>
              <div className="grid grid-cols-5 text-center gap-1 border border-stone-300 bg-stone-100 p-2 font-mono text-xs">
                <div>
                  <div className="text-[10px] text-stone-500">V</div>
                  <div className="font-bold text-stone-900">{selectedTeam.seasonRecord.wins}</div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-500">N</div>
                  <div className="font-bold text-stone-900">{selectedTeam.seasonRecord.draws}</div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-500">D</div>
                  <div className="font-bold text-stone-900">{selectedTeam.seasonRecord.losses}</div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-500">Buts MPG</div>
                  <div className="font-bold text-amber-900">{selectedTeam.seasonRecord.mpgGoals}</div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-500">Valises</div>
                  <div className="font-bold text-stone-900">{selectedTeam.seasonRecord.valisesUsed}</div>
                </div>
              </div>
            </div>

            {/* Quick action button to trigger custom story */}
            <div className="mt-5">
              <button
                onClick={() => {
                  sound.playRotative();
                  onTriggerStoryForTeam(selectedTeam.name);
                }}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-200 text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Lancer une Édition sur {selectedTeam.name}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Lore & Psychological Profile (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Section Profil & Identité */}
          <div className="border-b border-stone-300 pb-4">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-amber-900 mb-1">
              <Shield className="w-4 h-4 text-amber-800" />
              <span>Profil & Philosophie de Club</span>
            </div>
            <p className="font-serif text-base leading-relaxed text-stone-900">
              {selectedTeam.profile}
            </p>
          </div>

          {/* Section Dynamique & Rivalités */}
          <div className="border-b border-stone-300 pb-4">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-stone-800 mb-1">
              <Swords className="w-4 h-4 text-stone-800" />
              <span>Dynamique de Vestiaire & Rôle dans la Ligue</span>
            </div>
            <p className="font-serif text-sm leading-relaxed text-stone-800">
              {selectedTeam.dynamics}
            </p>
          </div>

          {/* Section Psychologie du Manager */}
          <div className="border-b border-stone-300 pb-4">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-red-900 mb-1">
              <Target className="w-4 h-4 text-red-800" />
              <span>Diagnostic Psychologique du Manager</span>
            </div>
            <p className="font-serif text-sm leading-relaxed text-stone-800">
              {selectedTeam.managerPsychology}
            </p>
          </div>

          {/* Section Tactique & Vices de District */}
          <div className="border-b border-stone-300 pb-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 mb-1">
              Schéma Tactique Préférentiel & Mauvaise Foi
            </div>
            <p className="font-serif text-sm leading-relaxed text-stone-800 italic">
              {selectedTeam.tacticalStyle}
            </p>
          </div>

          {/* Citation Culte */}
          <div className="bg-[#efe7d3] p-4 border border-stone-400">
            <div className="flex items-center gap-1 text-xs font-mono uppercase tracking-wider font-bold text-amber-950 mb-1">
              <Quote className="w-4 h-4" />
              <span>Citation Culte Gravée dans les Mémoires</span>
            </div>
            <blockquote className="font-serif italic text-sm text-stone-900 leading-snug">
              {selectedTeam.famousQuote}
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
};
