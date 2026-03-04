# Are (User ↔ Channel link, role)

## POST /are

Links a user to a channel with a type (role).

### Body (JSON)

| Field     | Type   | Required | Description                              |
| --------- | ------ | -------- | ---------------------------------------- |
| userId    | string | yes      | User ID                                  |
| channelId | string | yes      | Channel ID                               |
| userType  | string | yes      | Role (e.g. subscriber, moderator, admin) |

### Responses

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

Returns the (user, channel, role) association for a given (userId, channelId) pair.

### Query

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| userId    | string | yes      | User ID     |
| channelId | string | yes      | Channel ID  |

### Responses

**200 OK**

```json
{
  "userId": "id",
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

---

## GET /are/user/:userId

Returns all (user, channel, role) associations for a given user.

### Path Parameters

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| userId    | string | yes      | User ID     |

### Responses

**200 OK**

```json
[
  {
    "userId": "id",
    "channelId": "channel-1",
    "userType": "moderator"
  },
  {
    "userId": "id",
    "channelId": "channel-2",
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

## GET /are/channel/:channelId

Returns all (user, channel, role) associations for a given channel.

### Path Parameters

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| channelId | string | yes      | Channel ID  |

### Responses

**200 OK**

```json
[
  {
    "userId": "user-1",
    "channelId": "uuid",
    "userType": "admin"
  },
  {
    "userId": "user-2",
    "channelId": "uuid",
    "userType": "viewer"
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

## PUT /are/:userId/:channelId

Updates the role of a user in a channel.

### Path Parameters

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| userId    | string | yes      | User ID     |
| channelId | string | yes      | Channel ID  |

### Body (JSON)

| Field    | Type   | Required | Description                              |
| -------- | ------ | -------- | ---------------------------------------- |
| userType | string | no       | Role (e.g. subscriber, moderator, admin) |

### Responses

**200 OK**

```json
{
  "userId": "id",
  "channelId": "uuid",
  "userType": "admin"
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

## DELETE /are/:userId/:channelId

Removes the link between a user and a channel.

### Path Parameters

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| userId    | string | yes      | User ID     |
| channelId | string | yes      | Channel ID  |

### Responses

**204 No Content**

(empty body)

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
