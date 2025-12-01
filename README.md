# 🧱 DB-Gateway

Gateway between backend services and the project database (MySQL).  
This service receives JSON payloads and interacts with the database accordingly.

---

## 🚀 Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and **running**
- Node.js ≥ 20.x
- npm ≥ 9.x

---

## ⚙️ Useful Commands

### ▶️ Start development mode

```bash
npm run dev
```

This command:

1. Starts a MySQL database container (`mysql_test_db`)
2. Launches the Node.js app locally (TypeScript code)
3. Prints “hello world” if everything works ✅

---

### 🐳 Start only the database (without the app)

```bash
npm run dev:db
```

This will:

- Build and run the MySQL container with test data
- Use `docker-compose.test.yml`
- Automatically load the schema from `mysql/init.sql`

To stop and remove everything:

```bash
npm run dev:db:down
```

---

### 🔍 Check if everything is running

```bash
docker ps
```

You should see something like:

```
CONTAINER ID   IMAGE       COMMAND                  STATUS                    PORTS
xxxxxx          mysql:8.0   "docker-entrypoint.s…"   Up (healthy)              0.0.0.0:3307->3306/tcp
```

---

## 🗄️ Accessing the Database

### Option 1 – via DBeaver 🧩

1. Download [DBeaver](https://dbeaver.io/download/)
2. Create a **new MySQL connection**
3. Fill in the following:

| Field        | Value          |
| ------------ | -------------- |
| **Host**     | `localhost`    |
| **Port**     | `3307`         |
| **Database** | `test_db`      |
| **User**     | `root`         |
| **Password** | `rootpassword` |

---

### Option 2 – via Adminer (lightweight web UI) 🌐

You can add this block at the end of `docker-compose.test.yml`:

```yaml
adminer:
  image: adminer
  container_name: adminer_test
  ports:
    - "8080:8080"
  depends_on:
    - mysql_test
```

Then restart:

```bash
npm run dev:db
```

➡️ Open [http://localhost:8080](http://localhost:8080)

**Adminer connection:**

- Server: `mysql_test`
- User: `root`
- Password: `rootpassword`
- Database: `test_db`

---

### Option 3 – via command line 💻

```bash
docker exec -it mysql_test_db mysql -u root -p
```

Then enter:

```
rootpassword
```

Inside MySQL:

```sql
USE test_db;
SHOW TABLES;
SELECT * FROM Users;
```

---

## 🧪 Tests

```bash
npm test
```

Or in dev mode (with Docker DB running):

```bash
npm run test:dev
```

---

## 🧹 Other useful scripts

- `npm run prettier` → formats all code automatically
- `npm run build` → compiles TypeScript → JavaScript (`dist/`)
- `npx eslint . --fix ` → fix any eslint errors

---

## 🧠 Notes

- The MySQL DB is available at **port 3307**.
- The DB is reset each time you run `npm run dev:db:down`.

---

👷‍♂️ _Maintainer:_ Léo Lomel
📦 _Project StreamQuest — DB Gateway Service_

# DB Gateway

This repository contains a small DB Gateway service (TypeScript + Prisma) that exposes simple methods to
interact with a MySQL database. The service supports two database backends for development and testing:

- an in-memory `mockDatabase` for fast unit tests
- a `prismaDatabase` backed by MySQL (docker) for integration tests

The original project used an SQL schema (`mysql/init_Schema.sql`). The same schema has been transcribed to
Prisma models (`prisma/schema.prisma`) so the Prisma client and migrations reflect the legacy schema.

This README explains how to run, test and extend the gateway.

## Goals & responsibilities

The gateway's main purpose is to receive requests from other services, perform database operations and
return responses. Typical responsibilities:

- expose methods like `getUserById`, `addUser` (implemented in `src/repositories/userRepository.ts`)
- provide a fast mock database for unit tests
- provide a Prisma-backed implementation for integration and real DB operations
- include Docker orchestration and scripts for dev/test

Yes — your description is correct: the gateway receives requests, transforms/validates them, uses a repository
to talk to the DB, and returns responses. The current code implements this pattern.

## Files & structure (important parts)

- `prisma/schema.prisma` — Prisma schema matching `mysql/init_Schema.sql`
- `src/database/database.ts` — database interface and DTOs
- `src/database/mockDatabase.ts` — fast in-memory implementation for unit tests
- `src/database/prismaDatabase.ts` — Prisma-backed implementation
- `src/repositories/userRepository.ts` — repository exposing `getUserById` / `addUser`
- `src/services/userService.ts` — small service layer wrapper
- `src/handler/jsonHandler.ts` — example of a message handler (injected repo)
- `src/prisma/seed.ts` — seed script (inserts a seed user)
- `docker-compose.test.yml` + `.env.test` — test DB orchestration (MySQL on host port 3307)
- `scripts/dbInit.js` — helper that reads `.env.test`, runs `prisma generate`, waits DB readiness, pushes schema and seeds

## Quick start (developer machine)

Prerequisites:

- Docker Desktop (running)
- Node.js (>= 18 recommended)
- npm

Steps (one-liner):

1. Start test DB and init schema + seed:

  ```powershell
  npm run init:all
  ```

  `init:all` will:

  - start the MySQL test container (defined in `docker-compose.test.yml`),
  - wait until port 3307 is reachable,
  - generate the Prisma client,
  - push the Prisma schema to the DB (`prisma db push`),
  - insert a seed user.

2. Run unit tests (fast, no Docker):

  ```powershell
  npm run test:unit
  ```

3. Run integration tests (needs Docker test DB running):

  ```powershell
  npm run test:integration
  ```

4. Stop and remove test DB and volumes:

  ```powershell
  npm run test:db:down
  ```

## What to expect

- Unit tests use the in-memory `mockDatabase` (fast).
- Integration tests use the MySQL container on `localhost:3307` (see `.env.test`).
- The repository exposes `addUser(username)` and `getUserById(id)` as examples. You can wire more methods
  following the same pattern.

## Troubleshooting

- If `npm run init:all` fails with permission/access errors, try:

  1. `docker compose -f docker-compose.test.yml down -v --remove-orphans`
  2. Remove leftover volumes if necessary: `docker volume ls` and `docker volume rm <name>`
  3. Re-run `npm run init:all`.

- If Prisma complains about client constructor validation, ensure `npx prisma generate` has been run and that
  `prisma.config.ts` is present and points to the correct `DATABASE_URL` (we use `.env.test` for tests).

## Design notes and suggestions (what might be missing)

The current repository provides a solid base for a gateway, but depending on your production needs here are
some suggestions you might want to add next:

1. Authentication / Authorization: a gateway often needs to validate requests and check permissions.
2. Validation layer: request schema validation (e.g., Zod or Joi) to enforce payload shape.
3. API layer / transport: right now we show a JSON handler; integrate an HTTP server (Express / Fastify)
  or message bus consumer that calls `handleJsonMessage`.
4. Logging & tracing: you have `winston` in the repo — consider adding structured logs and request tracing.
5. Error handling & retries: add consistent error shapes and retry/backoff for transient DB errors.
6. Migration strategy: we use `prisma db push` for test/dev; for production you may want to maintain migrations
  (`prisma migrate`) and a controlled deployment flow.
7. Strong typing: remove the remaining `any` casts around Prisma and wrap the client in a typed adapter.

If you want, I can implement any of the above items (pick A/B/C/D from the previous message). For example,
I can add a small Express HTTP wrapper demonstrating request → handler → response flow, with the repo wired in.

## Common commands reference

- Start test DB + init: `npm run init:all`
- Stop test DB: `npm run test:db:down`
- Unit tests: `npm run test:unit`
- Integration tests: `npm run test:integration`
- Generate Prisma client: `npx prisma generate`
- Push schema to DB: `npx prisma db push`

## Wrap-up

This project is already in a good shape for building a gateway. The core components (DB interface, mock, Prisma
adapter, repository, tests) are present. The main remaining items are tightening Prisma typing and adding a
network/transport layer (HTTP or message consumer) depending on how other teams will call the gateway.

If you want, I can now:

- finish the typing cleanup (remove `any` around Prisma) — safer and cleaner
- add an Express-based HTTP example showing how to expose `addUser` / `getUserById` endpoints
- add more integration tests that exercise Achievements / Badges based on the transcribed schema

Tell me which one you want me to do next.
