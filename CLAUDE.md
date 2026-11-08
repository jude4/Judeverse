# Claude Code engineering rules

- This is an original cinematic 3D portfolio for Ufuoma Jude Onohwosafe; do not copy reference sites.
- Preserve the working Next.js / React Three Fiber setup and verify before editing broadly.
- Use `npm run typecheck`, `npm run lint`, and `npm run build` to validate changes.
- Keep UI readable through real HTML instead of rendering important text entirely inside the WebGL scene.
- Centralize portfolio facts in `data/portfolio.ts` and do not invent employers, metrics, project achievements or screenshots.
- Prefer high-quality optimized GLB models, realistic PBR materials, baked lights, and restrained effects over huge bundles and excessive real-time postprocessing.
- Keep the studio interactive via a centralized camera director and Zustand navigation.
- Respect reduced motion, mobile usability, keyboard and accessible non-WebGL navigation.
- Don't discard existing work. When an asset is unavailable, track it in `ASSET_MANIFEST.md`, use a transparent fallback, and proceed.
- After each substantial change, inspect actual browser screenshots if browser tools exist; report honestly what was visually verified.
- Don't call a procedural scene fully photorealistic; visual quality still requires a dedicated art pass.
