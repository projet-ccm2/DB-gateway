# Badges

## POST /badges

Creates a badge.

### Body (JSON)

| Field | Type   | Required | Description       |
| ----- | ------ | -------- | ----------------- |
| title | string | yes      | Badge title       |
| img   | string | yes      | Image name or URL |

### Responses

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

Returns a badge by ID.

### Path parameters

| Name | Type   | Description     |
| ---- | ------ | --------------- |
| id   | string | Badge ID (UUID) |

### Responses

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

Lists users who own this badge.

### Path parameters

| Name | Type   | Description |
| ---- | ------ | ----------- |
| id   | string | Badge ID    |

### Responses

**200 OK** — Array of user objects (id, username, profileImageUrl, channelDescription, scope).

**500 Internal Server Error**

```json
{
  "error": "Internal server error"
}
```
