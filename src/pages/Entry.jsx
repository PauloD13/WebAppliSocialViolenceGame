import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../hooks/useGame.jsx";

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function InputField({ label, id, type = "text", value, onChange, onKeyDown, hasError, placeholder }) {
  return (
    <div className="relative group">
      <label
        htmlFor={id}
        className="absolute -top-2.5 left-4 px-1 bg-[#f3fde9] text-[#3d4b37] font-headline text-[12px] font-bold tracking-wider uppercase transition-all group-focus-within:text-[#136e00]"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete={type === "password" ? "current-password" : "username"}
        className={`w-full h-14 bg-[#f3fde9] border-2 rounded-xl px-4 font-body text-[16px] leading-[24px] text-[#151e12] focus:outline-none focus:border-[#136e00] transition-colors placeholder:text-[#6d7b65] ${
          hasError ? "border-[#ba1a1a] animate-shake" : "border-[#bccbb2]"
        }`}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

function Entry() {
  const navigate = useNavigate();
  const { user, loginUser, registerUser, authError, authLoading } = useGame();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [nome, setNome]   = useState("");
  const [senha, setSenha] = useState("");
  const [fieldError, setFieldError] = useState(false);
  const [localMessage, setLocalMessage] = useState("");

  // Se já logado, redireciona direto para a trilha
  useEffect(() => {
    if (user) navigate("/trail");
  }, [user, navigate]);

  const clearError = () => {
    setFieldError(false);
    setLocalMessage("");
  };

  const shake = (msg) => {
    setFieldError(true);
    setLocalMessage(msg);
    setTimeout(() => setFieldError(false), 600);
  };

  const handleSubmit = async () => {
    if (!nome.trim()) {
      shake("Informe seu nome de usuário.");
      return;
    }
    if (!senha) {
      shake("Informe sua senha.");
      return;
    }
    if (mode === "register" && senha.length < 4) {
      shake("A senha deve ter pelo menos 4 caracteres.");
      return;
    }

    clearError();
    const fn     = mode === "login" ? loginUser : registerUser;
    const result = await fn(nome.trim(), senha);

    if (!result.ok) {
      shake(result.message || authError || "Não foi possível continuar.");
    }
    // Sucesso: o useEffect acima detecta user !== null e redireciona
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const toggleMode = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    clearError();
    setSenha("");
  };

  const isLogin = mode === "login";
  const displayMessage = localMessage || authError || "";

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-6 pb-12 min-h-screen overflow-hidden relative bg-[#f3fde9]">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[60%] bg-[#136e00]/5 blur-[100px] -z-10 rounded-full" />

      {/* Illustration */}
      <div className="w-full max-w-sm mb-10 flex justify-center animate-float">
        <div className="relative w-64 h-64">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#58CC02]/20 rounded-full blur-xl" />
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#136e00]/10 rounded-full blur-2xl" />
          <div className="absolute top-8 left-8 w-16 h-16 bg-[#136e00]/10 rounded-full" />
          <div className="absolute bottom-12 right-12 w-20 h-20 bg-[#58CC02]/15 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#136e00]/5 rounded-full border-2 border-dashed border-[#136e00]/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#136e00] rounded-full flex items-center justify-center shadow-lg">
            <span
              className="material-symbols-outlined text-white text-[48px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              map
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-md text-center space-y-8 z-10">
        {/* Heading */}
        <div className="space-y-2">
          <h2 className="font-headline text-[36px] leading-[44px] tracking-tight font-extrabold text-[#151e12]">
            {isLogin ? "Bem-vindo de volta" : "Criar conta"}
          </h2>
          <p className="font-body text-[15px] leading-[22px] text-[#3d4b37] max-w-[300px] mx-auto">
            {isLogin
              ? "Entre com sua conta para continuar sua jornada."
              : "Crie sua conta e comece a explorar as trilhas."}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4 text-left">
          <InputField
            label="Nome de usuário"
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            onKeyDown={handleKeyDown}
            hasError={fieldError && !nome.trim()}
            placeholder="Seu apelido no jogo"
          />
          <InputField
            label="Senha"
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onKeyDown={handleKeyDown}
            hasError={fieldError && !senha}
            placeholder={isLogin ? "Sua senha" : "Mínimo 4 caracteres"}
          />
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <button
            onClick={handleSubmit}
            disabled={authLoading}
            className="w-full h-14 bg-[#136e00] text-white font-headline text-[16px] leading-[20px] tracking-wider font-bold rounded-xl flex items-center justify-center gap-2 button-press button-press-green transition-all disabled:opacity-70"
          >
            {authLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin-slow">
                  progress_activity
                </span>
                <span>Aguarde...</span>
              </>
            ) : (
              <>
                <span>{isLogin ? "Entrar" : "Criar conta"}</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </>
            )}
          </button>

          {/* Error / hint message */}
          <p
            className={`font-body text-[14px] leading-[20px] text-center transition-colors ${
              displayMessage ? "text-[#ba1a1a]" : "text-[#6d7b65]"
            }`}
          >
            {displayMessage || (isLogin ? "Acesso seguro com senha." : "Seus dados ficam salvos no banco.")}
          </p>

          {/* Toggle login/register */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="font-body text-[14px] text-[#6d7b65]">
              {isLogin ? "Ainda não tem conta?" : "Já possui uma conta?"}
            </span>
            <button
              onClick={toggleMode}
              className="font-headline text-[14px] font-bold text-[#136e00] underline underline-offset-2"
            >
              {isLogin ? "Criar conta" : "Entrar"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Entry;
