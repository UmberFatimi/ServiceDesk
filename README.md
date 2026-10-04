# ServiceDesk

A small full-stack service request management app. Users can create an account, log in, and submit requests for things like plumbing, electrical work, cleaning, or IT support. Admins can see all requests and update their status.

I built this as a technical assessment for a junior full-stack role. The main focus was on authentication, role-based access, CRUD operations, validation, and keeping the project structure easy to follow. I kept the UI simple and focused on the functionality.

## Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, react-hook-form, Zod
- **Backend:** Node.js, Express, Mongoose, Zod
- **Database:** MongoDB (MongoDB Atlas was used, but a local MongoDB instance also works)
- **Authentication:** JWT, bcryptjs, and an httpOnly cookie for the token

## Project structure

```text
.
├── backend/
│   └── src/
│       ├── config/        Database connection
│       ├── controllers/   Auth and request logic
│       ├── middleware/    Auth, role checks, validation, error handling
│       ├── models/        User and ServiceRequest
│       ├── routes/
│       ├── validators/    Zod schemas
│       ├── utils/         ApiError
│       ├── app.js
│       ├── server.js
│       └── seed.js
├── frontend/
│   ├── app/               Login, register, dashboard, admin pages and route handlers
│   ├── components/        UI components and shadcn components
│   ├── lib/               API helpers, schemas, types and session helpers
│   └── proxy.ts           Route protection
└── README.md
```

## Getting started

You'll need **Node.js 20+** and a MongoDB database. Start the backend first.

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Windows:
# copy .env.example .env
```

Open `.env` and add your `MONGODB_URI` and `JWT_SECRET`.

Then run:

```bash
npm run seed
npm run dev
```

The seed command creates the demo users and a few sample requests.

The API should start at:

```text
http://localhost:8000
```

You can check that it's working by opening:

```text
http://localhost:8000/api/health
```

You should get:

```json
{ "status": "ok" }
```

> **Note:** `npm run seed` clears the `users` and `servicerequests` collections before adding the demo data. Don't run it against a database that contains data you want to keep.

### Frontend

Open another terminal:

```bash
cd frontend
npm install
cp .env.example .env
# Windows:
# copy .env.example .env

npm run dev
```

Then open:

```text
http://localhost:3000
```

## Environment variables

### `backend/.env`

| Variable         | Description                                            |
| ---------------- | ------------------------------------------------------ |
| `PORT`           | Port used by the API. Defaults to `8000`               |
| `MONGODB_URI`    | MongoDB connection string, including the database name |
| `JWT_SECRET`     | Secret used to sign JWTs                               |
| `JWT_EXPIRES_IN` | How long the token stays valid, for example `1d`       |
| `CLIENT_URL`     | Frontend URL used for CORS                             |

### `frontend/.env`

| Variable     | Description                                                                   |
| ------------ | ----------------------------------------------------------------------------- |
| `JWT_SECRET` | Must match the backend secret because `proxy.ts` uses it to verify the cookie |
| `API_URL`    | Base URL of the backend, including `/api`                                     |

Both `.env` files are gitignored. Only the `.env.example` files are committed.

## Database

The app uses two MongoDB collections:

### `users`

Stores:

- name
- email
- hashed password
- role (`user` or `admin`)
- timestamps

The email field is unique, and passwords are excluded from normal queries by default.

### `servicerequests`

Stores:

- title
- description
- category
- budget
- status
- user reference
- timestamps

There is a compound index on `{ user, createdAt }` for loading a user's newest requests, plus an index on `status` for filtering.

The available request categories are:

- Plumbing
- Electrical
- Cleaning
- IT Support
- Other

The categories are defined in `backend/src/constants.js` and mirrored in `frontend/lib/types.ts`.

## Demo accounts

After running the seed script:

| Role  | Email             | Password    |
| ----- | ----------------- | ----------- |
| Admin | admin@example.com | password123 |
| User  | user@example.com  | password123 |

A normal user can also register through the app. Registration always creates a `user` account. Admin accounts are created through the seed script.

## Permissions

| Action           | User                       | Admin                                                          |
| ---------------- | -------------------------- | -------------------------------------------------------------- |
| Create a request | Yes                        | Yes                                                            |
| View requests    | Own requests               | All requests                                                   |
| Edit a request   | Own requests while Pending | Status only on other users' requests; full access to their own |
| Cancel a request | Own requests while Pending | By changing the status                                         |
| Delete a request | No                         | Yes                                                            |

There are a couple of rules here that I chose based on how I interpreted the assessment:

- Users can edit their own requests while they are still Pending. Once an admin accepts a request, the user can't change its details. Users can set their own request to Cancelled.
- Admins can edit all the requests.

These rules are enforced on the backend. The frontend also hides actions that aren't available, but the backend is what actually controls access.

## API

All `/api/requests` endpoints require:

```text
Authorization: Bearer <token>
```

| Method | Endpoint              | Description                                                             |
| ------ | --------------------- | ----------------------------------------------------------------------- |
| POST   | `/api/auth/login`     | Logs in and returns `{ token, user }`                                   |
| POST   | `/api/auth/register`  | Creates a user and returns `{ token, user }`                            |
| GET    | `/api/auth/me`        | Returns the current user                                                |
| GET    | `/api/requests`       | Lists requests with support for `status`, `search`, `page`, and `limit` |
| GET    | `/api/requests/stats` | Returns request counts by status                                        |
| GET    | `/api/requests/:id`   | Returns a request if the user has access to it                          |
| POST   | `/api/requests`       | Creates a request; the user comes from the token                        |
| PUT    | `/api/requests/:id`   | Updates a request according to the permission rules                     |
| DELETE | `/api/requests/:id`   | Deletes a request; admin only                                           |
| GET    | `/api/health`         | API health check                                                        |

The API uses these status codes:

- `400` — validation errors or malformed IDs
- `401` — missing/invalid token or incorrect credentials
- `403` — the user doesn't have permission
- `404` — record not found
- `409` — email already exists

Validation errors return a message along with an `errors` array containing the affected field and message.

## Some implementation decisions

### JWT in an httpOnly cookie

The JWT is stored in an httpOnly cookie instead of `localStorage`, so client-side JavaScript can't directly read the token.

The browser doesn't call Express directly for authentication. Login goes through a Next.js route handler, which sets the cookie. Server components can then use the session when calling the Express API, while client-side actions such as forms and deletes go through a small `/api/proxy` route.

There is a little more setup involved, but it avoids exposing the token to JavaScript running on the page.

### Route protection

Route protection happens on both the frontend and backend.

`proxy.ts` handles redirects for users who aren't logged in or don't have the required role. The dashboard and admin layouts check the session again.

The backend is still the final authority. It verifies the token and loads the user from the database on each request, so a deleted user's token won't continue to give them access.

### Requests that aren't accessible return 404

If a user tries to open another user's request, the API returns the same kind of response as it would for a request that doesn't exist. This avoids making it easy to discover valid request IDs.

### Validation on both sides

Zod is used in the forms, Next.js route handlers, and Express API.

Unknown fields are stripped during validation. This also prevents someone from sending something like `role: "admin"` to the registration endpoint.

## A couple of issues I ran into

- I ran into `querySrv EBADRESP` while connecting to MongoDB Atlas. It turned out to be a DNS issue on my machine rather than an application problem. Using Google/Cloudflare DNS fixed it.
- Recent versions of `shadcn init` use Base UI instead of Radix. Because of that, link-style buttons use `buttonVariants` rather than the older `asChild` approach.

## What's not included

I kept the project focused on the main requirements.

Things I didn't add:

- Automated tests
- Docker
- Swagger/OpenAPI documentation
- Rate limiting on authentication endpoints

Pagination is included for the request list and dashboard. If I continued working on the project, I'd probably add API tests with Supertest first, followed by rate limiting for the auth routes.
