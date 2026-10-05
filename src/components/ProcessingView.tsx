'use client';

import React, { useState, useEffect } from 'react';
import { HistoricoGeracao } from '@/types/treino';

interface ProcessingViewProps {
  aoConcluir: () => void;
  historico: HistoricoGeracao[];
}

/**
 * Reproduz, geração a geração, o histórico real de evolução retornado pelo
 * Algoritmo Genético (que executa no servidor em poucos milissegundos).
 * Os números exibidos são os valores reais de fitness de cada geração.
 */
export const ProcessingView: React.FC<ProcessingViewProps> = ({ aoConcluir, historico }) => {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    if (historico.length === 0) {
      aoConcluir();
      return;
    }

    const duracaoTotalMs = 2400;
    const intervaloMs = duracaoTotalMs / historico.length;

    const interval = setInterval(() => {
      setIndice(prev => {
        const prox = prev + 1;
        if (prox >= historico.length - 1) {
          clearInterval(interval);
          setTimeout(aoConcluir, 400);
          return historico.length - 1;
        }
        return prox;
      });
    }, intervaloMs);

    return () => clearInterval(interval);
  }, [aoConcluir, historico]);

  if (historico.length === 0) return null;

  const atual = historico[indice];
  const total = historico.length;
  const progresso = Math.round(((indice + 1) / total) * 100);

  const etapaTexto =
    progresso < 25
      ? 'Avaliando a população inicial e descartando planos acima de 60 min/dia...'
      : progresso < 55
      ? 'Recombinando dias de treino entre os melhores planos (crossover)...'
      : progresso < 80
      ? 'Aplicando mutações: trocando exercícios e reforçando o ponto fraco...'
      : 'Refinando os melhores planos por elitismo...';

  return (
    <div className="w-full max-w-xl mx-auto py-12 px-4 space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
          Otimizando sua rotina semanal
        </h3>
        <p className="text-sm text-stone-500">
          O Algoritmo Genético evolui uma população de planos de treino, selecionando
          os mais aptos a cada geração.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-lg bg-white border border-stone-200">
          <span className="text-xs text-stone-500 block mb-1">Geração</span>
          <span className="text-xl font-bold text-stone-900 num">
            {atual.geracao}<span className="text-sm text-stone-400 font-normal"> / {total}</span>
          </span>
        </div>

        <div className="p-4 rounded-lg bg-white border border-stone-200">
          <span className="text-xs text-stone-500 block mb-1">Melhor fitness</span>
          <span className="text-xl font-bold text-emerald-700 num">
            {atual.melhorFitness.toLocaleString('pt-BR')}
          </span>
        </div>

        <div className="p-4 rounded-lg bg-white border border-stone-200">
          <span className="text-xs text-stone-500 block mb-1">Média da população</span>
          <span className="text-xl font-bold text-stone-700 num">
            {atual.fitnessMedio.toLocaleString('pt-BR')}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-700 rounded-full transition-all duration-75"
            style={{ width: `${progresso}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>{etapaTexto}</span>
          <span className="num font-medium text-stone-700">{progresso}%</span>
        </div>
      </div>
    </div>
  );
};
