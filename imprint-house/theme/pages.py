import json
WA="https://wa.me/919109535267?text=Hi%2C%20I%27d%20like%20a%20free%20sample%20with%20my%20logo"
CTA=f'<div class="ih-ctabox"><h3>Send us your logo. Get a free mockup in 24 hours.</h3><div style="display:flex;gap:.7rem;flex-wrap:wrap"><a class="btn b-brass" href="{WA}">WhatsApp us →</a><a class="btn b-ghost" href="/pages/get-a-quote">Request a quote</a></div></div>'
P={}
P["how-it-works"]=f"""<div class="ih"><div class="ih-lsteps">
<div><b>01</b><h3>Send us your logo</h3><p>WhatsApp it to +91 91095 35267 or use the quote form. Tell us roughly how many pieces and your budget per person.</p></div>
<div><b>02</b><h3>Free digital mockup in 24 hours</h3><p>See exactly how your logo will look on the product before you spend anything.</p></div>
<div><b>03</b><h3>A physical sample with your logo</h3><p>Hold it, check it, show it to your team. No commitment.</p></div>
<div><b>04</b><h3>Bulk order — packed and delivered</h3><p>Engraved in our own workshop, checked by hand, boxed, labelled and delivered on the date we agree.</p></div></div>
<div class="ih-box"><h3>Good to know</h3><ul><li>Minimum order: 50 pieces (or 50 kits)</li><li>Names, vehicle numbers or employee IDs can be engraved on each piece</li><li>All prices include GST; GST invoice provided</li><li>50% advance confirms a bulk order (full advance for first orders)</li></ul></div>{CTA}</div>"""
W=[("🚗","Car & bike dealerships","A metal key tag with your logo and each customer's vehicle number, handed over with every delivery. We can supply weekly from your delivery list."),
("🏢","Real estate developers","Engraved key tags for flat handovers that buyers keep for years."),
("🏨","Hotels & resorts","Room key tags and guest souvenirs with your property's logo — Ajmer & Pushkar."),
("🎓","Schools & coaching institutes","Awards and farewell gifts engraved with each student's name."),
("🩺","Clinics, hospitals & pharma","Metal pens and desk items for doctors, staff and partners."),
("🏭","Traders & manufacturers","Dealer-meet and client gifts for marble, textile and other trade businesses."),
("💍","Wedding planners","Bulk return gifts with the couple's names or monogram."),
("💼","Offices & startups","Onboarding kits, work anniversaries and team rewards.")]
P["who-we-work-with"]='<div class="ih"><p style="color:var(--muted);font-size:1.05rem;margin-bottom:1.8rem">Branded gifts for your business — starting from 50 pieces. For shops, clinics, cafés, schools, dealerships, startups and offices.</p><div class="ih-who">'+"".join(f'<div class="ih-w"><span class="ic">{i}</span><h4>{a}</h4><p>{b}</p></div>' for i,a,b in W)+'</div>'+CTA.replace("Send us your logo. Get a free mockup in 24 hours.","Not sure what fits your business? Ask us for ideas.")+'</div>'
P["our-story"]=f"""<div class="ih"><div style="max-width:760px"><blockquote style="font-family:Fraunces,Georgia,serif;font-style:italic;font-size:clamp(1.5rem,3vw,2.2rem);line-height:1.25;margin:0 0 1.6rem">"Branded gifts kept fading, peeling and getting thrown away. So we brought a laser home."</blockquote>
<p style="color:var(--muted);font-size:1.05rem;margin-bottom:1rem">We're a family business from Ajmer. We brought a precision laser in-house because engraving doesn't fade — it's cut into the metal.</p>
<p style="color:var(--muted);font-size:1.05rem;margin-bottom:1rem">Every piece is made in our own workshop, checked by family, and sampled before you commit.</p>
<p style="color:var(--muted);font-size:1.05rem">[ADD ONE REAL DETAIL: who in the family runs the workshop, and why you started.]</p></div>
<div class="ih-trust" style="margin-top:2.4rem"><div><b>01 · See it before you pay</b><p>A free sample with your logo.</p></div><div><b>02 · Made in our own workshop</b><p>No outsourcing — quality and timing stay in our control.</p></div><div><b>03 · Ready to hand over</b><p>Packaged, labelled and delivered on time.</p></div><div><b>04 · Built to last</b><p>Engraving that doesn't fade, peel or wash off.</p></div></div>{CTA}</div>"""
P["get-a-quote"]=f"""<div class="ih"><div class="ih-ctabox" style="margin-top:0"><h3>Fastest way: send your logo on WhatsApp.</h3><a class="btn b-brass" href="{WA}">WhatsApp +91 91095 35267 →</a></div>
<div class="ih-box"><h3>Or fill the form below — please include</h3><ul><li>Your business name</li><li>The product or package you like</li><li>Rough quantity (minimum 50)</li><li>Budget per person</li><li>The date you need it by</li></ul></div></div>"""
F=[("What is the minimum order?","50 pieces (or 50 kits)."),("Can I see a sample first?","Yes. We send a free digital mockup within 24 hours, and then a physical sample with your logo."),("Can you engrave each person's name?","Yes — names, vehicle numbers or IDs on every piece. We'll ask you to approve the name list in writing before engraving."),("Do prices include GST?","Yes, all prices include GST, and we provide a GST invoice."),("How do I pay?","A 50% advance confirms a bulk order; first-time orders are paid fully in advance."),("Can you print in colour?","Our laser engraving is single-tone and permanent. For full-colour logos, ask us — we can arrange it."),("How long does it take?","Usually 5–10 working days after sample approval, depending on quantity. We'll confirm a date before you order."),("Do you deliver outside Ajmer?","Yes, we deliver across India.")]
P["faq"]='<div class="ih"><div class="ih-faq" style="max-width:820px">'+"".join(f'<details{" open" if i==0 else ""}><summary>{q}</summary><p>{a}</p></details>' for i,(q,a) in enumerate(F))+'</div>'+CTA.replace("Send us your logo. Get a free mockup in 24 hours.","Still have a question? Ask us on WhatsApp.")+'</div>'
json.dump(P,open("pages.json","w"),ensure_ascii=False)
