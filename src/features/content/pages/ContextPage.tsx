import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_CONTENTS } from '../constants/mockContent';
import { Button } from '../../../shared/components/Button/Button';
import { Card } from '../../../shared/components/Card/Card';
import * as Icons from 'lucide-react';

export const ContextPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Busca os dados (no futuro, será via React Query: useQuery)
  const contentData = useMemo(() => {
    return MOCK_CONTENTS[slug || ''] || null;
  }, [slug]);

  if (!contentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg text-slate-500">
        Conteúdo não encontrado.
      </div>
    );
  }

  const { theme, mainStat, secondaryStats } = contentData;
  const MainIcon = (Icons[mainStat.icon as keyof typeof Icons] || Icons.Info) as React.ComponentType<{ className?: string }>;

  return (
    // Injeção dinâmica do tema da trilha
    <main 
      className="trail-theme-wrapper min-h-screen bg-brand-bg pb-6 flex flex-col"
      style={{
        '--trail-color': theme.primary,
        '--trail-accent-color': theme.accent,
        '--trail-glow-color': theme.glow,
      } as React.CSSProperties}
    >
      {/* Header Fixo */}
      <header className="sticky top-0 bg-brand-bg/90 backdrop-blur-md px-6 py-4 flex items-center gap-3 border-b border-slate-100 z-10">
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-700 transition-colors">
          <Icons.ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-xs uppercase tracking-wider text-theme-primary px-3 py-1 bg-theme-accent rounded-full">
          {contentData.trailName}
        </span>
      </header>

      {/* Corpo do Conteúdo */}
      <div className="flex-1 max-w-md mx-auto w-full px-6 py-8 flex flex-col gap-6">
        
        <div>
          <h1 className="text-3xl font-extrabold text-brand-text mb-2 tracking-tight">
            {contentData.title}
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            {contentData.subtitle}
          </p>
        </div>

        {/* Card Principal de Estatística */}
        <Card variant="stat" className="relative overflow-hidden bg-white border-2 border-theme-primary/20">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-theme-accent rounded-full opacity-50 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-5xl font-black text-theme-primary tracking-tighter">
                {mainStat.value}
              </span>
              <MainIcon className="w-8 h-8 text-theme-primary opacity-20" />
            </div>
            <h3 className="font-bold text-brand-text text-lg mb-2">{mainStat.label}</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              {mainStat.description}
            </p>
          </div>
        </Card>

        {/* Cards Secundários */}
        <div className="grid grid-cols-2 gap-4">
          {secondaryStats.map((stat, idx) => {
            const StatIcon = (Icons[stat.icon as keyof typeof Icons] || Icons.HelpCircle) as React.ComponentType<{ className?: string }>;
            return (
              <Card key={idx} className="flex flex-col items-center text-center p-4 bg-theme-accent/30 border-transparent">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-theme-primary mb-3 shadow-sm">
                  <StatIcon className="w-5 h-5" />
                </div>
                <span className="font-bold text-brand-text text-sm mb-1">{stat.value}</span>
                <span className="text-[10px] text-slate-500 font-medium leading-tight">{stat.label}</span>
              </Card>
            );
          })}
        </div>

        {/* Nota de rodapé explicativa */}
        <div className="mt-4 flex gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <Icons.Target className="w-6 h-6 text-emerald-500 shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-brand-text mb-1">O que vamos testar?</span>
            <p className="text-xs text-slate-500 leading-relaxed">
              {contentData.footerNote}
            </p>
          </div>
        </div>
      </div>

      {/* Ações Inferiores Fixas */}
      <div className="mt-auto px-6 pt-4 pb-4 bg-brand-bg flex flex-col gap-3 max-w-md mx-auto w-full">
        <Button variant="outline" className="border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300">
          <Icons.BookOpen className="w-4 h-4" />
          CONTEÚDO APROFUNDADO
        </Button>
        <Button variant="theme" onClick={() => navigate(`/quiz/${slug}`)} className="shadow-theme-primary/30 shadow-lg">
          IR PARA PERGUNTA →
        </Button>
      </div>

    </main>
  );
};