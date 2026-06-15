# Admin Portal — Architecture & Implementation Plan

> **Constraints**: GitHub · Azure AD · Existing backend APIs · 5–10 contributors · GitHub PRs for code review

---

## 1. Tech Stack

| Layer | Tool | Rationale |
|-------|------|-----------|
| **Framework** | Vite + React 19 + TypeScript | Static SPA, zero server runtime |
| **Routing** | React Router v7 | Mature, file-friendly routing |
| **Server State** | TanStack Query v5 | Caching + sync for both backend APIs and GitHub API |
| **Client State** | Zustand | Lightweight UI state (sidebar, modals, theme) |
| **UI Components** | shadcn/ui + Radix UI | Own the code, no dependency drift |
| **Code Editor** | Monaco Editor (`@monaco-editor/react`) | Syntax highlighting, diff view, IntelliSense |
| **Forms** | React Hook Form + Zod | Type-safe validation |
| **Styling** | Tailwind CSS v4 | Utility-first, purgeable, consistent |
| **Auth** | MSAL.js v2 (`@azure/msal-react`) | Microsoft's official Azure AD library for React SPAs |
| **GitHub Integration** | Octokit (`@octokit/rest`) | Official GitHub SDK, typed, well-maintained |
| **HTTP Client** | Axios | For existing backend APIs |
| **Deployment** | Docker (Nginx) | Portable, ~25MB image |

---

## 2. Architecture Pattern: Feature-Based

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
│   │   │   │   └── RecentActivity.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useDashboardStats.ts
│   │   │   └── api/
│   │   │       └── dashboardApi.ts
│   │   │
│   │   ├── code-editor/
│   │   │   ├── components/
│   │   │   │   ├── EditorPage.tsx
│   │   │   │   ├── MonacoEditor.tsx  # Monaco wrapper
│   │   │   │   ├── FileExplorer.tsx  # Tree view of repo files
│   │   │   │   ├── FileTabs.tsx      # Open file tabs
│   │   │   │   └── EditorToolbar.tsx # Save, commit, push actions
│   │   │   ├── hooks/
│   │   │   │   ├── useFileTree.ts
│   │   │   │   └── useEditorState.ts
│   │   │   ├── api/
│   │   │   │   └── githubFileApi.ts  # Octokit file operations
│   │   │   └── types.ts
│   │   │
│   │   ├── contributions/
│   │   │   ├── components/
│   │   │   │   ├── ContributionsPage.tsx
│   │   │   │   ├── ContributionList.tsx
│   │   │   │   └── SubmitContribution.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useContributions.ts
│   │   │   ├── api/
│   │   │   │   └── contributionsApi.ts  # Your backend APIs
│   │   │   └── types.ts
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
│   │   │   ├── useApi.ts           # Generic API hook wrapping TanStack Query
│   │   │   └── useGitHub.ts        # Octokit instance with auth token
│   │   ├── lib/
│   │   │   ├── apiClient.ts        # Axios instance for your backend
│   │   │   ├── githubClient.ts     # Octokit instance factory
│   │   │   └── utils.ts
│   │   └── types/
│   │       └── api.ts              # Shared API response types
│   │
│   ├── styles/
│   │   └── globals.css             # Tailwind directives + custom styles
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── .env.example                     # Template for env vars
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
              SPA calls GitHub API with GitHub OAuth token
```

### MSAL Configuration

- Register app in Azure AD → get `clientId` and `tenantId`
- Set redirect URI to portal URL
- Request scopes: `User.Read`, `openid`, `profile`
- Use `@azure/msal-react` with `MsalProvider` + `useMsal()` hook
- Tokens are automatically refreshed by MSAL — zero maintenance

### Backend API Integration

The existing backend APIs receive the Azure AD access token as a `Bearer` token. An Axios interceptor automatically acquires and attaches the token to every request:

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

API calls are wrapped with TanStack Query for caching + background sync:

```typescript
// features/contributions/api/contributionsApi.ts
import apiClient from '@/shared/lib/apiClient';
import { useQuery, useMutation } from '@tanstack/react-query';

export const useContributions = () =>
  useQuery({
    queryKey: ['contributions'],
    queryFn: () => apiClient.get('/contributions').then(r => r.data),
  });

export const useSubmitContribution = () =>
  useMutation({
    mutationFn: (data: ContributionPayload) =>
      apiClient.post('/contributions', data),
  });
```

---

## 4. GitHub Integration Strategy

Code review happens on GitHub directly. The portal focuses on **code contribution** (create branch → edit files → push → open PR).

### GitHub API Operations

| Action | GitHub API | Octokit Method |
|--------|-----------|----------------|
| List repos | `GET /orgs/{org}/repos` | `octokit.repos.listForOrg()` |
| Get file tree | `GET /repos/{owner}/{repo}/git/trees/{sha}` | `octokit.git.getTree()` |
| Read file | `GET /repos/{owner}/{repo}/contents/{path}` | `octokit.repos.getContent()` |
| Create branch | `POST /repos/{owner}/{repo}/git/refs` | `octokit.git.createRef()` |
| Update file | `PUT /repos/{owner}/{repo}/contents/{path}` | `octokit.repos.createOrUpdateFileContents()` |
| Create PR | `POST /repos/{owner}/{repo}/pulls` | `octokit.pulls.create()` |

### GitHub Authentication

For 5–10 users, **GitHub OAuth App** is recommended — each user logs in with their GitHub account, and commits show as *their* commits. The GitHub OAuth flow runs separately from Azure AD (dual auth), or can be proxied through the backend.

---

## 5. Contribution Workflow

```
User writes code in Monaco Editor
        ↓
Validation & Linting (client-side)
        ↓
Submit for Review (creates branch + commits + opens PR on GitHub)
        ↓
Review happens on GitHub (standard PR workflow)
        ↓
Approve → Merge to repository
   or
Request Changes → User edits again
```

---

## 6. Pages & Components

| Page | Key Components | Data Source |
|------|---------------|-------------|
| **Login** | Microsoft login button (MSAL redirect) | Azure AD |
| **Dashboard** | Stats cards, recent activity feed, quick actions | Backend APIs |
| **Code Editor** | File explorer (tree), Monaco editor, file tabs, commit toolbar | GitHub API |
| **Contributions** | Contribution list (filterable table), submission form | Backend APIs |
| **Settings** | Profile, GitHub connection, preferences | Backend APIs + GitHub |

---

## 7. Build Phases

### Phase 1 — Foundation (~2 days)

- Vite + React + TypeScript scaffold
- Tailwind CSS + shadcn/ui setup
- Azure AD auth with MSAL (login/logout, protected routes)
- App layout (sidebar, header, routing)
- API client with token injection

### Phase 2 — Core Features (~3-4 days)

- Dashboard page with stats from backend APIs
- GitHub integration (Octokit setup, repo listing, file tree)
- Monaco Editor integration (read/edit files from GitHub)
- Code contribution workflow (branch → edit → commit → PR)

### Phase 3 — Polish (~1-2 days)

- Error boundaries and loading states
- Dark/light theme toggle
- Responsive design
- Docker + Nginx deployment setup

---

## 8. Deployment & Portability

### Docker Setup

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

### Portability Checklist

| Concern | Solution |
|---------|----------|
| No vendor lock-in | Vite outputs static files, runs anywhere |
| No server runtime | Pure SPA, served by any static file server |
| Config per environment | `VITE_*` env vars at build time, or runtime `window.__ENV__` injection |
| Auth portable | MSAL.js works with any Azure AD tenant — just swap `clientId`/`tenantId` |
| GitHub portable | Swap org/repo config, same Octokit code works |
| Deployable anywhere | Docker image with Nginx (~25MB) |

---

## 9. Environment Variables

```bash
# Azure AD
VITE_AZURE_CLIENT_ID=<your-azure-ad-app-client-id>
VITE_AZURE_TENANT_ID=<your-azure-ad-tenant-id>
VITE_AZURE_REDIRECT_URI=http://localhost:5173

# Backend API
VITE_API_BASE_URL=https://your-api.example.com/api

# GitHub
VITE_GITHUB_CLIENT_ID=<your-github-oauth-app-client-id>
VITE_GITHUB_ORG=<your-github-org-name>
```
