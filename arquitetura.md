# Arquitetura do Sistema – HabitSPA

Com base em tudo o que foi definido para o **HabitSPA**, a arquitetura do projeto segue o padrão de **Arquitetura em Camadas (Layered Architecture)**, baseada em **Cliente-Servidor / Microserviços**.

Como o **Frontend (React)** está separado do **Backend (Node.js)**, o sistema é caracterizado como um **sistema distribuído**, com comunicação realizada por meio de uma **API REST**.

---

## Visão Geral da Arquitetura

O sistema foi projetado seguindo o padrão arquitetural **Cliente-Servidor (Client-Server)**, onde a lógica de apresentação é completamente desacoplada da regra de negócios e da persistência de dados.

A comunicação entre essas camadas ocorre através de uma **API RESTful**, utilizando o protocolo **HTTP** e troca de mensagens no formato **JSON**.

---

## 1. Diagrama Macro da Arquitetura

O fluxo de dados do sistema segue a estrutura abaixo:

[ CLIENTE (Frontend) ]  <--->  [ SERVIDOR (Backend) ]  <--->  [ BANCO DE DADOS ]
   (React + Vite)                (Node.js + Express)             (PostgreSQL)
        |                                 |                            |
   Interação UI                    Regras de Negócio              Persistência
   Consumo de API                  Autenticação (JWT)             Relacionamentos

## 2. Detalhamento das Camadas

### A. Camada de Apresentação (Frontend)

Responsável por toda a interação com o usuário. Foi construída como uma **Single Page Application (SPA)**, o que significa que o carregamento das páginas é dinâmico e não exige o recarregamento completo do navegador.

**Tecnologias:**
- React
- TypeScript
- Tailwind CSS
- Vite

**Bibliotecas Chave:**
- `axios` – requisições HTTP assíncronas
- `react-router-dom` – gerenciamento de rotas no lado do cliente
- `lucide-react` – iconografia leve
- `recharts` (ou similar) – renderização de gráficos de desempenho

**Responsabilidades:**
- Renderizar componentes
- Gerenciar estado local (`useState` / Context API)
- Capturar inputs do usuário
- Consumir a API REST

---

### B. Camada de Aplicação (Backend)

Atua como o **cérebro do sistema**, sendo responsável por processar requisições, validar dados e aplicar as regras de negócio.

**Exemplos de Regras de Negócio:**
- Cálculo de XP
- Validação de senhas
- Lógica de duelos entre usuários

**Tecnologias:**
- Node.js
- Express
- TypeScript

**Padrão de Projeto:**
- MSC (Model-Service-Controller) ou Repository Pattern

**Componentes:**
- **Controllers:** recebem as requisições HTTP e validam os parâmetros
- **Services:** contêm a lógica de negócio  
  _(ex: "Só pode marcar um hábito como feito se a data for hoje")_
- **Repositories:** abstraem a comunicação direta com o banco de dados

**Segurança:**
- Autenticação stateless com **JWT (JSON Web Token)**
- Hash de senhas utilizando **bcrypt**

---

### C. Camada de Persistência (Banco de Dados)

Responsável por armazenar de forma estruturada e relacional todos os dados do sistema.

**Tecnologia:**
- PostgreSQL

**ORM (Object-Relational Mapper):**
- TypeORM ou Prisma

O uso de ORM permite manipular o banco utilizando classes e objetos TypeScript, evitando SQL puro e aumentando a segurança contra **SQL Injection**.

**Principais Entidades:**
- `User` – dados de acesso e perfil
- `Habit` – definições do hábito e frequência
- `HabitLog` – registros históricos de conclusão dos hábitos
- `Duel` / `Challenge` – dados das competições entre usuários

---

## 3. Fluxo de Dados (Exemplo Prático)

### Caso de Uso: Concluir um Hábito

**Frontend**  
O usuário clica no checkbox no Dashboard.  
O React captura o evento e envia a requisição:
http
PATCH /api/habitos/:id/concluir
Authorization: Bearer <JWT>

