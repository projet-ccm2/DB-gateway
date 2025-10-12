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

| Field | Value |
|-------|--------|
| **Host** | `localhost` |
| **Port** | `3307` |
| **Database** | `test_db` |
| **User** | `root` |
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
