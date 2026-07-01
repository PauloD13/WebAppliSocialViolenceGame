import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateSession } from "../hooks";
import { useSessionStore } from "../hooks/useSessionStore";

export const EntrancePage = () => {
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();
  const setSession = useSessionStore((state) => state.setSession);
  const mutation = useCreateSession();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!nickname.trim()) return;
    const result = await mutation.mutateAsync({ nickname: nickname.trim() });
    setSession(result.sessionId, result.nickname);
    navigate("/trails");
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 py-10">
      <section className="w-full rounded-3xl bg-white p-8 shadow-lg shadow-slate-200">
        <h1 className="mb-4 text-3xl font-semibold text-slate-900">Bem-vindo à Awareness Trail</h1>
        <p className="mb-6 text-slate-600">Digite seu apelido para começar a jornada.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Apelido</span>
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="Seu apelido"
              type="text"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-emerald-600 px-5 py-3 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Entrando..." : "Iniciar jornada"}
          </button>
        </form>

        {mutation.isError && (
          <p className="mt-4 text-sm text-red-600">
            Não foi possível iniciar a sessão. Tente novamente.
          </p>
        )}
      </section>
    </main>
  );
};
