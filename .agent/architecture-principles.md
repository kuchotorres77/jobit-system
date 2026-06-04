# Architecture Principles

## Core Philosophy

Prioritize:

* Simplicity over cleverness
* Maintainability over premature optimization
* Explicit code over implicit behavior
* Low coupling, high cohesion
* Strong typing throughout

---

## Hexagonal Architecture (Ports & Adapters)

Each NestJS service follows hexagonal boundaries:

```
Adapters (in)     → Domain (application + domain) → Adapters (out)
Controllers/Guards   Services / Use Cases            Repositories / Event Publishers
DTOs                 Domain Entities                 Prisma / Redis / BullMQ
```

Rules:
* Domain logic must not import from infrastructure (Prisma, Redis, HTTP)
* Use interfaces (ports) to invert dependencies
* Adapters implement ports — never the reverse

---

## Backend Architecture

* NestJS is the standard backend framework
* TypeScript strict mode required — no `any`
* Feature-first module organization: one module per domain feature
* Business logic stays inside services — controllers stay thin
* Use `ConfigService` for all configuration — never `process.env` directly in business code

---

## Microservices

* Each service has a single, clear responsibility
* Services do not share databases — each owns its data
* Services communicate through versioned contracts
* Prefer asynchronous (event-driven) communication over synchronous for state changes
* Synchronous (REST) communication is acceptable for queries and user-facing responses

---

## Resilience Patterns

### Circuit Breaker
When a downstream service is unavailable, fail fast rather than cascade. Do not implement custom circuit breakers — use a library (e.g., `opossum`) or handle at the infrastructure level.

### Retry with Backoff
BullMQ jobs must define: max attempts, exponential backoff, and dead letter queue behavior.

### Saga Pattern
For distributed transactions across services (e.g., creating a turn requires auth validation):
* Use choreography-based sagas (event chain) over orchestration when possible
* Each step must be compensable (define the rollback action)
* Partial failures must not leave the system in an inconsistent state

### Idempotency
All event consumers and BullMQ workers must be idempotent. Deduplication key must be included in event payload.

---

## API Design

* REST is the default external communication mechanism
* APIs must be versioned: `/api/v1/...`
* DTO validation is mandatory — use `class-validator` + `ValidationPipe`
* Swagger documentation must be maintained using `@nestjs/swagger` decorators
* Response format is consistent: `{ data, meta? }` for collections, direct object for single resources

---

## Event-Driven Design

* Events represent business facts (past tense): `turn.created`, `user.authenticated`
* Events are immutable once emitted
* Consumers must be idempotent
* Event payload must include: `eventId`, `timestamp`, `version`, `payload`
* Contract changes require version bump: `turn.created.v2`

---

## Database

* PostgreSQL is the primary database
* Prisma is the only ORM — no raw SQL except for complex analytics queries
* UUIDs as primary keys (use `@default(uuid())`)
* All migrations generated via Prisma CLI
* FK constraints must be explicit
* Indexes must be reviewed for every new query pattern
* Services do not share database schemas — each service owns its models

---

## Security

* Authentication through JWT (access + refresh token rotation)
* Authorization through RBAC — NestJS guards enforce roles
* Input validation is mandatory on every controller endpoint
* Secrets must never be hardcoded — use ConfigModule + environment variables
* Rate limiting on auth endpoints and public-facing APIs
* CORS configured explicitly — no wildcard in production

---

## Frontend

* React with TypeScript — strict mode
* Functional components only
* Server state: React Query (API calls, caching, mutations)
* UI/local state: Zustand
* Feature folders: `features/[feature]/components|hooks|store|types`
* API response types must match backend DTO types — define shared type contracts

---

## Realtime

* Socket.IO handles all WebSocket connections in realtime-service
* Redis Pub/Sub enables broadcast across multiple realtime-service instances
* Rooms separate operator and display clients
* JWT authentication required on WebSocket handshake
* Reconnection must be handled gracefully on the client side

---

## Testing

* Critical business logic requires unit tests
* API flows require integration tests (Supertest)
* Critical user flows require E2E tests (Playwright)
* Regression tests are required for every bug fix
* Mocks are acceptable for unit tests — integration tests should use real dependencies when feasible

---

## Decision Rules

When multiple solutions are possible:

1. Prefer maintainability
2. Prefer explicit code over clever code
3. Prefer consistency with existing patterns over novelty
4. Prefer scalability when added complexity remains reasonable
5. When in doubt, surface the options and trade-offs — do not decide unilaterally
