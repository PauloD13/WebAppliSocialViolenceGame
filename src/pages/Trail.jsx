import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../hooks/useGame.jsx";

function Trail() {
  const navigate = useNavigate();
  const { getCategoryStats, user, score, logoutUser } = useGame();
  const stats = getCategoryStats();
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const nodePositions = [
    { x: 0,   y: 0   },
    { x: -40, y: 180 },
    { x: 30,  y: 360 },
    { x: -30, y: 540 },
    { x: 20,  y: 720 },
    { x: -10, y: 900 },
  ];

  const handleNodeClick = (catId) => {
    const cat = stats.find((c) => c.id === catId);
    if (!cat?.unlocked) return;
    setActiveTooltip(activeTooltip === catId ? null : catId);
  };

  const handleResponder = (catId) => navigate(`/question/${catId}`);
  const handleContexto  = (catId) => navigate(`/context/${catId}`);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f3fde9] text-[#151e12] pb-24 overflow-x-hidden">
      {/* Header */}
      <header className="pt-12 pb-6 px-6 text-center relative z-10">
        <h1 className="font-headline text-[24px] leading-[32px] font-bold text-[#151e12] mb-2">
          Sua Jornada
        </h1>
        <p className="font-body text-[16px] leading-[24px] text-[#3d4b37] max-w-[280px] mx-auto">
          Explore as trilhas e aprenda sobre direitos e proteção social através deste
        </p>

        {user && (
          <div className="flex items-center justify-center gap-3 mt-3">
            <p className="text-[12px] text-[#6d7b65] font-headline font-bold tracking-wider uppercase">
              {user.nome} • {score} pts
            </p>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-1 text-[11px] font-headline font-bold tracking-wider uppercase text-[#ba1a1a]/60 hover:text-[#ba1a1a] transition-colors"
              title="Sair da conta"
            >
              <span className="material-symbols-outlined text-[14px]">logout</span>
              Sair
            </button>
          </div>
        )}
      </header>

      {/* Journey Map */}
      <main className="relative w-full max-w-md mx-auto py-8" style={{ minHeight: "1100px" }}>
        {/* SVG path */}
        <svg className="svg-path" preserveAspectRatio="none" viewBox="0 0 400 1100">
          <path d="M 200,80 Q 250,180 180,280 T 220,480 T 170,680 T 230,880 T 190,1050" />
        </svg>

        {/* Nodes */}
        {stats.map((cat, index) => {
          const pos         = nodePositions[index] || { x: 0, y: index * 180 };
          const isUnlocked  = cat.unlocked;
          const isCompleted = cat.completed;

          return (
            <div
              key={cat.id}
              className="relative z-10 flex flex-col items-center"
              style={{
                transform:    `translateX(${pos.x}px)`,
                marginBottom: index < stats.length - 1 ? "128px" : "0",
                marginTop:    index === 0 ? "20px" : "0",
              }}
            >
              {/* Tooltip */}
              {isUnlocked && activeTooltip === cat.id && (
                <div className="bg-white rounded-xl shadow-lg p-2 flex gap-2 mb-4 tooltip-arrow relative animate-fade-in-up">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleResponder(cat.id); }}
                    className="bg-[#136e00] text-white font-headline text-[12px] font-bold tracking-wider uppercase px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#136e00]/80 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      edit_square
                    </span>
                    Responder
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleContexto(cat.id); }}
                    className="bg-[#e7f1dd] text-[#3d4b37] font-headline text-[12px] font-bold tracking-wider uppercase px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#e1ebd8] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      menu_book
                    </span>
                    Contexto
                  </button>
                </div>
              )}

              {/* Node button */}
              {isUnlocked ? (
                <button
                  onClick={() => handleNodeClick(cat.id)}
                  className={`relative w-[88px] h-[88px] rounded-full flex items-center justify-center transition-transform active:scale-95 active:translate-y-1 active:shadow-none mb-2 ${
                    isCompleted ? "opacity-80" : ""
                  } ${cat.nodeShadow}`}
                  style={{ backgroundColor: cat.cor }}
                >
                  <span
                    className="material-symbols-outlined text-white text-[40px]"
                    style={{ fontVariationSettings: isCompleted ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {cat.icon}
                  </span>
                  {isCompleted && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#58CC02] rounded-full flex items-center justify-center">
                      <span
                        className="material-symbols-outlined text-white text-[14px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check
                      </span>
                    </span>
                  )}
                </button>
              ) : (
                <div className="relative">
                  <div
                    className="w-[72px] h-[72px] rounded-full flex items-center justify-center mb-2"
                    style={{ backgroundColor: "#c6c6c6", boxShadow: "0 4px 0 0 #a3a3a3" }}
                  >
                    <span className="material-symbols-outlined text-white text-[32px] opacity-80">
                      {cat.icon}
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
                style={{ color: isUnlocked ? cat.cor : "#AFAFAF" }}
              >
                {cat.nome.split(" ")[0]}
              </span>
            </div>
          );
        })}
      </main>

      {/* Logout confirm modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="relative bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl">
            <h3 className="font-headline text-[22px] leading-[30px] font-bold text-[#151e12] mb-3">
              Sair da conta?
            </h3>
            <p className="text-[#3d4b37] font-body text-[15px] leading-[22px] mb-8">
              Seu progresso local será apagado. Sua pontuação no banco ficará salva.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 bg-[#e7f1dd] text-[#3d4b37] rounded-xl font-headline text-[14px] font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 bg-[#ba1a1a] text-white rounded-xl font-headline text-[14px] font-bold"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Trail;
