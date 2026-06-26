import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categories, contextData } from '../data/gameData.jsx';

function Context() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const catId = parseInt(categoryId);
  const cat = categories.find(c => c.id === catId);
  const data = contextData[catId];
  const [showModal, setShowModal] = useState(false);

  if (!data || !cat) {
    return <div className="p-8 text-center">Categoria não encontrada</div>;
  }

  return (
    <div className="min-h-screen bg-[#f3fde9] text-[#151e12] font-body flex flex-col items-center pb-32">
      <main className="w-full max-w-md px-6 pt-24 pb-8 flex flex-col gap-6">
        {/* Context Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2" style={{ color: cat.cor }}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{cat.icon}</span>
            <span className="font-headline text-[12px] font-bold tracking-widest uppercase">{data.modulo}</span>
          </div>
          <h2 className="font-headline text-[24px] leading-[32px] font-bold text-[#151e12]">{data.titulo}</h2>
        </div>

        {/* Main Info Card */}
        <div className={`relative overflow-hidden rounded-xl bg-white border-2 p-6 flex flex-col gap-4 ${cat.glowCard}`}
          style={{ borderColor: `${cat.cor}33` }}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-[96px]" style={{ color: cat.cor }}>{cat.icon}</span>
          </div>
          <div className={`${cat.glassCard} rounded-lg p-4`}>
            <p className="font-body text-[18px] leading-[28px] font-medium text-[#151e12] leading-relaxed">
              {data.destaque}
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="font-headline text-[18px] leading-[28px] font-bold" style={{ color: cat.cor }}>Por que aprender isso?</h3>
            <p className="text-[#3d4b37] leading-relaxed font-body text-[16px] leading-[24px]">
              {data.porQue}
            </p>
          </div>
          {/* Stats Bento Grid */}
          <div className="grid grid-cols-2 gap-3 mt-2">
            {data.stats.map((stat, idx) => (
              <div key={idx} className="bg-[#e7f1dd] p-4 rounded-lg flex flex-col gap-1 border border-[#bccbb2]">
                <span className="font-bold text-2xl" style={{ color: cat.cor }}>{stat.valor}</span>
                <span className="text-[10px] font-headline font-bold text-[#3d4b37] uppercase tracking-tighter leading-tight">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Info Cards */}
        <div className="flex flex-col gap-4">
          {data.cards.map((card, idx) => (
            <div 
              key={idx} 
              className="flex items-start gap-4 p-4 rounded-xl bg-white border border-[#bccbb2] transition-colors hover:border-[#FF4B4B]"
              style={{ ['--hover-border']: cat.cor }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = cat.cor}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#bccbb2'}
            >
              <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: `${cat.cor}1A` }}>
                <span className="material-symbols-outlined" style={{ color: cat.cor }}>{card.icone}</span>
              </div>
              <div>
                <h4 className="font-headline text-[16px] leading-[20px] font-bold mb-1">{card.titulo}</h4>
                <p className="text-sm text-[#3d4b37] font-body text-[14px] leading-[20px]">{card.texto}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Actions */}
        <div className="mt-4 flex flex-col gap-4">
          <button
            onClick={() => navigate(`/question/${catId}`)}
            className={`w-full text-white py-4 px-6 rounded-xl font-headline text-[16px] leading-[20px] font-bold tracking-wider uppercase flex items-center justify-center gap-2 ${cat.buttonPress} transition-all`}
            style={{ backgroundColor: cat.cor, boxShadow: `0 4px 0 0 ${cat.shadowColor}` }}
          >
            <span>IR PARA PERGUNTA</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-transparent border-2 py-3 rounded-xl font-headline text-[16px] leading-[20px] font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
            style={{ borderColor: cat.cor, color: cat.cor }}
          >
            <span className="material-symbols-outlined">menu_book</span>
            SAIBA MAIS
          </button>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl scale-100 transition-transform duration-300">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: `${cat.cor}1A` }}>
              <span className="material-symbols-outlined text-4xl" style={{ color: cat.cor }}>menu_book</span>
            </div>
            <h3 className="font-headline text-[24px] leading-[32px] font-bold text-[#151e12] mb-3">Material Complementar</h3>
            <p className="text-[#3d4b37] font-body text-[16px] leading-[24px] mb-8">
              Preparamos um guia rápido com contatos de emergência e canais oficiais para denúncias seguras.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-4 text-white rounded-xl font-headline text-[16px] font-bold tracking-wider"
              style={{ backgroundColor: cat.cor }}
            >
              FECHAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Context;
