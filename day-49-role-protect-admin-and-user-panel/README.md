# Day 49: Role Protect Admin & User Panel

> Project 49 of 100 · Folder: `day-49-role-protect-admin-and-user-panel`

## What it does

Preview role labels in a demo interface.

### Main workspace

Choose a demo role, enter a sample email, and preview local sign-in.

### Scope and limitations

No protected user/admin routes or server-validated roles. No password, provider, server session, or real authorization.

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
