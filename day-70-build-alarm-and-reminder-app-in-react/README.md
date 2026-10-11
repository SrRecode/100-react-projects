# Day 70: Build Alarm & Reminder App in React

> Project 70 of 100 · Folder: `day-70-build-alarm-and-reminder-app-in-react`

## What it does

Set a countdown reminder and optionally enable notifications.

### Main workspace

Start/pause, set a duration, and reset a countdown.

### Hands-on workbench

Choose 1–240 minutes, schedule a reminder, and optionally request notification permission.

### Scope and limitations

Page must stay open; notification permission is required and this is not a durable OS alarm. Runs in the open page; not a durable OS alarm.

## Run locally

Use Node.js 20.19+ or 22.12+ and npm. From this folder:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite (usually <http://localhost:5173>). To make and preview a production build:

```sh
npm run build
npm run preview
```

### Available scripts

- `npm run dev` — `vite`
- `npm run build` — `vite build`
- `npm run preview` — `vite preview`

## Implementation

- **Framework:** React with Vite.
- **Entry point:** `src/main.jsx` loads `src/App.jsx`.
- **Feature files:** `src/App.jsx`, `src/FeatureLab.jsx`, `project.json`, and their styles.
- **Runtime dependencies:** `react`, `react-dom`, `vite`.
- **Development dependencies:** none listed.
- **Data:** The shared shell uses browser localStorage; workbench data may be in page memory or IndexedDB, as noted above.

## Privacy and production use

This folder is an independent client-side app; it does not import runtime code from other days. Browser storage belongs to this browser profile and is not a secure vault or backup. Only grant browser permissions when you choose to use the relevant feature. Treat sample data as disposable. Before production use, implement and configure any required authentication, API, cloud storage, AI, or payment service securely.

See the [collection guide](../README.md) for the complete project index and root workspace commands.
