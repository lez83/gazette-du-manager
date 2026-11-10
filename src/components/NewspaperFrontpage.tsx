import React from 'react';
import { GazetteEdition } from '../types';
import { Quote, ThumbsUp, ThumbsDown, AlertTriangle, ShieldAlert, Award } from 'lucide-react';

interface NewspaperFrontpageProps {
  edition: GazetteEdition;
  zoomLevel: number;
  onOpenRotative: () => void;
  onSelectTeam: (teamId: string) => void;
}

export const NewspaperFrontpage: React.FC<NewspaperFrontpageProps> = ({
  edition,
  zoomLevel,
  onOpenRotative,
  onSelectTeam,
}) => {
  // Helper to render Markdown article body with intertitles and drop caps
  const renderArticleBody = (bodyText: string) => {
    const blocks = bodyText.split('\n\n').filter((b) => b.trim().length > 0);

    return blocks.map((block, idx) => {
      const trimmed = block.trim();
      if (trimmed.startsWith('## ')) {
        const title = trimmed.replace('## ', '');
        return (
          <div key={idx} className="my-5 pt-3 border-t border-stone-300">
            <h3 className="text-xl md:text-2xl font-bold font-['Fraunces',Georgia,serif] text-stone-900 tracking-tight">
              {title}
            </h3>
          </div>
        );
      }

      // Format bold text **text**
      const formattedText = trimmed.split(/(\*\*.*?\*\*)/g).map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-bold text-stone-950">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      return (
        <p
          key={idx}
          className={`mb-4 text-justify leading-relaxed text-stone-800 ${
            idx === 0 ? 'editorial-drop-cap' : ''
          }`}
        >
          {formattedText}
        </p>
      );
    });
  };

  const imageSrc = edition.featuredImage || '/src/assets/images/gazette_hero_cover_1794312578292.jpg';

  return (
    <article
      className="newspaper-sheet transition-all"
      style={{ fontSize: `${zoomLevel}%` }}
    >
      {/* Grand Titre Choc */}
      <div className="mb-4 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-stone-950 font-['Oswald',sans-serif] leading-[1.05] max-w-5xl mx-auto text-balance">
          {edition.headline}
        </h2>

        {/* Chapeau cinglant */}
        <div className="mt-3 max-w-3xl mx-auto border-t border-b border-stone-400 py-2.5 px-4 bg-stone-100/50">
          <p className="text-base sm:text-lg md:text-xl font-serif italic text-stone-800 leading-snug font-medium text-center text-balance">
            « {edition.subheadline} »
          </p>
        </div>
      </div>

      {/* Main Newspaper Grid: 2/3 Main Article & Media + 1/3 Side Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left & Center Columns (8 cols on lg) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Featured Press Image with vintage halftone framing */}
          <div className="border border-stone-900 p-1.5 bg-stone-50 shadow-xs">
            <div className="relative overflow-hidden max-h-[460px] bg-stone-900">
              <img
                src={imageSrc}
                alt={edition.headline}
                className="w-full h-full object-cover grayscale contrast-125 brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 left-2 bg-stone-900/90 text-amber-200 text-[10px] font-mono uppercase px-2 py-0.5 tracking-wider font-bold">
                CLICHÉ EXCLUSIF DU VESTIAIRE
              </div>
            </div>
            <p className="text-xs font-serif text-stone-600 italic mt-2 px-1 text-center border-t border-stone-300 pt-1.5">
              {edition.imageCaption ||
                "Scène de pugilat tactique constatée par notre envoyé spécial à la buvette du stade municipal."}
            </p>
          </div>

          {/* Editorial Article Body in 2 Newspaper Sub-Columns on desktop */}
          <div className="font-serif text-stone-900">
            <div className="columns-1 md:columns-2 gap-7 [column-rule:1px_solid_#d6cebe]">
              {renderArticleBody(edition.article_body)}
            </div>
          </div>

          {/* Pull Quote Callout Box */}
          <div className="border-t-2 border-b-2 border-stone-900 py-4 my-2 text-center bg-stone-100/40 px-6">
            <p className="text-xl md:text-2xl font-serif italic font-bold text-stone-950">
              « Le football de district n'a pas besoin de génies, il a besoin d'hommes prêts à laisser un ménisque sur la ligne de touche. »
            </p>
            <span className="block mt-2 text-xs font-mono uppercase tracking-widest text-stone-600">
              — Proverbe gravé au couteau sur le banc de touche de Bon Rencontre
            </span>
          </div>
        </div>

        {/* Right Sidebar Columns (4 cols on lg): Top/Flop, Déclas, Chiffre qui pique */}
        <aside className="lg:col-span-4 flex flex-col gap-6 lg:border-l lg:border-stone-400 lg:pl-6">
          {/* Top & Flop de la Journée */}
          <div className="border-2 border-stone-900 bg-stone-50 p-4 shadow-xs">
            <div className="border-b-2 border-stone-900 pb-1 mb-3 flex items-center justify-between">
              <h3 className="font-['Oswald',sans-serif] text-xl font-bold uppercase tracking-wide text-stone-950 flex items-center gap-1.5">
                <Award className="w-5 h-5 text-amber-700" />
                TOP & FLOP DU WEEK-END
              </h3>
            </div>

            {/* Le Bonhomme */}
            <div className="mb-4 pb-4 border-b border-stone-300">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 mb-1">
                <ThumbsUp className="w-4 h-4 text-emerald-700" />
                <span>LE BONHOMME DE LA JOURNÉE</span>
              </div>
              <p className="font-serif text-sm leading-relaxed text-stone-900">
                {edition.top_flop.le_bonhomme}
              </p>
            </div>

            {/* Le Château de Cartes */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-red-800 mb-1">
                <ThumbsDown className="w-4 h-4 text-red-700" />
                <span>LE CHÂTEAU DE CARTES (FLOP)</span>
              </div>
              <p className="font-serif text-sm leading-relaxed text-stone-900">
                {edition.top_flop.le_château_de_cartes}
              </p>
            </div>
          </div>

          {/* Le Chiffre qui Pique */}
          <div className="border border-stone-900 bg-[#efe7d3] p-4 text-center shadow-xs relative overflow-hidden">
            <div className="text-xs font-mono uppercase tracking-widest text-stone-700 font-bold mb-1">
              LA STATISTIQUE QUI PIQUE
            </div>
            <div className="text-3xl sm:text-4xl font-mono font-black text-amber-950 my-1 tracking-tight">
              {edition.chiffre_qui_pique.split('—')[0]?.trim() || "0,04"}
            </div>
            <div className="h-px bg-stone-400 w-16 mx-auto my-2"></div>
            <p className="font-serif italic text-xs sm:text-sm text-stone-800 leading-snug">
              {edition.chiffre_qui_pique.includes('—')
                ? edition.chiffre_qui_pique.split('—').slice(1).join('—').trim()
                : edition.chiffre_qui_pique}
            </p>
            <div className="mt-3 text-[10px] font-mono text-stone-500 uppercase tracking-tighter">
              ★ Relevé officiel sous constat d'huissier de comptoir ★
            </div>
          </div>

          {/* Les Déclas du Vestiaire */}
          <div className="border border-stone-400 bg-stone-50/70 p-4">
            <div className="border-b border-stone-900 pb-1 mb-3">
              <h3 className="font-['Oswald',sans-serif] text-lg font-bold uppercase tracking-wide text-stone-900 flex items-center gap-1.5">
                <Quote className="w-4 h-4 text-amber-800" />
                LES DÉCLAS DU VESTIAIRE
              </h3>
              <p className="text-[11px] font-mono text-stone-500">
                Propos recueillis à chaud au micro de la Gazette
              </p>
            </div>

            <div className="space-y-4">
              {edition.quotes_of_the_week.map((item, qIdx) => (
                <div key={qIdx} className="border-b border-stone-200 last:border-b-0 pb-3 last:pb-0">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-900 mb-1">
                    <span className="text-amber-900 uppercase">
                      {item.author}
                    </span>
                    <span className="text-[10px] text-stone-400 font-normal">
                      Vestiaire
                    </span>
                  </div>
                  <blockquote className="font-serif italic text-xs leading-relaxed text-stone-800">
                    « {item.quote} »
                  </blockquote>
                </div>
              ))}
            </div>
          </div>

          {/* Billet d'humeur du Rédacteur en Chef */}
          <div className="border border-stone-900 bg-stone-100 p-3.5 flex gap-3 items-start shadow-2xs">
            <img
              src="/src/assets/images/redac_chef_portrait_1794312580013.jpg"
              alt="Le Rédacteur en chef"
              className="w-16 h-16 rounded-xs object-cover border border-stone-700 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="text-xs">
              <div className="font-['Oswald',sans-serif] uppercase font-bold text-stone-950 tracking-wide text-sm">
                LE COUP DE GUEULE DU PATRON
              </div>
              <p className="font-serif italic text-stone-700 mt-1 leading-snug">
                « Si vous n'êtes pas contents du compte-rendu, la rédaction est ouverte le lundi dès 7h au zinc du Café des Sports. Venez avec vos protège-tibias. »
              </p>
              <div className="mt-1 text-[10px] font-mono text-stone-500 uppercase">
                Jean-Eudes La Rotative · Rédac' Chef
              </div>
            </div>
          </div>

          {/* Quick CTA to launch the Rotative */}
          <div className="no-print bg-stone-900 text-amber-100 p-4 rounded text-center">
            <h4 className="font-['Oswald',sans-serif] text-base uppercase font-bold tracking-wide">
              Un scandale dans votre championnat ?
            </h4>
            <p className="text-xs font-serif text-stone-300 mt-1 mb-3">
              Déclenchez une édition sur-mesure pour humilier votre rival ou célébrer un exploit !
            </p>
            <button
              onClick={onOpenRotative}
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider rounded transition-colors"
            >
              Faire Tourner la Rotative
            </button>
          </div>
        </aside>
      </div>
    </article>
  );
};
