# SCEMAS Frontend

Next.js + TypeScript frontend for the **Smart City Environmental Monitoring &
Alert System**. Scaffolded from a single-file prototype into a role-based App
Router application with a swappable mock/real API layer.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root path redirects
to `/login` (or straight to the appropriate home page if a session is
persisted in localStorage).

### Environment variables

Copy the defaults in `.env.local`:

```
NEXT_PUBLIC_API_MODE=mock              # mock | real
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=       # required for the Sensor Map view
```

The Google Maps key must have the **Maps JavaScript API** enabled and an
HTTP referrer restriction matching your dev / prod origins. Zone centroids
come from the backend — the frontend does not handle raw sensor GPS (per
architecture §LR-COMP2, §BE5).

## Roles and routes

Auth state lives in `src/lib/auth/AuthContext.tsx` and is persisted under the
`scemas.session` localStorage key. Role-gated routes sit inside the `(app)`
route group, which renders the shared `Navbar` and enforces a signed-in
session. Per-page `RoleGuard` wrappers add the fine-grained role checks:

| Route           | Admin | Operator | Public |
| --------------- | :---: | :------: | :----: |
| `/overview`     |   ●   |    ●     |   ●    |
| `/rankings`     |   ●   |    ●     |   ●    |
| `/api-docs`     |   ●   |    ●     |   ●    |
| `/dashboard`    |   ●   |    ●     |        |
| `/alerts`       |   ●   |    ●     |        |
| `/alerts/[id]`  |   ●   |    ●     |        |
| `/sensors`      |   ●   |    ●     |        |
| `/account/edit` |   ●   |    ●     |        |
| `/rules`        |   ●   |          |        |
| `/accounts`     |   ●   |          |        |
| `/audit`        |   ●   |          |        |

Public visitors can land on `/login` and click "Continue as public user" to
get a read-only session. Mock login rules (see `src/lib/api/mock/auth.ts`):
email containing `admin` → admin role, any other non-empty email → operator,
empty → auth error.

## API layer

Pages only import from `@/lib/api` — never from `mock/` or `real/` directly.
The barrel (`src/lib/api/index.ts`) picks the implementation based on the
`NEXT_PUBLIC_API_MODE` environment variable:

- `mock` (default) — simulated 180–360 ms latency with seeded data from
  `src/lib/api/mock/data.ts`.
- `real` — fetch calls against the live backend. Add a matching module under
  `src/lib/api/real/<domain>.ts` and flip the right-hand side of the barrel
  assignment. Function signatures must stay identical so pages keep working.

Domain types live in `src/lib/api/types.ts` and are the single source of
truth shared between both implementations.

## Project layout

```
src/
├── app/                       # App Router routes (file-based)
│   ├── (app)/                 # Group layout with Navbar + auth guard
│   │   ├── layout.tsx
│   │   ├── dashboard/         # admin + operator
│   │   ├── alerts/            # alerts list + [id] detail
│   │   ├── sensors/
│   │   ├── rules/             # admin-only
│   │   ├── accounts/          # admin-only
│   │   ├── audit/             # admin-only
│   │   ├── account/edit/
│   │   ├── overview/          # public overview
│   │   ├── rankings/
│   │   └── api-docs/
│   ├── login/
│   ├── create-account/
│   ├── styleguide/            # dev-only component showcase
│   ├── layout.tsx             # Root layout (fonts, AuthProvider)
│   └── page.tsx               # Root redirect
├── components/
│   ├── layout/                # Navbar, RoleGuard
│   ├── pages/                 # One file per page component
│   └── ui/                    # Button, Card, Badge, Gauge, Sparkline, …
└── lib/
    ├── api/                   # Typed service modules (mock + real)
    └── auth/                  # AuthContext + session persistence
```

## Styling

Tailwind CSS v4 with tokens defined in `src/app/globals.css` under
`@theme inline`. There is **no** `tailwind.config.ts` — all tokens
(`--color-bg`, `--color-text`, `--color-border-default`, etc.) are set from
CSS custom properties. Visit `/styleguide` to see the full component set
rendered against the token palette.

## Scripts

```bash
npm run dev       # Turbopack dev server
npm run build     # Production build
npm run start     # Serve the production build
npm run lint
```
