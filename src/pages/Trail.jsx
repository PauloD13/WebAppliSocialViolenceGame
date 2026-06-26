import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../hooks/useGame.jsx';
import { categories } from '../data/gameData.jsx';

function Trail() {
  const navigate = useNavigate();
  const { getCategoryStats, user } = useGame();
  const stats = getCategoryStats();
  const [activeTooltip, setActiveTooltip] = useState(null);

  const nodePositions = [
    { x: 0, y: 0 },      // Feminicídio
    { x: -40, y: 180 },  // Bullying
    { x: 30, y: 360 },   // Abuso
    { x: -30, y: 540 },  // Direitos Humanos
    { x: 20, y: 720 },   // Racismo
    { x: -10, y: 900 },  // Causa Animal
  ];

  const handleNodeClick = (catId) => {
    const cat = stats.find(c => c.id === catId);
    if (!cat.unlocked) return;
    setActiveTooltip(activeTooltip === catId ? null : catId);
  };

  const handleResponder = (catId) => {
    navigate(`/question/${catId}`);
  };

  const handleContexto = (catId) => {
    navigate(`/context/${catId}`);
  };

  return (
    <div className="min-h-screen bg-[#f3fde9] text-[#151e12] pb-24 overflow-x-hidden">
      {/* Header Section */}
      <header className="pt-12 pb-6 px-6 text-center relative z-10">
        <h1 className="font-headline text-[24px] leading-[32px] font-bold text-[#151e12] mb-2">Sua Jornada</h1>
        <p className="font-body text-[16px] leading-[24px] text-[#3d4b37] max-w-[280px] mx-auto">
          Explore as trilhas e aprenda sobre direitos e proteção social através deste
        </p>
        {user && (
          <p className="text-[12px] text-[#6d7b65] mt-2 font-headline font-bold tracking-wider uppercase">
            Bem-vindo, {user.nickname}
          </p>
        )}
      </header>

      {/* Journey Map Container */}
      <main className="relative w-full max-w-md mx-auto py-8" style={{ minHeight: '1100px' }}>
        {/* Curved Path SVG */}
        <svg className="svg-path" preserveAspectRatio="none" viewBox="0 0 400 1100">
          <path d="M 200,80 Q 250,180 180,280 T 220,480 T 170,680 T 230,880 T 190,1050" />
        </svg>

        {/* Nodes */}
        {stats.map((cat, index) => {
          const pos = nodePositions[index];
          const isUnlocked = cat.unlocked;
          const isCompleted = cat.completed;
          const catConfig = categories.find(c => c.id === cat.id);

          return (
            <div
              key={cat.id}
              className="relative z-10 flex flex-col items-center"
              style={{ 
                transform: `translateX(${pos.x}px)`,
                marginBottom: index < 5 ? '128px' : '0',
                marginTop: index === 0 ? '20px' : '0'
              }}
            >
              {/* Tooltip (só para desbloqueados) */}
              {isUnlocked && activeTooltip === cat.id && (
                <div className="bg-white rounded-xl shadow-lg p-2 flex gap-2 mb-4 tooltip-arrow relative animate-fade-in-up">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleResponder(cat.id); }}
                    className="bg-[#136e00] text-white font-headline text-[12px] font-bold tracking-wider uppercase px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#136e00]/80 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>edit_square</span>
                    Responder
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleContexto(cat.id); }}
                    className="bg-[#e7f1dd] text-[#3d4b37] font-headline text-[12px] font-bold tracking-wider uppercase px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#e1ebd8] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
                    Contexto
                  </button>
                </div>
              )}

              {/* Node Button */}
              {isUnlocked ? (
                <button
                  onClick={() => handleNodeClick(cat.id)}
                  className={`w-[88px] h-[88px] rounded-full flex items-center justify-center transition-transform active:scale-95 active:translate-y-1 active:shadow-none mb-2 ${
                    isCompleted ? 'opacity-80' : ''
                  } ${catConfig.nodeShadow}`}
                  style={{ backgroundColor: catConfig.cor }}
                >
                  <span 
                    className="material-symbols-outlined text-white text-[40px]"
                    style={{ fontVariationSettings: isCompleted ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {catConfig.icon}
                  </span>
                  {isCompleted && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#58CC02] rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    </span>
                  )}
                </button>
              ) : (
                <div className="relative">
                  <div 
                    className="w-[72px] h-[72px] rounded-full flex items-center justify-center mb-2"
                    style={{ 
                      backgroundColor: '#c6c6c6',
                      boxShadow: '0 4px 0 0 #a3a3a3'
                    }}
                  >
                    <span className="material-symbols-outlined text-white text-[32px] opacity-80">
                      {catConfig.icon}
                    </span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow border border-[#bccbb2]">
                    <span className="material-symbols-outlined text-[16px] text-[#AFAFAF]">lock</span>
                  </div>
                </div>
              )}

              {/* Label */}
              <span 
                className="font-headline text-[12px] font-bold tracking-wider uppercase"
                style={{ color: isUnlocked ? catConfig.cor : '#AFAFAF' }}
              >
                {cat.nome.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </main>
    </div>
  );
}

export default Trail;
