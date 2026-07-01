import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useResult } from '../hooks';

export const ResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const resultId = (location.state as { resultId?: string } | null)?.resultId ?? null;
  const { data, isLoading, isError } = useResult(resultId);

  if (!resultId) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-10">
        <div className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200">
          <p className="text-slate-700">Nenhum resultado disponível. Complete um quiz para ver o relatório.</p>
          <button
            className="mt-6 rounded-2xl bg-emerald-600 px-5 py-3 text-white hover:bg-emerald-700"
            onClick={() => navigate('/trails')}
          >
            Voltar para trilhas
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-10">
      <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200">
        <h2 className="text-3xl font-semibold text-slate-900">Resultado do Quiz</h2>
        {isLoading && <p className="mt-4 text-slate-600">Carregando resultado...</p>}
        {isError && <p className="mt-4 text-red-600">Erro ao buscar o resultado.</p>}
        {data && (
          <div className="mt-6 space-y-4">
            <p className="text-lg text-slate-700">{data.message}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <span className="block text-sm text-slate-500">Pontuação</span>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{data.score}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <span className="block text-sm text-slate-500">Total</span>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{data.total}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <span className="block text-sm text-slate-500">Corretas</span>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{data.correct}</p>
              </div>
            </div>
            <button
              className="mt-6 rounded-2xl bg-emerald-600 px-5 py-3 text-white hover:bg-emerald-700"
              onClick={() => navigate('/ranking')}
            >
              Ver ranking
            </button>
          </div>
        )}
      </section>
    </main>
  );
};
