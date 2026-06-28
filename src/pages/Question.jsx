import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGame } from "../hooks/useGame.js";

function Question() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const catId = parseInt(categoryId);
  const {
    categories,
    contentStatus,
    drawQuestion,
    submitAnswer,
    currentQuestion,
    setSelectedOption,
    showError,
    errorMessage,
  } = useGame();
  const cat = categories.find((c) => c.id === catId);
  const [localSelected, setLocalSelected] = useState(null);

  useEffect(() => {
    setLocalSelected(null);
    drawQuestion(catId);
  }, [catId, drawQuestion]);

  if (!cat || contentStatus === "loading") {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  if (!currentQuestion) {
    return <div className="p-8 text-center">Nenhuma pergunta disponível para esta categoria.</div>;
  }

  const handleSelect = (letra) => {
    setLocalSelected(letra);
    setSelectedOption(letra);
  };

  const handleConfirm = () => {
    if (!localSelected) return;
    const result = submitAnswer(catId, currentQuestion.id, localSelected);
    if (result.correct) {
      navigate(`/feedback/${catId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3fde9] text-[#151e12] font-body flex flex-col pb-32">
      <header className="px-6 pt-10 pb-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${cat.cor}1A` }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1", color: cat.cor }}
            >
              {cat.icon}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-[12px] font-bold uppercase tracking-wider text-[#3d4b37]">
              Categoria Ativa
            </span>
            <h1
              className="font-headline text-[24px] leading-[32px] font-bold"
              style={{ color: cat.cor }}
            >
              {cat.nome}
            </h1>
          </div>
        </div>
        <div className="w-full h-2 bg-[#e7f1dd] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ backgroundColor: cat.cor, width: "50%" }}
          ></div>
        </div>
      </header>

      <main className="flex-1 px-6 flex flex-col gap-4">
        <div
          className="bg-white border-2 rounded-xl p-6 mb-6"
          style={{ borderColor: `${cat.cor}33`, boxShadow: `0 0 30px -5px ${cat.cor}66` }}
        >
          <p className="font-headline text-[24px] leading-[32px] font-bold text-[#151e12] mb-4">
            {currentQuestion.texto}
          </p>
          {currentQuestion.dica && (
            <div
              className="flex items-start gap-2 p-3 rounded-lg"
              style={{ backgroundColor: `${cat.cor}0D`, border: `1px solid ${cat.cor}1A` }}
            >
              <span className="material-symbols-outlined text-[20px]" style={{ color: cat.cor }}>
                lightbulb
              </span>
              <p className="font-body text-[16px] leading-[24px] text-[#3d4b37] italic">
                {currentQuestion.dica}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {currentQuestion.alternativas.map((alt) => (
            <button
              key={alt.letra}
              onClick={() => handleSelect(alt.letra)}
              className="option-card w-full text-left border-2 p-4 rounded-xl flex items-center gap-4 transition-all"
              style={
                localSelected === alt.letra
                  ? { borderColor: cat.cor, backgroundColor: `${cat.cor}1A` }
                  : { borderColor: "#bccbb2", backgroundColor: "#e7f1dd" }
              }
            >
              <div
                className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center font-headline text-[16px] font-bold transition-colors"
                style={
                  localSelected === alt.letra
                    ? { backgroundColor: cat.cor, color: "white" }
                    : { backgroundColor: "#dce6d2", color: "#3d4b37" }
                }
              >
                {alt.letra}
              </div>
              <p className="font-body text-[16px] leading-[24px] text-[#151e12] leading-snug">
                {alt.texto}
              </p>
            </button>
          ))}
        </div>

        {showError && (
          <div className="animate-fade-in-up bg-[#ffdad6] border-l-4 border-[#ba1a1a] p-4 rounded-r-lg">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-[#ba1a1a]">info</span>
              <p className="text-sm text-[#3d4b37]">{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={handleConfirm}
            disabled={!localSelected}
            className="w-full text-white font-headline text-[16px] leading-[20px] font-bold tracking-widest uppercase py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            style={{ backgroundColor: cat.cor, boxShadow: `0 4px 0 0 ${cat.shadowColor}` }}
          >
            <span>Confirmar Resposta</span>
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default Question;
