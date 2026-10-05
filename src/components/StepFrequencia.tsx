'use client';

import React from 'react';
import { CalendarDays, Zap, Clock, ArrowRight } from 'lucide-react';

interface StepFrequenciaProps {
  valorSelecionado: 2 | 3 | 4 | 5 | null;
  aoSelecionar: (frequencia: 2 | 3 | 4 | 5) => void;
  aoAvancar: () => void;
}

export const StepFrequencia: React.FC<StepFrequenciaProps> = ({
  valorSelecionado,
  aoSelecionar,
  aoAvancar
}) => {
  const opcoes: {
    valor: 2 | 3 | 4 | 5;
    titulo: string;
    subtitulo: string;
    divisao: string;
    descricao: string;
    badge: string;
  }[] = [
    {
      valor: 2,
      titulo: '2x por semana',
      subtitulo: 'Treino A / B',
      divisao: 'Terça e Quinta',
      descricao: 'Ideal para rotinas corridas. Foco em estímulos completos e 48h de descanso obrigatório entre treinos.',
      badge: 'Eficiência Máxima'
    },
    {
      valor: 3,
      titulo: '3x por semana',
      subtitulo: 'Clássico A / B / C',
      divisao: 'Segunda, Quarta e Sexta',
      descricao: 'Divisão equilibrada mais consagrada do fisiculturismo. Excelente recuperação neuromuscular.',
      badge: 'Mais Popular'
    },
    {
      valor: 4,
      titulo: '4x por semana',
      subtitulo: 'Divisão A / B / C / D',
      divisao: 'Seg, Ter, Qui e Sex',
      descricao: 'Ótima distribuição de volume semanal. O AG assegura descanso na quarta-feira e fim de semana.',
      badge: 'Hipertrofia Ótima'
    },
    {
      valor: 5,
      titulo: '5x por semana',
      subtitulo: 'Avançado A / B / C / D / E',
      divisao: 'Segunda a Sexta-feira',
      descricao: 'Volume fracionado de alta densidade. O AG organiza os grupos musculares para nunca treinar o mesmo grupo em dias seguidos.',
      badge: 'Alta Performance'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Cabeçalho do Passo */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <CalendarDays className="w-3.5 h-3.5" />
          Passo 1 de 3 • Frequência Semanal
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Quantos dias por semana pode treinar?
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Toque na opção desejada. O motor de Algoritmo Genético irá montar a matriz de cromossomos exatamente com o número de dias selecionado.
        </p>
      </div>

      {/* Grid de Seleção Estilo Terminal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {opcoes.map(opcao => {
          const selecionado = valorSelecionado === opcao.valor;

          return (
            <button
              key={opcao.valor}
              type="button"
              onClick={() => aoSelecionar(opcao.valor)}
              className={`text-left p-5 sm:p-6 rounded-2xl transition-all duration-300 relative border group cursor-pointer ${
                selecionado
                  ? 'bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-950 border-emerald-500 kiosk-active-glow scale-[1.01]'
                  : 'bg-slate-900/60 hover:bg-slate-900/90 border-white/10 hover:border-emerald-500/50 hover:scale-[1.005]'
              }`}
            >
              {/* Badge de Destaque */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    selecionado
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700 group-hover:border-slate-600'
                  }`}
                >
                  {opcao.badge}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>≤ 60 min/dia</span>
                </div>
              </div>

              {/* Botão Valor e Título */}
              <div className="flex items-center gap-4 mb-3">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black transition-all ${
                    selecionado
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                      : 'bg-slate-800 text-slate-200 group-hover:bg-slate-700'
                  }`}
                >
                  {opcao.valor}x
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {opcao.titulo}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-400">
                    {opcao.divisao}
                  </p>
                </div>
              </div>

              {/* Descrição detalhada */}
              <p className="text-xs text-slate-400 leading-relaxed">
                {opcao.descricao}
              </p>

              {/* Indicador de Seleção */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono text-[11px]">
                  Cromossomo: {opcao.valor} arrays diários
                </span>
                <span
                  className={`font-semibold transition-colors flex items-center gap-1 ${
                    selecionado ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                >
                  {selecionado ? 'Selecionado ✓' : 'Tocar para escolher'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Botão de Ação / Avançar */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={aoAvancar}
          disabled={!valorSelecionado}
          className={`flex items-center gap-3 px-8 py-4 rounded-xl text-base font-bold transition-all duration-300 ${
            valorSelecionado
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
          }`}
        >
          <span>Continuar para Ponto Fraco</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
