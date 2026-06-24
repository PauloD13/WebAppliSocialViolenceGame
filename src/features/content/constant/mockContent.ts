export interface StatItem {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface ContentPayload {
  slug: string;
  trailName: string;
  title: string;
  subtitle: string;
  theme: {
    primary: string;
    accent: string;
    glow: string;
  };
  mainStat: StatItem;
  secondaryStats: StatItem[];
  footerNote: string;
}

// Simulando a resposta do endpoint GET /api/v1/content/:slug
export const MOCK_CONTENTS: Record<string, ContentPayload> = {
  'feminicidio': {
    slug: 'feminicidio',
    trailName: 'Feminicídio e Violência Doméstica',
    title: 'Antes de começar...',
    subtitle: 'Entender os dados é o primeiro passo para transformar a realidade.',
    theme: {
      primary: '#EF4444', // red-500
      accent: '#FEF2F2',  // red-50
      glow: 'rgba(239, 68, 68, 0.2)',
    },
    mainStat: {
      value: '18,6M',
      label: 'Mulheres agredidas',
      description: 'Somente em 2022, este número representou uma agressão a cada minuto no Brasil.',
      icon: 'Megaphone'
    },
    secondaryStats: [
      { value: 'Ligue 180', label: 'Central de Atendimento à Mulher', icon: 'Phone' },
      { value: 'Lei Maria da Penha', label: 'Proteção legal e medidas urgentes', icon: 'Shield' }
    ],
    footerNote: 'Neste módulo, você aprenderá a identificar sinais sutis de abuso, como agir em situações de risco e como apoiar vítimas sem julgamentos.'
  }
};