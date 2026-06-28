import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../hooks/useGame.jsx";

function Conclusion() {
  const navigate = useNavigate();
  const { getCategoryStats, resetTrail, score, user } = useGame();
  const stats = getCategoryStats();
  const [showConfirm, setShowConfirm] = useState(false);

  const totalAttempts = stats.reduce((sum, s) => sum + (s.attempts || 0), 0);
  const totalErrors = stats.reduce((sum, s) => sum + (s.errors || 0), 0);
  const completedCount = stats.filter((s) => s.completed).length;
  const totalCategories = stats.length || 1;
  const accuracy =
    totalAttempts > 0 ? Math.round(((totalAttempts - totalErrors) / totalAttempts) * 100) : 100;

  const circumference = 2 * Math.PI * 56; // ≈ 351.86
  const dashOffset = circumference * (1 - completedCount / totalCategories);

  const handleReiniciar = () => setShowConfirm(true);
  const confirmReset = () => {
    resetTrail();
    setShowConfirm(false);
    navigate("/trail");
  };

  return (
    <div className="min-h-screen bg-[#f3fde9] text-[#151e12] font-body flex flex-col pb-32 overflow-x-hidden">
      <main className="flex-1 pt-20 pb-8 px-6 flex flex-col items-center max-w-lg mx-auto w-full relative">
        {/* Celebration header */}
        <section className="text-center mt-4 mb-8 z-20">
          <div className="relative inline-block mb-4">
            <div
              className="w-32 h-32 bg-[#2bcc00] rounded-full flex items-center justify-center"
              style={{ boxShadow: "0 0 30px rgba(88, 204, 2, 0.2)" }}
            >
              <span
                className="material-symbols-outlined text-[64px] text-[#0b4f00]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                celebration
              </span>
            </div>
          </div>
          <h1 className="font-headline text-[24px] leading-[32px] font-bold text-[#151e12] mb-2">
            Parabéns{user?.nome ? `, ${user.nome}` : ""}!
          </h1>
          <p className="font-body text-[18px] leading-[28px] font-medium text-[#3d4b37] px-4">
            Você concluiu toda a jornada de conscientização com sucesso.
          </p>
        </section>

        {/* Stats grid */}
        <section className="w-full grid grid-cols-2 gap-4 mb-8 z-20">
          {/* Progress circle */}
          <div className="col-span-2 bg-white p-6 rounded-xl border-2 border-[#bccbb2] shadow-sm flex flex-col items-center">
            <span className="text-[#3d4b37] font-headline text-[12px] font-bold uppercase mb-4">
              Progresso Geral
            </span>
            <div className="relative w-32 h-32 mb-2">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-[#e7f1dd]"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeDasharray={circumference.toFixed(2)}
                  strokeDashoffset={dashOffset.toFixed(2)}
                  className="text-[#58CC02] transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-headline text-[28px] leading-[36px] font-bold text-[#151e12]">
                  {completedCount}/{totalCategories}
                </span>
                <span className="text-[10px] font-bold text-[#3d4b37] uppercase">Trilhas</span>
              </div>
            </div>
            <p className="font-headline text-[16px] font-bold text-[#58CC02]">
              {Math.round((completedCount / totalCategories) * 100)}% Concluído
            </p>
          </div>

          {/* Score */}
          <div className="bg-[#e7f1dd] p-4 rounded-xl border-2 border-[#bccbb2] flex flex-col items-start gap-1">
            <span
              className="material-symbols-outlined text-[#136e00]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="font-headline text-[28px] leading-[36px] font-bold text-[#151e12]">
              {score}
            </span>
            <span className="text-[12px] font-body text-[#3d4b37] leading-tight">
              Pontos nesta trilha
            </span>
          </div>

          {/* Accuracy */}
          <div className="bg-[#e7f1dd] p-4 rounded-xl border-2 border-[#bccbb2] flex flex-col items-start gap-1">
            <span
              className="material-symbols-outlined text-[#1CB0F6]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              target
            </span>
            <span className="font-headline text-[28px] leading-[36px] font-bold text-[#151e12]">
              {accuracy}%
            </span>
            <span className="text-[12px] font-body text-[#3d4b37] leading-tight">
              Precisão Global
            </span>
          </div>

          {/* Attempts */}
          <div className="col-span-2 bg-[#e7f1dd] p-4 rounded-xl border-2 border-[#bccbb2] flex items-center gap-4">
            <span
              className="material-symbols-outlined text-[#136e00]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              history
            </span>
            <div>
              <span className="font-headline text-[22px] font-bold text-[#151e12]">
                {totalAttempts}
              </span>
              <span className="block text-[12px] font-body text-[#3d4b37]">
                Total de tentativas
              </span>
            </div>
          </div>
        </section>

        {/* Prize */}
        <section
          className="w-full bg-white/60 backdrop-blur-sm p-6 rounded-xl border-2 border-[#2bcc00] mb-8 flex flex-col items-center gap-4 text-center z-20"
          style={{ boxShadow: "0 0 30px rgba(88, 204, 2, 0.2)" }}
        >
          <div className="animate-float">
            <div className="w-24 h-24 bg-gradient-to-br from-[#79ff59] to-[#136e00] rounded-full flex items-center justify-center shadow-lg border-4 border-white">
              <span
                className="material-symbols-outlined text-[48px] text-white"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                military_tech
              </span>
            </div>
          </div>
          <div>
            <h3 className="font-headline text-[18px] leading-[28px] font-bold text-[#151e12] mb-2">
              Seu Prêmio te Espera!
            </h3>
            <p className="font-body text-[16px] leading-[24px] text-[#3d4b37]">
              Você desbloqueou um <b>Botton de Embaixador Lumina</b>. Retire-o agora no balcão de
              informações principal.
            </p>
          </div>
          <div className="bg-[#e7f1dd] p-3 rounded-lg border border-dashed border-[#136e00] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#136e00]">location_on</span>
            <span className="text-sm font-semibold text-[#3d4b37]">
              Procure um representante do 3° DS
            </span>
          </div>
        </section>

        {/* Actions */}
        <div className="w-full space-y-3 z-20">
          <button
            onClick={() => navigate("/trail")}
            className="w-full py-4 bg-[#136e00] text-white font-headline text-[16px] font-bold tracking-wider uppercase rounded-xl border-b-[4px] border-[#0b4f00] shadow-md flex items-center justify-center gap-2"
          >
            Voltar para a Trilha
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
          <button
            onClick={handleReiniciar}
            className="w-full py-4 bg-[#dce6d2] text-[#136e00] font-headline text-[16px] font-bold tracking-wider uppercase rounded-xl border-2 border-[#bccbb2] shadow-sm flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">restart_alt</span>
            Reiniciar Trilha
          </button>
        </div>
      </main>

      {/* Reset confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          />
          <div className="relative bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl">
            <h3 className="font-headline text-[24px] leading-[32px] font-bold text-[#151e12] mb-3">
              Reiniciar Trilha?
            </h3>
            <p className="text-[#3d4b37] font-body text-[16px] leading-[24px] mb-8">
              Seu progresso local será reiniciado. Sua pontuação acumulada no banco de dados fica
              preservada.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 bg-[#e7f1dd] text-[#3d4b37] rounded-xl font-headline text-[14px] font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={confirmReset}
                className="flex-1 py-3 bg-[#136e00] text-white rounded-xl font-headline text-[14px] font-bold"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Conclusion;
