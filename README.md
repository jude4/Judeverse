<div align="center">

# JUDEVERSE
### Explore the world behind the code.

**An interactive 3D portfolio by Ufuoma Jude Onohwosafe**

Senior Software Engineer · AI & Intelligent Systems · Creative Web Development

[**Explore Judeverse**](https://jude4.github.io/Judeverse/) · [GitHub Profile](https://github.com/jude4) · [LinkedIn](https://www.linkedin.com/in/jude-onohwosafe)

[![Deploy to GitHub Pages](https://github.com/jude4/Judeverse/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/jude4/Judeverse/actions/workflows/deploy-pages.yml)

</div>

---

## Welcome to Judeverse

**Judeverse** is my immersive, browser-based developer portfolio. Instead of browsing a conventional page of cards, you can explore a nighttime engineering studio, interact with objects, discover selected projects, and experiment with small AI demonstrations.

I am a software engineer with approximately **8 years of experience** building web applications, APIs, and backend systems. I am also pursuing an **MSc in Artificial Intelligence at POLITEHNICA Bucharest**. This project brings together my interests in engineering, machine learning, and creative technology.

> **Project status:** The current version is a working 3D portfolio built with code-generated geometry. It is an initial release, **not yet a photorealistic final environment**. Detailed models, improved textures, and verified project screenshots are planned upgrades.

## What you can explore

- **Interactive 3D studio:** A nighttime workspace with a desk, monitors, project displays, an AI installation, and contextual hotspots.
- **Cinematic navigation:** Smooth camera transitions between About, Projects, AI Lab, Experience, Skills, and Contact.
- **Project case studies:** Learn about fintech, full-stack systems, creative WebGL, and academic AI experiments.
- **Interactive AI lab:** Explore a small neural-network calculation and a working Particle Swarm Optimization (PSO) simulation.
- **Flexible viewing:** Use the scene controls, navigation menu, and a 2D alternative to browse without interacting with 3D objects.
- **Responsive interface:** Browser-based controls and layouts designed for different screen sizes.

## Featured projects

| Project | Focus | Explore |
| --- | --- | --- |
| **Flynt** | Transaction-risk assessment, event-driven systems, fintech | [Website](https://useflynt.com) |
| **Utilify** | Everyday utility payments and platform engineering | [Website](https://utilify.ng) |
| **The Camera** | Interactive 3D experiences with Three.js and WebGL | [Live demo](https://the-camera.vercel.app/) |
| **Neural Spam Detection** | NLP, TF-IDF, feedforward neural networks | Academic project |
| **Swarm Intelligence** | Particle Swarm Optimization for neural-network research | Research / experiment |
| **Environmental Data Lab** | Kafka, PySpark, MongoDB, Streamlit | Academic prototype |

Project descriptions are intentionally conservative until supporting assets and verified outcome details are added.

## Built with

| Area | Technologies |
| --- | --- |
| Framework | Next.js 15, React 19, TypeScript |
| 3D rendering | Three.js, React Three Fiber, React Three Drei, WebGL |
| Animation | GSAP |
| State management | Zustand |
| Interface | CSS, Lucide React |
| Hosting | GitHub Pages, GitHub Actions |

## Run it locally

**Prerequisites:** Node.js 22 (recommended, matching the GitHub Actions build) and npm.

1. Clone the repository and enter the project:

   ```bash
   git clone https://github.com/jude4/Judeverse.git
   cd Judeverse
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open **http://localhost:3000/Judeverse/**.

The `/Judeverse` path is intentional: the project's `next.config.mjs` sets a base path for GitHub Pages.

### Other commands

```bash
npm run typecheck   # TypeScript check
npm run lint        # Lint source files
npm run build       # Produce the static export in out/
```

For a local preview of the static export, you can serve the generated `out/` directory with a static-file server. Because this project uses `output: 'export'`, `npm start` is not its static-export preview command.

## Deployment

This repository is configured to deploy automatically to **GitHub Pages**.

- The `main` branch triggers [the deployment workflow](.github/workflows/deploy-pages.yml).
- Next.js produces a static site in `out/` using `output: 'export'`.
- The workflow uploads the generated site and publishes it through GitHub Pages.
- The expected public URL is **https://jude4.github.io/Judeverse/** once deployment succeeds.

For the deployment to work, go to **Settings → Pages → Build and deployment** and choose **GitHub Actions** as the source. Check the [Actions tab](https://github.com/jude4/Judeverse/actions) for the latest deployment result.

## Customize the portfolio

| File | What to update |
| --- | --- |
| `data/portfolio.ts` | Project details, technology lists, live links, and social links |
| `components/ui/ContentPanel.tsx` | About, experience, education, skills, and project presentation |
| `components/scene/StudioCanvas.tsx` | Studio geometry, lighting, camera points, and interactive objects |
| `components/demos/NeuralDemo.tsx` | Neural-network demonstration |
| `components/demos/PSODemo.tsx` | PSO simulation |
| `store/useStudioStore.ts` | Navigation, selected projects, and scene settings |
| `app/globals.css` | Styling and responsive behavior |
| `app/layout.tsx` | SEO metadata and social sharing information |
| `ASSET_MANIFEST.md` | Missing assets and planned 3D upgrades |

Add genuine project screenshots to `public/assets/projects/` and reference them in `data/portfolio.ts`. If an image is missing, the current portfolio uses a designed fallback rather than a fabricated product screenshot.

## Roadmap

- [x] Interactive studio with clickable areas
- [x] Camera-driven navigation and project panels
- [x] Neural-network and PSO demonstrations
- [x] GitHub Pages static-export deployment configuration
- [ ] High-detail Blender / GLB furniture and architectural models
- [ ] Improved physically based materials, textures, and lighting
- [ ] Real screenshots and richer verified project case studies
- [ ] Expanded device testing, performance profiling, and accessibility review
- [ ] Final résumé PDF and production metadata review

## About me

I enjoy designing systems that are useful, reliable, and thoughtfully engineered—from full-stack products and event-driven services to intelligent applications and interactive web experiences.

- **GitHub:** [github.com/jude4](https://github.com/jude4)
- **LinkedIn:** [jude-onohwosafe](https://www.linkedin.com/in/jude-onohwosafe)
- **Email:** [judeufuomao@gmail.com](mailto:judeufuomao@gmail.com)

---

<div align="center">

**Built with curiosity, code, and a love of exploring what's possible on the web.**

</div>
