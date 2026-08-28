📦 Dispensa Digital

Sistema web para controle e gerenciamento de estoque, desenvolvido com React + TypeScript no Frontend e Java + Spring Boot no Backend.

O projeto tem como objetivo oferecer uma solução simples, moderna e organizada para gerenciamento de produtos e controle de estoque.

⸻

🚀 Sobre o projeto

A Dispensa Digital é uma aplicação web desenvolvida para facilitar o gerenciamento de produtos e o controle de estoque.

O sistema possui uma arquitetura dividida entre Frontend e Backend, porém todo o projeto está centralizado neste único repositório.

🏗️ Divisão do projeto

                    DISPENSA DIGITAL
                          │
             ┌────────────┴────────────┐
             │                         │
             ▼                         ▼
       🎨 FRONTEND                ⚙️ BACKEND
       Dennys Fernandes           Guilherme Marrafon
             │                         │
             │                         │
       React + TypeScript        Java + Spring Boot
             │                         │
             └────────────┬────────────┘
                          │
                          ▼
                     API REST
                          │
                          ▼
                    Banco de Dados

⸻

🎨 Frontend

O Frontend é responsável pela interface visual da aplicação, experiência do usuário, navegação entre páginas, validação dos dados e comunicação com o Backend.

👨‍💻 Responsável

Dennys Fernandes

GitHub:
https://github.com/fernandesdennys

🛠️ Tecnologias

* React 19
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Axios
* React Icons
* Zod
* ESLint
* Prettier

📦 Dependências principais

React                    19.2.8
React DOM                19.2.8
TypeScript               6.0.2
Vite                     8.2.2
Tailwind CSS             4.3.3
Axios                    1.19.0
React Router DOM         7.18.2
React Icons              5.7.0
Zod                      4.4.3

▶️ Executando o Frontend

Instale as dependências:

npm install

Execute o projeto:

npm run dev

O Vite disponibilizará a aplicação no endereço apresentado no terminal.

Normalmente:

http://localhost:5173

📋 Scripts disponíveis

Comando	Descrição
npm run dev	Inicia o servidor de desenvolvimento
npm run build	Compila o projeto para produção
npm run lint	Executa o ESLint
npm run preview	Executa uma prévia da aplicação de produção

⸻

⚙️ Backend

O Backend é responsável pela API da aplicação, regras de negócio, validações, persistência dos dados e comunicação com o banco de dados.

👨‍💻 Responsável

Guilherme Marrafon

GitHub:
https://github.com/Marrafon91

🛠️ Tecnologias

* Java 25
* Spring Boot 4.1.0
* Spring Web MVC
* Spring Data JPA
* Spring Validation
* H2 Database
* MapStruct
* Maven
* Spring Boot DevTools
* Spring Dotenv

📦 Principais dependências

Java                     25
Spring Boot              4.1.0
Spring Data JPA
Spring Validation
Spring Web MVC
MapStruct                1.6.3
H2 Database
Spring Dotenv            4.0.0
Maven

▶️ Executando o Backend

O Backend utiliza Maven para gerenciamento e execução do projeto.

No Linux/macOS:

./mvnw spring-boot:run

No Windows:

mvnw.cmd spring-boot:run

Por padrão, o Spring Boot utiliza:

http://localhost:8080

⸻

🔄 Comunicação entre Frontend e Backend

A comunicação entre as duas partes da aplicação acontece através de uma API REST.

O Frontend utiliza o Axios para realizar as requisições HTTP para o Backend.

┌──────────────────────┐
│       USUÁRIO        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│       FRONTEND       │
│                      │
│ React                │
│ TypeScript           │
│ Tailwind CSS         │
└──────────┬───────────┘
           │
           │ Axios / HTTP
           ▼
┌──────────────────────┐
│       BACKEND        │
│                      │
│ Java                 │
│ Spring Boot          │
│ Spring Web MVC       │
└──────────┬───────────┘
           │
           │ JPA
           ▼
┌──────────────────────┐
│     BANCO DE DADOS   │
│                      │
│ H2                   │
└──────────────────────┘

⸻

📡 API

O Backend disponibiliza endpoints REST para que o Frontend possa realizar operações relacionadas ao estoque.

Exemplos de operações:

GET     /produtos
GET     /produtos/{id}
POST    /produtos
PUT     /produtos/{id}
DELETE  /produtos/{id}

Os endpoints podem sofrer alterações conforme a evolução do projeto.

⸻

📦 Funcionalidades

O sistema está sendo desenvolvido para oferecer funcionalidades relacionadas ao gerenciamento de estoque.

Produtos

* 📋 Listagem de produtos
* ➕ Cadastro de produtos
* 🔎 Consulta de produtos
* ✏️ Edição de produtos
* 🗑️ Exclusão de produtos
* 📊 Controle de estoque

Interface

* 🎨 Interface moderna
* 📱 Layout responsivo
* 🧭 Navegação entre páginas
* 🔍 Busca e consulta de informações
* ⚡ Comunicação com API REST
* ✅ Validação de dados

Novas funcionalidades serão adicionadas durante o desenvolvimento.

⸻

📁 Estrutura do projeto

Como o Frontend e o Backend estão no mesmo repositório, a estrutura segue a organização abaixo:

dispensa-digital/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── ...
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── ...
│
├── backend/
│   │
│   ├── src/
│   │   ├── main/
│   │   │   └── java/
│   │   └── test/
│   │
│   ├── pom.xml
│   └── ...
│
├── README.md
└── .gitignore

⸻

🔐 Variáveis de ambiente

Informações sensíveis, como credenciais, URLs específicas e configurações de ambiente, não devem ser armazenadas diretamente no código.

No Frontend, as configurações podem ser definidas através de um arquivo .env.

Exemplo:

VITE_API_URL=http://localhost:8080

Arquivos .env contendo informações sensíveis não devem ser enviados para o GitHub.

⸻

🧪 Qualidade do código

O projeto utiliza ferramentas para manter a qualidade, organização e padronização do código.

Frontend

ESLint

npm run lint

TypeScript + Vite

npm run build

Prettier

Utilizado para manter a padronização da formatação dos arquivos.

Backend

O Backend utiliza:

* Spring Validation
* Spring Data JPA
* Testes automatizados
* Maven
* MapStruct

⸻

👥 Equipe

Desenvolvedor	Responsabilidade	GitHub
Dennys Fernandes	Frontend	@fernandesdennys
Guilherme Marrafon	Backend	@Marrafon91

⸻

🧑‍💻 Responsabilidades

Dennys Fernandes — Frontend

Responsável pelo desenvolvimento da interface e experiência do usuário, incluindo:

* Desenvolvimento das telas
* Componentização com React
* Estilização com Tailwind CSS
* Navegação com React Router
* Integração com a API através do Axios
* Tipagem com TypeScript
* Validação de dados
* Organização da estrutura do Frontend

Guilherme Marrafon — Backend

Responsável pelo desenvolvimento da API e infraestrutura do Backend, incluindo:

* Desenvolvimento da API REST
* Regras de negócio
* Persistência dos dados
* Integração com banco de dados
* Spring Data JPA
* Validação dos dados
* Desenvolvimento dos endpoints
* Organização da estrutura do Backend

⸻

🌱 Fluxo de desenvolvimento

O desenvolvimento da aplicação segue a comunicação entre as duas camadas:

1. Usuário interage com a interface
                ↓
2. Frontend recebe a ação
                ↓
3. Frontend realiza uma requisição HTTP
                ↓
4. Backend recebe a requisição
                ↓
5. Backend processa a regra de negócio
                ↓
6. Backend acessa o banco de dados
                ↓
7. Backend retorna uma resposta
                ↓
8. Frontend recebe os dados
                ↓
9. Interface é atualizada

⸻

📌 Status do projeto

🚧 Em desenvolvimento

A Dispensa Digital está em desenvolvimento e novas funcionalidades, melhorias de interface e aprimoramentos na API serão adicionados ao projeto.

⸻

🎯 Objetivo do projeto

O objetivo da Dispensa Digital é desenvolver uma aplicação completa de gerenciamento de estoque, utilizando tecnologias modernas de desenvolvimento web e aplicando boas práticas de programação.

O projeto também busca proporcionar experiência prática com:

* Desenvolvimento Frontend
* Desenvolvimento Backend
* APIs REST
* Banco de dados
* Arquitetura de aplicações
* Integração entre sistemas
* TypeScript
* Java
* Spring Boot
* React
* Git e GitHub

⸻

📚 Tecnologias do projeto

Frontend

Backend

⸻

📄 Licença

Este projeto está atualmente em desenvolvimento.

Mais informações sobre a licença serão adicionadas posteriormente.

⸻

⭐ Desenvolvido por

Dennys Fernandes & Guilherme Marrafon

Projeto Dispensa Digital — Controle e gerenciamento de estoque.