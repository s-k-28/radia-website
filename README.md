# Radia — Website

Marketing site + landing page for **Radia**, an AI skin-analysis app. _Scan your skin, unlock your glow._

Seeded from the current live landing page. This repo is where we level the design up to senior motion-design quality.

## Brand
- **Aesthetic:** luminous beauty-tech — warm coral/peach over ivory. Light, clean, premium.
- **Colors:** Coral `#F6C6AF · #EE9B79 · #E2714D` (primary) `· #B0432A` · Ivory `#F9F1EB` · Cream `#FFF7EF`
- **Type:** Hanken Grotesk (UI) · Quicksand (display/wordmark)
- Full brand spec + logo assets live in the app repo under `brand/`.

## Run it
Pure static HTML/CSS/JS — no build step.
```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Pages
`index` · `about` · `pricing` · `faq` · `contact` · `privacy` · `terms` · `404`
**To add:** `security` (face photos = biometric-adjacent → GDPR/CCPA) · `science` (evidence-based methodology + medical disclaimer)

## Motion roadmap (the upgrade)
Current motion is baseline (IntersectionObserver fade-ins). Target = jury-tier scroll-driven motion:
- **GSAP + ScrollTrigger** — scroll-*linked* scrubbing, not all-or-nothing fades
- **Lenis** — smooth scroll
- Hero glow that tracks cursor/scroll · scan-line phone reveal (**Rive**) · Glow Score spring count-up · pinned Apple-style feature sections
- Always gated behind `prefers-reduced-motion`

## Principle
All skincare guidance is **evidence-based** (PubMed / AAD / Cochrane). Cosmetic guidance only — not medical advice.
