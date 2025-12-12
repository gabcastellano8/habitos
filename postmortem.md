#  Postmortem (Lições Aprendidas e Desafios Técnicos)
Durante o desenvolvimento, houve desafios técnicos significativos:

Manipulação de Timezones: Houve um desafio crítico na sincronização de datas entre o cliente e o servidor. A solução exigiu a normalização das datas para o formato ISO local (en-CA / YYYY-MM-DD), evitando que tarefas fossem salvas no dia incorreto devido a conversões automáticas para UTC.

Consistência de API REST: A integração revelou inconsistências nos métodos HTTP suportados pelo Backend (especificamente a rejeição de PATCH em favor de PUT para atualizações parciais), exigindo refatoração da camada de serviço e adaptação do Frontend.

Estruturas de Dados Aninhadas: O tratamento de dados complexos vindos da API (Objeto Agendamento contendo Objeto Hábito) exigiu a criação de interfaces TypeScript robustas e funções "helpers" de normalização (resolveHabitName) para evitar falhas de renderização quando propriedades variavam (ex: nome vs titulo).

Conclusão: Os desafios foram primariamente em torno do Contrato de API (datas e métodos HTTP) e não na lógica de negócio central, reafirmando a necessidade de uma fase robusta de validação de schema antes da integração.
