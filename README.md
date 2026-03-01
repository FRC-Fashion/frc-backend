<div align="center">
  <h1>🚀 Polyglot NestJS General Boilerplate</h1>
  <p>A robust, scalable, and enterprise-ready backend boilerplate powered by NestJS v11 and a polyglot data stack.</p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/NestJS-v11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm">
    <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
    <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma">
    <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis">
    <img src="https://img.shields.io/badge/Neo4j-018BFF?style=for-the-badge&logo=neo4j&logoColor=white" alt="Neo4j">
    <img src="https://img.shields.io/badge/Elasticsearch-005571?style=for-the-badge&logo=elasticsearch&logoColor=white" alt="Elasticsearch">
    <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  </p>
</div>

<br />

## 📖 Overview

This is a high-performance, general-purpose backend boilerplate designed to accelerate development for complex applications. By leveraging a polyglot architecture, it ensures the right database technology is used for specific data access patterns (Relational, Graph, Search, Key-Value/Caching). Containerized with Docker Compose, it provides an out-of-the-box infrastructure setup perfect for production scalability.

---

## 🛠️ Tech Stack Table

| Technology                                                                       | Purpose                                                                              |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **[NestJS (v11)](https://nestjs.com/)**                                          | Core backend framework for building scalable server-side applications.               |
| **[TypeScript](https://www.typescriptlang.org/)**                                | Strongly-typed programming language.                                                 |
| **[pnpm](https://pnpm.io/)**                                                     | Fast, disk space efficient package manager.                                          |
| **[PostgreSQL](https://www.postgresql.org/) & [Prisma](https://www.prisma.io/)** | Primary relational database alongside Prisma as the modern ORM.                      |
| **[Redis](https://redis.io/)**                                                   | High-performance caching layer and message broker for queues.                        |
| **[Neo4j](https://neo4j.com/)**                                                  | Graph database optimized for highly connected data and complex relationship queries. |
| **[Elasticsearch](https://www.elastic.co/)**                                     | Distributed search and analytics engine for advanced full-text search.               |
| **[Winston](https://github.com/winstonjs/winston)**                              | Advanced structured logging system with daily file rotation.                         |
| **[Docker Compose](https://docs.docker.com/compose/)**                           | Container orchestration for unified local infrastructure deployment.                 |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (v18 or higher recommended)
- **pnpm** (`npm install -g pnpm`)
- **Docker** & **Docker Compose**

---

## 🚀 Getting Started

Follow these step-by-step instructions to get the project up and running locally:

**1. Clone the repository:**

```bash
git clone https://github.com/omar-elnady/nest-poly-stack-starter
cd nest-poly-stack-starter
```

**2. Install dependencies using pnpm:**

```bash
pnpm install
```

**3. Setup environment variables:**

```bash
cp .env.example .env
```

_(Make sure to update the `.env` file with any necessary distinct credentials for your local setup)_

**4. Spin up the infrastructure (Databases, Cache, SearchEngine):**

```bash
docker compose up -d
```

**5. Apply database migrations (Prisma):**

```bash
pnpm prisma migrate dev
```

**6. Start the development server:**

```bash
pnpm start:dev
```

The application should now be running locally, typically on `http://localhost:3000`.

---

## 📂 Project Structure

A clean, modular architectural representation of the `src/` directory:

```text
src/
├── common/             # Global guards, interceptors, decorators, and filters
├── config/             # Application configuration and environment variables
├── modules/            # Domain-specific feature modules
│   ├── auth/           # Authentication and authorization logic
│   ├── users/          # User management utilizing PostgreSQL
│   ├── graph/          # Modules interacting with Neo4j
│   └── search/         # Modules integrating with Elasticsearch
├── providers/          # Third-party integrations & database connections
│   ├── prisma/         # Prisma service and schemas
│   ├── redis/          # Redis caching and queue configurations
│   ├── neo4j/          # Neo4j driver configurations
│   └── elasticsearch/  # Elasticsearch client configurations
├── utils/              # Helper functions and utilities
│   └── logger/         # Winston logger configuration
├── app.module.ts       # Root module of the application
└── main.ts             # Application entry point
```

---

## 📝 Logging System

This project is configured with a robust custom logger leveraging **Winston**.

- **Console Logging:** During development, Winston outputs colorful, aesthetically pleasing, formatted logs to the console for real-time tracking of requests, queries, and errors.
- **File Logging (Daily Rotate):** Using the `winston-daily-rotate-file` transport, logs are automatically persisted gracefully to the `/logs` directory at the project root. Logs are typically separated into:
  - `error-%DATE%.log`: Exclusive collection for error tracking.
  - `combined-%DATE%.log`: Full aggregation of all log levels (info, warn, error).

Old log files are automatically compressed or deleted based on standard retention configurations, ensuring optimal disk space usage.

---

## 🔒 License

This project is **UNLICENSED / Private**. All rights reserved. Do not distribute, modify, or copy without explicit permission from the original author.

<div align="center">

# FRC — Fashion & Retail Community

### Professional Networking Platform for Fashion & Retail

[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)
[![Neo4j](https://img.shields.io/badge/Neo4j-5-4581C3?style=flat-square&logo=neo4j&logoColor=white)](https://neo4j.com/)
[![License](https://img.shields.io/badge/License-UNLICENSED-red?style=flat-square)]()

_A full-featured professional networking and social platform built for the Fashion & Retail industry in the MENA region, with a global expansion roadmap._

</div>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Environment Configuration](#3-environment-configuration)
  - [4. Database Setup](#4-database-setup)
  - [5. Run the Application](#5-run-the-application)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [API Overview](#api-overview)
- [Testing](#testing)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**FRC** (Fashion & Retail Community) is an all-in-one professional networking platform purpose-built for the fashion and retail sector. It brings together everything a professional or company needs in one place — from building a professional network and discovering job opportunities, to publishing content and running targeted advertising.

The platform serves **three user segments:**

| Segment           | Description                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------- |
| **Professionals** | Individuals building their career presence, networking, and seeking opportunities        |
| **Companies**     | Brand representatives posting jobs, building employer brand pages, and recruiting talent |
| **Admins**        | Platform administrators managing operations, moderation, and analytics                   |

---

## Key Features

**Authentication & Security**

- Email/password registration with email verification
- OAuth 2.0 (Google, LinkedIn, Facebook)
- Multi-Factor Authentication (MFA)
- JWT access & refresh token rotation

**Professional Profiles**

- Comprehensive profile with experience, education, and skills
- CV/resume upload and management
- Profile visibility controls

**Social Networking**

- Connection requests and relationship management
- "People You May Know" powered by graph-based recommendations (Neo4j)
- Professional network visualization

**Content & Feed**

- Rich media posts (images, videos, documents)
- Like, comment, and share interactions
- Algorithmically ranked feed

**Jobs & Recruitment**

- Job posting with detailed role descriptions
- Application tracking system
- Advanced job search with filters

**Real-Time Communication**

- Direct messaging (WebSocket / Socket.IO)
- Real-time notifications
- Online presence indicators

**Search & Discovery**

- Full-text search across profiles, jobs, and content
- Arabic + English language support (Elasticsearch)
- Advanced filters and faceted search

**Internationalization**

- Full Arabic (RTL) and English support from day one
- Locale-aware content delivery

---

## Tech Stack

### Core

| Technology                                | Version | Purpose               |
| ----------------------------------------- | ------- | --------------------- |
| [Node.js](https://nodejs.org/)            | 20 LTS  | Runtime               |
| [NestJS](https://nestjs.com/)             | 11      | Application framework |
| [TypeScript](https://typescriptlang.org/) | 5.7     | Language              |
| [pnpm](https://pnpm.io/)                  | 9+      | Package manager       |

### Data Layer

| Technology                            | Purpose                                              |
| ------------------------------------- | ---------------------------------------------------- |
| [PostgreSQL](https://postgresql.org/) | Primary relational database                          |
| [Prisma](https://prisma.io/)          | ORM — type-safe database access, migrations, seeding |
| [Neo4j](https://neo4j.com/)           | Graph database — social connections, recommendations |
| [Redis](https://redis.io/)            | Caching, session store, Bull queue backend, pub/sub  |
| [Elasticsearch](https://elastic.co/)  | Full-text search with Arabic language analyzer       |

### Infrastructure

| Technology                                            | Purpose                           |
| ----------------------------------------------------- | --------------------------------- |
| [Docker](https://docker.com/)                         | Containerization                  |
| [AWS ECS Fargate](https://aws.amazon.com/fargate/)    | Production hosting                |
| [GitHub Actions](https://github.com/features/actions) | CI/CD pipelines                   |
| [Bull](https://github.com/OptimalBits/bull)           | Background job processing         |
| [Socket.IO](https://socket.io/)                       | Real-time WebSocket communication |
| [Passport](https://passportjs.org/)                   | Authentication strategies         |

---

## Prerequisites

Ensure the following are installed on your machine before proceeding:

| Tool                    | Version | Installation                                           |
| ----------------------- | ------- | ------------------------------------------------------ |
| **Node.js**             | ≥ 20.x  | [Download](https://nodejs.org/)                        |
| **pnpm**                | ≥ 9.x   | `npm install -g pnpm`                                  |
| **PostgreSQL**          | ≥ 16.x  | [Download](https://postgresql.org/download/)           |
| **Redis**               | ≥ 7.x   | [Download](https://redis.io/download/)                 |
| **Neo4j**               | ≥ 5.x   | [Download](https://neo4j.com/download/)                |
| **Elasticsearch**       | ≥ 8.x   | [Download](https://elastic.co/downloads/elasticsearch) |
| **Docker** _(optional)_ | ≥ 24.x  | [Download](https://docker.com/get-started/)            |

> **Tip:** If you prefer Docker, all infrastructure services (PostgreSQL, Redis, Neo4j, Elasticsearch) can be started with a single `docker-compose up` command. See [Database Setup](#4-database-setup).

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/frc-backend.git
cd frc-backend
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and configure each variable. See [`.env.example`](.env.example) for descriptions of every variable.

### 4. Database Setup

**Option A — Using Docker (recommended for local development):**

```bash
docker compose -f docker/docker-compose.yml up -d
```

This starts PostgreSQL, Redis, Neo4j, and Elasticsearch containers pre-configured for local development.

**Option B — Manual setup:**

Ensure all services are running locally, then update `DATABASE_URL`, `REDIS_HOST`, `NEO4J_URI`, and `ELASTICSEARCH_NODE` in your `.env` file.

**Run Prisma migrations and generate the client:**

```bash
pnpm prisma migrate dev
pnpm prisma generate
```

**Seed the database (optional):**

```bash
pnpm prisma db seed
```

### 5. Run the Application

```bash
# Development (watch mode with hot reload)
pnpm start:dev

# Debug mode (attach your IDE debugger)
pnpm start:debug

# Production mode
pnpm build
pnpm start:prod
```

The server will be available at `http://localhost:3000` by default.

---

## Available Scripts

| Command            | Description                         |
| ------------------ | ----------------------------------- |
| `pnpm start:dev`   | Start in watch mode with hot reload |
| `pnpm start:debug` | Start in debug mode with inspector  |
| `pnpm start:prod`  | Run the compiled production build   |
| `pnpm build`       | Compile TypeScript to `dist/`       |
| `pnpm test`        | Run unit tests                      |
| `pnpm test:watch`  | Run tests in watch mode             |
| `pnpm test:cov`    | Run tests with coverage report      |
| `pnpm test:e2e`    | Run end-to-end tests                |
| `pnpm lint`        | Lint source files and auto-fix      |
| `pnpm format`      | Format code with Prettier           |

---

## Project Structure

```
frc-backend/
├── prisma/                  # Database schema, migrations
├── docker/                  # Docker & compose files
├── scripts/                 # Utility scripts (seed, key generation)
├── workers/                 # Background job processors
├── test/                    # E2E tests
├── .github/                 # CI/CD workflows, templates
└── src/
    ├── common/              # Shared code — guards, filters, decorators, pipes, utils
    ├── core/                # Infrastructure — config, database, logger, health
    └── modules/             # Feature modules — auth, users, jobs, feed, chat, etc.
```

> For the complete detailed breakdown of every folder and file, see [`ARCHITECTURE.md`](ARCHITECTURE.md).

---

## API Overview

All API endpoints are prefixed with `/api/v1` (configurable).

### Authentication

| Method | Endpoint         | Description                 |
| ------ | ---------------- | --------------------------- |
| `POST` | `/auth/register` | Register a new account      |
| `POST` | `/auth/login`    | Login with email & password |
| `POST` | `/auth/refresh`  | Refresh access token        |
| `POST` | `/auth/logout`   | Invalidate current session  |

### Users

| Method   | Endpoint     | Description                 |
| -------- | ------------ | --------------------------- |
| `GET`    | `/users/me`  | Get current user profile    |
| `PATCH`  | `/users/me`  | Update current user profile |
| `GET`    | `/users/:id` | Get user by ID              |
| `DELETE` | `/users/:id` | Delete a user (admin)       |

> Full API documentation will be available via Swagger at `/api/docs` once implemented.

---

## Testing

```bash
# Unit tests
pnpm test

# Unit tests in watch mode
pnpm test:watch

# Test coverage report
pnpm test:cov

# End-to-end tests
pnpm test:e2e
```

Tests follow the NestJS conventions:

- **Unit tests:** Co-located with source files as `*.spec.ts`
- **E2E tests:** Located in the `test/` directory as `*.e2e-spec.ts`

---

## Deployment

### Production Build

```bash
pnpm build
```

The compiled output is written to `dist/`. Run in production:

```bash
node dist/main.js
```

### Docker

```bash
docker build -f docker/Dockerfile -t frc-backend .
docker run -p 3000:3000 --env-file .env frc-backend
```

### AWS ECS Fargate

The production environment runs on AWS ECS Fargate with:

- **Blue/Green deployments** for zero-downtime releases
- **GitHub Actions** CI/CD pipeline for automated build, test, and deploy
- **Auto-scaling** based on CPU/memory utilization

> CI/CD workflow files are located in `.github/workflows/`.

---

## Roadmap

### Phase 1 — MVP ✅ _(In Progress)_

- [x] Project scaffolding & architecture setup
- [ ] Authentication (email, Google, LinkedIn, Facebook + MFA)
- [ ] User profiles with CV upload
- [ ] Professional networking (connections)
- [ ] Notification system
- [ ] Advanced search (Elasticsearch)
- [ ] Job posting & applications
- [ ] Content feed (images, videos, documents)
- [ ] Real-time direct messaging
- [ ] Targeted advertising system
- [ ] Full Arabic & English i18n support

### Phase 2 — AI & Growth

- [ ] AI-powered content generation
- [ ] Intelligent job matching
- [ ] Automated content moderation
- [ ] Advanced SEO tooling
- [ ] Subscription plans & pricing tiers

### Phase 3 — Enterprise

- [ ] Admin dashboard & analytics
- [ ] CRM/ERP integrations
- [ ] Multiple payment gateway support
- [ ] Advanced reporting & insights

---

## Contributing

1. Create a feature branch from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Follow the existing code conventions and module structure.

3. Write tests for any new functionality.

4. Ensure linting and tests pass:

   ```bash
   pnpm lint
   pnpm test
   ```

5. Open a Pull Request with a clear description of changes.

---

## License

This project is **UNLICENSED** — proprietary and confidential.

Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.
