import json, re, sys, os
SP="/tmp/claude-0/-home-user-reviewbuddie2/13fb6bb1-3703-5537-a370-eed2c2e2af05/scratchpad"
OUT=sys.argv[1]; os.makedirs(OUT,exist_ok=True)
WA="https://wa.me/919109535267?text=Hi%2C%20I%27d%20like%20a%20quote%20for%20engraved%20gifts%20with%20my%20logo"
def load(p): return json.loads(re.sub(r'^/\*.*?\*/','',open(p).read(),flags=re.S))
v2=open(SP+"/v2/gen.py").read()
BASE=re.search(r'CSS = """(.*?)"""',v2,re.S).group(1)  # fonts link + .ih css
EXTRA="""<style>
:root{--font-heading--family:Fraunces,Georgia,serif;--font-body--family:Inter,system-ui,sans-serif;--font-subheading--family:Inter,system-ui,sans-serif}
body{font-family:Inter,system-ui,sans-serif}
main h1,main h2{font-family:Fraunces,Georgia,serif!important;letter-spacing:-.02em;font-weight:600}
main h4{font-family:Fraunces,Georgia,serif}
.button,button.button,a.button{border-radius:999px!important}
main table{width:100%;border-collapse:collapse;margin:.8rem 0 1rem;font-size:.92rem}
main th,main td{border-bottom:1px solid #e4e0d8;padding:.65rem .4rem;text-align:left}
main th{font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:#6b6b6b;font-weight:600}
main tr:nth-child(2) td{font-weight:600}
main a[href*="wa.me"]:not(.btn){display:inline-flex;align-items:center;gap:.4rem;background:#25D366;color:#fff!important;padding:.8rem 1.4rem;border-radius:999px;font-weight:600;text-decoration:none!important;margin-top:.4rem}
main ol li,main ul li{margin-bottom:.35rem}
/* page components */
.ih-band{background:var(--ink,#16181a);color:#fff;padding:clamp(3rem,7vw,5.5rem) 0;position:relative;overflow:hidden}
.ih-band:after{content:"";position:absolute;right:-120px;top:-120px;width:380px;height:380px;border-radius:50%;border:1px solid rgba(184,146,90,.35)}
.ih-band h1{font-family:Fraunces,Georgia,serif;font-weight:600;font-size:clamp(2.3rem,5.5vw,4.2rem);line-height:1;letter-spacing:-.03em;margin:1rem 0 1rem;color:#fff}
.ih-band p{color:#c4c4c4;max-width:620px;font-size:1.05rem}
.ih-band .crumb{font-size:.8rem;color:#8d8d8d;margin-bottom:.6rem}.ih-band .crumb a{color:#8d8d8d}
.ih-chips{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:1.6rem}.ih-chips span{border:1px solid rgba(255,255,255,.22);border-radius:99px;padding:.45rem .9rem;font-size:.8rem;color:#e6e6e6}
.ih-lsteps{display:grid;gap:16px;margin:1rem 0 2.5rem}@media(min-width:750px){.ih-lsteps{grid-template-columns:repeat(2,1fr)}}
.ih-lsteps div{border:1px solid var(--line);border-radius:18px;padding:1.6rem;background:#fff}
.ih-lsteps b{font-family:Fraunces,Georgia,serif;font-size:2.4rem;color:var(--brass);line-height:1;display:block}
.ih-lsteps h3{font-family:Fraunces,Georgia,serif;font-size:1.3rem;margin:.8rem 0 .4rem}.ih-lsteps p{color:var(--muted)}
.ih-box{background:var(--paper);border-radius:20px;padding:clamp(1.4rem,3vw,2.2rem);margin:1.5rem 0}
.ih-box h3{font-family:Fraunces,Georgia,serif;font-size:1.4rem;margin:0 0 .8rem}
.ih-box ul{margin:0;padding-left:1.1rem;color:var(--muted)}
.ih-faq details{border-bottom:1px solid var(--line);padding:1.2rem 0}
.ih-faq summary{cursor:pointer;font-family:Fraunces,Georgia,serif;font-size:1.2rem;font-weight:600;list-style:none;display:flex;justify-content:space-between;gap:1rem}
.ih-faq summary::-webkit-details-marker{display:none}.ih-faq summary:after{content:"+";color:var(--brass);font-size:1.5rem;line-height:1;transition:transform .3s}
.ih-faq details[open] summary:after{transform:rotate(45deg)}.ih-faq details p{color:var(--muted);margin-top:.7rem}
.ih-ctabox{background:var(--ink);color:#fff;border-radius:22px;padding:clamp(1.8rem,4vw,3rem);margin-top:2.5rem;display:flex;flex-wrap:wrap;gap:1.4rem;align-items:center;justify-content:space-between}
.ih-ctabox h3{font-family:Fraunces,Georgia,serif;font-size:clamp(1.4rem,3vw,2rem);margin:0;color:#fff;max-width:520px}
.ih-trust{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--line);border:1px solid var(--line);border-radius:18px;overflow:hidden}@media(min-width:900px){.ih-trust{grid-template-columns:repeat(4,1fr)}}
.ih-trust div{background:#fff;padding:1.4rem}.ih-trust b{font-family:Fraunces,Georgia,serif;font-size:1.1rem;display:block;margin-bottom:.3rem}.ih-trust p{color:var(--muted);font-size:.88rem}
.ih-foot{background:#16181a;color:#cfcfcf;padding:clamp(3rem,6vw,4.5rem) 0 2rem}
.ih-foot .cols{display:grid;gap:2.2rem}@media(min-width:900px){.ih-foot .cols{grid-template-columns:1.6fr 1fr 1fr 1.2fr}}
.ih-foot h5{color:#fff;font-size:.75rem;letter-spacing:.16em;text-transform:uppercase;margin:0 0 1rem;font-family:Inter,sans-serif}
.ih-foot a{color:#cfcfcf;display:block;margin-bottom:.55rem;font-size:.93rem}.ih-foot a:hover{color:var(--brass2)}
.ih-foot .logo{font-family:Fraunces,Georgia,serif;font-size:1.9rem;color:#fff;font-weight:600;letter-spacing:-.02em}
.ih-foot .tl{color:#9a9a9a;margin:.6rem 0 1.4rem;max-width:320px;font-size:.93rem;line-height:1.6}
/* header: charcoal + brass, matches the hero */
.announcement-bar,.announcement-bar *{color:#16181a!important}
.announcement-bar__slides{font-weight:500;letter-spacing:.02em}
.menu-list__link-title{letter-spacing:.02em;font-weight:500;transition:color .2s}
.menu-list .menu-list__list-item:hover .menu-list__link-title{color:#d9b98a}
.menu-list__link[href="/pages/3d-designer"] .menu-list__link-title{background:#b8925a;color:#16181a!important;border-radius:999px;padding:.5rem 1rem;margin-inline:.25rem;font-weight:600}
.menu-list__link[href="/pages/3d-designer"]:hover .menu-list__link-title{background:#d9b98a}
.menu-list__submenu .mega-menu__link{color:#f3eadf}.menu-list__submenu .mega-menu__link:hover{color:#d9b98a}
/* per-piece price + mockup-first note on product pages */
.ih-unit{font-size:.55em;font-weight:500;color:#6b6b6b;letter-spacing:0}
.ih-per{display:block;font-size:.82rem;color:#6b6b6b;margin-top:.3rem;font-weight:500;letter-spacing:0}
product-card .ih-per,.product-card .ih-per{font-size:.75rem;margin-top:.15rem}
.ih-mock{display:block;margin-top:1rem;padding:.85rem 1rem;border:1px solid #e4e0d8;border-radius:12px;background:#f7f5f1;font-size:.88rem;line-height:1.5;color:#16181a;font-weight:400}
.ih-mock a{display:inline-block;margin-top:.35rem;font-weight:600;color:#16181a;text-decoration:underline}
/* the built-in recommendations block shows nothing yet; our own product grid sits below instead */
[id*="__product_recommendations_"]{display:none!important}
/* real product photos strip */
.ih-proof{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}@media(min-width:900px){.ih-proof{grid-template-columns:repeat(4,1fr);gap:20px}}
.ih-proof figure{margin:0}.ih-proof img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:16px;display:block;background:#eee}
.ih-proof figcaption{font-size:.82rem;color:var(--muted);margin-top:.55rem;line-height:1.45}
/* quote form */
.ih-form{display:grid;gap:14px;max-width:760px}@media(min-width:750px){.ih-form{grid-template-columns:1fr 1fr}.ih-form .full{grid-column:1/-1}}
.ih-form label{display:block;font-size:.78rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-bottom:.35rem}
.ih-form input,.ih-form select,.ih-form textarea{width:100%;padding:.85rem 1rem;border:1px solid #cfc9bd;border-radius:12px;font:inherit;font-size:1rem;background:#fff;color:var(--ink)}
.ih-form textarea{min-height:120px;resize:vertical}
.ih-form .note{font-size:.85rem;color:var(--muted)}
.ih-form button{border:0;cursor:pointer;font-family:inherit}
.ih-ok{background:#eef6ef;border:1px solid #bfe0c4;border-radius:14px;padding:1.2rem 1.4rem;margin-bottom:1.4rem}
.ih-err{background:#fbeeee;border:1px solid #e8c3c3;border-radius:14px;padding:1rem 1.2rem;margin-bottom:1.2rem}
</style>"""
GLOBAL = BASE + EXTRA + """<script>(function(){function pub(n,d){try{if(window.Shopify&&Shopify.analytics&&Shopify.analytics.publish){Shopify.analytics.publish(n,d)}}catch(e){}}
document.addEventListener('click',function(e){var a=e.target&&e.target.closest?e.target.closest('a[href*="wa.me"]'):null;if(a){pub('whatsapp_click',{page:location.pathname,label:(a.textContent||'').trim().slice(0,60)})}},true);
(function(){var last=0;function q(){return document.querySelector('main input[name="quantity"]')}function apply(){var m=document.querySelector('.ih-moq[data-moq]'),n=m?parseInt(m.getAttribute('data-moq'),10)||0:0,i=q();if(!i)return;if(n>1){i.min=n;if((parseInt(i.value,10)||0)<n)i.value=n}else{i.min=1;if(last>1&&(parseInt(i.value,10)||0)===last)i.value=1}last=n}document.addEventListener('DOMContentLoaded',apply);document.addEventListener('change',function(e){if(e.target&&e.target.closest&&e.target.closest('variant-picker'))setTimeout(apply,700)},true);document.addEventListener('click',function(e){var b=e.target&&e.target.closest?e.target.closest('button[name="add"],.add-to-cart-button,[ref="addToCartButton"]'):null;if(!b)return;var m=document.querySelector('.ih-moq[data-moq]'),n=m?parseInt(m.getAttribute('data-moq'),10)||0:0,i=q();if(n>1&&i&&(parseInt(i.value,10)||0)<n){i.value=n;i.dispatchEvent(new Event('change',{bubbles:true}));var t=document.querySelector('.ih-moq-msg');if(t)t.hidden=false}},true);setTimeout(apply,1500)})();
document.addEventListener('submit',function(e){var f=e.target;if(f&&f.tagName==='FORM'&&/\/contact/.test(f.getAttribute('action')||'')){pub('quote_form_submit',{page:location.pathname})}},true);})();</script>"""

# ---- header group: add global style section
hg=json.load(open(SP+"/../../../../../home/user/reviewbuddie2/imprint-house/theme/header-group.json")) if False else json.load(open("/home/user/reviewbuddie2/imprint-house/theme/header-group.json"))
hg["sections"]["ih_global"]={"type":"custom-liquid","settings":{"custom_liquid":GLOBAL,"background_color":"","section_width":"full-width","padding-block-start":0,"padding-block-end":0}}
hg["order"]=[o for o in hg["order"] if o!="ih_global"]+["ih_global"]
json.dump(hg,open(OUT+"/header-group.json","w"),ensure_ascii=False,separators=(',',':'))

# ---- collection banner
cb="""<div class="ih"><section class="ih-band"><div class="wrap"><div class="crumb"><a href="/">Home</a> / <a href="/collections/all">Products</a></div><span class="eb">The Imprint House</span>
<h1>{{ collection.title | default: 'All products' }}</h1>{% if collection.description != blank %}<p>{{ collection.description | strip_html }}</p>{% else %}<p>Laser-engraved with your logo in our own workshop. Free digital mockup before you order.</p>{% endif %}
<div class="ih-chips"><span>Bulk orders from 10 pieces</span><span>Free digital mockup in 24 hrs</span><span>Try it in 3D</span><span>Prices incl. GST</span></div></div></section></div>"""
col=load(SP+"/orig_templates_collection.json")
col["sections"]={"ih_banner":{"type":"custom-liquid","settings":{"custom_liquid":cb,"background_color":"","section_width":"full-width","padding-block-start":0,"padding-block-end":0}}, **{k:v for k,v in col["sections"].items() if k!="section"}}
col["sections"]["main"]["settings"]["padding-block-start"]=40
col["order"]=["ih_banner","main"]
json.dump(col,open(OUT+"/collection.json","w"),ensure_ascii=False,separators=(',',':'))

# ---- page hero
SUB={"how-it-works":"From your logo to a finished gift — with zero risk.","who-we-work-with":"Gift ideas built for your kind of business.","our-story":"A family-run workshop, engraving gifts that last.","get-a-quote":"Send your logo. Get a free mockup within 24 hours.","faq":"Everything you need to know before you order.","contact":"We usually reply on WhatsApp within a few hours."}
case="".join(f"{{% when '{k}' %}}{v}" for k,v in SUB.items())
ph=f"""<div class="ih"><section class="ih-band"><div class="wrap"><span class="eb">The Imprint House</span><h1>{{{{ page.title }}}}</h1><p>{{% case page.handle %}}{case}{{% else %}}Laser-engraved corporate gifts, delivered across India.{{% endcase %}}</p></div></section></div>"""
pg=load(SP+"/orig_templates_page.json")
m=pg["sections"]["main"]; m["blocks"].pop("heading"); m["block_order"]=["page-content"]; m["settings"]["padding-block-start"]=56
pg["sections"]={"ih_hero":{"type":"custom-liquid","settings":{"custom_liquid":ph,"background_color":"","section_width":"full-width","padding-block-start":0,"padding-block-end":0}},"main":m}
pg["order"]=["ih_hero","main"]
json.dump(pg,open(OUT+"/page.json","w"),ensure_ascii=False,separators=(',',':'))
# contact template too
pc=json.loads(json.dumps(pg)); json.dump(pc,open(OUT+"/page.contact.base.json","w"))

# ---- footer group
MORE = """<div class="ih"><section class="ih-sec" style="background:#fff;padding-bottom:0"><div class="wrap"><div class="ih-head" style="margin-bottom:1.6rem"><div><span class="eb">From our workshop</span><h2>More engraved gifts</h2></div><p>Every piece engraved with your logo. Low minimums, free digital mockup first.</p></div><div class="ih-pg">{%- assign ih_items = collections['all'].products | sort: 'price' -%}{%- assign ih_shown = 0 -%}{%- for p in ih_items -%}{%- if p.id == product.id or ih_shown >= 4 -%}{%- continue -%}{%- endif -%}{%- assign ih_shown = ih_shown | plus: 1 -%}{%- assign pp = p.price_min -%}{%- assign unit = 'piece' -%}{%- for v in p.variants -%}{%- if v.title contains 'Bulk' -%}{%- if v.title contains 'min.' -%}{%- assign pp = v.price -%}{%- else -%}{%- assign pp = v.price | divided_by: 50 -%}{%- endif -%}{%- if v.title contains 'kits' -%}{%- assign unit = 'set' -%}{%- endif -%}{%- break -%}{%- endif -%}{%- endfor -%}<a class="ih-p" href="{{ p.url }}"><div class="im">{{ p.featured_image | image_url: width: 700 | image_tag: loading: 'lazy', alt: p.title }}<span class="q">MOQ {{ p.metafields.custom.moq.value | default: 50 }}</span></div><h4>{{ p.title }}</h4><div class="pp">From <b>{{ pp | money_without_trailing_zeros | replace: 'Rs. ', '₹' | replace: 'Rs.', '₹' }}</b> / {{ unit }}</div></a>{%- endfor -%}</div></div></section></div>"""
pe=f"""{{% if template.name == 'product' %}}{MORE}<div class="ih"><section style="padding:clamp(2.5rem,6vw,4rem) 0;background:var(--paper)"><div class="wrap">
<div class="ih-trust"><div><b>Free digital mockup</b><p>See it before you pay.</p></div><div><b>Try it in 3D</b><p><a href="/pages/3d-designer" style="color:inherit;text-decoration:underline">Preview your logo online</a>.</p></div><div><b>Made in-house</b><p>Engraved in our own workshop and hand-checked before packing.</p></div><div><b>Ready to give</b><p>Gift sets come boxed; gift boxes for single items on request. GST invoice included.</p></div></div>
<div class="ih-ctabox"><h3>Need 500+ pieces, names on each piece, or a different item?</h3><div style="display:flex;gap:.7rem;flex-wrap:wrap"><a class="btn b-brass" href="{WA}">Ask on WhatsApp →</a><a class="btn b-ghost" href="/pages/get-a-quote">Request a quote</a></div></div>
</div></section></div>{{% endif %}}"""
ft=f"""<div class="ih"><footer class="ih-foot"><div class="wrap"><div class="cols">
<div><img src="{{{{ 'imprint-house-logo-light.png' | file_url }}}}" alt="The Imprint House — Engraved Corporate Gifts" width="180" height="122" loading="lazy" style="height:auto;width:180px;max-width:60%"><p class="tl">Branded gifts, engraved in-house and delivered ready to give — across India.</p><a class="btn b-brass" style="display:inline-flex;color:#16181a" href="{WA}">WhatsApp +91 91095 35267</a></div>
<div><h5>Shop</h5><a href="/collections/ready-gift-packages">Gift packages</a><a href="/collections/keychains">Keychains</a><a href="/collections/pens">Pens</a><a href="/collections/bottles-drinkware">Bottles & mugs</a></div>
<div><h5>Help</h5><a href="/pages/faq">FAQ</a><a href="/pages/shipping-delivery">Shipping &amp; delivery</a><a href="/pages/refunds-replacements">Refunds &amp; replacements</a><a href="/pages/contact">Contact us</a><a href="/pages/legal">Legal &amp; business info</a></div>
<div><h5>Get started</h5><a href="/pages/3d-designer">3D designer</a><a href="/pages/get-a-quote">Request a quote</a><p style="color:#9a9a9a;font-size:.88rem;line-height:1.6;margin-top:.8rem">Bulk orders from 10 pieces.<br>All prices include GST.</p></div>
</div></div></footer></div>"""
fg=load(SP+"/orig_sections_footer-group.json")
ut=fg["sections"]["footer_utilities_jLGE8U"]; ut["blocks"].pop("social_links_Ew63Kq",None); ut["block_order"]=[b for b in ut["block_order"] if b!="social_links_Ew63Kq"]
ut["settings"]["background_color"]="#16181a"; ut["settings"]["divider_color"]="#2c3034"; ut["settings"]["padding-block-start"]=16; ut["settings"]["padding-block-end"]=24
cl=lambda h:{"type":"custom-liquid","settings":{"custom_liquid":h,"background_color":"","section_width":"full-width","padding-block-start":0,"padding-block-end":0}}
fg["sections"]={"ih_product_extra":cl(pe),"ih_footer":cl(ft),"footer_utilities_jLGE8U":ut}
fg["order"]=["ih_product_extra","ih_footer","footer_utilities_jLGE8U"]
json.dump(fg,open(OUT+"/footer-group.json","w"),ensure_ascii=False,separators=(',',':'))
open(OUT+"/global.css.html","w").write(GLOBAL)
open(OUT+"/frag_collection.html","w").write(cb); open(OUT+"/frag_page.html","w").write(ph); open(OUT+"/frag_product.html","w").write(pe); open(OUT+"/frag_footer.html","w").write(ft)
print("ok")
