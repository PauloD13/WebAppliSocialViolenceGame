import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { nicknameSchema, NicknameFormData } from '../types';
import { useSessionStore } from '../hooks/useSessionStore';
import { Button } from '../../../shared/components/Button/Button';
import { Card } from '../../../shared/components/Card/Card';

export const EntrancePage: React.FC = () => {
  const navigate = useNavigate();
  const setSession = useSessionStore((state) => state.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<NicknameFormData>({
    resolver: zodResolver(nicknameSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: NicknameFormData) => {
    // Aqui, no futuro, faremos a requisição via Axios para o FastAPI criar o registro.
    // Por enquanto, geramos um UUID simulado para avançar no fluxo.
    const simulatedUserId = crypto.randomUUID();
    
    // Armazena a cadeia de caracteres e o ID na sessão local
    setSession(simulatedUserId, data.nickname);
    
    // Redireciona para o mapa de trilhas
    navigate('/trails');
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-brand-bg">
      <div className="w-full max-w-sm">
        {/* Cabeçalho minimalista */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-success flex items-center justify-center">
              <span className="text-white font-bold text-xs">AT</span>
            </div>
            <h1 className="font-bold text-brand-text">Awareness Trail</h1>
          </div>
        </header>

        <Card className="flex flex-col gap-6 p-6">
          {/* Espaço reservado para a ilustração do protótipo */}
          <div className="w-full h-48 bg-emerald-100 rounded-xl flex items-center justify-center overflow-hidden">
             <span className="text-emerald-700 font-medium">Ilustração Placeholder</span>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-extrabold text-brand-text mb-2">
              Explore o Caminho
            </h2>
            <p className="text-sm text-slate-500">
              Aprenda sobre direitos e causas sociais de forma leve e interativa. Sua jornada começa aqui.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="nickname" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Apelido
              </label>
              <input
                id="nickname"
                type="text"
                placeholder="Como quer ser chamado?"
                className={`w-full p-4 rounded-xl border ${
                  errors.nickname ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-brand-success/30'
                } focus:outline-none focus:ring-4 transition-all`}
                {...register('nickname')}
              />
              {errors.nickname && (
                <span className="text-xs text-red-500 font-medium mt-1">
                  {errors.nickname.message}
                </span>
              )}
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              disabled={!isValid}
              className="mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Entrar →
            </Button>

            <p className="text-xs text-center text-slate-400 mt-2">
              Não é necessário senha para começar.
            </p>
          </form>
        </Card>
      </div>
    </main>
  );
};