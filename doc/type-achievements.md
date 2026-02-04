# Type Achievements

## POST /type-achievements

Crée un type d’achievement.

### Body (JSON)

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| label | string | oui | Libellé du type |
| data | string | oui | Données associées |

### Réponses

**201 Created**

```json
{
  "id": "uuid",
  "label": "string",
  "data": "string"
}
```

**400 Bad Request**

```json
{
  "error": "label and data required"
}
```

**500 Internal Server Error**

```json
{
  "error": "Internal server error"
}
```

---

## GET /type-achievements/:id

Retourne un type d’achievement par ID.

### Paramètres de chemin

| Nom | Type | Description |
|-----|------|-------------|
| id | string | ID du type (UUID) |

### Réponses

**200 OK**

```json
{
  "id": "uuid",
  "label": "string",
  "data": "string"
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
