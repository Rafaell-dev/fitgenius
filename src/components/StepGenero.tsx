'use client';

import React from 'react';
import { ArrowLeft, Play } from 'lucide-react';
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
    descricao: string;
  }[] = [
    {
      valor: 'Masculino',
      titulo: 'Masculino',
      descricao: 'O sorteio de exercícios dá mais peso a compostos de força e volume de membros superiores (supino com barra, levantamento terra, desenvolvimento militar).'
    },
    {
      valor: 'Feminino',
      titulo: 'Feminino',
      descricao: 'O sorteio de exercícios dá mais peso a membros inferiores e glúteos (elevação pélvica, stiff, agachamento búlgaro, cadeira abdutora).'
    }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <p className="text-sm text-stone-500">Passo 3 de 3</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          Qual é o seu gênero?
        </h2>
        <p className="text-sm text-stone-500 max-w-xl mx-auto">
          Essa escolha ajusta a probabilidade de cada exercício do catálogo ser sorteado
          pelo algoritmo — nenhum exercício é excluído.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="radiogroup">
        {opcoes.map(opcao => {
          const selecionado = valorSelecionado === opcao.valor;

          return (
            <button
              key={opcao.valor}
              type="button"
              role="radio"
              aria-checked={selecionado}
              onClick={() => aoSelecionar(opcao.valor)}
              className={`text-left p-5 rounded-lg border transition-colors cursor-pointer ${
                selecionado
                  ? 'bg-emerald-50 border-emerald-700 ring-1 ring-emerald-700'
                  : 'bg-white border-stone-200 hover:border-stone-400'
              }`}
            >
              <h3 className="text-base font-semibold text-stone-900 mb-2">{opcao.titulo}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{opcao.descricao}</p>
            </button>
          );
        })}
      </div>

      {dadosFormulario.frequencia && dadosFormulario.pontoFraco && (
        <div className="p-4 rounded-lg bg-white border border-stone-200 text-sm text-stone-600">
          <span className="font-medium text-stone-900">Resumo: </span>
          treino <strong className="text-stone-900">{dadosFormulario.frequencia}x por semana</strong>,
          priorizando <strong className="text-stone-900">{dadosFormulario.pontoFraco}</strong>
          {valorSelecionado && <>, perfil <strong className="text-stone-900">{valorSelecionado.toLowerCase()}</strong></>}.
          Limite de 60 minutos por dia.
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={aoVoltar}
          className="flex items-center gap-2 px-5 py-3 rounded-md text-sm font-medium bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <button
          type="button"
          onClick={aoIniciarAG}
          disabled={!valorSelecionado || carregando}
          className={`flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold transition-colors ${
            valorSelecionado && !carregando
              ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>{carregando ? 'Gerando treino...' : 'Gerar treino'}</span>
        </button>
      </div>
    </div>
  );
};
