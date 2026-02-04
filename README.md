# 🧱 DB-Gateway

Gateway between backend services and the project database (MySQL).  
This service exposes REST HTTP routes and receives JSON payloads to interact with the database.

---

## 📚 API Documentation (Swagger-style)

Detailed documentation for each HTTP route is in the **[\`doc/\`](./doc/)** folder:

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
xxxxxx          mysql:8.0   "docker-entrypoint.s…"   Up (healthy)              0.0.0.0:3306->3306/tcp
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
| **Port**     | `3306`         |
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

## 🧪 Testing & Code Quality

### Run Tests

**All tests**

```bash
npm test
```

**Unit tests only** (fast, no Docker)

```bash
npm run test:unit
```

**Integration tests only** (requires Docker DB)

```bash
npm run test:integration
```

**Coverage report**

```bash
npm run test:coverage:full
```

### Code Quality

**Format with Prettier**

```bash
npm run prettier
```

**Build to JavaScript**

```bash
npm run build
```

**Fix ESLint errors**

```bash
npx eslint . --fix
```

---

## 🧠 Notes

- The MySQL DB is available at **port 3306**.
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

## 📂 Project Structure

### Core Files

**Database & Models**

- `src/database/database.ts` — Database interface + all DTOs (types)
- `src/database/mockDatabase.ts` — In-memory implementation for unit tests
- `src/database/prismaDatabase.ts` — Prisma implementation for real MySQL
- `prisma/schema.prisma` — Prisma schema (matches legacy SQL schema)

**API & Business Logic**

- `src/server.ts` — Express server with REST endpoints
- `src/repositories/*.ts` — Repository layer (UserRepository, etc.)
- `src/services/*.ts` — Service layer (optional business logic wrapper)
- `src/handler/jsonHandler.ts` — Message handler example

**Configuration**

- `src/config/environment.ts` — Environment variables
- `src/index.ts` — Gateway factories (createMockGateway, createPrismaGateway)
- `.env` — Environment config for development
- `.env.test` — Environment config for testing

**Database Setup**

- `docker-compose.yml` — Development database configuration
- `mysql/init_Schema.sql` — Initial SQL schema (legacy)
- `src/prisma/seed.ts` — Seed script (populates test data)

**Testing**

- `src/tests/unit/*.test.ts` — Unit tests (uses MockDatabase)
- `src/tests/integration/*.test.ts` — Integration tests (uses PrismaDatabase + testcontainers)
- `jest.config.mjs` — Jest configuration
- `src/tests/setup.ts` — Global test setup/teardown

**Other**

- `src/utils/logger.ts` — Winston logger utility
- `src/types/express.d.ts` — Express type definitions
- `eslint.config.mjs` — ESLint configuration
- `tsconfig.json` — TypeScript configuration
- `.github/workflows/ci.yml` — CI/CD pipeline (GitHub Actions)

---

## 📂 Project Structure (Legacy - see above for full structure)

- `prisma/schema.prisma` — Prisma schema matching `mysql/init_Schema.sql`
- `src/database/database.ts` — database interface and DTOs
- `src/database/mockDatabase.ts` — fast in-memory implementation for unit tests
- `src/database/prismaDatabase.ts` — Prisma-backed implementation
- `src/repositories/userRepository.ts` — repository exposing `getUserById` / `addUser`
- `src/services/userService.ts` — small service layer wrapper
- `src/handler/jsonHandler.ts` — example of a message handler (injected repo)
- `src/prisma/seed.ts` — seed script (inserts a seed user)
- `docker-compose.yml` + `.env` — test DB orchestration (MySQL on host port 3306)

## ⚡ Quick Start (Developer Machine)

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Database (Optional)

```bash
npm run dev:db
```

This starts MySQL on `localhost:3306`.

### 3. Run Tests

```bash
npm test
```

All tests use **in-memory mocks** — no database needed! ✅

### 4. Start the Server

```bash
npm run server:start
```

API available at `http://localhost:3000`

---

## 🎯 Getting Started (Full Setup)

Prerequisites:

- Docker Desktop (running)
- Node.js ≥ 20.x
- npm ≥ 9.x

Steps:

```powershell
npm run init:all
```

`init:all` will:

- start the MySQL test container (defined in `docker-compose.test.yml`),
- wait until port 3306 is reachable,
- generate the Prisma client,
- push the Prisma schema to the DB (`prisma db push`),
- insert a seed user.

2. Run unit tests (fast, no Docker):

Steps:

1. **Init database with schema + seed:**

   ```bash
   npm run dev:db
   npm run db:init
   ```

2. **Run tests:**

   ```bash
   npm test
   ```

3. **Start the server:**
   ```bash
   npm run server:start
   ```

---

## 📝 What to Expect

- **Unit tests** use in-memory `MockDatabase` (fast, no Docker needed)
- **Integration tests** use real MySQL via testcontainers (auto-managed, no manual setup)
- **API endpoints** follow REST conventions with proper HTTP status codes
- **Repository pattern** ensures clean separation between API, business logic, and database

---

## 🆘 Troubleshooting

**Tests failing?**

```bash
npm test
```

Tests don't require Docker — they use in-memory mocks. If tests fail, check TypeScript compilation:

```bash
npm run build
```

**Database connection issues?**

```bash
# Check if Docker container is running
docker ps

# Manual cleanup if needed
docker compose --env-file .env -f docker-compose.yml down -v --remove-orphans

# Restart
npm run dev:db
```

**Prisma issues?**

```bash
# Regenerate Prisma client
npm run prisma:gen

# Push schema to database
npx prisma db push

# Seed data
ts-node src/prisma/seed.ts
```

---

## What to expect

- Unit tests use the in-memory `mockDatabase` (fast).
- Integration tests use MySQL via testcontainers.
- The repository exposes `addUser(username)` and `getUserById(id)` as examples. You can wire more methods
  following the same pattern.

## Troubleshooting

- If Docker fails, try manual cleanup and restart:
  1. `docker compose --env-file .env -f docker-compose.yml down -v --remove-orphans`
  2. `npm run dev:db` to restart

- If Prisma complains about client constructor validation, ensure `npx prisma generate` has been run and that
  `prisma.config.ts` is present and points to the correct `DATABASE_URL` (we use `.env.test` for tests).

## 📡 API Endpoints

The gateway exposes REST endpoints via Express. Start the server with:

```bash
npm run server:start
```

Server runs on `http://localhost:3000`

---

### Users

---

**Create a user**

```http
POST /users
```

Example:

```http
POST /users
Content-Type: application/json

{
  "username": "john_doe",
  "twitchUserId": "12345678",
  "profileImageUrl": "https://example.com/avatar.png",
  "channelDescription": "Welcome to my channel!",
  "scope": "chat:read chat:write user:read"
}
```

Response (201):

```json
{
  "id": "u_abc123",
  "username": "john_doe",
  "twitchUserId": "12345678",
  "profileImageUrl": "https://example.com/avatar.png",
  "channelDescription": "Welcome to my channel!",
  "scope": "chat:read chat:write user:read"
}
```

**Required fields:**

- `username` — Display name
- `twitchUserId` — Twitch User ID

**Optional fields:**

- `profileImageUrl` — Profile avatar URL (nullable)
- `channelDescription` — Channel bio/description (nullable)
- `scope` — OAuth scopes accepted by user (nullable, space-separated)

**Error responses:**

- `400` — Username and twitchUserId are required
- `500` — Server error

---

**Get user by ID**

```http
GET /users/{id}
```

Example:

```http
GET /users/u_abc123
```

Response (200):

```json
{
  "id": "u_abc123",
  "username": "john_doe",
  "twitchUserId": "12345678",
  "profileImageUrl": "https://example.com/avatar.png",
  "channelDescription": "Welcome to my channel!",
  "scope": "chat:read chat:write user:read"
}
```

**Error responses:**

- `404` — User not found
- `500` — Server error

---

**Get achievements by channel ID**

```http
GET /channels/{channelId}/achievements
```

Example:

```http
GET /channels/c_xyz789/achievements
```

Response (200):

```json
{
  "achievements": [
    {
      "id": "a_first1",
      "title": "First Steps",
      "description": "Complete the tutorial",
      "goal": 1,
      "reward": 100,
      "label": "beginner",
      "channelId": "c_xyz789"
    }
  ]
}
```

**Error responses:**

- `404` — Channel not found
- `500` — Server error

---

**Get achieved records by user and channel IDs**

```http
GET /users/{userId}/achieved?channels={channelId1},{channelId2},...
```

Example:

```http
GET /users/u_abc123/achieved?channels=c_xyz789,c_def456
```

Response (200):

```json
{
  "achieved": [
    {
      "achievementId": "a_first1",
      "userId": "u_abc123",
      "count": 5,
      "finished": true,
      "labelActive": true,
      "acquiredDate": "2024-01-15T10:30:00.000Z",
      "channelId": "c_xyz789"
    }
  ]
}
```

**Query parameters:**

- `channels` — Comma-separated list of channel IDs to filter by (required)

**Error responses:**

- `404` — User not found
- `500` — Server error

---

**Get channels by user ID**

```http
GET /users/{userId}/channels
```

Returns all channels the user is a member of, along with their role in each channel.

Example:

```http
GET /users/u_abc123/channels
```

Response (200):

```json
{
  "channels": [
    { "id": "c_xyz789", "name": "general", "userType": "admin" },
    { "id": "c_def456", "name": "gaming", "userType": "moderator" }
  ]
}
```

**Response fields:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Channel ID |
| `name` | string | Channel name |
| `userType` | string | User's role in this channel (e.g., "admin", "moderator", "user") |

**Error responses:**

- `404` — User not found
- `500` — Server error

---

**Get badges by user ID**

```http
GET /users/{userId}/badges
```

Example:

```http
GET /users/u_abc123/badges
```

Response (200):

```json
{
  "badges": [
    { "id": "b_gold1", "title": "Gold Subscriber", "img": "gold.png" },
    { "id": "b_mod1", "title": "Moderator", "img": "mod.png" }
  ]
}
```

**Error responses:**

- `404` — User not found
- `500` — Server error

---

**Get achievements by user ID**

```http
GET /users/{userId}/achievements
```

Example:

```http
GET /users/u_abc123/achievements
```

Response (200):

```json
{
  "achievements": [
    {
      "achievementId": "a_first1",
      "userId": "u_abc123",
      "count": 5,
      "finished": true,
      "labelActive": true,
      "acquiredDate": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Error responses:**

- `404` — User not found
- `500` — Server error

---

**Get users by channel ID**

```http
GET /channels/{channelId}/users
```

Returns all users who are members of the channel, along with their role in that channel.

Example:

```http
GET /channels/c_xyz789/users
```

Response (200):

```json
{
  "users": [
    {
      "id": "u_abc123",
      "username": "john_doe",
      "twitchUserId": "12345678",
      "profileImageUrl": "https://example.com/avatar.png",
      "channelDescription": "Welcome to my channel!",
      "scope": "chat:read chat:write",
      "userType": "admin"
    },
    {
      "id": "u_def456",
      "username": "jane_mod",
      "twitchUserId": "87654321",
      "profileImageUrl": null,
      "channelDescription": null,
      "scope": null,
      "userType": "moderator"
    }
  ]
}
```

**Response fields:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | User ID |
| `username` | string | Username |
| `twitchUserId` | string | Twitch User ID |
| `profileImageUrl` | string \| null | Profile avatar URL |
| `channelDescription` | string \| null | Channel bio |
| `scope` | string \| null | OAuth scopes |
| `userType` | string | User's role in this channel (e.g., "admin", "moderator", "user") |

**Error responses:**

- `404` — Channel not found
- `500` — Server error

---

**Get users by badge ID**

```http
GET /badges/{badgeId}/users
```

Example:

```http
GET /badges/b_gold1/users
```

Response (200):

```json
{
  "users": [
    {
      "id": "u_abc123",
      "username": "john_doe",
      "twitchUserId": "12345678",
      "profileImageUrl": null,
      "channelDescription": null,
      "scope": null
    }
  ]
}
```

**Error responses:**

- `404` — Badge not found
- `500` — Server error

---

**Get users by achievement ID**

```http
GET /achievements/{achievementId}/users
```

Example:

```http
GET /achievements/a_first1/users
```

Response (200):

```json
{
  "users": [
    {
      "id": "u_abc123",
      "username": "john_doe",
      "twitchUserId": "12345678",
      "profileImageUrl": null,
      "channelDescription": null,
      "scope": null
    }
  ]
}
```

**Error responses:**

- `404` — Achievement not found
- `500` — Server error

---

### Channels

---

**Create a channel**

```http
POST /channels
```

Example:

```http
POST /channels
Content-Type: application/json

{
  "name": "general"
}
```

Response (201):

```json
{
  "id": "c_xyz789",
  "name": "general"
}
```

**Error responses:**

- `400` — Name is required
- `500` — Server error

---

**Get channel by ID**

```http
GET /channels/{id}
```

Example:

```http
GET /channels/c_xyz789
```

Response (200):

```json
{
  "id": "c_xyz789",
  "name": "general"
}
```

**Error responses:**

- `404` — Channel not found
- `500` — Server error

---

### Type Achievements

---

**Create a type achievement**

```http
POST /typeachievements
```

Example:

```http
POST /typeachievements
Content-Type: application/json

{
  "label": "streaming",
  "data": "{ \"category\": \"live\" }"
}
```

Response (201):

```json
{
  "id": "t_str123",
  "label": "streaming",
  "data": "{ \"category\": \"live\" }"
}
```

**Error responses:**

- `400` — Label and data are required
- `500` — Server error

---

**Get type achievement by ID**

```http
GET /typeachievements/{id}
```

Example:

```http
GET /typeachievements/t_str123
```

Response (200):

```json
{
  "id": "t_str123",
  "label": "streaming",
  "data": "{ \"category\": \"live\" }"
}
```

**Error responses:**

- `404` — Type achievement not found
- `500` — Server error

---

### Achievements

---

**Create an achievement**

```http
POST /achievements
```

Example:

```http
POST /achievements
Content-Type: application/json

{
  "title": "First Steps",
  "description": "Complete the tutorial",
  "goal": 1,
  "reward": 100,
  "label": "beginner"
}
```

Response (201):

```json
{
  "id": "a_first1",
  "title": "First Steps",
  "description": "Complete the tutorial",
  "goal": 1,
  "reward": 100,
  "label": "beginner"
}
```

**Error responses:**

- `400` — Title, description, goal, reward, and label are required
- `500` — Server error

---

**Get achievement by ID**

```http
GET /achievements/{id}
```

Example:

```http
GET /achievements/a_first1
```

Response (200):

```json
{
  "id": "a_first1",
  "title": "First Steps",
  "description": "Complete the tutorial",
  "goal": 1,
  "reward": 100,
  "label": "beginner"
}
```

**Error responses:**

- `404` — Achievement not found
- `500` — Server error

---

### Badges

---

**Create a badge**

```http
POST /badges
```

Example:

```http
POST /badges
Content-Type: application/json

{
  "title": "Gold Subscriber",
  "img": "gold_badge.png"
}
```

Response (201):

```json
{
  "id": "b_gold1",
  "title": "Gold Subscriber",
  "img": "gold_badge.png"
}
```

**Error responses:**

- `400` — Title and img are required
- `500` — Server error

---

**Get badge by ID**

```http
GET /badges/{id}
```

Example:

```http
GET /badges/b_gold1
```

Response (200):

```json
{
  "id": "b_gold1",
  "title": "Gold Subscriber",
  "img": "gold_badge.png"
}
```

**Error responses:**

- `404` — Badge not found
- `500` — Server error

---

### User-Achievement Relations (Achieved)

---

**Record achievement progress**

```http
POST /users/{userId}/achievements/{achievementId}
```

Example:

```http
POST /users/u_abc123/achievements/a_first1
Content-Type: application/json

{
  "count": 1,
  "finished": true,
  "labelActive": true,
  "acquiredDate": "2024-01-15T10:30:00.000Z"
}
```

Response (201):

```json
{
  "achievementId": "a_first1",
  "userId": "u_abc123",
  "count": 1,
  "finished": true,
  "labelActive": true,
  "acquiredDate": "2024-01-15T10:30:00.000Z"
}
```

**Error responses:**

- `400` — Count, finished, labelActive, and acquiredDate are required
- `404` — User or achievement not found
- `500` — Server error

---

**Get achievement progress**

```http
GET /users/{userId}/achievements/{achievementId}
```

Example:

```http
GET /users/u_abc123/achievements/a_first1
```

Response (200):

```json
{
  "achievementId": "a_first1",
  "userId": "u_abc123",
  "count": 1,
  "finished": true,
  "labelActive": true,
  "acquiredDate": "2024-01-15T10:30:00.000Z"
}
```

**Error responses:**

- `404` — Record not found
- `500` — Server error

---

### Channel Membership (Are)

---

**Add user to channel**

```http
POST /users/{userId}/channels/{channelId}
```

Example:

```http
POST /users/u_abc123/channels/c_xyz789
Content-Type: application/json

{
  "userType": "moderator"
}
```

Response (201):

```json
{
  "userId": "u_abc123",
  "channelId": "c_xyz789",
  "userType": "moderator"
}
```

**Error responses:**

- `400` — UserType is required
- `404` — User or channel not found
- `500` — Server error

---

**Get channel membership**

```http
GET /users/{userId}/channels/{channelId}
```

Example:

```http
GET /users/u_abc123/channels/c_xyz789
```

Response (200):

```json
{
  "userId": "u_abc123",
  "channelId": "c_xyz789",
  "userType": "moderator"
}
```

**Error responses:**

- `404` — Membership not found
- `500` — Server error

---

### User Badges (Possesses)

---

**Award badge to user**

```http
POST /users/{userId}/badges/{badgeId}
```

Example:

```http
POST /users/u_abc123/badges/b_gold1
Content-Type: application/json

{
  "acquiredDate": "2024-01-15T10:30:00.000Z"
}
```

Response (201):

```json
{
  "userId": "u_abc123",
  "badgeId": "b_gold1",
  "acquiredDate": "2024-01-15T10:30:00.000Z"
}
```

**Error responses:**

- `400` — AcquiredDate is required
- `404` — User or badge not found
- `500` — Server error

---

**Get badge possession**

```http
GET /users/{userId}/badges/{badgeId}
```

Example:

```http
GET /users/u_abc123/badges/b_gold1
```

Response (200):

```json
{
  "userId": "u_abc123",
  "badgeId": "b_gold1",
  "acquiredDate": "2024-01-15T10:30:00.000Z"
}
```

**Error responses:**

- `404` — Badge possession not found
- `500` — Server error

---

## 📋 Data Types & Models

All types are defined in `src/database/database.ts`. Here's the complete type reference:

### DTOs (Data Transfer Objects)

```typescript
// User
type userDTO = {
  id: string;
  username: string;
  twitchUserId: string; // Required - Twitch User ID
  profileImageUrl: string | null; // Optional - Profile avatar URL
  channelDescription: string | null; // Optional - Channel bio
  scope: string | null; // Optional - OAuth scopes (space-separated)
};

// Channel
type channelDTO = {
  id: string;
  name: string;
};

// User ↔ Channel relation with role (returned by getChannelsByUserId)
type userChannelDTO = {
  id: string; // Channel ID
  name: string; // Channel name
  userType: string; // User's role in channel (e.g., "admin", "moderator", "user")
};

// Channel ↔ User relation with role (returned by getUsersByChannelId)
type channelUserDTO = {
  id: string; // User ID
  username: string; // Username
  twitchUserId: string; // Twitch User ID
  profileImageUrl: string | null; // Profile avatar URL
  channelDescription: string | null; // Channel bio
  scope: string | null; // OAuth scopes
  userType: string; // User's role in channel (e.g., "admin", "moderator", "user")
};

// Type/Category of Achievement
type typeAchievementDTO = {
  id: string;
  label: string;
  data: string;
};

// Achievement (Goal/Challenge)
type achievementDTO = {
  id: string;
  title: string;
  description: string;
  goal: number; // Target count
  reward: number; // Points/reward
  label: string; // Category
};

// Badge/Trophy
type badgeDTO = {
  id: string;
  title: string;
  img: string; // Image URL/path
};

// User → Achievement progress junction
type achievedDTO = {
  achievementId: string;
  userId: string;
  count: number; // Current progress
  finished: boolean; // Completed?
  labelActive: boolean;
  acquiredDate: string; // ISO 8601 date
};

// User → Channel membership junction
type areDTO = {
  userId: string;
  channelId: string;
  userType: string; // "admin", "moderator", "member"
};

// User → Badge ownership junction
type possessesDTO = {
  userId: string;
  badgeId: string;
  acquiredDate: string; // ISO 8601 date
};
```

### Database Interface

All database adapters (`MockDatabase`, `PrismaDatabase`) implement this interface:

```typescript
interface database {
  // User operations
  getUserById(id: string): Promise<userDTO | null>;
  addUser(user: {
    username: string;
    twitchUserId: string;
    profileImageUrl?: string | null;
    channelDescription?: string | null;
    scope?: string | null;
  }): Promise<userDTO>;

  // User query methods (get related entities)
  getChannelsByUserId(userId: string): Promise<userChannelDTO[]>;
  getBadgesByUserId(userId: string): Promise<badgeDTO[]>;
  getAchievementsByUserId(userId: string): Promise<achievedDTO[]>;

  // Inverse lookups (get users by related entity)
  getUsersByChannelId(channelId: string): Promise<channelUserDTO[]>;
  getUsersByBadgeId(badgeId: string): Promise<userDTO[]>;
  getUsersByAchievementId(achievementId: string): Promise<userDTO[]>;

  // Channel operations
  getChannelById(id: string): Promise<channelDTO | null>;
  addChannel(channel: { name: string }): Promise<channelDTO>;

  // TypeAchievement operations
  getTypeAchievementById(id: string): Promise<typeAchievementDTO | null>;
  addTypeAchievement(t: {
    label: string;
    data: string;
  }): Promise<typeAchievementDTO>;

  // Achievement operations
  getAchievementById(id: string): Promise<achievementDTO | null>;
  addAchievement(a: {
    title: string;
    description: string;
    goal: number;
    reward: number;
    label: string;
  }): Promise<achievementDTO>;

  // Badge operations
  getBadgeById(id: string): Promise<badgeDTO | null>;
  addBadge(b: { title: string; img: string }): Promise<badgeDTO>;

  // Achieved (User → Achievement) operations
  getAchieved(
    achievementId: string,
    userId: string,
  ): Promise<achievedDTO | null>;
  addAchieved(a: {
    achievementId: string;
    userId: string;
    count: number;
    finished: boolean;
    labelActive: boolean;
    acquiredDate: string;
  }): Promise<achievedDTO>;

  // Are (User → Channel) operations
  getAre(userId: string, channelId: string): Promise<areDTO | null>;
  addAre(a: {
    userId: string;
    channelId: string;
    userType: string;
  }): Promise<areDTO>;

  // Possesses (User → Badge) operations
  getPossesses(userId: string, badgeId: string): Promise<possessesDTO | null>;
  addPossesses(p: {
    userId: string;
    badgeId: string;
    acquiredDate: string;
  }): Promise<possessesDTO>;

  // Cleanup
  disconnect(): Promise<void>;
}
```

### Using the Types

When implementing new endpoints or repositories, import and use the types:

```typescript
import { userDTO, database, channelDTO } from "./database/database";

// In your repository
async function getUser(id: string): Promise<userDTO | null> {
  return this.db.getUserById(id);
}
```

---

## 🛠️ How to Implement New Endpoints

Follow this pattern to add new endpoints. Example: Adding Channel support.

### 1. Create a Repository (if not exists)

Create `src/repositories/channelRepository.ts`:

```typescript
import { database, channelDTO } from "../database/database";

export class ChannelRepository {
  constructor(private db: database) {}

  async getChannelById(id: string): Promise<channelDTO | null> {
    return this.db.getChannelById(id);
  }

  async addChannel(name: string): Promise<channelDTO> {
    return this.db.addChannel({ name });
  }
}
```

### 2. Add Routes to Server

Update `src/server.ts`:

```typescript
// Import your new repository
const { repo: channelRepo } = createMockGateway();

// POST endpoint
app.post("/channels", async (req: any, res: any) => {
  try {
    const { name } = req.body as { name?: string };
    if (!name) return res.status(400).json({ error: "name required" });
    const channel = await channelRepo.addChannel(name);
    res.status(201).json(channel);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET endpoint
app.get("/channels/:id", async (req: any, res: any) => {
  try {
    const channel = await channelRepo.getChannelById(req.params.id);
    if (!channel) return res.status(404).json({ error: "not found" });
    res.json(channel);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
```

### 3. Add Tests

Create `src/tests/unit/channelRepository.unit.test.ts`:

```typescript
import { MockDatabase } from "../../database/mockDatabase";
import { ChannelRepository } from "../../repositories/channelRepository";

describe("ChannelRepository", () => {
  let repo: ChannelRepository;

  beforeEach(() => {
    const db = new MockDatabase();
    repo = new ChannelRepository(db);
  });

  test("addChannel creates a channel", async () => {
    const channel = await repo.addChannel("general");
    expect(channel.name).toBe("general");
    expect(channel.id).toBeDefined();
  });

  test("getChannelById returns null if not found", async () => {
    const channel = await repo.getChannelById("nonexistent");
    expect(channel).toBeNull();
  });

  test("getChannelById returns created channel", async () => {
    const created = await repo.addChannel("dev");
    const retrieved = await repo.getChannelById(created.id);
    expect(retrieved?.id).toBe(created.id);
    expect(retrieved?.name).toBe("dev");
  });
});
```

### 4. Run Tests

```bash
npm test
```

All tests should pass! ✅

---

## 📦 Architecture Overview

```
Request
  ↓
Server (src/server.ts) — HTTP route handler
  ↓
Repository (src/repositories/*.ts) — Business logic layer
  ↓
Database Adapter (src/database/*.ts) — Implements database interface
  ↓
  ├─ MockDatabase — Fast in-memory for unit tests
  └─ PrismaDatabase — Real MySQL via Prisma for integration tests
  ↓
MySQL (only in Docker for integration/dev)
```

**Key Principle:** Repositories and business logic don't know whether they're using MockDatabase or PrismaDatabase. This enables fast unit testing without requiring a real database.

---

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
