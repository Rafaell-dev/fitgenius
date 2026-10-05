export type GrupoMuscular = 
  | 'Peito' 
  | 'Costas' 
  | 'Perna' 
  | 'Braço' 
  | 'Ombro' 
  | 'Core';

export type FocoGenero = 'neutro' | 'masc' | 'fem';

export interface Exercicio {
  id: string;
  nome: string;
  grupo_muscular: GrupoMuscular;
  tempo_minutos: number;
  foco_genero: FocoGenero;
  series_sugeridas?: string;
  descricao?: string;
}

export interface FormularioTreino {
  frequencia: 2 | 3 | 4 | 5;
  pontoFraco: 'Peito' | 'Braço' | 'Perna' | 'Costas';
  genero: 'Masculino' | 'Feminino';
}

export interface ExercicioDia extends Exercicio {
  ordem: number;
}

export interface DiaTreino {
  diaNumero: number;
  diaNome: string;
  focoPrincipal: string;
  tempoTotalMinutos: number;
  gruposMusculares: GrupoMuscular[];
  exercicios: ExercicioDia[];
}

export interface HistoricoGeracao {
  geracao: number;
  melhorFitness: number;
  fitnessMedio: number;
}

export interface MetricasOtimizacao {
  tempoExecucaoMs: number;
  geracoesConvergencia: number;
  fitnessAlcancado: number;
  historicoEvolucao: HistoricoGeracao[];
  criteriosAtendidos: {
    pontoFracoEmMultiplosDias: boolean;
    todosGrandesGruposTrabalhados: boolean;
    limiteTempoRespeitado: boolean;
    descansoAdequado: boolean;
  };
}

export interface RespostaGerarTreino {
  sucesso: boolean;
  plano: DiaTreino[];
  metricas: MetricasOtimizacao;
  parametrosEntrada: FormularioTreino;
}
