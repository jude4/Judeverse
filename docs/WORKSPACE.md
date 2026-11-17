# Interactive workspace

The optional studio is a small still life around a laptop, a chair and a desk lamp. It is loaded only after selecting **Enter the 3D studio** on the portfolio page.

- Select the laptop to open its lid and move closer. Select its screen again, or **Explore selected work**, to browse projects.
- Select the chair to swivel it and move closer. **Meet the engineer** opens the about panel.
- Select the lamp or **Change the light** to switch between daylight and evening.
- All object actions also have ordinary HTML buttons for keyboard and touch input. The navigation includes every portfolio section without requiring a 3D selection.
- **2D view** unloads the canvas. Context loss retains the content controls; reopening the studio retries WebGL. Escape closes the studio dialog and restores focus to its launch button.

## Rendering budget

The scene uses React Three Fiber's demand frame loop. Camera, lid and swivel animations request frames until they settle, then stop. Reduced-motion preferences snap to the target pose. Eco quality is the default and uses a pixel ratio capped at 1.1, baked-style transparent grounding shadows and no shadow maps. Detail quality caps pixel ratio at 1.5 and adds one 1024-pixel directional shadow map. Neither mode uses postprocessing, animated lights, stars or continuous pointer parallax.

The keyboard uses one instanced mesh for its keys. The screen (1024×640), wood grain (256×256), fabric bump (32×32), and shadow (64×64) textures are generated locally and disposed on unmount. Reflection cards are captured in a local 128-pixel environment map; no remote HDR, model or font is needed. The chair and notebook are original procedural models. Their geometry and material details improve physical plausibility; they are not scans or photorealistic product models.

## Validate the production export

Use Node.js 22. Run `npm ci`, `npm run typecheck`, `npm run lint` and `npm run build`. Do not run development and build simultaneously because both write `.next/`.

After building, `npm run preview` serves `out/` at `/Judeverse/` on port 4173. In a second shell:

```sh
STUDIO_BASE_URL=http://127.0.0.1:4173/Judeverse/ npm run test:browser
```

The browser suite uses Chromium at `/usr/bin/chromium` by default; `CHROMIUM_PATH` overrides it. It exercises product links/filtering, lazy WebGL loading, object controls, demand rendering at rest, mobile/reduced motion and fallback behavior. Software WebGL is useful for repeatable behavior checks, but does not establish frame rates on a visitor's hardware.

SmartStay Rentals and Mailyte use the owner-supplied URLs and owner-confirmed product contributions. Their public sites were blocked by the cloud outbound proxy while preparing this change, so product descriptions remain general. No stack, detailed role, product features or screenshots have been invented.
