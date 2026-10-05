import { NextRequest, NextResponse } from 'next/server';
import { FormularioTreino, RespostaGerarTreino } from '@/types/treino';
import { executarAlgoritmoGenetico, formatarPlanoTreino } from '@/lib/geneticAlgorithm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { frequencia, pontoFraco, genero } = body;

    // Validação estrita de parâmetros de entrada
    if (!frequencia || ![2, 3, 4, 5].includes(Number(frequencia))) {
      return NextResponse.json(
        { erro: 'Frequência inválida. Deve ser 2, 3, 4 ou 5 dias por semana.' },
        { status: 400 }
      );
    }

    if (!pontoFraco || !['Peito', 'Braço', 'Perna', 'Costas'].includes(pontoFraco)) {
      return NextResponse.json(
        { erro: 'Ponto fraco inválido. Escolha: Peito, Braço, Perna ou Costas.' },
        { status: 400 }
      );
    }

    if (!genero || !['Masculino', 'Feminino'].includes(genero)) {
      return NextResponse.json(
        { erro: 'Género inválido. Escolha: Masculino ou Feminino.' },
        { status: 400 }
      );
    }

    const parametros: FormularioTreino = {
      frequencia: Number(frequencia) as FormularioTreino['frequencia'],
      pontoFraco: pontoFraco as FormularioTreino['pontoFraco'],
      genero: genero as FormularioTreino['genero']
    };

    // Executa a otimização com o Algoritmo Genético
    const resultadoAG = executarAlgoritmoGenetico(parametros);

    // Converte o melhor cromossomo para o formato da resposta
    const planoFormatado = formatarPlanoTreino(resultadoAG.melhorIndividuo.dias, parametros);

    const resposta: RespostaGerarTreino = {
      sucesso: true,
      plano: planoFormatado,
      metricas: resultadoAG.metricas,
      parametrosEntrada: parametros
    };

    return NextResponse.json(resposta, { status: 200 });
  } catch (error) {
    console.error('Erro ao processar algoritmo genético:', error);
    return NextResponse.json(
      { 
        erro: 'Erro interno ao processar a otimização genética.',
        detalhes: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
