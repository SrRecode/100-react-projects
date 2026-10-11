# Chromatic Atlas

A small animated-gradient studio for building CSS backgrounds. Switch between linear, radial, and conic gradients, tune color stops and motion, save named studies on this device, and copy the generated CSS.

## Use the studio

- Choose a color index preset or use **Surprise me** to create a starting point.
- Change each stop's color and position. Add up to five stops or remove stops down to the two-stop minimum.
- Choose a linear, radial, or conic gradient, then adjust its angle and motion speed.
- Pause or play the preview and save named studies in browser storage for later.
- Copy the generated CSS from the page header or the code panel.

Saved studies stay in this browser and are not uploaded. The preview respects the operating system's reduced-motion setting. The generated CSS remains editable and includes the gradient's keyframes.

## Development

```sh
npm install
npm run dev
```

Run `npm run lint` to lint the project and `npm run build` to create a production build in `dist/`.
