# 🎨 HabitSPA 
Arquitetura Front-end

Este documento descreve a arquitetura, padrões de projeto e decisões técnicas adotadas no desenvolvimento do front-end do HabitSPA.

## 1. Visão Geral
O projeto é uma **Single Page Application (SPA)** construída com **React** e **TypeScript**, utilizando **Vite** como build tool. O foco da arquitetura é performance, tipagem segura e uma experiência de usuário fluida através de atualizações otimistas (Optimistic UI).

## 2. Stack Tecnológico

| Categoria | Tecnologia | Justificativa |
| :--- | :--- | :--- |
| **Core** | React 18 + Vite | Performance de build e ecossistema maduro. |
| **Linguagem** | TypeScript | Segurança de tipos e redução de erros em runtime. |
| **HTTP Client** | Axios | Instância centralizada com interceptors para chamadas API. |
| **Roteamento** | React Router DOM v6 | Gerenciamento de rotas e navegação SPA. |
| **Estilização** | CSS Modules + CSS Variables | Escopo local de estilos e suporte nativo a Temas (Dark Mode). |
| **Feedback** | React Hot Toast | Notificações assíncronas não obstrutivas. |
| **Dados** | Chart.js | Visualização de dados para o módulo de estatísticas. |

## 3. Estrutura de Diretórios

A estrutura segue o padrão de separação por responsabilidades (Feature-based folder structure simplificada):

src/
├── components/        # Componentes reutilizáveis (botões, modais, toggles)
│   ├── EditHabitModal/
│   ├── ScheduleTaskForm/
│   └── ThemeToggle.tsx
├── contexts/          # Estado global da aplicação
│   └── ThemeContext.tsx  # Gerenciamento de Dark/Light Mode
├── pages/             # Componentes de Página (Rotas)
│   ├── Dashboard.tsx     # Lógica principal de agendamento
│   ├── FocusMode.tsx     # Lógica de execução e timer
│   ├── Layout.tsx        # Estrutura base (Sidebar + Outlet)
│   └── ...
├── services/          # Comunicação com Backend
│   └── api.ts            # Instância Axios configurada
├── styles/            # Estilos globais (se houver)
├── App.tsx            # Configuração de Rotas e Providers
├── index.css          # Variáveis CSS (Cores e Temas)
└── main.tsx           # Ponto de entrada


# Arquitetura do Backend
O backend foi construído seguindo os princípios de Clean Architecture e Camadas (Layered Architecture), utilizando Node.js com TypeScript. A responsabilidade de cada componente é estritamente separada para garantir manutenibilidade e escalabilidade.

🛠️ Tecnologias Principais
Runtime: Node.js

Linguagem: TypeScript

Framework Web: Express.js

ORM: TypeORM

Banco de Dados: PostgreSQL (via Supabase)

Autenticação: JWT (JSON Web Tokens)

📐 Fluxo de Dados (Request Lifecycle)
Todas as requisições seguem um fluxo unidirecional previsível:

## Snippet de código

graph LR
    A[Cliente / Frontend] -->|JSON| B(Rota / Routes)
    B -->|Validação Token| C{Middleware}
    C -->|Request| D[Controller]
    D -->|Dados| E[Service]
    E -->|Lógica de Negócio| F[TypeORM Repository]
    F -->|SQL| G[(PostgreSQL)]
    G -->|Dados| F
    F -->|Entidade| E
    E -->|Objeto| D
    D -->|JSON Response| A
 
O banco de dados foi modelado para suportar hábitos recorrentes e gamificação:

Usuario: Entidade central. Armazena credenciais e dados de perfil.

Habito: Funciona como um "molde" ou categoria (ex: "Ir à Academia").

RegistroHabito (Agenda): Representa a execução diária de um hábito. Contém a data e o status (feito, pendente).

Relação: Um Habito tem muitos RegistroHabito.

Challenge (Desafios): Sistema de duelos entre usuários.

Relação: Liga dois Usuarios (Challenger e Opponent) para competir em um hábito específico.

🔒 Segurança e Autenticação
JWT (Bearer Token): Utilizado para proteger rotas privadas. O token é gerado no login e deve ser enviado no Header Authorization.

Bcrypt: As senhas dos usuários são armazenadas apenas como hashes, nunca em texto plano.

Middlewares: Garantem que apenas requisições com tokens válidos cheguem aos Controllers protegidos.
