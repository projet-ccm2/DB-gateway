# Health

## GET /health

Checks the service and database status.

### Responses

**200 OK** — Service and DB operational

```json
{
  "status": "ok",
  "db": "up"
}
```

**503 Service Unavailable** — Database unavailable

```json
{
  "status": "degraded",
  "db": "down"
}
```

**500 Internal Server Error** — Unexpected error

```json
{
  "status": "error",
  "db": "error",
  "error": "<message>"
}
```
