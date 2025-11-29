# LabourMandi - Construction Labor Marketplace

## Overview
LabourMandi is a full-stack construction labor and equipment marketplace platform for India, similar to Upwork but specialized for the construction industry. It connects workers with employers and facilitates equipment rental.

**Status**: Imported and configured for Replit environment
**Date**: November 28, 2025

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + TypeScript (TSX runtime)
- **Database**: PostgreSQL (via Neon)
- **ORM**: Drizzle ORM
- **Authentication**: Replit Auth (OAuth with Google/GitHub)
- **Real-time**: WebSocket for messaging and notifications
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS v3 with dark mode support
- **Forms**: React Hook Form + Zod validation
- **Data Fetching**: TanStack Query v5

## Project Structure
```
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components (layout + shadcn/ui)
│   │   ├── pages/       # Page components (11 pages)
│   │   ├── hooks/       # Custom React hooks
│   │   ├── contexts/    # React contexts (Theme)
│   │   └── lib/         # Utilities and helpers
│   └── index.html
├── server/              # Express backend
│   ├── index.ts         # Main server entry
│   ├── routes.ts        # API route handlers (32 endpoints)
│   ├── db.ts            # Database connection
│   ├── storage.ts       # Data access layer
│   ├── replitAuth.ts    # Authentication setup
│   ├── vite.ts          # Vite dev server integration
│   └── static.ts        # Static file serving
├── shared/
│   └── schema.ts        # Shared database schema (11 tables)
└── drizzle.config.ts    # Database configuration
```

## Key Features
- **User Authentication**: Replit Auth with role-based access (worker/employer/admin/contractor/client)
- **Role Selection**: New user onboarding with role selection at `/auth/select-role`
- **Role-Specific Dashboards**: Dedicated dashboards for Client, Contractor, and Worker roles
- **Job Marketplace**: Post jobs, receive bids, manage hiring
- **Equipment Rental**: List and rent construction equipment
- **Real-time Chat**: WebSocket-powered messaging system
- **Wallet System**: Internal balance tracking with transactions
- **Notifications**: Real-time bid and message notifications
- **AI Features**: Optional OpenAI integration for worker matching and chat assistance
- **Worker Skills**: Comprehensive skills library including Solar Installer, EV Technician, and 50+ construction trades

## Development

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (automatically provisioned)
- `SESSION_SECRET`: Session encryption key (auto-generated)
- `OPENAI_API_KEY`: (Optional) For AI features - configure if needed

### Commands
```bash
npm run dev          # Start development server (port 5000)
npm run build        # Build for production
npm start            # Run production server
npm run db:push      # Push database schema changes
npm run check        # TypeScript type checking
```

### Database
The database is already provisioned and migrated with 11 tables:
- `users` - User profiles with role-based access
- `jobs` - Job postings
- `bids` - Worker bids on jobs
- `tools` - Equipment listings
- `tool_categories` - Equipment categories
- `job_categories` - Job categories
- `conversations` - Chat conversations
- `messages` - Chat messages
- `transactions` - Wallet transactions
- `notifications` - User notifications
- `sessions` - Auth session storage

## Recent Changes

### November 28, 2025 - Role System Implementation
1. **Added new user roles**: contractor, client (in addition to existing worker/employer/admin)
2. **Created Role Selection page** at `/auth/select-role` for new user onboarding
3. **Created Client Dashboard** at `/dashboard/client` - for homeowners/developers
4. **Created Contractor Dashboard** at `/dashboard/contractor` - team/project management
5. **Created Worker Dashboard** at `/dashboard/worker` - bids, jobs, and skill management
6. **Added Worker Skills library** at `client/src/lib/skills.ts`:
   - Solar Installer, EV Technician, EV Charger Installation
   - 7 skill categories: Construction, Electrical, Plumbing, HVAC, Heavy Equipment, Specialized, Renewable Energy
   - 50+ individual skills

### Initial Setup
1. **Installed nanoid** package (required by server/vite.ts)
2. **Database migrations** completed successfully
3. **Vite configuration** updated to allow all hosts (required for Replit proxy)
4. **Fixed OpenAI initialization** to be conditional (app works without API key)
5. **Workflow configured** to run dev server on port 5000
6. **Deployment configured** for autoscale with npm build and start

## Architecture Notes
- Full-stack application running on single port (5000)
- Vite dev server runs in middleware mode during development
- Production serves static files from `dist/public`
- WebSocket server runs on `/ws` path
- Session storage uses PostgreSQL (not in-memory)
- All API routes are under `/api/*`

## AI Features (Optional)
The platform includes AI-powered features that require an OpenAI API key:
- Worker matching based on job requirements
- Chat assistant for marketplace guidance

To enable AI features, configure the `OPENAI_API_KEY` secret. The app will work without it but AI endpoints will return 503 errors.

## User Preferences
None configured yet. This section will track coding style preferences and workflow patterns as development continues.

## Known Limitations
- Payment integration is mock (Razorpay not connected)
- Phone OTP verification UI exists but backend not implemented
- Image uploads store URLs only (no cloud storage integration)
- Email notifications not implemented
- Some filters and search features need frontend-backend wiring
