'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

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
    divisao: string;
    descricao: string;
  }[] = [
    {
      valor: 2,
      titulo: '2 dias por semana',
      divisao: 'Terça e quinta',
      descricao: 'Para rotinas corridas. Treinos completos com 48h de descanso garantido entre as sessões.'
    },
    {
      valor: 3,
      titulo: '3 dias por semana',
      divisao: 'Segunda, quarta e sexta',
      descricao: 'Divisão A/B/C clássica, com boa recuperação muscular entre os treinos.'
    },
    {
      valor: 4,
      titulo: '4 dias por semana',
      divisao: 'Segunda, terça, quinta e sexta',
      descricao: 'Mais volume semanal, com descanso na quarta-feira e no fim de semana.'
    },
    {
      valor: 5,
      titulo: '5 dias por semana',
      divisao: 'Segunda a sexta',
      descricao: 'Volume alto e fracionado. O algoritmo evita repetir o mesmo grupo em dias seguidos.'
    }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <p className="text-sm text-stone-500">Passo 1 de 3</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          Quantos dias por semana você pode treinar?
        </h2>
        <p className="text-sm text-stone-500 max-w-xl mx-auto">
          Cada treino gerado respeita o limite de 60 minutos por dia.
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
              <div className="flex items-center gap-4 mb-2">
                <div
                  className={`w-11 h-11 rounded-md flex items-center justify-center text-lg font-bold num ${
                    selecionado ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {opcao.valor}x
                </div>
                <div>
                  <h3 className="text-base font-semibold text-stone-900">{opcao.titulo}</h3>
                  <p className={`text-xs font-medium ${selecionado ? 'text-emerald-800' : 'text-stone-500'}`}>
                    {opcao.divisao}
                  </p>
                </div>
              </div>

              <p className="text-sm text-stone-600 leading-relaxed">
                {opcao.descricao}
              </p>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end pt-2">
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
