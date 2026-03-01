# Architecture

> A comprehensive guide to the **FRC (Fashion & Retail Community)** backend structure, conventions, and design decisions.
>
> For project overview, setup, and feature details, see [`README.md`](README.md).

---

## Tech Stack

| Technology          | Purpose                                 |
| ------------------- | --------------------------------------- |
| **NestJS**          | Application framework                   |
| **TypeScript**      | Language                                |
| **Prisma**          | ORM — PostgreSQL                        |
| **Neo4j**           | Graph database                          |
| **Redis / ioredis** | Caching, sessions, pub/sub              |
| **Bull**            | Background job queues (backed by Redis) |
| **Passport + JWT**  | Authentication                          |
| **Socket.IO**       | Real-time WebSocket communication       |
| **Elasticsearch**   | Full-text search                        |
| **pnpm**            | Package manager                         |

---

## Project Structure

```
frc-backend/
│
│── .env                             # Environment variables (git-ignored)
│── .env.example                     # Template for required env vars
│── .prettierrc                      # Prettier formatting rules
│── eslint.config.mjs                # ESLint flat config
│── nest-cli.json                    # NestJS CLI configuration
│── tsconfig.json                    # TypeScript compiler options
│── tsconfig.build.json              # TypeScript build overrides
│── package.json                     # Dependencies & scripts
│── pnpm-lock.yaml                   # Lockfile
│── prisma.config.ts                 # Prisma CLI configuration
│── README.md                        # Project overview & setup instructions
│── ARCHITECTURE.md                  # ← You are here
│
├── prisma/
│   └── schema.prisma                # Database schema — models, relations, enums
│
├── docker/
│   └── ...                          # Dockerfile, docker-compose, .dockerignore
│
├── scripts/
│   └── ...                          # One-off utility scripts (seed, migrate, key generation)
│
├── test/
│   ├── app.e2e-spec.ts              # End-to-end test specs
│   └── jest-e2e.json                # Jest configuration for E2E tests
│
├── workers/
│   └── processors/                  # Bull queue job processors (run outside the main HTTP server)
│
├── .github/
│   └── ...                          # CI/CD workflows, PR templates, issue templates, dependabot
│
└── src/                             # ──── Application Source Code ────
    │
    ├── main.ts                      # Bootstrap — creates the NestJS app and starts listening
    ├── app.module.ts                # Root module — imports all core and feature modules
    ├── app.controller.ts            # Root controller (health-check / hello-world)
    ├── app.service.ts               # Root service
    ├── app.controller.spec.ts       # Unit test for root controller
    │
    ├── common/                      # ── Shared, Reusable, Stateless Code ──
    │   │
    │   ├── constants/               # App-wide constant values
    │   │                            #   e.g. error messages, regex patterns, role names,
    │   │                            #   pagination defaults, cache TTLs
    │   │
    │   ├── decorators/              # Custom parameter & method decorators
    │   │                            #   e.g. @CurrentUser() — extract user from request
    │   │                            #        @Roles('admin') — set allowed roles metadata
    │   │                            #        @Public() — skip JWT auth on a route
    │   │
    │   ├── dto/                     # Shared Data Transfer Objects
    │   │                            #   e.g. PaginationQueryDto, ApiResponseDto
    │   │
    │   ├── enums/                   # Shared enumerations
    │   │                            #   e.g. UserRole, AccountStatus, SortOrder
    │   │
    │   ├── filters/                 # Exception filters (global error handling)
    │   │                            #   e.g. HttpExceptionFilter — consistent error response shape
    │   │                            #        PrismaExceptionFilter — handle DB constraint errors
    │   │
    │   ├── guards/                  # Route guards (access control)
    │   │                            #   e.g. JwtAuthGuard — protect routes with JWT
    │   │                            #        RolesGuard — enforce role-based access
    │   │
    │   ├── interceptors/            # Request/response interceptors
    │   │                            #   e.g. TransformInterceptor — wrap responses in { success, data }
    │   │                            #        LoggingInterceptor — log request duration
    │   │                            #        TimeoutInterceptor — enforce request timeouts
    │   │
    │   ├── interfaces/              # Shared TypeScript interfaces
    │   │                            #   e.g. IJwtPayload, IPaginatedResult, IApiResponse
    │   │
    │   ├── middleware/              # NestJS middleware (runs before guards/interceptors)
    │   │                            #   e.g. RequestLoggerMiddleware, CorrelationIdMiddleware
    │   │
    │   ├── pipes/                   # Validation & transformation pipes
    │   │                            #   e.g. ValidationPipe config, TrimStringsPipe
    │   │
    │   ├── types/                   # TypeScript type aliases & utility types
    │   │                            #   e.g. Nullable<T>, RequestWithUser, AsyncResponse<T>
    │   │
    │   └── utils/                   # Pure helper functions (no NestJS dependencies)
    │                                #   e.g. hashPassword(), slugify(), generateOtp()
    │
    ├── core/                        # ── Infrastructure & Foundational Services ──
    │   │                            #    Imported once in AppModule as global modules.
    │   │                            #    Other modules should never re-import these.
    │   │
    │   ├── config/                  # Centralized configuration
    │   │                            #   ConfigModule wrapping @nestjs/config
    │   │                            #   Typed ConfigService, env validation (Joi / Zod)
    │   │                            #   Namespaced configs: database, jwt, redis, app
    │   │
    │   ├── database/                # Database connection layer
    │   │   ├── prisma/              #   PrismaModule + PrismaService
    │   │   │                        #   Extends PrismaClient, manages connection lifecycle
    │   │   ├── redis/               #   RedisModule + RedisService
    │   │   │                        #   Wraps ioredis — used for caching, Bull queues, pub/sub
    │   │   └── neo4j/               #   Neo4jModule + Neo4jService
    │   │                            #   Graph database driver — relationships, recommendations
    │   │
    │   ├── health/                  # Health check endpoint
    │   │                            #   GET /health — reports status of DB, Redis, Neo4j
    │   │                            #   Used by load balancers, Docker HEALTHCHECK, monitoring
    │   │
    │   └── logger/                  # Custom application logger
    │                                #   Wraps Winston or Pino for structured logging
    │                                #   Log levels, formatting, external log shipping
    │
    └── modules/                     # ── Feature Modules (Domain Logic) ──
        │                            #    Each module is self-contained with its own
        │                            #    controller, service, module, DTOs, and tests.
        │
        ├── auth/                    # Authentication & Authorization
        │   ├── auth.module.ts       #   Registers controller, service, strategies, guards
        │   ├── auth.controller.ts   #   POST /auth/login, /register, /refresh, /logout
        │   ├── auth.service.ts      #   validateUser, login, register, generateTokens
        │   ├── dto/
        │   │   ├── login.dto.ts     #   { email, password }
        │   │   └── register.dto.ts  #   { name, email, password, confirmPassword }
        │   └── strategies/
        │       └── jwt.strategy.ts  #   Passport JWT strategy — validates Bearer tokens
        │
        └── users/                   # User Management
            ├── users.module.ts      #   Registers controller, service; exports UsersService
            ├── users.controller.ts  #   GET /users/me, PATCH /users/me, GET /users/:id
            ├── users.service.ts     #   findById, findByEmail, create, update, delete
            └── dto/
                └── update-user.dto.ts  # { name?, bio?, avatar? }
```

---

## Architectural Layers

```
Request → Middleware → Guards → Interceptors (pre) → Pipes → Controller → Service → Database
                                                                                       │
Response ← Interceptors (post) ← Filters (on error) ←────────────────────────────────  ┘
```

| Layer       | Location       | Responsibility                                                                                                                               |
| ----------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Common**  | `src/common/`  | Reusable, stateless building blocks shared across all modules. No business logic.                                                            |
| **Core**    | `src/core/`    | Infrastructure services (database, config, logging). Registered once globally in `AppModule`.                                                |
| **Modules** | `src/modules/` | Feature-specific business logic. Each module owns its controllers, services, DTOs, and tests. Modules communicate through exported services. |
| **Workers** | `workers/`     | Background job processors. Decoupled from the HTTP lifecycle, consume jobs from Bull queues.                                                 |

---

## Module Conventions

Every feature module under `src/modules/<feature>/` follows this pattern:

```
<feature>/
├── <feature>.module.ts          # Module definition — imports, controllers, providers, exports
├── <feature>.controller.ts      # HTTP route handlers — thin layer, delegates to service
├── <feature>.service.ts         # Business logic — all domain rules live here
├── dto/                         # Data Transfer Objects — request validation
│   ├── create-<feature>.dto.ts
│   └── update-<feature>.dto.ts
├── entities/                    # (optional) response shape classes
├── strategies/                  # (optional) Passport strategies
└── <feature>.spec.ts            # (optional) unit tests
```

### Rules

1. **Controllers** are thin — they validate input, call the service, and return the result.
2. **Services** hold all business logic. Database interaction happens only inside services.
3. **DTOs** use `class-validator` decorators for automatic request validation.
4. **Modules** explicitly declare what they export. Other modules import the module, not individual services.

---

## Scripts Reference

| Command            | Description                       |
| ------------------ | --------------------------------- |
| `pnpm start:dev`   | Start in watch mode (development) |
| `pnpm start:debug` | Start with debugger attached      |
| `pnpm start:prod`  | Start production build            |
| `pnpm build`       | Compile TypeScript to `dist/`     |
| `pnpm test`        | Run unit tests                    |
| `pnpm test:e2e`    | Run end-to-end tests              |
| `pnpm test:cov`    | Run tests with coverage report    |
| `pnpm lint`        | Lint and auto-fix source files    |
| `pnpm format`      | Format code with Prettier         |
