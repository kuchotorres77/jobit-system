# Project Context

## Project

Service Marketplace Platform

### Purpose

Plataforma web para conectar personas que ofrecen servicios profesionales con usuarios que necesitan contratarlos.

Los profesionales podrán registrarse, crear un perfil, publicar los servicios que ofrecen, configurar su disponibilidad y recibir solicitudes de clientes.

Los clientes podrán buscar servicios, visualizar perfiles, consultar calificaciones, contactar profesionales y contratar servicios.

La plataforma incluirá además un panel administrativo completo para la gestión del sistema, usuarios, categorías, moderación y reportes.

---

# Repository Structure

Monorepo

```text
apps/
├── api-gateway         ← Public entrypoint, routing, auth validation
├── auth-service        ← JWT, refresh tokens, RBAC
├── provider-service    ← Professional profiles and availability
├── catalog-service     ← Categories and service catalog
├── booking-service     ← Service requests and hiring workflow
├── review-service      ← Ratings and reviews
└── realtime-service    ← Socket.IO and Redis Pub/Sub

frontend/
├── public-web          ← Public website
├── provider-portal     ← Professional dashboard
└── admin-panel         ← Administration portal
```

---

# Backend Stack

* NestJS
* TypeScript (strict mode)
* Prisma ORM
* PostgreSQL

---

# Frontend Stack

* React
* TypeScript
* Vite
* Zustand (UI/local state)
* React Query (server state)

---

# Realtime

* Socket.IO
* Redis Pub/Sub

Used for:

* Notifications
* Service requests
* Status changes
* Chat and messaging
* Administrative alerts

---

# Async Processing

* BullMQ
* Redis

Used for:

* Email sending
* Account verification
* Password recovery
* Notifications
* Scheduled jobs
* Report generation
* Content moderation

---

# Infrastructure

* Docker
* Docker Compose
* PostgreSQL
* Redis

---

# Authentication

## Authentication Strategy

* JWT Access Tokens
* Refresh Tokens
* Token Rotation
* Email Verification
* Password Recovery
* RBAC

---

# User Types

## Customer

User who searches and hires services.

Permissions:

* Register account
* Login
* Search professionals
* View profiles
* View ratings
* Create service requests
* Save favorites
* Leave reviews

---

## Provider

Professional who offers services.

Permissions:

* Register account
* Manage professional profile
* Manage availability
* Publish services
* Upload portfolio
* Receive requests
* Respond to customers
* View statistics

---

## Administrative Roles

### Super Admin

Full platform control.

Permissions:

* System configuration
* Role management
* User management
* Security settings

---

### Admin

Operational administration.

Permissions:

* User management
* Category management
* Moderation
* Reports

---

### Supervisor

Monitoring and moderation.

Permissions:

* Review content
* Review reports
* Suspend providers
* Audit activity

---

### Support

Customer support role.

Permissions:

* View users
* Resolve incidents
* Customer assistance

---

# Core Domains

## Authentication

Responsibilities:

* Registration
* Login
* JWT generation
* Refresh token management
* Email verification
* Password recovery
* RBAC

---

## Providers

Responsibilities:

* Personal information
* Professional information
* Services offered
* Availability
* Portfolio
* Location
* Professional verification
* Approval workflow

---

## Catalog

Responsibilities:

* Service categories
* Service definitions
* Public catalog configuration

Example categories:

* Electrician
* Plumber
* Gas Technician
* Carpenter
* Gardener
* Cleaner
* Painter
* Locksmith
* Computer Technician
* Air Conditioning Technician

Categories must be configurable by administrators.

---

## Booking

Responsibilities:

* Service requests
* Quotations
* Hiring workflow
* Request tracking

Workflow:

```text
CREATED
↓
ACCEPTED
↓
IN_PROGRESS
↓
COMPLETED
```

Alternative flow:

```text
CREATED
↓
REJECTED
```

---

## Reviews

Responsibilities:

* Ratings
* Reviews
* Reputation management
* Average score calculation

---

## Messaging

Responsibilities:

* Customer-provider communication
* Request-related conversations
* Notification delivery

---

# Communication Strategy

## Synchronous

* REST APIs through api-gateway
* Direct NestJS module communication within same service

---

## Asynchronous

### BullMQ

Used for:

* Email processing
* Retry mechanisms
* Scheduled notifications
* Background jobs

### Redis Pub/Sub

Used for:

* Real-time notifications
* Cross-instance communication

### EventEmitter

Used for:

* Internal service events

---

# Inter-Service Event Contracts

All shared event contracts must be defined in a shared contracts package.

| Event              | Producer         | Consumers                     |
| ------------------ | ---------------- | ----------------------------- |
| provider.created   | provider-service | admin-panel, realtime-service |
| provider.approved  | provider-service | realtime-service              |
| provider.suspended | provider-service | realtime-service              |
| booking.created    | booking-service  | realtime-service              |
| booking.accepted   | booking-service  | realtime-service              |
| booking.completed  | booking-service  | review-service                |
| review.created     | review-service   | provider-service              |
| user.authenticated | auth-service     | api-gateway                   |

---

# Service Responsibilities

## api-gateway

Responsibilities:

* Public API entrypoint
* Request routing
* JWT validation
* Rate limiting
* Request orchestration

---

## auth-service

Responsibilities:

* Registration
* Login
* JWT generation
* Refresh token rotation
* Email verification
* Password recovery
* RBAC

---

## provider-service

Responsibilities:

* Professional profiles
* Availability management
* Portfolio management
* Geographic information
* Professional verification

---

## catalog-service

Responsibilities:

* Service categories
* Service definitions
* Catalog management

---

## booking-service

Responsibilities:

* Service requests
* Quotations
* Hiring workflow
* Status tracking

---

## review-service

Responsibilities:

* Ratings
* Reviews
* Reputation management

---

## realtime-service

Responsibilities:

* Socket.IO server
* Notification delivery
* Real-time updates
* Redis Pub/Sub subscriptions
* Room management

---

# Frontend Applications

## public-web

Public website.

Features:

* Search services
* Search professionals
* Filter by category
* Filter by location
* View provider profiles
* View ratings and reviews
* Registration
* Login

---

## provider-portal

Private dashboard for professionals.

Features:

* Manage profile
* Manage services
* Manage availability
* Upload portfolio
* Receive requests
* Customer communication
* Statistics and metrics

---

## admin-panel

Administration portal.

Features:

* User management
* Provider approval
* Role management
* Category management
* Content moderation
* Reports
* Audit logs
* System configuration

---

# Geolocation

The system must support geolocation from the beginning.

Provider fields:

```text
Provider
- id
- firstName
- lastName
- city
- province
- country
- latitude
- longitude
```

Future capabilities:

* Nearby searches
* Distance calculation
* Geographic filters
* Coverage areas
* Interactive maps

---

# Portfolio System

Providers can upload evidence of previous work.

Portfolio:

```text
Portfolio
- id
- providerId
- title
- description
- imageUrl
- createdAt
```

Benefits:

* Increased trust
* Better conversion
* Professional showcase
* Reputation building

---

# Coding Preferences

* TypeScript strict mode
* No any
* DTO validation mandatory
* Explicit interfaces
* Production-ready code only
* Error handling required
* Logging required
* Security-first approach

---

# Current Priorities

1. auth-service
2. api-gateway
3. provider-service
4. catalog-service
5. booking-service
6. review-service
7. realtime-service
8. provider-portal
9. public-web
10. admin-panel

---

# Expectations From Claude

Before implementing any feature, analyze impact on:

1. Architecture — does this cross service boundaries?
2. Database — schema changes? migration needed?
3. Events — new events emitted or consumed?
4. Realtime — does this require notifications?
5. Security — authentication, authorization, validation?
6. Testing — unit, integration, e2e coverage?

Always:

* Generate production-ready code
* Respect existing architecture
* Avoid unnecessary dependencies
* Include validations and error handling
* Suggest improvements when appropriate
* Maintain clean architecture principles
* Consider scalability and maintainability
