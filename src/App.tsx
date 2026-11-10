import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Masthead } from './components/Masthead';
import { NewspaperFrontpage } from './components/NewspaperFrontpage';
import { RotativeModal } from './components/RotativeModal';
import { TeamsDossier } from './components/TeamsDossier';
import { ArchivesList } from './components/ArchivesList';
import { JsonViewerModal } from './components/JsonViewerModal';
import { INITIAL_EDITIONS } from './data/editions';
import { GazetteEdition } from './types';
import { sound } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<'une' | 'archives' | 'ecuries'>('une');
  const [editions, setEditions] = useState<GazetteEdition[]>(INITIAL_EDITIONS);
  const [currentEditionId, setCurrentEditionId] = useState<string>(INITIAL_EDITIONS[0].id || 'edition-42');
  const [paperTheme, setPaperTheme] = useState<'sepia' | 'mono' | 'dark'>('sepia');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isRotativeOpen, setIsRotativeOpen] = useState(false);
  const [isJsonViewerOpen, setIsJsonViewerOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Active edition object
  const currentEdition =
    editions.find((e) => e.id === currentEditionId) || editions[0];

  // Stop speech if edition changes or component unmounts
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [currentEditionId]);

  // Audio speech synthesis of the press review
  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert("La synthèse vocale n'est pas supportée par votre navigateur.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${currentEdition.headline}. ${currentEdition.subheadline}. 
    Le bonhomme de la journée : ${currentEdition.top_flop.le_bonhomme}. 
    Le château de cartes : ${currentEdition.top_flop.le_château_de_cartes}. 
    Le chiffre qui pique : ${currentEdition.chiffre_qui_pique}.`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.05;
    utterance.pitch = 0.95;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    setIsSpeaking(true);
    sound.playWhistle();
    window.speechSynthesis.speak(utterance);
  };

  const handlePrint = () => {
    sound.playRotative();
    window.print();
  };

  const handleEditionCreated = (newEdition: GazetteEdition) => {
    setEditions((prev) => [newEdition, ...prev]);
    setCurrentEditionId(newEdition.id || `edition-${Date.now()}`);
    setActiveTab('une');
  };

  const handleSelectEdition = (edition: GazetteEdition) => {
    if (edition.id) {
      setCurrentEditionId(edition.id);
    }
    setActiveTab('une');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine paper container background style
  const paperThemeClass =
    paperTheme === 'sepia'
      ? 'bg-newsprint-aged text-stone-900 border-stone-800'
      : paperTheme === 'dark'
      ? 'bg-newsprint-dark text-stone-100 border-stone-700'
      : 'bg-newsprint text-stone-950 border-stone-900';

  return (
    <div className={`min-h-screen ${paperTheme === 'dark' ? 'bg-[#0f0e0d] text-stone-200' : 'bg-[#e8e2d4] text-stone-900'} antialiased flex flex-col font-sans transition-colors`}>
      {/* Top Bar Header compliant with 1-row 3-zone contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRotative={() => setIsRotativeOpen(true)}
      />

      {/* Main Newspaper Stage */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-2 sm:px-4 md:px-6 py-6 md:py-10">
        <div
          className={`border-4 md:border-8 shadow-2xl p-4 sm:p-6 md:p-10 transition-colors ${paperThemeClass}`}
        >
          {/* Authentic Broadsheet Masthead */}
          <Masthead
            edition={currentEdition.edition}
            dateStr={currentEdition.dateStr || 'Saison 1986'}
            issueNumber={currentEdition.issueNumber || 42}
            paperTheme={paperTheme}
            setPaperTheme={setPaperTheme}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            onPrint={handlePrint}
            onViewJson={() => setIsJsonViewerOpen(true)}
            isSpeaking={isSpeaking}
            onToggleSpeech={handleToggleSpeech}
          />

          {/* Tab 1: Frontpage View */}
          {activeTab === 'une' && (
            <NewspaperFrontpage
              edition={currentEdition}
              zoomLevel={zoomLevel}
              onOpenRotative={() => setIsRotativeOpen(true)}
              onSelectTeam={(teamId) => {
                setActiveTab('ecuries');
              }}
            />
          )}

          {/* Tab 2: Archives of Editions */}
          {activeTab === 'archives' && (
            <ArchivesList
              editions={editions}
              currentEditionId={currentEditionId}
              onSelectEdition={handleSelectEdition}
            />
          )}

          {/* Tab 3: Lore dossier of 7 teams */}
          {activeTab === 'ecuries' && (
            <TeamsDossier
              onTriggerStoryForTeam={(teamName) => {
                setIsRotativeOpen(true);
              }}
            />
          )}
        </div>
      </main>

      {/* Vintage Newsroom Footer */}
      <footer className="no-print border-t border-stone-400 py-6 text-center text-xs text-stone-600 bg-stone-300/40">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]">
          <div>
            © 1986–2026 <strong>La Gazette du Manager</strong> — Le Canard Officiel de la Ligue MPG
          </div>
          <div className="flex items-center gap-3">
            <span>District Honneur</span>
            <span>·</span>
            <span>Tirage rotative offset</span>
            <span>·</span>
            <button
              onClick={() => setIsJsonViewerOpen(true)}
              className="text-stone-900 underline hover:text-amber-800"
            >
              Spécification JSON
            </button>
          </div>
        </div>
      </footer>

      {/* Modal: Generator Rotative */}
      <RotativeModal
        isOpen={isRotativeOpen}
        onClose={() => setIsRotativeOpen(false)}
        onEditionCreated={handleEditionCreated}
      />

      {/* Modal: Strict JSON Inspector */}
      <JsonViewerModal
        isOpen={isJsonViewerOpen}
        onClose={() => setIsJsonViewerOpen(false)}
        edition={currentEdition}
      />
    </div>
  );
}
