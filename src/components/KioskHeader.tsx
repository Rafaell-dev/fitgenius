'use client';

import React, { useState, useEffect } from 'react';
import { Dumbbell, Clock } from 'lucide-react';

export const KioskHeader: React.FC = () => {
  const [horaAtual, setHoraAtual] = useState<string>('');

  useEffect(() => {
    const atualizar = () => {
      const agora = new Date();
      setHoraAtual(
        agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      );
    };
    const primeiro = setTimeout(atualizar, 0);
    const interval = setInterval(atualizar, 1000);
    return () => {
      clearTimeout(primeiro);
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="w-full border-b border-stone-200 bg-white sticky top-0 z-50 px-4 sm:px-8 py-3 no-print">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-emerald-700 flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-stone-900">
              FitGenius
            </span>
            <p className="text-xs text-stone-500 hidden sm:block -mt-0.5">
              Planejador de treinos com Algoritmo Genético
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-stone-500">
          <Clock className="w-4 h-4" />
          <span className="num font-medium text-stone-700">{horaAtual || '--:--'}</span>
        </div>
      </div>
    </header>
  );
};
