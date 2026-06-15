# Contributing to the Admin Portal

Welcome! This document outlines how to run the Admin Portal locally and how to add new features without breaking existing functionality.

## Table of Contents
1. [Local Development Setup](#1-local-development-setup)
2. [Testing Azure AD locally](#2-testing-azure-ad-locally)
3. [Architecture Overview](#3-architecture-overview)
4. [How to Add a New Feature (Step-by-Step)](#4-how-to-add-a-new-feature-step-by-step)
5. [Styling & UI Guidelines](#5-styling--ui-guidelines)

---

## 1. Local Development Setup

To get the app running on your machine, you need **Node.js** (v18+) and **npm**.

1. **Clone the repository** and navigate to the project folder:
   ```bash
   git clone <repo-url>
   cd admin-portal
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**:
   Duplicate the `.env.example` file and rename it to `.env`:
   ```bash
   cp .env.example .env
   ```

   By default, the app is set to run in **Mock Auth Mode** so you don't need real Azure credentials to start developing:
   ```env
   VITE_ENABLE_AZURE_AD=false
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Log in**:
   Open `http://localhost:5173`. Use the following mock credentials to log in:
   - **Username**: `admin`
   - **Password**: `admin123`

---

## 2. Testing Azure AD locally

If you need to test actual authentication against Azure AD, you'll need a registered App in Azure.

1. Open your `.env` file and update the following:
   ```env
   VITE_ENABLE_AZURE_AD=true
   VITE_AZURE_CLIENT_ID=your-client-id-here
   VITE_AZURE_TENANT_ID=your-tenant-id-here
   VITE_AZURE_REDIRECT_URI=http://localhost:5173
   ```
2. Restart the dev server. The app will now redirect to Microsoft for sign-in.

---

## 3. Architecture Overview

We use a **Feature-Based Architecture**. This means instead of grouping files by *type* (e.g., all components in one folder, all hooks in another), we group them by *feature* (e.g., all code related to "Users" lives in `src/features/users/`).

```
src/
├── app/          # Core shell (Providers, Router, App component)
├── shared/       # Reusable components, hooks, and types (Buttons, Layout)
└── features/     # Feature modules (Dashboard, Users, Analytics, etc.)
```

> **CRITICAL RULE**: Do not import code from one feature into another feature. If code needs to be shared between features, it must be moved to `src/shared/`.

---

## 4. How to Add a New Feature (Step-by-Step)

We use a "Registry Pattern". You can build an entire new page/feature in complete isolation without ever touching the core router or layout files.

### Step 1: Create your feature folder
Create a new folder in `src/features/` (e.g., `src/features/reports/`).

Structure it like this:
```
src/features/reports/
├── components/
│   └── ReportsPage.tsx
├── hooks/
├── api/
└── feature.ts        <-- The public API for your feature
```

### Step 2: Build your main page component
Create your page component in `src/features/reports/components/ReportsPage.tsx`. Use a default export.

```tsx
export default function ReportsPage() {
  return (
    <div className="animate-fade-in p-6">
      <h1 className="text-2xl font-bold">Reports</h1>
      {/* Your feature content */}
    </div>
  );
}
```

### Step 3: Define your Feature
Create `src/features/reports/feature.ts` to tell the app how to render your feature.

```typescript
import { lazy } from 'react';
import { FileText } from 'lucide-react';
import type { FeatureDefinition } from '@/shared/types/feature';

// Lazy load your main page so it doesn't block the initial app load
const ReportsPage = lazy(() => import('./components/ReportsPage'));

export const reports: FeatureDefinition = {
  id: 'reports',          // Unique ID
  label: 'Reports',       // What shows up in the sidebar
  icon: FileText,         // Lucide-react icon for the sidebar
  path: '/reports',       // The URL route
  component: ReportsPage, // The component to render
};
```

### Step 4: Register your Feature
Finally, add your feature to the global registry. Open `src/features/index.ts` and add your feature to the list:

```typescript
import { dashboard } from './dashboard/feature';
import { users } from './users/feature';
// ...
import { reports } from './reports/feature'; // 1. Import it

export const features = [
  dashboard,
  users,
  // ...
  reports, // 2. Add it to the array
];
```

**That's it!** The app will automatically create a route for `/reports` and add a "Reports" button to the sidebar. You didn't have to touch any core routing or layout code.

---

## 5. Styling & UI Guidelines

We use **Tailwind CSS** with a robust design system. Please adhere to these guidelines to ensure your feature looks native to the portal.

### Colors & Variables
Do not use hardcoded hex colors. Use our semantic Tailwind classes:
- Backgrounds: `bg-background`, `bg-card`
- Text: `text-foreground`, `text-muted-foreground`
- Borders: `border-border`
- Accents: `bg-primary`, `text-primary`

### Glassmorphism
To create a standard card with a glass effect, use:
```tsx
<div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
  Content
</div>
```

### Animations
We have pre-configured animations in Tailwind. Use them to make your UI feel premium:
- `animate-fade-in`: Use on all top-level page components and cards.
- `animate-scale-in`: Good for modals or badges.
- `animate-slide-in-left`: Good for lists or notifications.
- `transition-smooth`: Add to interactive elements alongside hover states (`hover:bg-white/10`).

### Icons
We use [Lucide React](https://lucide.dev/).
```tsx
import { Settings } from 'lucide-react';

<Settings className="h-5 w-5 text-muted-foreground" />
```
