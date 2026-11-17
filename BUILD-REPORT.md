# Build report: kalights-1789175572458 (site_update, Strata trust badges)

## Which file is which

- **5274.jpg** (2048x2048, square): the ROUND black and gold badge, "Certified Installer / Permanent Lighting", Strata and Kalights in the centre.
- **5275.jpg** (2048x1144, wide): the WIDE black and gold banner, "Kalights / Certified Installer / Permanent Lighting Systems" with the Strata roundel on the left.

Both files downloaded. photo_511.jpg was not used. It arrived as `public/images/originals/logo.jpg` (ASSETS.json `kind: logo`), and I viewed it: it is a lower-resolution copy of the wide banner, not a logo. I deleted it from `originals/` without using it, so it is not processed or committed. The site logo is unchanged: it is still the text wordmark from `config.displayName`.

## Where each one appears

A new component, `components/StrataCertification.tsx`, holds both filenames and renders them through `<Img>`. That means the srcset and alt come from the manifest, sized as a badge with `object-contain`, so nothing is stretched.

- **Round badge (5274.jpg)**
  - Homepage trust strip under the hero (`components/TrustStrip.tsx`), to the left of the trust points (phone, 7 Inland Empire cities, app-controlled, year-round). It is 80px on phones and 96px from sm up.
  - Site footer (`components/Footer.tsx`), under the brand blurb in the first column, at 96px. The footer is on all 18 built pages.
- **Wide banner (5275.jpg)**
  - Homepage "Why permanent lighting" section (`components/FeatureCards.tsx`), under the section heading and above the cards, at max-w-md.
  - The Permanent Architectural Lighting service page (`app/services/[slug]/page.tsx`), in the sidebar under the service photo. It appears only for slug `permanent-architectural-lighting`.
- Neither image is used as the logo, favicon, hero, a service image, or a gallery item.

**Alt text:** check 11 requires every distinct image to have its own alt, so the two can't both use "Strata Certified Installer". I used **"Strata Certified Installer badge"** (5274.jpg) and **"Strata Certified Installer banner"** (5275.jpg).

## Gallery

`images.gallery` has **19 photos before and 19 after**. `site.config.ts` is not modified at all. The /gallery page shows the round badge only in the shared footer, not in the grid.

## Changed files

- New: `components/StrataCertification.tsx`, `public/images/originals/5274.jpg`, `public/images/originals/5275.jpg`, and their processed WebPs.
- Edited: `components/TrustStrip.tsx`, `components/Footer.tsx`, `components/FeatureCards.tsx`, `app/services/[slug]/page.tsx`, `public/images/manifest.json` (two entries added).
- Not changed: copy, tracking, the form, the gallery, the config, and the logo.

## 1. `npm run verify` (first attempt)

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

## 6. UNRESOLVED

Unchanged from the previous build: hours, yearsInBusiness, licenseNumber, insured and address are null (see CLIENT-TODO.md). Three videos were skipped by the intake because there is no transcoder yet.

## 7. INVENTED

None. The site does not claim the Strata certification anywhere in text. It appears only as the client-supplied images and their alt text.

## 8. Notes on the template / for the human

- The ops intake filed photo_511.jpg (the banner) as `kind: logo` and saved it as `logo.jpg`. Fix that classification upstream, or the next run will be offered the banner as a logo again.
- The config schema has no slot for certification badges, so the filenames are constants in `components/StrataCertification.tsx` and not in `site.config.ts`. If badges become common across clients, a `config.images.badges` field in the template would be the cleaner home. I did not edit `lib/config-schema.ts`.
