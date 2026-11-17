Tracking install on a repo whose template predates tracking support. This is ONE task in two parts; do both, in order, and nothing else.

Part 1: add tracking support, copied from AA-Template exactly as given below. Do not redesign it.

1. Create components/GoogleTag.tsx with exactly this content:
```tsx
import { config } from '@/lib/config'

/**
 * The Google tag, rendered by the root layout only when
 * config.tracking.googleAdsId is set (the layout checks first, so a site
 * without it gains not even an empty slot in its page payload).
 *
 * Plain script tags from a server component on purpose: next/script and client
 * components are bundled into every page's JavaScript even when they render
 * nothing, so a site without tracking would ship different chunks. This file
 * imports nothing client-side, and without the block it renders nothing.
 *
 * The inline script also fires the two conversions:
 *   call  a click on any tel: link (header, footer, hero, CTA band, mobile
 *         call bar, contact page, the form's thank-you), one listener on the
 *         document, so no link component changes.
 *   form  the contact form swapping itself for its thank-you. ContactForm is
 *         sealed and checksum-verified (verify check 4), so it is watched from
 *         outside rather than edited, and it renders that thank-you only after
 *         a 2xx from the platform. A failed POST shows an error instead, so a
 *         lost lead cannot be counted as a conversion.
 *
 * The thank-you is matched as the one `main [role="status"]` element, on any
 * page. The template renders ContactForm only on /contact, but client sites
 * add it elsewhere (Ronny-Prestige-Blinds puts it on the homepage), and a
 * route test would silently drop every conversion from those forms.
 * role="status" appears only in ContactForm, and verify check 22 fails the
 * build if any other source file takes one, so matching on every page cannot
 * count anything else. If a component ever needs a live region, scope this
 * selector instead of narrowing it back to one route.
 */
export default function GoogleTag() {
  const t = config.tracking
  if (!t?.googleAdsId) return null
  const ids = [t.googleAdsId, ...(t.ga4 ? [t.ga4] : [])]
  const js = [
    'window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}',
    "gtag('js',new Date());",
    ...ids.map((id) => `gtag('config',${JSON.stringify(id)});`),
    `(function(){var call=${JSON.stringify(t.conversions.call ?? '')},form=${JSON.stringify(t.conversions.form ?? '')};`,
    "if(call)document.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('a[href^=\"tel:\"]');if(a)gtag('event','conversion',{send_to:call});},true);",
    "if(form){var o=new MutationObserver(function(){if(document.querySelector('main [role=\"status\"]')){o.disconnect();gtag('event','conversion',{send_to:form});}});o.observe(document.documentElement,{childList:true,subtree:true});}",
    '})();',
  ].join('')
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${t.googleAdsId}`} />
      <script id="google-tag" dangerouslySetInnerHTML={{ __html: js }} />
    </>
  )
}
```

2. In app/layout.tsx add this import beside the other component imports:
```tsx
import GoogleTag from '@/components/GoogleTag'
```
and render GoogleTag inside <body>, after the main content, only when the tracking id is set, as the template does:
```tsx
        {config.tracking?.googleAdsId ? (
          <>
            <MobileCallBar />
            <GoogleTag />
          </>
        ) : (
          <MobileCallBar />
        )}
```
If this repo has no MobileCallBar, render just `{config.tracking?.googleAdsId ? <GoogleTag /> : null}`. Keep every other line of the layout as it is.

3. Add this `tracking` field to the site config schema object (the zod object that validates site.config.ts, in lib/config-schema.ts or wherever this repo defines it), beside its other optional fields:
```ts
    /**
     * Google tag. OPTIONAL: omit the block and nothing renders, so a site
     * without it is byte-identical to before it existed.
     *
     * With googleAdsId set, every page loads gtag.js and configs that id (and
     * ga4 when set). conversions.form fires when the contact form shows its
     * thank-you; conversions.call fires on a click of any tel: link. Each
     * label is the "send_to" value Google Ads gives for the conversion
     * action: the same AW- id, a slash, then the label. A missing label means
     * that conversion is not fired. The ops platform writes this block
     * (install_tracking); verify check 22 measures the built HTML against it.
     */
    tracking: z
      .object({
        googleAdsId: z.string().regex(/^AW-\d{6,12}$/, 'must look like AW-1234567890').optional(),
        conversions: z
          .object({
            form: z.string().regex(/^AW-\d{6,12}\/[\w-]+$/, 'must look like AW-1234567890/AbCdEfGh').optional(),
            call: z.string().regex(/^AW-\d{6,12}\/[\w-]+$/, 'must look like AW-1234567890/AbCdEfGh').optional(),
          })
          .strict()
          .default({}),
        ga4: z.string().regex(/^G-[A-Z0-9]{4,14}$/, 'must look like G-ABC123DEF4').optional(),
      })
      .strict()
      .superRefine((t, ctx) => {
        for (const key of ['form', 'call'] as const) {
          const label = t.conversions[key]
          if (!label) continue
          if (!t.googleAdsId) ctx.addIssue({ code: 'custom', path: ['conversions', key], message: 'needs tracking.googleAdsId' })
          else if (!label.startsWith(`${t.googleAdsId}/`)) ctx.addIssue({ code: 'custom', path: ['conversions', key], message: `must start with ${t.googleAdsId}/` })
        }
      })
      .optional(),
```

4. Add verify check 22 to scripts/verify.ts, after check 21, exactly as the template has it (adapt only the helper names this repo already uses, such as record, pages, cfg, walk, ROOT, FORM_FILE and CONTACT_ENDPOINT):
```ts
  // 22. The Google tag is on every page, and the form label on every page with the form.
  //
  // Only when config.tracking.googleAdsId is set: a site without the block
  // records no check 22, so it stays at 21/21. The ads platform counts form
  // and call conversions from this tag; a tag that silently fell out of the
  // build reads as zero conversions and the campaign is judged on calls alone.
  // The tag script and its label travel in the page's RSC payload as escaped
  // text, so the built HTML is searched as text, not as parsed script tags.
  {
    const t = cfg?.tracking
    if (t?.googleAdsId) {
      const problems: string[] = []
      const loader = `googletagmanager.com/gtag/js?id=${t.googleAdsId}`
      const missing = pages.filter((p) => !p.html.includes(loader)).map((p) => p.route)
      if (missing.length) problems.push(`no gtag loader for ${t.googleAdsId} on ${missing.slice(0, 8).join(', ')}${missing.length > 8 ? ` and ${missing.length - 8} more` : ''}`)
      if (t.conversions.form) {
        const contact = pages.find((p) => p.route === '/contact')
        if (!contact) problems.push('no /contact page to carry the form conversion')
        else if (!contact.html.includes(t.conversions.form)) problems.push(`/contact does not carry the form conversion ${t.conversions.form}`)
        // The form conversion fires wherever ContactForm is rendered, not only
        // on /contact: client sites add the form to the homepage and elsewhere.
        // GoogleTag watches for the thank-you as `main [role="status"]`, so on
        // every page that renders the form, the form must sit inside <main>,
        // the page must carry the label, and the tag script must not be
        // narrowed to a route (the old /contact-only test lost every homepage
        // conversion on Ronny-Prestige-Blinds without failing anything).
        const formSel = `form[data-endpoint="${CONTACT_ENDPOINT}"]`
        for (const p of pages.filter((pg) => pg.$(formSel).length > 0)) {
          if (p.$(`main ${formSel}`).length === 0) problems.push(`${p.route}: the contact form is outside <main>, so its thank-you is never seen`)
          if (!p.html.includes(t.conversions.form)) problems.push(`${p.route} renders the contact form but does not carry the form conversion ${t.conversions.form}`)
          const tag = p.$('script#google-tag').html() ?? ''
          if (/location\.pathname|location\.href/.test(tag)) problems.push(`${p.route} renders the contact form but the Google tag only fires the form conversion on some routes`)
        }
```

Part 2: write this tracking block into site.config.ts as the `tracking` key, exactly as given:

```ts
tracking: {
  googleAdsId: 'AW-18468343968',
  conversions: { form: 'AW-18468343968/Tdk_CPCttYIdEKChsuZE', call: 'AW-18468343968/HUU6CL2ztYIdEKChsuZE' },
},
```

Then run the gate: every check must pass, check 22 included. The built HTML of every page must carry the gtag loader for the id above, and the contact page the form label. Do not stop with "not installed": the support you added in Part 1 is what the block needs.