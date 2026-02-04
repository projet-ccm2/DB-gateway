# Achievements

## POST /achievements

Crée un achievement.

### Body (JSON)

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| title | string | oui | Titre |
| description | string | oui | Description |
| goal | number | oui | Objectif |
| reward | number | oui | Récompense |
| label | string | oui | Libellé |
| channelId | string \| null | non | ID de la chaîne associée |

### Réponses

**201 Created**

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "goal": 1,
  "reward": 2,
  "label": "string"
}
```

**400 Bad Request**

```json
{
  "error": "title, description, goal, reward, label required"
}
```

**500 Internal Server Error**

```json
{
  "error": "Internal server error"
}
```

---

## GET /achievements/:id/users

Liste les utilisateurs ayant obtenu cet achievement.

### Paramètres de chemin

| Nom | Type | Description |
|-----|------|-------------|
| id | string | ID de l’achievement |

### Réponses

**200 OK** — Tableau d’objets utilisateur (id, username, twitchUserId, profileImageUrl, channelDescription, scope).

**500 Internal Server Error**

```json
{
  "error": "Internal server error"
}
```

---

## GET /achievements/:id

Retourne un achievement par ID.

### Paramètres de chemin

| Nom | Type | Description |
|-----|------|-------------|
| id | string | ID de l’achievement (UUID) |

### Réponses

**200 OK**

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "goal": 1,
  "reward": 2,
  "label": "string"
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
