import { executarAlgoritmoGenetico, formatarPlanoTreino } from '../lib/geneticAlgorithm';
import { FormularioTreino } from '../types/treino';

const cenarios: FormularioTreino[] = [
  { frequencia: 4, pontoFraco: 'Peito', genero: 'Masculino' },
  { frequencia: 3, pontoFraco: 'Perna', genero: 'Feminino' },
  { frequencia: 5, pontoFraco: 'Braço', genero: 'Masculino' },
  { frequencia: 2, pontoFraco: 'Costas', genero: 'Feminino' },
];

console.log('--- INICIANDO TESTE DO MOTOR DE ALGORITMO GENÉTICO ---');

for (const cenario of cenarios) {
  console.log(`\n======================================================`);
  console.log(`Cenário: ${cenario.frequencia}x/semana | Ponto Fraco: ${cenario.pontoFraco} | Género: ${cenario.genero}`);
  
  const res = executarAlgoritmoGenetico(cenario);
  const plano = formatarPlanoTreino(res.melhorIndividuo.dias, cenario);

  console.log(`Fitness Alcançado: ${res.metricas.fitnessAlcancado}`);
  console.log(`Tempo de Execução: ${res.metricas.tempoExecucaoMs} ms`);
  console.log(`Gerações: ${res.metricas.geracoesConvergencia}`);
  console.log(`Critérios atendidos:`, res.metricas.criteriosAtendidos);

  plano.forEach(dia => {
    console.log(`  -> ${dia.diaNome} (${dia.tempoTotalMinutos} min) [${dia.gruposMusculares.join(', ')}]`);
    dia.exercicios.forEach(ex => {
      console.log(`      * ${ex.nome} (${ex.tempo_minutos} min, ${ex.grupo_muscular})`);
    });
  });
}
