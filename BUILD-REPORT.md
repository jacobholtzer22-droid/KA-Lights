# BUILD-REPORT: site_update (tracking install), kalights-1789175572458

**Outcome: no code change. The Google tag requested is already installed on this site, with the same tag ID and both conversion labels, and the gate verifies it on every page (check 24). The gate is green, 24/24.**

The instructions say this repo's template "predates tracking support". It doesn't. KA Lights already has its own Google Ads setup, and it carries exactly the values in Part 2:

| INSTRUCTIONS.md `tracking` | Already in `site.config.ts` `googleAds` |
|---|---|
| `googleAdsId: 'AW-18468343968'` | `tagId: 'AW-18468343968'` |
| `conversions.form: 'AW-18468343968/Tdk_CPCttYIdEKChsuZE'` | `quoteFormSubmitLabel: 'AW-18468343968/Tdk_CPCttYIdEKChsuZE'` |
| `conversions.call: 'AW-18468343968/HUU6CL2ztYIdEKChsuZE'` | `clickToCallLabel: 'AW-18468343968/HUU6CL2ztYIdEKChsuZE'` |

How it works now:
- `components/GoogleAdsTag.tsx` is rendered by `app/layout.tsx` on every page. It loads gtag.js and configures AW-18468343968.
- Call conversion: `components/TelConversion.tsx` listens at the document level for clicks on any `tel:` link and fires `clickToCallLabel`.
- Form conversion: `components/LeadForm.tsx:79` fires `quoteFormSubmitLabel` only on a 2xx response from the contact endpoint. The form is on /, /contact and /quote, and all three are covered.
- Verified in this run's build: `out/index.html`, `out/contact.html` and `out/quote.html` (and all 18 pages, per check 24) load `googletagmanager.com/gtag/js?id=AW-18468343968`. The form label ships in `out/_next/static/chunks/164-*.js`.
- None of it loads in a PREVIEW build (`TRACKING_MODE` comes from `next.config.mjs`), so a preview cannot report fabricated conversions.

## 1. Verify output

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

## 2. site.config.ts

Unchanged by this run. The relevant block is `googleAds` (shown above). The full file is on the branch.

## 3–5. Alt-text spot checks, design direction, templated-look fixes

Not applicable. This is a tracking-only `site_update`; no content, images or design were touched.

## 6. UNRESOLVED

None new from this run.

## 7. INVENTED

Nothing. No values were added or changed.

## 8. What is wrong, and why Part 1 was not applied

Doing Part 1 and Part 2 as written would have broken the site or the rules:

1. **Conversions would double count.** A second tag (`components/GoogleTag.tsx`) next to the existing `GoogleAdsTag` loads gtag.js twice. Every `tel:` click would fire the call conversion twice, and every successful form submission would fire the form conversion twice, inflating the Ads account's numbers.
2. **The new tag would fire in preview builds.** Unlike the existing `TRACKING_MODE` gate, the template `GoogleTag` has no preview check. A preview deploy would record conversions in the real Ads account. This site's check 24 would then fail any PREVIEW build.
3. **Part 1 needs files that are forbidden in CI.** Step 3 edits `lib/config-schema.ts` and step 4 edits `scripts/verify.ts`; AGENT.md forbids both "without exception". Without the schema edit, Part 2 fails check 1: the schema object is `.strict()` and has no `tracking` key.
4. **Check numbers collide.** In this repo, check 22 is already "city pages exist only for cities with a filled localDetail" and 24 is the Google Ads check. A new "check 22" would clash.
5. **The check 22 snippet in INSTRUCTIONS.md is cut off.** It stops mid-block, with no closing braces and no `record(22, ...)` call, so it could not be pasted "exactly as given" anyway.

**For Jacob / the platform:** the ops platform's `install_tracking` should treat a repo with a `googleAds` block (KA Lights, and any other site on this older tracking variant) as already installed when the IDs match, instead of sending a template backport. If you want KA Lights moved onto the template's `tracking` key anyway, do it in the template or by hand. It means replacing `googleAds`, `GoogleAdsTag`, `TelConversion`, the `LeadForm` call and check 24, not adding to them, and keeping the PREVIEW gate.
