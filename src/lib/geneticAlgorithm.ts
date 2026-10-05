import exerciciosCatalogo from '@/data/exercicios.json';
import { 
  Exercicio, 
  FormularioTreino, 
  DiaTreino, 
  MetricasOtimizacao, 
  HistoricoGeracao, 
  GrupoMuscular,
  ExercicioDia
} from '@/types/treino';

// Mapa rápido por ID
export const catalogoExercicios: Exercicio[] = exerciciosCatalogo as Exercicio[];
export const mapaExercicios = new Map<string, Exercicio>(
  catalogoExercicios.map(ex => [ex.id, ex])
);

// Cromossomo: Matriz onde cada linha é um dia de treino contendo IDs de exercícios
export type Cromossomo = string[][];

export interface Individuo {
  dias: Cromossomo;
  fitness: number;
  metricasDetalhadas?: {
    diasPontoFraco: number;
    coberturaGrupos: GrupoMuscular[];
    tempoPorDia: number[];
    conflitosConsecutivos: number;
    violacaoTempo: boolean;
  };
}

export interface ConfigAG {
  tamanhoPopulacao: number;
  geracoes: number;
  taxaCrossover: number;
  taxaMutacao: number;
  tamanhoTorneio: number;
  elitismo: number;
}

const CONFIG_PADRAO: ConfigAG = {
  tamanhoPopulacao: 70,
  geracoes: 80,
  taxaCrossover: 0.85,
  taxaMutacao: 0.25,
  tamanhoTorneio: 4,
  elitismo: 2,
};

const GRANDES_GRUPOS: GrupoMuscular[] = ['Peito', 'Costas', 'Perna', 'Braço'];

/**
 * Pondera exercícios de acordo com o género do usuário
 */
function obterPoolExerciciosPonderado(genero: 'Masculino' | 'Feminino'): Exercicio[] {
  const pool: Exercicio[] = [];
  for (const ex of catalogoExercicios) {
    let peso = 1;
    if (genero === 'Feminino') {
      if (ex.foco_genero === 'fem') peso = 3;
      else if (ex.foco_genero === 'neutro') peso = 2;
      else if (ex.foco_genero === 'masc') peso = 1;
    } else {
      if (ex.foco_genero === 'masc') peso = 3;
      else if (ex.foco_genero === 'neutro') peso = 2;
      else if (ex.foco_genero === 'fem') peso = 1;
    }
    for (let i = 0; i < peso; i++) {
      pool.push(ex);
    }
  }
  return pool;
}

/**
 * Seleciona um exercício aleatório do pool evitando duplicatas dentro do mesmo dia
 */
function sortearExercicioAleatorio(pool: Exercicio[], excluidos: Set<string>): Exercicio {
  const candidatos = pool.filter(e => !excluidos.has(e.id));
  if (candidatos.length > 0) {
    const idx = Math.floor(Math.random() * candidatos.length);
    return candidatos[idx];
  }
  // Fallback caso todos estejam no pool
  const idx = Math.floor(Math.random() * catalogoExercicios.length);
  return catalogoExercicios[idx];
}

/**
 * Gera um dia de treino inicial com 4 a 6 exercícios somando ~40 a 55 min
 */
function gerarDiaTreinoInicial(pool: Exercicio[], focoPreferencial?: GrupoMuscular): string[] {
  const exerciciosDia: string[] = [];
  const idsUsados = new Set<string>();
  let tempoAtual = 0;
  
  // Se houver um foco preferencial para este dia, tenta começar com 1 ou 2 exercícios desse grupo
  if (focoPreferencial) {
    const doGrupo = pool.filter(e => e.grupo_muscular === focoPreferencial && !idsUsados.has(e.id));
    if (doGrupo.length > 0) {
      const primeiro = doGrupo[Math.floor(Math.random() * doGrupo.length)];
      exerciciosDia.push(primeiro.id);
      idsUsados.add(primeiro.id);
      tempoAtual += primeiro.tempo_minutos;
    }
  }

  // Completa até alcançar 4 a 6 exercícios e ~45-55 minutos sem estourar 60
  const maxExercicios = 5 + Math.floor(Math.random() * 2); // 5 ou 6
  while (exerciciosDia.length < maxExercicios && tempoAtual < 52) {
    const ex = sortearExercicioAleatorio(pool, idsUsados);
    if (tempoAtual + ex.tempo_minutos > 58 && exerciciosDia.length >= 4) {
      break;
    }
    exerciciosDia.push(ex.id);
    idsUsados.add(ex.id);
    tempoAtual += ex.tempo_minutos;
  }

  return exerciciosDia;
}

/**
 * Avalia a aptidão (Fitness) de um plano semanal completo
 */
export function calcularFitness(
  dias: Cromossomo,
  params: FormularioTreino
): { fitness: number; metricas: NonNullable<Individuo['metricasDetalhadas']> } {
  let score = 1000;
  const pontoFracoGrupo = params.pontoFraco;
  
  const diasComPontoFraco = new Set<number>();
  const todosGruposSemana = new Set<GrupoMuscular>();
  const temposPorDia: number[] = [];
  const gruposPorDia: GrupoMuscular[][] = [];
  let violacaoTempo = false;
  let conflitosConsecutivos = 0;

  for (let diaIdx = 0; diaIdx < dias.length; diaIdx++) {
    const ids = dias[diaIdx];
    let tempoDia = 0;
    const gruposDia = new Set<GrupoMuscular>();
    const idsVistosNoDia = new Set<string>();

    for (const id of ids) {
      // Penalidade severa para duplicação do mesmo exercício no mesmo dia
      if (idsVistosNoDia.has(id)) {
        score -= 500;
      }
      idsVistosNoDia.add(id);

      const ex = mapaExercicios.get(id);
      if (ex) {
        tempoDia += ex.tempo_minutos;
        gruposDia.add(ex.grupo_muscular);
        todosGruposSemana.add(ex.grupo_muscular);

        if (ex.grupo_muscular === pontoFracoGrupo) {
          diasComPontoFraco.add(diaIdx);
        }

        // Bónus de alinhamento com género
        if (params.genero === 'Feminino' && ex.foco_genero === 'fem') score += 15;
        if (params.genero === 'Masculino' && ex.foco_genero === 'masc') score += 15;
      }
    }

    temposPorDia.push(tempoDia);
    gruposPorDia.push(Array.from(gruposDia));

    // REQUISITO: Penalização Severa (-) O somatório ultrapassar 60 minutos
    if (tempoDia > 60) {
      violacaoTempo = true;
      const minutosExcedentes = tempoDia - 60;
      score -= (800 + minutosExcedentes * 60);
    } else {
      // Recompensa para faixa ideal de treino (40 a 56 min)
      if (tempoDia >= 40 && tempoDia <= 56) {
        score += 180;
      } else if (tempoDia < 30) {
        score -= 250; // Treino excessivamente curto
      }
    }
  }

  // REQUISITO: Bónus (+) Incluir exercícios do "Ponto Fraco" em pelo menos 2 dias diferentes
  if (diasComPontoFraco.size >= 2) {
    score += 550;
    if (diasComPontoFraco.size === 2) score += 100; // Ponto ideal de frequência semanal
  } else {
    // Penalidade se não atingiu 2 dias de ponto fraco
    score -= 400;
  }

  // REQUISITO: Bónus (+) Trabalhar todos os grandes grupos musculares durante a semana
  const gruposPresentes = GRANDES_GRUPOS.filter(g => todosGruposSemana.has(g));
  if (gruposPresentes.length === GRANDES_GRUPOS.length) {
    score += 500;
    // Bónus extra se incluir Ombro
    if (todosGruposSemana.has('Ombro')) {
      score += 150;
    }
  } else {
    const faltantes = GRANDES_GRUPOS.length - gruposPresentes.length;
    score -= (faltantes * 250);
  }

  // REQUISITO: Penalização Severa (-) Treinar o mesmo grupo muscular em dias consecutivos
  // Verifica conflitos em dias que são consecutivos no calendário real:
  // - 2x (Terça, Quinta): 48h de descanso entre treinos
  // - 3x (Segunda, Quarta, Sexta): 48h de descanso entre treinos
  // - 4x (Segunda, Terça, Quinta, Sexta): [0 e 1] são consecutivos; [2 e 3] são consecutivos; [1 e 2] têm descanso na Quarta
  // - 5x (Segunda a Sexta): [0 e 1], [1 e 2], [2 e 3], [3 e 4] são consecutivos
  const paresConsecutivos: Record<number, [number, number][]> = {
    2: [], // Terça e Quinta têm descanso de 48h
    3: [], // Seg, Qua e Sex têm descanso de 48h
    4: [[0, 1], [2, 3]], // Seg-Ter e Qui-Sex são dias seguidos
    5: [[0, 1], [1, 2], [2, 3], [3, 4]] // Seg-Ter, Ter-Qua, Qua-Qui, Qui-Sex
  };

  const paresParaVerificar = paresConsecutivos[params.frequencia] || [];

  for (const [diaAIdx, diaBIdx] of paresParaVerificar) {
    const gruposDiaA = gruposPorDia[diaAIdx];
    const gruposDiaB = gruposPorDia[diaBIdx];

    for (const g of GRANDES_GRUPOS) {
      if (gruposDiaA.includes(g) && gruposDiaB.includes(g)) {
        conflitosConsecutivos++;
        score -= 500; // Penalização pesada por falta de descanso muscular
      }
    }
  }

  return {
    fitness: Math.max(0, score),
    metricas: {
      diasPontoFraco: diasComPontoFraco.size,
      coberturaGrupos: Array.from(todosGruposSemana),
      tempoPorDia: temposPorDia,
      conflitosConsecutivos,
      violacaoTempo
    }
  };
}

/**
 * Operador de Crossover: Troca dias de treino inteiros entre dois planos pais
 */
function crossover(pai1: Cromossomo, pai2: Cromossomo): [Cromossomo, Cromossomo] {
  const frequencia = pai1.length;
  const filho1: Cromossomo = [];
  const filho2: Cromossomo = [];

  // Ponto de corte ou recombinação por dia
  // 50% de chance de usar corte de 1 ponto ou troca uniforme por dia
  if (Math.random() < 0.5 && frequencia > 2) {
    const pontoCorte = 1 + Math.floor(Math.random() * (frequencia - 1));
    for (let i = 0; i < frequencia; i++) {
      if (i < pontoCorte) {
        filho1.push([...pai1[i]]);
        filho2.push([...pai2[i]]);
      } else {
        filho1.push([...pai2[i]]);
        filho2.push([...pai1[i]]);
      }
    }
  } else {
    for (let i = 0; i < frequencia; i++) {
      if (Math.random() < 0.5) {
        filho1.push([...pai1[i]]);
        filho2.push([...pai2[i]]);
      } else {
        filho1.push([...pai2[i]]);
        filho2.push([...pai1[i]]);
      }
    }
  }

  return [filho1, filho2];
}

/**
 * Operador de Mutação:
 * 1. Substitui aleatoriamente um exercício de um dia por outro do catálogo
 * 2. Se um dia estourar 60 min, remove ou substitui o exercício mais longo
 * 3. Se faltar ponto fraco em 2 dias, introduz exercício do ponto fraco
 */
function mutar(
  cromossomo: Cromossomo, 
  pool: Exercicio[], 
  params: FormularioTreino, 
  taxaMutacao: number
): Cromossomo {
  const mutado: Cromossomo = cromossomo.map(dia => [...dia]);

  for (let diaIdx = 0; diaIdx < mutado.length; diaIdx++) {
    if (Math.random() > taxaMutacao) continue;

    const dia = mutado[diaIdx];
    const idsUsados = new Set(dia);
    const tempoTotalDia =dia.reduce((acc, id) => acc + (mapaExercicios.get(id)?.tempo_minutos || 0), 0);

    // Estratégia de mutação inteligente:
    // A) Se tempo > 60 min, remove o exercício mais demorado do dia (reparo temporal)
    if (tempoTotalDia > 60 && dia.length > 3) {
      let idxMaisLongo = 0;
      let maiorTempo = -1;
      for (let i = 0; i < dia.length; i++) {
        const t = mapaExercicios.get(dia[i])?.tempo_minutos || 0;
        if (t > maiorTempo) {
          maiorTempo = t;
          idxMaisLongo = i;
        }
      }
      dia.splice(idxMaisLongo, 1);
      continue;
    }

    // B) Se tempo < 38 min, adiciona um exercício compatível
    if (tempoTotalDia < 38 && dia.length < 6) {
      const novoEx = sortearExercicioAleatorio(pool, idsUsados);
      if (tempoTotalDia + novoEx.tempo_minutos <= 60) {
        dia.push(novoEx.id);
        continue;
      }
    }

    // C) Substituição aleatória de 1 exercício por outro do catálogo
    if (dia.length > 0) {
      const idxTroca = Math.floor(Math.random() * dia.length);
      
      // ~35% de chance de focar a mutação no grupo do ponto fraco
      const pontoFracoGrupo = params.pontoFraco;
      let novoEx: Exercicio;
      
      if (Math.random() < 0.35) {
        const poolPontoFraco = pool.filter(e => e.grupo_muscular === pontoFracoGrupo && !idsUsados.has(e.id));
        if (poolPontoFraco.length > 0) {
          novoEx = poolPontoFraco[Math.floor(Math.random() * poolPontoFraco.length)];
        } else {
          novoEx = sortearExercicioAleatorio(pool, idsUsados);
        }
      } else {
        novoEx = sortearExercicioAleatorio(pool, idsUsados);
      }

      dia[idxTroca] = novoEx.id;
    }
  }

  return mutado;
}

/**
 * Seleção por Torneio
 */
function selecaoTorneio(populacao: Individuo[], tamanhoTorneio: number): Individuo {
  let melhor = populacao[Math.floor(Math.random() * populacao.length)];
  for (let i = 1; i < tamanhoTorneio; i++) {
    const competidor = populacao[Math.floor(Math.random() * populacao.length)];
    if (competidor.fitness > melhor.fitness) {
      melhor = competidor;
    }
  }
  return melhor;
}

/**
 * Executa o Algoritmo Genético completo
 */
export function executarAlgoritmoGenetico(
  params: FormularioTreino,
  configCustomizada?: Partial<ConfigAG>
): {
  melhorIndividuo: Individuo;
  metricas: MetricasOtimizacao;
} {
  const tInicio = performance.now();
  const config: ConfigAG = { ...CONFIG_PADRAO, ...configCustomizada };
  const pool = obterPoolExerciciosPonderado(params.genero);
  const pontoFracoGrupo = params.pontoFraco;

  // 1. Geração da População Inicial
  let populacao: Individuo[] = [];
  
  // Sugestões de divisões clássicas dependendo da frequência para inicialização rica
  const divisoesSugeridas: Record<number, GrupoMuscular[][]> = {
    2: [
      ['Peito', 'Braço'],
      ['Costas', 'Perna']
    ],
    3: [
      ['Peito', 'Ombro'],
      ['Costas', 'Braço'],
      ['Perna', 'Core']
    ],
    4: [
      ['Peito', 'Braço'],
      ['Perna', 'Core'],
      ['Costas', 'Braço'],
      ['Perna', 'Ombro']
    ],
    5: [
      ['Peito', 'Ombro'],
      ['Costas', 'Core'],
      ['Perna'],
      ['Braço', 'Ombro'],
      ['Perna', 'Core']
    ]
  };

  const gruposPorFrequencia = divisoesSugeridas[params.frequencia] || divisoesSugeridas[4];

  for (let i = 0; i < config.tamanhoPopulacao; i++) {
    const dias: Cromossomo = [];
    for (let d = 0; d < params.frequencia; d++) {
      // Injeta foco muscular para diversificar a população inicial
      let foco = gruposPorFrequencia[d % gruposPorFrequencia.length]?.[0];
      // Garante que o ponto fraco esteja em pelo menos 2 dias para acelerar convergência inicial
      if ((d === 0 || d === Math.min(2, params.frequencia - 1)) && Math.random() < 0.8) {
        foco = pontoFracoGrupo;
      }
      dias.push(gerarDiaTreinoInicial(pool, foco));
    }

    const { fitness, metricas } = calcularFitness(dias, params);
    populacao.push({ dias, fitness, metricasDetalhadas: metricas });
  }

  const historicoEvolucao: HistoricoGeracao[] = [];
  let melhorIndividuoGlobal = populacao[0];

  // 2. Loop de Gerações
  for (let geracao = 1; geracao <= config.geracoes; geracao++) {
    // Ordena do melhor para o pior fitness
    populacao.sort((a, b) => b.fitness - a.fitness);

    if (populacao[0].fitness > melhorIndividuoGlobal.fitness) {
      melhorIndividuoGlobal = { 
        dias: populacao[0].dias.map(d => [...d]), 
        fitness: populacao[0].fitness,
        metricasDetalhadas: populacao[0].metricasDetalhadas 
      };
    }

    const fitnessTotal = populacao.reduce((acc, ind) => acc + ind.fitness, 0);
    const fitnessMedio = Math.round(fitnessTotal / populacao.length);

    historicoEvolucao.push({
      geracao,
      melhorFitness: populacao[0].fitness,
      fitnessMedio
    });

    const novaPopulacao: Individuo[] = [];

    // Elitismo: Copia os N melhores diretamente
    for (let e = 0; e < config.elitismo; e++) {
      novaPopulacao.push({
        dias: populacao[e].dias.map(d => [...d]),
        fitness: populacao[e].fitness,
        metricasDetalhadas: populacao[e].metricasDetalhadas
      });
    }

    // Reprodução
    while (novaPopulacao.length < config.tamanhoPopulacao) {
      const pai1 = selecaoTorneio(populacao, config.tamanhoTorneio);
      const pai2 = selecaoTorneio(populacao, config.tamanhoTorneio);

      let [filho1Dias, filho2Dias] = [pai1.dias, pai2.dias];

      if (Math.random() < config.taxaCrossover) {
        [filho1Dias, filho2Dias] = crossover(pai1.dias, pai2.dias);
      }

      filho1Dias = mutar(filho1Dias, pool, params, config.taxaMutacao);
      filho2Dias = mutar(filho2Dias, pool, params, config.taxaMutacao);

      const f1 = calcularFitness(filho1Dias, params);
      novaPopulacao.push({ dias: filho1Dias, fitness: f1.fitness, metricasDetalhadas: f1.metricas });

      if (novaPopulacao.length < config.tamanhoPopulacao) {
        const f2 = calcularFitness(filho2Dias, params);
        novaPopulacao.push({ dias: filho2Dias, fitness: f2.fitness, metricasDetalhadas: f2.metricas });
      }
    }

    populacao = novaPopulacao;
  }

  // Ordena a última geração
  populacao.sort((a, b) => b.fitness - a.fitness);
  if (populacao[0].fitness > melhorIndividuoGlobal.fitness) {
    melhorIndividuoGlobal = populacao[0];
  }

  const tFim = performance.now();
  const tempoExecucaoMs = Math.round(tFim - tInicio);

  const metricasFinais = calcularFitness(melhorIndividuoGlobal.dias, params);

  const criteriosAtendidos = {
    pontoFracoEmMultiplosDias: metricasFinais.metricas.diasPontoFraco >= 2,
    todosGrandesGruposTrabalhados: GRANDES_GRUPOS.every(g => metricasFinais.metricas.coberturaGrupos.includes(g)),
    limiteTempoRespeitado: !metricasFinais.metricas.violacaoTempo,
    descansoAdequado: metricasFinais.metricas.conflitosConsecutivos === 0
  };

  return {
    melhorIndividuo: {
      ...melhorIndividuoGlobal,
      metricasDetalhadas: metricasFinais.metricas
    },
    metricas: {
      tempoExecucaoMs,
      geracoesConvergencia: config.geracoes,
      fitnessAlcancado: metricasFinais.fitness,
      historicoEvolucao,
      criteriosAtendidos
    }
  };
}

/**
 * Converte o melhor cromossomo gerado pelo AG em um plano semanal legível e detalhado
 */
export function formatarPlanoTreino(
  cromossomo: Cromossomo,
  params: FormularioTreino
): DiaTreino[] {
  const diasDaSemanaNomes: Record<number, string[]> = {
    2: ['Terça-feira (Treino A)', 'Quinta-feira (Treino B)'],
    3: ['Segunda-feira (Treino A)', 'Quarta-feira (Treino B)', 'Sexta-feira (Treino C)'],
    4: ['Segunda-feira (Treino A)', 'Terça-feira (Treino B)', 'Quinta-feira (Treino C)', 'Sexta-feira (Treino D)'],
    5: ['Segunda-feira (Treino A)', 'Terça-feira (Treino B)', 'Quarta-feira (Treino C)', 'Quinta-feira (Treino D)', 'Sexta-feira (Treino E)']
  };

  const nomes = diasDaSemanaNomes[params.frequencia] || diasDaSemanaNomes[4];

  return cromossomo.map((diaIds, index) => {
    let tempoTotal = 0;
    const gruposSet = new Set<GrupoMuscular>();
    const exerciciosDetalhados: ExercicioDia[] = [];

    diaIds.forEach((id, ordem) => {
      const ex = mapaExercicios.get(id);
      if (ex) {
        tempoTotal += ex.tempo_minutos;
        gruposSet.add(ex.grupo_muscular);
        exerciciosDetalhados.push({
          ...ex,
          ordem: ordem + 1
        });
      }
    });

    const gruposArray = Array.from(gruposSet);
    
    // Nome do foco do dia
    let foco = gruposArray.slice(0, 2).join(' e ');
    if (gruposArray.includes(params.pontoFraco)) {
      foco += ' (ponto fraco)';
    }

    return {
      diaNumero: index + 1,
      diaNome: nomes[index] || `Dia ${index + 1}`,
      focoPrincipal: foco,
      tempoTotalMinutos: tempoTotal,
      gruposMusculares: gruposArray,
      exercicios: exerciciosDetalhados
    };
  });
}
