# Users

## POST /users

Crée un utilisateur.

### Body (JSON)

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| username | string | oui | Nom d’utilisateur |
| twitchUserId | string | oui | Identifiant Twitch |
| profileImageUrl | string \| null | non | URL de l’avatar |
| channelDescription | string \| null | non | Description de la chaîne |
| scope | string \| null | non | Scope OAuth |

### Réponses

**201 Created**

```json
{
  "id": "uuid",
  "username": "string",
  "twitchUserId": "string",
  "profileImageUrl": null,
  "channelDescription": null,
  "scope": null
}
```

**400 Bad Request** — Champs manquants

```json
{
  "error": "username and twitchUserId required"
}
```

**500 Internal Server Error**

```json
{
  "error": "Internal server error"
}
```

---

## GET /users/:id

Retourne un utilisateur par ID.

### Paramètres de chemin

| Nom | Type | Description |
|-----|------|-------------|
| id | string | ID de l’utilisateur (UUID) |

### Réponses

**200 OK** — Objet utilisateur (même schéma que POST /users).

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

## GET /users/:id/channels

Liste les chaînes auxquelles l’utilisateur est lié, avec son rôle.

### Paramètres de chemin

| Nom | Type | Description |
|-----|------|-------------|
| id | string | ID de l’utilisateur |

### Réponses

**200 OK**

```json
[
  {
    "id": "channel-uuid",
    "name": "ChannelName",
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

---

## GET /users/:id/badges

Liste les badges possédés par l’utilisateur.

### Paramètres de chemin

| Nom | Type | Description |
|-----|------|-------------|
| id | string | ID de l’utilisateur |

### Réponses

**200 OK**

```json
[
  {
    "id": "badge-uuid",
    "title": "Badge Title",
    "img": "image.png"
  }
]
```

**500 Internal Server Error**

```json
{
  "error": "Internal server error"
}
```

---

## GET /users/:id/achievements

Liste les achievements réalisés par l’utilisateur (enregistrements « achieved »).

### Paramètres de chemin

| Nom | Type | Description |
|-----|------|-------------|
| id | string | ID de l’utilisateur |

### Réponses

**200 OK**

```json
[
  {
    "achievementId": "uuid",
    "userId": "uuid",
    "count": 1,
    "finished": false,
    "labelActive": true,
    "acquiredDate": "2024-01-01T00:00:00.000Z"
  }
]
```

**500 Internal Server Error**

```json
{
  "error": "Internal server error"
}
```
