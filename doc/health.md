# Health

## GET /health

Vérifie l’état du service et de la base de données.

### Réponses

**200 OK** — Service et DB opérationnels

```json
{
  "status": "ok",
  "db": "up"
}
```

**503 Service Unavailable** — Base indisponible

```json
{
  "status": "degraded",
  "db": "down"
}
```

**500 Internal Server Error** — Erreur inattendue

```json
{
  "status": "error",
  "db": "error",
  "error": "<message>"
}
```
