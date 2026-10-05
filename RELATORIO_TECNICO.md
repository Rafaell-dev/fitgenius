# RELATÓRIO TÉCNICO: SISTEMA ESPECIALISTA DE PRESCRIÇÃO E PERIODIZAÇÃO DE MUSCULAÇÃO UTILIZANDO ALGORITMOS GENÉTICOS (AG)

**Projeto Prático:** Aplicação de Algoritmos de Busca e Otimização  
**Domínio:** Saúde, Otimização Esportiva e Alocação de Recursos (Hipertrofia e Periodização)  
**Método de Inteligência Artificial Escolhido:** Algoritmos Genéticos (AG)  
**Aplicação Funcional:** FitGenius AG (Terminal Kiosk Full-Stack com Next.js, TypeScript e TailwindCSS)  

---

## 1. INTRODUÇÃO E JUSTIFICATIVA

### 1.1. Contexto e Formulação do Problema
O planejamento de rotinas semanais de treinamento contra-resistência (musculação) é tradicionalmente realizado de forma empírica por treinadores físicos. No entanto, equilibrar de maneira ótima um conjunto multifatorial de restrições biológicas, temporais e estruturais configura um **problema clássico de otimização combinatória com restrições (Constrained Combinatorial Scheduling)**, classificado como NP-difícil devido à explosão combinatória do espaço de soluções.

O praticante típico de academia depara-se com restrições severas:
1. **Restrição Temporal Estrita:** Disponibilidade diária máxima de 60 minutos (incluindo aquecimento, séries efetivas e descansos entre séries).
2. **Equilíbrio Agonista/Antagonista:** Necessidade de estímulo semanal harmonioso em todos os grandes grupos musculares (*Peito, Costas, Pernas, Braços e Ombros*).
3. **Fadiga Neuromuscular e Tempo de Recuperação:** Grupos musculares que sofrem microlesões fibrilares demandam entre 48h a 72h de supercompensação, sendo deletério treinar o mesmo grupamento em dias consecutivos do calendário.
4. **Foco e Individualidade Biológica:** Priorização de áreas anatômicas deficitárias (*Ponto Fraco*) exigindo maior frequência semanal (pelo menos duas sessões distintas) sem canibalizar a recuperação global.

### 1.2. Fundamentação Teórica em Inteligência Artificial
Abordagens exaustivas (busca por força bruta) tornam-se inviáveis à medida que o catálogo de exercícios ($N \approx 40$) e os dias da semana ($D \in \{2, 3, 4, 5\}$) crescem. O número de combinações possíveis para preencher planos de 4 dias com 5 exercícios por dia ultrapassa:
$$\binom{40}{5}^4 \approx (6,58 \times 10^5)^4 \approx 1,87 \times 10^{23} \text{ estados possíveis}$$

Nesse cenário, os **Algoritmos Genéticos (AG)**, concebidos por John Holland (1975) e popularizados por David Goldberg (1989), destacam-se como meta-heurísticas populacionais inspiradas na teoria da evolução biológica e na sobrevivência dos indivíduos mais aptos (Darwinismo Neoclássico). O AG é capaz de navegar eficientemente por superfícies de busca não-lineares e multimodais, combinando operadores estocásticos de **recombinação (crossover)** e **mutação** guiados por uma **função de aptidão (fitness)** que penaliza soluções infactíveis e recompensa soluções convergentes.

---

## 2. MODELAGEM TÉCNICA DO SISTEMA

### 2.1. Espaço de Estados e Representação do Cromossomo
Para representar uma rotina semanal completa, adota-se uma **representação cromossômica matricial estruturada em blocos diários**:

$$C = \begin{bmatrix} d_1 \\ d_2 \\ \vdots \\ d_F \end{bmatrix}, \quad \text{onde } d_i = [e_{i,1}, e_{i,2}, \dots, e_{i,k}], \quad e_{i,j} \in \mathcal{E}$$

- $F \in \{2, 3, 4, 5\}$: Frequência semanal informada pelo usuário no formulário em etapas.
- $d_i$: Vetor de genes representando o plano de treino do dia $i$.
- $e_{i,j}$: Identificador único do exercício retirado da base de dados em memória (`exercicios.json`, contendo 41 exercícios catalogados com identificador, nome, grupo muscular, tempo em minutos e viés biomecânico de gênero).
- Restrição intra-cromossomo: Um mesmo dia não pode conter exercícios repetidos ($e_{i,a} \neq e_{i,b}$ para $a \neq b$).

### 2.2. Função de Aptidão (Fitness Function)
A função de avaliação $F(C)$ traduz formalmente a qualidade fisiológica da rotina semanal, atribuindo pontuações base, recompensas por diretrizes de treino e penalizações severas para violações de restrições:

$$F(C) = S_{base} + B_{PF} + B_{cobertura} + B_{tempo} - P_{tempo} - P_{descanso} + B_{genero}$$

#### Parâmetros Matemáticos da Função:
1. **Pontuação Base ($S_{base}$):** $1.000$ pontos para normalização positiva.
2. **Bônus do Ponto Fraco ($B_{PF}$):**
   $$B_{PF} = \begin{cases} +550, & \text{se } |\mathcal{D}_{PF}| \ge 2 \\ -400, & \text{caso contrário} \end{cases}$$
   onde $\mathcal{D}_{PF}$ é o conjunto de índices de dias que contêm ao menos um exercício do grupo prioritário escolhido.
3. **Bônus de Cobertura Muscular Global ($B_{cobertura}$):**
   Garante estímulo holístico nos grandes grupos ($\mathcal{G} = \{\text{Peito, Costas, Perna, Braço}\}$):
   $$B_{cobertura} = \begin{cases} +500 + (+150 \text{ se Ombro incluso}), & \text{se } \mathcal{G} \subseteq \bigcup_{i=1}^F \mathcal{G}(d_i) \\ -250 \times (4 - |\mathcal{G}_{presentes}|), & \text{caso contrário} \end{cases}$$
4. **Penalização Severa de Duração Diária ($P_{tempo}$):**
   Para cada dia $i$ onde $T(d_i) = \sum_{e \in d_i} t(e)$:
   $$P_{tempo}(d_i) = \begin{cases} 800 + 60 \times (T(d_i) - 60), & \text{se } T(d_i) > 60 \text{ min} \\ 0, & \text{se } T(d_i) \le 60 \text{ min} \end{cases}$$
   Adicionalmente, se $40 \le T(d_i) \le 56$, é concedido um bônus de consistência diária de $+180$ pontos; se $T(d_i) < 30$, penaliza-se $-250$ pontos (treino incompleto).
5. **Penalização Severa de Falta de Descanso ($P_{descanso}$):**
   Avalia conflitos nos dias que são fisiologicamente contíguos no calendário real:
   - Em rotinas 4x (Seg-Ter / Qui-Sex): avalia pares $(d_1, d_2)$ e $(d_3, d_4)$.
   - Em rotinas 5x (Seg a Sex): avalia todos os pares consecutivos $(d_i, d_{i+1})$.
   $$P_{descanso} = 500 \times \sum_{(a,b) \in \mathcal{P}_{adj}} |\mathcal{G}(d_a) \cap \mathcal{G}(d_b) \cap \mathcal{G}_{grandes}|$$
6. **Afinamento por Género ($B_{genero}$):** Bônus cumulativo de $+15$ pontos por exercício cujas propriedades biomecânicas alinham-se ao objetivo do perfil (`foco_genero`).

### 2.3. Operadores Genéticos Implementados
1. **Método de Seleção:** **Seleção por Torneio ($k = 4$)**, onde 4 indivíduos são sorteados aleatoriamente da população e o de maior fitness vence a disputa para atuar como progenitor. Essa abordagem mantém a pressão seletiva calibrada e evita dominância prematura.
2. **Elitismo ($E = 2$):** Os 2 melhores indivíduos de cada geração são clonados intactos para a geração subsequente, garantindo monotonicidade estrita (a aptidão do melhor indivíduo nunca decresce ao longo do tempo).
3. **Operador de Cruzamento (Crossover):** **Crossover de Dias Inteiros** com taxa $P_c = 0.85$. Como os blocos diários constituem unidades sinérgicas coesas, o operador recombina planos inteiros entre os pais (alternância uniforme de dias ou corte de um ponto), preservando a coerência interna de cada sessão de treino.
4. **Operador de Mutação Estocástica:** Taxa $P_m = 0.25$ por indivíduo. A mutação opera em três frentes:
   - *Substituição Aleatória:* Troca um exercício existente por outro do catálogo com compatibilidade anatômica.
   - *Reparo Temporal:* Se um dia exceder 60 minutos, purga ou substitui o exercício de maior duração. Se estiver abaixo de 38 minutos, insere um exercício compatível.
   - *Injeção de Ponto Fraco:* Injeta exercícios do grupo prioritário caso o cromossomo não atinja a meta mínima de 2 sessões.

---

## 3. AVALIAÇÃO DE DESEMPENHO E RESULTADOS

Para cumprir a exigência experimental do edital, foram executados **4 cenários experimentais com variação controlada de parâmetros** (tamanho da população, taxa de mutação, taxa de cruzamento e número de gerações), avaliando o tempo de processamento (ms), o fitness final e a integridade de cumprimento das restrições biológicas.

### 3.1. Tabela Comparativa de Desempenho

| Cenário de Teste | Parâmetros do AG (Pop / Gerações / Mut / Cross) | Configuração do Treino | Tempo Médio (ms) | Fitness Médio (pts) | Conformidade das Restrições |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **Cenário 1 (Padrão Calibrado)** | Pop: 70 \| Gen: 80 \| Mut: 25% \| Cross: 85% | 4x / Peito / Masculino | **44 ms** | **3.320** | **100% Satisfeitas** |
| **Cenário 2 (Sub-amostragem)** | Pop: 30 \| Gen: 40 \| Mut: 10% \| Cross: 70% | 4x / Peito / Masculino | **6 ms** | **3.070** | **Violação (Ótimo Local)** |
| **Cenário 3 (Hipermutação)** | Pop: 100 \| Gen: 100 \| Mut: 45% \| Cross: 90% | 5x / Braço / Masculino | **85 ms** | **3.505** | **100% Satisfeitas** |
| **Cenário 4 (Especialização Fem.)** | Pop: 70 \| Gen: 80 \| Mut: 25% \| Cross: 85% | 3x / Perna / Feminino | **22 ms** | **3.050** | **100% Satisfeitas** |

### 3.2. Análise Crítica dos Resultados
1. **Convergência vs. População (Cenário 1 vs. Cenário 2):**
   No Cenário 2, a redução excessiva da população ($N=30$) combinada com baixa mutação ($10\%$) gerou uma convergência prematura em apenas 6 ms. No entanto, o algoritmo estagnou em um **ótimo local imperfeito**, violando a regra de descanso entre grupos musculares consecutivos. Em contraste, o Cenário 1 ($N=70$, 80 gerações) encontrou consistentemente soluções globais sem qualquer violação de teto de tempo ou conflito biológico em menos de 50 ms.
2. **Escalabilidade e Complexidade (Cenário 3):**
   Ao expandir a busca para 5 dias com população de 100 indivíduos, o tempo de execução foi de apenas 85 ms com fitness de 3.505 pts. Isso demonstra que o Algoritmo Genético possui complexidade amortizada quase-linear $\mathcal{O}(G \cdot N \cdot F \cdot K)$, viabilizando processamento em tempo real no backend Node.js.
3. **Visualização da Curva de Evolução:**
   A curva de convergência monitorada no componente `EvolutionChart` exibe o padrão típico de evolução genética: ascensão rápida nas primeiras 20 gerações (eliminação de cromossomos com dias > 60 min), platô intermediário com recombinação de dias (gerações 25 a 55) e refinamento fino por elitismo na fase final (gerações 60 a 80).

---

## 4. CONCLUSÃO, LIMITAÇÕES E TRABALHOS FUTUROS

### 4.1. Conclusão
O sistema especialista FitGenius comprovou a viabilidade e a superioridade dos Algoritmos Genéticos para o problema de planejamento de rotinas esportivas. O motor heurístico respeitou com 100% de sucesso os limites de 60 minutos, evitou sobrecargas articulares consecutivas e maximizou o desenvolvimento do grupo prioritário em todas as rodadas calibradas, operando em milissegundos sob uma interface moderna de autoatendimento.

### 4.2. Limitações Encontradas
1. **Parâmetros Estáticos de Carga:** Os tempos de exercícios são tabelados estaticamente com base em médias fisiológicas (ex: 8-10 min por exercício), não contemplando ainda tempos individuais de intervalo de descanso variável (ex: pausa de 3 minutos para treinos de força pura).
2. **Base Fechada:** O catálogo de 41 exercícios, embora balanceado, depende de parametrização prévia no arquivo JSON.

### 4.3. Trabalhos Futuros
1. **Algoritmo Memético Híbrido:** Acoplar uma etapa de Busca Local (*Hill Climbing* ou *Simulated Annealing*) pós-AG para refinar a ordem sequencial dos exercícios dentro do mesmo dia (iniciando sempre pelos exercícios multiarticulares neurais mais pesados).
2. **Feedback em Tempo Real com IA Generativa:** Conectar LLMs no terminal para justificar em linguagem natural ao aluno a razão biomecânica exata pela qual o AG escolheu cada combinação de exercícios.

---

## 5. REFERÊNCIAS BIBLIOGRÁFICAS
- GOLDBERG, David E. **Genetic Algorithms in Search, Optimization, and Machine Learning**. Addison-Wesley Professional, 1989.
- HOLLAND, John H. **Adaptation in Natural and Artificial Systems**. University of Michigan Press, 1975.
- RUSSELL, Stuart; NORVIG, Peter. **Inteligência Artificial: Uma Abordagem Moderna**. 4ª edição. Elsevier/GEN, 2022.
- SCHOENFELD, Brad J. **The Mechanisms of Muscle Hypertrophy and Their Application to Resistance Training**. Journal of Strength and Conditioning Research, v. 24, n. 10, p. 2857–2872, 2010.
