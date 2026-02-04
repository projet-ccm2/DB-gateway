# API DB-Gateway — Documentation des routes

Documentation au format type Swagger (Markdown) de toutes les routes HTTP exposées par le service DB-Gateway.

## Index des routes

| Ressource | Fichier | Description |
|-----------|---------|-------------|
| Santé | [health.md](./health.md) | Health check |
| Utilisateurs | [users.md](./users.md) | CRUD et sous-ressources utilisateurs |
| Chaînes | [channels.md](./channels.md) | Chaînes et utilisateurs par chaîne |
| Types d’achievement | [type-achievements.md](./type-achievements.md) | Types d’achievement |
| Achievements | [achievements.md](./achievements.md) | Achievements et utilisateurs par achievement |
| Badges | [badges.md](./badges.md) | Badges et utilisateurs par badge |
| Achieved (liaison) | [achieved.md](./achieved.md) | Liaison achievement ↔ utilisateur |
| Are (liaison) | [are.md](./are.md) | Liaison utilisateur ↔ chaîne (rôle) |
| Possesses (liaison) | [possesses.md](./possesses.md) | Liaison utilisateur ↔ badge |

## Conventions

- **Base URL** : `http://localhost:3000` (ou la valeur de `PORT`).
- **Content-Type** : `application/json` pour les corps de requête et réponses.
- **Codes** : `200` OK, `201` Created, `400` Bad Request, `404` Not Found, `500` Internal Server Error, `503` Service Unavailable.
