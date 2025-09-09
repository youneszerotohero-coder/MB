Top-level README for moaud-boutique workspace.

Integration and local development
---------------------------------

This repository contains `backend/` (Express + Prisma) and `frontend/` (Vite + React).

Quick start (development):

1. Start the backend (port 5000):

```powershell
cd C:\Users\HP\Desktop\MB\backend
npm install
npm run dev
```

2. Start the frontend (port 5173):

```powershell
cd C:\Users\HP\Desktop\MB\frontend
npm install
npm run dev
```

Notes:
- The frontend dev server is configured to proxy `/api/*` to the backend and uses the environment variable `VITE_API_URL`.
- By default in development `frontend/.env` sets `VITE_API_URL=/api` so client requests like `/api/products` will be proxied to `http://localhost:5000/api/v1/*`.
- Backend CORS is environment-configurable via `BACKEND_ALLOWED_ORIGINS` in `backend/.env`. In `NODE_ENV=development` the backend allows all origins for convenience; restrict this value in production.

If you want the frontend to call the backend directly (bypassing the proxy), set `VITE_API_URL` to the full backend base URL (for example `http://localhost:5000/api/v1`) in `frontend/.env` and restart the dev server.
