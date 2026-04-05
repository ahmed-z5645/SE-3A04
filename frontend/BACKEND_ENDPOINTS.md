# SCEMAS Backend Endpoints

Full list of backend endpoints required by the frontend. Derived 1:1 from
every function the frontend calls through `@/lib/api`. All are JSON under a
base like `/api/v1`, with a bearer token (except the three auth endpoints
and the public-tier endpoints listed below).

The canonical request/response shapes live in
`frontend/src/lib/api/types.ts` — that file is the contract. When the
backend is built, a matching `src/lib/api/real/<domain>.ts` module per
domain implements these calls returning those exact shapes, then the barrel
in `src/lib/api/index.ts` is flipped from `mock*` to `real*`.

---

## Auth — `src/lib/api/mock/auth.ts`

| Method | Path | Body | Returns | Notes |
|---|---|---|---|---|
| POST | `/auth/login` | `{ email, password }` | `AuthSession { token, role, email }` | 401 on invalid creds |
| POST | `/auth/register` | `{ email, password }` | `AuthSession` | Creates operator; 400 if pw < 8 chars |
| POST | `/auth/public-session` | — | `AuthSession` with `role="public"` | Read-only anon token |
| POST | `/auth/change-password` *(stub today)* | `{ currentPassword, newPassword }` | `204` | Used by `/account/edit` |

## Zones — `src/lib/api/mock/zones.ts`

| Method | Path | Returns |
|---|---|---|
| GET | `/zones` | `Zone[]` |
| GET | `/zones/{zoneId}` | `Zone \| 404` |
| GET | `/zones/trends` | `TrendSeries { aqi[], temp[], humidity[], noise[] }` (24h) |

**Zone payload must include `lat` and `lng`** — zone centroids used by the
Google Maps view on `/overview` and `/dashboard`. Per architecture §LR-COMP2
and §BE5 these are aggregated at the zone level only, not raw sensor GPS.

## Alerts — `src/lib/api/mock/alerts.ts`

| Method | Path | Returns |
|---|---|---|
| GET | `/alerts?status={active\|acknowledged\|resolved}` | `Alert[]` (status optional) |
| GET | `/alerts/{id}` | `Alert \| 404` |
| POST | `/alerts/{id}/acknowledge` | updated `Alert` |
| POST | `/alerts/{id}/resolve` | updated `Alert` |

## Sensors — `src/lib/api/mock/sensors.ts`

| Method | Path | Returns |
|---|---|---|
| GET | `/sensors` | `Sensor[]` |
| GET | `/sensors/{id}` | `Sensor \| 404` |

## Rankings — `src/lib/api/mock/rankings.ts`

| Method | Path | Returns |
|---|---|---|
| GET | `/rankings?sortBy={aqi\|temp\|noise\|humidity}&search={q}` | `City[]` |

## Rules — `src/lib/api/mock/rules.ts` (admin)

| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/rules` | — | `Rule[]` |
| POST | `/rules` | `{ name, condition, zone }` | created `Rule` |
| DELETE | `/rules/{id}` | — | `204` |

## Accounts — `src/lib/api/mock/accounts.ts` (admin)

| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/accounts` | — | `Account[]` |
| POST | `/accounts` | `{ email, password, role }` | created `Account` |
| DELETE | `/accounts/{email}` | — | `204` |

## Audit — `src/lib/api/mock/audit.ts` (admin)

| Method | Path | Returns |
|---|---|---|
| GET | `/audit` | `AuditLogEntry[]` |

## API Docs metadata — `src/lib/api/mock/apiDocs.ts`

| Method | Path | Returns |
|---|---|---|
| GET | `/meta/endpoints` | `ApiEndpoint[]` (for the `/api-docs` page) |

---

## Auth / RBAC enforcement the backend must do

Role gating on the frontend (`RoleGuard`) is defense-in-depth only. The
backend must independently enforce:

- **Public role**: only `GET /zones`, `GET /zones/{id}`, `GET /zones/trends`,
  `GET /alerts?status=active`, `GET /rankings`, `GET /meta/endpoints`.
- **Operator**: everything public plus all `/alerts/*`, `/sensors/*`,
  `POST /alerts/{id}/acknowledge|resolve`, `POST /auth/change-password`.
- **Admin**: everything, including `/rules/*`, `/accounts/*`, `/audit`.

Rate limiting and the `X-API-Key` header are only advertised by the public
`/api-docs` page for third-party integrations — they're separate from the
session-token auth used by the SCEMAS frontend itself.
