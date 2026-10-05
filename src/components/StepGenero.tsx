'use client';

import React from 'react';
import { User, ArrowLeft, Dna, Sparkles, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';
import { FormularioTreino } from '@/types/treino';

interface StepGeneroProps {
  valorSelecionado: 'Masculino' | 'Feminino' | null;
  aoSelecionar: (genero: 'Masculino' | 'Feminino') => void;
  aoVoltar: () => void;
  aoIniciarAG: () => void;
  carregando: boolean;
  dadosFormulario: Partial<FormularioTreino>;
}

export const StepGenero: React.FC<StepGeneroProps> = ({
  valorSelecionado,
  aoSelecionar,
  aoVoltar,
  aoIniciarAG,
  carregando,
  dadosFormulario
}) => {
  const opcoes: {
    valor: 'Masculino' | 'Feminino';
    titulo: string;
    subtitulo: string;
    afinamento: string[];
    detalhes: string;
  }[] = [
    {
      valor: 'Masculino',
      titulo: 'Masculino',
      subtitulo: 'Afinamento de Força & Volume Superior',
      afinamento: [
        'Priorização de compostos pesados (Supino com barra, Levantamento Terra, Paralelas, Militar)',
        'Foco de braço balanceado com Rosca Martelo e Tríceps Testa',
        'Pesos ponderados no catálogo para hipertrofia clássica masculina'
      ],
      detalhes: 'O AG aplicará pesos de aptidão favorecendo exercícios estruturantes com foco_genero "masc" e "neutro".'
    },
    {
      valor: 'Feminino',
      titulo: 'Feminino',
      subtitulo: 'Afinamento de Membros Inferiores & Glúteos',
      afinamento: [
        'Priorização de Elevação Pélvica (Hip Thrust), Stiff, Agachamento Búlgaro e Cadeira Abdutora',
        'Ajuste para volume otimizado de membros superiores sem sobrecarga desproporcional',
        'Exercícios de definição e sustentação biomecânica pélvica'
      ],
      detalhes: 'O AG aplicará pesos de aptidão favorecendo exercícios com foco_genero "fem" e "neutro".'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Cabeçalho do Passo */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <User className="w-3.5 h-3.5" />
          Passo 3 de 3 • Afinamento do Catálogo
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Qual o seu género?
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Esta informação afina o peso e probabilidade dos exercícios sorteados pelo Algoritmo Genético, adaptando a rotina à biomecânica e aos objetivos anatômicos.
        </p>
      </div>

      {/* Grid de Opções Masculino / Feminino */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {opcoes.map(opcao => {
          const selecionado = valorSelecionado === opcao.valor;

          return (
            <button
              key={opcao.valor}
              type="button"
              onClick={() => aoSelecionar(opcao.valor)}
              className={`text-left p-6 sm:p-7 rounded-2xl transition-all duration-300 relative border group cursor-pointer ${
                selecionado
                  ? 'bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-950 border-emerald-400 kiosk-active-glow scale-[1.01]'
                  : 'bg-slate-900/60 hover:bg-slate-900/90 border-white/10 hover:border-emerald-500/50 hover:scale-[1.005]'
              }`}
            >
              {/* Topo com Ícone e Título */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                    selecionado
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {opcao.titulo}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Catálogo Customizado</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                {opcao.titulo}
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                {opcao.subtitulo}
              </p>

              {/* Lista de Afinamentos */}
              <div className="space-y-2 mb-4">
                {opcao.afinamento.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Nota de Regra do AG */}
              <div className="pt-3 border-t border-white/5 text-[11px] text-slate-400">
                {opcao.detalhes}
              </div>
            </button>
          );
        })}
      </div>

      {/* Resumo da Configuração Antes de Disparar o AG */}
      {dadosFormulario.frequencia && dadosFormulario.pontoFraco && (
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Parâmetros Prontos para Otimização Genética
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Frequência: <strong className="text-emerald-400">{dadosFormulario.frequencia}x/semana</strong> • Ponto Fraco: <strong className="text-cyan-400">{dadosFormulario.pontoFraco === 'Costas' ? 'Costas/Posterior' : dadosFormulario.pontoFraco}</strong> • Género: <strong className="text-slate-200">{valorSelecionado || 'Pendente'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Teto Diário: 60 minutos</span>
          </div>
        </div>
      )}

      {/* Navegação e Botão de Execução do AG */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={aoVoltar}
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-white/5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar (Ponto Fraco)</span>
        </button>

        <button
          type="button"
          onClick={aoIniciarAG}
          disabled={!valorSelecionado || carregando}
          className={`flex items-center gap-3 px-8 py-4 rounded-xl text-base font-extrabold tracking-wide uppercase transition-all duration-300 ${
            valorSelecionado && !carregando
              ? 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-500 text-slate-950 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.03] cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
          }`}
        >
          <Dna className="w-5 h-5 animate-pulse" />
          <span>{carregando ? 'Otimizando População...' : 'Evoluir Treino com AG'}</span>
        </button>
      </div>
    </div>
  );
};
