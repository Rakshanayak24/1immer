# Formforge

Turn a short object description into a browser-generated 3D concept. Formforge uses Three.js to construct a prompt-guided, interactive procedural model locally, then exports it as a binary glTF (`.glb`). No account, API key, or model backend is required.

## Run locally

```bash
npm install
npm run dev
```

## Deploy

Import the repository into Vercel with the default Vite settings. `vercel.json` configures the single-page app fallback. A static build can also be hosted on Netlify, Cloudflare Pages, or GitHub Pages.

## What it does

- Interprets common object prompts (robots, plants, houses, rockets, vases, cars, swords, and free-form concepts) into assembled 3D geometry.
- Orbit, pan, zoom, reset, and fullscreen preview powered by Three.js OrbitControls.
- Export the generated geometry as `.glb` with Three.js GLTFExporter.
- Runs completely in the browser; prompts are not sent to a server.

Formforge is a prompt-driven procedural modeling demo. Its geometry is assembled from a small shape grammar; it does not run a trained text-to-3D neural network.
