# Rangiora RSA Club — Website

A modern, fully static, multi-page website for the **Rangiora RSA Club** (82 Victoria Street, Rangiora, Canterbury 7400 · 03 313 7123). Built with pure HTML5, Tailwind CSS (CDN) and vanilla JavaScript — no build tools, no frameworks, ready to host anywhere (GitHub Pages, Netlify, any web host).

## File structure

```
/
├── index.html          Home — hero, stats, welcome, Spitfire feature, facilities, find us
├── about.html          History (1919 → today), timeline, values, Ode of Remembrance
├── facilities.html     Our Club — bar & courtyard, gaming, courtesy van
├── functions.html      Functions & venue hire — private rooms + enquiry form
├── restaurant.html     The Spitfire on Victoria — hours, sample menu, booking CTA
├── membership.html     Benefits, $30/yr pricing, full application form
├── events.html         What's on, with category + month filtering
├── news.html           News cards (duplicate a card to add a story)
├── gallery.html        Photo grid with lightbox
├── board.html          Club governance + board member placeholders
├── faq.html            Accordion FAQs
├── contact.html        Contact cards, form, Google Map
└── assets/
    ├── css/styles.css  Custom styles, animations, components
    └── js/main.js      Menu, scroll-reveal, counters, lightbox, filters, accordion
```

## Publish on GitHub Pages (free)

1. Create a free account at github.com, then click **New repository** (e.g. `rangiora-rsa-website`, Public).
2. Click **uploading an existing file** and drag in **all** the files and the `assets` folder from this project. Commit.
3. Go to **Settings → Pages**. Under *Build and deployment*, set Source = **Deploy from a branch**, Branch = **main**, folder = **/ (root)**. Save.
4. After a minute your site is live at `https://YOUR-USERNAME.github.io/rangiora-rsa-website/`.
5. Custom domain (e.g. rangiorarsa.nz): in **Settings → Pages → Custom domain**, enter the domain, then at your DNS provider add a CNAME record pointing `www` to `YOUR-USERNAME.github.io` (and A records for the apex — GitHub's docs list the four IPs). Tick **Enforce HTTPS**.

## Connect the forms (Formspree — free tier)

The membership application, function enquiry, contact form and newsletter signups all post to Formspree.

1. Sign up free at [formspree.io](https://formspree.io) and click **New form** (e.g. "Membership applications"). Use `rangiorarsa@gmail.com` (or `rgarsafunctions@gmail.com` for the function form) as the destination email.
2. Copy the form's ID — the part after `/f/` in the endpoint, e.g. `https://formspree.io/f/abcd1234`.
3. In each HTML file, find `action="https://formspree.io/f/YOUR_FORM_ID"` and replace `YOUR_FORM_ID` with your ID. You can use one form for everything (the hidden `_subject` field labels each submission) or create separate forms per purpose.
4. Until replaced, submitting a form shows a friendly on-page note instead of an error.

Files containing forms: `membership.html` (application), `facilities.html` (function enquiry), `contact.html` (contact), plus newsletter forms on `index.html`, `events.html`, `news.html`.

> Note: the form emails you the application details — membership payment (bank transfer/card) is then handled by the club as usual. Never collect card numbers through these forms.

## Replace the placeholder photos

All images are royalty-free Unsplash placeholders marked with `<!-- PLACEHOLDER IMAGE -->` or `<!-- EDIT ME -->` comments. To use the club's own photos:

1. Create a folder `assets/img/` and copy your photos in (JPEG, ~1600px wide for heroes, ~800px for cards; compress at tinypng.com).
2. Replace the `src="https://images.unsplash.com/..."` URLs with e.g. `src="assets/img/courtyard.jpg"`.
3. Update each `alt=""` text to describe the actual photo (important for accessibility and SEO).
4. In `gallery.html`, also update `data-full` (large version) and `data-caption` on each tile.

## Everyday content edits

- **Add a news story** — `news.html`: duplicate any `<article>` card (a commented template card is included at the bottom of the grid) and edit the image, date, title and summary. Newest first.
- **Add an event** — `events.html`: duplicate an event card. Set `data-category` (`weekly`, `sport`, `entertainment`, `community`) and `data-month` (`YYYY-MM`, or `all` for weekly regulars). Add new months to the `#month-filter` dropdown as needed.
- **Menu changes** — `restaurant.html`: the sample menu items are plain HTML lists under `<!-- EDIT ME -->`.
- **Board members** — `board.html`: swap each placeholder card's icon block for a photo and add the member's name/role.
- **Hours or contact details** — appear in the top bar, footer (every page), `index.html`, `contact.html`, `restaurant.html` and `faq.html`. Search-and-replace across files to keep them in sync.

## Key club facts baked into the site

- 82 Victoria Street, Rangiora, Canterbury 7400 · 03 313 7123
- rangiorarsa@gmail.com (general) · rgarsafunctions@gmail.com (functions)
- Hours: Mon–Sat 10.30am–11.00pm, Sun 11.00am–10.00pm; bar meals daily from 11.30am; Spitfire Restaurant daily 11.30am–8.00pm, open to all guests 7 days, dine in or takeaway
- Membership: $30/year, open to all adults, runs 1 April–31 March; Thursday members draw 6.00pm (present & financial)
- Facilities: main lounge bar, outdoor courtyard with louvres & big screen, 18 modern gaming machines, pool, darts, snooker, TAB, ATM, Sky TV, courtesy van; three private rooms from a 12-seat boardroom to a 200-seat function room
- History: founded 28 July 1919; incorporated 5 December 1919; chartered June 1972; first service members 1981; $4M extension 2016; 4,000+ members by 2020

## Tech notes

- **Tailwind via CDN** — fine for this scale; for maximum performance later, compile Tailwind and self-host the CSS.
- **Accessibility** — semantic landmarks, skip-friendly structure, focus states, `aria-expanded` on menus/accordions, alt text on all images, `prefers-reduced-motion` respected.
- **SEO** — unique title/description per page, Open Graph tags, descriptive headings.
- **The Google Map** uses the free `output=embed` endpoint — no API key required.
