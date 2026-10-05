'use client';

import React, { useState } from 'react';
import { KioskHeader } from '@/components/KioskHeader';
import { KioskStepper } from '@/components/KioskStepper';
import { StepFrequencia } from '@/components/StepFrequencia';
import { StepPontoFraco } from '@/components/StepPontoFraco';
import { StepGenero } from '@/components/StepGenero';
import { ProcessingView } from '@/components/ProcessingView';
import { ResultadoTreino } from '@/components/ResultadoTreino';
import { FormularioTreino, RespostaGerarTreino } from '@/types/treino';
import { AlertCircle, RotateCcw, Sparkles } from 'lucide-react';

export default function Home() {
  const [passoAtual, setPassoAtual] = useState<number>(1);
  const [frequencia, setFrequencia] = useState<FormularioTreino['frequencia'] | null>(null);
  const [pontoFraco, setPontoFraco] = useState<FormularioTreino['pontoFraco'] | null>(null);
  const [genero, setGenero] = useState<FormularioTreino['genero'] | null>(null);

  const [carregandoApi, setCarregandoApi] = useState<boolean>(false);
  const [simulacaoConcluida, setSimulacaoConcluida] = useState<boolean>(false);
  const [resultadoTreino, setResultadoTreino] = useState<RespostaGerarTreino | null>(null);
  const [erroApi, setErroApi] = useState<string | null>(null);

  // Executa chamada à API de Algoritmo Genético
  const executarOtimizacaoAG = async () => {
    if (!frequencia || !pontoFraco || !genero) return;

    setErroApi(null);
    setCarregandoApi(true);
    setSimulacaoConcluida(false);
    setPassoAtual(4);

    try {
      const response = await fetch('/api/gerar-treino', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          frequencia,
          pontoFraco,
          genero
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Falha ao processar treino com Algoritmo Genético.');
      }

      const data: RespostaGerarTreino = await response.json();
      setResultadoTreino(data);
    } catch (err) {
      console.error('Erro na requisição:', err);
      setErroApi(err instanceof Error ? err.message : 'Erro ao comunicar com o servidor.');
    } finally {
      setCarregandoApi(false);
    }
  };

  const handleSimulacaoConcluida = () => {
    setSimulacaoConcluida(true);
  };

  const reiniciarFluxo = () => {
    setPassoAtual(1);
    setFrequencia(null);
    setPontoFraco(null);
    setGenero(null);
    setResultadoTreino(null);
    setSimulacaoConcluida(false);
    setErroApi(null);
  };

  const voltarParaEdicao = () => {
    setPassoAtual(1);
    setSimulacaoConcluida(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b12] text-slate-100">
      {/* Barra Superior do Terminal */}
      <KioskHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        {/* Stepper Superior */}
        <KioskStepper
          passoAtual={passoAtual}
          aoClicarPasso={(passo) => {
            if (passo < passoAtual) {
              setPassoAtual(passo);
              if (passo < 4) {
                setSimulacaoConcluida(false);
              }
            }
          }}
        />

        {/* Mensagem de Erro Caso API falhe */}
        {erroApi && (
          <div className="max-w-2xl mx-auto my-6 p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-sm text-white">Falha na Otimização Genética</h4>
              <p className="text-xs text-rose-300 mt-1">{erroApi}</p>
              <button
                type="button"
                onClick={executarOtimizacaoAG}
                className="mt-3 px-4 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-xs font-bold text-white border border-rose-500/40 cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Tentar Novamente
              </button>
            </div>
          </div>
        )}

        {/* CORPO DOS PASSOS */}
        <div className="flex-1 flex flex-col justify-center">
          {/* PASSO 1: FREQUÊNCIA */}
          {passoAtual === 1 && (
            <StepFrequencia
              valorSelecionado={frequencia}
              aoSelecionar={(freq) => setFrequencia(freq)}
              aoAvancar={() => setPassoAtual(2)}
            />
          )}

          {/* PASSO 2: PONTO FRACO */}
          {passoAtual === 2 && (
            <StepPontoFraco
              valorSelecionado={pontoFraco}
              aoSelecionar={(pf) => setPontoFraco(pf)}
              aoVoltar={() => setPassoAtual(1)}
              aoAvancar={() => setPassoAtual(3)}
            />
          )}

          {/* PASSO 3: GÉNERO */}
          {passoAtual === 3 && (
            <StepGenero
              valorSelecionado={genero}
              aoSelecionar={(gen) => setGenero(gen)}
              aoVoltar={() => setPassoAtual(2)}
              aoIniciarAG={executarOtimizacaoAG}
              carregando={carregandoApi}
              dadosFormulario={{ frequencia: frequencia || undefined, pontoFraco: pontoFraco || undefined }}
            />
          )}

          {/* PASSO 4: PROCESSAMENTO & EXIBIÇÃO DA ROTINA */}
          {passoAtual === 4 && (
            <div className="w-full">
              {!simulacaoConcluida ? (
                <ProcessingView
                  aoConcluir={handleSimulacaoConcluida}
                  geracaoAlvo={resultadoTreino?.metricas.geracoesConvergencia || 80}
                  fitnessEstimado={resultadoTreino?.metricas.fitnessAlcancado || 3300}
                />
              ) : resultadoTreino ? (
                <ResultadoTreino
                  resultado={resultadoTreino}
                  aoRecalcular={executarOtimizacaoAG}
                  aoModificar={voltarParaEdicao}
                />
              ) : (
                <div className="text-center py-16 space-y-4">
                  <div className="w-12 h-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto" />
                  <p className="text-slate-400 text-sm">Carregando dados da rotina gerada...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Rodapé Kiosk */}
      <footer className="w-full py-4 border-t border-white/5 bg-[#080c14] text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>FITGENIUS AG • Sistema Especialista de Musculação baseado em Algoritmo Genético</span>
          <span className="font-mono text-[11px] text-slate-400">
            Tempo Máximo: 60 min/dia • Descanso Biológico 48h
          </span>
        </div>
      </footer>
    </div>
  );
}
