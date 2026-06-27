import React from "react";
import { learnMoreContent } from "../data/gameData.jsx";

function LearnMore() {
  const content = learnMoreContent;

  return (
    <div className="min-h-screen bg-[#f3fde9] text-[#151e12] font-body pb-32">
      <main className="pt-20 pb-8">
        <div className="relative w-full h-[353px] overflow-hidden">
          <div
            className="w-full h-full bg-cover bg-center transition-transform hover:scale-105 duration-700"
            style={{ backgroundImage: `url('${content.imagem}')` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#f3fde9] via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <span className="inline-block bg-[#1CB0F6] text-white px-3 py-1 rounded-full font-headline text-[12px] font-bold shadow-lg">
              {content.categoria}
            </span>
            <h2 className="font-headline text-[24px] leading-[32px] font-bold text-[#151e12] drop-shadow-sm mt-2">
              {content.titulo}
            </h2>
          </div>
        </div>

        <article className="px-6 mt-8 max-w-3xl mx-auto">
          <div
            className="bg-[#edf7e3] p-6 rounded-xl border border-[#bccbb2] mb-8"
            style={{ boxShadow: "0 0 30px rgba(28, 176, 246, 0.15)" }}
          >
            <p className="font-body text-[18px] leading-[28px] font-medium text-[#3d4b37] italic border-l-4 border-[#1CB0F6] pl-4">
              {content.citacao}
            </p>
          </div>

          <section className="article-content text-[#3d4b37]">
            {content.secoes.map((secao, idx) => (
              <div key={idx}>
                <h3 className="font-headline text-[24px] leading-[32px] font-bold text-[#151e12] mb-4">
                  {secao.titulo}
                </h3>
                <p className="font-body text-[16px] leading-[24px] leading-relaxed">
                  {secao.texto}
                </p>
              </div>
            ))}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
              {content.bento.map((item, idx) => (
                <div key={idx} className="bg-[#dce6d2] p-5 rounded-xl border border-[#bccbb2]">
                  <span className="material-symbols-outlined text-[#1CB0F6] mb-2">
                    {item.icone}
                  </span>
                  <h4 className="font-headline text-[16px] font-bold text-[#151e12] mb-2">
                    {item.titulo}
                  </h4>
                  <p className="text-sm font-body text-[#3d4b37] opacity-80">{item.texto}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-12 mb-8 text-center">
            <button className="w-full py-4 bg-[#136e00] text-white font-headline text-[16px] font-bold tracking-wider uppercase rounded-xl shadow-[0_4px_0_0_#0b4f00] hover:shadow-[0_2px_0_0_#0b4f00] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">favorite</span>
              QUERO AJUDAR AGORA
            </button>
            <p className="mt-4 text-sm text-[#3d4b37] font-body">
              Compartilhe este conteúdo e ajude a espalhar consciência.
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}

export default LearnMore;
