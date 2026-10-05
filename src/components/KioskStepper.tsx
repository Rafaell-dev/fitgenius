'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface KioskStepperProps {
  passoAtual: number;
  aoClicarPasso?: (passo: number) => void;
}

export const KioskStepper: React.FC<KioskStepperProps> = ({ passoAtual, aoClicarPasso }) => {
  const passos = [
    { id: 1, titulo: 'Frequência' },
    { id: 2, titulo: 'Ponto fraco' },
    { id: 3, titulo: 'Gênero' },
    { id: 4, titulo: 'Resultado' },
  ];

  return (
    <nav className="w-full py-5 mb-4 no-print" aria-label="Progresso">
      <ol className="max-w-2xl mx-auto px-4 flex items-center">
        {passos.map((p, idx) => {
          const concluido = passoAtual > p.id;
          const ativo = passoAtual === p.id;
          const podeNavegar = aoClicarPasso && p.id < passoAtual;

          return (
            <li key={p.id} className={`flex items-center ${idx < passos.length - 1 ? 'flex-1' : ''}`}>
              <button
                type="button"
                onClick={() => podeNavegar && aoClicarPasso(p.id)}
                disabled={!podeNavegar}
                className={`flex items-center gap-2 ${podeNavegar ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border transition-colors ${
                    concluido
                      ? 'bg-emerald-700 border-emerald-700 text-white'
                      : ativo
                      ? 'bg-white border-emerald-700 text-emerald-700'
                      : 'bg-white border-stone-300 text-stone-400'
                  }`}
                >
                  {concluido ? <Check className="w-3.5 h-3.5" /> : p.id}
                </span>
                <span
                  className={`text-sm hidden sm:inline ${
                    ativo ? 'font-semibold text-stone-900' : concluido ? 'text-stone-700' : 'text-stone-400'
                  }`}
                >
                  {p.titulo}
                </span>
              </button>

              {idx < passos.length - 1 && (
                <span
                  className={`flex-1 h-px mx-3 ${concluido ? 'bg-emerald-700' : 'bg-stone-300'}`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
