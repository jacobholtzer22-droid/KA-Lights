# BUILD-REPORT: kalights-1789175572458 (site_update)

Run kind: `site_update`. Instruction: add intake photos 4484.jpg and 4485.jpg. Use 4484 as the hero only if the current hero is a stock image; otherwise put both in the gallery. Change nothing else.

**Decision:** the current hero (`placeholder-hero.jpg`) is a "PHOTO PENDING" placeholder graphic, not a stock image, so the "otherwise" branch applies: both photos went into `images.gallery` (added first, so the homepage gallery teaser shows them). The hero is unchanged. That was the right call on the merits too. Both photos are portrait (1536x2048) and the hero is a wide full-bleed banner. 4484 also shows an AC condenser, an electrical disconnect box, a cardboard box and a water bottle, and AGENT.md says to reject a hero with a meter or utility clutter in frame. **If Jacob meant "use 4484 as the hero whenever the current hero isn't a real photo", that is a one-line change to `images.hero`, but read the framing problems above first.**

Photos placed: 2 of 2 from ASSETS.json (both in the gallery). Left out: 0. Neither photo has a `service`, so `services[].image` stays `null`.

Files changed: `site.config.ts` (`images.gallery` only, plus the comment above it), `public/images/manifest.json` (two new entries with alt text), the two originals and their processed WebP files, and `CLIENT-TODO.md` (new). No copy, services, contact details, hours, theme or components were touched.

## 1. Verify output

`npm run verify` (production, no flag) **fails at `next build`** on the launch gate: 110 blockers, all of which were already there before this run (4 PROVISIONAL config values, placeholder images, the placeholders.json registry, and `indexing.json` noindex=true). This site is a preview (commit 4e5ac7d "preview only"), and a site_update may not clear those blockers: it can't invent facts, can't touch `indexing.json`/launch state, and has no real photos for the remaining slots. **The workflow's own Verify step runs without PREVIEW=1, so expect it to report red for this pre-existing reason.**

Same gate with the documented preview flag (`PREVIEW=1 npm run verify`), which shows this change passes every check:

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

## 2. site.config.ts

```ts
import type { SiteConfigInput } from './lib/config-schema'

/**
 * Every business fact for this site lives here and nowhere else.
 *
 * Unknown facts are null. A null field renders nothing. A guessed value is a defect.
 *
 * Four values below are provisional stand-ins so the config validates for the
 * preview. Each carries the provisional marker in its comment, and the launch
 * gate (scripts/launch-gate.mjs) fails every production build while any
 * marker remains. Replace the value and delete the marker once the client
 * confirms it. Open items are tracked in the client checklist in docs/.
 */
const siteConfig = {
  // Confirmed from the platform Business row cmtxoxv570000jv04ioz7a514. Copied character for character.
  businessSlug: 'kalights-1789175572458',

  legalName: 'Kalights', // PROVISIONAL: display name used as a stand-in; the registered entity name is unconfirmed (checklist item 2).
  displayName: 'Kalights',
  tagline: 'Your home, in any color. Every night of the year.',

  // Installation only vs licensed electrical work is unconfirmed (checklist item 17).
  // HomeAndConstructionBusiness is the parent type of Electrician, so it asserts neither.
  schemaType: 'HomeAndConstructionBusiness',

  phone: '+19097498696',
  email: 'kalightss@gmail.com',

  address: null,

  primaryCity: 'Corona', // PROVISIONAL: first city in the current site's footer list, not client-confirmed (checklist item 11).
  primaryState: 'CA', // PROVISIONAL: inferred, not client-confirmed (checklist item 10).

  // City list from the current site, pending client confirmation (checklist item 9). No per-city pages.
  serviceAreas: [
    { slug: 'corona', name: 'Corona', county: null },
    { slug: 'chino', name: 'Chino', county: null },
    { slug: 'chino-hills', name: 'Chino Hills', county: null },
    { slug: 'ontario', name: 'Ontario', county: null },
    { slug: 'norco', name: 'Norco', county: null },
    { slug: 'jurupa-valley', name: 'Jurupa Valley', county: null },
    { slug: 'riverside', name: 'Riverside', county: null },
  ],

  services: [
    {
      slug: 'permanent-architectural-lighting',
      name: 'Permanent Architectural Lighting',
      shortDescription:
        'Professionally installed, app-controlled lighting with warm white for everyday and full color for any occasion.',
      priceFrom: null,
      priceNote: 'based on the linear footage of your roofline and the complexity of the installation',
      image: null,
      // Every answer traces to the current site's own copy.
      faqs: [
        {
          q: 'How is permanent architectural lighting priced?',
          a: 'Pricing is based on the linear footage of your roofline and the complexity of the installation. Call or send the form to request a quote for your home.',
        },
        {
          q: 'Can the lights change color?',
          a: 'Yes. The system is full RGB plus warm white, so you can run warm white for everyday and full color for holidays, game days, or any occasion.',
        },
        {
          q: 'How are the lights controlled?',
          a: 'The lights are app-controlled. You tap a scene on your phone and the whole home changes.',
        },
      ],
    },
  ],

  // Hours are not published yet (checklist item 12).
  hours: null,

  yearsInBusiness: null,
  licenseNumber: null,
  insured: null,

  reviews: [],

  profiles: {
    gbp: null,
    facebook: null,
    instagram: 'https://instagram.com/kalights.usa',
    yelp: null,
  },

  faqs: [
    {
      q: 'Which cities does Kalights serve?',
      a: "Kalights serves Corona, Chino, Chino Hills, Ontario, Norco, Jurupa Valley, and Riverside in the Inland Empire. Don't see your city? Contact us to see if we service your area.",
    },
  ],

  // The first two gallery entries are real client install photos (intake 4484.jpg, 4485.jpg).
  // Every other image below is a labeled placeholder under launch blocker B1 (real photography of a real install).
  images: {
    hero: 'placeholder-hero.jpg',
    about: null,
    gallery: [
      'backyard-patio-at-dusk-with-string-lights-strung-overhead-an.jpg',
      'covered-patio-at-dusk-with-lights-installed-along-the-cover-.jpg',
      'placeholder-gallery-1.jpg', 'placeholder-gallery-2.jpg', 'placeholder-gallery-3.jpg', 'placeholder-gallery-4.jpg'],
    crew: ['placeholder-crew-1.jpg', 'placeholder-crew-2.jpg', 'placeholder-crew-3.jpg'],
  },

  // Scene names, sub-labels, and colors match the current site. Photos await the 8-scene tripod series (B1.4).
  visualizer: {
    defaultScene: 'warm-white',
    scenes: [
      { key: 'warm-white', name: 'Warm White', description: 'Everyday elegance', colors: ['#FFD8A6'], glow: '#FFC46B', image: 'placeholder-scene-warm-white.jpg' },
      { key: 'cool-white', name: 'Cool White', description: 'Crisp & modern', colors: ['#EAF2FF'], glow: '#BBD9FF', image: 'placeholder-scene-cool-white.jpg' },
      { key: 'christmas', name: 'Christmas', description: 'Red & green classic', colors: ['#FF3B3B', '#22C55E'], glow: '#FF5A5A', image: 'placeholder-scene-christmas.jpg' },
      { key: 'halloween', name: 'Halloween', description: 'Orange & purple', colors: ['#FF7A18', '#8B5CF6'], glow: '#FF8A3D', image: 'placeholder-scene-halloween.jpg' },
      { key: 'fourth-of-july', name: 'Fourth of July', description: 'Red, white & blue', colors: ['#FF4141', '#F4F6FB', '#3B82F6'], glow: '#5B9BFF', image: 'placeholder-scene-fourth-of-july.jpg' },
      { key: 'game-day', name: 'Game Day', description: 'Rep your team', colors: ['#1E63FF', '#FACC15'], glow: '#FACC15', image: 'placeholder-scene-game-day.jpg' },
      { key: 'party', name: 'Party', description: 'Full color', colors: ['#FF3B3B', '#FB923C', '#FACC15', '#22C55E', '#2DD4FF', '#6366F1', '#D946EF'], glow: '#D946EF', image: 'placeholder-scene-party.jpg' },
      { key: 'lights-off', name: 'Lights Off', description: 'Tap any scene to relight', colors: ['#1A1D26'], glow: null, image: 'placeholder-scene-lights-off.jpg' },
    ],
  },

  domain: 'https://www.kalights.com', // PROVISIONAL: www is the current site's primary host (redirect check); not confirmed as the new site's destination (checklist item 13).
} satisfies SiteConfigInput

export default siteConfig
```

## 3. Alt-text spot checks

Only two images are new. I viewed both by filename and wrote their alts from the image, using the caption as a guide. No town is named because the intake didn't say which job or town these are.

- `backyard-patio-at-dusk-with-string-lights-strung-overhead-an.jpg`: "Backyard patio at dusk with string lights overhead and eave lights glowing along the roofline and patio cover"
- `covered-patio-at-dusk-with-lights-installed-along-the-cover-.jpg`: "Covered patio at dusk with lights along the cover edge, a ceiling light over seating, and landscape uplights"

Existing placeholder alts were not changed.

## 4. Design direction

Unchanged. A site_update doesn't redesign.

## 5. Templated-looking things (CI self-check, scoped to this change)

1. **Portrait photos in a 16:9 grid.** `GalleryGrid` crops every image to `aspect-video` with `object-cover`. On these 3:4 photos that center crop keeps the patio and the lit cover edge but loses most of the string lights in 4484. I didn't change it because it's a component change and the instructions said to change nothing else. Item 8 has the suggested fix.
2. **Real photos next to "Photo Pending" placeholders.** The gallery now mixes two real installs with four placeholder graphics, which reads as unfinished. I mitigated this by putting the real photos first so the homepage teaser leads with them. The remaining placeholders are a client-photo gap, tracked in CLIENT-TODO.md.
3. **The hero is still a placeholder.** That's the most templated thing on the site. It's out of scope for this run (see Decision above) and listed in CLIENT-TODO.md as the top photo request.

## 6. UNRESOLVED

All pre-existing. This run didn't change any of them.

- Address unknown: `address: null`, so no address block or postal address in schema.
- Hours unknown: `hours: null`, so the hours block doesn't render.
- Years in business, license number, insured: `null`, so the credential lines don't render.
- Reviews: `[]`, so there's no reviews section and no rating schema.
- GBP, Facebook, Yelp profiles: `null`, so those links don't render.
- Still PROVISIONAL (launch blockers): `legalName`, `primaryCity`, `primaryState`, `domain`.
- Images: hero, about, crew, 8 visualizer scenes and 4 gallery slots are still placeholders or null. The service image is `null`.

## 7. INVENTED

Nothing. I was tempted to name a city in the new alt text and didn't, because the intake doesn't say where these jobs are.

## 8. Template / process notes

- **Gallery crop:** `components/GalleryGrid.tsx` forces `aspect-video` on every image. Phone photos are usually portrait, so client galleries will keep losing the top and bottom of the frame. Suggestion: use the manifest's width/height to render portrait images at `aspect-[3/4]`, or use a masonry layout.
- **INSTRUCTIONS.md says "Open a PR".** AGENT.md CI mode forbids the agent from pushing or opening a PR because the workflow does both. I committed to `build/kalights-1789175572458` and left the push and PR to the workflow.
- **Red verify on preview updates:** the workflow's Verify step has no PREVIEW=1, so every site_update on a preview site will report red on the launch gate even when the change is clean. The workflow should pass PREVIEW=1 for sites that haven't gone live yet, or report check 18 separately.
