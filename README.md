# Event Management App

A modern event management app built with Next.js, React, TypeScript, and MUI. It includes authentication screens, protected dashboard routes, calendar browsing, and full event CRUD flows using browser `localStorage` for persistence.

## Features

- User signup and login
- Protected dashboard routes
- Create, view, edit, and delete events
- Dashboard filters for search, category, event type, date range, and sorting
- Calendar view with month, week, day, and agenda modes
- Form validation with Formik and Yup
- Local persistence for users and events with `localStorage`
- Responsive UI built with MUI and Tailwind-based global styling

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- MUI
- MUI X Date Pickers
- Tailwind CSS
- Formik
- Yup
- Day.js
- React Big Calendar
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
  (dashboard)/calendar/page.tsx
  (dashboard)/dashboard/page.tsx
  (dashboard)/events/layout.tsx
  (dashboard)/events/create/page.tsx
  (dashboard)/events/[id]/page.tsx
  (dashboard)/events/[id]/edit/page.tsx
components/
  DashboardHeader.tsx
  DateLocalizationProvider.tsx
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
types/
  index.ts
  react-big-calendar.d.ts
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
- The account menu includes a cleanup action that clears local app data

### Events

- Events are stored in browser `localStorage`
- Logged-in users can manage their own events
- Dashboard separates personal events from other events
- Filters support search, category, event type, date range, and sorting
- Calendar view displays all events and opens event details from selected calendar items

## Notes

- This app currently uses client-side storage only. There is no backend or database.
- Since data is stored in the browser, clearing site storage will remove saved users and events.
- The dev script uses `next dev --webpack` to avoid Turbopack instability in local development.
- Keep a single lockfile/package manager in the repo to avoid dependency mismatches.

## License

This project is for learning and development use.
