# Admin Portal — Architecture & Implementation Plan

> **Scope**: Azure AD auth · Dashboard · Sidebar layout · Docker deployment
> **Stack**: Vite + React 19 + TypeScript

---

## 1. Tech Stack

| Layer | Tool | Rationale |
|-------|------|-----------|
| **Framework** | Vite + React 19 + TypeScript | Static SPA, zero server runtime |
| **Routing** | React Router v7 | Mature, file-friendly routing |
| **Server State** | TanStack Query v5 | Caching + sync for backend API calls |
| **Client State** | Zustand | Lightweight UI state (sidebar, modals, theme) |
| **UI Components** | shadcn/ui + Radix UI | Own the code, no dependency drift |
| **Forms** | React Hook Form + Zod | Type-safe validation |
| **Styling** | Tailwind CSS v4 | Utility-first, purgeable, consistent |
| **Auth** | MSAL.js v2 (`@azure/msal-react`) | Microsoft's official Azure AD library for React SPAs |
| **HTTP Client** | Axios | For existing backend APIs |
| **Deployment** | Docker (Nginx) | Portable, ~25MB image |

---

## 2. Architecture: Feature-Based

```
admin-portal/
├── public/
│   └── favicon.svg
├── src/
│   ├── app/
│   │   ├── App.tsx                  # Root component, providers, router
│   │   ├── routes.tsx               # Route definitions
│   │   └── providers/
│   │       ├── AuthProvider.tsx      # MSAL wrapper
│   │       ├── QueryProvider.tsx     # TanStack Query client
│   │       └── ThemeProvider.tsx     # Dark/light mode
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── ProtectedRoute.tsx
│   │   │   │   └── UserMenu.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts       # Wraps MSAL hooks
│   │   │   ├── config/
│   │   │   │   └── msalConfig.ts    # Azure AD app registration config
│   │   │   └── types.ts
│   │   │
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── StatsCards.tsx
│   │   │   │   ├── RecentActivity.tsx
│   │   │   │   └── WelcomeBanner.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useDashboardStats.ts
│   │   │   └── api/
│   │   │       └── dashboardApi.ts
│   │   │
│   │   ├── users/
│   │   │   ├── components/
│   │   │   │   ├── UsersPage.tsx
│   │   │   │   └── UserTable.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useUsers.ts
│   │   │   └── api/
│   │   │       └── usersApi.ts
│   │   │
│   │   ├── analytics/
│   │   │   ├── components/
│   │   │   │   ├── AnalyticsPage.tsx
│   │   │   │   └── Charts.tsx
│   │   │   └── hooks/
│   │   │       └── useAnalytics.ts
│   │   │
│   │   └── settings/
│   │       ├── components/
│   │       │   └── SettingsPage.tsx
│   │       └── hooks/
│   │           └── useSettings.ts
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── ui/               # shadcn/ui components (Button, Card, etc.)
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.tsx    # Sidebar + header + content
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Header.tsx
│   │   │   └── feedback/
│   │   │       ├── LoadingSpinner.tsx
│   │   │       └── ErrorBoundary.tsx
│   │   ├── hooks/
│   │   │   └── useApi.ts           # Generic API hook wrapping TanStack Query
│   │   ├── lib/
│   │   │   ├── apiClient.ts        # Axios instance for your backend
│   │   │   └── utils.ts
│   │   └── types/
│   │       └── api.ts              # Shared API response types
│   │
│   ├── styles/
│   │   └── globals.css             # Tailwind directives + custom styles
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── .env.example
├── Dockerfile
├── nginx.conf
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## 3. Azure AD Authentication Flow

```
User → Admin Portal (SPA) → Azure AD (MSAL.js redirect)
                                  ↓
                          Returns ID token + access token
                                  ↓
              SPA calls backend APIs with Bearer token
```

### MSAL Configuration

- Register app in Azure AD → get `clientId` and `tenantId`
- Set redirect URI to portal URL
- Request scopes: `User.Read`, `openid`, `profile`
- Use `@azure/msal-react` with `MsalProvider` + `useMsal()` hook
- Tokens are automatically refreshed by MSAL — zero maintenance

### Backend API Integration

Axios interceptor auto-attaches Azure AD access token to every request:

```typescript
// shared/lib/apiClient.ts
import axios from 'axios';
import { msalInstance } from '@/features/auth/config/msalConfig';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiClient.interceptors.request.use(async (config) => {
  const account = msalInstance.getActiveAccount();
  if (account) {
    const response = await msalInstance.acquireTokenSilent({
      scopes: ['api://<your-backend-app-id>/.default'],
      account,
    });
    config.headers.Authorization = `Bearer ${response.accessToken}`;
  }
  return config;
});

export default apiClient;
```

---

## 4. Pages & Components

| Page | Key Components | Data Source |
|------|---------------|-------------|
| **Login** | Microsoft login button (MSAL redirect) | Azure AD |
| **Dashboard** | Welcome banner, stats cards, recent activity feed | Backend APIs (sample data) |
| **Users** | User table with search/filter | Backend APIs (sample data) |
| **Analytics** | Chart components, metric cards | Backend APIs (sample data) |
| **Settings** | Profile, preferences, theme toggle | Backend APIs (sample data) |

### Sidebar Navigation

- Dashboard (home)
- Users
- Analytics
- Settings
- Collapsible sidebar with icons + labels
- Active route highlighting
- User profile / logout at bottom

---

## 5. Deployment

### Dockerfile

```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

### Nginx Config

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Portability

| Concern | Solution |
|---------|----------|
| No vendor lock-in | Vite outputs static files, runs anywhere |
| No server runtime | Pure SPA, served by any static file server |
| Config per environment | `VITE_*` env vars at build time |
| Auth portable | MSAL.js works with any Azure AD tenant — swap `clientId`/`tenantId` |
| Deployable anywhere | Docker image with Nginx (~25MB) |

---

## 6. Environment Variables

```bash
# Azure AD
VITE_AZURE_CLIENT_ID=<your-azure-ad-app-client-id>
VITE_AZURE_TENANT_ID=<your-azure-ad-tenant-id>
VITE_AZURE_REDIRECT_URI=http://localhost:5173

# Backend API
VITE_API_BASE_URL=https://your-api.example.com/api
```
