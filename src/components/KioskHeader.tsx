'use client';

import React, { useState, useEffect } from 'react';
import { Dumbbell, Activity, ShieldCheck, Clock } from 'lucide-react';

export const KioskHeader: React.FC = () => {
  const [horaAtual, setHoraAtual] = useState<string>('');
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
    const atualizar = () => {
      const agora = new Date();
      setHoraAtual(
        agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    atualizar();
    const interval = setInterval(atualizar, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full border-b border-white/10 bg-[#090d16]/90 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-8 py-3.5 no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo & Marca */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-black font-black">
            <Dumbbell className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                FIT<span className="text-emerald-400">GENIUS</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                AG v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Terminal de Autoatendimento Inteligente • Prescrição Otimizada
            </p>
          </div>
        </div>

        {/* Status do Terminal */}
        <div className="flex items-center gap-4 text-xs">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-400">Motor AG Pronto</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">População: 70 • 80 Gerações</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 font-mono">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-slate-200">{montado ? horaAtual : '--:--:--'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
