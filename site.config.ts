import type { SiteConfigInput } from './lib/config-schema'

/**
 * Every business fact for this site lives here and nowhere else.
 *
 * This shipped copy describes "Sample Lawn Care", a fictional business, so the
 * template builds and renders out of the box. It is a sample identity, not a
 * placeholder to edit around: scripts/verify.ts check 2 refuses to pass while
 * the slug, names, or domain still carry the sample identity, and check 3
 * confirms the slug exists on the platform. Replace every value from BRIEF.md.
 *
 * Unknown facts are null. A null field renders nothing. A guessed value is a defect.
 */
const siteConfig = {
  businessSlug: 'sample-lawn-care',

  legalName: 'Sample Lawn Care LLC',
  displayName: 'Sample Lawn Care',
  tagline: 'Reliable lawn care for homes across the Springfield area.',

  schemaType: 'HomeAndConstructionBusiness',

  phone: '+15555550123',
  email: 'hello@sample-lawn-care.com',

  address: {
    street: '100 Sample Street',
    city: 'Springfield',
    state: 'IL',
    zip: '62701',
    lat: null,
    lng: null,
  },

  primaryCity: 'Springfield',
  primaryState: 'IL',

  serviceAreas: [
    { slug: 'springfield', name: 'Springfield', county: 'Sangamon County' },
    { slug: 'chatham', name: 'Chatham', county: 'Sangamon County' },
    { slug: 'rochester', name: 'Rochester', county: 'Sangamon County' },
    { slug: 'sherman', name: 'Sherman', county: 'Sangamon County' },
  ],

  services: [
    {
      slug: 'lawn-mowing',
      name: 'Lawn Mowing',
      shortDescription:
        'Weekly and biweekly mowing with edging, trimming, and cleanup on every visit, scheduled on the same day each week.',
      priceFrom: 45,
      priceNote: 'per visit for a typical quarter-acre lot; larger lots quoted on site',
      image: 'sample-mowing.jpg',
      faqs: [
        {
          q: 'How often should my lawn be mowed?',
          a: 'Most lawns in central Illinois do best on a weekly schedule from May through September, then every other week as growth slows in spring and fall. We set the schedule with you and adjust it when the weather changes.',
        },
        {
          q: 'Do you bag the clippings or mulch them?',
          a: 'We mulch clippings back into the lawn by default because it returns nutrients to the soil. If you prefer bagging, or the grass has gotten long between visits, we bag and haul the clippings away.',
        },
        {
          q: 'What is included in a mowing visit?',
          a: 'Every visit includes mowing, string trimming around obstacles, edging along walks and drives, and blowing clippings off hard surfaces. Nothing is left on your patio or driveway.',
        },
      ],
    },
    {
      slug: 'mulch-installation',
      name: 'Mulch Installation',
      shortDescription:
        'Bed edging, weed removal, and fresh hardwood or dyed mulch installed at the right depth so beds stay tidy all season.',
      priceFrom: null,
      priceNote: 'quoted by the yard after we measure your beds',
      image: 'sample-mulch.jpg',
      faqs: [
        {
          q: 'How deep should mulch be installed?',
          a: 'We install mulch two to three inches deep. Less than that lets weeds through and dries out fast; more than that can smother roots and hold too much moisture against plant stems.',
        },
        {
          q: 'Do you remove the old mulch first?',
          a: 'Usually not. Old mulch breaks down into the soil, so we pull weeds, redefine the bed edge, and top-dress with new mulch. If the old layer is already too deep, we remove some before installing.',
        },
        {
          q: 'What kind of mulch do you offer?',
          a: 'We install natural hardwood mulch and dyed mulch in brown, black, or red. We will talk through which holds its color longest and which suits the plants in your beds before we order.',
        },
      ],
    },
    {
      slug: 'seasonal-cleanup',
      name: 'Seasonal Cleanup',
      shortDescription:
        'Spring and fall cleanups that clear leaves, cut back perennials, and get beds and lawns ready for the season ahead.',
      priceFrom: null,
      priceNote: 'quoted after a quick walk of the property',
      image: 'sample-cleanup.jpg',
      faqs: [
        {
          q: 'When should I schedule a fall cleanup?',
          a: 'Once most of the leaves have dropped, which in the Springfield area is usually mid to late November. We can also do a first pass earlier in fall and a final pass after the trees are bare.',
        },
        {
          q: 'What does a spring cleanup include?',
          a: 'We remove leaves and debris left from winter, cut back perennials and ornamental grasses, redefine bed edges, and haul everything away so the lawn and beds are ready for the growing season.',
        },
        {
          q: 'Do you haul away the debris?',
          a: 'Yes. Everything we clear is loaded and hauled off the property the same day. You are not left with bags at the curb.',
        },
      ],
    },
  ],

  hours: [
    { day: 'Monday', open: '08:00', close: '17:00' },
    { day: 'Tuesday', open: '08:00', close: '17:00' },
    { day: 'Wednesday', open: '08:00', close: '17:00' },
    { day: 'Thursday', open: '08:00', close: '17:00' },
    { day: 'Friday', open: '08:00', close: '17:00' },
    { day: 'Saturday', open: '08:00', close: '12:00' },
  ],

  yearsInBusiness: 12,
  licenseNumber: null,
  insured: true,

  reviews: [],

  profiles: {
    gbp: null,
    facebook: 'https://www.facebook.com/samplelawncare',
    instagram: null,
    yelp: null,
  },

  faqs: [
    {
      q: 'Which areas do you serve?',
      a: 'We serve Springfield and the surrounding communities of Chatham, Rochester, and Sherman. If you are just outside those areas, ask and we will let you know if we can fit you in.',
    },
    {
      q: 'How do I get a quote?',
      a: 'Call us or send the contact form on this site. For mowing we can often quote from the property size; for mulch and cleanups we stop by to measure and walk the property first.',
    },
    {
      q: 'Are you insured?',
      a: 'Yes. We carry liability insurance and are happy to provide a certificate on request before work begins.',
    },
  ],

  images: {
    hero: 'sample-hero.jpg',
    about: 'sample-crew.jpg',
    gallery: ['sample-mowing.jpg', 'sample-mulch.jpg', 'sample-cleanup.jpg', 'sample-crew.jpg'],
  },

  domain: 'https://www.sample-lawn-care.com',
} satisfies SiteConfigInput

export default siteConfig
