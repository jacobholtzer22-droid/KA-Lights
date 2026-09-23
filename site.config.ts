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
  // cityPage stays null until there is something real and specific for that city:
  // a note about work actually done there, or a photograph taken there. A city with
  // null gets no page of its own, only a listing on the service areas index.
  serviceAreas: [
    { slug: 'corona', name: 'Corona', county: null, cityPage: null },
    { slug: 'chino', name: 'Chino', county: null, cityPage: null },
    { slug: 'chino-hills', name: 'Chino Hills', county: null, cityPage: null },
    { slug: 'ontario', name: 'Ontario', county: null, cityPage: null },
    { slug: 'norco', name: 'Norco', county: null, cityPage: null },
    { slug: 'jurupa-valley', name: 'Jurupa Valley', county: null, cityPage: null },
    { slug: 'riverside', name: 'Riverside', county: null, cityPage: null },
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

  domain: 'https://www.kalights.com', // PROVISIONAL: www is the current site's primary host (redirect check); not confirmed as the new site's destination (checklist item 13).
} satisfies SiteConfigInput

export default siteConfig
