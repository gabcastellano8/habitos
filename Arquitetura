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

```text
[ CLIENTE (Frontend) ]  <--->  [ SERVIDOR (Backend) ]  <--->  [ BANCO DE DADOS ]
   (React + Vite)                (Node.js + Express)             (PostgreSQL)
        |                                 |                            |
   Interação UI                    Regras de Negócio              Persistência
   Consumo de API                  Autenticação (JWT)             Relacionamentos
