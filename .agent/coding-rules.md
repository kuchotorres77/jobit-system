# Coding Standards

## TypeScript

* Strict mode required — no `any`, no implicit `any`
* Explicit return types on all functions and methods
* Interfaces for all domain objects, DTOs, and event contracts
* `type` for unions and aliases; `interface` for objects and class contracts

---

## Backend (NestJS)

**Module organization:**
* One module per domain feature
* File naming: `user.module.ts`, `user.service.ts`, `user.controller.ts`, `user.repository.ts`
* Class naming: `UserModule`, `UserService`, `UserController`

**DTOs:**
* One DTO file per operation: `create-user.dto.ts`, `update-user.dto.ts`
* All fields decorated with `class-validator`
* Expose only necessary fields — never pass raw request objects into services

**Services:**
* Business logic lives in services — controllers only call services
* Services receive primitive types or DTOs — never Prisma models directly in domain logic
* One public method per use case

**Error handling:**
* Define custom exception classes for domain errors: `TurnNotFoundException`, `QueueFullException`
* Throw domain exceptions from services
* Global exception filter maps domain exceptions to HTTP responses
* Never swallow errors silently

**Configuration:**
* Use `ConfigService` for all environment access
* Define typed config schemas with `@nestjs/config` and Joi validation
* No `process.env.X` in business logic — only in config files

**Logging:**
* Use NestJS built-in `Logger` with class name as context: `private readonly logger = new Logger(UserService.name)`
* Log at service entry for all public methods (debug level)
* Log errors with full context (error message + stack)
* Never log sensitive data (tokens, passwords, PII)

---

## Database (Prisma)

* Schema file: `prisma/schema.prisma` — single source of truth
* All migrations generated via `prisma migrate dev` — no manual SQL
* UUID primary keys: `@default(uuid())`
* Timestamps: `createdAt DateTime @default(now())`, `updatedAt DateTime @updatedAt`
* Repository pattern wraps all Prisma calls — services never call `prisma.X` directly

---

## Events and Queues

* Event type constants in shared contracts package: `TurnEvents.CREATED = 'turn.created'`
* Event payload interface defined per event: `TurnCreatedEvent`
* BullMQ processor files: `turn-created.processor.ts`
* Max retries and backoff defined per queue — no defaults left unconfigured

---

## Frontend (React)

* Functional components only — no class components
* Custom hooks for logic extraction: `useTurnList`, `useOperatorSocket`
* Zustand stores: one per feature — `useTurnStore`, `useAuthStore`
* React Query keys: array format with feature namespace — `['turns', 'list']`, `['turns', id]`
* API client: typed functions per endpoint — `getTurns(): Promise<Turn[]>`
* No `any` in component props, state, or API responses

**File structure per feature:**
```
features/turn/
├── components/    ← UI only, no business logic
├── hooks/         ← Data fetching and side effects
├── store/         ← Zustand stores
└── types/         ← Feature-specific types
```

---

## API Response Conventions

Single resource:
```json
{ "id": "...", "name": "...", ... }
```

Collections:
```json
{
  "data": [...],
  "meta": { "total": 100, "page": 1, "limit": 20 }
}
```

Errors:
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

---

## Quality Rules

* Production ready only — no placeholder implementations
* No `TODO` as implementation gaps — a TODO must be a note, never missing code
* No commented-out code blocks
* No `console.log` in production code — use Logger
* No hardcoded values — use ConfigService or constants file

---

## Security

* JWT secrets from ConfigService — never hardcoded
* Refresh token rotation on every use
* RBAC enforced via NestJS guards — not inline `if` checks
* Rate limiting on every auth endpoint
* Input validation (`ValidationPipe`) on every controller

---

## Testing

**Naming convention:**
```
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user when valid data is provided', ...)
    it('should throw ConflictException when email already exists', ...)
  })
})
```

**Coverage minimum:**
* Unit tests: all service methods
* Integration tests: all controller endpoints (happy path + main error cases)
* E2E tests: auth flow, create turn, call turn, display update

**Test file location:**
* Unit: alongside source — `user.service.spec.ts`
* Integration: `test/` folder — `users.e2e-spec.ts`
