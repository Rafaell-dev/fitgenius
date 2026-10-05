'use client';

import React from 'react';
import { Target, ArrowLeft, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

interface StepPontoFracoProps {
  valorSelecionado: 'Peito' | 'Braço' | 'Perna' | 'Costas' | null;
  aoSelecionar: (pontoFraco: 'Peito' | 'Braço' | 'Perna' | 'Costas') => void;
  aoVoltar: () => void;
  aoAvancar: () => void;
}

export const StepPontoFraco: React.FC<StepPontoFracoProps> = ({
  valorSelecionado,
  aoSelecionar,
  aoVoltar,
  aoAvancar
}) => {
  const grupos: {
    chave: 'Peito' | 'Braço' | 'Perna' | 'Costas';
    titulo: string;
    subtitulo: string;
    regioes: string[];
    estrategiaAG: string;
  }[] = [
    {
      chave: 'Peito',
      titulo: 'Peito',
      subtitulo: 'Peitoral Maior, Superior e Esternal',
      regioes: ['Supino Reto', 'Inclinado', 'Crossover', 'Peck Deck'],
      estrategiaAG: 'Bónus Fitness (+): O AG prescreverá exercícios de peito em pelo menos 2 dias distintos com espaçamento biológico.'
    },
    {
      chave: 'Braço',
      titulo: 'Braço',
      subtitulo: 'Bíceps, Tríceps e Antebraço',
      regioes: ['Rosca Direta', 'Tríceps Corda', 'Paralelas', 'Rosca Martelo'],
      estrategiaAG: 'Bónus Fitness (+): O AG garantirá estímulo duplo para flexores e extensores do braço ao longo da semana.'
    },
    {
      chave: 'Perna',
      titulo: 'Perna',
      subtitulo: 'Quadríceps, Isquiotibiais e Glúteos',
      regioes: ['Agachamento', 'Leg Press', 'Mesa Flexora', 'Elevação Pélvica'],
      estrategiaAG: 'Bónus Fitness (+): O AG dividirá o volume de membros inferiores em 2 sessões para prevenir fadiga excessiva.'
    },
    {
      chave: 'Costas',
      titulo: 'Costas / Posterior',
      subtitulo: 'Dorsal, Trapézio, Rombóides e Deltoide Posterior',
      regioes: ['Puxada Alta', 'Remada Curvada', 'Barra Fixa', 'Deadlift'],
      estrategiaAG: 'Bónus Fitness (+): O AG priorizará puxadas verticais e horizontais em 2 dias da semana para máxima densidade.'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Cabeçalho do Passo */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <Target className="w-3.5 h-3.5" />
          Passo 2 de 3 • Ponto Fraco Prioritário
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Qual é o seu grupo muscular prioritário/ponto fraco?
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          A função de aptidão do Algoritmo Genético concederá uma pontuação adicional considerável para indivíduos que incluírem este grupo em pelo menos 2 dias diferentes.
        </p>
      </div>

      {/* Grid de Opções Estilo Terminal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {grupos.map(opcao => {
          const selecionado = valorSelecionado === opcao.chave;

          return (
            <button
              key={opcao.chave}
              type="button"
              onClick={() => aoSelecionar(opcao.chave)}
              className={`text-left p-5 sm:p-6 rounded-2xl transition-all duration-300 relative border group cursor-pointer ${
                selecionado
                  ? 'bg-gradient-to-br from-cyan-950/70 via-slate-900 to-slate-950 border-cyan-400 kiosk-cyan-glow scale-[1.01]'
                  : 'bg-slate-900/60 hover:bg-slate-900/90 border-white/10 hover:border-cyan-500/50 hover:scale-[1.005]'
              }`}
            >
              {/* Topo do Card */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    selecionado
                      ? 'bg-cyan-400 text-slate-950 border-cyan-300'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {opcao.chave === 'Costas' ? 'Costas/Posterior' : opcao.chave}
                </span>

                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Bónus +550 pts AG</span>
                </div>
              </div>

              {/* Título e Subtítulo */}
              <div className="mb-3">
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {opcao.titulo}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {opcao.subtitulo}
                </p>
              </div>

              {/* Tags de Exercícios Típicos */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {opcao.regioes.map((reg, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5"
                  >
                    {reg}
                  </span>
                ))}
              </div>

              {/* Nota Estratégica do Algoritmo Genético */}
              <div className="pt-3 border-t border-white/5 text-xs text-slate-400 flex items-start gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed text-slate-300">
                  {opcao.estrategiaAG}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Navegação Inferior */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={aoVoltar}
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-white/5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar (Frequência)</span>
        </button>

        <button
          type="button"
          onClick={aoAvancar}
          disabled={!valorSelecionado}
          className={`flex items-center gap-3 px-8 py-4 rounded-xl text-base font-bold transition-all duration-300 ${
            valorSelecionado
              ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
          }`}
        >
          <span>Continuar para Género</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
