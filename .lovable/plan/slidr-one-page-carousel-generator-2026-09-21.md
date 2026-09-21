# Slidr — one-page carousel generator

## What I’ll build
- Replace the blank home page with a polished one-page Slidr workspace.
- Keep the flow to three actions: describe an idea, choose slide count and platform, then generate.
- Render the result as a horizontally scrolling, snap-aligned carousel with live switching across five visual themes.
- Add per-slide PNG export and one-click PDF export for the complete carousel.

## AI generation
- Add one server-side Lovable AI call using `google/gemini-3-flash-preview`, matching the requested Gemini Flash 3 family.
- Keep the key and copywriting prompt server-side.
- Validate the returned JSON shape and exact slide count before displaying it.
- Surface safe, specific generation errors with a retry action; no mock fallback or hidden generic response.

## Design and interaction
- Create five separate, export-safe slide components sharing one data contract:
  1. Bold Brutalist
  2. Clean Minimal
  3. Dark Neon
  4. Soft Pastel
  5. Editorial
- Give each theme distinct typography, spacing, progress treatment, hook/content/CTA layouts, and a memorable visual motif.
- Render every slide at a true 1080×1350 canvas and scale it only for on-screen previews.
- Keep controls compact and accessible on desktop and mobile, with loading, empty, success, and error states.

## Technical details
- Use the project’s supported TanStack Start server boundary rather than a Next.js API route; behavior and key isolation remain the same.
- Use semantic design tokens in the global stylesheet and load theme fonts through document head links.
- Add lightweight browser-only export libraries for PNG capture and PDF assembly.
- Keep generated results in page state only: no accounts, database records, editor, image generation, or settings.
- Add unique home-page title, description, Open Graph, and Twitter metadata.

## Verification
- Exercise generation through the live route and inspect the AI response.
- Verify all five themes, horizontal scrolling, theme switching, retry behavior, PNG export, and PDF export.
- Check desktop and mobile layouts for clipping and overlap.
