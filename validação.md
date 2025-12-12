# 🧪 Testes e Estratégia de Validação - HabitSPA

Este documento detalha a abordagem adotada para garantir a qualidade do código (QA) e a validação da solução junto aos usuários finais.

## 1. Testes Técnicos (Desenvolvimento)

Utilizamos uma estratégia focada em testes unitários para funções utilitárias e testes de integração para componentes críticos.

### 🛠 Ferramentas Utilizadas
| Ferramenta | Finalidade |
| :--- | :--- |
| **Vitest** | Runner de testes (substituto rápido do Jest para projetos Vite). |
| **React Testing Library** | Testes de componentes focados no comportamento do usuário (DOM). |
| **MSW (Mock Service Worker)** | (Opcional) Para mockar requisições API durante os testes. |

### 🎯 Escopo dos Testes

1.  **Funções Utilitárias (`src/utils`)**:
    * Validação das funções de data (`getISODateString`, `getStartOfWeek`).
    * Validação dos *helpers* de normalização (`resolveHabitName`).

2.  **Componentes Críticos**:
    * **Dashboard:** Verificar se a lista renderiza corretamente quando a API retorna dados.
    * **Modo Foco:** Testar o comportamento do Timer (início, pausa e conclusão).
    * **Optimistic UI:** Simular o clique de "Check" e verificar a atualização visual imediata.

### 🚀 Como Executar

Para rodar a suíte de testes automatizados:

bash
# Executa todos os testes
npm run test

# Executa testes em modo watch (desenvolvimento)
npm run test:watch

# Gera relatório de cobertura de código
npm run coverage
2. Validação de Produto (User Acceptance)
Além da qualidade de código, o HabitSPA passa por um processo de validação de usabilidade para garantir que atende aos objetivos de negócio (aumentar a disciplina e foco).

📋 Metodologia
A validação é realizada através de um Teste de Uso Contínuo com um grupo focal.

Público-alvo: 5 a 10 usuários (Estudantes e Profissionais com dificuldades de organização).

Duração: 2 semanas (1 ciclo de sprint).

Ambiente: Aplicação em Produção (ou Staging).

📊 Métricas e KPIs
Para mensurar o sucesso, coletamos os seguintes dados:

A. Quantitativos (Métricas de Uso)
Taxa de Check-in: Média de hábitos concluídos por dia.

Uso do Modo Foco: Quantas tarefas foram concluídas através do timer vs. check-in simples no dashboard.

Retenção: Frequência de acesso diário durante as 2 semanas.

B. Qualitativos (Satisfação)
Ao final do período, aplicamos o questionário SUS (System Usability Scale) para avaliar:

Facilidade de aprendizado.

Eficiência do sistema.

Satisfação subjetiva.

📝 Roteiro de Teste (Exemplo)
O usuário participante deve realizar as seguintes missões durante o teste:

Onboarding: Criar uma conta e cadastrar 3 hábitos iniciais.

Planejamento: Acessar o Dashboard e verificar as tarefas do dia.

Execução: Entrar no "Modo Foco" para realizar uma tarefa de estudo/trabalho (utilizando o Timer de 25min).

Análise: Acessar a aba "Estatísticas" após 3 dias para ver o Heatmap.

3. Resultados Esperados
Ao final do ciclo de validação, espera-se:

SUS Score > 70: Indicando boa usabilidade.

Aumento de Produtividade: Relatos de que o "Modo Foco" reduziu distrações externas.

Estabilidade: Identificação e correção de bugs de borda (edge cases) não pegos nos testes unitários.
