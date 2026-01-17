# Contributing Guide

## Prerequisites

- Node.js >= 18
- npm >= 9

## Getting Started

```bash
# Install dependencies
npm install

# Start development (both frontend & backend)
npm run dev

# Or run separately
npm run dev:frontend  # http://localhost:3000
npm run dev:backend   # http://localhost:5000
```

## Project Structure

```
packages/
├── frontend/         # React + Vite + Tailwind
│   └── src/
│       ├── routes/       # Page components
│       ├── components/   # Reusable components
│       ├── layouts/      # Layout wrappers
│       ├── contexts/     # React contexts
│       └── hooks/        # Custom hooks
├── backend/          # Express + TypeScript
│   └── src/
│       ├── routes/       # API routes
│       ├── middleware/   # Express middleware
│       └── schemas/      # Zod validation schemas
└── shared/           # Shared types & constants
```

## Development Workflow

### Adding a New API Endpoint

1. Define schema in `backend/src/schemas/`:
```typescript
// schemas/user.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
```

2. Create route in `backend/src/routes/`:
```typescript
// routes/user.ts
import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { createUserSchema } from '../schemas/user.js';

const router = Router();

router.post('/', validate(createUserSchema), (req, res) => {
  // req.body is typed as CreateUserInput
});

export { router as userRouter };
```

3. Register in `backend/src/index.ts`:
```typescript
import { userRouter } from './routes/user.js';
app.use('/api/users', userRouter);
```

### Adding a New Page

1. Create page in `frontend/src/routes/`:
```typescript
// routes/UsersPage.tsx
export default function UsersPage() {
  return <div>Users</div>;
}
```

2. Add to router in `frontend/src/routes/index.tsx`:
```typescript
import UsersPage from '@/routes/UsersPage';

// Inside router config
{ path: 'users', element: <UsersPage /> }
```

### Protected Routes

Wrap routes that require auth:
```typescript
{
  element: <ProtectedRoute />,
  children: [
    { path: 'dashboard', element: <DashboardPage /> },
  ],
}

// Admin only
{
  element: <ProtectedRoute requiredRole="admin" />,
  children: [...],
}
```

### Shared Types

Add types in `shared/src/types.ts`, they're available in both packages:
```typescript
// Backend or Frontend
import { User, ApiResponse } from '@uit-volunteer-map/shared';
```

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:frontend
npm run test:backend

# With coverage
cd packages/frontend && npm run test:coverage
```

### Writing Tests

Frontend (React Testing Library):
```typescript
// Component.test.tsx
import { render, screen } from '@testing-library/react';
import Component from './Component';

it('renders correctly', () => {
  render(<Component />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

Backend (Supertest):
```typescript
// route.test.ts
import request from 'supertest';
import app from '../index.js';

it('returns 200', async () => {
  const res = await request(app).get('/api/health');
  expect(res.status).toBe(200);
});
```

## Code Style

- Use TypeScript strict mode
- Prefer named exports
- Use path aliases (`@/` for frontend src)
- Backend imports need `.js` extension (ESM requirement)

## Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all packages |
| `npm run build` | Build all packages |
| `npm test` | Run all tests |
| `npm run lint` | Lint all packages |
| `npm run clean` | Remove node_modules & dist |

## Test Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | admin123 | admin |
| user@example.com | user123 | user |
