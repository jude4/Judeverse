# The Architect's Studio

An original immersive engineering portfolio built with **Next.js 15, React 19, TypeScript, React Three Fiber, Drei, Three.js, GSAP, and Zustand**.

A cinematic nighttime studio includes an interactive engineering workstation, project gallery, neural installation, career display, and contact station. The readable content is available in polished DOM panels; users can also navigate without clicking 3D objects.

> **Status:** A working, self-contained v1 implementation with procedural 3D models. It is **not yet photorealistic**: true high-fidelity rendering requires custom optimized GLB/Blender models, professionally prepared textures, baked lightmaps, and iterative visual inspection. See `ASSET_MANIFEST.md` for upgrade guidance.

## Setup

Requirements: **Node.js 20.9+** and npm.

```bash
npm install
npm run dev
```

Open **http://localhost:3000**.

Production check:

```bash
npm run typecheck
npm run lint
npm run build
npm start
```

## Where to customize

- `data/portfolio.ts`: Edit all project descriptions, technologies, links, and skills.
- `components/ui/ContentPanel.tsx`: About, education, work experience, project detail, skills, and contact.
- `components/scene/StudioCanvas.tsx`: 3D model composition, lighting, skyline, animation, camera positions, and click hotspots.
- `store/useStudioStore.ts`: App navigation, active project, quality, lighting.
- `components/demos/NeuralDemo.tsx`: Real small feedforward neural network computation.
- `components/demos/PSODemo.tsx`: Real particle-swarm optimization on a convex 2D objective function.
- `app/globals.css`: The visual interface and responsive layouts.
- `app/layout.tsx`: Replace `metadataBase` with the deployed URL.

## Navigation

1. Enter the studio, or choose **Skip to Work**.
2. Select objects: monitor, project wall, AI installation, career board, contact terminal.
3. Use navigation menu to reach all areas directly.
4. Escape returns to the main room.
5. Switch lighting, graphics quality, or the 2D fallback using screen controls.
6. AI Lab → Neural Net changes calculations in response to sliders. AI Lab → Swarm runs actual PSO updates.

## Real project assets

Drop your own approved screenshots into `public/assets/projects/` and add `image: '/assets/projects/your-file.png'` in the relevant project object. The project gallery automatically displays that screenshot; when an image is unavailable it uses intentional abstract visuals rather than fabricating screenshots.

## Production quality / accessibility

- Camera positions and navigation remain accessible without needing to click 3D meshes.
- UI text is real HTML, not unreadable tiny 3D textures.
- A manually selectable 2D mode supports browsing the portfolio on weak devices.
- `prefers-reduced-motion` reduces camera and CSS animation.
- Basic WebGL fallback is provided.
- Revisit real-device performance, accessibility, and test coverage before production deployment.
- The implementation currently uses Google Fonts; replace with locally self-hosted fonts for privacy / offline availability.

## Deploying to Vercel

Push the project to a Git repository and import it into Vercel as a Next.js project. **Do not publish sensitive information**. Update the social URLs, work history and metadata before launch.

## Important honesty about content

The employment timeline is deliberately incomplete rather than inventing company names, dates or titles. The user should transfer verified employment details from their latest CV. Some project summaries are intentionally conservative and should be checked against actual project documentation.
