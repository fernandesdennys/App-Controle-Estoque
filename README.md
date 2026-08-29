# 📦 Dispensa Digital (StockHouse)

Sistema de controle de estoque doméstico — cadastre produtos, acompanhe níveis mínimos, registre entradas e saídas e gere automaticamente a sua lista de compras.

## 👥 Autores

Projeto desenvolvido em dupla:

| Nome | Papel | GitHub |
|---|---|---|
| **Dennys Fernandes** | Front-end | [@fernandesdennys](https://github.com/fernandesdennys) |
| **Guilherme Marrafon** | Back-end | [@Marrafon91](https://github.com/Marrafon91) |

## ✨ Funcionalidades

- 🏠 **Dashboard** com visão geral do estoque e produtos que precisam de atenção
- 📦 **Controle de estoque** — cadastro de produtos, categorias, quantidade atual, ideal e mínima
- 🔍 **Busca e filtro** por categoria
- 🔄 **Registro de entradas e saídas** de produtos
- 🛒 **Lista de compras** gerada a partir dos itens em falta ou com estoque baixo
- 📊 **Indicadores visuais** de status (normal, baixo, esgotado)

## 🛠️ Tecnologias

### Front-end
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [Zod](https://zod.dev/)

### Back-end
- [Java 25](https://openjdk.org/)
- [Spring Boot 4.1](https://spring.io/projects/spring-boot)
- Spring Data JPA
- Spring Validation
- [MapStruct](https://mapstruct.org/)
- [H2 Database](https://www.h2database.com/)

## 🚀 Como executar

### Front-end
```bash
cd frontend
npm install
npm run dev
```

### Back-end
```bash
cd backend
./mvnw spring-boot:run
```

## 📄 Licença

Este projeto está sob a licença MIT.
