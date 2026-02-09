# Type Achievements

## POST /type-achievements

Creates an achievement type.

### Body (JSON)

| Field | Type   | Required | Description     |
| ----- | ------ | -------- | --------------- |
| label | string | yes      | Type label      |
| data  | string | yes      | Associated data |

### Responses

**201 Created**

```json
{
  "id": "uuid",
  "label": "string",
  "data": "string"
}
```

**400 Bad Request**

```json
{
  "error": "label and data required"
}
```

**500 Internal Server Error**

```json
{
  "error": "Internal server error"
}
```

---

## GET /type-achievements/:id

Returns an achievement type by ID.

### Path parameters

| Name | Type   | Description    |
| ---- | ------ | -------------- |
| id   | string | Type ID (UUID) |

### Responses

**200 OK**

```json
{
  "id": "uuid",
  "label": "string",
  "data": "string"
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
