import json
SHA="9712011025f5c338bfc0ea6073cb2b799cc55e81"
U=lambda f:f"https://raw.githubusercontent.com/ammarrramlawalaaa/reviewbuddie2/{SHA}/imprint-house/product-photos/{f}"
WA="https://wa.me/919109535267?text=Hi%2C%20I%27d%20like%20a%20quote"
def table(pp,unit="piece"):
    rows=[(50,99,pp),(100,249,round(pp*0.9)),(250,499,round(pp*0.82)),(500,None,None)]
    h=f"<table><tr><th>Quantity</th><th>Price per {unit}</th></tr>"
    for a,b,p in rows: h+=f"<tr><td>{f'{a}–{b}' if b else f'{a}+'}</td><td>{'₹'+format(p,',') if p else 'Request a quote'}</td></tr>"
    return h+"</table><p><em>All prices include GST. Indicative pricing — final quote depends on quantity and engraving.</em></p>"
HOW="<h3>How ordering works</h3><ol><li>Send us your logo on WhatsApp (or <a href=\"/pages/3d-designer\">design it in 3D</a> first)</li><li>Free digital mockup within 24 hours</li><li>Approve the mockup &mdash; or order one paid sample first if you'd like to hold it</li><li>Bulk order, engraved, packed and delivered</li></ol>"
def desc(intro,bullets,pp,unit="piece",extra=""):
    return f"<p>{intro}</p><h3>Why businesses choose it</h3><ul>{''.join(f'<li>{b}</li>' for b in bullets)}</ul>{extra}<h3>Starting from ₹{pp:,} per {unit}</h3>{table(pp,unit)}{HOW}<p><a href=\"{WA}\">Get a quote on WhatsApp</a></p>"
def files(lst): return [{"originalSource":U(f),"alt":a,"contentType":"IMAGE"} for f,a in lst]
def variants(colours,sp,bulk,sku,unitlbl=("Sample — 1 piece with your logo","Bulk pack — 50 pieces")):
    v=[]
    for c in colours:
        for lbl,price,s in [(unitlbl[0],sp,"S"),(unitlbl[1],bulk,"50")]:
            ov=([{"optionName":"Colour","name":c}] if c else [])+[{"optionName":"Order type","name":lbl}]
            v.append({"optionValues":ov,"price":f"{price:.2f}","sku":f"{sku}-{(c or '')[:3].upper()+'-' if c else ''}{s}","inventoryPolicy":"CONTINUE"})
    return v
def opts(colours,unitlbl=("Sample — 1 piece with your logo","Bulk pack — 50 pieces")):
    o=[]
    if colours: o.append({"name":"Colour","values":[{"name":c} for c in colours]})
    o.append({"name":"Order type","values":[{"name":x} for x in unitlbl]}); return o
KIT=("Sample kit — 1 set","Bulk — 50 kits")
P={}
P["essential"]={"id":"gid://shopify/Product/8101130993725","input":{
 "title":"Essential Gift Set — Engraved Pen & Keychain (Under ₹300)","productType":"Package","vendor":"The Imprint House",
 "tags":["package","essential","pen-keychain-set","corporate-gift-set","staff-gift"],
 "descriptionHtml":desc("<strong>What's inside:</strong> A metal ball pen and a metal keychain, both laser-engraved with your company logo, presented in a black gift box with a foam insert. Our most popular corporate gift set for staff, clients, dealers and events.",
   ["Pen and keychain engraved with your logo — permanent, will not fade or peel","Premium black gift box with foam insert, ready to hand over","Available in black, silver or blue pen finishes","Add each recipient's name at no extra design cost","Ideal for Diwali, New Year, onboarding kits, dealer meets and conferences"],249,"kit",
   "<p><strong>Best for:</strong> Staff gifts, festival gifts, client thank-yous, event giveaways. Minimum order 50 kits.</p>"),
 "seo":{"title":"Engraved Pen & Keychain Gift Set with Logo | Corporate Gifts India","description":"Corporate pen and keychain gift set, laser-engraved with your logo in a black gift box. From ₹249 per set incl. GST. Min 50 sets, free digital mockup, delivered across India."},
 "productOptions":opts(["Black","Silver","Blue"],KIT),"variants":variants(["Black","Silver","Blue"],399,12450,"ESSENTIALG",KIT),
 "files":files([("pen-keychain-set-black-gift-box.jpg","Engraved pen and keychain corporate gift set in black gift box"),("pen-keychain-set-black-open-box.jpg","Black pen and keychain gift set with logo engraving"),("pen-keychain-set-black-desk.jpg","Logo engraved pen and keychain gift box on office desk"),("engraved-pen-keychain-closeup.jpg","Close-up of laser engraved logo on metal pen and keychain"),("pen-keychain-set-silver-gift-box.jpg","Silver pen and keychain engraved corporate gift set"),("pen-keychain-set-silver-closeup.jpg","Close-up of engraved silver pen and black keychain"),("pen-keychain-set-blue-gift-box.jpg","Blue pen and keychain engraved gift set in black box"),("pen-keychain-set-black-real.jpg","Black pen and keychain gift set — actual product photo"),("pen-keychain-set-silver-real.jpg","Silver pen and keychain gift set — actual product photo")])}}
P["executive"]={"id":"gid://shopify/Product/8101131026493","input":{
 "title":"Executive Gift Set — Insulated Flask, Pen & Keychain (Under ₹600)","productType":"Package","vendor":"The Imprint House",
 "tags":["package","executive","flask-gift-set","corporate-gift-set","client-gift"],
 "descriptionHtml":desc("<strong>What's inside:</strong> A stainless steel insulated flask, a metal pen and a metal keychain — each engraved with your company logo — in a premium black gift box. A 3-in-1 corporate gift set that people use every day.",
   ["Double-wall stainless steel flask keeps drinks hot or cold","Logo engraved on the flask, pen and keychain","Choose black or red to match your brand","Premium black gift box with fitted insert","Ideal for client gifts, onboarding kits, dealer meets and awards"],549,"kit",
   "<p><strong>Best for:</strong> Client gifts, new-joiner welcome kits, dealer and distributor meets. Minimum order 50 kits.</p>"),
 "seo":{"title":"Flask, Pen & Keychain Corporate Gift Set with Logo | 3-in-1 Gift Box","description":"3-in-1 corporate gift set: insulated steel flask, pen and keychain engraved with your logo, in a black gift box. From ₹549 incl. GST. Min 50 sets, free digital mockup."},
 "productOptions":opts(["Black","Red"],KIT),"variants":variants(["Black","Red"],699,27450,"EXECUTIVEG",KIT),
 "files":files([("flask-pen-keychain-gift-set-black.jpg","Black flask, pen and keychain corporate gift set with engraved logo"),("flask-pen-keychain-gift-set-red.jpg","Red flask, pen and keychain engraved corporate gift set"),("flask-pen-keychain-gift-set-black-desk.jpg","3-in-1 flask pen keychain gift box on office desk")])}}
P["roller"]={"id":None,"input":{
 "title":"Matte Roller Pen in Gift Case — Engraved with Your Logo","handle":"matte-roller-pen-gift-case","productType":"Pen","vendor":"The Imprint House","status":"DRAFT",
 "tags":["pen","roller-pen","premium","gift-case","corporate-pen"],
 "descriptionHtml":desc("A two-tone matte metal roller pen in terracotta and teal, laser-engraved with your company name or logo and presented in a clear gift case with a red velvet insert. Smooth writing, modern look — a pen people actually keep.",
   ["Soft-touch matte finish with knurled grip ring","Your logo or name engraved on the barrel","Clear presentation case with red insert — ready to gift","Great for doctors, teachers, sales teams and event delegates","Name personalisation available on every piece"],120),
 "seo":{"title":"Engraved Roller Pen with Logo in Gift Case | Custom Corporate Pens","description":"Matte metal roller pen laser-engraved with your logo, in a clear gift case. From ₹120 per pen incl. GST. Min 50 pens, free digital mockup, delivered across India."},
 "productOptions":opts([]),"variants":variants([None],199,6000,"ROLLERPEN"),
 "files":files([("matte-roller-pen-gift-case-1.jpg","Engraved matte roller pen with clear gift case"),("matte-roller-pen-gift-case-2.jpg","Close-up of laser engraved logo on matte roller pen"),("matte-roller-pen-gift-case-3.jpg","Roller pen with cap off showing engraved name"),("matte-roller-pen-gift-case-4.jpg","Engraved roller pen in clear presentation case"),("matte-roller-pen-gift-case-real.jpg","Matte roller pen and gift case — actual product photo"),("matte-roller-pen-open-real.jpg","Roller pen with cap removed — actual product photo")])}}
P["mug"]={"id":None,"input":{
 "title":"Double-Wall Steel Coffee Mug — Engraved with Your Logo","handle":"steel-coffee-mug-logo","productType":"Drinkware","vendor":"The Imprint House","status":"DRAFT",
 "tags":["mug","coffee-mug","steel","drinkware","corporate-mug"],
 "descriptionHtml":desc("A double-wall stainless steel coffee mug with a powder-coated finish and polished steel rim, laser-engraved with your company logo. Sits on every desk and gets used every day — so your brand is seen every day.",
   ["Double-wall stainless steel — keeps tea and coffee warm, cool to hold","Powder-coated finish in navy blue or black","Logo engraved through the coating to bright steel — will not wash off","Comfortable handle, office-desk size","Perfect for employee welcome kits and client desks"],220),
 "seo":{"title":"Custom Logo Steel Coffee Mug | Engraved Corporate Mugs India","description":"Double-wall stainless steel coffee mug engraved with your logo, in blue or black. From ₹220 per mug incl. GST. Min 50 mugs, free digital mockup, delivered across India."},
 "productOptions":opts(["Blue","Black"]),"variants":variants(["Blue","Black"],349,11000,"STEELMUG"),
 "files":files([("steel-coffee-mug-blue-logo.jpg","Navy blue double-wall steel coffee mug with engraved logo"),("steel-coffee-mug-black-logo.jpg","Black double-wall steel coffee mug with engraved logo")])}}
json.dump(P,open("prods.json","w"),ensure_ascii=False)
for k,v in P.items(): print(k,len(json.dumps(v,ensure_ascii=False)), len(v["input"]["variants"]))
Q={}
Q["key"]={"title":"Engraved Metal Keychain with Logo — Classic Rectangle","descriptionHtml":desc("A solid metal keychain with a glossy black face and polished chrome frame, laser-engraved with your company logo. The engraving is cut into the surface — it will not fade, peel or rub off, so your brand stays on your customer's keys for years.",["Heavy zinc-alloy body with chrome-polished edge","Logo engraved in bright silver on a black face","Add each customer's name, vehicle number or ID","Perfect for car & bike dealerships, real estate handovers and hotels","Gift box available on request"],45),"seo":{"title":"Custom Engraved Metal Keychain with Logo | Corporate Keychains India","description":"Metal keychain laser-engraved with your logo or customer's name. From ₹45 per piece incl. GST. Min 50 pieces, free digital mockup, delivered across India."},"files":files([("engraved-metal-keychain-logo.jpg","Black metal keychain laser engraved with company logo"),("engraved-metal-keychain-rectangle.jpg","Rectangle metal keychain with engraved logo")])}
Q["pen"]={"title":"Engraved Black Metal Ball Pen with Logo","descriptionHtml":desc("A weighty matte-black metal ball pen with chrome accents, laser-engraved with your company name or logo. Smooth writing and a premium feel — the kind of branded pen people keep on their desk.",["Matte black metal barrel with chrome clip and tip","Logo or name engraved in silver — permanent","Twist action, smooth blue ink refill","Ideal for clinics, offices, conferences and dealer meets","Can be paired with a keychain in a gift box"],80),"seo":{"title":"Engraved Metal Pen with Logo | Custom Corporate Pens India","description":"Black metal ball pen laser-engraved with your logo or name. From ₹80 per pen incl. GST. Min 50 pens, free digital mockup, delivered across India."},"files":files([("engraved-black-metal-pen.jpg","Black metal ball pen laser engraved with company name"),("engraved-pen-keychain-closeup.jpg","Close-up of engraved logo on black metal pen")])}
Q["bottle"]={"title":"Insulated Steel Water Bottle — Name or Logo Engraved","descriptionHtml":desc("A double-wall stainless steel bottle with a soft matte finish, rose-gold cap and carry strap, laser-engraved with a name or your company logo. Keeps drinks hot or cold for hours — a gift that gets used every single day.",["Double-wall vacuum insulated stainless steel","Shown in sage green with rose-gold accents","Engrave each recipient's name or your logo","Leak-proof cap with carry strap","Great for employee welcome kits, awards and wedding return gifts"],350),"seo":{"title":"Personalised Engraved Steel Water Bottle | Corporate & Name Bottles","description":"Insulated steel water bottle engraved with a name or your logo. From ₹350 per bottle incl. GST. Min 50 pieces, free digital mockup, delivered across India."},"files":files([("name-engraved-steel-bottle-sage.jpg","Sage green insulated steel bottle engraved with a name")])}
json.dump(Q,open("prods2.json","w"),ensure_ascii=False)
