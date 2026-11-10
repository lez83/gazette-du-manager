import React from 'react';
import { Volume2, VolumeX, Printer, Code2, ZoomIn, ZoomOut } from 'lucide-react';
import { sound } from '../utils/audio';

interface MastheadProps {
  edition: string;
  dateStr: string;
  issueNumber: number;
  paperTheme: 'sepia' | 'mono' | 'dark';
  setPaperTheme: (theme: 'sepia' | 'mono' | 'dark') => void;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  onPrint: () => void;
  onViewJson: () => void;
  isSpeaking: boolean;
  onToggleSpeech: () => void;
}

export const Masthead: React.FC<MastheadProps> = ({
  edition,
  dateStr,
  issueNumber,
  paperTheme,
  setPaperTheme,
  zoomLevel,
  setZoomLevel,
  onPrint,
  onViewJson,
  isSpeaking,
  onToggleSpeech,
}) => {
  return (
    <div className="w-full border-b-4 border-double border-stone-900 pb-3 mb-6">
      {/* Top Utility Kicker & Quick Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-stone-400 py-1.5 text-xs text-stone-600 font-mono tracking-tight gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-900 uppercase">Grand Quotidien de District</span>
          <span>·</span>
          <span>Dépôt Légal N°{issueNumber * 1024 + 1986}</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">Tirage : 12 exemplaires au bar PMU</span>
        </div>

        {/* Paper style & Reading toolbar (Interactive controls) */}
        <div className="flex items-center gap-2 no-print">
          {/* Tone switcher */}
          <div className="flex items-center bg-stone-200/80 p-0.5 rounded text-[11px]">
            <button
              onClick={() => {
                sound.playTypewriter();
                setPaperTheme('sepia');
              }}
              title="Papier Journal d'Époque"
              className={`px-2 py-0.5 rounded transition-colors ${
                paperTheme === 'sepia'
                  ? 'bg-amber-100 text-stone-900 font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              1986
            </button>
            <button
              onClick={() => {
                sound.playTypewriter();
                setPaperTheme('mono');
              }}
              title="Noir & Blanc Presse"
              className={`px-2 py-0.5 rounded transition-colors ${
                paperTheme === 'mono'
                  ? 'bg-white text-stone-900 font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Presse N&B
            </button>
            <button
              onClick={() => {
                sound.playTypewriter();
                setPaperTheme('dark');
              }}
              title="Vestiaire Tamisé"
              className={`px-2 py-0.5 rounded transition-colors ${
                paperTheme === 'dark'
                  ? 'bg-stone-900 text-amber-200 font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Nuit
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-stone-200/80 p-0.5 rounded text-[11px]">
            <button
              onClick={() => setZoomLevel((prev) => Math.max(90, prev - 10))}
              title="Réduire le corps de texte"
              className="p-1 text-stone-600 hover:text-stone-900"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono px-1">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((prev) => Math.min(130, prev + 10))}
              title="Agrandir le corps de texte"
              className="p-1 text-stone-600 hover:text-stone-900"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action buttons */}
          <button
            onClick={onToggleSpeech}
            title={isSpeaking ? "Arrêter la lecture" : "Écouter la revue de presse"}
            className={`p-1.5 rounded transition-colors flex items-center gap-1 ${
              isSpeaking
                ? 'bg-red-700 text-white font-bold'
                : 'bg-stone-200 hover:bg-stone-300 text-stone-800'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-[11px]">
              {isSpeaking ? 'Arrêter' : 'Revue Audio'}
            </span>
          </button>

          <button
            onClick={onPrint}
            title="Imprimer cette édition comme un vrai journal"
            className="p-1.5 bg-stone-200 hover:bg-stone-300 rounded text-stone-800 transition-colors flex items-center gap-1 text-[11px]"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Imprimer</span>
          </button>

          <button
            onClick={onViewJson}
            title="Consulter le format JSON strict conforme aux spécifications"
            className="p-1.5 bg-stone-200 hover:bg-stone-300 rounded text-stone-800 transition-colors flex items-center gap-1 text-[11px]"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">JSON</span>
          </button>
        </div>
      </div>

      {/* Main Vintage Masthead Block */}
      <div className="py-4 text-center">
        <p className="text-[11px] md:text-xs font-serif uppercase tracking-[0.25em] text-stone-700 mb-1 font-semibold">
          Organe Satirique & Chronique d'Investigation de Vestiaire de District
        </p>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-stone-950 font-['Fraunces',Georgia,serif] leading-none my-1 select-none drop-shadow-xs">
          LA GAZETTE DU MANAGER
        </h1>

        <div className="flex items-center justify-center gap-3 my-2 text-stone-800 text-xs md:text-sm font-serif italic">
          <span className="h-px bg-stone-400 w-12 md:w-24"></span>
          <span>« Le seul canard qui tacle les chevilles à hauteur de gorge »</span>
          <span className="h-px bg-stone-400 w-12 md:w-24"></span>
        </div>
      </div>

      {/* BroadSheet Information Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-t-2 border-b-2 border-stone-900 py-1.5 text-xs text-stone-900 font-mono text-center gap-1 uppercase">
        <div className="border-r border-stone-300 md:border-r">
          <span className="font-bold">Édition :</span> {edition}
        </div>
        <div className="border-r-0 md:border-r border-stone-300">
          <span className="font-bold">Date :</span> {dateStr}
        </div>
        <div className="border-r border-stone-300">
          <span className="font-bold">Prix :</span> 3,50 F / 1 demi au comptoir
        </div>
        <div>
          <span className="font-bold">Ligue :</span> MPG Division d'Honneur
        </div>
      </div>

      {/* Baromètre du Vestiaire */}
      <div className="mt-2 text-[11px] font-mono text-stone-600 flex flex-wrap items-center justify-between px-1">
        <span>⚽ <strong>Baromètre du District :</strong> Pelouse gorgée d'eau, odeur tenace de camphre et d'anisette</span>
        <span className="hidden lg:inline text-stone-500">Mégaphones tolérés · Tacles par derrière sous réserve d'inspection</span>
      </div>
    </div>
  );
};
