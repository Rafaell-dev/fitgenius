'use client';

import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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
    exemplos: string[];
  }[] = [
    {
      chave: 'Peito',
      titulo: 'Peito',
      subtitulo: 'Peitoral maior, porção superior e esternal',
      exemplos: ['Supino reto', 'Supino inclinado', 'Crossover', 'Peck deck']
    },
    {
      chave: 'Braço',
      titulo: 'Braço',
      subtitulo: 'Bíceps, tríceps e antebraço',
      exemplos: ['Rosca direta', 'Tríceps corda', 'Paralelas', 'Rosca martelo']
    },
    {
      chave: 'Perna',
      titulo: 'Perna',
      subtitulo: 'Quadríceps, isquiotibiais e glúteos',
      exemplos: ['Agachamento', 'Leg press', 'Mesa flexora', 'Elevação pélvica']
    },
    {
      chave: 'Costas',
      titulo: 'Costas',
      subtitulo: 'Dorsal, trapézio, romboides e deltoide posterior',
      exemplos: ['Puxada alta', 'Remada curvada', 'Barra fixa', 'Levantamento terra']
    }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <p className="text-sm text-stone-500">Passo 2 de 3</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          Qual grupo muscular você quer priorizar?
        </h2>
        <p className="text-sm text-stone-500 max-w-xl mx-auto">
          O grupo escolhido entra na função de aptidão do algoritmo, que bonifica planos
          com esse grupo presente em pelo menos 2 dias da semana.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="radiogroup">
        {grupos.map(opcao => {
          const selecionado = valorSelecionado === opcao.chave;

          return (
            <button
              key={opcao.chave}
              type="button"
              role="radio"
              aria-checked={selecionado}
              onClick={() => aoSelecionar(opcao.chave)}
              className={`text-left p-5 rounded-lg border transition-colors cursor-pointer ${
                selecionado
                  ? 'bg-emerald-50 border-emerald-700 ring-1 ring-emerald-700'
                  : 'bg-white border-stone-200 hover:border-stone-400'
              }`}
            >
              <h3 className="text-base font-semibold text-stone-900">{opcao.titulo}</h3>
              <p className="text-xs text-stone-500 mt-0.5 mb-3">{opcao.subtitulo}</p>

              <div className="flex flex-wrap gap-1.5">
                {opcao.exemplos.map((ex, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-2 py-0.5 rounded border ${
                      selecionado
                        ? 'bg-white text-emerald-900 border-emerald-200'
                        : 'bg-stone-50 text-stone-600 border-stone-200'
                    }`}
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

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
          onClick={aoAvancar}
          disabled={!valorSelecionado}
          className={`flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold transition-colors ${
            valorSelecionado
              ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          <span>Continuar</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
