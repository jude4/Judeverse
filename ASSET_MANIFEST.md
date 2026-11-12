# Asset manifest and visual upgrade plan

## Supplied assets


No personal photos, logos, résumé PDF, project screenshots or GLB room assets were attached to this specific request. This v1 uses code-built geometry, original generated screen layouts and fallback project artwork.

## High-priority replacements for a photorealistic v2

1. `models/studio-room.glb`: Custom architectural room with correct scale and optimized lightmap UVs.
2. `models/workstation.glb`: Detailed wood desk, two monitors, chair, accessories and functional scene pivot markers.
3. `models/shelf-exhibit.glb`: Project gallery models that match the scene's artistic direction.
4. `models/ai-installation.glb`: Beautiful architectural glass/metal fixture surrounding procedural neural visualization.
5. `textures/`: Proper PBR roughness, normal, albedo and appropriate AO/lightmaps in optimized formats.
6. `environment/`: Licensed exterior panorama or carefully developed distant skyline, HDR lighting and baked window glow.
7. `projects/`: Verified screenshots from Flynt, Utilify, The Camera and the academic projects.
8. `documents/resume.pdf`: Your approved résumé.

## Rules

Use genuine project screenshots, not fabricated UI screenshots. Use licensed assets only. Record source, creator and license for every third-party asset before commercial publishing. Keep polygon counts and texture budgets reasonable, prioritize a beautiful image over excessive dynamic lights.

## Project screenshot capture — November 12, 2026

The main project gallery now supports real local screenshots through each project's `image` field (a path under `public`, such as `/assets/projects/tiqwa.webp`). Images appear in both cards and project dialogs. Existing overview artwork remains until a genuine capture is available.

Capture is currently blocked by the cloud outbound network policy. HTTPS requests to the Camera and Tiqwa sites returned proxy CONNECT 403, and Chromium reported ERR_TUNNEL_CONNECTION_FAILED for the Camera. Required project domains were saved to the environment draft. No error pages or fabricated screenshots have been added. After network access is saved and applied, capture the public sites, verify the images, and set the corresponding project image paths. Cardplot has no supplied public URL.
