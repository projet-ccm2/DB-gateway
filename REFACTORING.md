# Refactoring — Modifications et conseils

Ce document résume les changements effectués lors du grand refactoring du projet DB-Gateway et explique les choix, avec des conseils réutilisables.

---

## 1. Types et interdiction de `any`

### Modifications

- **`src/types/app.ts`** (nouveau) : Définition de `AppRepo` (interface du dépôt utilisé par le serveur HTTP), `AddUserInput`, `AddAchievementInput`, `AddAchievedInput`. Toutes les méthodes du repo sont typées.
- **`src/server.ts`** : `createApp(repo: any)` → `createApp(repo: AppRepo)`. Handlers avec `Request` et `Response` d’Express, plus de `req: any` / `res: any`. Gestion d’erreur avec `err: unknown` et `getErrorMessage(err)`.
- **`src/handler/jsonHandler.ts`** : `payload: any` et `msg: any` remplacés par `Payload = Record<string, unknown>`, `JsonMessage`, et par des assertions de type ciblées dans chaque handler. Type de retour explicite `JsonHandlerResult` (discriminated union).
- **`src/database/prismaDatabase.ts`** : Suppression des `(a: any)` / `(r: any)` dans les `.map()` ; les types sont inférés par Prisma.
- **`src/database/mockDatabase.ts`** : Suppression des `(a: any)` ; usage de types étendus (`achievementDTO & { channelId?: string }`) où nécessaire.
- **`src/types/global.d.ts`** : `body?: any` → `body?: unknown`, `on: any` → typage de la méthode `on`.
- **Tests** : Remplacement de `as any` par des types précis (`GatewayRepo`, `UserRepository`, interfaces de mock dans les tests Prisma).

### Pourquoi

- `any` désactive la vérification TypeScript et favorise les bugs en production. Le typage strict améliore la maintenabilité et l’autocomplétion.
- Utiliser `unknown` pour les erreurs et les données non contrôlées, puis les narrow avec des gardes ou des assertions explicites.

### Conseil

- Règle de projet : **interdire `any`** (ESLint `@typescript-eslint/no-explicit-any`). Pour les mocks complexes, privilégier des interfaces ou `unknown` + assertions ciblées.

---

## 2. Architecture : Gateway et Database

### Modifications

- **`src/database/database.ts`** : Ajout de `healthCheck(): Promise<boolean>` dans l’interface `Database` pour que Mock et Prisma aient le même contrat.
- **`src/index.ts`** : Export du type `Gateway` `{ db: Database }`, de `createPrismaGateway()` (retourne `{ db }` avec `PrismaDatabase`) et de `createApp(db: Database)` qui crée l’app Express et appelle `mountRoutes(app, db)`.
- **`src/tests/mocks/index.ts`** : `createMockGateway()` retourne `Gateway` avec `db: MockDatabase` pour les tests (import du type `Gateway` depuis `index`).

### Pourquoi

- Un seul point d’entrée données : la `Database`. Les routes reçoivent `db` et construisent les repositories puis les controllers par ressource. Le handler JSON utilise le type `GatewayRepo` (repos imbriqués) pour un autre transport éventuel.

### Conseil

- Pour les tests, utiliser `createMockGateway()` depuis `src/tests/mocks` ; pour le serveur, `createPrismaGateway()` et `createApp(db)` depuis `index`.

---

## 3. Controllers et couche routes

### Modifications

- **`src/controllers/`** : Chaque controller reçoit **un** repository (ex. `UserRepository`, `ChannelRepository`), pas un agrégat.
  - **`helpers.ts`** : Constantes HTTP (BAD_REQUEST, NOT_FOUND, etc.), `paramId`, `queryString`, `getErrorMessage`, `sendInternalError`.
  - **`healthController.ts`**, **`usersController.ts`**, … **`possessesController.ts`** : Chaque fichier exporte `createXController(repo: XRepository)` qui retourne un objet de handlers (ex. `create`, `getById`, …).
- **`src/routes/`** : Une ressource = un fichier de routes.
  - **`index.ts`** : `mountRoutes(app, db)` enregistre les routers sur des préfixes (`/health`, `/users`, `/channels`, …).
  - **`healthRoutes.ts`**, **`usersRoutes.ts`**, … **`possessesRoutes.ts`** : Chaque fichier exporte `createXxxRoutes(db: Database)` qui crée le(s) repository(s), le controller, et retourne un `express.Router()` avec les handlers montés (ex. `router.post("/", c.create)`).
- **`src/index.ts`** : `createApp(db)` crée l’app Express, appelle `mountRoutes(app, db)`. Pas de fichier `server.ts` séparé.

### Pourquoi

- Séparer routes (wiring) et controllers (logique) rend le code testable. Chaque route reçoit `db` et construit uniquement les repos nécessaires pour sa ressource.

### Conseil

- Pour une nouvelle ressource : ajouter un repository si besoin, un controller `createXController(repo)`, un fichier `createXxxRoutes(db)` qui instancie repo + controller, puis une ligne `app.use("/path", createXxxRoutes(db))` dans `mountRoutes`.

---

## 4. Point d’entrée unique (index)

### Modifications

- **`src/index.ts`** : Unique point d’entrée du programme.
  - Exporte `createPrismaGateway`, `createApp` (et le type `Gateway`). `createMockGateway()` est dans `src/tests/mocks` pour les tests.
  - Si le fichier est exécuté directement (`require.main === module`), appelle `main()` : création du gateway Prisma, création de l’app, `listen`, et gestion du signal SIGTERM (disconnect + fermeture du serveur).
- **`src/startServer.ts`** : Supprimé ; son rôle est intégré dans `index.ts`.
- **`package.json`** : `"start": "node dist/index.js"`, `"server:start": "ts-node src/index.ts"`, `"test"` (unit + integration), `"test:unit"`, `"test:integration"`, `"test:coverage"`, `"test:coverage:full"`.

### Pourquoi

- Un seul fichier à lancer (index) évite la confusion. Le build produit un seul binaire logique (`dist/index.js`).

### Conseil

- Pour les tests, importer `createApp` depuis `index` et `createMockGateway` depuis `src/tests/mocks` sans exécuter `main()`.

---

## 5. Routes HTTP (liste)

### Modifications

- Routes exposées (déléguées aux controllers) :
  - **Health** : `GET /health`.
  - **Users** : `POST /users`, `GET /users/:id`, `GET /users/:id/channels`, `GET /users/:id/badges`, `GET /users/:id/achievements`.
  - **Channels** : `POST /channels`, `GET /channels/:id`, `GET /channels/:id/users`.
  - **Type achievements** : `POST /type-achievements`, `GET /type-achievements/:id`.
  - **Achievements** : `POST /achievements`, `GET /achievements/:id`, `GET /achievements/:id/users` (route la plus spécifique avant `GET /achievements/:id`).
  - **Badges** : `POST /badges`, `GET /badges/:id`, `GET /badges/:id/users`.
  - **Achieved** : `POST /achieved`, `GET /achieved?achievementId=&userId=`.
  - **Are** : `POST /are`, `GET /are?userId=&channelId=`.
  - **Possesses** : `POST /possesses`, `GET /possesses?userId=&badgeId=`.

### Conseil

- Déclarer les routes **les plus spécifiques** avant les routes paramétrées (ex. `GET /achievements/:id/users` avant `GET /achievements/:id`).

---

## 6. Documentation API (Swagger en Markdown)

### Modifications

- **`doc/README.md`** : Index des routes avec liens vers chaque fichier de ressource.
- **`doc/*.md`** : Un fichier par ressource (health, users, channels, type-achievements, achievements, badges, achieved, are, possesses). Chaque fichier décrit en Markdown les endpoints (méthode, chemin, body, query, réponses 2xx/4xx/5xx) dans un style type Swagger.
- **`README.md`** (racine) : Nouvelle section “API Documentation (Swagger-style)” avec lien vers `doc/` et liste des fichiers.

### Pourquoi

- Une doc à jour et facile à parcourir (un fichier par ressource) aide les intégrateurs et évite que l’API soit “cachée” dans le code seul.

### Conseil

- Si vous ajoutez une route, mettre à jour le fichier `doc` correspondant et l’index `doc/README.md`. Pour un vrai Swagger/OpenAPI généré, vous pourrez plus tard dériver une spec à partir de ces descriptions ou du code.

---

## 7. Interface Database et optionnel `channelId`

### Modifications

- **`src/database/database.ts`** : `addAchievement(… channelId: string)` → `channelId?: string | null` pour être cohérent avec le handler JSON et le mock qui ne fournissent pas toujours un channel.
- **`src/database/prismaDatabase.ts`** : `addAchievement` accepte `channelId` optionnel ; passage de `channelId: a.channelId ?? undefined` à Prisma.
- **`src/repositories/achievementRepository.ts`** : Signature de `add` alignée avec l’optionnel `channelId`.

### Pourquoi

- Unifier le contrat entre Prisma, mock et API (création d’achievement sans chaîne possible).

### Conseil

- Garder les DTOs et interfaces métier alignés avec le schéma Prisma (champs optionnels vs requis) pour éviter des incohérences entre couches.

---

## 8. Tests sans `any`

### Modifications

- **`src/tests/unit/index_and_handler.unit.test.ts`** : Mock du repo pour `handleJsonMessage` avec `{} as unknown as GatewayRepo` au lieu de `as any`.
- **`src/tests/unit/userService.unit.test.ts`** : Utilisation de `UserRepository` + `MockDatabase` au lieu d’un objet partiel `as any`.
- **`src/tests/unit/jsonHandler.unit.test.ts`** : Utilisation de `channelUserDTO` pour `result.users![0].userType` au lieu de `as any`.
- **`src/tests/unit/prismaDatabase.unit.test.ts`** et **`prismaDatabase.notfound.unit.test.ts`** : Interfaces de mock (MockUserData, MockChannelData, FindManyWhere, etc.) et typage explicite des mocks Prisma au lieu de `[key: string]: any` et `data: any`.

### Pourquoi

- Les tests restent un reflet fiable du typage du projet et évitent de cacher des erreurs derrière `any`.

### Conseil

- Dans les tests, préférer des vrais types (repos, DTOs) ou des mocks typés (interfaces) plutôt que `any`. Pour des mocks partiels, `as unknown as T` est préférable à `as any` car il force à réfléchir au type attendu.

---

## 9. Constantes HTTP et lisibilité

### Modifications

- **`src/controllers/helpers.ts`** : Constantes `BAD_REQUEST`, `NOT_FOUND`, `INTERNAL_ERROR`, `SERVICE_UNAVAILABLE` pour les codes de statut, et `getErrorMessage(err)`, `sendInternalError(res, err)` pour les réponses d’erreur.

### Pourquoi

- Éviter les nombres magiques et centraliser les messages d’erreur améliore la lisibilité et les changements futurs.

### Conseil

- Centraliser codes HTTP et messages d’erreur (fichier dédié ou constantes en tête de module) pour garder une API cohérente.

---

## 10. Config et variables d’environnement

### Modifications

- **`src/config/environment.ts`** : Interface `Config` (port, nodeEnv, databaseUrl, cors.allowedOrigins). `validateConfig()` lit les variables d’environnement avec des valeurs par défaut (`getEnv`) et exporte `config` utilisé par `index.ts` (port, databaseUrl) et ailleurs si besoin.

### Pourquoi

- Centraliser l’accès aux variables d’environnement évite les `process.env` dispersés et permet de valider la config au démarrage.

### Conseil

- Utiliser `config` depuis `./config/environment` pour port, databaseUrl, etc. ; ne pas lire `process.env` directement dans la logique métier.

---

## 11. Handler JSON (types, actions, payload)

### Modifications

- **`src/handler/types/`** : Types dédiés au handler JSON : `GatewayRepo`, `handlerFn`, `JsonMessage`, `JsonHandlerResult`, `Payload` (et `index.ts` qui les réexporte).
- **`src/handler/payload.ts`** : Helpers pour parser/vérifier le payload (ex. extraction des champs, validation).
- **`src/handler/actions/`** : Un fichier par domaine (userActions, channelActions, achievementActions, …) qui exporte les handlers d’actions utilisés par le handler JSON ; **`index.ts`** agrège les actions.
- **`src/handler/jsonHandler.ts`** : Utilise les types (`JsonMessage`, `JsonHandlerResult`, `GatewayRepo`), les helpers payload et les actions pour traiter les messages JSON (sans `any`).

### Pourquoi

- Séparer types, helpers et actions par ressource garde le handler JSON lisible et testable.

### Conseil

- Pour une nouvelle action JSON : ajouter le handler dans le fichier `actions` correspondant, l’enregistrer dans `actions/index.ts`, et l’utiliser dans `jsonHandler.ts`.

---

## 12. Constructeur PrismaDatabase (typage TypeScript)

### Modifications

- **`src/database/prismaDatabase.ts`** : Quand `databaseUrl` est absent, appel à `new PrismaClient()` sans argument au lieu de `new PrismaClient({})`. Avec `{}`, le type `PrismaClientOptions` exigeait la propriété `datasources` ; sans argument, Prisma utilise la source définie dans le schéma (ex. `DATABASE_URL`).

### Pourquoi

- Corriger l’erreur TypeScript à la compilation et aux tests : le constructeur sans argument est valide et évite de passer un objet d’options incomplet.

### Conseil

- Pour une URL personnalisée, passer `{ datasources: { db: { url: databaseUrl } } }` ; sinon ne rien passer pour utiliser la config par défaut.

---

## 13. Mocks dans `src/tests/mocks/`

### Modifications

- **`src/database/mockDatabase.ts`** : Déplacé vers **`src/tests/mocks/mockDatabase.ts`** (et **`src/tests/mocks/index.ts`** pour les exports). Le mock n’est utilisé que par les tests, il ne fait plus partie du code de production.

### Pourquoi

- Séparer clairement le code de production des mocks de test et éviter de les exposer dans le build applicatif.

### Conseil

- Importer le mock depuis `src/tests/mocks` (ou via le chemin configuré dans les tests) ; le reste de l’app n’a pas besoin de le connaître.

---

## 14. Restructuration des tests unitaires

### Modifications

- **Arborescence** : Les tests unitaires suivent la structure du code source : `src/tests/unit/config/`, `database/`, `repositories/`, `controllers/`, `routes/`, `handler/`, `index/`, `services/`, `utils/`.
- **Un fichier par module** : Un fichier de test par repository (ex. `userRepository.unit.test.ts`, `channelRepository.unit.test.ts`), par controller, par fichier de routes. L’ancien fichier monolithique `repositories.unit.test.ts` a été supprimé et remplacé par des fichiers dédiés.
- **`prismaDatabase.unit.test.ts`** : Les cas “not found” (ancien `prismaDatabase.notfound.unit.test.ts`) ont été fusionnés dans un seul fichier `prismaDatabase.unit.test.ts`.
- **Nouveaux fichiers** : Tests unitaires pour tous les controllers, toutes les routes, `handler/jsonHandler`, `handler/payload`, `controllers/helpers`, `index` et `server`.

### Pourquoi

- Un fichier de test par fichier source facilite la navigation et la maintenance. La structure miroir rend la localisation des tests évidente.

### Conseil

- Conserver cette convention : un fichier `X.unit.test.ts` à côté (dans l’arborescence miroir) du fichier `X.ts` qu’il teste.

---

## 15. Tests d’intégration (repositories et base)

### Modifications

- **Fichiers d’intégration** : Un fichier `.integ.test.ts` par repository (user, channel, typeAchievement, achievement, badge, achieved, are, possesses) plus **`database.integ.test.ts`** pour le health check et des cas limites UserRepository.
- **Couverture** : Pour chaque repository, tests d’ajout, de récupération par id (ou clés composites), et cas “not found”. Les tests s’exécutent contre une base MySQL (conteneur Docker) via la config d’intégration.

### Pourquoi

- Valider le comportement réel avec Prisma et la base, en plus des tests unitaires mockés.

### Conseil

- Lancer les tests d’intégration avec `npm run test` (ou la config Jest dédiée) après avoir démarré le conteneur de test ; garder les tests unitaires rapides et sans dépendance externe.

---

## 16. Suppression des commentaires

### Modifications

- **`src/`** et **`src/tests/`** : Suppression de tous les commentaires (lignes `//`, blocs `/* */`, `/** */`), y compris les `eslint-disable-next-line`, pour ne garder que le code et les noms explicites.

### Pourquoi

- Réduire le bruit et éviter les commentaires obsolètes ; le code et les noms de symboles doivent rester la source de vérité.

### Conseil

- Préférer des noms de variables/fonctions explicites et du code lisible ; n’ajouter des commentaires que pour expliquer un “pourquoi” non évident (règles métier, contournements).

---

## Résumé des fichiers créés / modifiés

| Fichier | Action |
|---------|--------|
| `src/config/environment.ts` | Créé (Config, port, databaseUrl, cors) |
| `src/controllers/helpers.ts` | Créé |
| `src/controllers/healthController.ts` … `possessesController.ts` | Créés |
| `src/database/database.ts` | Modifié (healthCheck, channelId optionnel) |
| `src/database/mockDatabase.ts` | Modifié (healthCheck, typage), puis déplacé vers `src/tests/mocks/` |
| `src/database/prismaDatabase.ts` | Modifié (channelId optionnel, typage map, constructeur sans `{}` si pas d’URL) |
| `src/index.ts` | Point d’entrée unique (Gateway, createPrismaGateway, createApp, main ; remplace startServer) |
| `src/startServer.ts` | Supprimé (fusionné dans index) |
| `src/routes/index.ts` | Créé (mountRoutes) |
| `src/routes/healthRoutes.ts` … `possessesRoutes.ts` | Créés (createXxxRoutes(db)) |
| `src/handler/types/` (gatewayRepo, handlerFn, jsonMessage, jsonHandlerResult, payload, index) | Créés |
| `src/handler/payload.ts` | Créé |
| `src/handler/actions/*.ts` + `index.ts` | Créés (handlers par ressource) |
| `src/handler/jsonHandler.ts` | Refait (payload/msg typés, JsonHandlerResult) |
| `src/repositories/achievementRepository.ts` | Modifié (channelId optionnel) |
| `src/types/global.d.ts` | Modifié (unknown au lieu de any) |
| `src/tests/mocks/mockDatabase.ts`, `index.ts` | Créés (createMockGateway, mocks dédiés aux tests) |
| `src/tests/unit/*.ts` | Modifié (suppression any) |
| `src/tests/unit/` | Restructuré (config, database, repositories, controllers, routes, handler, index, services, utils ; un fichier par module) |
| `src/tests/integration/*.integ.test.ts` | Créés (user, channel, typeAchievement, achievement, badge, achieved, are, possesses, database) |
| `doc/README.md` + `doc/*.md` | Créés |
| `README.md` | Modifié (lien vers doc/) |
| `REFACTORING.md` | Ce fichier |
| `package.json` | start, server:start, test, test:unit, test:integration, test:coverage, test:coverage:full |

---

*Refactoring effectué pour rendre le code propre, lisible, sans `any`, avec toutes les routes exposées et une documentation API centralisée dans `doc/`.*
