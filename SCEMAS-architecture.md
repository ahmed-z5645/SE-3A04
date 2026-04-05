# SCEMAS — Architecture Reference

> Companion document for Claude Code. This file translates every diagram from the SCEMAS deliverables (D1, D2, D3) into text form so they can be used as context when building the frontend. Pair this with the project PDFs and the React prototype (`scemas-app.jsx`).

---

## Project Summary

**SCEMAS** (Smart City Environmental Monitoring & Alert System) is a cloud-native IoT platform that ingests environmental telemetry (air quality, temperature, humidity, noise) from distributed city sensors, evaluates it against rule-based alert thresholds, and surfaces it through three interfaces: a public read-only view, an operator dashboard, and an admin dashboard. It also exposes a public REST API for third-party developers.

**Architecture style:** MVC (top-level), with subsystems using Repository (Alert Manager, Account Service) and Pipe-and-Filter (Sensors/Information Handler).

**Innovative feature:** City Rankings — ranks Canadian cities by environmental variables, with search and filtering.

---

## System Diagram (D1, Figure 1)

High-level component layout:

```
┌─────────────────────────────────────────────────────────────┐
│                        DATA LAYER                           │
│   ┌──────┐       ┌─────────────┐       ┌──────────┐         │
│   │Alerts│       │ Environment │       │ Accounts │         │
│   │  DB  │       │     DB      │       │    DB    │         │
│   └──▲───┘       └──────▲──────┘       └─────▲────┘         │
└──────┼──────────────────┼─────────────────────┼─────────────┘
       │                  │                     │
┌──────┼──────────────────┼─────────────────────┼─────────────┐
│      │    DISPATCHER / SYSTEM (Controller)    │             │
│  ┌───┴──────┐     ┌─────┴────┐       ┌────────┴──────┐      │
│  │  Alert   │     │ Sensors  │       │    Account    │      │
│  │Management│     │          │       │    Service    │      │
│  └────┬─────┘     └──────────┘       └───────────────┘      │
│       │                                                     │
│       │ ┌─────────────┐                                     │
│       └─┤Google Maps  │◄── EXTERNAL API                     │
│         │     API     │                                     │
│         └─────────────┘                                     │
└─────────────────────────────────────────────────────────────┘
                          ▲   ▲
                          │   │
┌─────────────────────────┼───┼─────────────────────────────┐
│                  USER INTERFACES                          │
│         ┌────────┐              ┌──────────────────┐      │
│         │ Public │              │ City Web Dashboard│     │
│         └────────┘              └──────────────────┘      │
└───────────────────────────────────────────────────────────┘
```

---

## Actors (from Use Case Diagram — D1, Figure 2)

| Actor | Role |
|---|---|
| **Public Users** | Read-only access to overview + rankings. Can log in. |
| **City Operators** | Acknowledge alerts, view dashboards, process telemetry. |
| **City Administrators** | All operator rights + define alert rules, manage accounts. |
| **Third-Party Developers** | Access public API. |
| **Environmental Organizations** | Access public API for reporting. |
| **Weather Companies** | Access public API for forecasting integration. |

## Use Cases (D1, Figure 2)

Inside the SCEMAS system boundary:
- **Display Dashboard Data** — used by operators/admins
- **View Dashboard** `<<includes>>` Login
- **Login** `<<includes>>` Verify Credentials
- **Acknowledge Alert** `<<includes>>` Archive Alert
- **Process Telemetry** `<<extends>>` Validate Message
- **Define Alert** (admin only)
- **Access API** (external actors)

---

## Analysis Class Diagram (D2, Figure 1)

Three controller subsystems, each with boundary/entity classes attached (MVC — Entity-Boundary-Controller):

### Account Subsystem

```
[Account DB] ◄──── [Account Information] ────► [Account Controller]
                                                      │
                     ┌────────────────────────────────┼────────────────┐
                     │         │          │          │         │      │
                 [Login   [Login    [Login    [Create   [Edit    [Delete
                  Screen] Success]  Error]    Account]  Account] Account]
                                                      │
                                                 [Account Screen]
```

### Alert Subsystem

```
[Alert DB] ◄──── [Alert Information] ────► [Alert Controller] ◄──── [Sensor Controller]
                                                 │
          ┌──────────────┬──────────┬────────────┼──────────┬──────────┬─────────┐
          │              │          │            │          │          │         │
   [City Dashboard  [View      [Acknowledge [Archive   [Notify]   [Edit      [Alert
    Screen]         Rankings]   Alert]      Alert]                 Alert]     UI]
```

### Sensor Subsystem

```
[Sensor DB] ◄──── [Sensor Controller] ◄──── [Sensor Input]
                         │
                         ▼
                  [Alert Controller]   (forwards telemetry to alerts)
```

---

## System Architecture (D2, Figure 2)

### Model Layer
- **Account Information Manager** → backed by Account DB
- **Alert Information Manager** → backed by Alert DB
- **Telemetry Manager** → backed by Sensor DB

### Controller Layer
- **Account Controller** — ↔ Account Info Manager
- **Alert Controller** — ↔ Alert Info Manager, receives from Sensor Controller
- **Sensor Controller** — ↔ Telemetry Manager, forwards validated data to Alert Controller

### View Layer
- Public view, Operator dashboard, Admin dashboard (all talk to Controllers)

### Pipe and Filter (Sensor subsystem internals)
```
Sensors → MQTT → Validation → Aggregation → Alert Rule Evaluation → (Store + Notify)
```

### Subsystem Architecture Styles

| Subsystem | Purpose | Style |
|---|---|---|
| Alert Manager | Create, monitor, detect alerts and alert rules | Repository |
| Account Service | Create and log in to accounts | Repository |
| Sensors (Info Handler) | Accept, validate, aggregate, store telemetry | Pipe and Filter |

### Rejected Alternatives (for context)
- **Batch Sequential** — rejected; coupling sensor data reduced throughput
- **Process-Control** — not relevant (embedded systems domain)
- **PAC** — rejected; dashboards don't need layered agents
- **Blackboard** — rejected; alerts must be deterministic

---

## CRC Cards (D2, Section 4)

### Account Controller
**Type:** Controller
**Responsibilities:**
- Knows Account Information, all Account boundary classes (Login Screen, Login Success, Login Error, Edit Account, Create Account, Delete Account, Account Screen)
- Determines role-based permitted user actions for account management
**Collaborators:** All Account boundaries, Alert Controller

### Account Information (Entity)
**Responsibilities:** Knows Account DB, Account Controller, Alert Controller
**Collaborators:** Account DB, Account Controller, Alert Controller

### Account DB (Entity)
**Responsibilities:** Stores account records
**Collaborators:** Account Information

### Login Screen (Boundary)
**Responsibilities:** Handles user login events
**Collaborators:** Account Controller

### Login Success / Login Error (Boundary)
**Responsibilities:** Display success/failure login interface
**Collaborators:** Account Controller

### Edit Account / Create Account / Delete Account (Boundary)
**Responsibilities:** Handle respective account events
**Collaborators:** Account Controller

### Account Screen (Boundary)
**Responsibilities:** Displays primary account interface
**Collaborators:** Account Controller

### Alert Controller (Controller)
**Responsibilities:**
- Knows Alert Information, Account Controller, Sensor Controller
- Knows City Dashboard Screen, View Rankings, Notify, Acknowledge Alert, Archive Alert, Edit Alert, Alert UI
- Handles alert-related requests
- Determines role-based permitted actions
- Interprets incoming sensor data
**Collaborators:** All above

### Alert Information (Entity)
**Responsibilities:** Knows Alert DB, Alert Controller
**Collaborators:** Alert DB, Alert Controller

### Alert DB (Entity)
**Responsibilities:** Stores historical and active alerts
**Collaborators:** Alert Information

### Boundary classes (for Alert subsystem)
- **City Dashboard Screen** — displays city dashboard
- **View Rankings** — handles ranking view requests
- **Notify** — sends and displays notifications
- **Acknowledge Alert** — handles alert acknowledgment events
- **Archive Alert** — handles alert archiving events
- **Edit Alert** — handles alert modification events
- **Alert UI** — displays primary alert interface
All collaborate with Alert Controller only.

### Sensor Controller (Controller)
**Responsibilities:** Knows Sensor DB and Alert Controller; forwards applicable info to Alert Controller
**Collaborators:** Sensor DB, Alert Controller

### Sensor DB (Entity)
**Responsibilities:** Stores sensor data readings
**Collaborators:** Sensor Controller

---

## State Diagrams (D3, Section 2)

### Account Controller State Machine (D3, Figure 1)

```
[START]
   │
   ├──► (CreateAccount) ──► Create Success ──► [END]
   │       Email, Password         │
   │       "Create an Account"     └─► Create Fail ──► (back to CreateAccount)
   │
   └──► (Login) ──► Login Success ──► (OperatorScreen or AdminScreen)
           Email, Password│                │          │
           "Login"        │                ▼          ▼
                          │           (UpdateAccount) (ManageAccount — admin only)
                          │                │
                          │                ├──► Update Success ──► [END]
                          │                │
                          │                └──► Update Fail ──► (back to UpdateAccount)
                          │
                          └─► Login Fail ──► (back to Login)
```

### Sensor Controller State Machine (D3, Figure 2)

```
[START]
   │
   ▼
[ReceiveData]
   │ fields: Type, Location, Value
   │ "Receive data via MQTT"
   │
   ▼
[Validation]
   │ "Validate incoming data"
   │
   ├── failure ──► [InvalidData] ──► "Ignore data" ──► [END]
   │
   └── success
        │
        ▼
   [Aggregation]
        │ "Aggregate incoming data"
        │
        ▼
   [AlertRuleEvaluation]
        │ "Evaluate Data against alert rules"
        │
        ▼
   [StoreAggregatedData]
        │ "Store aggregated data in DB"
        │
        ▼
      [END]
```

### Alert Controller State Machine (D3, Figure 3)

```
[START]
   │
   ├──► [Add Alert] ──► "Add Alert with type, location/area and condition" ──► [END]
   │      fields: Type, Location, Condition
   │
   ├──► [Delete Alert Rule] ──► "Remove Alert Rule" ──► [END]
   │      field: Alert Rule
   │
   └──► [Receive Data] ──► [Alert Rule Evaluate]
         fields: Type,          │
         Location, Value, Time  │
                                ├─ No Rule Violated ──► [Store Data] ──► [Display Data] ──► [END]
                                │                       (log non-violated    (real-time, no alerts)
                                │                        data)
                                │
                                └─ Rule Violated ──► [Alert Triggered]
                                                         │ (one or more rules violated)
                                                         ▼
                                                    [Log Data]
                                                         │ fields: Alert, Value, TimeStamp, Rule Violated
                                                         ▼
                                                    [Display Alert]
                                                         │ (on dashboard)
                                                         ▼
                                                    [Notify Users]
                                                         │ (who have notifications enabled)
                                                         ▼
                                                    [Acknowledge Alert]
                                                         │ (alert resolved)
                                                         ▼
                                                    [Notify Users] ──► [END]
                                                         (alert resolved broadcast)
```

---

## Sequence Diagrams (D3, Section 3)

### Figure 4 — Account Creation & Update

```
User/Admin → Create/Edit Screen → Account Controller → Account Information → Account DB
  │                │                       │                   │                  │
  ├─Submit Details─►│                       │                   │                  │
  │                ├─createAccount()/ ─────►│                   │                  │
  │                │  editAccount()         │                   │                  │
  │                │                        ├─Encrypt Info ────►│                  │
  │                │                        ├─Store/Update ────►├─Save to DB ─────►│
  │                │                        │                   │◄─Confirm Save ───┤
  │                │                        │◄──Success Status──┤                  │
  │                │                        ├─Log execution ───►│                  │
  │                │◄─Display Success ──────┤                   │                  │
  │◄─Account Ready─┤                        │                   │                  │
```

### Figure 5 — Login & Authentication

```
User → Login Screen → Account Controller → Account Information → Account DB
  │         │                │                     │                 │
  ├─Submit─►│                │                     │                 │
  │         ├─verifyCreds()─►│                     │                 │
  │         │                ├─Encrypt input ─────►│                 │
  │         │                ├─fetchUserRecord() ─►├─Query Creds ───►│
  │         │                │                     │◄─Return Record──┤
  │         │                │◄──User Data Payload─┤                 │
  │         │                │                     │                 │
  │         │                │   [Valid Path]                        │
  │         │                ├─Determine perms (RBAC)                │
  │         │                ├─Log execution (success) ─────────────►│
  │         │◄─Auth token────┤                                       │
  │◄─Route to Dash/Public ───┤                                       │
  │         │                │                                       │
  │         │                │   [Invalid Path]                      │
  │         │                ├─Log execution (fail) ────────────────►│
  │         │◄─Auth Error────┤                                       │
  │◄─Display Error & Retry───┤                                       │
```

### Figure 6 — Sensor Telemetry & Auto-Alerting Pipeline

```
IoT Sensor → Sensor Controller → Sensor DB → Alert Controller → Alert Info → Alert DB
    │               │                 │              │                │           │
    ├─Collect & ───►│                 │              │                │           │
    │ Send (MQTT)   ├─Accept & unpack │              │                │           │
    │               │                 │              │                │           │
    │               │  [Invalid Payload]             │                │           │
    │               ├─Log Data Validation Failed ───────────────────────────────►│
    │◄─Reject Message                                │                │           │
    │               │                                │                │           │
    │               │  [Valid Payload]               │                │           │
    │               ├─Process (clean+validate)       │                │           │
    │               ├─Store telemetry ──────────────►│                │           │
    │               ├─Forward aggregated ─────────── │───────────────►│           │
    │               │                                ├─Detect alerts  │           │
    │               │                                │ (vs thresholds)│           │
    │               │                                │                │           │
    │               │   [Violates Threshold]         │                │           │
    │               │                                ├─Determine dest │           │
    │               │                                ├─Generate Alert │           │
    │               │                                ├─Save Active ──►├──────────►│
    │               │                                │◄─Confirmed ────│◄──────────┤
    │               │                                │◄─Alert ID──────┤           │
    │               │                                ├─Trigger notifs │           │
    │               │                                ├─Log execution ────────────►│
    │               │                                │                │           │
    │               │   [Normal Telemetry]           │                │           │
    │               │                                ├─Log routine ──────────────►│
```

### Figure 7 — Operator Dashboard: Acknowledge Alert

```
City Operator → Alert UI → Alert Controller → Alert Information → Alert DB
      │            │               │                  │                │
      ├─Mark finished─►            │                  │                │
      │            ├─acknowledge(alertID)─►           │                │
      │            │               ├─updateStatus(archived)─►          │
      │            │               │                  ├─Archive Request ─►
      │            │               │                  │◄─Success Confirmation ─┤
      │            │               │◄─Updated Alert ──┤                │
      │            │               ├─Notify users (Resolved)           │
      │            │               ├─Log execution ─────────────────── ─►
      │            │◄─Update Display (remove from active)              │
      │◄─Alert Cleared                                                 │
      │            │                                                   │
      │            │   [DB Update Fails]                               │
      │            │               │                  │◄─DB Error ─────┤
      │            │               │◄─Update Failed ──┤                │
      │            │               ├─Log fail ───────────────────────►│
      │            │◄─System Error Message                            │
      │◄─"Failed to close alert. Please retry."                       │
```

### Figure 8 — Public API Access

```
Client → API → Sensor Controller → Sensor DB
   │      │            │                │
   ├─GET /api/v1/sensors/{zoneID}        │
   │      ├─validateRequest(API_Key, Client_IP)     │
   │      │                                          │
   │      │  [Invalid API Key]                       │
   │      ├─Log Unauthorized Access                  │
   │◄─401 Invalid API Key ──                         │
   │      │                                          │
   │      │  [Rate Limit Exceeded]                   │
   │      ├─Log rate limit blocked                   │
   │◄─429 Too Many Requests ──                       │
   │      │                                          │
   │      │  [Data Found]                            │
   │      ├─Requested metrics payload ──►            │
   │      │            ├─Mask sensitive data (GPS)   │
   │      │            ├─Format JSON response        │
   │      │            ├─Log API Access Success      │
   │      │◄─200 OK + JSON Payload                   │
   │◄─Delivered Environmental Data                   │
```

### Figure 9 — Generate City Rankings (Innovative Feature)

```
User → View Rankings Screen → Alert Controller → Sensor DB → Logs DB
  │             │                     │                │           │
  ├─Request (filters)─►               │                │           │
  │             ├─fetchRankings(filters)─►             │           │
  │             │                     ├─Retrieve historical/aggregated data ─►
  │             │                     │◄─Environmental Datasets ────┤
  │             │                     ├─Aggregate & Rank (1=Best)   │
  │             │                     ├─Log execution (Rankings accessed) ──►
  │             │◄─Sorted City Rankings Data                        │
  │◄─Display Rankings Dashboard                                     │
```

---

## Detailed Class Diagram Summary (D3, Figure 10)

Key classes and their responsibilities (simplified attribute list):

### Account Domain

**`AccountType`** (enum): `OPERATOR`, `ADMIN`

**`AccountInformation`**
- `email: string`
- `password: string`
- `account_type: AccountType`

**`AccountDB`**
- `fetchAccount(info): AccountInformation`
- `updateAccount(oldInfo, newInfo): boolean`
- `addAccount(new_account_info): boolean`

**`AccountManagement`** (abstract, shared by Account Controller)
- `alert_manager: AlertManagement`
- `account_db: AccountDB`
- `account_login: AccountLogin`
- `account_creator: CreateAccount`
- `account_viewer: ViewAccount`
- `account_editor: EditAccount`
- `current_msg: AccountMessageDisplay`
- `current_screen: AccountScreenDisplay`
- Methods: `login()`, `createAccount()`, `viewAccount()`, `editAccount()`, `admin_passwords(*)`

**`AccountController`** (extends AccountManagement)

**`AccountLogin`** · `AccountPassword` · `AccountMessageDisplay` · `AccountScreenDisplay`

**Boundary Screens** (all implement `AccountScreenDisplay`):
- `LoginScreen`, `CreateAccountScreen`, `OperatorScreen`, `AdminScreen`, `EditAccountScreen`

**Boundary Messages** (all implement `AccountMessageDisplay`):
- `AccountSuccess`, `AccountFail`

### Alert Domain

**`SortType`** (enum): `WORST_FIRST`, `BEST_FIRST`, `BY_COUNTRY`, `BY_NAME`, `BY_POPULATION`

**`AlertInformation`**
- `alert_id: string`
- `alert_data: Data`

**`AlertDB`**
- `retrieveAlert(info): AlertInformation`
- `updateAlert(oldInfo, newInfo): boolean`
- `addAlert(new_alert_info): boolean`

**`AlertManagement`** (abstract)
- `account_manager: AccountManagement`
- `sensor_manager: SensorManagement`
- `alert_editor: EditAlert`
- `alert_viewer: ViewAlert`
- `alert_creator: CreateAlert`
- `alert_logger: LogAlert`
- `alert_acknowledger: AcknowledgeAlert`
- `alert_notifier: NotifyAlert`
- `current_alert: DisplayAlertScreens`
- Methods: `editAlert()`, `viewAlert()`, `createAlert()`, `logAlert()`, `acknowledgeAlert()`, `notifyAlert()`

**`AlertController`** (extends AlertManagement)
- Adds `RankingScreen`, `rankings_screen: RankingScreen`
- Methods: `searchCity()`, `setSort(sort_type)`, `displayRank(spec)`

**Alert Boundary Classes**:
- `EditAlert`, `ViewAlert`, `CreateAlert`, `LogAlert`, `AcknowledgeAlert`, `NotifyAlert`
- `DisplayAlertScreens` (abstract): `EditAlertScreen`, `OperatorAlertScreen`, `PublicAlertScreen`

### Sensor Domain

**`SensorInformation`**
- `sensor_id: string`
- `sensor_data: HashMap<String, String>`

**`SensorDB`**
- `retrieveSensor(info): SensorInformation`
- `updateSensor(info): boolean`
- `addSensor(new_sensor_info): boolean`

**`SensorManagement`** (abstract)
- `sensor_components: ArrayList<SensorComponent>`
- `powerOn()`, `powerOff()`, `getSensorInfo(): SensorInformation`

**`SensorController`** (extends SensorManagement)
- `alert_manager: AlertManagement`
- `sensor: Sensor`

**`Sensor`**: Physical sensor wrapper

---

## Functional Requirements Summary

### Main Business Events
1. **BE1** — Process sensor telemetry (MQTT → validate → store → aggregate → alert check)
2. **BE2** — Login (credentials → verify → route by role)
3. **BE3** — View Dashboard (operators/admins view map, alerts, historical data)
4. **BE4** — Acknowledge Alert (operator clicks → view details → mark finished → archive → notify)
5. **BE5** — Access Public API (rate-limited, key-based, JSON responses with masked coordinates)
6. **BE6** — Define Rule-Based Alert (admin only — name, zone, metric, threshold)

### Viewpoints (Actor-specific handlers)
- **VP1** Public Users
- **VP2** City Operators
- **VP3** City Administrators
- **VP4** Third-Party Developers
- **VP5** Environmental Organizations
- **VP6** Weather Companies

---

## Non-Functional Requirements (Frontend-relevant)

### Look & Feel
- **LF-A1** — Avoid bright/saturated colors on backgrounds (reserved for alerts)
- **LF-A2** — Minimalist design, good negative space, universal symbols (X over "Close")
- **LF-A3** — Distinct colors per element type (e.g., all buttons same color)
- **LF-A4** — Single consistent font
- **LF-S1** — 3-click maximum navigation depth from start page
- **LF-S2** — Responsive scaling across screen sizes
- **LF-S3** — **Alert indicator must appear on every page** (persistent bell/notification)

### Usability
- **UH-EOU1** — In-app feedback submission
- **UH-EOU2** — Operator must acknowledge alert within 30 seconds (UI must minimize clicks)
- **UH-PI1** — Language preference selector
- **UH-PI2** — Metric/Imperial unit toggle
- **UH-L1** — Third-party devs can learn API in 2 hours (docs must be clear)
- **UH-A1** — Colorblind-compatible palette

### Performance
- **PR-SL1** — Sensor response time < 5 min
- **PR-SL2** — App startup < 1.5 seconds
- **PR-PA1** — 95%+ overall accuracy
- **PR-RA1** — 99% uptime
- **PR-RFT1** — Graceful handling of exceptional inputs (no crashes)
- **PR-C1** — Handle 3M+ concurrent users

### Security
- **SR-AC1** — Role-based access control (RBAC)
- **SR-INT1** — All data transfer encrypted
- **SR-P1** — Store only necessary personal info
- **SR-P2** — Zone-level data, not exact user locations
- **SR-AU1** — Audit logs for rule changes, alerts, updates
- **SR-IM1** — Reject unexpected input (prevent injection)

### Cultural/Legal
- **CP-C1** — Use standardized indices (AQI)
- **CP-P1** — Read-only REST API for public transparency
- **LR-COMP1** — No PII collection/storage
- **LR-COMP2** — City zones, not GPS coordinates
- **LR-STD1** — TLS/MQTTS for data in transit
- **LR-STD2** — Public API rate limiting

---

## Frontend Pages & Routes (Derived from the above)

Each page maps to one or more use cases. Build these as React Router routes.

| Route | Page | Roles | Source Requirements |
|---|---|---|---|
| `/login` | Login | Public/All | BE2, Fig 5 |
| `/create-account` | Create Account | Public | Fig 4 |
| `/` or `/overview` | Public Environmental Overview | Public | BE1 (VP1), LF-A2 |
| `/dashboard` | Operator/Admin Dashboard | Operator, Admin | BE3, UH-EOU2 |
| `/alerts` | Alerts List (filterable) | Operator, Admin | BE4 |
| `/alerts/:id` | Alert Detail (Acknowledge view) | Operator, Admin | BE4, Fig 7 |
| `/rules` | Alert Rules Management | Admin only | BE6 |
| `/sensors` | Sensor Status | Operator, Admin | — |
| `/rankings` | City Rankings (Innovative Feature) | All | §6 Innovative Feature, Fig 9 |
| `/accounts` | Account Management | Admin only | Account Controller |
| `/account/edit` | Edit Own Account | Operator, Admin | Fig 4 |
| `/audit` | Audit Log | Admin only | SR-AU1 |
| `/api-docs` | Public API Documentation | Public | BE5, UH-L1 |

---

## Component Mapping Hints (Boundary Classes → React Components)

| CRC Boundary Class | Suggested React Component | Page |
|---|---|---|
| `LoginScreen` | `<LoginForm>` | Login |
| `CreateAccountScreen` | `<CreateAccountForm>` | Create Account |
| `OperatorScreen` | `<OperatorDashboard>` | Dashboard |
| `AdminScreen` | `<AdminDashboard>` | Dashboard |
| `EditAccountScreen` | `<AccountSettingsForm>` | Edit Account |
| `CityDashboardScreen` | `<DashboardView>` | Dashboard |
| `ViewRankings` / `RankingScreen` | `<CityRankingsTable>` | Rankings |
| `AlertUI` / `PublicAlertScreen` | `<AlertsList>` | Alerts |
| `AcknowledgeAlert` | `<AlertDetailView>` | Alert Detail |
| `EditAlert` | `<EditAlertModal>` | Alert Detail (admin) |
| `CreateAlert` | `<CreateRuleModal>` | Rules |
| `Notify` | `<NotificationToast>` / `<AlertBell>` | Global |
| `AccountSuccess` / `AccountFail` | `<FormFeedback>` | Global |

---

## Key State Management Concerns

1. **Auth state** — current user, role, token (from `Account Controller`)
2. **Active alerts** — real-time subscription, count for persistent bell indicator
3. **Current view filters** — on Alerts, Rankings, Sensors
4. **RBAC route guards** — operators can't access `/rules`, `/accounts`, `/audit`; public can't access operator/admin routes

---

## API Endpoints (from sequence diagrams + BE5)

Based on the sequence diagrams and public API requirements:

**Public (no auth or API-key):**
- `GET /api/v1/zones` — List zones
- `GET /api/v1/sensors/{zoneID}` — Aggregated sensor data
- `GET /api/v1/alerts/active` — Active public alerts
- `GET /api/v1/rankings?sort={type}&filter={city}` — City rankings
- `GET /api/v1/historical/{zoneID}` — Historical data

**Authenticated (requires login token):**
- `POST /auth/login` — returns token + role
- `POST /auth/register` — create account
- `PUT /auth/account` — edit own account
- `GET /alerts` — all alerts (operator/admin)
- `POST /alerts/{id}/acknowledge` — mark resolved
- `POST /alerts/{id}/archive` — archive alert
- `POST /rules` — create rule (admin)
- `PUT /rules/{id}` — edit rule (admin)
- `DELETE /rules/{id}` — remove rule (admin)
- `GET /sensors` — all sensors
- `GET /audit` — audit log (admin)
- `GET /accounts` — list accounts (admin)
- `POST /accounts` — create account (admin)
- `PUT /accounts/{id}` — edit account (admin)
- `DELETE /accounts/{id}` — delete account (admin)

---

## Notes for Claude Code

1. **MQTT is backend-only** — frontend consumes REST + WebSocket (for real-time dashboard updates).
2. **Sensor hardware is simulated** per project brief — frontend should treat sensor data as arriving via API, no direct MQTT client in browser.
3. **Google Maps** is the planned mapping provider (per D1 §2.1). Use `@react-google-maps/api` or swap to Leaflet for a free alternative.
4. **3-click rule** (LF-S1): keep the nav flat. Avoid deeply nested routes.
5. **Persistent alert indicator** (LF-S3): implement as a global `<AlertBell>` component in the navbar that polls `/alerts/active` or subscribes via WebSocket.
6. **30-second acknowledge target** (UH-EOU2): Alert Detail page should have the Acknowledge button prominently placed, no extra confirmation steps.
7. **Innovative feature priority**: City Rankings is a required deliverable (§6 of D1). Don't cut it.
8. The existing prototype (`scemas-app.jsx`) uses inline styles and a single-file structure — for production, split into a proper project structure with routing, API layer, and component files.
