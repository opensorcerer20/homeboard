# Home Board Project

**Concept:** an open-source bulletin board made for a unix-based system (e.g. Raspberry Pi) to pair with a monitor and display information that can be updated easily and wirelessly

**Initial use case:** a family bulletin board where things like shopping lists, chores, important notes, and other things can be stored and displayed

# Initial design

**Software:**
- back end: 
  - a simple node server
  - use very simple data storage, not sure if flat file or not
  - an API that can be used to
    - read board information
    - update the board
- front end: 
  - HTML or React
  - Display page shows most current data
  - Admin page to directly modify data

**Hardware:**
- 22 inch (or so) monitor with HDMI connection
- Raspberry Pi with HDMI output, model likely doesn't matter


# Roadmap for initial product
- [x] node server
- [x] dummy data
  - [x] family/group members
  - [x] groceries
  - [x] shopping
  - [x] chores (with assigned person)
  - [x] reminders
  - [ ] messages
- [ ] front end
  - [x] uses back end data
  - [ ] updates with data updates (SSE likely needed)
- [x] database with seeding
  - [x] see dummy data for tables
- [ ] admin page
  - [ ] add record to existing data table
  - [ ] edit
  - [ ] archive (soft delete)
- [ ] version 2: let copilot write it


**API Endpoints (initial):**
- GET /api/users: list user `id` and `name`
- POST /api/users: create a user
  - Request body (JSON): `{ name: string, password: string }`
  - Validation: `name` required; `password` minimum 6 characters
  - Response: `201 { id: number, name: string }`
  - Errors: `400` for validation; `500` on insert failure

- GET /api/list-items: list items
  - Query: `?category=string` (optional) to filter by category
  - Response: `200 { items: [{ id, name, category }] }`
- POST /api/list-items: create an item
  - Request body (JSON): `{ name: string, category?: string|null }`
  - Validation: `name` required; `category` optional string
  - Response: `201 { id: number, name: string, category: string|null }`
  - Errors: `400` for validation; `500` on insert failure

**Tasks Endpoints:**
- GET /api/tasks: list tasks
  - Query: `?category=string|null` (use `null` to filter unassigned category)
  - Query: `?assignedUserId=number|null` (use `null` to filter unassigned)
  - Query: `?includeArchived=true` to include soft-deleted tasks
  - Response: `200 { items: [{ id, name, category, due_date, completed, assigned_user_id }] }`
- GET /api/tasks/:id: fetch a single task
  - Response: `200 { id, name, category, due_date, completed, assigned_user_id }`
  - Errors: `404` not found
- POST /api/tasks: create a task
  - Request body: `{ name: string, category?: string|null, due_date?: number|null, completed?: boolean, assigned_user_id?: number|null }`
  - Response: `201 { id, name, category, due_date, completed, assigned_user_id }`
  - Errors: `400` validation; `400` when `assigned_user_id` invalid; `500` on insert failure
- PATCH /api/tasks/:id: update task fields
  - Request body: any subset of `{ name, category, due_date, completed, assigned_user_id }`
  - Response: `200 { ...updated task }`
  - Errors: `400` validation; `404` not found; `500` on update failure
- PATCH /api/tasks/:id/completed: set completion state
  - Request body: `{ completed: boolean }`
  - Response: `200 { ...updated task }`
  - Errors: `400` invalid input; `404` not found; `500` on update failure
- DELETE /api/tasks/:id: soft delete
  - Response: `204`
  - Errors: `404` not found; `500` on failure
- POST /api/tasks/:id/restore: restore a soft-deleted task
  - Response: `200 { ...restored task }`
  - Errors: `404` not found; `500` on failure

**Seed Data:**
- On first run (when `users` table is empty), two demo users are created: `Alice` and `Bob`.
- Passwords are hashed using bcrypt (10 rounds).

**Data Access & Repositories:**
- `src/models/db.ts`: sets up SQLite (WAL, foreign_keys) and exposes a `tx()` helper for transactions.
- `src/models/migrations.ts`: lightweight migration runner tracked in `schema_migrations`.
- `src/models/seeds.ts`: dev-only seeding (users) when empty.
- `src/repositories/usersRepository.ts`: query helpers for users (list, findByName, insert, archive/restore). No schema init.
- `src/repositories/listItemsRepository.ts`: query helpers for list items (insert, list all/by category, update sorting). No schema init.
- App initialization now only calls `initDb()` in [src/app.ts](src/app.ts). Migrations and seeds run via scripts (see below).
- Migrations: JSON files in the `migrations/` folder named `migration_0001_<timestamp>.json` with shape:
  - `{ id: number, name: string, statements: string[] }`
  - Applied once in order by `id` and recorded in `schema_migrations`.
  - Add a new file for each schema change; do not edit past migrations.

**Database Commands:**
- `npm run db:migrate`: applies pending JSON migrations.
- `npm run db:seed`: runs dev-only seeders (e.g., demo users).
- `npm run db:reset`: deletes the SQLite file and runs migrate + seed.
  - Restriction: only allowed when `NODE_ENV=development`.
  - Tip (macOS/Linux): `NODE_ENV=development npm run db:reset`


# Future feature batches
- landscape view support

# Notes
- in the future, may need to download updates, which means database migrations would come in handy
