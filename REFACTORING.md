# Refactoring — Changes and Guidelines

This document summarizes the changes made during the major refactoring of the DB-Gateway project and explains the rationale, with reusable guidelines.

---

## 1. Types and Banning `any`

### Changes

- **Controllers**: Handlers typed with Express `Request` and `Response`; error handling with `err: unknown` and `getErrorMessage(err)` (see `controllers/helpers.ts`).
- **`src/index.ts`**: `createApp(db: Database)`; no `any` at the gateway level.
- **`src/handler/jsonHandler.ts`**: `payload: any` and `msg: any` replaced by `Payload = Record<string, unknown>`, `JsonMessage`, and targeted type assertions in each handler. Explicit return type `JsonHandlerResult` (discriminated union).
- **`src/database/prismaDatabase.ts`**: Removed `(a: any)` / `(r: any)` in `.map()` calls; types are inferred by Prisma.
- **`src/database/mockDatabase.ts`**: Removed `(a: any)`; use of extended types (`achievementDTO & { channelId?: string }`) where needed.
- **`src/types/global.d.ts`**: `body?: any` → `body?: unknown`, `on: any` → typed `on` method.
- **Tests**: Replaced `as any` with precise types (`GatewayRepo`, `UserRepository`, mock interfaces in Prisma tests).

### Why

- `any` disables TypeScript checking and encourages production bugs. Strict typing improves maintainability and autocompletion.
- Use `unknown` for errors and untrusted data, then narrow with guards or explicit assertions.

### Guideline

- Project rule: **ban `any`** (ESLint `@typescript-eslint/no-explicit-any`). For complex mocks, prefer interfaces or `unknown` + targeted assertions.

---

## 2. Architecture: Gateway and Database

### Changes

- **`src/database/database.ts`**: Added `healthCheck(): Promise<boolean>` to the `Database` interface so Mock and Prisma share the same contract.
- **`src/index.ts`**: Exports `Gateway` type `{ db: Database }`, `createPrismaGateway()` (returns `{ db }` with `PrismaDatabase`), and `createApp(db: Database)` which creates the Express app and calls `mountRoutes(app, db)`.
- **`src/tests/mocks/index.ts`**: `createMockGateway()` returns `Gateway` with `db: MockDatabase` for tests (imports `Gateway` type from `index`).

### Why

- Single data entry point: `Database`. Routes receive `db` and build repositories then controllers per resource. The JSON handler uses `GatewayRepo` (nested repos) for potential alternate transport.

### Guideline

- For tests, use `createMockGateway()` from `src/tests/mocks`; for the server, use `createPrismaGateway()` and `createApp(db)` from `index`.

---

## 3. Controllers and Routes Layer

### Changes

- **`src/controllers/`**: Each controller receives **one** repository (e.g. `UserRepository`, `ChannelRepository`), not an aggregate.
  - **`helpers.ts`**: HTTP constants (BAD_REQUEST, NOT_FOUND, etc.), `paramId`, `queryString`, `getErrorMessage`, `sendInternalError`.
  - **`healthController.ts`**, **`usersController.ts`**, … **`possessesController.ts`**: Each file exports `createXController(repo: XRepository)` returning an object of handlers (e.g. `create`, `getById`, …).
- **`src/routes/`**: One resource = one route file.
  - **`index.ts`**: `mountRoutes(app, db)` registers routers under prefixes (`/health`, `/users`, `/channels`, …).
  - **`healthRoutes.ts`**, **`usersRoutes.ts`**, … **`possessesRoutes.ts`**: Each exports `createXxxRoutes(db: Database)` which creates the repository(ies), the controller, and returns an `express.Router()` with handlers mounted (e.g. `router.post("/", c.create)`).
- **`src/index.ts`**: `createApp(db)` creates the Express app and calls `mountRoutes(app, db)`. No separate `server.ts` file.

### Why

- Separating routes (wiring) and controllers (logic) keeps the code testable. Each route receives `db` and builds only the repos needed for its resource.

### Guideline

- For a new resource: add a repository if needed, a controller `createXController(repo)`, a file `createXxxRoutes(db)` that instantiates repo + controller, then a line `app.use("/path", createXxxRoutes(db))` in `mountRoutes`.

---

## 4. Single Entry Point (index)

### Changes

- **`src/index.ts`**: Single program entry point.
  - Exports `createPrismaGateway`, `createApp` (and `Gateway` type). `createMockGateway()` lives in `src/tests/mocks` for tests.
  - When the file is run directly (`require.main === module`), calls `main()`: create Prisma gateway, create app, `listen`, and handle SIGTERM (disconnect + close server).
- **`src/startServer.ts`**: Removed; its role is merged into `index.ts`.
- **`package.json`**: `"start": "node dist/index.js"`, `"server:start": "ts-node src/index.ts"`, `"test"` (unit + integration), `"test:unit"`, `"test:integration"`, `"test:coverage"`, `"test:coverage:full"`.

### Why

- A single file to run (index) avoids confusion. The build produces a single logical binary (`dist/index.js`).

### Guideline

- For tests, import `createApp` from `index` and `createMockGateway` from `src/tests/mocks` without running `main()`.

---

## 5. HTTP Routes (List)

### Changes

- Exposed routes (delegated to controllers):
  - **Health**: `GET /health`.
  - **Users**: `POST /users`, `GET /users/:id`, `GET /users/:id/channels`, `GET /users/:id/badges`, `GET /users/:id/achievements`.
  - **Channels**: `POST /channels`, `GET /channels/:id`, `GET /channels/:id/users`.
  - **Type achievements**: `POST /type-achievements`, `GET /type-achievements/:id`.
  - **Achievements**: `POST /achievements`, `GET /achievements/:id`, `GET /achievements/:id/users` (most specific route before `GET /achievements/:id`).
  - **Badges**: `POST /badges`, `GET /badges/:id`, `GET /badges/:id/users`.
  - **Achieved**: `POST /achieved`, `GET /achieved?achievementId=&userId=`.
  - **Are**: `POST /are`, `GET /are?userId=&channelId=`.
  - **Possesses**: `POST /possesses`, `GET /possesses?userId=&badgeId=`.

### Guideline

- Declare **most specific** routes before parameterized ones (e.g. `GET /achievements/:id/users` before `GET /achievements/:id`).

---

## 6. API Documentation (Swagger-style Markdown)

### Changes

- **`doc/README.md`**: Route index with links to each resource file.
- **`doc/*.md`**: One file per resource (health, users, channels, type-achievements, achievements, badges, achieved, are, possesses). Each file describes endpoints in Markdown (method, path, body, query, 2xx/4xx/5xx responses) in a Swagger-like style.
- **`README.md`** (root): New section “API Documentation (Swagger-style)” with link to `doc/` and list of files.

### Why

- Up-to-date, easy-to-scan documentation (one file per resource) helps integrators and keeps the API from being “hidden” in code only.

### Guideline

- When adding a route, update the corresponding `doc` file and the index `doc/README.md`. For generated Swagger/OpenAPI, you can later derive a spec from these descriptions or from code.

---

## 7. Database Interface and Optional `channelId`

### Changes

- **`src/database/database.ts`**: `addAchievement(… channelId: string)` → `channelId?: string | null` to align with the JSON handler and mock, which do not always provide a channel.
- **`src/database/prismaDatabase.ts`**: `addAchievement` accepts optional `channelId`; passes `channelId: a.channelId ?? undefined` to Prisma.
- **`src/repositories/achievementRepository.ts`**: `add` signature aligned with optional `channelId`.

### Why

- Unify the contract between Prisma, mock, and API (achievement creation without a channel is allowed).

### Guideline

- Keep DTOs and business interfaces aligned with the Prisma schema (optional vs required fields) to avoid inconsistencies across layers.

---

## 8. Tests Without `any`

### Changes

- **`src/tests/unit/index_and_handler.unit.test.ts`**: Repo mock for `handleJsonMessage` with `{} as unknown as GatewayRepo` instead of `as any`.
- **`src/tests/unit/userService.unit.test.ts`**: Use of `UserRepository` + `MockDatabase` instead of a partial object `as any`.
- **`src/tests/unit/jsonHandler.unit.test.ts`**: Use of `channelUserDTO` for `result.users![0].userType` instead of `as any`.
- **`src/tests/unit/prismaDatabase.unit.test.ts`** (and former **`prismaDatabase.notfound.unit.test.ts`**): Mock interfaces (MockUserData, MockChannelData, FindManyWhere, etc.) and explicit typing of Prisma mocks instead of `[key: string]: any` and `data: any`.

### Why

- Tests remain a reliable reflection of the project’s typing and avoid hiding errors behind `any`.

### Guideline

- In tests, prefer real types (repos, DTOs) or typed mocks (interfaces) over `any`. For partial mocks, `as unknown as T` is preferable to `as any` because it forces you to think about the expected type.

---

## 9. HTTP Constants and Readability

### Changes

- **`src/controllers/helpers.ts`**: Constants `BAD_REQUEST`, `NOT_FOUND`, `INTERNAL_ERROR`, `SERVICE_UNAVAILABLE` for status codes, and `getErrorMessage(err)`, `sendInternalError(res, err)` for error responses.

### Why

- Avoiding magic numbers and centralizing error messages improves readability and future changes.

### Guideline

- Centralize HTTP codes and error messages (dedicated file or constants at the top of the module) to keep the API consistent.

---

## 10. Config and Environment Variables

### Changes

- **`src/config/environment.ts`**: `Config` interface (port, nodeEnv, databaseUrl, cors.allowedOrigins). `validateConfig()` reads environment variables with defaults (`getEnv`) and exports `config` used by `index.ts` (port, databaseUrl) and elsewhere as needed.

### Why

- Centralizing access to environment variables avoids scattered `process.env` and allows validating config at startup.

### Guideline

- Use `config` from `./config/environment` for port, databaseUrl, etc.; do not read `process.env` directly in business logic.

---

## 11. JSON Handler (types, actions, payload)

### Changes

- **`src/handler/types/`**: Types for the JSON handler: `GatewayRepo`, `handlerFn`, `JsonMessage`, `JsonHandlerResult`, `Payload` (and `index.ts` re-exporting them).
- **`src/handler/payload.ts`**: Helpers to parse/validate the payload (e.g. field extraction, validation).
- **`src/handler/actions/`**: One file per domain (userActions, channelActions, achievementActions, …) exporting action handlers used by the JSON handler; **`index.ts`** aggregates actions.
- **`src/handler/jsonHandler.ts`**: Uses types (`JsonMessage`, `JsonHandlerResult`, `GatewayRepo`), payload helpers, and actions to process JSON messages (no `any`).

### Why

- Separating types, helpers, and actions by resource keeps the JSON handler readable and testable.

### Guideline

- For a new JSON action: add the handler in the corresponding `actions` file, register it in `actions/index.ts`, and use it in `jsonHandler.ts`.

---

## 12. PrismaDatabase Constructor (TypeScript Typing)

### Changes

- **`src/database/prismaDatabase.ts`**: When `databaseUrl` is absent, call `new PrismaClient()` with no argument instead of `new PrismaClient({})`. With `{}`, the `PrismaClientOptions` type required the `datasources` property; with no argument, Prisma uses the source defined in the schema (e.g. `DATABASE_URL`).

### Why

- Fix TypeScript compilation and test errors: the no-argument constructor is valid and avoids passing an incomplete options object.

### Guideline

- For a custom URL, pass `{ datasources: { db: { url: databaseUrl } } }`; otherwise pass nothing to use the default config.

---

## 13. Mocks in `src/tests/mocks/`

### Changes

- **`src/database/mockDatabase.ts`**: Moved to **`src/tests/mocks/mockDatabase.ts`** (and **`src/tests/mocks/index.ts`** for exports). The mock is only used by tests and is no longer part of production code.

### Why

- Clearly separate production code from test mocks and avoid exposing them in the application build.

### Guideline

- Import the mock from `src/tests/mocks` (or via the path configured in tests); the rest of the app does not need to know about it.

---

## 14. Unit Test Restructure

### Changes

- **Layout**: Unit tests mirror the source layout: `src/tests/unit/config/`, `database/`, `repositories/`, `controllers/`, `routes/`, `handler/`, `index/`, `services/`, `utils/`.
- **One file per module**: One test file per repository (e.g. `userRepository.unit.test.ts`, `channelRepository.unit.test.ts`), per controller, per route file. The former monolithic `repositories.unit.test.ts` was removed and replaced by dedicated files.
- **`prismaDatabase.unit.test.ts`**: “Not found” cases (from former `prismaDatabase.notfound.unit.test.ts`) were merged into a single `prismaDatabase.unit.test.ts`.
- **New files**: Unit tests for all controllers, all routes, `handler/jsonHandler`, `handler/payload`, `controllers/helpers`, `index`, and `server`.

### Why

- One test file per source file simplifies navigation and maintenance. The mirror layout makes it obvious where tests live.

### Guideline

- Keep this convention: a file `X.unit.test.ts` next to (in the mirror layout) the `X.ts` file it tests.

---

## 15. Integration Tests (repositories and database)

### Changes

- **Integration files**: One `.integ.test.ts` file per repository (user, channel, typeAchievement, achievement, badge, achieved, are, possesses) plus **`database.integ.test.ts`** for health check and UserRepository edge cases.
- **Coverage**: For each repository, tests for add, get by id (or composite keys), and “not found”. Tests run against a MySQL database (Docker container) via the integration config.

### Why

- Validate real behaviour with Prisma and the database, in addition to mocked unit tests.

### Guideline

- Run integration tests with `npm run test` (or the dedicated Jest config) after starting the test container; keep unit tests fast and free of external dependencies.

---

## 16. Removal of Comments

### Changes

- **`src/`** and **`src/tests/`**: All comments removed (line `//`, blocks `/* */`, `/** */`), including `eslint-disable-next-line`, so that only code and explicit names remain.

### Why

- Reduce noise and avoid outdated comments; code and symbol names should remain the source of truth.

### Guideline

- Prefer explicit variable/function names and readable code; add comments only to explain non-obvious “why” (business rules, workarounds).

---

## Summary of Created / Modified Files

| File                                                                                          | Action                                                                                                                   |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `src/config/environment.ts`                                                                   | Created (Config, port, databaseUrl, cors)                                                                                |
| `src/controllers/helpers.ts`                                                                  | Created                                                                                                                  |
| `src/controllers/healthController.ts` … `possessesController.ts`                              | Created                                                                                                                  |
| `src/database/database.ts`                                                                    | Modified (healthCheck, optional channelId)                                                                               |
| `src/database/mockDatabase.ts`                                                                | Modified (healthCheck, typing), then moved to `src/tests/mocks/`                                                         |
| `src/database/prismaDatabase.ts`                                                              | Modified (optional channelId, map typing, constructor without `{}` when no URL)                                          |
| `src/index.ts`                                                                                | Single entry point (Gateway, createPrismaGateway, createApp, main; replaces startServer)                                 |
| `src/startServer.ts`                                                                          | Removed (merged into index)                                                                                              |
| `src/routes/index.ts`                                                                         | Created (mountRoutes)                                                                                                    |
| `src/routes/healthRoutes.ts` … `possessesRoutes.ts`                                           | Created (createXxxRoutes(db))                                                                                            |
| `src/handler/types/` (gatewayRepo, handlerFn, jsonMessage, jsonHandlerResult, payload, index) | Created                                                                                                                  |
| `src/handler/payload.ts`                                                                      | Created                                                                                                                  |
| `src/handler/actions/*.ts` + `index.ts`                                                       | Created (handlers per resource)                                                                                          |
| `src/handler/jsonHandler.ts`                                                                  | Reworked (typed payload/msg, JsonHandlerResult)                                                                          |
| `src/repositories/achievementRepository.ts`                                                   | Modified (optional channelId)                                                                                            |
| `src/types/global.d.ts`                                                                       | Modified (unknown instead of any)                                                                                        |
| `src/tests/mocks/mockDatabase.ts`, `index.ts`                                                 | Created (createMockGateway, mocks for tests)                                                                             |
| `src/tests/unit/*.ts`                                                                         | Modified (removed any)                                                                                                   |
| `src/tests/unit/`                                                                             | Restructured (config, database, repositories, controllers, routes, handler, index, services, utils; one file per module) |
| `src/tests/integration/*.integ.test.ts`                                                       | Created (user, channel, typeAchievement, achievement, badge, achieved, are, possesses, database)                         |
| `doc/README.md` + `doc/*.md`                                                                  | Created                                                                                                                  |
| `README.md`                                                                                   | Modified (link to doc/)                                                                                                  |
| `REFACTORING.md`                                                                              | This file                                                                                                                |
| `package.json`                                                                                | start, server:start, test, test:unit, test:integration, test:coverage, test:coverage:full                                |

---

_Refactoring was done to make the code clean, readable, free of `any`, with all routes exposed and API documentation centralized in `doc/`._
