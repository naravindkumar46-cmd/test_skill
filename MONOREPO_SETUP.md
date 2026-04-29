# SEL Monorepo Setup Guide

## Project Structure

This is a **monorepo** with npm workspaces containing a Next.js frontend and a backend API.

```
starter_kit/                    # Monorepo root
├── package.json               # Workspace configuration
├── .gitignore
├── prisma/                    # Backend database (Prisma ORM)
├── src/                       # Backend source code
│   ├── app/
│   ├── generated/
│   ├── lib/
│   └── ...
├── frontend/                  # Frontend Next.js application
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── postcss.config.mjs
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   │   ├── login/
│   │   │   ├── admin/
│   │   │   ├── marketplace/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   ├── context/           # React Context providers
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ThemeContext.tsx
│   │   │   └── Providers.tsx
│   │   ├── lib/               # Utilities
│   │   │   └── useFetch.ts
│   │   └── components/        # Reusable components
│   ├── public/
│   └── .env.example
├── sel-ux-design-theme-main/  # Design system documentation
└── ...other backend files
```

## Getting Started

### 1. Install Dependencies

From the **root** directory:

```bash
npm install
```

This installs dependencies for both the backend and frontend.

### 2. Environment Setup

#### Backend Configuration
Ensure the backend is running on `http://localhost:4000` with these endpoints:
- `POST /api/auth/login` - Returns JWT token and user object
- `GET /api/auth/me` - Get current user profile (requires Authorization header)

#### Frontend Configuration
Create `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. Running Development Servers

**Start backend:**
```bash
npm run dev:backend
```
Backend runs on `http://localhost:3000`

**Start frontend:**
```bash
npm run dev:frontend
```
Frontend runs on `http://localhost:3000`

> **Note:** You may need to configure ports to avoid conflicts. By default, Next.js uses port 3000.

### 4. Building for Production

**Build backend:**
```bash
npm run build:backend
```

**Build frontend:**
```bash
npm run build:frontend
```

**Build both:**
```bash
npm run build
```

## Architecture

### Authentication Flow

1. **Login Page** (`/login`)
   - User enters email and password
   - Form validates client-side
   - Credentials sent to backend: `POST /api/auth/login`
   - Backend returns: `{ token: "JWT...", user: { id, email, role, synced } }`

2. **AuthContext** (`src/context/AuthContext.tsx`)
   - Stores JWT token in `localStorage` under key `sel_auth_token`
   - Stores user object in `localStorage` under key `sel_auth_user`
   - Provides `useAuth()` hook for all components
   - `login()`, `logout()`, `isAuthenticated` state management

3. **JWT Authorization**
   - Hook `useFetch()` automatically includes `Authorization: Bearer <token>` header
   - Token persists across browser sessions (stored in localStorage)
   - Use `useAuth().logout()` to clear session

### Theme System

**ThemeContext** (`src/context/ThemeContext.tsx`)
- Reads theme preference from `localStorage` (key: `sel_theme_frontend`)
- Falls back to system preference: `window.matchMedia('(prefers-color-scheme: dark)')`
- Applies `dark` class to `<html>` element
- Provides `useTheme()` hook with `isDarkMode` and `toggleTheme()`

### Role-Based Routing

From `page.tsx`:
- **Unauthenticated** → Redirect to `/login`
- **Role: ADMIN** → Redirect to `/admin`
- **Role: USER** → Redirect to `/marketplace`

### Sync Status Banner

Both `/admin` and `/marketplace` pages show a persistent warning banner if `user.synced === false`:

```
⚠️ Profile Not Synced
Your profile information is not fully synced. Please complete your profile setup to access all features.
```

## UI/UX Design System

### Colors

All colors follow SEL design tokens:

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| Primary | `#0078d4` | `#1177bb` | CTAs, active nav, focus |
| Secondary | `#8b5cf6` | `#a78bfa` | Secondary actions, accents |
| Success | `#10b981` | `#34d399` | Positive states |
| Warning | `#f59e0b` | `#fbbf24` | Cautions, pending |
| Error | `#ef4444` | `#f87171` | Failures, destructive |

### Dark Mode

- **Strategy:** Class-based (`darkMode: 'class'` in Tailwind)
- **Implementation:** Add `dark` class to `<html>` element
- **CSS:** Use `dark:` variant for all dark mode styles
- **Auto-detection:** Falls back to system preference if no saved preference

### Typography

- **Font Family:** Roboto (imported from Google Fonts)
- **Display Font:** Roboto
- **Monospace:** Source Code Pro (fallback: Courier New)

### Spacing & Sizing

Follow Tailwind defaults with custom animations:

- `space-y-1.5`, `space-y-4` for form/card spacing
- `rounded-lg` (8px) for buttons, inputs
- `rounded-2xl` (16px) for cards, panels
- `rounded-3xl` (24px) for hero/large panels

### Animations

Pre-configured animations (from Tailwind config):

- `animate-fade-in` - Fade in with Y offset
- `animate-fade-in-up` - Fade in from bottom
- `animate-fade-in-down` - Fade in from top
- `animate-slide-in-left` / `animate-slide-in-right` - Slide transitions
- `animate-scale-in` - Scale and fade
- All animations: 300-600ms with ease-out timing

### Forms

Login form follows SEL standards:

- **Labels:** Above fields, `text-sm font-semibold`
- **Borders:** 2px, upgrade to primary color on focus
- **Error State:** Red border + error text below
- **Focus Ring:** 4px ring with 10% opacity color
- **Disabled State:** `opacity-60 cursor-not-allowed`
- **Spacing:** `space-y-4` between fields

Example input classes:
```
w-full px-4 py-3 rounded-lg
bg-bg-primary dark:bg-bg-dark
border-2 border-border dark:border-border-dark
text-text-primary dark:text-text-dark
focus:outline-none focus:ring-4 focus:ring-primary/10
focus:border-primary dark:focus:border-primary-dark
transition-all duration-300 ease-out
```

## Key Features Implemented

### ✅ Monorepo Structure
- Root `package.json` with `"workspaces"` configuration
- Separate workspace scripts: `dev:frontend`, `build:frontend`, etc.

### ✅ Next.js Frontend
- App Router with TypeScript
- Tailwind CSS with SEL design tokens
- Dark mode support (class-based, system fallback)
- Roboto font integration

### ✅ Authentication
- Login page with form validation
- JWT token storage in localStorage
- AuthContext for session management
- `useFetch()` hook with auto-injected Authorization header

### ✅ Theme System
- Dark/light mode toggle
- System preference detection
- Persistence via localStorage

### ✅ Role-Based Redirects
- Automatic routing based on user role (ADMIN/USER)
- Protected routes with auth checks

### ✅ Sync Status Banner
- Persistent warning if `user.synced === false`
- Warning styling with icon and message

### ✅ Placeholder Pages
- `/admin` - Admin dashboard (coming soon)
- `/marketplace` - Skills marketplace (coming soon)
- Both include sync banner, theme toggle, logout

## API Integration

The frontend expects the backend to provide:

### Login Endpoint
**POST** `/api/auth/login`

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "role": "ADMIN" | "USER",
    "synced": false
  }
}
```

### Notes

- Ensure your backend is configured to accept requests from `http://localhost:3000` (CORS)
- JWT token should be valid for the session duration
- User role determines redirect destination and permission level
- `synced` flag controls the visibility of the warning banner

## Troubleshooting

### Port Conflicts

If port 3000 is already in use:

**For Next.js frontend:**
```bash
npm run dev:frontend -- -p 3001
```

### CORS Issues

Ensure backend allows requests from frontend origin:
```javascript
// Backend CORS configuration should include:
cors({
  origin: 'http://localhost:3000', // or 3001 if using alternate port
  credentials: true
})
```

### localStorage Issues

Clear browser storage and try again:
```javascript
localStorage.clear()
sessionStorage.clear()
// Then reload the application
```

### Build Errors

Ensure all dependencies are installed:
```bash
npm install --workspace=frontend
npm install --workspace=.  # backend
```

## Next Steps

1. Set up backend API endpoints
2. Configure CORS for frontend origin
3. Test login flow end-to-end
4. Implement skill browsing/listing
5. Build marketplace features
6. Add admin management dashboard

---

**Last Updated:** April 28, 2026  
**Framework:** Next.js 16.2.4 | React 19.2.4 | TypeScript 5 | Tailwind CSS 4
