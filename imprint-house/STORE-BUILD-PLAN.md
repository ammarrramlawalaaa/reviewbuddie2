# The Imprint House — Shopify store build plan

Hand-off for the next Claude session. Read `Project_Brief.pdf` first.

## Hard rule
This store is completely separate from Havels Group / Softies. Before ANY edit:
run get-shop-info, show the owner the store name/email, and wait for "yes".
If the connected store looks like Softies/Havels, stop.

## Confirmed by owner (1 Nov 2026)
- Minimum order: **50 pieces**
- Laser: **fiber** (metal is the strength; don't promise wood/glass/most plastics)
- WhatsApp: **+91 91095 35267** → `https://wa.me/919109535267`
- Products: start with mocks (below); owner will add more
- Images: mock placeholders now; owner uploads real photos later

## Mock catalogue — `products-mock.csv`
Shopify product CSV. Every product is imported as **Draft** and tagged `mock`.
Prices are placeholders. Each product has 2 variants:
"Sample — 1 piece with your logo" and "Bulk pack — 50 pieces" (keeps checkout at the 50-pc minimum).
Descriptions include a per-piece price table (50–99 / 100–249 / 250–499 / 500+ quote).

| Product | From ₹/pc | Sample ₹ |
|---|---|---|
| Classic Metal Keychain | 45 | 149 |
| Car Key Tag — Number Plate Keychain | 65 | 149 |
| Leather & Metal Keychain | 95 | 199 |
| Metal Ball Pen | 80 | 149 |
| Premium Metal Pen in Gift Box | 180 | 299 |
| Stainless Steel Bottle — 750 ml | 350 | 499 |
| Insulated Steel Tumbler | 320 | 449 |
| Metal Visiting Card Holder | 150 | 249 |
| Essential Gift Kit (under ₹300) | 249/kit | 399 |
| Executive Gift Kit (under ₹600) | 549/kit | 699 |
| Signature Gift Kit (under ₹1,200) | 1,099/kit | 1,249 |

Placeholder images: `placeholder-images/<handle>.jpg` (2048×2048, light grey, "MOCK IMAGE").

## Build steps (once Shopify is connected and the store is confirmed)
1. Store settings: INR, Asia/Kolkata, store name "The Imprint House".
2. Create the 11 products from the CSV data (draft), then upload the placeholder images.
3. Collections: Keychains, Pens, Drinkware & Bottles, Desk Accessories, Ready Gift Packages, Shop by Business (dealerships, clinics, schools, hotels, offices).
4. Pages: How it works, Who we work with, Our story, Request a quote / Free sample (contact form), FAQ (MOQ 50, 24-hr mockup, 50% advance, GST invoice, delivery).
5. Navigation: Packages · Products · Who we work with · How it works · Our story · Get a quote.
6. Homepage copy: hero "Branded gifts, engraved in-house and delivered ready to give." Buttons: Get a free sample / Request a quote. Line: "For shops, clinics, cafés, schools, dealerships, startups and offices — from 50 pieces."
7. WhatsApp: floating button on every page (owner installs an app, or a theme snippet).
8. Owner to do in Shopify admin: theme choice, domain, payments, GST number, policies.

## Open questions for owner
- GST: prices INCLUDE GST (confirmed; store setting taxesIncluded = true)
- GST number to show on site
- Domain (.in check pending)

## Build log — 1 Nov 2026 (store dhcx64-nt.myshopify.com, trial)
Done via Shopify connector:
- 11 mock products created, placeholder images attached, set ACTIVE + published to Online Store (store is password-protected on trial)
- Smart collections: Ready Gift Packages, Keychains, Pens, Bottles & Drinkware, Desk Accessories
- Pages: How it works, Who we work with, Our story (needs one real family detail), Get a free sample or quote (contact template), FAQ
- Main menu + footer menu rebuilt (footer has WhatsApp link)
- Prices include GST (taxesIncluded = true)
Still for the owner in Shopify admin: rename store (Settings → General), choose theme + homepage sections, WhatsApp button app, domain, payments, policies, logo.
FAQ assumptions to confirm: 5–10 working-day lead time, delivery across India, colour via outsourcing.

## Build log — 1 Nov 2026 (later)
- Plan upgraded to Basic; password removed by owner.
- Product photos swapped to free Pexels stock images (alt text says "sample photo"); placeholders deleted.
- Files: hero-laser-engraving.jpg, workshop-laser.jpg (Pexels) uploaded to Shopify Files.
- Theme copy "Imprint House — new homepage" (gid://shopify/OnlineStoreTheme/142608236605), unpublished:
  - templates/index.json = theme/index.json (hero, trust strip, packages, how it works, products, budget planner, who we work with, story, CTA)
  - sections/header-group.json = theme/header-group.json (3 announcements, floating WhatsApp button, country/language selectors off)
- Owner must publish the copy (Online Store → Themes → Publish); API cannot publish themes.

## Build log — 3 Nov 2026 (launch prep)
- Location: no city on the site (family business, Mandsaur — owner asked not to mention it). All "Ajmer" removed.
- Drafted (hidden, not deleted) products with only stock photos: car key tag, leather keychain, premium pen box, card holder, tumbler, Signature kit.
- Live products (7): Essential set, Executive set, engraved keychain, black metal pen, roller pen, steel mug, steel bottle.
- Shipping: "Standard delivery" ₹99 up to ₹1,999.99; "Free delivery" from ₹2,000.
- Collections SEO set; "Bottles & Drinkware" renamed "Bottles & Mugs"; Desk Accessories removed from menu (collection empty).
- Pages: Ajmer removed, Our story placeholder removed, FAQ adds free-sample, delivery cost, returns answers.
- Policies: write access denied for API — texts in LAUNCH-CHECKLIST.md for owner to paste.
- Launch theme = "Imprint House — with logo" (142635270205): logo, real hero/story photos, no scroll-hidden content, custom-set card, planner reads kits from store, ₹ on homepage, WhatsApp/quote click events (whatsapp_click, quote_form_submit via Shopify.analytics.publish).

## Build log — 3 Nov 2026 (homepage v3)
- Homepage: hero = laser-machine photo + scan line + YOUR LOGO tag (owner's choice); packages (+ custom set card); 3D engraving preview; products; CTA. Removed: budget planner, how-it-works, who-we-work-with, our-story sections.
- Pages How it works / Who we work with / Our story set to hidden (isPublished false). Main menu: Gift Packages · Products · FAQ · Get a free sample. Footer "Company" column replaced by "Help" (FAQ, shipping, returns, contact).
- 3D preview: theme/src/engrave.js → bundled with esbuild (three r170, IIFE global IHEngrave) to theme asset assets/ih-engrave.js (~136 KB gzipped), lazy-loaded near viewport; CSS keychain fallback if no WebGL. Models: keychain, metal pen (black/silver/blue), roller pen, flask (black/red), mug (navy/black). WhatsApp CTA pre-fills product, colour and typed name.
