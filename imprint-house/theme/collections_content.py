# Collection intros + SEO (source of truth). The lead is the collection description (shown in the banner);
# the body goes to metafield custom.intro_html and renders under the product grid.
import json,sys
HOW = ('<h2>How ordering works</h2><ol><li>Send your logo on WhatsApp, or <a href="/pages/3d-designer">preview it in 3D</a> first.</li>'
       '<li>Get a free digital mockup within 24 hours.</li><li>Approve it. Nothing is engraved before you do.</li>'
       '<li>We engrave, pack and deliver across India, usually 5–10 working days after approval.</li></ol>')
NAMES = '<p>Want each person\'s name, vehicle number or employee ID on every piece? Send us the list and we\'ll ask you to approve it before engraving.</p>'
C = {
"keychains": dict(
  lead="Metal and leather keychains laser-engraved with your logo, plus each customer's name or vehicle number if you like. Minimum order 50 pieces.",
  body='<h2>Which keychain suits you</h2><ul>'
       '<li><strong>Classic rectangle, polished metal</strong>: the all-rounder for dealerships, hotels and offices.</li>'
       '<li><strong>Round, polished metal</strong>: a clean, premium look for events and staff gifts.</li>'
       '<li><strong>House-shaped, polished metal</strong>: made for <a href="/pages/real-estate-handover-gifts">real estate handovers</a> and housewarming gifts.</li>'
       '<li><strong>Tan leather</strong>: a warmer look, popular with <a href="/pages/dealership-gifts">car and bike dealerships</a>.</li></ul>'
       '<h2>Minimum order and delivery</h2><p>Minimum order 50 keychains. Free delivery on 100+ keychains, ₹99 below that. Prices are all-inclusive: engraving, packing and taxes. Want to hold one first? Order a single engraved sample from any product page.</p>'
       + NAMES + HOW,
  seo_t="Custom Logo Keychains | Engraved Metal & Leather Keychains India",
  seo_d="Metal and leather keychains laser-engraved with your logo, customer names or vehicle numbers. For dealerships, real estate and offices. Min 50, free mockup."),
"pens": dict(
  lead="Metal, roller and slim stylus pens laser-engraved with your logo or each person's name. The engraving won't fade or rub off. Minimum order 25 pens.",
  body='<h2>Which pen suits you</h2><ul>'
       '<li><strong>Black metal ball pen</strong>: weighty, with chrome accents. The desk favourite.</li>'
       '<li><strong>Soft-touch pen with gold or rose-gold trim</strong>: a premium feel, with a stylus tip for phone and tablet screens.</li>'
       '<li><strong>Slim stylus pen</strong>: light and sleek, the best value for events, seminars and large staff orders.</li>'
       '<li><strong>Magnetic-cap roller pen in a gift case</strong>: ready to gift, popular for <a href="/pages/doctor-clinic-gifts">doctors</a>, clients and awards.</li></ul>'
       '<h2>Minimum order and delivery</h2><p>Minimum order 25 pens. Metal, soft-touch and slim pens ship free on 50+ pens (₹99 below that); roller pens ship free on every bulk order. Prices are all-inclusive: engraving, packing and taxes.</p>'
       + NAMES + HOW,
  seo_t="Engraved Pens with Logo | Custom Corporate Pens India",
  seo_d="Metal, roller and slim stylus pens laser-engraved with your logo or names. From 25 pens, all-inclusive prices, free digital mockup, delivered across India."),
"bottles-drinkware": dict(
  lead="Steel bottles, insulated flasks and coffee mugs engraved with your logo or each person's name. Used every day, so your brand is seen every day. Minimum order from 10 pieces.",
  body='<h2>What\'s available</h2><ul>'
       '<li><strong>Insulated steel flask</strong> in black, blue or red: minimum 20.</li>'
       '<li><strong>Sage insulated bottle</strong> with a rose-gold cap and carry strap: minimum 10.</li>'
       '<li><strong>Matte black bottle with a rope handle</strong>: minimum 10.</li>'
       '<li><strong>Matte white steel bottle</strong>: minimum 10.</li>'
       '<li><strong>Double-wall steel coffee mug</strong> in navy or black: minimum 10.</li></ul>'
       '<h2>Delivery</h2><p>Flasks, the sage bottle and mugs ship free on every bulk order. The rope-handle and white bottles ship free on 25+ pieces (₹99 below that). Prices are all-inclusive: engraving, packing and taxes.</p>'
       '<p>Engraving goes through the coating to the steel, so it won\'t wash off. Hand wash recommended.</p>'
       + NAMES + HOW,
  seo_t="Engraved Bottles, Flasks & Mugs with Logo | Corporate Drinkware India",
  seo_d="Steel bottles, insulated flasks and coffee mugs engraved with your logo or names. From 10 pieces, all-inclusive prices, free mockup, delivered across India."),
"ready-gift-packages": dict(
  lead="Ready corporate gift sets engraved with your logo, boxed and delivered ready to hand over. Priced per set, all-inclusive. Minimum from 20 sets.",
  body='<h2>The sets</h2><ul>'
       '<li><strong>Essential Gift Set</strong>: engraved pen and keychain in a black gift box. Minimum 25 sets, free delivery on 40+ sets.</li>'
       '<li><strong>Executive Gift Set</strong>: insulated flask, pen and keychain in a black gift box, in black, red or blue. Minimum 20 sets, free delivery on bulk orders.</li>'
       '<li><strong>Your own set</strong>: mix pens, keychains, bottles and mugs. Tell us your budget per set on WhatsApp and we\'ll put one together.</li></ul>'
       '<h2>Popular for</h2><p><a href="/pages/employee-welcome-kits">Employee welcome kits</a>, <a href="/pages/dealer-meet-gifts">dealer and distributor meets</a>, year-end and New Year gifting, and client thank-yous. Working to a budget? See <a href="/pages/corporate-gifts-under-500">corporate gifts under ₹500</a>.</p>'
       + NAMES + HOW,
  seo_t="Corporate Gift Sets with Logo | Engraved Gift Boxes India",
  seo_d="Corporate gift sets engraved with your logo: pen & keychain sets and flask gift boxes, all-inclusive, priced per set. From 20 sets. Free mockup in 24 hrs."),
}
IDS = {"keychains":"gid://shopify/Collection/302119125053","pens":"gid://shopify/Collection/302119157821",
       "bottles-drinkware":"gid://shopify/Collection/302119223357","ready-gift-packages":"gid://shopify/Collection/302119092285"}
if __name__ == "__main__":
    out = {}
    for i,(h,c) in enumerate(C.items()):
        assert len(c["seo_t"]) <= 70 and len(c["seo_d"]) <= 160, (h, len(c["seo_t"]), len(c["seo_d"]))
        out[f"c{i}"] = {"id": IDS[h], "descriptionHtml": f"<p>{c['lead']}</p>", "seo": {"title": c["seo_t"], "description": c["seo_d"]},
                        "metafields": [{"namespace": "custom", "key": "intro_html", "type": "multi_line_text_field", "value": c["body"]}]}
    json.dump(out, open(sys.argv[1], "w"), ensure_ascii=False)
    print(json.dumps(out, ensure_ascii=False))
