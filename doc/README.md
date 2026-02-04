# DB-Gateway API — Route Documentation

Swagger-style (Markdown) documentation of all HTTP routes exposed by the DB-Gateway service.

## Route index

| Resource          | File                                           | Description                            |
| ----------------- | ---------------------------------------------- | -------------------------------------- |
| Health            | [health.md](./health.md)                       | Health check                           |
| Users             | [users.md](./users.md)                         | CRUD and user sub-resources            |
| Channels          | [channels.md](./channels.md)                   | Channels and users per channel         |
| Type achievements | [type-achievements.md](./type-achievements.md) | Achievement types                      |
| Achievements      | [achievements.md](./achievements.md)           | Achievements and users per achievement |
| Badges            | [badges.md](./badges.md)                       | Badges and users per badge             |
| Achieved (link)   | [achieved.md](./achieved.md)                   | Achievement ↔ user link               |
| Are (link)        | [are.md](./are.md)                             | User ↔ channel link (role)            |
| Possesses (link)  | [possesses.md](./possesses.md)                 | User ↔ badge link                     |

## Conventions

- **Base URL**: `http://localhost:3000` (or the value of `PORT`).
- **Content-Type**: `application/json` for request and response bodies.
- **Status codes**: `200` OK, `201` Created, `400` Bad Request, `404` Not Found, `500` Internal Server Error, `503` Service Unavailable.
