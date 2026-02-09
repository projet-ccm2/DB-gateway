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
  "userId": "uuid",
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
