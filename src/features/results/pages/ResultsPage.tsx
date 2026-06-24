import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components/Button/Button';
import { Card } from '../../../shared/components/Card/Card';
import * as Icons from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Dados fictícios de conclusão (seriam retornados pelo backend ao finalizar o quiz)
  const stats = {
    xp: 150,
    streak: 3,
    position: 12
  };

  return (
    <main className="trail-theme-wrapper min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6">
      
      {/* Selo de Conclusão */}
      <div className="w-32 h-32 rounded-full bg-theme-accent flex items-center justify-center mb-6 border-4 border-white shadow-xl">
        <Icons.Award className="w-16 h-16 text-theme-primary" />
      </div>

      <h1 className="text-2xl font-black text-brand-text mb-2">Trilha Concluída!</h1>
      <p className="text-slate-500 text-sm mb-8">Parabéns por completar o módulo de {slug}.</p>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-8">
        <Card className="flex flex-col items-center p-3 border-transparent shadow-sm">
          <span className="font-black text-brand-text">{stats.xp}</span>
          <span className="text-[10px] text-slate-400 uppercase font-bold">XP</span>
        </Card>
        <Card className="flex flex-col items-center p-3 border-transparent shadow-sm">
          <span className="font-black text-brand-text">{stats.streak}</span>
          <span className="text-[10px] text-slate-400 uppercase font-bold">Dias</span>
        </Card>
        <Card className="flex flex-col items-center p-3 border-transparent shadow-sm">
          <span className="font-black text-brand-text">#{stats.position}</span>
          <span className="text-[10px] text-slate-400 uppercase font-bold">Ranking</span>
        </Card>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3">
        <Button variant="theme" onClick={() => navigate('/trails')}>
          VOLTAR AO MAPA
        </Button>
        <Button variant="outline" className="border-slate-200">
          VER RANKING GLOBAL
        </Button>
      </div>
    </main>
  );
};