# BUILD-REPORT: kalights-1789175572458 (site_update)

Request (INSTRUCTIONS.md): add the 2 real intake photos (4484.jpg, 4485.jpg) to the gallery. Replace the hero with 4484.jpg only if the current hero is a stock photo; otherwise leave it.

## 1. Verify output

Run as `PREVIEW=1 npm run verify` (attempt 3 of 3, exit 0):

```
#   check                                                                   result  detail
--- ----------------------------------------------------------------------  ------  ------
1   site.config.ts parses against schema                                    PASS
2   businessSlug and identity are filled in (not the template sample)       PASS    slug "kalights-1789175572458"
3   businessSlug exists in the live platform database                       PASS    platform confirmed slug "kalights-1789175572458"
4   components/ContactForm.tsx matches sealed checksum                      PASS    1fb815af450d
5   built HTML posts to the www contact endpoint, never the bare apex       PASS    endpoint on /contact, /
6   honeypot hp_7d3a_ref inside hidden wrapper, no "company" field          PASS
7   content/ contains no bare phone, address, email, or price               PASS
8   no placeholder tokens in content/ or site.config.ts                     PASS
9   every JSON-LD block parses, has @context/@type, all types on allowlist  PASS
10  Review/aggregateRating only with real, visible reviews                  PASS
11  every image has a 15+ char alt; no two images share an alt              PASS
12  exactly one <h1> per page                                               PASS
13  titles unique, 50 to 60 chars as rendered                               PASS
14  meta descriptions present, unique, 140 to 160 chars                     PASS
15  canonical present on every page and matches config.domain               PASS
16  sitemap lists every built route and nothing else                        PASS
17  every internal link resolves to a built route                           PASS
18  launch gate (no provisional values, placeholders, or noindex)           PASS    BYPASSED by PREVIEW=1: 110 launch blocker(s). Not deployable to production.
19  robots meta on every page matches indexing.json                         PASS    noindex=true
20  lead form cannot POST in a preview build                                PASS    /contact=preview-disabled, /=preview-disabled

20/20 checks passed across 10 pages.
All checks passed for a PREVIEW build. The launch gate was bypassed: NOT deployable to production.
```

**Plain `npm run verify` (the workflow's command, without `PREVIEW=1`) fails at `next build`.** The launch gate (`scripts/launch-gate.mjs`, called from `next.config.mjs`) finds 110 launch blockers: 4 provisional config values, 32 placeholder references, 57 placeholder assets, 16 registered placeholders, and `indexing.json` noindex=true. Every one of them was already on `main` before this run. This update adds none and removes none. The site is still a preview build, and clearing the blockers needs client photos and confirmed facts, not a code change. I did not touch the gate.

## 2. site.config.ts change

This is the only config change. Business facts, copy, services and layout are unchanged. The gallery list lives only in config, so adding photos to the gallery needs this edit even though the instructions say "no config changes":

```ts
    gallery: [
      'backyard-patio-at-dusk-with-string-lights-strung-overhead-an.jpg',
      'covered-patio-at-dusk-with-lights-installed-along-the-cover-.jpg',
      'placeholder-gallery-1.jpg',
      'placeholder-gallery-2.jpg',
      'placeholder-gallery-3.jpg',
      'placeholder-gallery-4.jpg',
    ],
```

The real photos go first, so the homepage gallery teaser (which shows the first 4) displays them. The four existing placeholders stay where they were because the instruction was to add, not replace.

Other files changed: `public/images/manifest.json` (two new entries with alt text) and new WebP renditions under `public/images/processed/` from `npm run images`.

## 3. Alt-text checks (both new images re-viewed by filename)

- `backyard-patio-at-dusk-with-string-lights-strung-overhead-an.jpg` (4484.jpg): "Backyard patio at dusk with string lights overhead and warm white lights along the eaves and patio cover"
- `covered-patio-at-dusk-with-lights-installed-along-the-cover-.jpg` (4485.jpg): "Covered patio at dusk with lights along the cover edge, a ceiling light over seating, and landscape uplights"

Neither caption names a town, so neither alt names one.

## 4. Design direction

Unchanged. This is a site_update, so no redesign.

## 5. Templated-looking things

No design or components were changed. One thing a reviewer will see: `GalleryGrid` crops every image to 16:9 (`aspect-video object-cover`), and both new photos are 3:4 portrait phone shots. The crop keeps the middle band (patio cover and lights) but drops the sky and foreground. Fixing it would mean a layout change, which the instructions rule out.

## Hero decision

**Hero left as is (`placeholder-hero.jpg`).** The instruction says to replace the hero only if it is a stock photo. The current hero is a labeled "PHOTO PENDING" placeholder graphic, not a stock photo, so the "otherwise leave the hero as is" branch applies. Separately, 4484.jpg would fail the AGENT.md hero rules even though ASSETS.json marks it `heroCandidate`: the frame has an electrical disconnect box on the wall, an AC condenser with a water bottle on it, a loose cardboard box, a covered grill and a neighboring shed, and it is portrait. 4485.jpg is cleaner but is still portrait and has a child's tricycle and clutter in it. **If Will wants a real photo in the hero now, he should say so explicitly. A wide, uncluttered landscape shot of a lit roofline would serve better.**

Photos placed: 2 of 2 from ASSETS.json, both in the gallery. None left out. Neither has a `service`, so `services[].image` stays `null`.

## 6. UNRESOLVED (unchanged by this run)

- Registered legal name: `legalName` is provisional.
- Primary city and state: `primaryCity` and `primaryState` are provisional.
- Domain: `domain` is provisional.
- Street address: `address` is null, so no address block renders.
- Hours: `hours` is null, so no hours block renders.
- Years in business, license number, insurance: `yearsInBusiness`, `licenseNumber`, `insured` are null, so those credential lines don't render.
- Reviews: `reviews` is empty, so no reviews section and no rating schema.
- Pricing: `priceFrom` is null, so no price is shown.
- Photos: the hero, 4 gallery slots, 3 crew photos, all 8 visualizer scenes and the service image are still placeholders or null.

## 7. INVENTED

Nothing. I did not add a city to either alt, because neither caption gives one.

## 8. Template / process notes

- The workflow's verify step runs plain `npm run verify`, which always fails on this repo while it is a preview (launch gate in `next.config.mjs`). Every site_update before launch will therefore report a red gate unless the workflow sets `PREVIEW=1`. That belongs in the template repo; I did not edit `.github/` or `next.config.mjs`.
- ASSETS.json marked 4484.jpg `heroCandidate: true` even though it fails AGENT.md's own rejection list (meter/electrical box, clutter, portrait). The intake's hero flag needs a human check.
- `GalleryGrid` forces 16:9 on portrait phone photos (see item 5).
