# Chromatic Atlas

A small animated-gradient studio for building CSS backgrounds. This is Day 1 of the collection and is independently runnable from the `gradient-generator` folder.

## Use the studio

- Choose a color index preset or use **Surprise me** to create a starting point.
- Change each stop's color and position. Add up to five stops or remove stops down to the two-stop minimum.
- Choose a linear, radial, or conic gradient, then adjust its angle and motion speed.
- Pause or play the preview and save named studies in browser storage for later.
- Copy the generated CSS from the page header or the code panel.

Saved studies stay in this browser and are not uploaded. The preview respects the operating system's reduced-motion setting. The generated CSS remains editable and includes the gradient's keyframes. There is no server-side account or cloud synchronization.

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- A current browser

## Run locally

```sh
npm install
npm run dev
```

Vite prints the local development URL. From this folder:

- `npm run build` creates the production bundle in `dist/`.
- `npm run preview` serves the production bundle locally after a build.
- `npm run lint` runs ESLint.

## Main implementation

- `src/main.jsx` boots the React app.
- `src/App.jsx` contains the gradient studio interface and interactions.
- `src/index.css` and the Tailwind/Vite configuration provide the visual system.
- Named studies are kept in this browser's local storage. Clear browser storage to remove them; export or copy CSS if you want a separate backup.

See the [collection guide](../README.md) for all 100 projects and the optional root workspace commands.
