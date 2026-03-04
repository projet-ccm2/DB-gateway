# Channels

## POST /channels

Creates a channel.

### Body (JSON)

| Field | Type   | Required | Description  |
| ----- | ------ | -------- | ------------ |
| id    | string | yes      | Channel ID   |
| name  | string | yes      | Channel name |

### Responses

**201 Created**

```json
{
  "id": "channel-id",
  "name": "ChannelName"
}
```

**400 Bad Request**

```json
{
  "error": "id required"
}
```

```json
{
  "error": "name required"
}
```

**500 Internal Server Error**

```json
{
  "error": "Internal server error"
}
```

---

## GET /channels/:id

Returns a channel by ID.

### Path parameters

| Name | Type   | Description |
| ---- | ------ | ----------- |
| id   | string | Channel ID  |

### Responses

**200 OK**

```json
{
  "id": "channel-id",
  "name": "ChannelName"
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

## PUT /channels/:id

Updates a channel by ID.

### Path parameters

| Name | Type   | Description |
| ---- | ------ | ----------- |
| id   | string | Channel ID  |

### Body (JSON)

| Field | Type   | Required | Description      |
| ----- | ------ | -------- | ---------------- |
| name  | string | no       | New channel name |

### Responses

**200 OK**

```json
{
  "id": "channel-id",
  "name": "NewChannelName"
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

## GET /channels/:id/users

Lists users linked to the channel with their role.

### Path parameters

| Name | Type   | Description |
| ---- | ------ | ----------- |
| id   | string | Channel ID  |

### Responses

**200 OK**

```json
[
  {
    "id": "123456789",
    "username": "string",
    "profileImageUrl": null,
    "channelDescription": null,
    "scope": null,
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
