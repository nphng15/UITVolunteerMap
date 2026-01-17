# UIT Volunteer Map

## Tech Stack

- **Frontend**: React 19 + Vite + SWC + Tailwind CSS v4
- **Backend**: Express + TypeScript
- **Monorepo**: npm workspaces

## Structure

```
packages/
├── frontend/   # React app (port 3000)
├── backend/    # Express API (port 5000)
└── shared/     # Shared types & constants
```

## Setup

```bash
npm install
```

## Development

```bash
# Run both frontend & backend
npm run dev

# Or separately
npm run dev:frontend
npm run dev:backend
```

## Build

```bash
npm run build
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all packages |
| `npm run dev:frontend` | Start frontend only |
| `npm run dev:backend` | Start backend only |
| `npm run build` | Build all packages |
| `npm run lint` | Lint all packages |
| `npm run clean` | Remove node_modules & dist |

## Shared Package

Import types/constants from `@uit-volunteer-map/shared`:

```typescript
import { ApiResponse, HTTP_STATUS } from '@uit-volunteer-map/shared';
```

## Notes

- Frontend proxies `/api` requests to backend automatically
- Backend uses `tsx` for hot reload in development
- Shared package uses `.js` extensions for Node ESM compatibility