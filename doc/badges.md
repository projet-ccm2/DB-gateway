# Badges

## POST /badges

Crée un badge.

### Body (JSON)

| Champ | Type   | Obligatoire | Description           |
| ----- | ------ | ----------- | --------------------- |
| title | string | oui         | Titre du badge        |
| img   | string | oui         | Nom ou URL de l’image |

### Réponses

**201 Created**

```json
{
  "id": "uuid",
  "title": "string",
  "img": "string"
}
```

**400 Bad Request**

```json
{
  "error": "title and img required"
}
```

**500 Internal Server Error**

```json
{
  "error": "Internal server error"
}
```

---

## GET /badges/:id

Retourne un badge par ID.

### Paramètres de chemin

| Nom | Type   | Description        |
| --- | ------ | ------------------ |
| id  | string | ID du badge (UUID) |

### Réponses

**200 OK**

```json
{
  "id": "uuid",
  "title": "string",
  "img": "string"
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

## GET /badges/:id/users

Liste les utilisateurs possédant ce badge.

### Paramètres de chemin

| Nom | Type   | Description |
| --- | ------ | ----------- |
| id  | string | ID du badge |

### Réponses

**200 OK** — Tableau d’objets utilisateur (id, username, twitchUserId, profileImageUrl, channelDescription, scope).

**500 Internal Server Error**

```json
{
  "error": "Internal server error"
}
```
