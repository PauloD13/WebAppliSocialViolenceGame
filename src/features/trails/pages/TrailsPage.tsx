import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../../nickname/hooks/useSessionStore';
import { MOCK_TRAILS } from '../constants/mockTrails';
import { TrailNode } from '../types';
import * as Icons from 'lucide-react';

export const TrailsPage: React.FC = () => {
  const navigate = useNavigate();
  const nickname = useSessionStore((state) => state.nickname);

  const handleNodeClick = (trail: TrailNode) => {
    if (trail.status === 'locked') return;
    // Navega para o módulo de contextualização da respetiva trilha
    navigate(`/content/${trail.slug}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg pb-24">
      {/* Barra Superior */}
      <header className="sticky top-0 bg-brand-bg/90 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-slate-100 z-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-brand-success flex items-center justify-center">
            <span className="text-white font-bold text-[10px]">AT</span>
          </div>
          <span className="font-bold text-sm text-brand-text">Awareness Trail</span>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
          <Icons.User className="w-4 h-4 text-brand-success" />
          <span className="text-xs font-semibold text-slate-700">{nickname || 'Explorador'}</span>
        </div>
      </header>

      {/* Conteúdo Central */}
      <main className="flex-1 max-w-md w-full mx-auto px-6 py-8 flex flex-col items-center">
        <div className="text-center mb-12">
          <h2 className="text-xl font-extrabold text-brand-text mb-2">Sua Jornada</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Explore as trilhas e aprenda sobre direitos e proteção social através deste mapa interativo.
          </p>
        </div>

        {/* Mapa Interativo com Linha Pontilhada */}
        <div className="relative w-full flex flex-col items-center gap-16 select-none">
          
          {/* SVG para renderizar o caminho pontilhado sinuoso por trás dos botões */}
          <svg className="absolute top-8 left-1/2 -translate-x-1/2 w-48 h-[calc(100%-4rem)] pointer-events-none z-0" viewBox="0 0 100 500" preserveAspectRatio="none">
            <path
              d="M 50,0 Q 15,100 50,200 T 50,400 T 50,600"
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="4"
              strokeDasharray="8 8"
            />
          </svg>

          {MOCK_TRAILS.map((trail, index) => {
            // Mapeamento dinâmico dos ícones baseados no Lucide-React
            const IconComponent = (Icons[trail.icon as keyof typeof Icons] || Icons.HelpCircle) as React.ComponentType<{ className?: string }>;
            
            // Alternância horizontal (esquerda, centro, direita) para criar o efeito sinuoso do protótipo
            const alignmentClass = index % 3 === 1 ? 'translate-x-12' : index % 3 === 2 ? '-translate-x-12' : 'translate-x-0';

            return (
              <div key={trail.id} className={`relative flex flex-col items-center z-10 transition-transform duration-300 ${alignmentClass}`}>
                
                {/* Efeito de Brilho Pulsante para nós ativos */}
                {trail.status === 'unlocked' && (
                  <div className="absolute w-16 h-16 -top-1 rounded-full">
                    <span className={trail.glowClass}></span>
                  </div>
                )}

                {/* Botão do Nó da Trilha */}
                <button
                  onClick={() => handleNodeClick(trail)}
                  disabled={trail.status === 'locked'}
                  className={`w-14 h-14 rounded-full border-b-4 flex items-center justify-center shadow-md transition-all active:scale-95 ${trail.colorClass} relative`}
                >
                  {trail.status === 'locked' ? (
                    <Icons.Lock className="w-5 h-5 text-slate-400" />
                  ) : (
                    <IconComponent className="w-6 h-6" />
                  )}
                </button>

                {/* Etiqueta de Texto */}
                <span className={`mt-2 text-xs font-bold px-3 py-1 rounded-full shadow-sm border ${
                  trail.status === 'locked' 
                    ? 'bg-slate-100 text-slate-400 border-slate-200' 
                    : 'bg-white text-brand-text border-slate-100'
                }`}>
                  {trail.title}
                </span>
              </div>
            );
          })}
        </div>
      </main>

      {/* Barra de Navegação Inferior (Bottom Navigation Bar) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 py-2 px-6 flex justify-around items-center shadow-[0_-4px_12px_rgba(0,0,0,0.03)] z-20 max-w-md mx-auto rounded-t-2xl">
        <button className="flex flex-col items-center gap-1 text-brand-success">
          <Icons.Map className="w-5 h-5" />
          <span className="text-[10px] font-bold">Trilhas</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
          <Icons.GraduationCap className="w-5 h-5" />
          <span className="text-[10px] font-medium">Aulas</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
          <Icons.Info className="w-5 h-5" />
          <span className="text-[10px] font-medium">Sobre</span>
        </button>
      </nav>
    </div>
  );
};