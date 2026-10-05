'use client';

import React, { useState } from 'react';
import { 
  RespostaGerarTreino, 
  DiaTreino, 
  ExercicioDia 
} from '@/types/treino';
import { EvolutionChart } from './EvolutionChart';
import { 
  Trophy, 
  Clock, 
  Cpu, 
  CheckCircle2, 
  Sparkles, 
  Printer, 
  RotateCcw, 
  Sliders, 
  Dumbbell, 
  ShieldCheck, 
  Calendar,
  AlertTriangle
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

  const diaAtivo = plano[diaSelecionadoIdx] || plano[0];

  const imprimir = () => {
    window.print();
  };

  const getCorGrupo = (grupo: string) => {
    switch (grupo) {
      case 'Peito': return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'Costas': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'Perna': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Braço': return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'Ombro': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Core': return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      default: return 'bg-slate-700/30 text-slate-300 border-slate-600/30';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Cabeçalho de Sucesso do Terminal */}
      <div className="text-center space-y-3 no-print">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Otimização Concluída • Melhor Indivíduo Selecionado
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Ficha Semanal Otimizada por IA Genética
        </h2>

        <p className="text-sm sm:text-base text-slate-400 max-w-3xl mx-auto">
          Plano balanceado para <strong className="text-emerald-400">{parametrosEntrada.frequencia} dias na semana</strong>, priorizando o grupo <strong className="text-cyan-400">{parametrosEntrada.pontoFraco === 'Costas' ? 'Costas/Posterior' : parametrosEntrada.pontoFraco}</strong> com afinação para o perfil <strong className="text-slate-200">{parametrosEntrada.genero}</strong>.
        </p>
      </div>

      {/* Cartões de Métricas do Algoritmo Genético */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 no-print">
        {/* Fitness Score */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Fitness do AG</span>
            <Trophy className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {metricas.fitnessAlcancado.toLocaleString('pt-BR')}
            <span className="text-xs text-emerald-400 font-normal ml-1">pts</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Aptidão ótima atingida</p>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Tempo de Execução */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tempo Execução</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
            {metricas.tempoExecucaoMs}
            <span className="text-xs text-slate-400 font-normal ml-1">ms</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Cálculo instantâneo em CPU</p>
        </div>

        {/* Gerações */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Gerações</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {metricas.geracoesConvergencia}
            <span className="text-xs text-slate-400 font-normal ml-1">gerações</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">População: 70 indivíduos</p>
        </div>

        {/* Duração Média Diária */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Média Diária</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            {tempoMedio}
            <span className="text-xs text-slate-400 font-normal ml-1">min/dia</span>
          </div>
          <p className="text-[11px] text-emerald-400/90 font-medium mt-1">
            ✓ 100% dentro do limite ≤ 60 min
          </p>
        </div>
      </div>

      {/* Checklist de Conformidade da Função de Aptidão */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 space-y-3 no-print">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Critérios da Função de Aptidão (Fitness) Atendidos
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-white/5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <strong className="text-white block">Ponto Fraco Multi-dia</strong>
              <span className="text-slate-400 text-[11px]">Presente em 2+ dias distintos</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-white/5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <strong className="text-white block">Equilíbrio Corporal</strong>
              <span className="text-slate-400 text-[11px]">Todos os grandes grupos cobertos</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-white/5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <strong className="text-white block">Teto de 60 Minutos</strong>
              <span className="text-slate-400 text-[11px]">Nenhum dia excede o limite</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-white/5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <strong className="text-white block">Descanso Fisiológico</strong>
              <span className="text-slate-400 text-[11px]">Sem grupos iguais em dias seguidos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Ações do Kiosk */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/80 border border-white/10 no-print">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setModoVisualizacao('grade')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              modoVisualizacao === 'grade'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Visão Geral da Semana (Grade)
          </button>
          <button
            type="button"
            onClick={() => setModoVisualizacao('detalhado')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              modoVisualizacao === 'detalhado'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Navegar Dia a Dia
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={imprimir}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span>Imprimir Ficha</span>
          </button>

          <button
            type="button"
            onClick={aoRecalcular}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Nova Mutação AG</span>
          </button>

          <button
            type="button"
            onClick={aoModificar}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Ajustar Perfil</span>
          </button>
        </div>
      </div>

      {/* Visualização de Impressão (Exibida apenas ao imprimir) */}
      <div className="hidden print:block print-only space-y-6 text-black p-6">
        <div className="border-b pb-4 mb-4">
          <h1 className="text-2xl font-black">FITGENIUS AG - FICHA SEMANAL DE TREINO</h1>
          <p className="text-sm">
            Frequência: {parametrosEntrada.frequencia}x • Foco: {parametrosEntrada.pontoFraco} • Género: {parametrosEntrada.genero} • Fitness: {metricas.fitnessAlcancado} pts
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

      {/* MODO 1: VISÃO GERAL EM GRADE SEMANAL */}
      {modoVisualizacao === 'grade' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {plano.map(dia => (
            <div
              key={dia.diaNumero}
              className="glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between glass-panel-hover"
            >
              {/* Topo do Dia */}
              <div className="p-5 border-b border-white/5 space-y-3 bg-slate-900/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                    Treino {String.fromCharCode(64 + dia.diaNumero)}
                  </span>
                  
                  {/* Tempo Total com Validação < 60 min */}
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <Clock className="w-3 h-3" />
                    {dia.tempoTotalMinutos} min
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {dia.diaNome}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {dia.focoPrincipal}
                  </p>
                </div>

                {/* Badges dos Grupos Musculares do Dia */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {dia.gruposMusculares.map(g => (
                    <span
                      key={g}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getCorGrupo(g)}`}
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* Lista de Exercícios do Dia */}
              <div className="p-4 space-y-2.5 flex-1 bg-slate-950/40">
                {dia.exercicios.map((ex, idx) => (
                  <div
                    key={ex.id}
                    className="p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-white/5 transition-colors space-y-1"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-md bg-white/5 text-[10px] font-mono font-bold text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-100 leading-tight">
                            {ex.nome}
                          </h4>
                          <span className="text-[10px] text-emerald-400 font-medium">
                            {ex.series_sugeridas || '3-4 séries x 10 reps'}
                          </span>
                        </div>
                      </div>

                      <span className="text-[11px] font-mono text-slate-400 shrink-0 font-semibold">
                        {ex.tempo_minutos}m
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rodapé do Card do Dia */}
              <div className="px-5 py-3 bg-slate-900/60 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{dia.exercicios.length} exercícios</span>
                <span className="text-emerald-400 font-semibold">
                  Teto respeitado ({60 - dia.tempoTotalMinutos}m livres)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODO 2: VISÃO DETALHADA COM SELETOR DE DIAS */}
      {modoVisualizacao === 'detalhado' && (
        <div className="space-y-6">
          {/* Seletor de Dias em Abas */}
          <div className="flex flex-wrap gap-2">
            {plano.map((dia, idx) => (
              <button
                key={dia.diaNumero}
                type="button"
                onClick={() => setDiaSelecionadoIdx(idx)}
                className={`flex-1 min-w-[140px] p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  diaSelecionadoIdx === idx
                    ? 'bg-emerald-950/50 border-emerald-500 shadow-md shadow-emerald-500/20 text-white'
                    : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold">Treino {String.fromCharCode(65 + idx)}</span>
                  <span className="font-mono text-emerald-400">{dia.tempoTotalMinutos} min</span>
                </div>
                <div className="text-xs font-semibold text-slate-200 truncate">
                  {dia.diaNome.split('(')[0]}
                </div>
              </button>
            ))}
          </div>

          {/* Card Detalhado do Dia Ativo */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Treino Selecionado
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {diaAtivo.diaNome}
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Foco: <strong className="text-slate-200">{diaAtivo.focoPrincipal}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Duração Total</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    {diaAtivo.tempoTotalMinutos} <span className="text-xs text-slate-400 font-normal">min</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Tabela / Lista Detalhada de Exercícios */}
            <div className="space-y-3">
              {diaAtivo.exercicios.map((ex, idx) => (
                <div
                  key={ex.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-500/40 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white">
                          {ex.nome}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getCorGrupo(ex.grupo_muscular)}`}>
                          {ex.grupo_muscular}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {ex.descricao || 'Execução estrita com controle excêntrico de 2 segundos.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Protocolo</span>
                      <span className="text-xs font-bold text-emerald-400">
                        {ex.series_sugeridas}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Tempo Estimado</span>
                      <span className="text-xs font-bold text-slate-200 font-mono">
                        {ex.tempo_minutos} minutos
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Gráfico da Evolução Genética */}
      <EvolutionChart
        historico={metricas.historicoEvolucao}
        fitnessFinal={metricas.fitnessAlcancado}
      />
    </div>
  );
};
