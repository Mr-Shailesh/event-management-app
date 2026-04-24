# Event Management App

A modern event management app built with Next.js, React, TypeScript, and MUI. It includes authentication screens, a protected dashboard, and full event CRUD flows using browser `localStorage` for persistence.

## Features

- User signup and login
- Protected dashboard routes
- Create, view, edit, and delete events
- Filter and search events
- Form validation with Yup
- Local persistence for users and events with `localStorage`
- Responsive UI built with MUI and Tailwind-based global styling

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- MUI
- Tailwind CSS
- Yup
- Sonner

## Project Structure

```text
app/
  layout.tsx
  page.tsx
  globals.css
  (auth)/layout.tsx
  (auth)/login/page.tsx
  (auth)/signup/page.tsx
  (dashboard)/layout.tsx
  (dashboard)/dashboard/page.tsx
  (dashboard)/events/layout.tsx
  (dashboard)/events/create/page.tsx
  (dashboard)/events/[id]/page.tsx
  (dashboard)/events/[id]/edit/page.tsx
components/
  DashboardHeader.tsx
  DeleteConfirmationModal.tsx
  EventCard.tsx
  EventForm.tsx
  LoginForm.tsx
  SignupForm.tsx
  mui/
    Avatar.tsx
    Badge.tsx
    Button.tsx
    Card.tsx
    Input.tsx
    Select.tsx
    Spinner.tsx
    index.ts
context/
  AuthContext.tsx
  EventsContext.tsx
  FilterContext.tsx
hooks/
  useForm.ts
types/
  index.ts
utils/
  auth.ts
  events.ts
  storage.ts
  validation.ts
public/
  favicon.ico
  placeholder-assets...
```

## Getting Started

### 1. Install dependencies

Use one package manager consistently.

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## How It Works

### Authentication

- Users are stored in browser `localStorage`
- Passwords are hashed before being stored
- Auth state is managed through `AuthContext`
- Protected routes redirect unauthenticated users to `/login`

### Events

- Events are stored in browser `localStorage`
- Logged-in users can manage their own events
- Dashboard separates personal events from other events
- Filters support search, category, event type, and sorting

## Notes

- This app currently uses client-side storage only. There is no backend or database.
- Since data is stored in the browser, clearing site storage will remove saved users and events.
- The dev script uses `next dev --webpack` to avoid Turbopack instability in local development.
- Keep a single lockfile/package manager in the repo to avoid dependency mismatches.
- The repo currently still contains empty or legacy folders like `components/ui`, `lib`, and `styles` that are not part of the active app flow.

## Future Improvements

- Add a backend and database
- Replace local auth with real session handling
- Add role-based access control
- Add automated tests
- Add event image upload and richer event metadata

## License

This project is for learning and development use.
