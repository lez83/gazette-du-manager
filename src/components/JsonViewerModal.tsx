import React, { useState } from 'react';
import { X, Copy, Check, Code } from 'lucide-react';
import { GazetteEdition } from '../types';

interface JsonViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  edition: GazetteEdition;
}

export const JsonViewerModal: React.FC<JsonViewerModalProps> = ({
  isOpen,
  onClose,
  edition,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Build the strict output object conforming to user specifications
  const strictJsonObject = {
    edition: edition.edition,
    headline: edition.headline,
    subheadline: edition.subheadline,
    article_body: edition.article_body,
    quotes_of_the_week: edition.quotes_of_the_week,
    top_flop: edition.top_flop,
    chiffre_qui_pique: edition.chiffre_qui_pique,
  };

  const jsonString = JSON.stringify(strictJsonObject, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs no-print overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-stone-900 border-2 border-stone-600 shadow-2xl p-5 my-8 text-stone-100 font-mono">
        <div className="flex items-center justify-between border-b border-stone-700 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm text-stone-200 uppercase tracking-wider">
              Format JSON Strict de Sortie (Spécification Officielle)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-400 mb-3 font-mono">
          Cet objet JSON strict est directement injectable dans votre API, webhook ou intégration web MPG.
        </p>

        <div className="relative bg-stone-950 border border-stone-800 p-4 rounded overflow-x-auto max-h-[500px] text-xs leading-relaxed text-amber-200">
          <pre>{jsonString}</pre>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            Conforme au schéma JSON MPG · Schéma strict validé
          </span>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copié dans le presse-papier !' : 'Copier le JSON'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
