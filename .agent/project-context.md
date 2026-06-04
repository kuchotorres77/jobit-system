# Project Context

## Project

Queue Management System

Purpose:

Manage public service queues, operator stations, public displays, authentication, and real-time notifications.

---

## Repository Structure

Monorepo

```
apps/
├── api-gateway       ← Public entrypoint, routing, auth validation
├── auth-service      ← JWT, refresh tokens, RBAC
├── turn-service      ← Queue management, turn lifecycle
└── realtime-service  ← Socket.IO, Redis Pub/Sub broadcast

frontend/
├── operator          ← Operator dashboard (call turns, manage queues)
└── display           ← Public display screen (current turn, announcements)
```

---

## Backend Stack

* NestJS
* TypeScript (strict mode)
* Prisma ORM
* PostgreSQL

---

## Frontend Stack

* React
* TypeScript
* Vite
* Zustand (UI/local state)
* React Query (server state)

---

## Realtime

* Socket.IO (server in realtime-service)
* Redis Pub/Sub (broadcast across service instances)

---

## Async Processing

* BullMQ (background jobs, retries, scheduling)
* Redis (BullMQ backend + Pub/Sub)

---

## Infrastructure

* Docker
* Docker Compose
* Redis (shared: BullMQ + Pub/Sub)
* PostgreSQL

---

## Authentication

* JWT Access Tokens (short-lived)
* Refresh Tokens (rotatable, stored securely)
* RBAC (roles: operator, admin, display)

---

## Communication Strategy

Synchronous:

* REST APIs through api-gateway (external clients)
* Direct NestJS module calls within same service

Asynchronous:

* BullMQ — background jobs, delayed processing, retries with dead letter
* Redis Pub/Sub — real-time broadcast between service instances (realtime-service)
* Internal NestJS EventEmitter — intra-service events

---

## Inter-Service Event Contracts

All shared event contracts must be defined in a shared contracts package.

Key events:

| Event | Producer | Consumers |
|---|---|---|
| `turn.created` | turn-service | realtime-service |
| `turn.called` | turn-service | realtime-service |
| `turn.completed` | turn-service | realtime-service |
| `user.authenticated` | auth-service | api-gateway |

Event rules:
* Events are immutable once emitted
* Consumers must be idempotent
* Contract changes require versioning

---

## Service Responsibilities

### api-gateway

* Public API entrypoint
* Routing to downstream services
* JWT validation (delegates to auth-service)
* Request orchestration
* Rate limiting

### auth-service

* User registration and login
* JWT access token generation
* Refresh token management and rotation
* Roles and permissions (RBAC)

### turn-service

* Queue management
* Turn assignment and lifecycle (created → called → completed → cancelled)
* Business rules enforcement
* Turn history

### realtime-service

* Socket.IO server
* Real-time notifications to operators and displays
* Redis Pub/Sub subscription for cross-instance broadcast
* Room management: operator rooms, display rooms

---

## Frontend Applications

### operator

* Operator dashboard
* Call next turn
* Manage queue (pause, resume)
* Real-time updates via Socket.IO

### display

* Public display screen
* Current turn number visualization
* Queue announcements
* Real-time updates via Socket.IO

---

## Coding Preferences

* TypeScript strict mode — no `any`
* DTO validation mandatory (class-validator)
* Explicit interfaces for all domain objects
* Production-ready code only — no placeholders, no TODOs as implementation gaps

---

## Current Priorities

1. auth-service — JWT + refresh tokens + RBAC
2. api-gateway — routing + auth validation + rate limiting
3. turn-service — queue management + turn lifecycle
4. realtime-service — Socket.IO + Redis Pub/Sub
5. operator frontend — dashboard + real-time
6. display frontend — public screen + real-time

---

## Expectations From Claude

Before implementing any feature, analyze impact on:

1. Architecture — does this cross service boundaries?
2. Database — schema changes? migration needed?
3. Events — new events emitted or consumed?
4. Realtime — does this need Socket.IO notification?
5. Security — new auth requirements? input validation?
6. Testing — what tests are required?

Always:

* Generate production-ready code
* Respect existing architecture
* Avoid unnecessary dependencies
* Include validations and error handling
* Suggest improvements when appropriate
