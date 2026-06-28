import React from "react";
import { aboutContent } from "../data/aboutContent.js";

function About() {
  const content = aboutContent;

  return (
    <div className="min-h-screen bg-[#f3fde9] text-[#151e12] font-body pb-32">
      <main className="pt-20 px-6">
        <section className="mt-8 mb-12">
          <div
            className="relative overflow-hidden rounded-3xl bg-[#e7f1dd] p-8"
            style={{ boxShadow: "0 0 30px -5px rgba(19, 110, 0, 0.2)" }}
          >
            <div className="relative z-10">
              <span className="inline-block py-1 px-3 bg-[#2bcc00] text-[#0b4f00] font-headline text-[12px] font-bold rounded-full mb-4">
                {content.subtitulo}
              </span>
              <h2 className="font-headline text-[24px] leading-[32px] font-bold text-[#136e00] mb-4">
                {content.titulo}
              </h2>
              <p className="font-body text-[18px] leading-[28px] font-medium text-[#3d4b37] leading-relaxed">
                {content.descricao}
              </p>
            </div>
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#136e00]/10 rounded-full blur-3xl"></div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-[#136e00] text-white rounded-xl flex items-center justify-center shadow-lg">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                flag
              </span>
            </div>
            <h3 className="font-headline text-[28px] leading-[36px] font-bold text-[#151e12]">
              Nossa Missão
            </h3>
          </div>
          <div className="bg-[#dce6d2]/50 backdrop-blur-sm rounded-2xl p-6 border-l-4 border-[#136e00]">
            <p className="font-body text-[16px] leading-[24px] text-[#3d4b37] mb-4">
              {content.missao}
            </p>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-[#ff8dba] text-white rounded-xl flex items-center justify-center shadow-lg">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                groups
              </span>
            </div>
            <h3 className="font-headline text-[28px] leading-[36px] font-bold text-[#151e12]">
              Nossa Equipe
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div
              className="col-span-2 bg-white p-4 rounded-3xl border-2 border-[#bccbb2] flex items-center gap-4 hover:scale-[1.02] transition-transform duration-300"
              style={{ boxShadow: "0 0 30px -5px rgba(19, 110, 0, 0.2)" }}
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md">
                <img
                  src={content.equipe[0].imagem}
                  alt={content.equipe[0].nome}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-headline text-[18px] font-bold text-[#136e00]">
                  {content.equipe[0].nome}
                </h4>
                <p className="font-body text-[14px] text-[#3d4b37]">{content.equipe[0].cargo}</p>
                <div className="mt-2 flex gap-2">
                  <span className="material-symbols-outlined text-[#136e00] text-sm">
                    linked_camera
                  </span>
                  <span className="material-symbols-outlined text-[#136e00] text-sm">mail</span>
                </div>
              </div>
            </div>
            {content.equipe.slice(1).map((member, idx) => (
              <div
                key={idx}
                className="bg-[#e7f1dd] rounded-3xl p-4 flex flex-col items-center text-center hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden mb-3 ring-2 ring-[#2bcc00] ring-offset-2">
                  <img
                    src={member.imagem}
                    alt={member.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-headline text-[14px] font-bold text-[#151e12]">
                  {member.nome}
                </h4>
                <p className="font-body text-[12px] text-[#3d4b37]">{member.cargo}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <button className="w-full h-14 bg-[#136e00] text-white font-headline text-[16px] font-bold rounded-2xl flex items-center justify-center gap-3 shadow-lg active:translate-y-0.5 border-b-2 border-[#0c5300] transition-all hover:brightness-110">
            <span className="material-symbols-outlined">favorite</span>
            APOIE NOSSA CAUSA
          </button>
        </section>
      </main>
    </div>
  );
}

export default About;
