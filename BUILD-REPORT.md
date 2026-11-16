# Build report: kalights-1789175572458 (site_update, gallery images)

**Gallery photo count: 19 before, 20 after.** One of the two requested images was added. The other one (photo_510.jpg) could not be downloaded, so it is not on the site. See item 8.

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

The only change is one line added at the end of `images.gallery`:

```diff
       'three-crew-members-in-black-polos-prepare-a-ladder-and-white.jpg',
+      'certified-installer-banner-permanent-lighting-systems.jpg',
     ],
```

Nothing else in the config changed: no copy, tracking, form, logo, header, `launch` or `indexing.json`.

## 3. Alt-text spot checks

Only one new image was added, so there is one check instead of five. I viewed the file before writing its alt text:

- `certified-installer-banner-permanent-lighting-systems.jpg`: "Black and gold Kalights banner reading Strata Certified Installer, Permanent Lighting Systems, inside a thin gold frame." (17 words, matches the frame: the circular STRATA mark on the left, KALIGHTS, CERTIFIED INSTALLER, PERMANENT LIGHTING SYSTEMS, and a row of lights below.)

## 4. Design direction

Unchanged (site_update). No redesign.

## 5. Templated-looking things

Not re-run (site_update). The image goes into the existing gallery component. Its placement is last, after the install-in-progress photos, because it is a badge and not a photo of a job. It is a 1280x715 graphic on a dark background, so it sits fine with the night install photos, but it is a graphic and not a photograph. If Jacob would rather show it as a badge near the hero or footer than as a gallery tile, that needs a component change and was outside this instruction.

## 6. UNRESOLVED

- **photo_510.jpg (round "Certified Installer / Permanent Lighting" badge)**: not in `ASSETS.json` `saved` or `skipped`. The intake URL in INSTRUCTIONS.md (`.../03be4185-...-photo_510.jpg`) returns HTTP 404. Not placed, and it is in CLIENT-TODO.md under Questions for Jacob.
- Still open from earlier runs and carried over in CLIENT-TODO.md: hours, years in business, insurance or license number, city-specific photos, the three color-picker scenes, and the three videos (no transcoder in this repo yet).

## 7. INVENTED

Nothing was invented. The banner reads "STRATA Certified Installer". I put that wording only in the image's alt text, because it describes what is printed on the image. It does **not** appear in copy, config or schema as a certification fact. If Jacob wants "Strata certified installer" stated in site copy or as a credential, the client should confirm it and it should go into the brief or config first.

## 8. Problems with the template or the intake

- **The intake classified photo_511.jpg as the logo.** `ASSETS.json` saved it as `public/images/originals/logo.jpg` with `kind: "logo"`, even though the instruction says it is a gallery image and also says not to change the logo. I did not make it the logo. I renamed the file to `certified-installer-banner-permanent-lighting-systems.jpg` so that no later run treats it as the site logo, and put it in the gallery. I checked that the downloaded file is byte-identical to the photo_511 intake URL. I did not edit `ASSETS.json` (an input file), so its `file` path for this entry is now out of date. The intake's logo detection should be fixed.
- **photo_510.jpg was silently dropped.** The intake listed it in neither `saved` nor `skipped`, and its URL returns 404. A missing asset should be logged under `skipped` with a reason.

## Images

- Hero: unchanged (`backyard-patio-at-dusk-with-string-lights-strung-overhead-an.jpg`).
- Placed this run: 1 (photo_511 banner, gallery). Left out: 1 (photo_510, could not be downloaded: 404).
- Videos: none placed. The three skipped videos are unchanged (no transcoder in this repo).
