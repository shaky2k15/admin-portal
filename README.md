# Admin Portal

![Admin Portal](public/favicon.svg)

> **Note:** This project was accomplished using **Antigravity Vibe Coding**. 🚀

A modern, highly-maintainable, and easily portable React-based admin portal designed for internal code contributions and team management.

## Features

- **Feature-Based Architecture**: Low maintenance, highly scalable, and easy to extend.
- **Dual Auth System**: Built-in support for Azure AD (via MSAL.js) and a fallback mock auth system for local development.
- **Premium UI**: Designed with Tailwind CSS, shadcn/ui tokens, glassmorphism, and smooth micro-animations.
- **Zero Vendor Lock-in**: Outputs to static files that can be deployed anywhere.
- **Docker Ready**: Includes a multi-stage Dockerfile and Nginx configuration for a lightweight (~25MB) deployment.

## Getting Started

Check out the [CONTRIBUTING.md](./CONTRIBUTING.md) guide for detailed instructions on:
- Local development setup
- Testing Azure AD
- The architecture overview
- Step-by-step guide to adding new features without breaking core components

## Quick Start (Mock Auth Mode)

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Set up env variables:**
   ```bash
   cp .env.example .env
   # Ensure VITE_ENABLE_AZURE_AD=false is set in your .env
   ```

3. **Run the dev server:**
   ```bash
   npm run dev
   ```

4. **Log in:**
   Navigate to `http://localhost:5173` and log in with `admin` / `admin123`.

## Tech Stack

- **Framework**: Vite + React 19 + TypeScript
- **Routing**: React Router v7
- **State Management**: Zustand (UI) + TanStack Query (Server)
- **Styling**: Tailwind CSS v4 + Radix UI Primitives
- **Auth**: MSAL.js v2 (`@azure/msal-react`)
