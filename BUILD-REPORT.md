# BUILD-REPORT: kalights-1789175572458 (site_update)

Scope, from INSTRUCTIONS.md: add the client's two intake photos (4484.jpg, 4485.jpg). Make 4484 the hero if the current hero is a stock photo or placeholder, put 4485 in the gallery, use the captions as alt text, and swap out placeholder images where the new photos fit. Copy, services, prices, phone, slug, design and content were not touched.

## 1. Verify output

The gate was run three ways:

- **Without PREVIEW=1** (how `.github/workflows/aa-build.yml` runs it): **RED.** The launch gate in `next.config.mjs` stops `next build` before verify runs. It found 79 blockers, and every one was already there before this change: PROVISIONAL markers in `site.config.ts` (legalName, primaryCity, primaryState, domain), crew and scene placeholder images and their references, 11 placeholder entries in `placeholders.json`, and `indexing.json` set to noindex: true. This update removed 5 placeholder images and their entries. Clearing the rest would mean inventing facts, supplying photos the client hasn't sent, or making the site indexable, which is only allowed in a `go_live` run. So the remaining blockers stay, and the workflow's verify step will show red for that reason alone.
- **With PREVIEW=1** (the documented way to build a preview): all 20 checks pass. Table:

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
18  launch gate (no provisional values, placeholders, or noindex)           PASS    BYPASSED by PREVIEW=1: 79 launch blocker(s). Not deployable to production.
19  robots meta on every page matches indexing.json                         PASS    noindex=true
20  lead form cannot POST in a preview build                                PASS    /contact=preview-disabled, /=preview-disabled

20/20 checks passed across 10 pages.
All checks passed for a PREVIEW build. The launch gate was bypassed: NOT deployable to production.
```

## 2. site.config.ts

The only change is the `images` block:

```ts
  // Hero and gallery are the client's own install photos (intake 4484.jpg, 4485.jpg).
  // Crew images are still labeled placeholders under launch blocker B1.
  images: {
    hero: 'backyard-patio-at-dusk-with-string-lights-strung-overhead-an.jpg',
    about: null,
    gallery: ['covered-patio-at-dusk-with-lights-installed-along-the-cover-.jpg'],
    crew: ['placeholder-crew-1.jpg', 'placeholder-crew-2.jpg', 'placeholder-crew-3.jpg'],
  },
```

The full file is in this commit. Every other field is unchanged.

## 3. Alt-text checks

There are only two new images, so both were checked by opening the file itself (not by its place in the list). Both alts are the client's captions, word for word, as the instructions asked. They name no town, street or customer.

- `backyard-patio-at-dusk-with-string-lights-strung-overhead-an.jpg`: "Backyard patio at dusk with string lights strung overhead and lit eave lights along the roofline and patio cover". This matches the photo: string lights over the yard, eave lights along the roofline, and a lit patio cover at the back.
- `covered-patio-at-dusk-with-lights-installed-along-the-cover-.jpg`: "Covered patio at dusk with lights installed along the cover edge, ceiling light over the seating area and landscape uplights by the wall". This matches the photo: point lights along the cover edge, a ceiling fixture over the seating, and uplights on the plants by the block wall. This alt is 24 words, above the 10 to 20 word guideline. It was kept because the instructions say to use the caption, and verify only requires 15+ characters and a unique alt.

## 4. Design direction

Unchanged. This was a site_update, so nothing was redesigned. The night photos fit the existing dark theme.

## 5. Templated-looking things (CI self-check, limited to what changed)

1. **The hero and gallery used labeled "photo pending" graphics.** Fixed: the hero is now the client's 4484 photo, and the gallery is now 4485.
2. **The gallery has one photo in a two-column grid** (`components/GalleryGrid.tsx`), so the homepage teaser and /gallery show one tile with an empty column next to it. Not fixed: the client sent only two photos, and the instructions limit 4484 to the hero unless the hero was already a real photo. Fix: more install photos from the client (see CLIENT-TODO.md).
3. **Both photos are portrait (1536x2048), but the hero is a wide full-bleed crop.** At 1440px, `object-cover` crops to the vertical middle. That middle is the patio, the AC condenser and a cardboard box, and the eave and string lights at the top are mostly cut off. It also means no 1920w version was made (the original is 1536 wide). Not fixed: changing the hero crop means editing `components/Hero.tsx`, which this update didn't cover. See item 8.

## Photos placed

- Hero: `backyard-patio-at-dusk-with-string-lights-strung-overhead-an.jpg` (4484). It is the intake's `heroCandidate`, the instructions name it, and the old hero was a placeholder. Note: the AGENT.md hero rules would reject this frame. It shows an AC condenser, an electrical disconnect box, a water bottle, a cardboard box and a neighbor's or shed wall. It was used because the client asked for it explicitly. A cleaner hero photo is requested in CLIENT-TODO.md.
- Gallery: `covered-patio-at-dusk-with-lights-installed-along-the-cover-.jpg` (4485).
- Placed 2 of 2 photos from ASSETS.json. None were left out.
- Removed (no longer used anywhere): `placeholder-hero.jpg` and `placeholder-gallery-1..4.jpg`, their processed WebPs, their manifest entries and their `placeholders.json` entries.
- No service has its own photo. `services[0].image` stays `null` because ASSETS.json gave neither photo a `service`.

## 6. UNRESOLVED

These were already open and this update did not change them:

- Street address → `address: null` → no address in the footer or contact details, no streetAddress in the schema.
- Hours → `hours: null` → no hours block, no openingHours in the schema.
- Years in business → `yearsInBusiness: null` → no years trust label.
- License number → `licenseNumber: null` → no license line.
- Insurance → `insured: null` → no insured label.
- Reviews → `reviews: []` → no reviews section, no review schema.
- Price → `services[0].priceFrom: null` → no "from" price. Only the price note shows.
- Service photo → `services[0].image: null` → the service page has no photo.
- About photo → `images.about: null` → the about image doesn't render.
- GBP, Facebook and Yelp → `profiles.*: null` → no links to them.
- Still PROVISIONAL: `legalName`, `primaryCity`, `primaryState`, `domain`. Each blocks a production build until the client confirms it.
- Crew photos (3) and the 8 visualizer scene photos are still placeholders.

## 7. INVENTED

Nothing. I did not add a town or job location to either alt, even though "Corona" would have been easy to add, because the instructions forbid it and the intake doesn't say where the jobs were.

## 8. Problems with the template / for the human

- **Hero crop on portrait photos:** `components/Hero.tsx` uses a fixed `object-cover` with no way to set the focal point, so a portrait hero gets cropped to its middle on desktop. Suggestion: add an optional `images.heroPosition` (for example `'center top'`) to the config schema and use it in Hero. I did not make this change because it touches `lib/config-schema.ts`, which CI is forbidden to edit.
- **CI and the launch gate clash:** `aa-build.yml` runs `npm run verify` without `PREVIEW=1`. A site still in preview (noindex: true, provisional markers) can therefore never pass the workflow's verify step, even when every one of the 20 checks passes. Either the workflow should set `PREVIEW=1` for site_update runs on non-launched sites, or the report should accept the launch gate failing on a preview site.
- **The instructions say "Open a PR"**, but AGENT.md's CI mode says the workflow opens it and the agent must not push. I followed AGENT.md: I committed to `build/kalights-1789175572458` and did not push or open a PR.
