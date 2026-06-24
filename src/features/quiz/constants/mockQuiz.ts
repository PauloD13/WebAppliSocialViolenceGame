export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizPayload {
  slug: string;
  trailName: string;
  theme: {
    primary: string;
    accent: string;
    glow: string;
  };
  question: string;
  options: QuizOption[];
  feedback: {
    titleCorrect: string;
    titleIncorrect: string;
    explanation: string;
  };
}

export const MOCK_QUIZ: Record<string, QuizPayload> = {
  'feminicidio': {
    slug: 'feminicidio',
    trailName: 'Feminicídio e Violência Doméstica',
    theme: {
      primary: '#EF4444', 
      accent: '#FEF2F2',  
      glow: 'rgba(239, 68, 68, 0.2)',
    },
    question: 'Você nota que um amigo critica constantemente a namorada em público, controlando suas roupas e horários. Qual a atitude mais adequada?',
    options: [
      { id: 'a', text: 'Ignorar o fato, sabendo que em briga de casal ninguém deve se intrometer.', isCorrect: false },
      { id: 'b', text: 'Ligar para a namorada em anônimo para gerar desconfiança.', isCorrect: false },
      { id: 'c', text: 'Chamar o amigo para uma conversa em particular e alertar sobre o comportamento abusivo.', isCorrect: true },
      { id: 'd', text: 'Expor o casal nas redes sociais para que outras pessoas saibam.', isCorrect: false },
    ],
    feedback: {
      titleCorrect: 'Muito bem!',
      titleIncorrect: 'Atenção ao contexto.',
      explanation: 'A empatia e o diálogo direto são bases para a prevenção. O comportamento descrito configura violência psicológica. Pequenas ações de conscientização podem evitar escaladas de violência.'
    }
  }
};