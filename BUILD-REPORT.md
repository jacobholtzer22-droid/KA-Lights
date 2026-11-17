# BUILD-REPORT: kalights-1789175572458 (site_update: tracking install)

**Result: I did not change any code. The tracking the instructions ask for is already on this site, with the same tag ID and the same two conversion labels. The gate passes 24/24.**

## 1. Verify output (`npm run verify`)

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
```

## 2. site.config.ts

Unchanged. The existing tracking block in it:

```ts
googleAds: {
  tagId: 'AW-18468343968',
  quoteFormSubmitLabel: 'AW-18468343968/Tdk_CPCttYIdEKChsuZE',
  clickToCallLabel: 'AW-18468343968/HUU6CL2ztYIdEKChsuZE',
},
```

These are the same three values as the `tracking` block in INSTRUCTIONS.md (`googleAdsId`, `conversions.form`, `conversions.call`).

## 3–5. Not applicable

This was a narrow tracking update. I did not touch any images, alt text or design.

## 6. UNRESOLVED

None from this run.

## 7. INVENTED

Nothing. This list is empty.

## 8. What is wrong, and why I made no changes

INSTRUCTIONS.md assumes "a repo whose template predates tracking support." That is not true for this repo. KA-Lights already has its own complete Google Ads install, which was added before the template's `tracking` block existed:

| Piece | This repo (already live) | What INSTRUCTIONS.md would add |
|---|---|---|
| Config | `googleAds` key in `site.config.ts`, validated in `lib/config-schema.ts` (tag/label prefix match) | a second `tracking` key holding the same values |
| Tag | `components/GoogleAdsTag.tsx`, rendered in `app/layout.tsx` | `components/GoogleTag.tsx`, a second gtag loader |
| Call conversion | `components/TelConversion.tsx`: a delegated, capture-phase `tel:` listener | a second `tel:` listener |
| Form conversion | `components/LeadForm.tsx`: fires `quoteFormSubmitLabel` only on a 2xx from the contact endpoint | a MutationObserver on `main [role="status"]` |
| Preview safety | everything is gated on `TRACKING_MODE` (`next.config.mjs`), so preview builds load and fire nothing | no preview gate |
| Gate | check 24 checks both directions (tag present in production, absent in preview) | "check 22", but that number is already this repo's city-pages check |

The gate output above shows the result the instructions ask for is already met: all 18 pages load `AW-18468343968` and ship both conversion labels.

Applying Part 1 and Part 2 as written would have made things worse:

1. **Conversions would be double-counted.** Two tags would both config `AW-18468343968`, and two `tel:` listeners would each send the call conversion, so every call tap would record twice. Every quote form would also fire twice: once from LeadForm and once from the observer. The campaign's conversion numbers would be inflated by about 2×.
2. **Preview builds would start firing real conversions.** The new GoogleTag ignores `TRACKING_MODE`. Every preview deploy would load gtag.js and send conversions, which records invented leads in the live ad account. It would also fail this repo's check 24 on every preview build.
3. **It requires files that are forbidden in CI.** Parts 1.3 and 1.4 edit `lib/config-schema.ts` and `scripts/verify.ts`. AGENT.md forbids both without exception and says: "If a change you believe is correct requires one of these files, do not make it."
4. **The check-22 snippet in INSTRUCTIONS.md is cut off.** It stops partway through the per-page loop: the `for`, `if (t.conversions.form)`, `if (t?.googleAdsId)` blocks and the outer block are never closed, and it never calls `record(22, …)`. It also reuses check number 22, which already belongs to the city-pages check here.
5. **The `tracking` key would fail check 1 without step 3.** The config schema is `.strict()`, so adding the key without the schema change would break the build. Adding it alongside `googleAds` would also give the same values two homes in config.

**Recommendation for the platform:** mark kalights-1789175572458 as "tracking installed (legacy `googleAds` block, check 24)". `install_tracking` should detect an existing `googleAds` key or `components/GoogleAdsTag.tsx` and skip, rather than backporting. If you want this repo moved onto the template's `tracking` implementation, do it in one deliberate change in the template repo that *replaces* GoogleAdsTag, TelConversion, the LeadForm conversion call and check 24 rather than adding next to them, and keeps the preview gate. That needs a human, because it touches forbidden files.

The tag ID and labels in INSTRUCTIONS.md match the ones already deployed character for character, so nothing on the Google Ads side needs to change.
