# Homeboard v2 – Household Bulletin Board

This is a simple Node.js/Express bulletin board for a one- or two-family home. It shows shared household information (groceries, shopping, reminders, chores, and messages) and exposes the board on your local network so everyone in the house can see the same page from their phones.

At this stage the board is **read-only** and uses **hard-coded data**. Future steps will add user logins and a UI for updating the board.

## Features

- Single shared board page at `/` rendered with EJS
- Sections for:
  - Groceries
  - Other shopping
  - Reminders
  - Chores
  - Messages from household members
- Hard-coded household users with name + color for messages
- Automatically detects your local IPv4 address and shows the full URL to use on phones (for example, `http://192.168.1.23:4000`)
- Responsive layout intended for use on a TV, tablet, laptop, or phone

## Project Layout

- Server and app setup: [src/server.js](src/server.js)
- Board view template: [views/board.ejs](views/board.ejs)
- Static assets (CSS): [public/styles.css](public/styles.css)
- Project metadata and scripts: [package.json](package.json)

## Getting Started

From the repository root:

```bash
cd version2
npm install
npm start
```

By default the app listens on port `4000`. You can change this by setting `PORT`:

```bash
PORT=5000 npm start
```

Once the server is running:

1. On the machine running the server, open:
   - `http://localhost:4000` (or your chosen port).
2. At the top of the page you will see a **network URL** (for example, `http://192.168.1.23:4000`).
3. On phones or other devices on the **same Wi‑Fi network**, open that network URL in a browser to see the exact same board.

## Current Limitations (By Design)

- All users, lists, and messages are defined in code (see [src/server.js](src/server.js)).
- There is **no login system**.
- There is **no web UI** to edit items; the board is read-only.
- Changes require editing the source and restarting the server.

These constraints are intentional for this step; the next iteration will add authentication and an update UI.

## Planned Next Steps

These are ideas for future enhancements:

- Add user accounts and authentication for household members.
- Add a simple web UI to:
  - Add / remove grocery and shopping items.
  - Manage reminders and chores.
  - Post new messages.
- Persist data to a database or durable storage instead of in-memory structures.
- Add basic access control (e.g., per-household board ID, invite codes).
