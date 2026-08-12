# EcoHackOyo 2026 — Website

A production-ready static website for EcoHackOyo, Oyo's Biggest Climate & Economic
Innovation Summit (convened by Olufemi Paul, powered by Minds Hive Organization).

## Pages

| File                      | Purpose                                                        |
|----------------------------|-----------------------------------------------------------------|
| `index.html`               | Main landing page — full event info, both tracks, timeline, sponsors, FAQ |
| `register-hackathon.html`  | Registration for **hackathon contestants** (Sept 2026, online, 4 weeks) |
| `register-summit.html`     | Registration for **Main Summit attendees** (Oct 22–23, Ibadan)  |
| `register-sponsor.html`    | Registration/interest form for **sponsors & partners**          |

All four pages share `css/style.css`, `js/site.js` (nav, countdown, scroll animation)
and `js/forms.js` (form validation + submission).

## Before you launch: connect the 3 forms (5 minutes each)

The forms are fully built (validation, error states, success screen) but need a real
endpoint to actually deliver registrations to you — right now each `<form>` posts to a
placeholder URL like `REPLACE_WITH_HACKATHON_FORM_ID`, which will show visitors a
friendly "form isn't connected yet" message instead of failing silently.

The fastest no-code way to fix this is **Formspree** (free tier: 50 submissions/month;
paid plans for more, still no backend code required):

1. Go to https://formspree.io and create a free account.
2. Create **three** forms — name them "EcoHackOyo Hackathon", "EcoHackOyo Summit",
   "EcoHackOyo Sponsor" — and copy each form's endpoint URL
   (looks like `https://formspree.io/f/abcdwxyz`).
3. In each HTML file, find the `<form ... action="...">` tag and replace the
   placeholder with your real endpoint:
   - `register-hackathon.html` → `REPLACE_WITH_HACKATHON_FORM_ID`
   - `register-summit.html` → `REPLACE_WITH_SUMMIT_FORM_ID`
   - `register-sponsor.html` → `REPLACE_WITH_SPONSOR_FORM_ID`
4. In Formspree, set each form's notification email to whoever should receive that
   registration type (e.g. sponsor form → partnerships email).
5. Submit a real test entry on each page after deploying to confirm it arrives.

Alternatives to Formspree if you outgrow the free tier or want your own database:
Google Forms (embed or redirect), Getform, or a small custom backend (e.g. a
Google Sheet via Apps Script, or Airtable + Zapier). The forms already send clean
`FormData` with a `form_type` hidden field, so swapping the endpoint is generally a
one-line change per file — no JavaScript rewrite needed unless you change field names.

## Deploying

This is a static site — no build step, no server required. Any of these work:

- **Netlify / Vercel**: drag-and-drop the folder, or connect a GitHub repo. Free tier
  is enough for an event site.
- **GitHub Pages**: push this folder to a repo and enable Pages in settings.
- Any standard web host: upload the folder via FTP/cPanel.

Once live, point the QR code / registration link on printed flyers to your real
domain (e.g. `https://ecohackoyo.org` or `https://ecohackoyo.netlify.app`).

## Content notes — please review before launch

Everything on the site is sourced from the supplied flyer and the convener's brief.
A few things were not specified and use reasonable placeholders — update them:

- **Exact time** for the Main Summit (currently shows dates only, no time-of-day).
- **Exact venue name/address** in Ibadan (currently "Ibadan, Oyo State" only).
- **Exact hackathon start date** in September 2026 (poster only said the month).
- **Sponsor tiers/pricing** on `register-sponsor.html` are illustrative — confirm real
  tiers and benefits with your partnerships team, then edit that page's tier cards.
- **Contact emails** (`info@ecohackoyo.org`, `partnerships@ecohackoyo.org`) and social
  links in the footer are placeholders — replace with real accounts.
- **Partner logos**: the partners section currently shows text labels (Minds Hive,
  Oyo State Government MDAs, Ennovate Lab, Jobberman). Swap in real logo images when
  available (drop files into `assets/` and replace the text blocks in `index.html`'s
  `#partners` section with `<img>` tags).

## Technical notes

- No external JS frameworks — plain HTML/CSS/JS, so it loads fast on mobile data.
- Fully responsive (desktop, tablet, mobile) and keyboard-accessible; respects
  `prefers-reduced-motion`.
- Countdown on the homepage targets the Main Event: `2026-10-22T09:00:00+01:00` —
  update the `data-date` attribute on the `#countdown` element in `index.html` once
  the exact start time is confirmed.
- Forms validate client-side (required fields, email/phone format, radio-group
  selection, consent checkbox) before submission.
