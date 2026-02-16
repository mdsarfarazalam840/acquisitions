# AGENTS.md

This file provides handoff guidance for future sessions working on `interaction/`.

## Project Context

`interaction/` is a standalone frontend for the main `acquisitions` Express API.

- Framework: React + TypeScript + Vite
- State/data: TanStack Query + local auth context
- Transport: Axios with `withCredentials: true` for cookie auth

## Quick Commands

```bash
cd interaction
npm install
npm run dev
npm run lint
npm run build
npm run format:check
npm run test:e2e
```

## Environment

Required in `interaction/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Backend must allow this origin via `CORS_ORIGIN`.

## API Integration Contract

Used endpoints:

- `POST /api/auth/sign-up`
- `POST /api/auth/sign-in`
- `POST /api/auth/sign-out`
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `GET /api/users` (admin only)

Auth model:

- Backend sets httpOnly cookie.
- Frontend sends cookies using Axios `withCredentials: true`.

## Architecture Notes

- `src/api/` contains request layer and typed response helpers.
- `src/context/` manages in-memory authenticated user state.
- `src/components/ProtectedRoute.tsx` protects dashboard/admin routes.
- `src/pages/` contains route screens.
- `scripts/e2e-smoke.mjs` does a minimal signup/protected/signout smoke flow.

## Verified Status (2026-02-16)

Validated successfully:

- `npm run lint`
- `npm run build`
- `npm run format:check`
- `npm run test:e2e` (with backend running)

Backend suite also validated from repo root:

- `npm test` passed (all existing API tests)

## Known Constraints / Follow-ups

- Auth state is in-memory; page refresh clears frontend user state until user signs in again.
  - Backend cookie may still exist; if needed, add a `/me` endpoint and bootstrap auth on app load.
- UI currently focused on operational API interaction, not design-system theming.
- No frontend unit test framework added yet (only smoke e2e script).

## Suggested Next Steps

1. Add `/me` endpoint in backend and hydrate session on frontend startup.
2. Add frontend CI job (lint + build) under `.github/workflows/`.
3. Add Playwright/Cypress for browser-level E2E if release process needs it.
4. Gate admin page route with role-aware redirect and message UX polish.

## Session Safety Notes

- Do not change backend auth behavior from frontend folder.
- Keep API URL configurable only via `VITE_API_BASE_URL`.
- Preserve cookie-based auth (`withCredentials`) unless backend contract changes.
