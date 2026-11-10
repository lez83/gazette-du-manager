import React, { useState } from 'react';
import { X, Flame, Sparkles, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { GazetteEdition } from '../types';
import { sound } from '../utils/audio';

interface RotativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditionCreated: (newEdition: GazetteEdition) => void;
}

const PRESETS = [
  {
    title: "Humiliation suprême de Thé Winner",
    scenario: "Thé Winner avait fanfaronné pendant 5 jours sur WhatsApp, mais il a pris 4 buts contre l'AJB alors qu'il avait joué sa valise à nanar.",
    focusTeam: "Thé Winner",
    customEvents: "2 buts de Rotaldo, gardien adverse qui fait 11 arrêts, Thé Winner quitte le groupe de la ligue en pleurant.",
  },
  {
    title: "Choc au sommet : La Yaute vs FC Mourillon",
    scenario: "Duel des extrêmes : le blizzard montagnard contre la furia toulonnaise. Match arrêté 10 minutes pour cause de jet de pastis et bataille de boue.",
    focusTeam: "FC Mourillon",
    customEvents: "Le coach de Toulon finit torse nu, La Yaute marque sur un contre glacial à la 94e minute.",
  },
  {
    title: "Le réveil mégalo de Teobard",
    scenario: "Teobard gagne 1-0 contre Pruneaux 47 sur un penalty imaginaire et convoque une conférence de presse pour comparer son équipe au Brésil de 1970.",
    focusTeam: "Teobard",
    customEvents: "Teobard récite des poèmes de Victor Hugo dans le couloir, Pruneaux 47 conteste avec des branches de saule.",
  },
  {
    title: "Boucherie dans le Sud-Ouest",
    scenario: "Pruneaux 47 reçoit l'Olympique Mite dans un match de tranchée. Zéro tir, 9 cartons jaunes, les deux entraîneurs exclus avant la mi-temps.",
    focusTeam: "Pruneaux 47",
    customEvents: "Terrain impraticable défoncé au motoculteur, score 0-0 de district absolu.",
  },
  {
    title: "Miracle pour les Martyrs de l'AJB",
    scenario: "L'AJB enchaîne une deuxième victoire consécutive ! Scène d'émeute joyeuse dans l'Yonne, la cathédrale de Sens fait sonner ses cloches.",
    focusTeam: "AJB",
    customEvents: "Le président de l'AJB offre le banquet aux 4 supporters présents, Thé Winner porte plainte au tribunal administratif.",
  },
];

const TEAMS_LIST = [
  'FC Mourillon',
  'Thé Winner',
  'La Yaute',
  'Teobard',
  'Pruneaux 47',
  'Olympique Mite',
  'AJB',
  'Toute la ligue au complet',
];

export const RotativeModal: React.FC<RotativeModalProps> = ({
  isOpen,
  onClose,
  onEditionCreated,
}) => {
  const [matchday, setMatchday] = useState('43');
  const [focusTeam, setFocusTeam] = useState('Thé Winner');
  const [scenario, setScenario] = useState('');
  const [customEvents, setCustomEvents] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof PRESETS[0]) => {
    sound.playTypewriter();
    setScenario(preset.scenario);
    setFocusTeam(preset.focusTeam);
    setCustomEvents(preset.customEvents);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playRotative();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/gazette/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchday: `J${matchday}`,
          scenario: scenario || "Week-end de foire d'empoigne générale dans le championnat avec des retournements de situation épiques.",
          customEvents,
          focusTeam,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur (${response.status})`);
      }

      const data: GazetteEdition = await response.json();
      sound.playWhistle();

      // Ensure edition has an id and timestamp
      const newEdition: GazetteEdition = {
        ...data,
        id: `edition-${Date.now()}`,
        issueNumber: parseInt(matchday) || 43,
        dateStr: `Dimanche ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`,
        featuredImage:
          focusTeam === 'FC Mourillon'
            ? '/src/assets/images/gazette_hero_cover_1794312578292.jpg'
            : focusTeam === 'La Yaute'
            ? '/src/assets/images/vintage_match_clash_1794312577538.jpg'
            : '/src/assets/images/vintage_locker_room_1794312579396.jpg',
      };

      onEditionCreated(newEdition);
      onClose();
    } catch (err: any) {
      console.error('Error generating edition:', err);
      setErrorMsg("Impossible de joindre la rotative. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs no-print overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#f7f3ea] border-4 border-stone-900 shadow-2xl p-6 rounded-none my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-stone-900 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-700" />
            <div>
              <h2 className="text-2xl font-black font-['Oswald',sans-serif] uppercase text-stone-950 tracking-wide">
                LANCER LA ROTATIVE D'IMPRIMERIE
              </h2>
              <p className="text-xs font-serif text-stone-600 italic">
                Rédigez une édition fracassante au vitriol avec le Rédac' Chef sans filtre
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playTypewriter();
              onClose();
            }}
            className="p-1 text-stone-600 hover:text-stone-950 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Loading overlay with vintage animation */}
        {isLoading && (
          <div className="absolute inset-0 bg-[#f7f3ea]/95 z-20 flex flex-col items-center justify-center p-8 text-center">
            <div className="animate-spin text-amber-800 mb-4">
              <RefreshCw className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black font-['Oswald',sans-serif] uppercase text-stone-950 tracking-wide mb-1">
              L'ENCRE COULE, LES ROULEAUX GRINCENT !
            </h3>
            <p className="text-sm font-serif italic text-stone-700 max-w-md">
              Le rédacteur en chef tape frénétiquement sur sa machine Remington tout en insultant la concurrence... La Une arrive !
            </p>
            <div className="mt-4 text-xs font-mono text-stone-500">
              Traitement satirique en cours · Respect du lore des 7 écuries
            </div>
          </div>
        )}

        {/* Preset quick scenarios */}
        <div className="mb-5">
          <span className="block text-xs font-mono uppercase tracking-wider text-stone-700 font-bold mb-2">
            ⚡ Choix rapide : Scénarios cultes de la ligue
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESETS.slice(0, 4).map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="text-left p-2.5 bg-stone-100 hover:bg-amber-100/60 border border-stone-300 rounded-none transition-colors text-xs"
              >
                <div className="font-bold text-stone-900 font-serif">
                  {preset.title}
                </div>
                <div className="text-[11px] text-stone-600 line-clamp-1 italic mt-0.5">
                  {preset.scenario}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Generation Form */}
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-stone-800 mb-1">
                Numéro de Journée
              </label>
              <div className="flex items-center border border-stone-400 bg-white px-2 py-1.5">
                <span className="text-xs font-mono text-stone-500 mr-1">J</span>
                <input
                  type="number"
                  value={matchday}
                  onChange={(e) => setMatchday(e.target.value)}
                  className="w-full text-sm font-mono font-bold text-stone-900 focus:outline-hidden"
                  min="1"
                  max="99"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono font-bold uppercase text-stone-800 mb-1">
                Écurie à mettre sous les projecteurs
              </label>
              <select
                value={focusTeam}
                onChange={(e) => setFocusTeam(e.target.value)}
                className="w-full text-xs font-mono border border-stone-400 bg-white p-2 text-stone-900 focus:outline-hidden"
              >
                {TEAMS_LIST.map((team, idx) => (
                  <option key={idx} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-stone-800 mb-1">
              Contexte ou résumé du match (Scénario de la journée)
            </label>
            <textarea
              rows={3}
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              placeholder="Ex: Thé Winner a perdu 3-0 contre l'AJB dans les arrêts de jeu après avoir traité leur coach de paysan en avant-match..."
              className="w-full text-xs font-serif border border-stone-400 bg-white p-2.5 text-stone-900 focus:outline-hidden resize-none placeholder:text-stone-400 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-stone-800 mb-1">
              Détails croustillants / Bonus MPG utilisés (facultatif)
            </label>
            <input
              type="text"
              value={customEvents}
              onChange={(e) => setCustomEvents(e.target.value)}
              placeholder="Ex: Valise à nanar volée, 2 buts Rotaldo, arbitre qui s'enfuit en mobylette..."
              className="w-full text-xs font-serif border border-stone-400 bg-white p-2 text-stone-900 focus:outline-hidden placeholder:text-stone-400"
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-red-100 border border-red-400 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-2 border-t border-stone-300 flex items-center justify-between gap-3">
            <span className="text-[11px] font-mono text-stone-500">
              Format de sortie officiel : JSON strict validé
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-950 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-amber-200 font-bold text-xs uppercase tracking-wider rounded-none transition-colors shadow-xs flex items-center gap-2"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Imprimer l'Édition</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
