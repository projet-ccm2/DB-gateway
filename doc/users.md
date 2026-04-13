# Users

## GET /users

Returns all users.

### Responses

**200 OK**

```json
[
  {
    "id": "string",
    "username": "string",
    "profileImageUrl": null,
    "channelDescription": null,
    "scope": null,
    "xp": 0,
    "lastUpdateTimestamp": "2026-02-20T12:00:00.000Z"
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

## POST /users

Creates a user.

### Body (JSON)

| Field               | Type           | Required | Description                      |
| ------------------- | -------------- | -------- | -------------------------------- |
| id                  | string         | yes      | Twitch user ID                   |
| username            | string         | yes      | Username                         |
| profileImageUrl     | string \| null | no       | Avatar URL                       |
| channelDescription  | string \| null | no       | Channel description              |
| scope               | string \| null | no       | OAuth scope                      |
| xp                  | number         | no       | Experience points (default 0)    |
| lastUpdateTimestamp | string         | yes      | ISO 8601 datetime of last update |

### Responses

**201 Created**

```json
{
  "id": "string",
  "username": "string",
  "profileImageUrl": null,
  "channelDescription": null,
  "scope": null,
  "xp": 0,
  "lastUpdateTimestamp": "2026-02-20T12:00:00.000Z"
}
```

**400 Bad Request** — Missing fields

```json
{
  "error": "username, id and lastUpdateTimestamp required"
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

Returns a user by ID.

### Path parameters

| Name | Type   | Description |
| ---- | ------ | ----------- |
| id   | string | User ID     |

### Responses

**200 OK** — User object (same schema as POST /users).

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

## PUT /users/:id

Updates a user by ID.

### Path parameters

| Name | Type   | Description |
| ---- | ------ | ----------- |
| id   | string | User ID     |

### Body (JSON)

| Field               | Type           | Required | Description                      |
| ------------------- | -------------- | -------- | -------------------------------- |
| username            | string         | no       | Username                         |
| profileImageUrl     | string \| null | no       | Avatar URL                       |
| channelDescription  | string \| null | no       | Channel description              |
| scope               | string \| null | no       | OAuth scope                      |
| xp                  | number         | no       | Experience points                |
| lastUpdateTimestamp | string         | no       | ISO 8601 datetime of last update |

### Responses

**200 OK** — Updated user object (same schema as POST /users).

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

Lists channels the user is linked to, with their role.

### Path parameters

| Name | Type   | Description |
| ---- | ------ | ----------- |
| id   | string | User ID     |

### Responses

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

Lists badges owned by the user.

### Path parameters

| Name | Type   | Description |
| ---- | ------ | ----------- |
| id   | string | User ID     |

### Responses

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

Lists achievements completed by the user (“achieved” records).

### Path parameters

| Name | Type   | Description |
| ---- | ------ | ----------- |
| id   | string | User ID     |

### Responses

**200 OK**

```json
[
  {
    "achievementId": "uuid",
    "userId": "User ID",
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
---

## DELETE /users/:id/all-data

**GDPR "Nuke User"** — Atomically deletes **all** data related to the given user.
This is intended for GDPR (RGPD) right-to-erasure compliance. The entire operation
runs inside a single database transaction; if any step fails the whole operation is
rolled back.

### Path parameters

| Name | Type   | Description |
| ---- | ------ | ----------- |
| id   | string | User ID     |

### What gets deleted (in order)

| Step | Data deleted                                                     |
| ---- | ---------------------------------------------------------------- |
| 1    | User's own **achieved** records                                  |
| 2    | User's own **possesses** records                                 |
| 3    | User's own **are** (channel-membership) records                  |
| 4    | Other users' **achieved** on achievements linked to user's channel |
| 5    | Other users' **possesses** for the badge linked to user's channel  |
| 6    | Other users' **are** records for user's channel                  |
| 7    | **Achievements** linked to user's channel                        |
| 8    | **Badge** linked to user's channel                               |
| 9    | User's **channel**                                               |
| 10   | The **user** record itself                                       |

> **Note:** Type achievements are **not** deleted — they are shared global
> resources not owned by any single user.

### What is NOT deleted

- Other users' records, channels, badges, or achievements
- Type achievements
- Resources of other channels where the user was only a member (those channels, their achievements, and badges remain, but the user's membership/achievement/badge records in them are deleted)

### Responses

**204 No Content** — All data deleted successfully.

**404 Not Found** — The user does not exist.

```json
{
  "error": "not found"
}
```

**500 Internal Server Error** — Transaction failed; nothing was deleted.

```json
{
  "error": "Internal server error"
}
```