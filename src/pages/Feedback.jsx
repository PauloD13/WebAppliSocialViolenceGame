import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../hooks/useGame.jsx';
import { categories } from '../data/gameData.jsx';

function Feedback() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const catId = parseInt(categoryId);
  const cat = categories.find(c => c.id === catId);
  const { currentQuestion, isTrailComplete } = useGame();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!currentQuestion || !cat) {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  const handleProsseguir = () => {
    if (isTrailComplete) {
      navigate('/conclusion');
    } else {
      navigate('/trail');
    }
  };

  const handleTentarNovamente = () => {
    navigate(`/question/${catId}`);
  };

  return (
    <div className="min-h-screen bg-[#f3fde9] text-[#151e12] font-body flex flex-col items-center pb-32">
      <main className="flex-1 w-full max-w-md px-6 pt-24 pb-8 flex flex-col items-center justify-center space-y-6">
        <div className="relative w-48 h-48 flex items-center justify-center mb-8 animate-celebrate">
          <div className="absolute inset-0 bg-[#58CC02]/20 rounded-full blur-3xl"></div>
          <div className="z-10 bg-[#58CC02] w-32 h-32 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
            <span className="material-symbols-outlined text-white text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <div className="absolute -top-4 -left-4 w-4 h-4 bg-[#FFC800] rounded-full animate-bounce"></div>
          <div className="absolute top-10 -right-8 w-3 h-3 bg-[#1CB0F6] rounded-full animate-pulse"></div>
          <div className="absolute -bottom-6 right-10 w-5 h-5 bg-[#ff8dba] rounded-full animate-float"></div>
        </div>

        <div className="text-center space-y-2 mb-8">
          <h2 className="font-headline text-[24px] leading-[32px] font-bold text-[#136e00]">Muito bem!</h2>
          <p className="font-body text-[18px] leading-[28px] font-medium text-[#3d4b37]">Você concluiu este desafio com sucesso.</p>
        </div>

        <div className="w-full bg-white rounded-xl p-6 border-2 border-[#58CC02] relative overflow-hidden group" style={{ boxShadow: '0 0 40px -5px rgba(88, 204, 2, 0.4)' }}>
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#58CC02]/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="bg-[#58CC02]/10 p-2 rounded-lg">
              <span className="material-symbols-outlined text-[#58CC02]" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
            </div>
            <div className="space-y-2">
              <h3 className="font-headline text-[16px] leading-[20px] font-bold text-[#58CC02] uppercase tracking-widest">Você sabia?</h3>
              <p className="font-body text-[16px] leading-[24px] text-[#151e12] leading-relaxed">{currentQuestion.feedback_acerto}</p>
            </div>
          </div>
        </div>

        <div className="w-full pt-8 flex flex-col items-center gap-2">
          <div className="w-full h-1 bg-[#dce6d2] rounded-full overflow-hidden">
            <div className="h-full bg-[#58CC02] transition-all duration-[3000ms] ease-linear" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="text-[12px] font-headline font-bold text-[#3d4b37]/60 uppercase">Desbloqueando próxima categoria...</span>
        </div>

        <div className="w-full flex flex-col gap-4 mt-8">
          <button onClick={handleProsseguir} className="w-full h-12 bg-[#2bcc00] text-[#0b4f00] font-headline text-[16px] leading-[20px] font-bold tracking-wider uppercase rounded-xl flex items-center justify-center gap-2" style={{ boxShadow: '0 4px 0 0 #0b4f00' }}>
            Prosseguir
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
          <button onClick={handleTentarNovamente} className="w-full h-12 bg-white border-2 border-[#bccbb2] text-[#3d4b37] font-headline text-[16px] leading-[20px] font-bold tracking-wider uppercase rounded-xl flex items-center justify-center gap-2" style={{ boxShadow: '0 4px 0 0 #bccbb2' }}>
            <span className="material-symbols-outlined">refresh</span>
            Tentar novamente
          </button>
        </div>
      </main>
    </div>
  );
}

export default Feedback;
