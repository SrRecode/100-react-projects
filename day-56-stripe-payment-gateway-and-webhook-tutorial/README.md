# Day 56: Stripe Payment Gateway & Webhook Tutorial

> Project 56 of 100 · Folder: `day-56-stripe-payment-gateway-and-webhook-tutorial`

## What it does

Explore a safe payment-intent pattern without real money.

### Main workspace

Add one sample product, review in-memory quantity/total, and simulate checkout.

### Hands-on workbench

Review the fixed demo order and simulate a successful checkout.

### Scope and limitations

No Stripe SDK/key, card form, intent, webhook, or charge. Production needs a secure server and signed webhook verification. No credentials/card data, live payment, or full catalog/backend.

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
