import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../hooks/useGame.jsx';

function Entry() {
  const navigate = useNavigate();
  const { setNickname } = useGame();
  const [nickname, setLocalNickname] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEnter = () => {
    if (nickname.trim() === '') {
      setError(true);
      setTimeout(() => setError(false), 500);
      return;
    }
    setLoading(true);
    setNickname(nickname.trim());
    setTimeout(() => {
      navigate('/trail');
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleEnter();
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-6 pb-12 min-h-screen overflow-hidden relative bg-[#f3fde9]">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[60%] bg-[#136e00]/5 blur-[100px] -z-10 rounded-full"></div>

      {/* Illustration Section */}
      <div className="w-full max-w-sm mb-12 flex justify-center animate-float">
        <div className="relative w-72 h-72">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#58CC02]/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#136e00]/10 rounded-full blur-2xl"></div>
          {/* Decorative circles */}
          <div className="absolute top-8 left-8 w-16 h-16 bg-[#136e00]/10 rounded-full"></div>
          <div className="absolute bottom-12 right-12 w-20 h-20 bg-[#58CC02]/15 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#136e00]/5 rounded-full border-2 border-dashed border-[#136e00]/20"></div>
          {/* Central icon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#136e00] rounded-full flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-white text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="w-full max-w-md text-center space-y-8 z-10">
        <div className="space-y-3">
          <h2 className="font-headline text-[40px] leading-[48px] tracking-tight font-extrabold text-[#151e12]">Explore o Caminho</h2>
          <p className="font-body text-[16px] leading-[24px] text-[#3d4b37] max-w-[300px] mx-auto">
            Aprenda sobre direitos e causas sociais de forma leve e interativa. Sua jornada começa aqui.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div className="relative group">
            <label className="absolute -top-2.5 left-4 px-1 bg-[#f3fde9] text-[#3d4b37] font-headline text-[12px] font-bold tracking-wider uppercase transition-all group-focus-within:text-[#136e00]">
              Apelido
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setLocalNickname(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Como quer ser chamado?"
              className={`w-full h-14 bg-[#f3fde9] border-2 rounded-xl px-4 font-body text-[16px] leading-[24px] text-[#151e12] focus:outline-none focus:border-[#136e00] focus:ring-0 transition-colors placeholder:text-[#6d7b65] ${
                error ? 'border-[#ba1a1a] animate-shake' : 'border-[#bccbb2]'
              }`}
            />
          </div>
          <button
            onClick={handleEnter}
            disabled={loading}
            className="w-full h-14 bg-[#136e00] text-white font-headline text-[16px] leading-[20px] tracking-wider font-bold rounded-xl flex items-center justify-center gap-2 button-press button-press-green transition-all disabled:opacity-80"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin-slow">progress_activity</span>
                <span>Carregando...</span>
              </>
            ) : (
              <>
                <span>Entrar</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </>
            )}
          </button>
          <p className="font-body text-[16px] leading-[24px] text-[#6d7b65] text-sm">
            Não é necessário senha para começar.
          </p>
        </div>
      </div>
    </main>
  );
}

export default Entry;
