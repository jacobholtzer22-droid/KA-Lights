# Client Brief

Copy this file to `BRIEF.md`, fill it in from what the client actually gave you, and run the agent.

**Anything not in this brief does not appear on the site. The agent may not fill gaps from trade knowledge, from other clients, or from what "most businesses like this" do. If you do not know it, list it under UNKNOWN and the matching section will not render.**

## Business identity

- Legal name (as registered):
- Display name (what goes on the site, usually shorter):
- Trade (landscaping, HVAC, plumbing, junk removal, auto detailing, electrical, tree service, other):
- One-sentence tagline in the owner's words, or "none supplied":
- Year founded, or "unknown":
- License number, or "none" / "unknown":
- Insured (yes / no / unknown):

## Platform

- `businessSlug` (copy exactly from the platform admin, Business row `slug`). **The agent cannot proceed without this.**
- Domain the site will live on, including `https://` and `www.` if www is primary:

## Contact

- Phone (10 digits, the number that should ring):
- Email for the site, or "none":
- Published address (street, city, state, zip), or "not published":
- Latitude / longitude if known, else "unknown":

## Services

One block per service. Three to six real customer questions per service; if you do not have them, the agent writes trade-typical questions but may only answer from facts here.

### Service 1
- Name:
- What it includes (2 to 3 sentences):
- Starting price if published, else "not published":
- Price note (what changes the price), or "none":
- Customer questions (3 to 6):
  1.
  2.
  3.

### Service 2
- Name:
- What it includes:
- Starting price if published, else "not published":
- Price note:
- Customer questions:
  1.
  2.
  3.

(add more services as needed)

## Service areas

- Primary city and state:
- Other towns served (one per line, with county if known):
  -
  -
- For each town, anything specific the owner said about working there (lot sizes, common jobs, neighborhoods, how far they go). Write "nothing" where nothing was said; the agent will report that town as thin rather than invent color.
  -

## Hours

Day by day, or "unknown". Do not guess.

- Monday:
- Tuesday:
- Wednesday:
- Thursday:
- Friday:
- Saturday:
- Sunday:

## Profile URLs

Full URLs only, or "none".

- Google Business Profile:
- Facebook:
- Instagram:
- Yelp:

## Reviews

Only real reviews, each with a source URL. Leave empty to ship no review markup. Never paraphrase or combine reviews.

- Author / rating / exact text / source / URL:

## Photos

- Where the originals are (they must be dropped into `public/images/originals/`):
- Anything the owner said about specific photos (which job, which town, before/after pairs):

## Brand notes

- Brand colors (hex if available) or "none":
- Existing logo? (file name, or "none"):
- Words the owner uses / avoids:
- Sites the owner likes or dislikes and why:

## UNKNOWN

List every fact above that the client has not supplied. Each one becomes `null` in config and the related section does not render. This is the list to chase before launch.

-
-
