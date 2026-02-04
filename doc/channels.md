# Channels

## POST /channels

Crée une chaîne.

### Body (JSON)

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| name | string | oui | Nom de la chaîne |

### Réponses

**201 Created**

```json
{
  "id": "uuid",
  "name": "ChannelName"
}
```

**400 Bad Request**

```json
{
  "error": "name required"
}
```

**500 Internal Server Error**

```json
{
  "error": "Internal server error"
}
```

---

## GET /channels/:id

Retourne une chaîne par ID.

### Paramètres de chemin

| Nom | Type | Description |
|-----|------|-------------|
| id | string | ID de la chaîne (UUID) |

### Réponses

**200 OK**

```json
{
  "id": "uuid",
  "name": "ChannelName"
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

---

## GET /channels/:id/users

Liste les utilisateurs liés à la chaîne avec leur rôle.

### Paramètres de chemin

| Nom | Type | Description |
|-----|------|-------------|
| id | string | ID de la chaîne |

### Réponses

**200 OK**

```json
[
  {
    "id": "user-uuid",
    "username": "string",
    "twitchUserId": "string",
    "profileImageUrl": null,
    "channelDescription": null,
    "scope": null,
    "userType": "subscriber"
  }
]
```

**500 Internal Server Error**

```json
{
  "error": "Internal server error"
}
```
