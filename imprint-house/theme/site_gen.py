import json, re, sys, os
SP="/tmp/claude-0/-home-user-reviewbuddie2/13fb6bb1-3703-5537-a370-eed2c2e2af05/scratchpad"
OUT=sys.argv[1]; os.makedirs(OUT,exist_ok=True)
WA="https://wa.me/918319267960?text=Hi%2C%20I%27d%20like%20a%20quote%20for%20engraved%20gifts%20with%20my%20logo"
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
.ih-foot .cols{display:grid;gap:2.2rem}@media(min-width:900px){.ih-foot .cols{grid-template-columns:1.4fr 1fr 1.1fr 1fr 1.1fr}}
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
.ih-unit{font-size:.85rem;font-weight:500;color:#6b6b6b;letter-spacing:0}
.ih-per{display:block;font-size:.82rem;color:#6b6b6b;margin-top:.3rem;font-weight:500;letter-spacing:0}
product-card .ih-per,.product-card .ih-per{font-size:.75rem;margin-top:.15rem}
.ih-main-price bdi{font-size:1.75rem;font-weight:600;letter-spacing:-.01em}
.ih-moq-msg{display:block;font-size:.82rem;color:#9a6b1f;margin-top:.3rem}
.ih-per[hidden],.ih-moq-msg[hidden]{display:none!important}
.ih-mock{display:flex;flex-wrap:wrap;align-items:center;gap:.4rem .9rem;margin-top:1rem;padding:.75rem .9rem;border:1px solid #e4e0d8;border-radius:12px;background:#f7f5f1;font-size:.85rem;line-height:1.45;color:#16181a;font-weight:400}
.ih-mock>span{flex:1 1 220px}
main .ih-mock a[href*="wa.me"]{display:inline-flex!important;flex:0 0 auto;margin:0!important;padding:.5rem .95rem!important;font-size:.82rem!important;line-height:1.2;border-radius:999px!important;background:#25D366!important;color:#fff!important;text-decoration:none!important;font-weight:600}
/* sticky add-to-cart bar: keep it to image, price and button */
sticky-add-to-cart .ih-per,sticky-add-to-cart .ih-mock,sticky-add-to-cart .ih-moq-msg{display:none!important}
sticky-add-to-cart .ih-main-price bdi{font-size:inherit;font-weight:inherit}
sticky-add-to-cart .sticky-add-to-cart__variant{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:240px}
sticky-add-to-cart button{white-space:nowrap}
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
# Where each visitor came from, as a short code added to WhatsApp messages and the quote form:
# G = Google Ads (gclid), M = Meta ads or Instagram/Facebook, I = IndiaMART, L = LinkedIn, S = organic search,
# any other utm_source = that name. Remembered for 30 days (last touch wins).
SRCJS = r"""var IHS=(function(){var K='ih_src',c='';try{var u=new URLSearchParams(location.search),s=(u.get('utm_source')||'').toLowerCase(),r='';try{r=document.referrer?new URL(document.referrer).hostname:''}catch(x){}if(r===location.hostname)r='';
if(u.get('gclid')||u.get('gbraid')||u.get('wbraid')||/^(google|adwords|gads)/.test(s))c='G';else if(u.get('fbclid')||/^(facebook|instagram|meta|fb|ig)/.test(s))c='M';else if(/indiamart/.test(s)||/indiamart\./.test(r))c='I';else if(/linkedin/.test(s)||/linkedin\.|lnkd\.in/.test(r))c='L';else if(s)c=s.replace(/[^a-z0-9]/g,'').slice(0,10).toUpperCase();else if(/(^|\.)(google|bing|duckduckgo|yahoo)\./.test(r))c='S';else if(/facebook\.|instagram\./.test(r))c='M';
if(c){localStorage.setItem(K,JSON.stringify({c:c,t:Date.now()}))}else{var o=JSON.parse(localStorage.getItem(K)||'null');if(o&&Date.now()-o.t<2592e6)c=o.c}}catch(x){}return c})();
function tagWa(h){try{var x=new URL(h,location.href),t=x.searchParams.get('text');if(t===null&&!IHS)return h;t=t||"Hi, I'd like a quote";if(IHS&&t.indexOf('('+IHS+')')<0)t=t+' ('+IHS+')';return x.origin+x.pathname+'?text='+encodeURIComponent(t)}catch(x){return h}}
window.IH_SRC=IHS;window.IH_TAG_WA=tagWa;
document.addEventListener('click',function(e){var a=e.target&&e.target.closest?e.target.closest('a[href*="wa.me"]'):null;if(a){if(a.id!=='ihdWhatsApp')a.href=tagWa(a.href);pub('whatsapp_click',{page:location.pathname,label:(a.textContent||'').trim().slice(0,60),source:IHS||'direct'})}},true);
function srcField(){document.querySelectorAll('form[action*="/contact"]').forEach(function(f){if(f.querySelector('input[name="contact[Lead source]"]'))return;var i=document.createElement('input');i.type='hidden';i.name='contact[Lead source]';i.value=IHS||'Direct';f.appendChild(i)})}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',srcField)}else{srcField()}"""

EXTRA2 = """<style>
.ih-trusted{background:#fff;border-bottom:1px solid #e4e0d8;padding:1.4rem 0}
.ih-trusted .wrap{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.9rem 2rem}
.ih-trusted .eb{margin:0}
.ih-trusted .fig{font-family:Fraunces,Georgia,serif;font-size:1.3rem;font-weight:600;margin:0;color:#16181a}
.ih-trusted .logos{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:1.1rem 2.2rem}
.ih-trusted img{height:44px;width:auto;max-width:150px;object-fit:contain;filter:grayscale(1);opacity:.8}
.ih-tms{display:grid;gap:18px}@media(min-width:900px){.ih-tms{grid-template-columns:repeat(3,1fr)}}
.ih-tm{margin:0;background:#fff;border:1px solid #e4e0d8;border-radius:20px;overflow:hidden;display:flex;flex-direction:column}
.ih-tm img{width:100%;height:auto;aspect-ratio:4/3;object-fit:cover;display:block}
.ih-tm blockquote{margin:0;padding:1.4rem 1.4rem .6rem;font-family:Fraunces,Georgia,serif;font-size:1.1rem;line-height:1.45;color:#16181a;border:0}
.ih-tm figcaption{padding:0 1.4rem 1.4rem;font-size:.88rem;color:#6b6b6b}
.ih-tm figcaption b{color:#16181a}.ih-tm figcaption span{display:block}
.ih-mock a.ih-3d{display:inline-flex;flex:0 0 auto;align-items:center;padding:.5rem .95rem;border-radius:999px;border:1px solid #16181a;color:#16181a;font-size:.82rem;font-weight:600;text-decoration:none;line-height:1.2}
.ih-rte{max-width:780px}
.ih-rte h2{font-size:clamp(1.45rem,3vw,1.9rem);margin:2rem 0 .7rem}.ih-rte h2:first-child{margin-top:0}
.ih-rte p,.ih-rte li{color:#3a3a3a;line-height:1.65}.ih-rte ul,.ih-rte ol{padding-left:1.2rem}
.ih-band .ih-uc-cta{display:flex;gap:.7rem;flex-wrap:wrap;margin-top:1.6rem}
</style>"""
GLOBAL = BASE + EXTRA + EXTRA2 + """<script>(function(){function pub(n,d){try{if(window.Shopify&&Shopify.analytics&&Shopify.analytics.publish){Shopify.analytics.publish(n,d)}}catch(e){}}
""" + SRCJS + """
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
<div class="ih-chips"><span>Bulk orders from 10 pieces</span><span>Free digital mockup in 24 hrs</span><span>Try it in 3D</span><span>All-inclusive prices</span></div></div></section></div>"""
col=load(SP+"/orig_templates_collection.json")
col["sections"]={"ih_banner":{"type":"custom-liquid","settings":{"custom_liquid":cb,"background_color":"","section_width":"full-width","padding-block-start":0,"padding-block-end":0}}, **{k:v for k,v in col["sections"].items() if k!="section"}}
col["sections"]["main"]["settings"]["padding-block-start"]=40
intro="""{%- assign ih_intro = collection.metafields.custom.intro_html.value -%}{%- if ih_intro != blank -%}<div class="ih"><section class="ih-sec" style="background:#fff"><div class="wrap"><div class="ih-rte">{{ ih_intro }}</div></div></section></div>{%- endif -%}"""
col["sections"]["ih_intro"]={"type":"custom-liquid","settings":{"custom_liquid":intro,"background_color":"","section_width":"full-width","padding-block-start":0,"padding-block-end":0}}
col["order"]=["ih_banner","main","ih_intro"]
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
CARD = """{%- assign ih_unit = 'piece' -%}{%- if p.product_type == 'Package' -%}{%- assign ih_unit = 'set' -%}{%- endif -%}<a class="ih-p" href="{{ p.url }}"><div class="im">{{ p.featured_image | image_url: width: 700 | image_tag: loading: 'lazy', alt: p.title }}<span class="q">MOQ {{ p.metafields.custom.moq.value | default: 10 }}</span></div><h4>{{ p.title }}</h4><div class="pp">From <b>{{ p.price_min | money_without_trailing_zeros | replace: 'Rs. ', '₹' | replace: 'Rs.', '₹' }}</b> / {{ ih_unit }}</div></a>"""
TCARD = """<figure class="ih-tm">{%- if t.photo.value -%}{{ t.photo.value | image_url: width: 800 | image_tag: loading: 'lazy', alt: t.company.value }}{%- endif -%}<blockquote>&ldquo;{{ t.quote.value | escape | newline_to_br }}&rdquo;</blockquote><figcaption><b>{{ t.name.value | escape }}</b>{%- if t.role.value != blank -%}, {{ t.role.value | escape }}{%- endif -%}<span>{{ t.company.value | escape }}</span></figcaption></figure>"""
MORE = """<div class="ih"><section class="ih-sec" style="background:#fff;padding-bottom:0"><div class="wrap"><div class="ih-head" style="margin-bottom:1.6rem"><div><span class="eb">From our workshop</span><h2>More engraved gifts</h2></div><p>Every piece engraved with your logo. Low minimums, free digital mockup first.</p></div><div class="ih-pg">{%- assign ih_items = collections['all'].products | sort: 'price' -%}{%- assign ih_shown = 0 -%}{%- for p in ih_items -%}{%- if p.id == product.id or ih_shown >= 4 -%}{%- continue -%}{%- endif -%}{%- assign ih_shown = ih_shown | plus: 1 -%}""" + CARD + """{%- endfor -%}</div></div></section></div>"""
# client quotes on product pages: testimonials linked to this product (max 2)
TPROD = """{%- capture ih_pt -%}{%- assign ih_n = 0 -%}{%- for t in shop.metaobjects.testimonial.values -%}{%- if t.product.value.id == product.id and ih_n < 2 -%}{%- assign ih_n = ih_n | plus: 1 -%}""" + TCARD + """{%- endif -%}{%- endfor -%}{%- endcapture -%}{%- if ih_pt != blank -%}<div class="ih"><section class="ih-sec" style="background:#fff;padding-bottom:0"><div class="wrap"><div class="ih-head" style="margin-bottom:1.4rem"><div><span class="eb">From our clients</span><h2>What buyers say</h2></div></div><div class="ih-tms">{{ ih_pt }}</div></div></section></div>{%- endif -%}"""
# ---- use-case landing pages (page.usecase.json): hero, live product cards from page.metafields.custom.products,
# the page body, client quotes for those products (only real ones, from the Testimonial metaobject), how ordering works
UCWA = "https://wa.me/918319267960?text={{ 'Hi, I would like a quote for: ' | append: page.title | url_encode | replace: '+', '%20' }}"
uc_hero = """<div class="ih"><section class="ih-band"><div class="wrap"><div class="crumb"><a href="/">Home</a> / {{ page.title }}</div><span class="eb">Engraved corporate gifts</span><h1>{{ page.title }}</h1>{%- assign ih_sub = page.metafields.custom.subtitle.value -%}{%- if ih_sub != blank -%}<p>{{ ih_sub | escape }}</p>{%- endif -%}<div class="ih-uc-cta"><a class="btn b-brass" href=\"""" + UCWA + """\">Get a quote on WhatsApp &rarr;</a><a class="btn b-ghost" href="/pages/3d-designer">Preview your logo in 3D</a></div><div class="ih-chips"><span>Free digital mockup in 24 hrs</span><span>Bulk orders from 10 pieces</span><span>All-inclusive prices</span><span>Delivered across India</span></div></div></section></div>"""
uc_products = """{%- assign ih_ps = page.metafields.custom.products.value -%}{%- if ih_ps != blank -%}<div class="ih"><section class="ih-sec" style="background:#fff;padding-bottom:0"><div class="wrap"><div class="ih-head" style="margin-bottom:1.6rem"><div><span class="eb">Popular picks</span><h2>What works best</h2></div><p>Live prices and minimums. Every piece is engraved with your logo, with a name on each piece if you like.</p></div><div class="ih-pg">{%- for p in ih_ps -%}""" + CARD + """{%- endfor -%}</div></div></section></div>{%- endif -%}"""
uc_body = """{%- if page.content != blank -%}<div class="ih"><section class="ih-sec" style="background:#fff"><div class="wrap"><div class="ih-rte">{{ page.content }}</div></div></section></div>{%- endif -%}"""
uc_testi = """{%- capture ih_ut -%}{%- assign ih_n = 0 -%}{%- for t in shop.metaobjects.testimonial.values -%}{%- assign ih_tp = t.product.value -%}{%- if ih_tp and ih_n < 3 -%}{%- for p in page.metafields.custom.products.value -%}{%- if p.id == ih_tp.id -%}{%- assign ih_n = ih_n | plus: 1 -%}""" + TCARD + """{%- break -%}{%- endif -%}{%- endfor -%}{%- endif -%}{%- endfor -%}{%- endcapture -%}{%- if ih_ut != blank -%}<div class="ih"><section class="ih-sec" style="background:#fff;padding-top:0"><div class="wrap"><div class="ih-head" style="margin-bottom:1.4rem"><div><span class="eb">From our clients</span><h2>What buyers say</h2></div></div><div class="ih-tms">{{ ih_ut }}</div></div></section></div>{%- endif -%}"""
uc_how = """<div class="ih"><section class="ih-sec" style="background:var(--paper,#f7f5f1)"><div class="wrap"><span class="eb">How ordering works</span><h2 style="margin:.4rem 0 1.4rem">From your logo to a finished gift</h2><div class="ih-lsteps"><div><b>01</b><h3>Send your logo</h3><p>On WhatsApp, or try it in our 3D designer first. Tell us roughly how many pieces you need and by when.</p></div><div><b>02</b><h3>Free mockup in 24 hours</h3><p>See exactly how it will look. Nothing is engraved until you approve it.</p></div><div><b>03</b><h3>Engraved in-house</h3><p>Usually 5&ndash;10 working days after approval, checked by hand before packing.</p></div><div><b>04</b><h3>Delivered across India</h3><p>Packed and shipped by courier, with tracking shared on WhatsApp.</p></div></div><div class="ih-ctabox"><h3>Tell us your quantity and date. We&rsquo;ll reply with a quote and a free mockup.</h3><div style="display:flex;gap:.7rem;flex-wrap:wrap"><a class="btn b-brass" href=\"""" + UCWA + """\">WhatsApp us &rarr;</a><a class="btn b-ghost" href="/pages/get-a-quote">Request a quote</a></div></div></div></section></div>"""
UCS = [("ih_hero", uc_hero), ("ih_products", uc_products), ("ih_body", uc_body), ("ih_testi", uc_testi), ("ih_how", uc_how)]
uc = {"sections": {k: {"type": "custom-liquid", "settings": {"custom_liquid": v, "background_color": "", "section_width": "full-width", "padding-block-start": 0, "padding-block-end": 0}} for k, v in UCS}, "order": [k for k, _ in UCS]}
json.dump(uc, open(OUT + "/page.usecase.json", "w"), ensure_ascii=False, separators=(',', ':'))
pe=f"""{{% if template.name == 'product' %}}{TPROD}{MORE}<div class="ih"><section style="padding:clamp(2.5rem,6vw,4rem) 0;background:var(--paper)"><div class="wrap">
<div class="ih-trust"><div><b>Free digital mockup</b><p>See it before you pay.</p></div><div><b>Try it in 3D</b><p><a href="/pages/3d-designer" style="color:inherit;text-decoration:underline">Preview your logo online</a>.</p></div><div><b>Made in-house</b><p>Engraved in our own workshop and hand-checked before packing.</p></div><div><b>Ready to give</b><p>Gift sets come boxed; gift boxes for single items on request. Invoice included.</p></div></div>
<div class="ih-ctabox"><h3>Need 500+ pieces, names on each piece, or a different item?</h3><div style="display:flex;gap:.7rem;flex-wrap:wrap"><a class="btn b-brass" href="{WA}">Ask on WhatsApp →</a><a class="btn b-ghost" href="/pages/get-a-quote">Request a quote</a></div></div>
</div></section></div>{{% endif %}}"""
ft=f"""<div class="ih"><footer class="ih-foot"><div class="wrap"><div class="cols">
<div><img src="{{{{ 'imprint-house-logo-light.png' | file_url }}}}" alt="The Imprint House — Engraved Corporate Gifts" width="180" height="122" loading="lazy" style="height:auto;width:180px;max-width:60%"><p class="tl">Branded gifts, engraved in-house and delivered ready to give — across India.</p><a class="btn b-brass" style="display:inline-flex;color:#16181a" href="{WA}">WhatsApp +91 83192 67960</a></div>
<div><h5>Shop</h5><a href="/collections/ready-gift-packages">Gift packages</a><a href="/collections/keychains">Keychains</a><a href="/collections/pens">Pens</a><a href="/collections/bottles-drinkware">Bottles & mugs</a></div>
<div><h5>Gifts for</h5><a href="/pages/dealership-gifts">Car &amp; bike dealerships</a><a href="/pages/real-estate-handover-gifts">Real estate handovers</a><a href="/pages/employee-welcome-kits">Employee welcome kits</a><a href="/pages/doctor-clinic-gifts">Doctors &amp; clinics</a><a href="/pages/dealer-meet-gifts">Dealer &amp; distributor meets</a><a href="/pages/corporate-gifts-under-500">Gifts under ₹500</a><a href="/pages/trade">Resellers &amp; agencies</a></div>
<div><h5>Help</h5><a href="/pages/faq">FAQ</a><a href="/pages/shipping-delivery">Shipping &amp; delivery</a><a href="/pages/refunds-replacements">Refunds &amp; replacements</a><a href="/pages/contact">Contact us</a><a href="/pages/legal">Legal &amp; business info</a></div>
<div><h5>Get started</h5><a href="/pages/3d-designer">3D designer</a><a href="/pages/get-a-quote">Request a quote</a><p style="color:#9a9a9a;font-size:.88rem;line-height:1.6;margin-top:.8rem">Bulk orders from 10 pieces.<br>All-inclusive prices, no hidden charges.</p></div>
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
