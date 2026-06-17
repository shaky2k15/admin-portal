# Admin Portal

![Admin Portal](public/favicon.svg)

> **Note:** This project was accomplished using **Antigravity Vibe Coding**. 🚀

A modern, highly-maintainable, and secure full-stack admin portal designed for internal team management and platform analytics.

## Features

- **Next.js App Router**: Built on the latest Next.js features utilizing server components and clean layouts.
- **Backend-For-Frontend (BFF) Auth**: Highly secure authentication via **NextAuth**. Tokens are kept entirely out of browser storage and are managed via `HttpOnly` cookies securely on the Next.js server.
- **Dual Auth System**: Built-in support for Azure AD (via NextAuth) and a fallback mock auth credentials system for local development.
- **Premium UI**: Designed with Tailwind CSS, shadcn/ui tokens, glassmorphism, and smooth micro-animations.
- **Feature-Based Architecture**: Low maintenance, highly scalable, and easy to extend.

## Getting Started

Check out the [CONTRIBUTING.md](./CONTRIBUTING.md) guide for detailed instructions on:
- Local development setup
- Testing Azure AD authentication via BFF
- The architecture overview
- Step-by-step guide to adding new features cleanly

## Quick Start (Mock Auth Mode)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up env variables:**
   Create a `.env.local` file and enable mock authentication:
   ```bash
   touch .env.local
   # Add the following to your .env.local:
   # NEXT_PUBLIC_MOCK_AUTH="true"
   # NEXTAUTH_SECRET="development-secret-key"
   # NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Run the dev server:**
   ```bash
   npm run dev
   ```

4. **Log in:**
   Navigate to `http://localhost:3000` and log in with `admin` / `admin123`.

## Tech Stack

- **Framework**: Next.js (App Router) + React 19 + TypeScript
- **Auth**: NextAuth.js (Backend-For-Frontend Pattern)
- **State Management**: Zustand (UI) + TanStack Query (Server)
- **Styling**: Tailwind CSS v4 + Radix UI Primitives
- **Icons**: Lucide React
