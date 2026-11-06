# The Imprint House: Website fixes from the Growth Plan (6 Nov 2026)

What was fixed on the website, what is ready and waiting for your content, and what only you can do.

> **To switch everything on:** Shopify admin → Online Store → Themes → **"Imprint House — growth plan fixes (6 Nov)"** → **Publish**.
> Store data changes (collections, pages, redirects) are already live. The theme changes go live when you publish.

---

## 1. Done (live now)

| Problem in the plan | What changed |
|---|---|
| Old "minimum 50 pieces" still in circulation | Collection pages and their Google snippets said "From 50 pieces / Min 50 pens / priced per person incl. GST". All rewritten with the real minimums (10 / 20 / 25 / 50). |
| Collection pages had no useful introduction | Keychains, Pens, Bottles & Mugs and Gift Packages each have a short intro on top and a longer guide under the products: what's available, minimums, delivery and how ordering works. The longer guide appears once the new theme is published. |
| Discoverability: no pages for what buyers search | 6 new landing pages, each with live product cards, a WhatsApp quote button and its own Google title and description: [dealership gifts](/pages/dealership-gifts), [real estate handover gifts](/pages/real-estate-handover-gifts), [employee welcome kits](/pages/employee-welcome-kits), [doctor & clinic gifts](/pages/doctor-clinic-gifts), [dealer meet gifts](/pages/dealer-meet-gifts), [corporate gifts under ₹500](/pages/corporate-gifts-under-500). |
| Trade/agency supply | New page: [For Gifting Companies & Resellers](/pages/trade). |
| Old links to removed pages | /pages/how-it-works → FAQ; /pages/who-we-work-with and /pages/our-story → homepage (no more "page not found"). |

## 2. Done (goes live when you publish the new theme)

- **Proof sections, hidden until you add real content** (Shopify admin → **Content → Metaobjects**):
  - **Client logo**: "Trusted by" strip under the homepage hero. Add only clients who said yes.
  - **Testimonial**: quote, name, designation, company, a photo of their order, and the product they bought.
    - Tick "Show on homepage" to show it on the homepage (up to 3).
    - Set the product to also show it on that product's page and on matching landing pages.
  - **Work photo**: real photos of client orders, bulk lots, packed cartons or the laser at work. Shown first in "What actually arrives" on the homepage (up to 8).
  - **Proof figure**: one true number, e.g. "12,000+ pieces engraved". Leave it empty if you can't stand behind it.
- **"See your logo in 3D" button on every product page.** It opens the 3D designer already set to that product, so buyers can picture their own logo instead of "THE IMPRINT HOUSE".
- **Footer "Gifts for" column** linking all landing pages and the reseller page, so Google can find them.
- **Homepage title for Google:** "Engraved Corporate Gifts with Logo in India | The Imprint House".
- **Business details for Google** (Organization data): name, logo, WhatsApp number and Instagram.
- **Fixed:** "More engraved gifts" cards said "/ piece" for gift sets. They now say "/ set".
- **Workshop video** (22 seconds, silent, cut from your Instagram reels) on the homepage and the 3D designer page, plus one real-order photo on each landing page.

## 3. Tracking: which channel brought each WhatsApp chat

Built into the new theme:

- Every WhatsApp message sent from the site ends with a short source code:

  | Code | Where the visitor came from |
  |---|---|
  | **(G)** | Google Ads (automatic, from Google's click ID) |
  | **(M)** | Meta ads, Instagram or Facebook |
  | **(I)** | IndiaMART |
  | **(L)** | LinkedIn |
  | **(S)** | Google/Bing search (organic) |
  | **(GBP)**, **(EMAIL)** … | any link you tag yourself with `?utm_source=…` |

  The code is remembered for 30 days, so it is still there if they come back later.
- The quote form sends the same code as **"Lead source"** in the email you receive.
- Three events are sent to Shopify's Customer events, ready for Google and Meta:
  - `whatsapp_click`
  - `quote_form_submit`
  - `designer_download` (3D preview saved or shared)

**Tag your own links so they get a code:**
- IndiaMART profile: `https://theimprinthouse.in/?utm_source=indiamart`
- Instagram bio: `https://theimprinthouse.in/?utm_source=instagram`
- Google Business Profile website link: `https://theimprinthouse.in/?utm_source=gbp` (not "google", which would be counted as Google Ads)
- LinkedIn: `https://theimprinthouse.in/?utm_source=linkedin`

**Lead sheet columns (one row per chat):** date · company · source code · product · quantity · quote value · ordered (Y/N) · order value.

### Send the events to Google Ads, GA4 and Meta (once those accounts exist)

Use **The Imprint House's own** Google and Meta accounts, never any Havels/Softies account.

1. Install Shopify's **Google & YouTube** app and the **Facebook & Instagram** channel. They handle page views and purchases.
2. In Google Ads, create two conversion actions, "WhatsApp click" and "Quote form", and copy their labels.
3. Shopify admin → **Settings → Customer events → Add custom pixel**. Name it "Imprint House leads", paste the code below, replace the 5 placeholder IDs, then **Save** and **Connect**.
4. Check with Google Tag Assistant and Meta Events Manager → Test events: click a WhatsApp button and submit the quote form.

```js
// The Imprint House: lead events -> GA4, Google Ads, Meta
const GA4_ID = 'G-XXXXXXXXXX';          // GA4 measurement ID
const ADS_ID = 'AW-XXXXXXXXX';          // Google Ads conversion ID
const ADS_WHATSAPP_LABEL = 'XXXXXXXX';  // conversion label: WhatsApp click
const ADS_QUOTE_LABEL = 'XXXXXXXX';     // conversion label: quote form
const META_PIXEL_ID = '000000000000000';

const s = document.createElement('script');
s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
document.head.appendChild(s);
window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', GA4_ID, { send_page_view: false }); // the Google app already sends page views
gtag('config', ADS_ID);

!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', META_PIXEL_ID);

analytics.subscribe('whatsapp_click', (event) => {
  const d = event.customData || {};
  gtag('event', 'whatsapp_click', { page_path: d.page, link_text: d.label, lead_source: d.source });
  gtag('event', 'conversion', { send_to: ADS_ID + '/' + ADS_WHATSAPP_LABEL });
  fbq('track', 'Contact');
});
analytics.subscribe('quote_form_submit', (event) => {
  const d = event.customData || {};
  gtag('event', 'generate_lead', { page_path: d.page });
  gtag('event', 'conversion', { send_to: ADS_ID + '/' + ADS_QUOTE_LABEL });
  fbq('track', 'Lead');
});
analytics.subscribe('designer_download', (event) => {
  const d = event.customData || {};
  gtag('event', 'designer_download', { product: d.product });
  fbq('trackCustom', 'DesignerDownload', { product: d.product });
});
```

## 4. Only you can do these

1. **Publish the new theme** (top of this page).
2. **Proof content.** Ask existing clients (dealerships first) for logo permission, a 1–3 line testimonial and order photos. Use the message template in the plan's Appendix A, then add the entries under Content → Metaobjects.
3. **Instagram photos: done.** 8 real-order photos are added as Work photos, and a 22-second silent workshop video is on the homepage and the 3D designer page. Frames showing other phone numbers, the city or the "Bombay Studio" plate were left out or blurred. To add more later: Content → Metaobjects → Work photo.
4. **Product photos with a client logo.** The first image of each product still shows "THE IMPRINT HOUSE". Send photos of real client orders (with permission), or pieces engraved with a dummy brand, and they'll be swapped in.
5. **Google Search Console.** Verify theimprinthouse.in and submit `https://theimprinthouse.in/sitemap.xml`. The new landing pages are in the sitemap automatically.
6. **Google Business Profile.** Create or claim it, hide the address if clients don't visit, set service areas, add the website link with `?utm_source=gbp` and the number +91 83192 67960. Ask every client for a review, with no incentives.
7. **Old details elsewhere.**
   - Update the number on IndiaMART, PDFs, email signatures and social profiles.
   - Keep the old WhatsApp number on an auto-reply pointing to +91 83192 67960 for a few months.
   - In Shopify: Settings → Store details → Phone, and Settings → Policies → Contact information.
8. **Desk Accessories collection.** Its only product is a draft, so the collection page is empty. Hide it: Products → Collections → Desk Accessories → Sales channels → remove Online Store.
9. **Pricing tiers.** Waiting on your decision (see the chat). Nothing has been changed yet.
