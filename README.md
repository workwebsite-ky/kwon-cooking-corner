# Kwon Cooking Corner — Website

A five-page, production-ready website for **Kwon Cooking Corner LLC (K.C.C)**, Saint Petersburg, Florida.
Plain HTML, CSS and vanilla JavaScript — no build step, no framework, no dependencies to install.

---

## Quick start

Double-click `index.html`. That's it — everything (including the fonts) is bundled,
so it works straight off your disk, off a USB stick, or on any web host.

To publish it, upload the whole folder to any static host — Netlify, Vercel,
GitHub Pages, Hostinger, cPanel, Cloudflare Pages. There is nothing to compile
and no server-side code required.

---

## What's in the box

```
kwon-cooking-corner/
├── index.html          Home — hero, story, services, menu, gallery, reviews, FAQ
├── services.html       The three services in detail + how it works + add-ons
├── packages.html       Pricing tiers, the full signature menu, pricing FAQ
├── about.html          Jakwon's story, mission & vision, timeline, trust badges
├── contact.html        Contact details, quote form, Google Map
│
├── css/
│   ├── style.css       All site styling — commented, organised into 20 sections
│   └── fonts.css       The three webfonts, embedded (no external requests)
│
├── js/
│   └── script.js       All behaviour — commented, one block per feature
│
└── assets/
    ├── logo/           Logo in ink, cream and original, plus the favicon
    ├── img/            All 20 photos, renamed, resized and compressed for web
    └── fonts/          The .woff2 source files (also embedded in fonts.css)
```

---

## ⚠️ Three things to do before this goes live

**1. Replace the placeholder reviews.**
The three testimonials on the home page are clearly-marked sample text, *not* real
customer reviews. Publishing invented reviews as if they were genuine is both
misleading and against most platforms' rules. Swap in real quotes from the K.C.C
Facebook or Instagram page (with the customer's permission), or delete the whole
section — it's marked with a big comment in `index.html` so it's easy to find.

**2. Confirm the details I filled in.**
The phone number, Instagram, Facebook, city and the five menu prices all came from
the material you sent. These did not, and should be checked with Jakwon:

| Item | What the site currently says |
|---|---|
| Email | `kwoncookingcorner@gmail.com` |
| Lead times | 48 hours for treats, 5–7 days for cakes and catering |
| Deposits | "Larger orders normally take a deposit" |
| Ordering hours | "Messages answered daily" |
| Allergen wording | Home kitchen, cross-contact can't be ruled out |
| Bundt / pound cake / cheesecake prices | $4 / $4 / $5 — these three still come off the printed **cookie** menu card, so confirm they're right for those products. (Cupcake pricing IS confirmed: $10 per pack of 6, $25 a dozen.) |

**3. Decide how the contact form should submit.**
Right now it validates in the browser and then opens the visitor's email app with
everything pre-filled (a "mailto" handoff) — this works everywhere with zero setup.
If you'd rather collect submissions properly, see *Wiring up the form* below.

---

## Customising

### Colours

Every colour on the site comes from one block at the top of `css/style.css`.
Change these five and the whole site re-skins itself:

```css
:root {
  --ink:     #12100f;   /* the logo's brush-lettering black */
  --stone:   #f7f3ec;   /* the logo's speckled cream background */
  --stone-2: #ece4d7;   /* deeper cream, alternating sections */
  --gold:    #c8873c;   /* accent — buttons, prices, highlights */
  --gold-lt: #e7b76a;   /* accent highlight */
}
```

The palette was pulled directly from the K.C.C logo: black ink and warm stone,
with a toasted-caramel gold drawn from the bakes themselves to give it lift.

### Phone number and email

The email and phone used by the contact form live at the top of `js/script.js`:

```js
var CONFIG = {
  email: 'kwoncookingcorner@gmail.com',
  phone: '+17272883681'
};
```

They also appear as links in the HTML. To change them everywhere, find-and-replace
these three strings across all five `.html` files:

- `kwoncookingcorner@gmail.com`
- `+17272883681` (in `tel:` and `sms:` links)
- `(727) 288-3681` (the human-readable version)

### Prices

The five signature prices are plain text inside `<div class="menu-item__price">`
on both `index.html` and `packages.html`. Edit them directly — no build step.

Cupcakes are sold by the pack, not per piece: **$10 for 6, $25 for a dozen**. That
is stated in the price bubble ($10), repeated in the item description ("pack of 6"),
spelled out in the note under the menu list, and answered in the pricing FAQ on
`packages.html`. If a cupcake price changes, update all four places. The item names and photos were confirmed by the
client: Oreo mini bundt cakes, red velvet pound cake slice, Cookie Monster cupcakes,
red velvet cupcakes, Fruity Pebbles cheesecake. The printed cookie menu card shown
beside them is a separate product line, labelled "Also on the cookie menu".

### Photos

Drop a new image into `assets/img/` and point the `src` at it. Keep images under
about 1600px on the long edge and save as JPEG at ~82% quality; that's what all the
current photos are, which is why the pages load fast.

Always update the `alt=""` text to describe the new photo — it matters for both
accessibility and Google.

---

## Wiring up the form

Open `js/script.js` and find the block marked `BEGIN mailto handoff`. Replace it
with a `fetch()` to whichever service you prefer. With [Formspree](https://formspree.io),
for example:

```js
fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Accept': 'application/json' },
  body: new FormData(form)
}).then(function (r) {
  say(r.ok ? 'Thanks! Your request has been sent.' : 'Something went wrong — please call instead.', r.ok);
});
```

Netlify Forms, Getform and EmailJS all work the same way. The validation, the
success/error messaging and the styling are already built — you're only swapping
out where the data goes.

**Credentials shown on the site**
Jakwon holds a Certificate of Program Completion in Professional Culinary Arts and
Hospitality from Pinellas Technical College, completed 19 June 2025, under standards
approved by the Florida Department of Education. This is on the About page as a
dedicated section with the certificate photo, in the trust badges, in the timeline,
and in the page's structured data so search engines can see it.

---

## What's built in

**Design**
Logo-derived palette · Playfair Display / Jost / Caveat type system ·
glassmorphic navigation and hero card · film-grain texture on dark panels ·
gold offset frames · fully responsive from 320px up.

**Motion**
Preloader · scroll-reveal on every section (IntersectionObserver, staggered) ·
hero parallax · animated stat counters · hover lifts, image zooms and button
sheens · animated FAQ accordion · smooth scrolling.

**Functionality**
Sticky nav that turns to glass on scroll · full-screen mobile drawer ·
gallery lightbox with keyboard support · validating contact form ·
back-to-top button · quick-text floating button · Google Map embed.

**SEO**
Unique title and meta description per page · Open Graph and Twitter cards ·
`Bakery` schema.org structured data on the home page · semantic H1/H2/H3
hierarchy · descriptive alt text on every image · canonical URLs ·
`sitemap.xml` and `robots.txt` included.

**Performance**
No frameworks and no external requests at all — fonts are embedded, so there's
nothing to fetch from a CDN. All images compressed and lazy-loaded below the fold;
the hero image is marked high-priority so it paints first.

**Accessibility**
Skip-to-content link · visible focus rings · ARIA labels on every icon-only
control · `prefers-reduced-motion` fully respected (all animation is disabled
for users who ask for that) · text contrast checked against the palette.

---

## Before you upload

1. Replace the placeholder reviews (see above).
2. Update the canonical/Open Graph URLs — they currently point at
   `https://kwoncookingcorner.com/`. Change them in all five `.html` files and in
   `sitemap.xml` if the real domain is different.
3. Test the form end-to-end once it's on the live domain.

---

Built for Kwon Cooking Corner LLC · Founded by Jakwon · Saint Petersburg, Florida
Instagram [@kwoncookingcorner](https://www.instagram.com/kwoncookingcorner/) · Facebook [/quan2006](https://www.facebook.com/quan2006) · (727) 288-3681
