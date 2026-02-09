# Achieved (Achievement ↔ User link)

## POST /achieved

Creates or updates a user’s achievement completion record.

### Body (JSON)

| Field         | Type    | Required | Description                 |
| ------------- | ------- | -------- | --------------------------- |
| achievementId | string  | yes      | Achievement ID              |
| userId        | string  | yes      | User ID                     |
| count         | number  | yes      | Count                       |
| finished      | boolean | yes      | Whether achievement is done |
| labelActive   | boolean | yes      | Label active                |
| acquiredDate  | string  | yes      | Acquisition date (ISO 8601) |

### Responses

**201 Created**

```json
{
  "achievementId": "uuid",
  "userId": "uuid",
  "count": 1,
  "finished": false,
  "labelActive": true,
  "acquiredDate": "2024-01-01T00:00:00.000Z"
}
```

**400 Bad Request**

```json
{
  "error": "achievementId, userId, count, finished, labelActive, acquiredDate required"
}
```

**500 Internal Server Error**

```json
{
  "error": "Internal server error"
}
```

---

## PUT /achieved

Updates an existing user’s achievement completion record. All fields are required.

### Body (JSON)

| Field         | Type    | Required | Description                 |
| ------------- | ------- | -------- | --------------------------- |
| achievementId | string  | yes      | Achievement ID              |
| userId        | string  | yes      | User ID                     |
| count         | number  | yes      | Count                       |
| finished      | boolean | yes      | Whether achievement is done |
| labelActive   | boolean | yes      | Label active                |
| acquiredDate  | string  | yes      | Acquisition date (ISO 8601) |

### Responses

**200 OK**

```json
{
  "achievementId": "uuid",
  "userId": "uuid",
  "count": 1,
  "finished": false,
  "labelActive": true,
  "acquiredDate": "2024-01-01T00:00:00.000Z"
}
```

**400 Bad Request**

```json
{
  "error": "achievementId, userId, count, finished, labelActive, acquiredDate required"
}
```

**404 Not Found** — No achieved record for the given (achievementId, userId) pair.

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

## GET /achieved

Returns the “achieved” record for a given (achievementId, userId) pair.

### Query

| Parameter     | Type   | Required | Description    |
| ------------- | ------ | -------- | -------------- |
| achievementId | string | yes      | Achievement ID |
| userId        | string | yes      | User ID        |

### Responses

**200 OK**

```json
{
  "achievementId": "uuid",
  "userId": "uuid",
  "count": 1,
  "finished": false,
  "labelActive": true,
  "acquiredDate": "2024-01-01T00:00:00.000Z"
}
```

**400 Bad Request**

```json
{
  "error": "query params achievementId and userId required"
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
