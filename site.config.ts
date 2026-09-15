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

  // Every image below is a labeled placeholder under launch blocker B1 (real photography of a real install).
  images: {
    hero: 'placeholder-hero.jpg',
    about: null,
    gallery: ['placeholder-gallery-1.jpg', 'placeholder-gallery-2.jpg', 'placeholder-gallery-3.jpg', 'placeholder-gallery-4.jpg'],
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
