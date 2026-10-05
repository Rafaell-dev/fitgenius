'use client';

import React, { useState, useEffect } from 'react';
import { Dna, Sparkles, Activity, CheckCircle2 } from 'lucide-react';

interface ProcessingViewProps {
  aoConcluir: () => void;
  geracaoAlvo?: number;
  fitnessEstimado?: number;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({
  aoConcluir,
  geracaoAlvo = 80,
  fitnessEstimado = 3200
}) => {
  const [geracaoAtual, setGeracaoAtual] = useState(1);
  const [fitnessAtual, setFitnessAtual] = useState(1200);
  const [etapaTexto, setEtapaTexto] = useState('Inicializando população de cromossomos...');
  const [progresso, setProgresso] = useState(0);

  useEffect(() => {
    const totalPassos = geracaoAlvo;
    const duracaoTotalMs = 2200; // 2.2s de simulação visual rica
    const intervaloMs = duracaoTotalMs / totalPassos;

    const interval = setInterval(() => {
      setGeracaoAtual(prev => {
        const prox = prev + 1;
        const pct = Math.min(100, Math.round((prox / totalPassos) * 100));
        setProgresso(pct);

        // Curva de subida de fitness simulada
        const incremento = Math.floor(
          ((fitnessEstimado - 1200) / totalPassos) * (1 + Math.random() * 0.4)
        );
        setFitnessAtual(f => Math.min(fitnessEstimado, f + incremento));

        if (prox < 20) {
          setEtapaTexto('Geração da população inicial (70 indivíduos) e avaliação base...');
        } else if (prox < 40) {
          setEtapaTexto('Executando Crossover: Recombinando dias de treino entre os pais...');
        } else if (prox < 60) {
          setEtapaTexto('Aplicando Mutação Genética: Ajustando exercícios e garantindo ≤ 60 min...');
        } else if (prox < 75) {
          setEtapaTexto('Otimizando descanso: Eliminando grupos musculares em dias consecutivos...');
        } else {
          setEtapaTexto('Convergência atingida! Selecionando melhor indivíduo da geração...');
        }

        if (prox >= totalPassos) {
          clearInterval(interval);
          setTimeout(() => {
            aoConcluir();
          }, 350);
          return totalPassos;
        }

        return prox;
      });
    }, intervaloMs);

    return () => clearInterval(interval);
  }, [aoConcluir, geracaoAlvo, fitnessEstimado]);

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4 text-center space-y-8 animate-in fade-in duration-300">
      {/* Ícone Pulsante Central do AG */}
      <div className="relative inline-flex items-center justify-center">
        <div className="w-28 h-28 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center relative">
          {/* Anel de progresso giratório */}
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
          
          <Dna className="w-12 h-12 text-emerald-400 animate-pulse" />
        </div>

        {/* Glow de fundo */}
        <div className="absolute w-36 h-36 bg-emerald-500/20 blur-2xl rounded-full -z-10 animate-pulse-slow" />
      </div>

      {/* Título & Descrição */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <Activity className="w-3.5 h-3.5 animate-spin" />
          Algoritmo Genético em Execução
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Evoluindo a Rotina Semanal
        </h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Simulando seleção natural, crossover de rotinas e mutação genética para encontrar a melhor combinação de exercícios.
        </p>
      </div>

      {/* Painel de Métricas em Tempo Real */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-left">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
          <span className="text-[11px] text-slate-500 font-semibold block">GERAÇÃO</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            {geracaoAtual} <span className="text-xs text-slate-500 font-normal">/ {geracaoAlvo}</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
          <span className="text-[11px] text-slate-500 font-semibold block">FITNESS ATUAL</span>
          <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">
            {fitnessAtual} <span className="text-xs text-slate-500 font-normal">pts</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
          <span className="text-[11px] text-slate-500 font-semibold block">POPULAÇÃO</span>
          <span className="text-xl sm:text-2xl font-black text-slate-200 font-mono">
            70 <span className="text-xs text-slate-500 font-normal">planos</span>
          </span>
        </div>
      </div>

      {/* Barra de Progresso com Scanline */}
      <div className="space-y-3">
        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-white/10 p-0.5 relative">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-75 relative"
            style={{ width: `${progresso}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="text-emerald-400 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            {etapaTexto}
          </span>
          <span className="font-mono font-bold text-slate-200">{progresso}%</span>
        </div>
      </div>

      {/* Checklist de Restrições Monitoradas */}
      <div className="pt-2 text-xs text-slate-400 flex flex-wrap justify-center gap-3">
        <span className="flex items-center gap-1 text-slate-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Teto 60 min/dia
        </span>
        <span className="flex items-center gap-1 text-slate-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Descanso 48h sem conflito
        </span>
        <span className="flex items-center gap-1 text-slate-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Ponto Fraco em 2+ dias
        </span>
      </div>
    </div>
  );
};
