# Achievements

## POST /achievements

Creates an achievement.

### Body (JSON)

| Field       | Type           | Required | Description           |
| ----------- | -------------- | -------- | --------------------- |
| title       | string         | yes      | Title                 |
| description | string         | yes      | Description           |
| goal        | number         | yes      | Goal                  |
| reward      | number         | yes      | Reward                |
| label       | string         | yes      | Label                 |
| channelId   | string \| null | no       | Associated channel ID |

### Responses

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

Lists users who have completed this achievement.

### Path parameters

| Name | Type   | Description    |
| ---- | ------ | -------------- |
| id   | string | Achievement ID |

### Responses

**200 OK** — Array of user objects (id, username, twitchUserId, profileImageUrl, channelDescription, scope).

**500 Internal Server Error**

```json
{
  "error": "Internal server error"
}
```

---

## GET /achievements/:id

Returns an achievement by ID.

### Path parameters

| Name | Type   | Description           |
| ---- | ------ | --------------------- |
| id   | string | Achievement ID (UUID) |

### Responses

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
