# Day 77: Design Star Review Rating UI in React

> Project 77 of 100 · Folder: `day-77-design-star-review-rating-ui-in-react`

## What it does

Choose a star rating and submit a sample review.

### Main workspace

Add, search, complete/reopen, remove, and JSON-export simple sample entries.

### Hands-on workbench

Select 1–5 stars, add optional feedback, and review the entry.

### Scope and limitations

In-memory demo only; not sent or persisted remotely. Records are browser-local. The generic record is a label/status; topic-specific fields are not implied.

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
