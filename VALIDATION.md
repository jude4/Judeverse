# Portfolio validation

Validated on the local production static export using Node.js 22.23.4 and Chromium, November 11, 2026. This does not establish that changes are deployed to GitHub Pages.

## Required checks

- `npm run build`: passed, including Next.js type validation and static export.
- `npm run typecheck`: passed.
- `npm run lint`: passed with ten existing warnings in the optional 3D scene components. No new component warnings.
- `git diff --check`: passed.

## Functional browser checks

Playwright exercised the actual exported application on desktop and mobile:

- Introduction and six professional project cards render.
- Travel filtering selects Tiqwa and Atravelikes.
- Project dialogs show contributions and correct external URLs.
- Escape closes project dialogs and restores keyboard focus to the opening button.
- Embedded websites load only after selecting Preview here, with the direct website link always available.
- Employment disclosures expand to reveal CV-backed role details.
- The swarm demo advances iterations when Run is selected and pauses successfully.
- The résumé returns HTTP 200 with a valid PDF header.
- Mobile navigation closes after selecting a section.
- No horizontal overflow at 320px or 390px widths.
- No initial WebGL canvas or third-party page requests.
- Reduced-motion preferences disable smooth scrolling.
- The introduction, projects and career remain in HTML with JavaScript disabled.

Axe WCAG 2 A/AA and WCAG 2.1 AA checks found no violations on desktop, at 320px mobile width, or in the project dialog. This automated check does not replace a complete manual accessibility audit.

## Performance evidence

Lighthouse mobile audits of the production export through a local gzip-capable static server, representing compressed static delivery:

| Metric | Final run |
| --- | --- |
| Performance | 99 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| Largest contentful paint | 2.1 seconds |
| Cumulative layout shift | 0 |

An earlier compressed run scored 96 for performance. A plain uncompressed server and concurrent CPU work produced lower scores. These are local lab measurements, not guarantees of field performance or results on the deployed site. The final initial JavaScript estimate from Next.js is 116 KB. The responsive AVIF portrait files are approximately 9.4 KB and 35 KB, with WebP fallbacks.

## External limitations

The cloud network policy blocks inspecting atravelikes.com, beezlinq.com and tiqwa.com. Their project classification and roles come from the owner and supplied CV; no website screenshots or unverified technical claims were fabricated. The Beezlinq iframe request was correctly initiated by the opt-in preview, but its remote page could not load in this environment. A remote site's frame-security headers may prevent embedding after deployment, so visitors always have a direct external link.

The portrait is an image-tool-prepared crop of the supplied photograph, compressed into responsive local assets. The CV is the owner-supplied document.
