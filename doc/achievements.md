# Achievements

## POST /achievements

Creates an achievement.

### Body (JSON)

| Field       | Type           | Required | Description                         |
| ----------- | -------------- | -------- | ----------------------------------- |
| title       | string         | yes      | Title                               |
| description | string         | yes      | Description                         |
| goal        | number         | yes      | Goal                                |
| reward      | number         | yes      | Reward                              |
| label       | string         | yes      | Label                               |
| public      | boolean        | yes      | Whether the achievement is public   |
| active      | boolean        | yes      | Whether the achievement is active   |
| secret      | boolean        | yes      | Whether the achievement is secret   |
| image       | string         | yes      | Image URL / path                    |
| channelId   | string \| null | no       | Associated channel ID               |
| typeId      | string         | yes      | ID of an existing type achievement  |

### Responses

**201 Created**

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "goal": 1,
  "reward": 2,
  "label": "string",
  "public": false,
  "downloads": 0,
  "visits": 0,
  "active": true,
  "secret": false,
  "image": "string",
  "channelId": "uuid | null",
  "typeAchievement": {
    "id": "uuid",
    "label": "string",
    "data": "string"
  }
}
```

**400 Bad Request**

```json
{
  "error": "title, description, goal, reward, label, public, active, secret, image, typeId required"
}
```

**404 Not Found**

```json
{
  "error": "typeId not found"
}
```

**500 Internal Server Error**

```json
{
  "error": "Internal server error"
}
```

---

## DELETE /achievements/:achievementId

Permanently deletes an achievement definition and all its achieved records (atomically). Returns the deleted achievement payload (including `channelId`) so the caller can invalidate caches.

### Path parameters

| Param         | Type   | Description        |
| ------------- | ------ | ------------------ |
| achievementId | string | The achievement ID |

### Responses

**200 OK**

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "goal": 1,
  "reward": 2,
  "label": "string",
  "public": false,
  "downloads": 0,
  "visits": 0,
  "active": true,
  "secret": false,
  "image": "string",
  "channelId": "uuid | null",
  "typeAchievement": {
    "id": "uuid",
    "label": "string",
    "data": "string"
  }
}
```

**400 Bad Request**

```json
{
  "error": "achievementId required"
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

## PUT /achievements/:achievementId

Updates an existing achievement definition (reassigns type by ID).

### Path parameters

| Param         | Type   | Description        |
| ------------- | ------ | ------------------ |
| achievementId | string | The achievement ID |

### Body (JSON)

| Field     | Type    | Required | Description                        |
| --------- | ------- | -------- | ---------------------------------- |
| title     | string  | yes      | Title                              |
| description | string | yes     | Description                        |
| goal      | number  | yes      | Goal                               |
| reward    | number  | yes      | Reward                             |
| label     | string  | yes      | Label                              |
| public    | boolean | yes      | Whether the achievement is public  |
| active    | boolean | yes      | Whether the achievement is active  |
| secret    | boolean | yes      | Whether the achievement is secret  |
| image     | string  | yes      | Image URL / path                   |
| typeId    | string  | yes      | ID of an existing type achievement |

### Responses

**200 OK**

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "goal": 1,
  "reward": 2,
  "label": "string",
  "public": true,
  "downloads": 0,
  "visits": 0,
  "active": false,
  "secret": true,
  "image": "string",
  "channelId": "uuid | null",
  "typeAchievement": {
    "id": "uuid",
    "label": "string",
    "data": "string"
  }
}
```

**400 Bad Request**

```json
{
  "error": "achievementId required"
}
```

```json
{
  "error": "title, description, goal, reward, label, public, active, secret, image, typeId required"
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

## GET /achievements/public

Returns all public achievements (marketplace browsing). Includes type achievement data for card rendering and prefill usage.

### Responses

**200 OK** — Array of achievement objects with `typeAchievement` where `public` is `true`

```json
[
  {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "goal": 1,
    "reward": 2,
    "label": "string",
    "public": true,
    "downloads": 0,
    "visits": 0,
    "active": true,
    "secret": false,
    "image": "string",
    "channelId": "uuid | null",
    "typeAchievement": {
      "id": "uuid",
      "label": "string",
      "data": "string"
    }
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

## PATCH /achievements/:achievementId/activate

Activates a previously inactive achievement (sets `active` to `true`).

### Path parameters

| Name          | Type   | Description    |
| ------------- | ------ | -------------- |
| achievementId | string | Achievement ID |

### Responses

**200 OK**

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "goal": 1,
  "reward": 2,
  "label": "string",
  "public": false,
  "downloads": 0,
  "visits": 0,
  "active": true,
  "secret": false,
  "image": "string",
  "channelId": "uuid | null",
  "typeAchievement": {
    "id": "uuid",
    "label": "string",
    "data": "string"
  }
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

## PATCH /achievements/:achievementId/deactivate

Deactivates an achievement without deleting it (sets `active` to `false`).

### Path parameters

| Name          | Type   | Description    |
| ------------- | ------ | -------------- |
| achievementId | string | Achievement ID |

### Responses

**200 OK**

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "goal": 1,
  "reward": 2,
  "label": "string",
  "public": false,
  "downloads": 0,
  "visits": 0,
  "active": false,
  "secret": false,
  "image": "string",
  "channelId": "uuid | null",
  "typeAchievement": {
    "id": "uuid",
    "label": "string",
    "data": "string"
  }
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

## PATCH /achievements/:achievementId/public

Makes an achievement public (sets `public` to `true`).

### Path parameters

| Name          | Type   | Description    |
| ------------- | ------ | -------------- |
| achievementId | string | Achievement ID |

### Responses

**200 OK**

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "goal": 1,
  "reward": 2,
  "label": "string",
  "public": true,
  "downloads": 0,
  "visits": 0,
  "active": true,
  "secret": false,
  "image": "string",
  "channelId": "uuid | null",
  "typeAchievement": {
    "id": "uuid",
    "label": "string",
    "data": "string"
  }
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

## PATCH /achievements/:achievementId/private

Makes an achievement private (sets `public` to `false`).

### Path parameters

| Name          | Type   | Description    |
| ------------- | ------ | -------------- |
| achievementId | string | Achievement ID |

### Responses

**200 OK**

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "goal": 1,
  "reward": 2,
  "label": "string",
  "public": false,
  "downloads": 0,
  "visits": 0,
  "active": true,
  "secret": false,
  "image": "string",
  "channelId": "uuid | null",
  "typeAchievement": {
    "id": "uuid",
    "label": "string",
    "data": "string"
  }
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
    "public": false,
    "downloads": 0,
    "visits": 0,
    "active": true,
    "secret": false,
    "image": "string",
    "channelId": "uuid",
    "typeAchievement": {
      "id": "uuid",
      "label": "string",
      "data": "string"
    }
  }
]
```

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

## GET /achievements/user/:userId

Returns all achievement definitions enriched with the user's progression state from the `achieved` table. Only achievements where the user has at least one achieved record are returned.

### Path parameters

| Name   | Type   | Description |
| ------ | ------ | ----------- |
| userId | string | User ID     |

### Responses

**200 OK** — Array of achievement objects with `typeAchievement` and `achieved`

```json
[
  {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "goal": 5,
    "reward": 10,
    "label": "string",
    "public": false,
    "downloads": 0,
    "visits": 0,
    "active": true,
    "secret": false,
    "image": "string",
    "channelId": "uuid | null",
    "typeAchievement": {
      "id": "uuid",
      "label": "string",
      "data": "string"
    },
    "achieved": {
      "achievementId": "uuid",
      "userId": "uuid",
      "count": 3,
      "finished": false,
      "labelActive": true,
      "acquiredDate": "2024-01-01T00:00:00.000Z"
    }
  }
]
```

- `achieved` is the user's progression on this achievement (count, finished, etc.). It is always present since only achievements with user progress are returned.

**400 Bad Request**

```json
{
  "error": "userId required"
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
      "public": false,
      "downloads": 0,
      "visits": 0,
      "active": true,
      "secret": false,
      "image": "string",
      "channelId": "uuid",
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
  "label": "string",
  "public": false,
  "downloads": 0,
  "visits": 0,
  "active": true,
  "secret": false,
  "image": "string",
  "channelId": "uuid | null",
  "typeAchievement": {
    "id": "uuid",
    "label": "string",
    "data": "string"
  }
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
