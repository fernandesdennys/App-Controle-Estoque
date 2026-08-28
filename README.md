📦 Dispensa Digital

Sistema web para controle e gerenciamento de estoque, desenvolvido com React + TypeScript no Frontend e Java + Spring Boot no Backend.

O objetivo do projeto é oferecer uma solução simples, moderna e organizada para gerenciamento de produtos e controle de estoque.

⸻

🚀 Sobre o projeto

A Dispensa Digital é uma aplicação web desenvolvida para facilitar o gerenciamento de produtos e o controle de estoque.

O projeto possui Frontend e Backend no mesmo repositório, com responsabilidades divididas entre os desenvolvedores.

🏗️ Arquitetura

                    DISPENSA DIGITAL
                          │
             ┌────────────┴────────────┐
             │                         │
             ▼                         ▼
       🎨 FRONTEND                ⚙️ BACKEND
       Dennys Fernandes           Guilherme Marrafon
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

GitHub: @fernandesdennys

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

📦 Principais versões

Tecnologia	Versão
React	19.2.8
React DOM	19.2.8
TypeScript	6.0.2
Vite	8.2.2
Tailwind CSS	4.3.3
Axios	1.19.0
React Router DOM	7.18.2
React Icons	5.7.0
Zod	4.4.3

▶️ Executando o Frontend

Instale as dependências:

npm install

Execute o projeto:

npm run dev

O Vite exibirá no terminal o endereço para acessar a aplicação.

Normalmente:

http://localhost:5173

📋 Scripts disponíveis

Comando	Descrição
npm run dev	Inicia o servidor de desenvolvimento
npm run build	Compila o projeto para produção
npm run lint	Executa o ESLint
npm run preview	Executa uma prévia da aplicação

⸻

⚙️ Backend

O Backend é responsável pela API da aplicação, regras de negócio, validações, persistência dos dados e comunicação com o banco de dados.

👨‍💻 Responsável

Guilherme Marrafon

GitHub: @Marrafon91

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

📦 Principais versões

Tecnologia	Versão
Java	25
Spring Boot	4.1.0
MapStruct	1.6.3
Spring Dotenv	4.0.0
H2 Database	Runtime
Maven	Wrapper

▶️ Executando o Backend

No Linux/macOS:

./mvnw spring-boot:run

No Windows:

mvnw.cmd spring-boot:run

Por padrão, o Spring Boot utiliza:

http://localhost:8080

⸻

🔄 Comunicação entre Frontend e Backend

A comunicação entre as duas partes acontece através de uma API REST.

O Frontend utiliza o Axios para realizar requisições HTTP para o Backend.

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

Exemplos:

Método	Endpoint	Função
GET	/produtos	Lista os produtos
GET	/produtos/{id}	Busca um produto
POST	/produtos	Cadastra um produto
PUT	/produtos/{id}	Atualiza um produto
DELETE	/produtos/{id}	Remove um produto

Os endpoints podem sofrer alterações conforme a evolução do projeto.

⸻

📦 Funcionalidades

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

Frontend e Backend estão presentes no mesmo repositório.

dispensa-digital/
│
├── frontend/
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
│   └── ...
│
├── backend/
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

Informações sensíveis, como credenciais e configurações específicas de ambiente, não devem ser armazenadas diretamente no código.

No Frontend, pode ser utilizado um arquivo .env.

Exemplo:

VITE_API_URL=http://localhost:8080

Arquivos .env contendo informações sensíveis não devem ser enviados para o GitHub.

⸻

🧪 Qualidade do código

O projeto utiliza ferramentas para manter a qualidade e padronização do código.

Frontend

ESLint

npm run lint

Build

npm run build

Prettier

Utilizado para manter a padronização da formatação do código.

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

Responsável pelo desenvolvimento da interface e experiência do usuário.

Principais responsabilidades:

* Desenvolvimento das telas
* Componentização com React
* Estilização com Tailwind CSS
* Navegação com React Router
* Integração com a API através do Axios
* Tipagem com TypeScript
* Validação de dados
* Organização da estrutura do Frontend

Guilherme Marrafon — Backend

Responsável pelo desenvolvimento da API e infraestrutura do Backend.

Principais responsabilidades:

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

Usuário
   │
   ▼
Interface React
   │
   │ Requisição HTTP
   ▼
Axios
   │
   ▼
API REST
   │
   ▼
Spring Boot
   │
   ▼
Regras de negócio
   │
   ▼
Spring Data JPA
   │
   ▼
Banco de dados
   │
   ▼
Resposta da API
   │
   ▼
Frontend
   │
   ▼
Interface atualizada

⸻

📌 Status do projeto

🚧 Em desenvolvimento

A Dispensa Digital está em desenvolvimento. Novas funcionalidades, melhorias de interface e aprimoramentos na API serão adicionados ao longo do projeto.

⸻

🎯 Objetivo

O objetivo da Dispensa Digital é desenvolver uma aplicação completa de gerenciamento de estoque utilizando tecnologias modernas e boas práticas de desenvolvimento.

O projeto proporciona experiência prática com:

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

💻 Tecnologias utilizadas

Frontend

Backend

⸻

📄 Licença

Este projeto está atualmente em desenvolvimento.

Mais informações sobre a licença serão adicionadas posteriormente.

⸻

⭐ Desenvolvido por

Dennys Fernandes & Guilherme Marrafon

Dispensa Digital
Sistema de controle e gerenciamento de estoque.