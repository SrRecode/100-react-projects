# Day 09: Build QR Code Generator in React

> Project 09 of 100 · Folder: `day-09-build-qr-code-generator-in-react`

## What it does

Encode short text or a URL as a QR code.

### Included workflow

Edit content, inspect the live matrix, and download SVG.

### Scope and limitations

Local QR versions 1–5, error correction L, up to 106 UTF-8 bytes. Scanner compatibility is not independently certified; verify before distribution.

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
- **Feature files:** `src/FeatureApp.jsx` and `src/feature.css`.
- **Runtime dependencies:** `react`, `react-dom`, `vite`.
- **Development dependencies:** none listed.
- **Data:** See the scope notes for this app’s storage and external-service behavior.

## Privacy and production use

This folder is an independent client-side app; it does not import runtime code from other days. Browser storage belongs to this browser profile and is not a secure vault or backup. Only grant browser permissions when you choose to use the relevant feature. Treat sample data as disposable. Before production use, implement and configure any required authentication, API, cloud storage, AI, or payment service securely.

See the [collection guide](../README.md) for the complete project index and root workspace commands.
