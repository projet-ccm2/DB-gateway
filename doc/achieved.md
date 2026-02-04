# Achieved (liaison Achievement ↔ User)

## POST /achieved

Enregistre ou met à jour une réalisation d’achievement par un utilisateur.

### Body (JSON)

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| achievementId | string | oui | ID de l’achievement |
| userId | string | oui | ID de l’utilisateur |
| count | number | oui | Compteur |
| finished | boolean | oui | Achievement terminé ou non |
| labelActive | boolean | oui | Libellé actif |
| acquiredDate | string | oui | Date d’acquisition (ISO 8601) |

### Réponses

**201 Created**

```json
{
  "achievementId": "uuid",
  "userId": "uuid",
  "count": 1,
  "finished": false,
  "labelActive": true,
  "acquiredDate": "2024-01-01T00:00:00.000Z"
}
```

**400 Bad Request**

```json
{
  "error": "achievementId, userId, count, finished, labelActive, acquiredDate required"
}
```

**500 Internal Server Error**

```json
{
  "error": "Internal server error"
}
```

---

## GET /achieved

Retourne l’enregistrement « achieved » pour un couple (achievementId, userId).

### Query

| Paramètre | Type | Obligatoire | Description |
|-----------|------|-------------|-------------|
| achievementId | string | oui | ID de l’achievement |
| userId | string | oui | ID de l’utilisateur |

### Réponses

**200 OK**

```json
{
  "achievementId": "uuid",
  "userId": "uuid",
  "count": 1,
  "finished": false,
  "labelActive": true,
  "acquiredDate": "2024-01-01T00:00:00.000Z"
}
```

**400 Bad Request**

```json
{
  "error": "query params achievementId and userId required"
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
