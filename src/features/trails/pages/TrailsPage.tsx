import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrails } from '../hooks';

export const TrailsPage = () => {
  const navigate = useNavigate();
  const { data: trails, isLoading, isError } = useTrails();

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10">
      <section className="mb-8 rounded-3xl bg-white p-8 shadow-lg shadow-slate-200">
        <h2 className="text-3xl font-semibold text-slate-900">Trilhas de conscientização</h2>
        <p className="mt-2 text-slate-600">Escolha uma trilha para avançar no seu aprendizado.</p>
      </section>
      {isLoading && <p className="text-slate-600">Carregando trilhas...</p>}
      {isError && <p className="text-red-600">Erro ao carregar as trilhas.</p>}
      <div className="grid gap-6 md:grid-cols-2">
        {trails?.map((trail) => (
          <article key={trail.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">{trail.title}</h3>
            <p className="mt-3 text-slate-600">{trail.description}</p>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm text-slate-500">Progresso: {trail.progress}%</span>
              <button
                className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                onClick={() => navigate('/quiz', { state: { trailId: trail.id } })}
              >
                Avançar
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
};
