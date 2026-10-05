'use client';

import React from 'react';
import { Calendar, Target, User, Dna, Check } from 'lucide-react';

interface KioskStepperProps {
  passoAtual: number;
  aoClicarPasso?: (passo: number) => void;
}

export const KioskStepper: React.FC<KioskStepperProps> = ({ passoAtual, aoClicarPasso }) => {
  const passos = [
    { id: 1, titulo: 'Frequência', descricao: 'Dias semanais', icone: Calendar },
    { id: 2, titulo: 'Ponto Fraco', descricao: 'Foco muscular', icone: Target },
    { id: 3, titulo: 'Género', descricao: 'Afinamento do catálogo', icone: User },
    { id: 4, titulo: 'Evolução AG', descricao: 'Gerações & Ficha', icone: Dna },
  ];

  return (
    <div className="w-full py-4 mb-6 no-print">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
          {passos.map((p, idx) => {
            const Icone = p.icone;
            const concluido = passoAtual > p.id;
            const ativo = passoAtual === p.id;
            const podeNavegar = aoClicarPasso && p.id < passoAtual;

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => podeNavegar && aoClicarPasso(p.id)}
                disabled={!podeNavegar && !ativo}
                className={`flex flex-col items-center text-center p-2.5 sm:p-3 rounded-xl transition-all duration-300 relative border ${
                  ativo
                    ? 'bg-emerald-950/40 border-emerald-500/80 shadow-lg shadow-emerald-500/10 text-white'
                    : concluido
                    ? 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-emerald-500/50 cursor-pointer'
                    : 'bg-slate-950/40 border-white/5 text-slate-500 cursor-not-allowed'
                }`}
              >
                {/* Linha de progresso no topo */}
                <div
                  className={`h-1 w-full rounded-full mb-2 sm:mb-3 transition-colors ${
                    concluido
                      ? 'bg-emerald-500'
                      : ativo
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                      : 'bg-white/10'
                  }`}
                />

                <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                      concluido
                        ? 'bg-emerald-500 text-slate-950'
                        : ativo
                        ? 'bg-gradient-to-br from-emerald-400 to-cyan-400 text-slate-950 shadow-md shadow-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {concluido ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Icone className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-xs font-semibold hidden md:inline">
                    Passo {p.id}
                  </span>
                </div>

                <span className={`text-xs sm:text-sm font-bold tracking-tight ${
                  ativo ? 'text-emerald-300' : concluido ? 'text-slate-200' : 'text-slate-500'
                }`}>
                  {p.titulo}
                </span>

                <span className="text-[10px] text-slate-400 hidden sm:block mt-0.5 truncate max-w-full">
                  {p.descricao}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
