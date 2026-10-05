'use client';

import React, { useState } from 'react';
import { RespostaGerarTreino } from '@/types/treino';
import { EvolutionChart } from './EvolutionChart';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Printer,
  RotateCcw,
  Sliders
} from 'lucide-react';

interface ResultadoTreinoProps {
  resultado: RespostaGerarTreino;
  aoRecalcular: () => void;
  aoModificar: () => void;
}

export const ResultadoTreino: React.FC<ResultadoTreinoProps> = ({
  resultado,
  aoRecalcular,
  aoModificar
}) => {
  const { plano, metricas, parametrosEntrada } = resultado;
  const [diaSelecionadoIdx, setDiaSelecionadoIdx] = useState<number>(0);
  const [modoVisualizacao, setModoVisualizacao] = useState<'grade' | 'detalhado'>('grade');

  const tempoMedio = Math.round(
    plano.reduce((acc, d) => acc + d.tempoTotalMinutos, 0) / plano.length
  );
  const todosDiasNoLimite = plano.every(d => d.tempoTotalMinutos <= 60);

  const diaAtivo = plano[diaSelecionadoIdx] || plano[0];
  const criterios = metricas.criteriosAtendidos;

  const imprimir = () => {
    window.print();
  };

  const getCorGrupo = (grupo: string) => {
    switch (grupo) {
      case 'Peito': return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Costas': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Perna': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Braço': return 'bg-violet-50 text-violet-800 border-violet-200';
      case 'Ombro': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Core': return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      default: return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const listaCriterios = [
    {
      ok: criterios.pontoFracoEmMultiplosDias,
      titulo: 'Ponto fraco em 2+ dias',
      detalhe: `${parametrosEntrada.pontoFraco} aparece em dias distintos da semana`
    },
    {
      ok: criterios.todosGrandesGruposTrabalhados,
      titulo: 'Todos os grandes grupos',
      detalhe: 'Peito, costas, perna e braço cobertos na semana'
    },
    {
      ok: criterios.limiteTempoRespeitado,
      titulo: 'Limite de 60 minutos',
      detalhe: 'Nenhum dia excede o teto diário'
    },
    {
      ok: criterios.descansoAdequado,
      titulo: 'Descanso muscular',
      detalhe: 'Sem grupos repetidos em dias consecutivos'
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="text-center space-y-2 no-print">
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          Sua ficha semanal está pronta
        </h2>
        <p className="text-sm text-stone-500 max-w-2xl mx-auto">
          Plano para <strong className="text-stone-900">{parametrosEntrada.frequencia} dias por semana</strong>,
          priorizando <strong className="text-stone-900">{parametrosEntrada.pontoFraco}</strong>,
          perfil {parametrosEntrada.genero.toLowerCase()}.
        </p>
      </div>

      {/* Métricas da execução */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 no-print">
        <div className="p-4 rounded-lg bg-white border border-stone-200">
          <span className="text-xs text-stone-500 block mb-1">Fitness alcançado</span>
          <span className="text-2xl font-bold text-stone-900 num">
            {metricas.fitnessAlcancado.toLocaleString('pt-BR')}
          </span>
          <p className="text-xs text-stone-500 mt-1">pontos de aptidão</p>
        </div>

        <div className="p-4 rounded-lg bg-white border border-stone-200">
          <span className="text-xs text-stone-500 block mb-1">Tempo de execução</span>
          <span className="text-2xl font-bold text-stone-900 num">
            {metricas.tempoExecucaoMs} <span className="text-sm font-normal text-stone-500">ms</span>
          </span>
          <p className="text-xs text-stone-500 mt-1">no servidor</p>
        </div>

        <div className="p-4 rounded-lg bg-white border border-stone-200">
          <span className="text-xs text-stone-500 block mb-1">Gerações</span>
          <span className="text-2xl font-bold text-stone-900 num">
            {metricas.geracoesConvergencia}
          </span>
          <p className="text-xs text-stone-500 mt-1">evoluídas pelo algoritmo</p>
        </div>

        <div className="p-4 rounded-lg bg-white border border-stone-200">
          <span className="text-xs text-stone-500 block mb-1">Duração média</span>
          <span className="text-2xl font-bold text-stone-900 num">
            {tempoMedio} <span className="text-sm font-normal text-stone-500">min/dia</span>
          </span>
          <p className={`text-xs mt-1 ${todosDiasNoLimite ? 'text-emerald-700' : 'text-amber-700'}`}>
            {todosDiasNoLimite ? 'todos os dias dentro do limite' : 'há dia acima de 60 min'}
          </p>
        </div>
      </div>

      {/* Critérios da função de aptidão (valores reais da execução) */}
      <div className="p-4 rounded-lg bg-white border border-stone-200 no-print">
        <h4 className="text-sm font-semibold text-stone-900 mb-3">
          Critérios da função de aptidão
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {listaCriterios.map(c => (
            <div key={c.titulo} className="flex items-start gap-2.5">
              {c.ok ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="text-sm font-medium text-stone-900 block">{c.titulo}</span>
                <span className="text-xs text-stone-500">
                  {c.ok ? c.detalhe : 'Não atendido nesta execução'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Barra de ações */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center rounded-md border border-stone-300 bg-white p-0.5">
          <button
            type="button"
            onClick={() => setModoVisualizacao('grade')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer ${
              modoVisualizacao === 'grade'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Semana completa
          </button>
          <button
            type="button"
            onClick={() => setModoVisualizacao('detalhado')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer ${
              modoVisualizacao === 'detalhado'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Dia a dia
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={imprimir}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir</span>
          </button>

          <button
            type="button"
            onClick={aoRecalcular}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Gerar outra versão</span>
          </button>

          <button
            type="button"
            onClick={aoModificar}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            <span>Ajustar perfil</span>
          </button>
        </div>
      </div>

      {/* Versão para impressão */}
      <div className="hidden print:block print-only space-y-6 text-black p-6">
        <div className="border-b pb-4 mb-4">
          <h1 className="text-2xl font-bold">FitGenius — Ficha Semanal de Treino</h1>
          <p className="text-sm">
            Frequência: {parametrosEntrada.frequencia}x • Foco: {parametrosEntrada.pontoFraco} • Gênero: {parametrosEntrada.genero} • Fitness: {metricas.fitnessAlcancado} pts
          </p>
        </div>
        {plano.map(dia => (
          <div key={dia.diaNumero} className="mb-6 border p-4 rounded">
            <h2 className="text-lg font-bold">
              {dia.diaNome} — {dia.tempoTotalMinutos} min ({dia.gruposMusculares.join(', ')})
            </h2>
            <ul className="mt-2 list-disc list-inside text-sm">
              {dia.exercicios.map(ex => (
                <li key={ex.id}>
                  <strong>{ex.nome}</strong> ({ex.tempo_minutos} min) — {ex.series_sugeridas} ({ex.grupo_muscular})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Modo 1: semana completa em grade */}
      {modoVisualizacao === 'grade' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plano.map(dia => (
            <div
              key={dia.diaNumero}
              className="rounded-lg bg-white border border-stone-200 overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-800">
                    Treino {String.fromCharCode(64 + dia.diaNumero)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-stone-600 num">
                    <Clock className="w-3 h-3" />
                    {dia.tempoTotalMinutos} min
                  </span>
                </div>

                <h3 className="text-base font-semibold text-stone-900">
                  {dia.diaNome.split('(')[0].trim()}
                </h3>

                <div className="flex flex-wrap gap-1.5">
                  {dia.gruposMusculares.map(g => (
                    <span
                      key={g}
                      className={`text-xs font-medium px-2 py-0.5 rounded border ${getCorGrupo(g)}`}
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 space-y-1.5 flex-1">
                {dia.exercicios.map((ex, idx) => (
                  <div
                    key={ex.id}
                    className="flex items-start justify-between gap-2 px-2 py-1.5 rounded hover:bg-stone-50"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-stone-400 num w-4 text-right shrink-0 mt-0.5">
                        {idx + 1}.
                      </span>
                      <div>
                        <span className="text-sm text-stone-900 leading-tight block">{ex.nome}</span>
                        <span className="text-xs text-stone-500">
                          {ex.series_sugeridas || '3-4 séries x 10 reps'}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-stone-500 num shrink-0">{ex.tempo_minutos} min</span>
                  </div>
                ))}
              </div>

              <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
                <span>{dia.exercicios.length} exercícios</span>
                <span className="num">{60 - dia.tempoTotalMinutos} min de folga no teto</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modo 2: dia a dia */}
      {modoVisualizacao === 'detalhado' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {plano.map((dia, idx) => (
              <button
                key={dia.diaNumero}
                type="button"
                onClick={() => setDiaSelecionadoIdx(idx)}
                className={`flex-1 min-w-[130px] p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  diaSelecionadoIdx === idx
                    ? 'bg-emerald-50 border-emerald-700 ring-1 ring-emerald-700'
                    : 'bg-white border-stone-200 hover:border-stone-400'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-0.5">
                  <span className="font-semibold text-stone-900">
                    Treino {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-stone-500 num">{dia.tempoTotalMinutos} min</span>
                </div>
                <span className="text-xs text-stone-600 truncate block">
                  {dia.diaNome.split('(')[0].trim()}
                </span>
              </button>
            ))}
          </div>

          <div className="rounded-lg bg-white border border-stone-200 p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
              <div>
                <h3 className="text-xl font-bold text-stone-900">
                  {diaAtivo.diaNome.split('(')[0].trim()}
                </h3>
                <p className="text-sm text-stone-500 mt-0.5">
                  Foco: {diaAtivo.focoPrincipal}
                </p>
              </div>

              <div className="text-sm text-stone-600">
                Duração total:{' '}
                <span className="text-lg font-bold text-stone-900 num">{diaAtivo.tempoTotalMinutos} min</span>
              </div>
            </div>

            <div className="space-y-2">
              {diaAtivo.exercicios.map((ex, idx) => (
                <div
                  key={ex.id}
                  className="p-3 rounded-lg border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded bg-stone-100 text-stone-600 text-sm font-semibold num flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-semibold text-stone-900">{ex.nome}</h4>
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded border ${getCorGrupo(ex.grupo_muscular)}`}>
                          {ex.grupo_muscular}
                        </span>
                      </div>
                      {ex.descricao && (
                        <p className="text-xs text-stone-500 mt-0.5">{ex.descricao}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-5 text-xs text-stone-500 sm:text-right shrink-0">
                    <span>{ex.series_sugeridas}</span>
                    <span className="num font-medium text-stone-700">{ex.tempo_minutos} min</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Curva de convergência real da execução */}
      <div className="no-print">
        <EvolutionChart
          historico={metricas.historicoEvolucao}
          fitnessFinal={metricas.fitnessAlcancado}
        />
      </div>
    </div>
  );
};
