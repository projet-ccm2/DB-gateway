# DB-Gateway

Gateway between backend services and the project database (MySQL). This service exposes REST HTTP routes and receives JSON payloads to interact with the database.

---

## API Documentation (Swagger-style)

Detailed documentation for each HTTP route is in the **[`doc/`](./doc/)** folder:

- **[Route index](./doc/README.md)** — list of all routes with links to each resource
- [Health](./doc/health.md)
- [Users](./doc/users.md)
- [Channels](./doc/channels.md)
- [Type Achievements](./doc/type-achievements.md)
- [Achievements](./doc/achievements.md)
- [Badges](./doc/badges.md)
- [Achieved](./doc/achieved.md)
- [Are](./doc/are.md)
- [Possesses](./doc/possesses.md)

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and **running** (for DB and integration tests)
- Node.js ≥ 20.x
- npm ≥ 9.x

---

## Quick Start

**Install dependencies**

```bash
npm install
```

**Start the database** (optional, for local run or integration tests)

```bash
npm run dev:db
```

**Run tests**

```bash
npm test
```

- **Unit tests** (`npm run test:unit`): use in-memory mocks, no Docker required.
- **Integration tests** (`npm run test:integration`): use MySQL via Testcontainers; Docker must be running.

**Start the server**

```bash
npm run server:start
```

API is available at `http://localhost:3000` (or the `PORT` from your environment).

---

## Useful commands

| Command                      | Description                                                             |
| ---------------------------- | ----------------------------------------------------------------------- |
| `npm run dev`                | Start DB container then run the app (`npm run dev:db && npm run start`) |
| `npm run dev:db`             | Start MySQL container (see `docker-compose.yml`)                        |
| `npm run dev:db:down`        | Stop and remove the DB container and volumes                            |
| `npm run build`              | Compile TypeScript to `dist/`                                           |
| `npm start`                  | Run compiled app (`node dist/index.js`)                                 |
| `npm run server:start`       | Run app with ts-node (`ts-node src/index.ts`)                           |
| `npm test`                   | Run unit then integration tests                                         |
| `npm run test:unit`          | Unit tests only (no Docker)                                             |
| `npm run test:integration`   | Integration tests only (Docker required)                                |
| `npm run test:coverage`      | Unit tests with coverage report (≥80% enforced)                         |
| `npm run test:coverage:full` | All tests with coverage                                                 |
| `npm run prisma:gen`         | Generate Prisma client                                                  |
| `npx prisma db push`         | Push schema to the database                                             |
| `npm run prettier`           | Format code                                                             |
| `npx eslint src --fix`       | Lint and fix (run on `src/`, not `dist/`)                               |

---

## Accessing the database

With the container running (`npm run dev:db`):

- **Host:** `localhost`
- **Port:** `3306`
- **Database / user / password:** see your `.env` (or `docker-compose.yml` and `mysql/init_Schema.sql`).

Example with MySQL CLI:

```bash
docker exec -it mysql_db_gateway mysql -u root -p
```

---

## Project structure

```
src/
├── config/
│   └── environment.ts       # Config (port, databaseUrl, cors)
├── controllers/             # HTTP handlers (one per resource)
│   ├── helpers.ts           # HTTP constants, paramId, queryString, sendInternalError
│   ├── healthController.ts
│   ├── usersController.ts
│   └── ...                  # achieved, achievements, are, badges, channels, possesses, typeAchievements
├── database/
│   ├── database.ts         # Database interface + DTOs
│   └── prismaDatabase.ts   # Prisma implementation (MySQL)
├── handler/                 # JSON message handler (e.g. for non-HTTP transport)
│   ├── actions/            # Per-resource action handlers
│   ├── types/
│   ├── jsonHandler.ts
│   └── payload.ts
├── index.ts                 # Entry point: createPrismaGateway, createApp(db), main()
├── repositories/           # One per entity (user, channel, achievement, badge, achieved, are, possesses, typeAchievement)
├── routes/                 # Express routers (mountRoutes in index.ts)
│   ├── index.ts             # mountRoutes(app, db)
│   ├── healthRoutes.ts
│   ├── usersRoutes.ts
│   └── ...
├── services/
│   └── userService.ts
├── tests/
│   ├── mocks/               # MockDatabase (used only by tests)
│   │   ├── mockDatabase.ts
│   │   └── index.ts         # createMockGateway()
│   ├── unit/                # Mirror of src/ (config, controllers, database, handler, index, repositories, routes, services, utils)
│   └── integration/         # *.integ.test.ts (Testcontainers + MySQL)
└── utils/
    └── logger.ts

prisma/
└── schema.prisma            # Prisma schema (aligned with mysql/init_Schema.sql)

doc/                         # API documentation (Markdown, Swagger-style)
├── README.md
├── health.md
├── users.md
└── ...
```

**Flow:** `index.ts` creates the app and calls `mountRoutes(app, db)`. Each route file (e.g. `usersRoutes.ts`) receives `db`, builds the needed repositories and controller, and returns an Express router. There is no separate `server.ts`; the app is created in `index.ts`. The mock database lives in `src/tests/mocks/` and is used only by tests.

---

## Adding a new resource

1. **Repository** (if needed): e.g. `src/repositories/myRepository.ts` that takes `Database` and exposes methods.
2. **Controller**: e.g. `src/controllers/myController.ts` with `createMyController(repo: MyRepository)` returning handlers.
3. **Routes**: e.g. `src/routes/myRoutes.ts` with `createMyRoutes(db: Database)` that instantiates the repository, controller, and returns `express.Router()`.
4. **Mount**: In `src/routes/index.ts`, add `app.use("/my-path", createMyRoutes(db));`
5. **Tests**: Add unit tests under `src/tests/unit/` (mirror path) and, if needed, integration tests in `src/tests/integration/`.
6. **Docs**: Add or update the corresponding file in `doc/` and the route index in `doc/README.md`.

See existing resources (e.g. users, channels) for the same pattern.

---

## Testing and quality

- **Unit tests:** Use `MockDatabase` from `src/tests/mocks` (no Docker). Run with `npm run test:unit`.
- **Integration tests:** Use real MySQL via Testcontainers. Run with `npm run test:integration` (Docker required).
- **Coverage:** Minimum 80% (statements, branches, functions, lines) enforced for unit tests. Run `npm run test:coverage`.

---

## Troubleshooting

**Tests fail**

- Run `npm run build` to ensure TypeScript compiles.
- Unit tests do not need Docker. Integration tests need Docker running.

**Database connection**

- Ensure the container is running: `docker ps` (e.g. `mysql_db_gateway`).
- Stop and recreate: `npm run dev:db:down` then `npm run dev:db`.

**Prisma**

- Run `npm run prisma:gen` after changing the schema.
- Ensure `prisma.config.ts` and `DATABASE_URL` (e.g. in `.env`) are correct for your environment.

---

## References

- **Refactoring notes:** [REFACTORING.md](./REFACTORING.md) — summary of architecture and changes.
- **API details:** see the [doc/](./doc/) folder.

---

_Maintainer: Léo Lomel — Project StreamQuest, DB Gateway Service_
