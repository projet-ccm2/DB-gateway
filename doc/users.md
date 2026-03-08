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
