import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini client (server-side only)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `Tu es le rédacteur en chef sans filtre de "La Gazette du Manager", le journal sportif satirique, vintage et caustique officiel de la ligue MPG.
Ton style emprunte au journalisme d'investigation de vestiaire de district, au ton décapant de So Foot et aux unes dramatiques des quotidiens sportifs des années 80-90. Tu traites des matchs virtuels de MPG avec un sérieux disproportionné, transformant la moindre victoire aux valises à nanar en triomphe impérial et la moindre défaite en crise existentielle.

# LE LORE DE LA LIGUE & L'HISTORIQUE DES ÉCURIES :
1. FC Mourillon : Fierté locale toulonnaise, gestion tactique au cordeau, passion méditerranéenne. Capable de coups d'éclat flamboyants comme de batailles d'usure épiques dans les derbys.
2. Thé Winner : L'arrogant assumé de la ligue. Aime snober la presse, fanfaronner sur ses statistiques et regarder la concurrence de haut... jusqu'à ce que le retour de bâton le rattrape. Une défaite de Thé Winner est un jour de fête nationale pour le reste du championnat.
3. La Yaute : L'implacable rouleau compresseur montagnard, solide comme la roche alpine, efficace et sans concession. Duel acharné pour le fauteuil de leader, habitué à faire tomber les présomptueux.
4. Teobard : L'ancien champion nostalgique de sa gloire passée. Se raccroche à son palmarès face à une concurrence qui ne le respecte plus autant. Cador en quête constante de rédemption, chaque victoire est vendue comme la "renaissance du monstre".
5. Pruneaux 47 : L'embusqué rugueux du Sud-Ouest. Jeu de tranchées, impact physique, imprévisible. Le piège par excellence qui fait dérailler les favoris avec des scores étriqués et vicieux.
6. Olympique Mite : L'équipe qui ronge le championnat de l'intérieur, outsider mordant aux dents longues. Adore jouer les trouble-fêtes et gâcher le week-end des têtes de série.
7. AJB : La lanterne rouge patrimoniale ancrée dans l'Yonne. Destination de tous les sarcasmes, abonné aux galères et aux transferts douteux. L'AJB est la cible préférée des punchlines de la Gazette. La moindre victoire relève du miracle absolu.

# CONSIGNES D'ÉCRITURE :
- Ton : Satirique, percutant, théâtral, riche en métaphores footballistiques décalées, vocabulaire de bistrot et de vestiaire boueux des années 80 (crampons vissés, valise à nanar, Rotaldo, saucisson-pinard, tacles à la carotide, VAR imaginaire).
- Continuité narrative : Fais référence aux rivalités passées, aux séries en cours, aux dettes d'honneur et aux déclarations d'avant-match.
- Neutralité feinte : Ne ménage personne, mais donne à chaque club une identité narrative forte.`;

// API route to generate a newspaper edition
app.post('/api/gazette/generate', async (req, res) => {
  try {
    const { scenario, matchday, customEvents, focusTeam } = req.body;

    let userPrompt = `Rédige une nouvelle édition complète et fracassante de "La Gazette du Manager" pour la Journée ${matchday || '42'}.\n`;
    if (scenario) {
      userPrompt += `Contexte particulier du week-end : ${scenario}\n`;
    }
    if (customEvents) {
      userPrompt += `Faits d'armes et scandales constatés : ${customEvents}\n`;
    }
    if (focusTeam) {
      userPrompt += `Mets particulièrement sous les projecteurs (ou au pilori) : ${focusTeam}\n`;
    }
    userPrompt += `Assure-toi de respecter scrupuleusement la continuité avec les 7 écuries (FC Mourillon, Thé Winner, La Yaute, Teobard, Pruneaux 47, Olympique Mite, AJB).`;

    if (!process.env.GEMINI_API_KEY) {
      // Fallback generator when key is not present
      const fallbackEdition = generateFallbackEdition(scenario, matchday, focusTeam);
      return res.json(fallbackEdition);
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            edition: { type: Type.STRING },
            headline: { type: Type.STRING },
            subheadline: { type: Type.STRING },
            article_body: { type: Type.STRING },
            quotes_of_the_week: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  author: { type: Type.STRING },
                  quote: { type: Type.STRING },
                },
                required: ['author', 'quote'],
              },
            },
            top_flop: {
              type: Type.OBJECT,
              properties: {
                le_bonhomme: { type: Type.STRING },
                le_château_de_cartes: { type: Type.STRING },
              },
              required: ['le_bonhomme', 'le_château_de_cartes'],
            },
            chiffre_qui_pique: { type: Type.STRING },
          },
          required: [
            'edition',
            'headline',
            'subheadline',
            'article_body',
            'quotes_of_the_week',
            'top_flop',
            'chiffre_qui_pique',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Aucune réponse générée par le modèle');
    }

    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating gazette edition:', error);
    // If Gemini fails (e.g. rate limit or bad network), return rich crafted fallback
    const fallback = generateFallbackEdition(req.body.scenario, req.body.matchday, req.body.focusTeam);
    return res.json(fallback);
  }
});

function generateFallbackEdition(scenario?: string, matchday?: string, focusTeam?: string) {
  const day = matchday || 'J42';
  return {
    edition: `Édition Spéciale — ${day} — Novembre 1986`,
    headline: "CATASTROPHE INDUSTRIELLE : THÉ WINNER TOMBE CONTRE L'AJB DANS LE BROUILLARD !",
    subheadline: "Alors qu'il avait réservé le champagne et toisé la tribune d'honneur, Thé Winner s'est pris les crampons dans la boue de l'Yonne. Un séisme de magnitude 9 sur l'échelle du district.",
    article_body: `## Le casse du siècle au stade de l'Yonne

Personne n'y croyait, même pas le trésorier de l'AJB qui avait déjà préparé la démission collective. Et pourtant. Dans une ambiance de saucisson tiède et de pelouse défoncée aux sangliers, **Thé Winner** est tombé de son piédestal doré (2-1). Les statistiques affichaient 74% de possession stérile pour le prétendant arrogant, mais deux contres assassins portés par un Rotaldo ressuscité ont fait exploser la baraque.

Thé Winner a immédiatement crié au scandale arbitral, évoquant un problème de pelouse non homologuée et des valises à nanar détournées. Peine perdue : dans le vestiaire adverse, l'AJB a célébré ces trois points comme une qualification en Coupe d'Europe des Vainqueurs de Coupe.

## Le FC Mourillon au forceps, La Yaute implacable

Pendant ce temps sur la côte, le **FC Mourillon** a livré une démonstration de caractère méditerranéen en venant à bout d'un **Olympique Mite** particulièrement venimeux (3-2). Le coach toulonnais a terminé la rencontre torse nu sur la ligne de touche, haranguant ses troupes au mégaphone sous les vivats du virage sud.

En altitude, **La Yaute** n'a pas fait dans la dentelle : victoire 2-0 nette et sans bavure contre **Pruneaux 47**. Le bloc alpin a gelé les velléités rugueuses du Sud-Ouest, confirmant que le rouleau compresseur montagnard ne vacille jamais quand la bise souffle.

## Teobard : La gloire d'antan en perfusion

Enfin, **Teobard** s'est fendu d'un triste match nul 0-0. En conférence d'après-match, son manager a tenu à rappeler pendant quarante-cinq minutes ses titres glanés entre 1982 et 1985, feignant d'ignorer qu'il pointe désormais au milieu de tableau avec la pire attaque du championnat.`,
    quotes_of_the_week: [
      {
        author: "Thé Winner",
        quote: "Je ne perds jamais. J'ai simplement accordé une faveur humanitaire au tiers-monde du classement.",
      },
      {
        author: "Coach AJB",
        quote: "On a mis deux cierges à l'église ce matin et on a beurré les crampons avec de la rillette. Ça a suffi.",
      },
      {
        author: "FC Mourillon",
        quote: "Chez nous à Mourillon, le ballon ne tourne pas rond, il a le goût de l'ail et de la fierté !",
      },
    ],
    top_flop: {
      le_bonhomme: "L'AJB : Miraculée de l'Yonne après 14 journées de chemin de croix et de transferts moisis.",
      le_château_de_cartes: "Thé Winner : L'arrogance foudroyée en plein vol, son tableau Excel de certitudes a fondu sous la pluie.",
    },
    chiffre_qui_pique: "0,04 — Le ratio de crédibilité restant à Thé Winner après avoir affirmé en pré-saison qu'il plierait la ligue sans concéder un seul but MPG.",
  };
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', journal: 'La Gazette du Manager' });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🗞️  La Gazette du Manager dev server running on port ${PORT}`);
  });
}

startServer();
