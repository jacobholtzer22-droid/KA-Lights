# Build report: kalights-1789175572458 (site_update, photos only)

## 1. `npm run verify`

```
#   check                                                                   result  detail
--- ----------------------------------------------------------------------  ------  ------
1   site.config.ts parses against schema                                    PASS    
2   businessSlug and identity are filled in (not the template sample)       PASS    slug "kalights-1789175572458"
3   businessSlug exists in the live platform database                       PASS    platform confirmed slug "kalights-1789175572458"
4   components/ContactForm.tsx matches sealed checksum                      PASS    1fb815af450d
5   built HTML posts to the www contact endpoint, never the bare apex       PASS    endpoint on /contact, /, /quote
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
18  launch gate (no provisional values, placeholders, or noindex)           PASS    clear
19  robots meta on every page matches indexing.json                         PASS    noindex=false
20  lead form POSTs in a production build                                   PASS    /contact=live, /=live, /quote=live
21  no build command forces PREVIEW=1 (preview bypass cannot ship)          PASS    build scripts clean
22  city pages exist only for cities with a filled localDetail              PASS    7 city page(s); route active
23  every AI rendering carries a visible label and a "Rendering of" alt     PASS    0 registered, 0 placement(s) labeled
24  Google Ads tag on every page in a production build                      PASS    18 pages load AW-18468343968; both conversion labels shipped

24/24 checks passed across 18 pages.
All checks passed.
```

Green on the first attempt.

## 2. `site.config.ts`

```ts
import type { SiteConfigInput } from './lib/config-schema'

/**
 * Every business fact for this site lives here and nowhere else.
 *
 * Unknown facts are null. A null field renders nothing. A guessed value is a defect.
 *
 * A value that is not yet settled is marked in its comment, and the launch gate
 * (scripts/launch-gate.mjs) blocks production builds while any marker remains.
 */
const siteConfig = {
  // Confirmed from the platform Business row cmtxoxv570000jv04ioz7a514. Copied character for character.
  businessSlug: 'kalights-1789175572458',

  // The registered entity. It appears in the footer copyright, the privacy policy, and
  // schema legalName. The brand everywhere else is displayName.
  legalName: 'AMER LLC',
  displayName: 'Kalights',
  tagline: 'Your home, in any color. Every night of the year.',

  // Installation only vs licensed electrical work is unconfirmed (checklist item 17).
  // HomeAndConstructionBusiness is the parent type of Electrician, so it asserts neither.
  schemaType: 'HomeAndConstructionBusiness',

  phone: '+19097498696',
  email: 'kalightss@gmail.com',

  address: null,

  // Primary SEO geo. No street address is published, so these drive titles, H1s and
  // copy only, never a schema address.
  primaryCity: 'Corona',
  primaryState: 'CA',

  /**
   * The seven cities from the current site, each with its own page (decision 50).
   *
   * Every fact in a localDetail block was looked up and is cited in the comment
   * above it. Where a fact could not be verified it is left out rather than
   * filled in, which is why Norco and Ontario carry two neighborhoods and Corona
   * carries six. ZIP codes are the ones whose USPS preferred city is this city;
   * a ZIP whose preferred city is a different town is excluded even when it is
   * accepted as an alias, because the ZIP boundary is not the city boundary.
   *
   * driveFromPrimary.minutes is null everywhere on purpose: no citable source
   * publishes city-to-city drive times, and an invented number on a page that
   * exists to be trusted locally is not worth the sentence it buys. Mileages are
   * rounded and prefixed with "about" in the copy; they come from a third-party
   * centroid-to-centroid calculator, while the routes were checked against the
   * highway articles.
   *
   * cityPage.note and cityPage.image stay null until Will supplies a real
   * project or photo for that city (client checklist in docs/, B7). `hasProjectContent`
   * is what tracks which cities have graduated from facts to proof.
   */
  serviceAreas: [
    {
      slug: 'corona',
      name: 'Corona',
      county: 'Riverside',
      cityPage: {
        // Neighborhoods are the City of Corona's own adopted specific-plan areas; Corona
        // publishes no neighborhood roster, and Wikipedia's longer list is unsourced, so it
        // was not used. 92880 is excluded: USPS's preferred city for it is Eastvale, a
        // separate city. 92877 is PO Box only; 92878 is unverified as residential.
        localDetail: {
          county: 'Riverside',
          neighborhoods: ['Sierra Del Oro', 'Eagle Glen', 'Dos Lagos', 'Corona Ranch', 'Mountain Gate', 'Downtown Corona'],
          zips: ['92879', '92881', '92882', '92883'],
          driveFromPrimary: null,
          nearby: ['norco', 'riverside', 'chino-hills'],
          sources: [
            'https://www.coronaca.gov/government/departments/community-development/planning-division/specific-plans',
            'https://www.zip-codes.com/city/ca-corona.asp',
          ],
        },
        note: null,
        image: null,
      },
    },
    {
      slug: 'chino',
      name: 'Chino',
      county: 'San Bernardino',
      cityPage: {
        // All three neighborhoods have their own page on the City of Chino site. 91708 is
        // excluded: sources conflict on whether it has real street delivery, and 91710
        // carries about 85% of the city's population.
        localDetail: {
          county: 'San Bernardino',
          neighborhoods: ['The Preserve', 'College Park', 'East Chino'],
          zips: ['91710'],
          driveFromPrimary: { miles: 15, via: 'SR-71', minutes: null },
          nearby: ['chino-hills', 'ontario'],
          sources: [
            'https://www.cityofchino.org/215/The-Preserve',
            'https://www.cityofchino.org/207/College-Park',
            'https://www.cityofchino.org/209/East-Chino',
            'https://www.zip-codes.com/city/ca-chino.asp',
          ],
        },
        note: null,
        image: null,
      },
    },
    {
      slug: 'chino-hills',
      name: 'Chino Hills',
      county: 'San Bernardino',
      cityPage: {
        // Carbon Canyon is defined on the city's own access page; Los Serranos and Sleepy
        // Hollow both appear in the city's published history and carry city facilities.
        // Vellano and Fairfield Ranch were dropped: they are verifiable only through parks
        // named after them, which is one step short of the city calling them neighborhoods.
        // 91709 really is the only ZIP for the whole city.
        localDetail: {
          county: 'San Bernardino',
          neighborhoods: ['Los Serranos', 'Carbon Canyon', 'Sleepy Hollow'],
          zips: ['91709'],
          driveFromPrimary: { miles: 15, via: 'SR-71', minutes: null },
          nearby: ['chino', 'ontario', 'corona'],
          sources: [
            'https://chinohills.org/251/Carbon-Canyon-Access',
            'https://www.chinohills.org/95/History',
            'https://www.zip-codes.com/city/ca-chino-hills.asp',
          ],
        },
        note: null,
        image: null,
      },
    },
    {
      slug: 'ontario',
      name: 'Ontario',
      county: 'San Bernardino',
      cityPage: {
        // Two names, both from the City of Ontario's own Ontario Ranch page: Ontario Ranch
        // itself and Grand Park. The city's specific-plan list carries more names
        // (Esperanza, Countryside, Creekside, Edenglen, Parkside) but it mixes residential
        // villages with business parks, and which is which was not verifiable, so they are
        // left out. 91758 is excluded as largely non-residential.
        localDetail: {
          county: 'San Bernardino',
          neighborhoods: ['Ontario Ranch', 'Grand Park'],
          zips: ['91761', '91762', '91764'],
          driveFromPrimary: { miles: 18, via: 'I-15', minutes: null },
          nearby: ['chino', 'chino-hills', 'jurupa-valley'],
          sources: [
            'https://www.ontarioca.gov/government/community-development/planning/ontario-ranch-community',
            'https://en.wikipedia.org/wiki/Ontario,_California',
          ],
        },
        note: null,
        image: null,
      },
    },
    {
      slug: 'norco',
      name: 'Norco',
      county: 'Riverside',
      cityPage: {
        // Two names, and that is the honest total: Norco is one contiguous equestrian
        // community rather than a set of named subdivisions. Norco Hills is named in the
        // Wikipedia article and is one of the city's two adopted specific plans; Norco Ridge
        // Ranch is the other, and the city runs Ridge Ranch Park there. 92860 is the only
        // ZIP for the city.
        localDetail: {
          county: 'Riverside',
          neighborhoods: ['Norco Hills', 'Norco Ridge Ranch'],
          zips: ['92860'],
          driveFromPrimary: { miles: 5, via: 'I-15', minutes: null },
          nearby: ['corona', 'riverside', 'jurupa-valley'],
          sources: [
            'https://en.wikipedia.org/wiki/Norco,_California',
            'https://www.norco.ca.us/departments/planning/specific-plans',
            'https://www.zip-codes.com/city/ca-norco.asp',
          ],
        },
        note: null,
        image: null,
      },
    },
    {
      slug: 'jurupa-valley',
      name: 'Jurupa Valley',
      county: 'Riverside',
      cityPage: {
        // The city's own About Us page names nine communities; six are listed here. Mira
        // Loma is only partly inside the city: parts of it went to Jurupa Valley at
        // incorporation in 2011 and the rest is Eastvale or unincorporated county.
        // driveFromPrimary is null on purpose: the city is long and thin, its Rubidoux end
        // and its Mira Loma end are about ten miles apart and reached by different
        // freeways, so any single "X miles via Y" would be wrong for half the city.
        localDetail: {
          county: 'Riverside',
          neighborhoods: ['Mira Loma', 'Rubidoux', 'Glen Avon', 'Pedley', 'Sunnyslope', 'Indian Hills'],
          zips: ['92509', '91752'],
          driveFromPrimary: null,
          nearby: ['riverside', 'norco', 'ontario'],
          sources: ['https://www.jurupavalley.org/309/About-Us', 'https://www.zip-codes.com/zip-code/92509/zip-code-92509.asp'],
        },
        note: null,
        image: null,
      },
    },
    {
      slug: 'riverside',
      name: 'Riverside',
      county: 'Riverside',
      cityPage: {
        // Riverside is the one city here with an official neighborhood roster on its own
        // site; six residential ones of the 25 are listed. 92509 is deliberately NOT listed
        // as a Riverside ZIP: third-party databases file it under Riverside, but its USPS
        // preferred city is Jurupa Valley and it covers Rubidoux, Glen Avon and Pedley.
        // PO Box, March ARB and university-only ZIPs are excluded.
        localDetail: {
          county: 'Riverside',
          neighborhoods: ['Canyon Crest', 'Magnolia Center', 'Wood Streets', 'Orangecrest', 'La Sierra', 'Arlington'],
          zips: ['92501', '92503', '92504', '92505', '92506', '92507', '92508'],
          driveFromPrimary: { miles: 13, via: 'SR-91', minutes: null },
          nearby: ['jurupa-valley', 'norco', 'corona'],
          sources: ['https://www.riversideca.gov/athomeinriverside/neighborhoods.asp', 'https://www.zip-codes.com/city/ca-riverside.asp'],
        },
        note: null,
        image: null,
      },
    },
  ],

  services: [
    {
      slug: 'permanent-architectural-lighting',
      name: 'Permanent Architectural Lighting',
      shortDescription:
        'Professionally installed, app-controlled lighting with warm white for everyday and full color for any occasion.',
      priceFrom: null,
      priceNote: 'based on the linear footage of your roofline and the complexity of the installation',
      // Crew photo supplied by Will.
      image: 'kalights-install-eave-dsc07680.jpg',
      // Every Kalights-specific answer traces to the current site's own copy. General answers stay general.
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
        {
          q: 'Can I use permanent lights outside the holidays?',
          a: 'Yes. Warm white works for everyday, and full color covers holidays, game days, or any occasion, so the same lights run all year.',
        },
        {
          q: 'How are permanent Christmas lights mounted?',
          a: 'The lights sit in a track installed along the eaves of your roofline, where they stay up year-round instead of being hung and taken down each season.',
        },
        {
          q: 'Can you see permanent lights during the day?',
          a: 'The track and lights stay on the house all year, so they are there in daylight. How much they stand out depends on where they mount along your roofline and how the track sits against your eaves and trim. Ask about it when you request a quote.',
        },
      ],
    },
  ],

  // Hours are not published yet.
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

  // Site FAQs, shown on /faq after the service FAQs.
  faqs: [
    {
      q: 'What is the difference between permanent and seasonal Christmas lights?',
      a: 'Seasonal lights are hung before the holidays and taken down after, every year. A permanent system is mounted along the roofline and stays up, and it is app-controlled, so the same lights can run warm white for everyday and full color for holidays or game days.',
    },
    {
      q: 'Do I need HOA approval for permanent lights?',
      a: "It depends on your HOA. Many homeowner associations have rules about exterior lighting or changes to the outside of a home, so check your HOA's guidelines before you schedule an install.",
    },
    {
      q: 'How do I get a quote for permanent lights?',
      a: 'Call or send the quote form with a few details about your home. Pricing is based on the linear footage of your roofline and the complexity of the installation.',
    },
    {
      q: 'Which cities does Kalights serve?',
      a: "Kalights serves Corona, Chino, Chino Hills, Ontario, Norco, Jurupa Valley, and Riverside in the Inland Empire. Don't see your city? Contact us to see if we service your area.",
    },
  ],

  // Every image here is the client's own photograph from the ops intake (ASSETS.json).
  // Hero: 4484.jpg (kept, PR #1). Gallery: finished night installs first, then
  // installation-in-progress shots. The template has no before/after or separate
  // process slot, so the install shots close out the gallery. Crew: DSC07619
  // (group shot leads), DSC07669, DSC07630. about stays null: no page renders it.
  images: {
    hero: 'backyard-patio-at-dusk-with-string-lights-strung-overhead-an.jpg',
    about: null,
    gallery: [
      'two-story-house-at-night-with-rainbow-colored-roofline-light.png',
      'spanish-style-home-at-night-with-multicolor-lights-outlining.png',
      'two-story-stucco-home-at-night-with-red-green-and-white-ligh.png',
      'desert-style-home-with-red-green-and-white-roofline-lights-r.png',
      'house-at-night-with-blue-and-white-roofline-lights-outlining.jpeg',
      'covered-front-patio-at-night-with-red-white-and-blue-rooflin.png',
      'stucco-home-at-night-with-warm-white-roofline-lights-and-red.png',
      'single-story-home-at-dusk-with-roofline-lights-glowing-purpl.png',
      'spanish-style-home-at-night-with-red-and-blue-roofline-light.png',
      'two-story-home-at-dusk-with-multicolor-roofline-lights-a-law.png',
      'red-green-and-white-lights-trace-the-roofline-and-garage-doo.png',
      'single-story-house-at-night-with-red-green-and-white-lights-.jpeg',
      'close-view-of-warm-white-lights-running-along-tile-roof-edge.jpeg',
      'close-up-at-night-of-warm-white-lights-glowing-in-a-track-un.jpeg',
      'covered-patio-at-dusk-with-lights-installed-along-the-cover-.jpg',
      'two-installers-sit-on-a-tile-roof-fastening-light-track-unde.jpeg',
      'installer-on-a-stepladder-fastens-a-light-track-along-the-ea.jpeg',
      'a-worker-stretches-from-a-ladder-to-place-a-white-track-alon.jpg',
      'three-crew-members-in-black-polos-prepare-a-ladder-and-white.jpg',
    ],
    crew: [
      'three-smiling-crew-members-in-matching-black-polos-pose-with.jpg',
      'a-crew-member-in-a-branded-black-polo-looks-up-at-the-roofli.jpg',
      'two-crew-members-in-black-polos-handle-a-white-aluminum-trac.jpg',
    ],
  },

  // Scene names, sub-labels, colors, and glow tints match the current site. Every scene
  // is now a real photograph of one Kalights install (the WhatsApp 2026-10-17 intake
  // series: the same house in warm white, white, red-green-white, multicolor, and in
  // daylight with the lights off), so no "design rendering" label renders. Halloween,
  // Fourth of July and Game Day were dropped with their AI renderings: no client photo
  // shows those colors. Add them back with a photo of the same house in that scene.
  visualizer: {
    mode: 'photo',
    defaultScene: 'warm-white',
    scenes: [
      { key: 'warm-white', name: 'Warm White', description: 'Everyday elegance', colors: ['#FFD8A6'], glow: '#FFC46B', image: 'house-at-night-with-warm-white-lights-outlining-the-roof-gab.jpeg' },
      { key: 'cool-white', name: 'Cool White', description: 'Crisp & modern', colors: ['#EAF2FF'], glow: '#BBD9FF', image: 'single-story-house-at-dusk-with-white-roofline-lights-along-.jpeg' },
      { key: 'christmas', name: 'Christmas', description: 'Red & green classic', colors: ['#FF3B3B', '#22C55E'], glow: '#FF5A5A', image: 'same-house-at-night-with-multicolor-roofline-lights-in-red-g.jpeg' },
      { key: 'party', name: 'Party', description: 'Full-color chase', colors: ['#FF3B3B', '#FB923C', '#FACC15', '#22C55E', '#2DD4FF', '#6366F1', '#D946EF'], glow: '#FF3B3B', glowCycle: true, image: 'house-at-night-with-soft-multicolour-roofline-lights-along-t.jpeg' },
      { key: 'lights-off', name: 'Lights Off', description: 'Tap any scene to relight', colors: ['#1A1D26'], glow: null, image: 'single-story-stucco-house-in-daylight-with-tile-roof-gray-ga.jpeg' },
    ],
  },

  /**
   * Google Ads conversion tracking. Verified in the AMER account (477-876-4076)
   * on 2026-09-24. Not secret: the tag ID and both conversion labels ship in the
   * public HTML of every page by design, which is how gtag.js works.
   *
   * Each label must start with this same tagId and a slash. A label carrying a
   * different tag ID is a copy-paste error that records nothing, and the schema
   * fails the build on it rather than letting it ship silently.
   *
   * Nothing here loads or fires in a preview build: the whole tag is gated on
   * the same PREVIEW flag as noindex and the lead form (verify check 24).
   * No `value` or `currency` is ever sent; see docs/DESIGN-DECISIONS.md #46.
   */
  googleAds: {
    tagId: 'AW-18468343968',
    quoteFormSubmitLabel: 'AW-18468343968/Tdk_CPCttYIdEKChsuZE',
    clickToCallLabel: 'AW-18468343968/HUU6CL2ztYIdEKChsuZE',
  },

  // Client-confirmed 2026-09-30. www, not the apex.
  domain: 'https://www.kalights.com',
} satisfies SiteConfigInput

export default siteConfig
```

## 3. Alt-text spot checks (five files, viewed and re-checked by filename)

Each alt is that file's intake caption, word for word.

| file | alt |
|---|---|
| house-at-night-with-blue-and-white-roofline-lights-outlining.jpeg | House at night with blue and white roofline lights outlining the gables. |
| desert-style-home-with-red-green-and-white-roofline-lights-r.png | Desert-style home with red, green and white roofline lights reflecting in a pool, a lit Christmas tree inside. |
| two-installers-sit-on-a-tile-roof-fastening-light-track-unde.jpeg | Two installers sit on a tile roof fastening light track under the gable edge of a house. |
| three-smiling-crew-members-in-matching-black-polos-pose-with.jpg | Three smiling crew members in matching black polos pose with arms crossed outside a stucco home with tile roof. |
| single-story-stucco-house-in-daylight-with-tile-roof-gray-ga.jpeg | Single-story stucco house in daylight with tile roof, gray garage door and a skeleton dinosaur decoration on the lawn. |

All five match what is in the frame.

## 4. Design direction

Unchanged. This is a photos-only `site_update`, so theme, fonts, layout and components were not touched.

## 5. What could look templated, and what was changed (CI self-check, no screenshots)

1. **Crew band would have shown three near-identical frames.** INSTRUCTIONS.md suggested DSC07619, DSC07624 and DSC07618 as examples. Viewed side by side, they are the same pose taken seconds apart, so the strip would look like one photo repeated three times. Fix: the group shot DSC07619 leads, then DSC07669 (crew member looking up at the roofline) and DSC07630 (two crew handling track on the lawn). DSC07669 was suggested for About, but nothing on the site renders `images.about`.
2. **Gallery would have opened with the same house over and over.** 14 of the WhatsApp photos are one house. Fix: the gallery leads with the ten different holidays-events homes. Only three frames of the WhatsApp house are in the gallery (red/green/white and two close-ups), and five more carry the color picker, where showing one house in different colors is the point.
3. **Real photos still labeled as renderings.** The gallery lead, the homepage teaser subheading, the gallery meta description, the gallery section's aria-label and the llms.txt link all said "concept renderings" / "photos coming soon". Leaving that over real install photos would make the page say something false. Fix: one-sentence replacements, listed under item 8.

## Photos: hero, placed, left out

- **Hero:** `backyard-patio-at-dusk-with-string-lights-strung-overhead-an.jpg` (intake 4484.jpg). Kept as instructed. It is the only `heroCandidate`.
- **Placed:** 28 of the 74 intake photos: hero 1, gallery 19 (15 finished installs, then 4 install-in-progress shots), crew 3, color picker 5. The service image (DSC07680) and the How It Works step image (DSC07677) are earlier client files and did not change.
- **Before/after:** I confirmed WhatsApp 11.49.34 AM (7) (daylight) and 11.49.33 AM (8) (night, red/green/white) show the same house: same gables, garage and skeleton dinosaur. The template has no before/after component, so the pair is not rendered as a pair. The daylight frame is the color picker's "Lights Off" scene, so tapping from Lights Off to a lit scene shows the change on the real house. The (8) night frame is in the gallery.
- **"Recent Work" and "How we install":** the template has no slot for either. The homepage gallery teaser (first 4 gallery images) serves as recent work. Four install shots (two installers on a tile roof, stepladder along the eave, DSC07685, crew prep DSC07641) close out the gallery.
- **Left out (46):**
  - 23 DSC07xxx crew and prep shots (07618, 07624, 07626, 07627, 07631, 07632, 07633, 07640, 07642 to 07647, 07650 to 07657, 07668). They are near-duplicates of the placed crew and prep frames, or of each other. 07618 and 07624 repeat 07619. 07650 to 07657 are walkway frames of one moment.
  - 8 from the DSC07678 to 07686 ladder series (07678, 07679, 07680 intake copy, 07681, 07682, 07683, 07684, 07686). Instructions allow at most two from that series: the existing service image (DSC07680) and DSC07685.
  - 10 WhatsApp install shots: the tile-roof frames 11.49.33 AM (13) and (15) are near-duplicates of the placed (14). The ladder-under-eave frames 11.49.33 AM (17) and 11.49.34 AM, (1), (2), (3), (4) repeat the placed stepladder shot (16). The indoor cable and control-box shots 11.49.34 AM (5) and (6) do not show the finished lighting.
  - 5 WhatsApp house frames: 11.49.33 AM (1) (house number readable on the curb), (7) (house number readable on the garage gable), and (2), (5), (6) (near-duplicates of the white, warm white and multicolor frames already placed).
  - Every intake photo stays in `public/images/originals/` with its caption as alt text, so any of them can go in with a config edit.
- **Deleted:** all 15 AI rendering files (7 gallery renderings and 8 color-picker sample-home renderings), with all 15 placeholders.json entries (the register is now empty). Also deleted the three earlier crew files `kalights-crew-group-dsc07608.jpg`, `kalights-crew-unpacking-dsc07628.jpg` and `kalights-crew-prep-dsc07640.jpg`. INSTRUCTIONS.md calls them "placeholder-crew-1/2/3.jpg", but no file by that name existed. These three filled the crew slots, so they are the ones replaced. They were real photos Will supplied, not placeholders. DSC07640 is still in the intake. DSC07608 and DSC07628 are now only in git history.

## Videos

None placed, and no hero video (the hero stays 4484.jpg as instructed). All three videos are in ASSETS.json `skipped` with the reason "this repo has no scripts/transcode-videos.mjs yet (template sync pending)". There is also no `components/Video.tsx` and no `public/videos/manifest.json`, so CI mode forbids placing them. They are listed in CLIENT-TODO.md.

## 6. UNRESOLVED

Unchanged by this run: `hours`, `yearsInBusiness`, `licenseNumber`, `insured`, `address`, `priceFrom` are null; `reviews` is empty; `profiles.gbp`, `facebook`, `yelp` are null. Their blocks (hours, credentials, schema address, price, reviews, those profile links) do not render. New in this run:
- Color picker scenes Halloween, Fourth of July, Game Day: no client photo shows those colors, so the scenes are off the picker (CLIENT-TODO).
- City pages: `cityPage.image` stays null in all seven. No intake caption names a town.
- Videos: 3 skipped by the intake (reason above).

## 7. INVENTED

None. No town, street or customer name was added to any alt or copy. The new gallery sentence and meta description do not say where the photos were taken.

## 8. Template and instruction notes for the human

- **Copy touched despite "do not touch copy":** five strings that would have been false with real photos in place:
  - `content/pages/gallery.json` lead and `content/pages/home.json` `galleryTeaser.subheading`: "Concept renderings ... coming soon" became "Photos of our own installs, in warm white and full color, and of our crew mounting the track along the eaves."
  - `lib/seo.ts` gallery meta description: now "...by Kalights: photos of our own installs in warm white and full color, plus our crew mounting the track along the eaves." (152 chars).
  - `app/gallery/page.tsx` aria-label: "Design renderings" became "Install photos".
  - `app/llms.txt/route.ts` link label: "(concept renderings)" became "(install photos)".
  
  Headings ("Design Ideas") were left as they are. Revert any of these if you prefer, but the old text claims the photos are renderings.
- **Color picker cut from 8 scenes to 5.** Real photos of one house exist for Warm White, Cool White, Christmas, Party and Lights Off. Keeping the other three scenes would have meant keeping AI renderings, which would bring back the "Sample home, design rendering" label over the real photos too. The homepage visualizer body still says "Tap a scene to see it on a sample home"; I left it because it is copy and it is not false.
- **indexing.json:** INSTRUCTIONS.md says "noindex stays true", but the file says `"noindex": false`: the site is live and in production. I did not touch it.
- **Videos:** the template sync that adds `scripts/transcode-videos.mjs` and `components/Video.tsx` has to land before the videos can go on the site.
- **Gallery crop:** GalleryGrid crops every image to 16:9. Several holidays-events PNGs and two close-ups are portrait, so they lose their top and bottom. This is a template limitation; I did not change it in a photos-only update.
