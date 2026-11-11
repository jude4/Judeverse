# Judeverse — Ufuoma Jude Onohwosafe

A responsive portfolio for a senior software engineer based in Bucharest. The main page presents professional projects, a CV-backed career timeline, education, skills and contact details. The interactive 3D studio and AI demonstrations are optional experiences loaded on demand.

## Development

Use Node.js 22 and npm, matching GitHub Actions.

```bash
npm ci
npm run dev
```

The application uses the `/Judeverse` base path. Its development route is `http://localhost:3000/Judeverse/`.

```bash
npm run typecheck
npm run lint
npm run build
```

`npm run build` creates a static export in `out/`. `npm start` is not compatible with this export. A local static server must mount `out/` at `/Judeverse/`, including `/Judeverse/_next/` and `/Judeverse/assets/`.

## Portfolio content

| Location | Purpose |
| --- | --- |
| `components/Portfolio.tsx` | Main portfolio, filters, project dialogs, optional live embeds and demos |
| `app/portfolio.css` | Responsive portfolio styles and reduced-motion support |
| `data/portfolio.ts` | Project details, contributions, technology and live links |
| `data/career.ts` | Employment, education and public asset URLs |
| `public/assets/portrait/` | Responsive AVIF portraits with WebP fallbacks |
| `public/assets/documents/ufuoma-jude-resume.pdf` | Downloadable CV supplied by the owner |
| `components/StudioApp.tsx` | Optional immersive portfolio |
| `components/studio.css` | Studio and demonstration styles, imported with those experiences |
| `app/layout.tsx` | Production metadata, canonical URL and social preview |

Professional roles, dates and contributions are based on the supplied CV. The owner confirmed full-stack development roles on Atravelikes, Tiqwa and Beezlinq, and identified them as travel platforms and a digital business card platform, respectively. Atravelikes technical details remain general because its stack and specific features were not supplied. Project artwork is an illustrative overview, not a screenshot of the live product. No unverified performance or revenue metrics are claimed.

Project dialogs show contributions and offer a direct live link. A third-party website is embedded only after the visitor selects **Preview here**. Some sites prohibit embedding through their own security headers or require authentication; the external link remains available. No third-party page loads during the initial portfolio visit.

## Performance and accessibility

- Static HTML includes the introduction, projects, career and education.
- The initial page loads no WebGL canvas, 3D scene, AI simulation or third-party embed.
- The studio is explicitly requested and starts at low graphics quality.
- Local responsive AVIF/WebP assets have fixed dimensions; no runtime image service or external fonts are required.
- Native career disclosures support keyboard navigation. Native dialogs trap focus, support Escape and restore focus on close.
- Mobile navigation, a skip link, descriptive controls and reduced-motion preferences are supported.
- Lint excludes generated `.next/`, `out/` and `next-env.d.ts` rather than inspecting build outputs.

## Deployment

The existing GitHub Actions workflow builds and publishes `out/` to GitHub Pages on pushes to `main`. Production URL: https://jude4.github.io/Judeverse/

Source changes do not deploy until committed and pushed through that workflow. GitHub Pages serves compressed static assets; final performance also depends on the visitor's device, network and the hosting response.
