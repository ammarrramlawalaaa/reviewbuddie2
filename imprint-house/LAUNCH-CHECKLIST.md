# The Imprint House: launch checklist

These are the things only you can do in Shopify admin. Do them in this order. Everything else on the site is done.

---

## 1. Publish the launch theme (1 min)
Online Store → Themes → **"Imprint House — with logo"** → ⋯ → **Publish**
(Or just tell Claude "publish it".)

## 2. Turn on a way to get paid (today)
Settings → **Payments**
- **For tomorrow:** under *Manual payment methods*, add **"Bank deposit"** or a custom method called **"UPI / Bank transfer"**. Put your UPI ID and bank details in the instructions. Sample orders can then be placed immediately.
- **This week:** activate a payment gateway (**Razorpay**, **Cashfree** or **PayU**). Their verification (KYC) usually takes a few days. They will ask for your PAN, bank account, GST (if any), and that your refund and shipping policies are live (step 3).
- Do **not** turn on Cash on Delivery. Engraved items can't be resold if refused.

## 3. Paste the 3 policies (5 min)
Settings → **Policies**. Replace the auto-generated text with the versions at the bottom of this file:
- Refund policy
- Shipping policy
- Legal notice (it currently just says "..")

## 4. Homepage Google title and description (2 min)
Online Store → **Preferences**
- **Homepage title:** `The Imprint House | Engraved Corporate Gifts with Your Logo`
- **Meta description:** `Laser-engraved pens, keychains, bottles and gift sets with your logo. Preview it in 3D, free digital mockup in 24 hrs, min 50 pieces, GST invoice, delivered across India.`
- **Social sharing image:** upload `product-photos/pen-keychain-set-black-desk.jpg`. This is the preview that appears when your link is shared on WhatsApp.

## 5. Show ₹ instead of "Rs." (1 min)
Settings → **General** → Store defaults → Currency display → **Change formatting**
- HTML with currency: `₹{{amount_no_decimals}} INR`
- HTML without currency: `₹{{amount_no_decimals}}`
- (Do the same for the two "email" fields)

## 6. Checkout settings (1 min)
Settings → **Checkout**
- Customer contact: **Phone number → Required**, so you can follow up on WhatsApp
- Order notes: **On**. Customers can type the name or logo text they want.

## 7. Meta Pixel and tracking (15 min)
Keep this **completely separate from Havels/Softies**: use a separate Meta Business portfolio and ad account for The Imprint House.
1. Shopify App Store → install **Facebook & Instagram** (by Meta) → connect The Imprint House's Facebook Page, Instagram, ad account and **a new Pixel/Dataset**. Set Data sharing to **Maximum**, which turns on the Conversions API.
2. Settings → **Customer events** → Add custom pixel → name it `WhatsApp & quote leads` → paste the code below, replacing `YOUR_PIXEL_ID` with your Pixel ID from Meta Events Manager → **Save → Connect**.

```js
// The Imprint House — sends WhatsApp clicks and quote-form submissions to Meta
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');

analytics.subscribe('whatsapp_click', (event) => {
  fbq('track', 'Contact', { content_name: event.customData?.label, page: event.customData?.page });
});
analytics.subscribe('quote_form_submit', (event) => {
  fbq('track', 'Lead', { page: event.customData?.page });
});
```
The site already sends these two events. Every WhatsApp button click and every quote-form submit is tracked. In Meta, you'll see them as **Contact** and **Lead**.

3. Test it: open your site, click a WhatsApp button, then check Meta Events Manager → Test events. You should see **Contact** appear.

## 8. Domain (strongly recommended before spending on ads)
`dhcx64-nt.myshopify.com` looks untrustworthy in an ad. Buy **theimprinthouse.in** (GoDaddy/Hostinger, about ₹500–900 a year) → Settings → Domains → Connect existing domain. Then verify the domain in Meta Business settings.

## 9. Final test before ads go live (10 min)
- [ ] Open the site on your phone: homepage, one product, FAQ, Get a quote
- [ ] Tap a WhatsApp button and check the message opens to +91 91095 35267
- [ ] Submit the quote form, and check the email arrives at ammarramlawala.ar@gmail.com
- [ ] Add a sample to cart and go to checkout. Check delivery shows ₹99 (and free on a bulk pack)

---

## Ad advice for tomorrow (short version)
- **Run Click-to-WhatsApp ads first** (Engagement → Messaging apps → WhatsApp). For a quote-led B2B business, a WhatsApp chat *is* the lead, so you don't depend on the website converting on day one. The website's job is to make people trust you when they check you out.
- Creative: the engraving close-ups and the gift box shots. Hook ideas: "Your logo, cut into metal — see it in 3D first", "Staff gifts from ₹249 per person, GST included".
- Audience: business owners / HR / admin managers in your target cities; ages 25–55. Start with a small daily budget and change one thing at a time.
- Send website-traffic ads to **/pages/3d-designer** (people upload their logo and send you the design on WhatsApp) or **/collections/ready-gift-packages**, not the homepage.

---

## Policy texts (copy-paste)

### Refund policy
**Last updated: 3 November 2026**

Everything we sell is engraved to order with your logo, names or text. Because each piece is made specifically for you, our refund policy is built around getting it right before we engrave, and fixing it fast if something goes wrong on our side.

**Before engraving: cancel anytime**
You can cancel an order at any time before you approve the final mockup (and, where relevant, the name list). Any advance you paid is refunded in full. Once you approve the mockup and engraving has started, the order can't be cancelled, because engraved items can't be reused or resold.

**Damaged, defective or our mistake: free replacement**
If any piece arrives damaged, defective, or different from the mockup you approved (for example a spelling we got wrong, or a short quantity), we'll replace those pieces free of charge. If a replacement isn't possible, we'll refund the value of the affected pieces.
To claim, contact us within **48 hours of delivery** on WhatsApp at +91 91095 35267 or by email at ammarramlawala.ar@gmail.com, with your order number and photos (an unboxing video helps for transit damage).

**What isn't covered**
- Change of mind after engraving
- Spelling, names, logos or details that match the mockup or name list you approved
- Small variations in engraving tone or colour between batches or materials
- Normal wear and tear after delivery

**Paid samples**
A paid single sample is engraved to order and is not refundable once engraved, unless it arrives damaged or defective, in which case we'll replace it.

**How refunds are paid**
Approved refunds are processed within 7 working days to your original payment method. Your bank may take a few extra days to show it.

**Questions**
WhatsApp +91 91095 35267 or email ammarramlawala.ar@gmail.com. We usually reply the same day.

### Shipping policy
**Last updated: 3 November 2026**

**Where we deliver:** We deliver across India through trusted courier partners.

**Delivery charges**
- Orders of ₹2,000 and above: free delivery
- Orders under ₹2,000 (for example a single paid sample): flat ₹99

All product prices already include GST.

**Production time.** Every order is engraved to order, so delivery time = production time + transit time.
- Paid samples: usually dispatched within 2–4 working days after you share your logo or text.
- Bulk orders: usually dispatched within 5–10 working days after you approve the sample or final mockup, depending on quantity and personalisation. We confirm your dispatch date in writing before you pay.

**Transit time:** Courier delivery usually takes 3–7 working days depending on your pin code. Remote areas may take longer.

**Tracking:** Once your order ships, we share the tracking link on WhatsApp and email.

**Event deadlines:** Need it for a specific date (an event, Diwali, a dealer meet)? Tell us before you order and we'll confirm whether we can meet it.

**Delivery address:** Please check your delivery address and phone number carefully. If a parcel is returned because of an incorrect address or failed delivery attempts, re-shipping charges will apply.

**Damaged in transit:** If a parcel arrives damaged, please photograph it and contact us within 48 hours. See our refund policy for how we fix it.

**Contact:** WhatsApp +91 91095 35267 or email ammarramlawala.ar@gmail.com.

### Legal notice
**The Imprint House**, laser-engraved corporate gifts.
The Imprint House is a family-run business operating this online store.
Contact: WhatsApp / phone +91 91095 35267 · Email ammarramlawala.ar@gmail.com
Registered business address and grievance contact details are listed on our Contact information page.
All product photos, text and designs on this website belong to The Imprint House unless stated otherwise. Logos and brand names engraved in our product photos are shown as examples of our work.
