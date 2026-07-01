import React from 'react';
import { useContentItems } from '../hooks';

export const ContextPage = () => {
  const { data, isLoading, isError } = useContentItems();

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10">
      <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200">
        <h2 className="text-3xl font-semibold text-slate-900">Conteúdo</h2>
        <p className="mt-2 text-slate-600">Leia o material de apoio antes ou depois do quiz.</p>
      </section>

      {isLoading && <p className="mt-6 text-slate-600">Carregando conteúdo...</p>}
      {isError && <p className="mt-6 text-red-600">Erro ao carregar conteúdo.</p>}

      <div className="mt-6 grid gap-6">
        {data?.map((item) => (
          <article key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-slate-600">{item.summary}</p>
            <div className="mt-4 text-slate-700 whitespace-pre-line">{item.body}</div>
          </article>
        ))}
      </div>
    </main>
  );
};
