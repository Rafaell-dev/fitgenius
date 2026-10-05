import { executarAlgoritmoGenetico } from '../lib/geneticAlgorithm';
import { FormularioTreino } from '../types/treino';

interface Cenarioteste {
  nome: string;
  params: FormularioTreino;
  config: {
    tamanhoPopulacao: number;
    geracoes: number;
    taxaCrossover: number;
    taxaMutacao: number;
  };
}

const cenarios: Cenarioteste[] = [
  {
    nome: 'Cenário 1 (Padrão: Pop 70, Mut 25%, 80 Gerações - 4 Dias / Peito)',
    params: { frequencia: 4, pontoFraco: 'Peito', genero: 'Masculino' },
    config: { tamanhoPopulacao: 70, geracoes: 80, taxaCrossover: 0.85, taxaMutacao: 0.25 }
  },
  {
    nome: 'Cenário 2 (População Reduzida: Pop 30, Mut 10%, 40 Gerações - 4 Dias / Peito)',
    params: { frequencia: 4, pontoFraco: 'Peito', genero: 'Masculino' },
    config: { tamanhoPopulacao: 30, geracoes: 40, taxaCrossover: 0.70, taxaMutacao: 0.10 }
  },
  {
    nome: 'Cenário 3 (Hipermutação Exploratória: Pop 100, Mut 45%, 100 Gerações - 5 Dias / Braço)',
    params: { frequencia: 5, pontoFraco: 'Braço', genero: 'Masculino' },
    config: { tamanhoPopulacao: 100, geracoes: 100, taxaCrossover: 0.90, taxaMutacao: 0.45 }
  },
  {
    nome: 'Cenário 4 (Frequência Alta Feminina: Pop 70, Mut 25%, 80 Gerações - 3 Dias / Perna)',
    params: { frequencia: 3, pontoFraco: 'Perna', genero: 'Feminino' },
    config: { tamanhoPopulacao: 70, geracoes: 80, taxaCrossover: 0.85, taxaMutacao: 0.25 }
  }
];

console.log('=== BENCHMARK DE CENÁRIOS DO ALGORITMO GENÉTICO ===\n');

for (const c of cenarios) {
  const tempos: number[] = [];
  const fitnesses: number[] = [];
  let atendeTodos = true;

  // 3 repetições para média estável
  for (let r = 0; r < 3; r++) {
    const res = executarAlgoritmoGenetico(c.params, c.config);
    tempos.push(res.metricas.tempoExecucaoMs);
    fitnesses.push(res.metricas.fitnessAlcancado);
    const crit = res.metricas.criteriosAtendidos;
    if (!crit.pontoFracoEmMultiplosDias || !crit.todosGrandesGruposTrabalhados || !crit.limiteTempoRespeitado || !crit.descansoAdequado) {
      atendeTodos = false;
    }
  }

  const mediaTempo = Math.round(tempos.reduce((a, b) => a + b, 0) / tempos.length);
  const mediaFitness = Math.round(fitnesses.reduce((a, b) => a + b, 0) / fitnesses.length);

  console.log(`[${c.nome}]`);
  console.log(`- Tempo Médio: ${mediaTempo} ms`);
  console.log(`- Fitness Médio: ${mediaFitness} pts`);
  console.log(`- Critérios Atendidos: ${atendeTodos ? '100% OK' : 'Restrições Violadas'}`);
  console.log('--------------------------------------------------');
}
