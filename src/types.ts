export interface Quote {
  author: string;
  quote: string;
}

export interface TopFlop {
  le_bonhomme: string;
  le_château_de_cartes: string;
}

export interface GazetteEdition {
  id?: string;
  edition: string;
  headline: string;
  subheadline: string;
  article_body: string;
  quotes_of_the_week: Quote[];
  top_flop: TopFlop;
  chiffre_qui_pique: string;
  dateStr?: string;
  issueNumber?: number;
  featuredImage?: string;
  imageCaption?: string;
}

export interface TeamLore {
  id: string;
  name: string;
  nickname: string;
  region: string;
  colors: string;
  profile: string;
  dynamics: string;
  managerPsychology: string;
  nemesis: string;
  tacticalStyle: string;
  famousQuote: string;
  championshipRank: number;
  seasonRecord: {
    wins: number;
    draws: number;
    losses: number;
    mpgGoals: number;
    valisesUsed: number;
  };
}
