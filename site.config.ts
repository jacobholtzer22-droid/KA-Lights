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

  // Hero and gallery are AI design renderings, registered in placeholders.json as
  // "Rendering (AI, labeled)". Every one renders with a visible "Design rendering"
  // label (verify check 23). Crew photos are real (supplied by Will).
  images: {
    hero: 'rendering-two-story-holiday-roofline.jpg',
    about: null,
    gallery: [
      'rendering-spanish-style-multicolor.jpg',
      'rendering-two-story-rainbow.jpg',
      'rendering-backyard-pool-holiday.jpg',
      'rendering-purple-and-red-ranch.jpg',
      'rendering-red-and-white-two-story.jpg',
      'rendering-magenta-covered-patio.jpg',
    ],
    crew: ['kalights-crew-group-dsc07608.jpg', 'kalights-crew-unpacking-dsc07628.jpg', 'kalights-crew-prep-dsc07640.jpg'],
  },

  // Scene names, sub-labels, colors, and glow tints match the current site. The 8 scene
  // images are the current site's own scene images, relabeled: they are shown as a sample
  // home with a visible "Sample home, design rendering" label, never as a Kalights job.
  // Origin is unproven (no metadata of any kind); registered in placeholders.json with the
  // Rendering status. Swap in photographs of a real install and the label follows the
  // register (see the asset provenance and client checklist under docs/, item B1.4).
  visualizer: {
    mode: 'photo',
    defaultScene: 'warm-white',
    scenes: [
      { key: 'warm-white', name: 'Warm White', description: 'Everyday elegance', colors: ['#FFD8A6'], glow: '#FFC46B', image: 'rendering-sample-home-warm-white.jpg' },
      { key: 'cool-white', name: 'Cool White', description: 'Crisp & modern', colors: ['#EAF2FF'], glow: '#BBD9FF', image: 'rendering-sample-home-cool-white.jpg' },
      { key: 'christmas', name: 'Christmas', description: 'Red & green classic', colors: ['#FF3B3B', '#22C55E'], glow: '#FF5A5A', image: 'rendering-sample-home-christmas.jpg' },
      { key: 'halloween', name: 'Halloween', description: 'Orange & purple', colors: ['#FF7A18', '#8B5CF6'], glow: '#FF8A3D', image: 'rendering-sample-home-halloween.jpg' },
      { key: 'fourth-of-july', name: 'Fourth of July', description: 'Red, white & blue', colors: ['#FF4141', '#F4F6FB', '#3B82F6'], glow: '#5B9BFF', image: 'rendering-sample-home-fourth-of-july.jpg' },
      { key: 'game-day', name: 'Game Day', description: 'Rep your team', colors: ['#1E63FF', '#FACC15'], glow: '#FACC15', image: 'rendering-sample-home-game-day.jpg' },
      { key: 'party', name: 'Party', description: 'Full-color chase', colors: ['#FF3B3B', '#FB923C', '#FACC15', '#22C55E', '#2DD4FF', '#6366F1', '#D946EF'], glow: '#FF3B3B', glowCycle: true, image: 'rendering-sample-home-party.jpg' },
      { key: 'lights-off', name: 'Lights Off', description: 'Tap any scene to relight', colors: ['#1A1D26'], glow: null, image: 'rendering-sample-home-lights-off.jpg' },
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
