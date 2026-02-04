# Possesses (liaison User ↔ Badge)

## POST /possesses

Enregistre qu’un utilisateur possède un badge (date d’acquisition).

### Body (JSON)

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| userId | string | oui | ID de l’utilisateur |
| badgeId | string | oui | ID du badge |
| acquiredDate | string | oui | Date d’acquisition (ISO 8601) |

### Réponses

**201 Created**

```json
{
  "userId": "uuid",
  "badgeId": "uuid",
  "acquiredDate": "2024-01-01T00:00:00.000Z"
}
```

**400 Bad Request**

```json
{
  "error": "userId, badgeId, acquiredDate required"
}
```

**500 Internal Server Error**

```json
{
  "error": "Internal server error"
}
```

---

## GET /possesses

Retourne l’enregistrement « possesses » pour un couple (userId, badgeId).

### Query

| Paramètre | Type | Obligatoire | Description |
|-----------|------|-------------|-------------|
| userId | string | oui | ID de l’utilisateur |
| badgeId | string | oui | ID du badge |

### Réponses

**200 OK**

```json
{
  "userId": "uuid",
  "badgeId": "uuid",
  "acquiredDate": "2024-01-01T00:00:00.000Z"
}
```

**400 Bad Request**

```json
{
  "error": "query params userId and badgeId required"
}
```

**404 Not Found**

```json
{
  "error": "not found"
}
```

**500 Internal Server Error**

```json
{
  "error": "Internal server error"
}
```
