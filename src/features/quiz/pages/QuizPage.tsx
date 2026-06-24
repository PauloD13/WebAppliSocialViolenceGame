import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_QUIZ } from '../constants/mockQuiz';
import { Button } from '../../../shared/components/Button/Button';
import { Card } from '../../../shared/components/Card/Card';
import * as Icons from 'lucide-react';

export const QuizPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Estados da mecânica do jogo
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const quizData = useMemo(() => MOCK_QUIZ[slug || ''] || null, [slug]);

  if (!quizData) return <div className="min-h-screen flex items-center justify-center bg-brand-bg">Quiz não encontrado.</div>;

  const isCorrect = isSubmitted && quizData.options.find(o => o.id === selectedOptionId)?.isCorrect;

  const handleSubmit = () => {
    if (!selectedOptionId) return;
    setIsSubmitted(true);
    // Aqui no futuro dispararemos o mutation pro FastAPI: salvarResposta(slug, selectedOptionId)
  };

  const handleNext = () => {
    // Se acertou, vai para a tela de Resultado/Conquistas
    if (isCorrect) {
      navigate(`/results/${slug}`);
    } else {
      // Se errou, permite tentar novamente resetando o estado
      setIsSubmitted(false);
      setSelectedOptionId(null);
    }
  };

  return (
    <main 
      className="trail-theme-wrapper min-h-screen bg-brand-bg flex flex-col"
      style={{
        '--trail-color': quizData.theme.primary,
        '--trail-accent-color': quizData.theme.accent,
      } as React.CSSProperties}
    >
      {/* Header Progresso */}
      <header className="px-6 py-4 flex items-center gap-4 bg-brand-bg/90 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100">
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-700" disabled={isSubmitted}>
          <Icons.X className="w-6 h-6" />
        </button>
        {/* Barra de progresso visual */}
        <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-theme-primary transition-all duration-500 w-1/2"></div>
        </div>
      </header>

      {/* Área da Pergunta (Some se estiver no estado de feedback para dar foco) */}
      {!isSubmitted ? (
        <div className="flex-1 max-w-md mx-auto w-full px-6 py-8 flex flex-col">
          <h2 className="text-xl font-bold text-brand-text mb-8 leading-snug">
            {quizData.question}
          </h2>

          <div className="flex flex-col gap-3">
            {quizData.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedOptionId(option.id)}
                  className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 ${
                    isSelected 
                      ? 'border-theme-primary bg-theme-accent/50 shadow-sm' 
                      : 'border-slate-200 bg-white hover:border-theme-primary/40'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-theme-primary' : 'border-slate-300'
                  }`}>
                    {isSelected && <div className="w-3 h-3 rounded-full bg-theme-primary" />}
                  </div>
                  <span className={`text-sm font-medium ${isSelected ? 'text-theme-primary' : 'text-slate-600'}`}>
                    {option.text}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-auto pt-8">
            <Button 
              variant="theme" 
              disabled={!selectedOptionId}
              onClick={handleSubmit}
              className={!selectedOptionId ? 'opacity-50 grayscale' : ''}
            >
              CONFIRMAR RESPOSTA
            </Button>
          </div>
        </div>
      ) : (
        /* Área de Feedback (Sucesso ou Erro) */
        <div className="flex-1 max-w-md mx-auto w-full px-6 py-8 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
          
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg ${
            isCorrect ? 'bg-brand-success shadow-brand-success/30' : 'bg-red-500 shadow-red-500/30'
          }`}>
            {isCorrect ? <Icons.Check className="w-12 h-12 text-white" /> : <Icons.X className="w-12 h-12 text-white" />}
          </div>

          <h2 className={`text-2xl font-black mb-6 ${isCorrect ? 'text-brand-success' : 'text-red-500'}`}>
            {isCorrect ? quizData.feedback.titleCorrect : quizData.feedback.titleIncorrect}
          </h2>

          <Card className="w-full relative border-l-4 border-l-theme-primary">
             <div className="flex items-center gap-2 mb-2 text-theme-primary">
                <Icons.Lightbulb className="w-5 h-5" />
                <span className="font-bold text-xs uppercase tracking-wide">Você sabia?</span>
             </div>
             <p className="text-sm text-slate-600 leading-relaxed font-medium">
               {quizData.feedback.explanation}
             </p>
          </Card>

          <div className="w-full mt-12 flex flex-col gap-3">
             <Button variant={isCorrect ? 'primary' : 'outline'} onClick={handleNext}>
                {isCorrect ? 'Prosseguir →' : '↻ Tentar novamente'}
             </Button>
          </div>
        </div>
      )}
    </main>
  );
};