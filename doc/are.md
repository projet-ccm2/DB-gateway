# Are (liaison User ↔ Channel, rôle)

## POST /are

Associe un utilisateur à une chaîne avec un type (rôle).

### Body (JSON)

| Champ     | Type   | Obligatoire | Description                             |
| --------- | ------ | ----------- | --------------------------------------- |
| userId    | string | oui         | ID de l’utilisateur                     |
| channelId | string | oui         | ID de la chaîne                         |
| userType  | string | oui         | Rôle (ex. subscriber, moderator, admin) |

### Réponses

**201 Created**

```json
{
  "userId": "uuid",
  "channelId": "uuid",
  "userType": "subscriber"
}
```

**400 Bad Request**

```json
{
  "error": "userId, channelId, userType required"
}
```

**500 Internal Server Error**

```json
{
  "error": "Internal server error"
}
```

---

## GET /are

Retourne l’association (user, channel, rôle) pour un couple (userId, channelId).

### Query

| Paramètre | Type   | Obligatoire | Description         |
| --------- | ------ | ----------- | ------------------- |
| userId    | string | oui         | ID de l’utilisateur |
| channelId | string | oui         | ID de la chaîne     |

### Réponses

**200 OK**

```json
{
  "userId": "uuid",
  "channelId": "uuid",
  "userType": "subscriber"
}
```

**400 Bad Request**

```json
{
  "error": "query params userId and channelId required"
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
