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

**200 OK** — Array of user objects (id, username, profileImageUrl, channelDescription, scope).

**500 Internal Server Error**

```json
{
  "error": "Internal server error"
}
```

---

## GET /achievements/channel/:channelId

Returns all achievements for a given channel with their type achievement.

### Path parameters

| Name      | Type   | Description |
| --------- | ------ | ----------- |
| channelId | string | Channel ID  |

### Responses

**200 OK** — Array of achievement objects with `typeAchievement`

```json
[
  {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "goal": 1,
    "reward": 2,
    "label": "string",
    "typeAchievement": {
      "id": "uuid",
      "label": "string",
      "data": "string"
    }
  }
]
```

`typeAchievement` may be `null` if no type is associated with the achievement.

**400 Bad Request**

```json
{
  "error": "channelId required"
}
```

**500 Internal Server Error**

```json
{
  "error": "Internal server error"
}
```

---

## GET /achievements/user/:userId/channel/:channelId

Returns all achievements for a user on a channel with complete data (achievement + typeAchievement + achieved).

### Path parameters

| Name      | Type   | Description |
| --------- | ------ | ----------- |
| userId    | string | User ID     |
| channelId | string | Channel ID  |

### Responses

**200 OK** — Object with `userId`, `channelId` and array of complete achievement objects

```json
{
  "userId": "uuid",
  "channelId": "uuid",
  "achievements": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "goal": 1,
      "reward": 2,
      "label": "string",
      "typeAchievement": {
        "id": "uuid",
        "label": "string",
        "data": "string"
      },
      "achieved": {
        "achievementId": "uuid",
        "userId": "uuid",
        "count": 1,
        "finished": false,
        "labelActive": true,
        "acquiredDate": "2024-01-01T00:00:00.000Z"
      }
    }
  ]
}
```

- `typeAchievement` may be `null` if no type is associated.
- `achieved` may be `null` if the user has no progress on this achievement.
- All achievements for the channel are returned, even without user progress.

**400 Bad Request**

```json
{
  "error": "userId and channelId required"
}
```

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
