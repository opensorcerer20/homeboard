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
- [ ] dummy data
  - [x] family/group members
  - [ ] groceries
  - [ ] shopping
  - [ ] chores (with assigned person)
  - [ ] reminders
  - [ ] messages
- [ ] front end
- [ ] database with seeding
  - [ ] see dummy data for tables
- [ ] admin page
  - [ ] add record to existing data table
  - [ ] edit
  - [ ] archive (soft delete)


**API Endpoints (initial):**
- GET /api/users: list user `id` and `name`
- POST /api/users: create a user
  - Request body (JSON): `{ name: string, password: string }`
  - Validation: `name` required; `password` minimum 6 characters
  - Response: `201 { id: number, name: string }`
  - Errors: `400` for validation; `500` on insert failure

- GET /api/list-items: list items
  - Query: `?category=string` (optional) to filter by category
  - Response: `200 { items: [{ id, name, category, sorting }] }`
- POST /api/list-items: create an item
  - Request body (JSON): `{ name: string, category?: string|null, sorting?: number }`
  - Validation: `name` required; `category` optional string; `sorting` optional integer (defaults to 0)
  - Response: `201 { id: number, name: string, category: string|null, sorting: number }`
  - Errors: `400` for validation; `500` on insert failure
- PATCH /api/list-items/:id/sorting: update sorting value
  - Request body (JSON): `{ sorting: number }`
  - Response: `200 { id: number, sorting: number }`
  - Errors: `400` invalid input; `404` not found; `500` on update failure

**Seed Data:**
- On first run (when `users` table is empty), two demo users are created: `Alice` and `Bob`.
- Passwords are hashed using bcrypt (10 rounds).

**Data Access & Repositories:**
- `src/models/db.ts`: sets up the SQLite connection and runtime settings (e.g., WAL). No table-specific logic.
- `src/repositories/usersRepository.ts`: owns the `users` table (creation, seeding) and queries like `selectAllPublic()`, `findByName()`, and `insert()`.
- App initialization calls both: `initDb()` then `initUsersRepository()` in [src/app.ts](src/app.ts).
 - `src/repositories/listItemsRepository.ts`: owns the `list_items` table with fields: `id`, `name`, `category`, `sorting`, `created_at`. Provides helpers to insert and list items globally or by `category`.
 - App initialization also calls `initListItemsRepository()` in [src/app.ts](src/app.ts).


# Future feature batches


# Notes
