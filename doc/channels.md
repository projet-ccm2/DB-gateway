# Channels

## POST /channels

Creates a channel.

### Body (JSON)

| Field             | Type         | Required | Description                                    |
| ----------------- | ------------ | -------- | ---------------------------------------------- |
| id                | string       | yes      | Channel ID                                     |
| name              | string       | yes      | Channel name                                   |
| discordWebhookUrl | string\|null | no       | Discord webhook URL (encrypted at rest)        |

### Responses

**201 Created**

```json
{
  "id": "channel-id",
  "name": "ChannelName",
  "discordWebhookUrl": null
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
  "name": "ChannelName",
  "discordWebhookUrl": "https://discord.com/api/webhooks/..."
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

| Field             | Type         | Required | Description                                    |
| ----------------- | ------------ | -------- | ---------------------------------------------- |
| name              | string       | no       | New channel name                               |
| discordWebhookUrl | string\|null | no       | Discord webhook URL (encrypted at rest)        |

### Responses

**200 OK**

```json
{
  "id": "channel-id",
  "name": "NewChannelName",
  "discordWebhookUrl": "https://discord.com/api/webhooks/..."
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

---

## GET /channels/:id/badge

Returns the badge associated with a channel.

### Path parameters

| Name | Type   | Description |
| ---- | ------ | ----------- |
| id   | string | Channel ID  |

### Responses

**200 OK**

```json
{
  "id": "badge-uuid",
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

## PUT /channels/:id/badge

Updates the badge linked to a channel.

### Path parameters

| Name | Type   | Description |
| ---- | ------ | ----------- |
| id   | string | Channel ID  |

### Body (JSON)

At least one of `title` or `img` must be provided.

| Field | Type   | Required | Description                                        |
| ----- | ------ | -------- | -------------------------------------------------- |
| title | string | no       | New badge title (non-empty after trim if provided) |
| img   | string | no       | New badge image ID or path (non-empty after trim)  |

### Responses

**200 OK**

```json
{
  "id": "badge-uuid",
  "title": "New Badge Title",
  "img": "badge-image-id-or-path"
}
```

**400 Bad Request**

```json
{
  "error": "at least one of title or img is required"
}
```

```json
{
  "error": "invalid title"
}
```

```json
{
  "error": "invalid img"
}
```

**404 Not Found**

Returned when the channel does not exist or the channel has no badge yet.

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
