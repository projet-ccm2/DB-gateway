# Possesses (User ↔ Badge link)

## POST /possesses

Records that a user owns a badge (acquisition date).

### Body (JSON)

| Field        | Type   | Required | Description                 |
| ------------ | ------ | -------- | --------------------------- |
| userId       | string | yes      | User ID                     |
| badgeId      | string | yes      | Badge ID                    |
| acquiredDate | string | yes      | Acquisition date (ISO 8601) |

### Responses

**201 Created**

```json
{
  "userId": "uuid",
  "badgeId": "uuid",
  "acquiredDate": "2024-01-01T00:00:00.000Z"
}
```

**400 Bad Request**

```json
{
  "error": "userId, badgeId, acquiredDate required"
}
```

**500 Internal Server Error**

```json
{
  "error": "Internal server error"
}
```

---

## GET /possesses

Returns the “possesses” record for a given (userId, badgeId) pair.

### Query

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| userId    | string | yes      | User ID     |
| badgeId   | string | yes      | Badge ID    |

### Responses

**200 OK**

```json
{
  "userId": "uuid",
  "badgeId": "uuid",
  "acquiredDate": "2024-01-01T00:00:00.000Z"
}
```

**400 Bad Request**

```json
{
  "error": "query params userId and badgeId required"
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
