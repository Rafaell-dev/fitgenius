'use client';

import React from 'react';
import { HistoricoGeracao } from '@/types/treino';
import { TrendingUp, Activity } from 'lucide-react';

interface EvolutionChartProps {
  historico: HistoricoGeracao[];
  fitnessFinal: number;
}

export const EvolutionChart: React.FC<EvolutionChartProps> = ({ historico, fitnessFinal }) => {
  if (!historico || historico.length === 0) return null;

  const minFitness = Math.min(...historico.map(h => Math.min(h.melhorFitness, h.fitnessMedio)), 800);
  const maxFitness = Math.max(...historico.map(h => Math.max(h.melhorFitness, h.fitnessMedio)), fitnessFinal + 100);

  const largura = 600;
  const altura = 180;
  const paddingX = 40;
  const paddingY = 25;

  const chartWidth = largura - paddingX * 2;
  const chartHeight = altura - paddingY * 2;

  // Converte pontos para coordenadas SVG
  const obterX = (idx: number) => paddingX + (idx / (historico.length - 1)) * chartWidth;
  const obterY = (valor: number) => {
    const normalizado = (valor - minFitness) / (maxFitness - minFitness || 1);
    return altura - paddingY - normalizado * chartHeight;
  };

  const pontosMelhor = historico.map((h, i) => `${obterX(i)},${obterY(h.melhorFitness)}`).join(' ');
  const pontosMedio = historico.map((h, i) => `${obterX(i)},${obterY(h.fitnessMedio)}`).join(' ');

  // Área preenchida para o melhor fitness
  const areaMelhor = `${obterX(0)},${altura - paddingY} ${pontosMelhor} ${obterX(historico.length - 1)},${altura - paddingY}`;

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Curva de Convergência do Algoritmo Genético</h4>
            <p className="text-[11px] text-slate-400">Evolução da Aptidão (Fitness) ao longo das 80 gerações</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-emerald-400 rounded-full inline-block" />
            <span className="text-slate-300 font-medium">Melhor Indivíduo (Elitismo)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-cyan-400/60 rounded-full inline-block" />
            <span className="text-slate-400 font-medium">Média da População</span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${largura} ${altura}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="gradienteMelhor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Linhas de Grade Horizontais */}
          {[0, 0.5, 1].map((pct, idx) => {
            const y = paddingY + pct * chartHeight;
            const valorY = Math.round(maxFitness - pct * (maxFitness - minFitness));
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={largura - paddingX}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] fill-slate-500 font-mono"
                >
                  {valorY}
                </text>
              </g>
            );
          })}

          {/* Área preenchida */}
          <polygon points={areaMelhor} fill="url(#gradienteMelhor)" />

          {/* Linha da Média */}
          <polyline
            points={pontosMedio}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            strokeOpacity="0.7"
          />

          {/* Linha do Melhor */}
          <polyline
            points={pontosMelhor}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Ponto inicial e final do melhor indivíduo */}
          <circle
            cx={obterX(0)}
            cy={obterY(historico[0].melhorFitness)}
            r="3.5"
            fill="#10b981"
          />
          <circle
            cx={obterX(historico.length - 1)}
            cy={obterY(historico[historico.length - 1].melhorFitness)}
            r="4.5"
            fill="#34d399"
            stroke="#064e3b"
            strokeWidth="2"
          />

          {/* Eixo X labels */}
          <text
            x={paddingX}
            y={altura - 8}
            className="text-[9px] fill-slate-500 font-mono"
          >
            Gen 1
          </text>
          <text
            x={largura / 2}
            y={altura - 8}
            textAnchor="middle"
            className="text-[9px] fill-slate-500 font-mono"
          >
            Gen 40
          </text>
          <text
            x={largura - paddingX}
            y={altura - 8}
            textAnchor="end"
            className="text-[9px] fill-slate-500 font-mono"
          >
            Gen 80 (Ótimo)
          </text>
        </svg>
      </div>
    </div>
  );
};
