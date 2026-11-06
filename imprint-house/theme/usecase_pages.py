# Use-case landing pages (source of truth). Rendered with templates/page.usecase.json:
# hero (title + custom.subtitle), live product cards (custom.products), this body, real client quotes, how ordering works.
# Facts only: MOQs, timelines and products as on the live site. No client names or claims we can't back up.
import json, sys
P = {"classic":8101129977917,"metalpen":8101130764349,"sagebottle":8101130862653,"essential":8101130993725,"executive":8101131026493,
     "roller":8102972391485,"mug":8102972424253,"flask":8103776256061,"leather":8105363931197,"goldpen":8105363963965,
     "ropebottle":8105363996733,"whitebottle":8105364029501,"slimpen":8105365078077,"round":8105365110845,"house":8106071654461}
GOOD = lambda items: "<h2>Good to know</h2><ul>" + "".join(f"<li>{i}</li>" for i in items) + "</ul>"
PAGES = [
 dict(handle="dealership-gifts", title="Car & Bike Dealership Gifts",
  sub="Keychains with your dealership's logo and each customer's name or vehicle number, ready for every handover.",
  seo_t="Dealership Gifts for Customers | Engraved Name Keychains India",
  seo_d="Keychains engraved with your dealership logo and each customer's name or vehicle number, for car and bike deliveries. From 50 pieces, free mockup in 24 hrs.",
  products=["classic","leather","round","essential","metalpen"],
  body="<h2>Why dealerships give engraved keychains</h2><p>The key handover is the moment a customer remembers. A keychain with your logo and their name or registration number turns a giveaway into something they keep and use every day, so your dealership's name travels with every drive. Engraving is cut into the surface, so it won't fade or peel like a printed tag.</p>"
       "<h2>What dealerships usually order</h2><ul><li><strong>Name or vehicle-number keychains</strong>: your logo plus the customer's name or registration number. Polished metal or tan leather.</li><li><strong>Delivery gift sets</strong>: an engraved pen and keychain in a gift box, handed over with the papers.</li><li><strong>Service camps and festive gifting</strong>: logo keychains or pens for loyalty events, service camps and Diwali.</li></ul>"
       "<h2>Set it up as a monthly programme</h2><p>Deliveries happen every week, so a single bulk order often isn't the best fit. Send us your delivery list each month, in batches of 50 or more, and we engrave and dispatch that batch. Your logo stays the same; only the names or numbers change. We'll ask you to approve each list before engraving, so every spelling is right.</p>"
       + GOOD(["Keychains: minimum 50 per batch, free delivery on 100+.","Want to hold one first? Order a single engraved sample from any product page.","Prices are all-inclusive: engraving, packing and taxes."])),
 dict(handle="real-estate-handover-gifts", title="Real Estate Handover Gifts",
  sub="House-shaped keychains and gift sets engraved with your project logo, and each buyer's name or flat number.",
  seo_t="Real Estate Handover Gifts | Engraved House Keychains India",
  seo_d="House-shaped keychains engraved with your project logo and each buyer's name or flat number, for possession and handover day. From 50 pieces, free mockup.",
  products=["house","classic","round","essential","executive"],
  body="<h2>Make handover day memorable</h2><p>Buyers wait years for their keys. Handing them over on a house-shaped keychain engraved with your project's logo and their name or flat number makes the moment personal, and keeps your brand in their pocket long after possession.</p>"
       "<h2>Ideas that work</h2><ul><li><strong>House-shaped keychain</strong>: your project logo, plus the buyer's name, flat number or handover date.</li><li><strong>Handover gift set</strong>: an engraved pen and keychain in a gift box, for signing day.</li><li><strong>Channel partners and brokers</strong>: the Executive Gift Set (flask, pen and keychain) for launches, site visits and partner meets.</li></ul>"
       "<h2>Plan by tower or phase</h2><p>Order in batches as each tower or phase is handed over, with a minimum of 50 keychains per batch. Share the buyer list in Excel and we'll ask you to approve it before engraving. Allow two to three weeks from mockup approval to delivery so the gifts arrive before the keys go out.</p>"
       + GOOD(["Keychains: minimum 50, free delivery on 100+. Gift sets from 20 sets.","Single engraved samples available before you commit.","Prices are all-inclusive: engraving, packing and taxes."])),
 dict(handle="employee-welcome-kits", title="Employee Welcome Kits",
  sub="Engraved bottles, mugs, pens and gift sets for new joiners, with each person's name if you like.",
  seo_t="Employee Welcome Kits with Logo | Joining Kits for New Hires India",
  seo_d="Employee welcome and joining kits: engraved bottles, mugs, pens and gift sets with your logo and each joiner's name. From 10 pieces, free mockup, all-inclusive.",
  products=["executive","sagebottle","mug","whitebottle","metalpen","essential"],
  body="<h2>What makes a welcome kit work</h2><p>A joining kit works when people actually use it. A bottle or mug on the desk and a pen in the bag do more for your employer brand than a printed T-shirt that sits in a drawer. Engraving each person's name makes it feel like theirs from day one.</p>"
       "<h2>Three easy starting points</h2><ul><li><strong>Simple</strong>: an engraved pen and keychain gift set.</li><li><strong>Everyday</strong>: a steel coffee mug or bottle with the joiner's name, plus a pen.</li><li><strong>Premium</strong>: the Executive Gift Set, with an insulated flask, pen and keychain in a gift box.</li></ul><p>Live prices are on the product cards above. Tell us your budget per person on WhatsApp and we'll suggest a mix.</p>"
       "<h2>Tips for HR teams</h2><ul><li>Order for the quarter's joiners in one go, and keep a few spares for late joiners.</li><li>Names change often, so many teams order logo-only pieces in bulk and add names in smaller batches (minimum 10 for mugs and bottles).</li><li>Send the name list in Excel; we'll ask you to approve it before engraving.</li></ul>"
       + GOOD(["Mugs and bottles from 10 pieces, flasks from 20, pens from 25, gift sets from 20 sets.","Prices are all-inclusive: engraving, packing and taxes.","Usually 5–10 working days after you approve the mockup, plus courier transit."])),
 dict(handle="doctor-clinic-gifts", title="Gifts for Doctors & Clinics",
  sub="Pens, bottles and mugs engraved with your clinic or hospital's logo, or each doctor's name.",
  seo_t="Gifts for Doctors with Logo | Engraved Pens & Bottles India",
  seo_d="Engraved pens, bottles and mugs with your clinic or hospital's logo, or each doctor's name. For staff, Doctors' Day and events. From 10 pieces, free mockup.",
  products=["roller","goldpen","metalpen","sagebottle","whitebottle","mug"],
  body="<h2>Gifts that get used every day</h2><p>Doctors write all day, and a good pen with their name engraved on it is a gift they actually reach for. Bottles and mugs sit on the consulting desk. Laser engraving won't wash off, which matters in a clinic where everything gets cleaned often.</p>"
       "<h2>Popular choices</h2><ul><li><strong>Magnetic-cap roller pen in a gift case</strong>: the most giftable pen, ready to hand over.</li><li><strong>Soft-touch pen with gold or rose-gold trim</strong>: a premium feel, with a stylus tip for phones and tablets.</li><li><strong>Steel bottles and mugs</strong>: with the clinic's logo or each doctor's name.</li></ul>"
       "<h2>For hospitals, clinics and healthcare teams</h2><p>Common occasions: National Doctors' Day (1 July), International Nurses Day (12 May), welcoming a new consultant, staff recognition and CME events.</p><p><em>Pharmaceutical and medical-device companies: please check your company's gifting policy and the applicable marketing code before ordering gifts for healthcare professionals.</em></p>"
       + GOOD(["Pens from 25 pieces; mugs and bottles from 10.","Names on each piece: send the list and approve it before engraving.","Prices are all-inclusive: engraving, packing and taxes."])),
 dict(handle="dealer-meet-gifts", title="Dealer & Distributor Meet Gifts",
  sub="Engraved gift sets and drinkware for dealer meets, distributor conferences and channel partner events.",
  seo_t="Dealer Meet Gifts with Logo | Distributor Meet Gift Sets India",
  seo_d="Engraved gift sets, flasks and bottles for dealer and distributor meets, with your logo and each attendee's name. From 20 sets, free mockup, pan-India delivery.",
  products=["executive","essential","flask","sagebottle","roller","ropebottle"],
  body="<h2>Gifts your channel partners keep</h2><p>A dealer meet gift says how much you value the relationship. Practical engraved pieces, like an insulated flask, a quality pen or a full gift set, get used long after the event, unlike printed giveaways.</p>"
       "<h2>Plan your timeline</h2><ol><li><strong>About three weeks before</strong>: send your logo and headcount, and get a free mockup within 24 hours.</li><li><strong>After you approve</strong>: engraving usually takes 5–10 working days, depending on quantity and names.</li><li><strong>Delivery</strong>: courier transit is usually 3–7 working days. We confirm the dispatch date in writing before you pay.</li></ol><p>Need it sooner? Tell us your event date first and we'll tell you honestly whether we can make it.</p>"
       + GOOD(["Gift sets from 20 sets, flasks from 20, bottles and mugs from 10.","Attendee names on each piece: send the list and approve it before engraving.","Delivered to your office or to the venue address you give us.","Prices are all-inclusive: engraving, packing and taxes."])),
 dict(handle="corporate-gifts-under-500", title="Corporate Gifts Under ₹500",
  sub="Engraved gifts with your logo for budgets up to ₹500 per person, all-inclusive.",
  seo_t="Corporate Gifts Under ₹500 with Logo | Engraved Gifts India",
  seo_d="Engraved corporate gifts under ₹500 with your logo: keychains, pens, bottles, mugs and gift sets. All-inclusive prices, free mockup, delivered across India.",
  products=["leather","slimpen","classic","round","house","metalpen","goldpen","essential","roller","mug","flask","ropebottle","sagebottle","whitebottle"],
  body="<h2>How to choose within your budget</h2><ul><li><strong>Under ₹100</strong>: keychains, pens and the Essential pen-and-keychain gift set. Good for events, large teams and dealer counters.</li><li><strong>₹100 to ₹300</strong>: the magnetic roller pen in a gift case, coffee mugs, insulated flasks and the rope-handle bottle. Good for client and staff gifts.</li><li><strong>₹300 to ₹500</strong>: steel water bottles. Good for welcome kits and premium client gifts.</li></ul><p>Prices are per piece or per set and all-inclusive (engraving, packing and taxes); live prices are on the cards above. The Executive Gift Set (flask, pen and keychain in a gift box) sits just above this budget.</p>"
       "<h2>Make a modest budget feel generous</h2><ul><li>Add each person's name: it turns a simple item into a personal gift.</li><li>For clients, a boxed set usually lands better than a loose item.</li><li>Pair two smaller items, such as a pen and a mug, instead of one bigger one.</li></ul>"),
 dict(handle="trade", title="For Gifting Companies & Resellers",
  sub="An in-house laser engraving partner for corporate gifting companies, event agencies and print shops.",
  seo_t="Engraving Partner for Gifting Companies & Resellers | India",
  seo_d="Laser engraving partner for corporate gifting companies, event agencies and print shops. Your client, your brand, our engraving. Trade pricing on request.",
  products=["classic","metalpen","flask","sagebottle","mug","executive"],
  body="<h2>Your client, your brand, our engraving</h2><p>We run our own laser engraving workshop and work as a production partner for corporate gifting companies, event agencies, print shops and trophy shops. You look after the client; we engrave, check and pack. Ask us about unbranded packing and shipping straight to your client.</p>"
       "<h2>What partners get</h2><ul><li>Trade pricing on request, for repeat and larger orders.</li><li>Free digital mockups within 24 hours, ready to share with your client.</li><li>Low minimums: from 10 pieces on bottles and mugs, 25 on pens, 50 on keychains.</li><li>Names on each piece, approved by you before engraving.</li><li>Delivery across India, to you or to your client.</li></ul>"
       "<h2>Get the trade price list</h2><p>Message us on WhatsApp with your company name and the products you sell most, and we'll send our trade price list and sample options.</p>"),
]
def payload(pg):
    for k in ("seo_t","seo_d"): assert len(pg[k]) <= (70 if k=="seo_t" else 160), (pg["handle"], k, len(pg[k]))
    return {"title": pg["title"], "handle": pg["handle"], "body": pg["body"], "isPublished": True, "templateSuffix": "usecase",
            "metafields": [{"namespace":"custom","key":"subtitle","type":"single_line_text_field","value":pg["sub"]},
                           {"namespace":"custom","key":"products","type":"list.product_reference","value":json.dumps([f"gid://shopify/Product/{P[x]}" for x in pg["products"]])},
                           {"namespace":"global","key":"title_tag","type":"single_line_text_field","value":pg["seo_t"]},
                           {"namespace":"global","key":"description_tag","type":"multi_line_text_field","value":pg["seo_d"]}]}
if __name__ == "__main__":
    out = {f"p{i}": payload(pg) for i, pg in enumerate(PAGES)}
    json.dump(out, open(sys.argv[1], "w"), ensure_ascii=False)
    for pg in PAGES: print(pg["handle"], len(pg["seo_t"]), len(pg["seo_d"]), len(pg["body"]))
