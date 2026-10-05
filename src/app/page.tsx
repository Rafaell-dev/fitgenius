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
import { AlertCircle, RotateCcw } from 'lucide-react';

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
    setResultadoTreino(null);
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

  const voltarParaEdicao = () => {
    setPassoAtual(1);
    setSimulacaoConcluida(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <KioskHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
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

        {/* Mensagem de erro caso a API falhe */}
        {erroApi && (
          <div className="max-w-xl mx-auto my-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-red-900">Falha ao gerar o treino</h4>
              <p className="text-sm text-red-700 mt-1">{erroApi}</p>
              <button
                type="button"
                onClick={executarOtimizacaoAG}
                className="mt-3 px-3 py-1.5 rounded-md bg-white hover:bg-red-100 text-sm font-medium text-red-800 border border-red-300 cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-center">
          {passoAtual === 1 && (
            <StepFrequencia
              valorSelecionado={frequencia}
              aoSelecionar={(freq) => setFrequencia(freq)}
              aoAvancar={() => setPassoAtual(2)}
            />
          )}

          {passoAtual === 2 && (
            <StepPontoFraco
              valorSelecionado={pontoFraco}
              aoSelecionar={(pf) => setPontoFraco(pf)}
              aoVoltar={() => setPassoAtual(1)}
              aoAvancar={() => setPassoAtual(3)}
            />
          )}

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

          {passoAtual === 4 && (
            <div className="w-full">
              {carregandoApi && (
                <div className="text-center py-16 space-y-4">
                  <div className="w-10 h-10 rounded-full border-2 border-emerald-700 border-t-transparent animate-spin mx-auto" />
                  <p className="text-stone-500 text-sm">Executando o Algoritmo Genético no servidor...</p>
                </div>
              )}

              {!carregandoApi && resultadoTreino && !simulacaoConcluida && (
                <ProcessingView
                  aoConcluir={handleSimulacaoConcluida}
                  historico={resultadoTreino.metricas.historicoEvolucao}
                />
              )}

              {!carregandoApi && resultadoTreino && simulacaoConcluida && (
                <ResultadoTreino
                  resultado={resultadoTreino}
                  aoRecalcular={executarOtimizacaoAG}
                  aoModificar={voltarParaEdicao}
                />
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="w-full py-4 border-t border-stone-200 bg-white text-center text-xs text-stone-500 no-print">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>FitGenius — Prescrição de treinos com Algoritmo Genético</span>
          <span>Limite de 60 min/dia • Descanso muscular de 48h</span>
        </div>
      </footer>
    </div>
  );
}
