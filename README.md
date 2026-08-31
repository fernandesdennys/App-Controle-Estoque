# 📦 Dispensa Digital (StockHouse)

Sistema de controle de estoque doméstico — cadastre produtos, acompanhe níveis mínimos, registre entradas e saídas e gere automaticamente a sua lista de compras.

## 👥 Autores

Projeto desenvolvido em dupla:

| Nome | Papel | GitHub |
|---|---|---|
| **Dennys Fernandes** | Front-end | [@fernandesdennys](https://github.com/fernandesdennys) |
| **Guilherme Marrafon** | Back-end | [@Marrafon91](https://github.com/Marrafon91) |

## ✨ Funcionalidades

- 🔐 **Autenticação** — tela de login com validação de formulário (Zod) e integração via token JWT
- 🏠 **Dashboard** com visão geral do estoque e produtos que precisam de atenção
- 📦 **Controle de estoque** — cadastro de produtos, categorias, quantidade atual, ideal e mínima
- 🔍 **Busca e filtro** por categoria
- 🔄 **Registro de entradas e saídas** de produtos
- 🛒 **Lista de compras** gerada a partir dos itens em falta ou com estoque baixo
- 📊 **Indicadores visuais** de status (normal, baixo, esgotado)

## 🛠️ Tecnologias

### Front-end

- [React 19.2](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite 8](https://vite.dev/)
- [Tailwind CSS 4.3](https://tailwindcss.com/)
- [React Router 7.18](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [Zod](https://zod.dev/)
- [React Icons](https://react-icons.github.io/react-icons/)

### Back-end

- [Java 25](https://openjdk.org/)
- [Spring Boot 4.1](https://spring.io/projects/spring-boot)
- Spring Web MVC
- Spring Data JPA
- Spring Validation
- Spring Security + JWT ([jjwt](https://github.com/jwtk/jjwt)) — autenticação
- [MapStruct](https://mapstruct.org/) — mapeamento de DTOs
- [H2 Database](https://www.h2database.com/) + H2 Console — banco em memória para desenvolvimento
- [spring-dotenv](https://github.com/paulschwarz/spring-dotenv) — variáveis de ambiente via `.env`

## 🚀 Como executar

### Front-end

```bash
cd frontend
npm install
```

Crie um arquivo `.env` na pasta `frontend` com a URL do back-end:

```dotenv
VITE_API_URL=http://localhost:8080
```

Depois rode:

```bash
npm run dev
```

### Back-end

Crie um arquivo `.env` na pasta `backend` com as variáveis necessárias (ex.: credenciais do banco e segredo do JWT), e então rode:

```bash
cd backend
./mvnw spring-boot:run
```

O console do H2 fica disponível, por padrão, em `http://localhost:8080/h2-console`.

## 📄 Licença

Este projeto está sob a licença MIT.
