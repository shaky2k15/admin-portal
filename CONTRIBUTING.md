# Contributing to the Admin Portal

Welcome! This document outlines how to run the Admin Portal locally and how to add new features following our Next.js App Router and Backend-For-Frontend (BFF) architecture.

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
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```bash
   touch .env.local
   ```

   By default, the app can run in **Mock Auth Mode** so you don't need real Azure credentials to start developing. Add the following to your `.env.local`:
   ```env
   # Enable mock credentials login form
   NEXT_PUBLIC_MOCK_AUTH="true"

   # NextAuth core configuration
   NEXTAUTH_SECRET="development-secret-key-12345"
   NEXTAUTH_URL="http://localhost:3000"

   # API Base
   NEXT_PUBLIC_API_BASE_URL="http://localhost:8080"
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Log in**:
   Open `http://localhost:3000`. Use the following mock credentials to log in:
   - **Username**: `admin`
   - **Password**: `admin123`

---

## 2. Testing Azure AD locally

If you need to test actual authentication against Azure AD via the NextAuth BFF pattern, you'll need a registered App in Azure.

1. Open your `.env.local` file and update the following:
   ```env
   # Disable the mock auth form
   NEXT_PUBLIC_MOCK_AUTH="false"

   # Azure configuration
   VITE_AZURE_CLIENT_ID="your-client-id-here"
   AZURE_AD_CLIENT_SECRET="your-client-secret-here"
   VITE_AZURE_TENANT_ID="your-tenant-id-here"
   ```
2. Restart the dev server. The app will now redirect to Microsoft for sign-in when you hit the login page.

---

## 3. Architecture Overview

We use a **Feature-Based Architecture** paired with the **Next.js App Router**. This means instead of grouping files by *type* (e.g., all components in one folder, all hooks in another), we group them by *feature* (e.g., all code related to "Users" lives in `src/features/users/`), and we use Next.js `src/app/` exclusively for routing.

```
src/
├── app/          # Next.js App Router (Routes, Layouts, API Handlers)
├── shared/       # Reusable components, hooks, and types (Buttons, Layout)
└── features/     # Feature modules (Dashboard, Users, Analytics, etc.)
```

> **CRITICAL RULE**: Do not import code from one feature into another feature. If code needs to be shared between features, it must be moved to `src/shared/`.

---

## 4. How to Add a New Feature (Step-by-Step)

We keep features isolated and cleanly map them to Next.js routes.

### Step 1: Create your feature folder
Create a new folder in `src/features/` (e.g., `src/features/reports/`).

Structure it like this:
```
src/features/reports/
├── components/
│   └── ReportsPage.tsx
├── hooks/
├── api/
└── feature.ts        <-- Metadata for the sidebar
```

### Step 2: Build your main page component
Create your page component in `src/features/reports/components/ReportsPage.tsx`. Use a default export. Since our components rely on React hooks, add `'use client'` to the top of interactive components.

```tsx
'use client';

export default function ReportsPage() {
  return (
    <div className="animate-fade-in p-6">
      <h1 className="text-2xl font-bold">Reports</h1>
      {/* Your feature content */}
    </div>
  );
}
```

### Step 3: Create the Next.js Route
Link your feature to the Next.js routing system. Create a page file in the `src/app/(dashboard)/` group.
For example, to map to `/reports`, create `src/app/(dashboard)/reports/page.tsx`:

```tsx
import ReportsPage from '@/features/reports/components/ReportsPage';

export default function Page() {
  return <ReportsPage />;
}
```

### Step 4: Register your Feature for the Sidebar
To make your feature appear in the global sidebar navigation, add it to the feature registry. Open `src/features/index.ts` and add your feature to the list:

```typescript
import { FileText } from 'lucide-react';
import type { FeatureDefinition } from '@/shared/types/feature';

// Add to the features array
export const features: FeatureDefinition[] = [
  // ...
  {
    id: 'reports',
    label: 'Reports',
    icon: FileText,
    path: '/reports',
    // component field is kept for legacy compatibility but the Sidebar only uses path and icon
  }
];
```

**That's it!** The Next.js App router handles the page, the middleware automatically protects it, and the sidebar will display your new link.

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
