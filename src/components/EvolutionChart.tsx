'use client';

import React from 'react';
import { HistoricoGeracao } from '@/types/treino';

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
  const paddingX = 44;
  const paddingY = 25;

  const chartWidth = largura - paddingX * 2;
  const chartHeight = altura - paddingY * 2;

  const obterX = (idx: number) => paddingX + (idx / (historico.length - 1)) * chartWidth;
  const obterY = (valor: number) => {
    const normalizado = (valor - minFitness) / (maxFitness - minFitness || 1);
    return altura - paddingY - normalizado * chartHeight;
  };

  const pontosMelhor = historico.map((h, i) => `${obterX(i)},${obterY(h.melhorFitness)}`).join(' ');
  const pontosMedio = historico.map((h, i) => `${obterX(i)},${obterY(h.fitnessMedio)}`).join(' ');

  const ultimaGeracao = historico[historico.length - 1].geracao;
  const geracaoMeio = historico[Math.floor(historico.length / 2)].geracao;

  return (
    <div className="p-5 rounded-lg bg-white border border-stone-200 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold text-stone-900">Curva de convergência do Algoritmo Genético</h4>
          <p className="text-xs text-stone-500">
            Fitness real registrado em cada geração desta execução
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-stone-600">
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-emerald-700 rounded-full inline-block" />
            Melhor indivíduo
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-stone-400 rounded-full inline-block" style={{ borderBottom: '1px dashed' }} />
            Média da população
          </span>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${largura} ${altura}`} className="w-full h-auto select-none">
          {/* Grade horizontal */}
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
                  stroke="#e7e5e4"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#78716c"
                >
                  {valorY}
                </text>
              </g>
            );
          })}

          {/* Média da população */}
          <polyline
            points={pontosMedio}
            fill="none"
            stroke="#a8a29e"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Melhor indivíduo */}
          <polyline
            points={pontosMelhor}
            fill="none"
            stroke="#047857"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <circle
            cx={obterX(historico.length - 1)}
            cy={obterY(historico[historico.length - 1].melhorFitness)}
            r="3.5"
            fill="#047857"
          />

          {/* Eixo X */}
          <text x={paddingX} y={altura - 8} fontSize="9" fill="#78716c">
            Geração 1
          </text>
          <text x={largura / 2} y={altura - 8} textAnchor="middle" fontSize="9" fill="#78716c">
            Geração {geracaoMeio}
          </text>
          <text x={largura - paddingX} y={altura - 8} textAnchor="end" fontSize="9" fill="#78716c">
            Geração {ultimaGeracao}
          </text>
        </svg>
      </div>
    </div>
  );
};
