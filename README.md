# Idea Carousel Studio

Build a minimal, beautifully designed web app called "Slidr" that turns an idea into a social media carousel.

CORE FLOW (keep it dead simple, 3 steps, one page):
1. User types a topic or idea in one big input box, picks slide count (5, 7, or 10) and platform (LinkedIn 1080x1350 or Instagram 1080x1350), then clicks Generate.
2. App calls the Gemini API and gets back structured JSON: a hook slide, content slides (short title + 1 to 2 line body each), and a closing CTA slide.
3. App instantly renders the carousel in 5 design themes. User switches themes with a theme picker and sees the preview update live.

GEMINI LOGIC:
- Single API call, Gemini Flash 3.
- System prompt: "You are a carousel copywriter. Return ONLY valid JSON: { hook, slides: [{ title, body }], cta }. Hook under 10 words. Titles under 6 words. Body under 20 words. Punchy, no filler, no generic advice, no dashes."
- Parse JSON safely, show a friendly error with a retry button if parsing fails.
- API key stays server side (Next.js API route).

5 DESIGN THEMES (each a separate React component taking the same JSON):
1. Bold Brutalist: thick black borders, off white background, one loud accent color, oversized type
2. Clean Minimal: lots of whitespace, one serif headline font, thin lines, muted palette
3. Dark Neon: near black background, gradient glow accents, modern sans font
4. Soft Pastel: rounded cards, warm gradient backgrounds, friendly rounded font
5. Editorial: magazine style, big numbers per slide, serif plus sans pairing, high contrast

Each theme needs: distinct fonts (Google Fonts), a hook slide, numbered content slides, a CTA slide, a small progress indicator ("2/7"), and consistent margins so nothing gets cut off in a feed.

UI:
- Landing and app on the same page. Big input on top, generated carousel below.
- Slides shown as a horizontal scroll row with snap scrolling, plus a theme switcher as 5 small preview chips.
- Clean, modern, lots of breathing room. No clutter, no sidebar, no login.

EXPORT:
- "Download all as PDF" and "Download slide as PNG" buttons.
- Render slides at exactly 1080x1350 and scale down for preview.

TECH:
- Next.js + Tailwind, deployed on Vercel.
- Slides built as plain JSX/CSS components so export works with html-to-image or @vercel/og.

DO NOT add: auth, database, manual editor, image generation, or settings pages. Keep the code small and readable.

Design bar: it should look like a paid product, not a template. Strong typographic hierarchy, generous spacing, one memorable detail per theme.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0011bf2a-9e31-4f9a-a3ec-a10baa87729d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
