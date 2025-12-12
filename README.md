#  Projeto-de-Desenvolvimento-2 Documentação do Projeto: HabitSPA


# Resumo do Projeto

Muitas pessoas enfrentam dificuldades significativas em manter a disciplina necessária para a criação e acompanhamento de novos hábitos, o que impacta negativamente sua produtividade e saúde. O problema central reside na escassez de ferramentas que sejam simultaneamente simples, acessíveis e capazes de auxiliar não apenas no planejamento, mas na execução das tarefas.

A solução proposta é o HabitSPA, uma aplicação web responsiva que integra funcionalidades de lista de tarefas (to-do list) com um rastreador de hábitos robusto. O grande diferencial do projeto é a inclusão do "Modo Foco", uma ferramenta de atenção plena que auxilia o usuário no momento da ação, além de relatórios gráficos para acompanhamento histórico. A implementação deste sistema visa proporcionar ao usuário maior organização, disciplina e consistência no alcance de suas metas.

# Definição do Problema

Atualmente, o controle de rotinas e hábitos é realizado de forma fragmentada. Usuários frequentemente recorrem a anotações manuais, planilhas complexas ou diversos aplicativos desconexos para planejar e executar. As soluções existentes apresentam lacunas críticas, tais como:

Falta de ferramentas de execução: Muitos apps permitem listar tarefas, mas não oferecem suporte durante a realização delas.

Baixo engajamento: A ausência de feedback visual imediato sobre o progresso desestimula a continuidade.

Desconexão: A separação entre "o que tenho que fazer hoje" (agenda) e "quais hábitos quero construir" (metas).

Segundo Lally et al. (2009), a formação de um hábito exige repetição consistente. Sem ferramentas que removam o atrito cognitivo e ofereçam suporte visual, o risco de abandono aumenta consideravelmente.

# Objetivos
<h4>Objetivo Geral </h4>

Desenvolver uma aplicação web de gerenciamento de hábitos que unifique o planejamento diário, a execução focada e o monitoramento de progresso, auxiliando usuários a manterem a consistência.

<h4> Objetivos Específicos </h4>

Criar um Dashboard Interativo que permita a visualização e manipulação (CRUD) de hábitos diários.

Implementar o Modo Foco: uma interface minimalista com cronômetro (Pomodoro) integrado para execução de tarefas sem distrações.

Desenvolver um sistema de Feedback Visual Imediato (Optimistic UI) para aumentar a satisfação do usuário ao concluir tarefas.

Fornecer relatórios de consistência (Heatmaps e gráficos de frequência) para análise de longo prazo.

# Stack Tecnológico

Para o desenvolvimento da solução, foi definido um conjunto tecnológico focado em desempenho, tipagem segura e componentização moderna:

Linguagem: TypeScript (garantindo integridade de dados e redução de erros).

Frontend: ReactJS com Vite (focado em performance e build otimizado).

Estilização: CSS Modules e CSS Puro (para controle granular de estilos e design responsivo).

Comunicação: Axios (cliente HTTP para consumo da API REST).

Backend: Node.js com Express.

Controle de Versão: Git/GitHub.

# Descrição da Solução

O sistema HabitSPA foi estruturado em três módulos principais de navegação:

<h4>Dashboard (Planejamento e Gestão)</h4>
A tela principal do sistema. Funciona como uma agenda diária onde o usuário pode:

Navegar entre dias (passado, presente e futuro).

Visualizar a lista de tarefas agendadas para a data específica.

Realizar check-in rápido de tarefas.

Criar, editar e excluir moldes de hábitos.

<h4>Modo Foco (Execução)</h4>
Uma rota exclusiva desenhada para eliminar ruídos visuais e combater a procrastinação. O sistema:

Filtra automaticamente apenas as tarefas pendentes do dia atual.

Oferece um cronômetro configurável (15, 25, 45 min).

Ao término do tempo, comunica-se com a API para concluir a tarefa automaticamente, oferecendo uma recompensa visual ao usuário.

<h4>Analytics (Monitoramento)</h4>
Módulo dedicado à visão de longo prazo, apresentando um histórico visual (Heatmap de dias concluídos vs. perdidos) e gráficos de frequência, permitindo ao usuário identificar padrões de comportamento.

#Arquitetura e UX
O projeto adota uma arquitetura baseada em componentes funcionais (React Hooks), separando a lógica de negócio (services) da interface (pages/components).

Destaque de UX: Interface Otimista (Optimistic UI) Para melhorar a percepção de velocidade, foi implementada uma estratégia de atualização otimista. Ao marcar um hábito como concluído (seja no Dashboard ou no Modo Foco), a interface é atualizada instantaneamente, sem aguardar a resposta do servidor. A requisição ocorre em segundo plano e, apenas em caso de erro, o estado é revertido e o usuário notificado.

# Validação e Estratégia

Método: Teste de uso contínuo por 2 semanas com grupo focal.

Métrica: Aplicação do questionário SUS (System Usability Scale) ao final do período.

Objetivo: Validar se a introdução do "Modo Foco" aumentou a taxa de conclusão de tarefas em comparação ao uso de listas simples.

# Consolidação dos Dados

Para mensurar o sucesso do projeto, serão analisados:

Taxa de Check-in: Média de hábitos cumpridos diariamente.

Retenção: Frequência de retorno ao aplicativo.

Feedback Qualitativo: Relatos sobre a eficácia do cronômetro na redução de distrações.

# Conclusões

O desenvolvimento do HabitSPA demonstrou a viabilidade de criar uma ferramenta web robusta que une planejamento e execução. A utilização de tecnologias modernas (React/Vite) permitiu uma interface fluida e responsiva. Os testes de desenvolvimento indicam que a funcionalidade "Modo Foco" atua como um forte diferencial competitivo, preenchendo a lacuna entre "planejar fazer" e "realmente fazer".

# Limitações e Perspectivas Futuras

Limitações Atuais (MVP):

A aplicação web não possui notificações push nativas (apenas visuais).

Ausência de integração com calendários externos (Google Calendar).

Perspectivas Futuras:

Desenvolvimento da versão Mobile nativa (React Native) para habilitar notificações push.

Implementação de Gamificação (sistema de níveis e XP).

Sincronização em nuvem para uso offline (PWA).

#  Postmortem (Lições Aprendidas e Desafios Técnicos)
Durante o desenvolvimento, houve desafios técnicos significativos:

Manipulação de Timezones: Houve um desafio crítico na sincronização de datas entre o cliente e o servidor. A solução exigiu a normalização das datas para o formato ISO local (en-CA / YYYY-MM-DD), evitando que tarefas fossem salvas no dia incorreto devido a conversões automáticas para UTC.

Consistência de API REST: A integração revelou inconsistências nos métodos HTTP suportados pelo Backend (especificamente a rejeição de PATCH em favor de PUT para atualizações parciais), exigindo refatoração da camada de serviço e adaptação do Frontend.

Estruturas de Dados Aninhadas: O tratamento de dados complexos vindos da API (Objeto Agendamento contendo Objeto Hábito) exigiu a criação de interfaces TypeScript robustas e funções "helpers" de normalização (resolveHabitName) para evitar falhas de renderização quando propriedades variavam (ex: nome vs titulo).

# Referências Bibliográficas

LALLY, Phillippa; VAN JAARSVELD, C. H. M.; POTTS, H. W. W.; WARDLE, J. How are habits formed: Modelling habit formation in the real world. European Journal of Social Psychology, 2009.

REACT JS. Documentação oficial. Disponível em: https://react.dev.

MDN WEB DOCS. Date.prototype.toLocaleDateString(). Disponível em: https://developer.mozilla.org.
