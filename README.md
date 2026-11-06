# BorrowBox

Campus peer-to-peer borrowing and sharing platform.

Students need temporary access to things they don't own and don't want to buy — books, calculators, chargers, lab equipment, sports gear, project materials, umbrellas, formal clothes, tripods. Today that happens in WhatsApp groups and personal contacts: no central place to see what's available, no record of who has what, no way to know when something is due back, and no way to build a reputation for being reliable.

BorrowBox is that central place.

**B.Tech CSE (AI & ML) — Newton School of Technology**

---

## Status

Active development. The project is at an early stage — authentication is being built out and the borrowing workflow is not yet wired end to end.

| Area | State |
|---|---|
| User schema (enrollment ID, name, email, phone) | done |
| Signup + login API | working |
| Session persistence across refresh | **in progress** — needs `GET /api/me` |
| Frontend auth screens | built, being restructured |
| Browse / discovery | not started |
| Listing an item | not started |
| Borrow requests, approvals, returns | not started |
| Deadline reminders | not started — schema only |
| Trust / reviews | not started — schema not yet added |

If you're picking up work here, read [Auth contract](#auth-contract) and [Known gaps](#known-gaps) first.

---

## Features

Working:
- Signup with college enrollment ID, name, email, phone, password
- Password hashing (bcrypt) and login

Planned:
- Discover items by category and availability
- Request a borrow, approve or decline incoming requests
- Track active borrows and return deadlines with overdue badges
- Leave a review after a completed borrow; ratings form a trust profile

---

## Structure

```
Borrow_Box/
├── Frontend/          React 19 + Vite + Tailwind CSS v4
│   └── src/
│       ├── components/    auth screens (being split into pages/)
│       └── ...
└── Backend/           Express 5 + Prisma 7 + PostgreSQL
    ├── prisma/
    │   ├── schema.prisma
    │   └── migrations/
    └── src/
        ├── routes/        route definitions
        ├── controllers/   request handling
        ├── services/      business logic, Prisma access
        ├── middlewares/   auth guard
        └── configs/       Prisma client with pg adapter
```

Backend layers are `route → controller → service`, with Prisma calls confined to `services/`. Routes and controllers never touch Prisma directly, so a query is only ever defined in one place.

---

## Requirements

- **Node.js** 20 or newer (`node -v`)
- **npm** 10 or newer
- **PostgreSQL** 14 or newer, running locally or reachable over the network

---

## Getting started

Two terminals. Backend first, since the frontend needs it up.

### Backend

```bash
cd Backend
npm install
cp .env.example .env
```

```env
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/borrowbox?schema=public"
```

`PORT` has no fallback in `server.js` — the app will not start if it's unset.

Create the database and apply migrations:

```bash
npx prisma migrate dev
npx prisma generate
```

Start the server:

```bash
node server.js
```

Listens on `http://localhost:5000`, API mounted under `/api`.

> **Note:** `Backend/package.json` does not currently define a `start` or `dev` script. Run `node server.js` directly, or add `"start": "node server.js"` — a PR for this would be welcome.

### Frontend

```bash
cd Frontend
npm install
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:5000/api
```

One variable, holding the **full** origin including the `/api` suffix, no trailing slash. Don't split host and port into separate variables — that's how a clone without `.env` ends up requesting `http://localhost:undefined/api` with no visible error.

Start the dev server:

```bash
npm run dev
```

Opens on `http://localhost:5173`.

```bash
npm run build      # production build to dist/
npm run preview    # serve the production build locally
npm run lint       # eslint
```

`.env` is gitignored in both halves. Commit changes to `.env.example` instead.

---

## Commands

| Where | Command | Does |
|---|---|---|
| `Frontend/` | `npm run dev` | Vite dev server with HMR |
| `Frontend/` | `npm run build` | Production build → `dist/` |
| `Frontend/` | `npm run preview` | Serve the built output locally |
| `Frontend/` | `npm run lint` | ESLint (flat config) |
| `Backend/` | `node server.js` | Start the API |
| `Backend/` | `npx prisma migrate dev` | Create and apply a migration |
| `Backend/` | `npx prisma studio` | Browse the database |

---

## API

| Method | Path | Body | Returns |
|---|---|---|---|
| `POST` | `/api/register` | `{ enrollmentId, name, email, password, phone }` | `201 { message, user }` |
| `POST` | `/api/login` | `{ email, password }` | `200 { message, user }`, sets `userId` cookie |

Missing, and needed by the frontend:

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/me` | Return the current user from the cookie, so a refresh doesn't log out |
| `POST` | `/api/logout` | Clear the session cookie |

---

## Auth contract

Login sets `res.cookie("userId", user.id)` — httpOnly, 7-day expiry, `sameSite: "lax"`.

Because the cookie is httpOnly, frontend JavaScript cannot read it (which is correct), so the only way to check whether a session is live is to ask the server. Without `GET /api/me`, a page refresh drops all auth state.

`Backend/src/middlewares/login_auth.js` reads `req.session.userId`, but `express-session` is not installed and not in `package.json`, so `req.session` is `undefined` and the middleware throws. No route is guarded today.

Separately: the `userId` cookie holds a raw uuid, so a client can overwrite it with any user's id. If auth is going to read that cookie, it needs to be signed, or replaced with a JWT.

---

## Known gaps

Tracked against the problem statement, so the project report can be honest about scope:

- **Deadline reminders** — `BorrowingItem.returnDeadline` is stored, but nothing reads it. No notification model, no scheduler, no frontend countdown. The problem statement promises deadline tracking; only the column exists.
- **Trust between students** — no `Review` model. `loginController.js` returns `user.trustScore` and `user.hostelOrBlock`, but **neither field is in `schema.prisma`**, so both serialize as `undefined`. Any trust UI built against this reads nothing.
- **Search** — `Product` has no indexes beyond primary keys. Discovery queries table-scan, and category filters can't use an index.
- **Categories** — `Product.category` and `condition` are free-text `String`, so filters fragment across spellings (`books` / `Books` / `textbook`).
- **`isAvailable` duplication** — `Product.isAvailable` restates what an active `BorrowingItem` already implies. If it stays, every status transition must update both in one transaction or they drift.
- **`ReturnDate` casing** — capitalised inconsistently with `borrowDate` / `returnDeadline`. Propagates into the generated client.

---

## Conventions

**Frontend**

- Component files are PascalCase. `Login.jsx`, not `login.jsx` — lowercase filenames break on case-sensitive filesystems.
- All HTTP goes through one `api/client.js`. Components never call `fetch` directly; the wrapper handles credentials, JSON parsing, and normalising errors into one `ApiError` with a `status`.
- Auth state lives in `AuthContext`, read via `useAuth()`. Don't thread user data through props.
- Design tokens, not hex codes. Colours and radii are declared in `@theme` in `index.css` and used as `bg-brand-600`, `border-line`, `text-ink`.
- Every input gets an `id` and a matching `<label htmlFor>`, plus `aria-invalid` and `aria-describedby` on error.
- Forms validate with zod, not just HTML `required` — browser validation shows one error at a time in a native tooltip, with no feedback while typing.

**Backend**

- Prisma calls live in `services/` only.
- Controllers parse the request and shape the response; they don't build queries.
- Don't log request bodies. `createUsers.js` currently logs the plaintext password.

---

## Contributing

Frontend work is in progress. If you're starting on something, check the open issues first — several pieces depend on backend endpoints that don't exist yet, and it's cheaper to agree on the contract before building against it.

Branch, commit, open a PR against `main`. Keep commits scoped to one change.

---

## License

ISC