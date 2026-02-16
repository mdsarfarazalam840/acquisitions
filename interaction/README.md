# Interaction UI

Frontend client for the `acquisitions` API.

Built with:

- React 19 + TypeScript
- Vite 7
- React Router
- TanStack Query
- Axios

This app is in `interaction/` and is intentionally separate from the backend service.

## 1. Features

- Sign up (`POST /api/auth/sign-up`)
- Sign in (`POST /api/auth/sign-in`)
- Sign out (`POST /api/auth/sign-out`)
- Protected dashboard (cookie-based auth)
- Profile fetch/update for logged-in users
- Admin-only user listing (`GET /api/users`)
- Smoke E2E script for quick API integration validation

## 2. Prerequisites

- Node.js 20+
- npm 9+
- Running backend API (`acquisitions`) reachable from browser

## 3. Environment

Create `.env` inside `interaction/`:

```bash
cp .env.example .env
```

Set:

```env
VITE_API_BASE_URL=http://localhost:3000
```

If backend is deployed, set `VITE_API_BASE_URL` to that URL.

## 4. Run Locally

From repository root:

```bash
# Terminal 1: backend
npm run dev:docker
# or npm run start

# Terminal 2: frontend
cd interaction
npm install
npm run dev
```

Frontend default URL: `http://localhost:5174`

## 5. Scripts

From `interaction/`:

```bash
npm run dev           # Start Vite dev server
npm run build         # Type-check + production build
npm run preview       # Preview production build
npm run lint          # ESLint
npm run format        # Prettier write
npm run format:check  # Prettier check
npm run test:e2e      # Smoke test against running backend API
```

## 6. End-to-End Check

`test:e2e` requires backend to be running and accessible via `API_BASE_URL` (defaults to `http://localhost:3000`).

Run:

```bash
cd interaction
npm run test:e2e
```

Expected output:

```text
Interaction smoke e2e passed
```

## 7. Production Build

```bash
cd interaction
npm run build
```

Output is generated in `interaction/dist/`.

## 8. Deployment Notes

- Set `VITE_API_BASE_URL` in your frontend hosting platform.
- Backend must allow frontend origin in `CORS_ORIGIN`.
- API auth uses httpOnly cookies, so frontend requests use `withCredentials: true`.

## 9. Project Structure

```text
interaction/
  src/
    api/
      auth.ts
      client.ts
      users.ts
    components/
      NavBar.tsx
      ProtectedRoute.tsx
    context/
      AuthContext.tsx
      useAuth.ts
    pages/
      SignInPage.tsx
      SignUpPage.tsx
      DashboardPage.tsx
      UsersPage.tsx
    App.tsx
    main.tsx
    styles.css
  scripts/
    e2e-smoke.mjs
  .env.example
  package.json
```

## 10. Troubleshooting

- `401 Authentication required`:
  - Sign in first.
  - Verify backend is setting cookie.
- CORS/cookie issues in browser:
  - Confirm backend `CORS_ORIGIN` includes frontend URL.
  - Confirm frontend uses correct `VITE_API_BASE_URL`.
- `test:e2e` fails:
  - Ensure backend is running.
  - Ensure migrations are applied and DB is reachable.
