import json, re, sys, os
SP="/tmp/claude-0/-home-user-reviewbuddie2/13fb6bb1-3703-5537-a370-eed2c2e2af05/scratchpad"
OUT=sys.argv[1]; os.makedirs(OUT,exist_ok=True)
WA="https://wa.me/919109535267?text=Hi%2C%20I%27d%20like%20a%20free%20sample%20with%20my%20logo"
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
</style>"""
GLOBAL = BASE + EXTRA

# ---- header group: add global style section
hg=json.load(open(SP+"/../../../../../home/user/reviewbuddie2/imprint-house/theme/header-group.json")) if False else json.load(open("/home/user/reviewbuddie2/imprint-house/theme/header-group.json"))
hg["sections"]["ih_global"]={"type":"custom-liquid","settings":{"custom_liquid":GLOBAL,"background_color":"","section_width":"full-width","padding-block-start":0,"padding-block-end":0}}
hg["order"]=[o for o in hg["order"] if o!="ih_global"]+["ih_global"]
json.dump(hg,open(OUT+"/header-group.json","w"),ensure_ascii=False,separators=(',',':'))

# ---- collection banner
cb="""<div class="ih"><section class="ih-band"><div class="wrap"><div class="crumb"><a href="/">Home</a> / <a href="/collections/all">Products</a></div><span class="eb">The Imprint House</span>
<h1>{{ collection.title | default: 'All products' }}</h1>{% if collection.description != blank %}<p>{{ collection.description | strip_html }}</p>{% else %}<p>Laser-engraved with your logo in our own workshop. Free sample before you order.</p>{% endif %}
<div class="ih-chips"><span>Min. 50 pieces</span><span>Free logo sample</span><span>Mockup in 24 hrs</span><span>Prices incl. GST</span></div></div></section></div>"""
col=load(SP+"/orig_templates_collection.json")
col["sections"]={"ih_banner":{"type":"custom-liquid","settings":{"custom_liquid":cb,"background_color":"","section_width":"full-width","padding-block-start":0,"padding-block-end":0}}, **{k:v for k,v in col["sections"].items() if k!="section"}}
col["sections"]["main"]["settings"]["padding-block-start"]=40
col["order"]=["ih_banner","main"]
json.dump(col,open(OUT+"/collection.json","w"),ensure_ascii=False,separators=(',',':'))

# ---- page hero
SUB={"how-it-works":"From your logo to a finished gift — with zero risk.","who-we-work-with":"Gift ideas built for your kind of business.","our-story":"A family workshop in Ajmer, engraving gifts that last.","get-a-quote":"Send your logo. Get a free mockup within 24 hours.","faq":"Everything you need to know before you order.","contact":"We usually reply on WhatsApp within a few hours."}
case="".join(f"{{% when '{k}' %}}{v}" for k,v in SUB.items())
ph=f"""<div class="ih"><section class="ih-band"><div class="wrap"><span class="eb">The Imprint House</span><h1>{{{{ page.title }}}}</h1><p>{{% case page.handle %}}{case}{{% else %}}Laser-engraved corporate gifts from Ajmer.{{% endcase %}}</p></div></section></div>"""
pg=load(SP+"/orig_templates_page.json")
m=pg["sections"]["main"]; m["blocks"].pop("heading"); m["block_order"]=["page-content"]; m["settings"]["padding-block-start"]=56
pg["sections"]={"ih_hero":{"type":"custom-liquid","settings":{"custom_liquid":ph,"background_color":"","section_width":"full-width","padding-block-start":0,"padding-block-end":0}},"main":m}
pg["order"]=["ih_hero","main"]
json.dump(pg,open(OUT+"/page.json","w"),ensure_ascii=False,separators=(',',':'))
# contact template too
pc=json.loads(json.dumps(pg)); json.dump(pc,open(OUT+"/page.contact.base.json","w"))

# ---- footer group
pe=f"""{{% if template.name == 'product' %}}<div class="ih"><section style="padding:clamp(2.5rem,6vw,4rem) 0;background:var(--paper)"><div class="wrap">
<div class="ih-trust"><div><b>Free logo sample</b><p>Hold it before you pay.</p></div><div><b>Mockup in 24 hrs</b><p>See your logo on it first.</p></div><div><b>Made in-house</b><p>Our own workshop, checked by family.</p></div><div><b>Ready to give</b><p>Boxed, labelled, GST invoice.</p></div></div>
<div class="ih-ctabox"><h3>Need 500+ pieces, names on each piece, or a different item?</h3><div style="display:flex;gap:.7rem;flex-wrap:wrap"><a class="btn b-brass" href="{WA}">Ask on WhatsApp →</a><a class="btn b-ghost" href="/pages/get-a-quote">Request a quote</a></div></div>
</div></section></div>{{% endif %}}"""
ft=f"""<div class="ih"><footer class="ih-foot"><div class="wrap"><div class="cols">
<div><div class="logo">The Imprint House</div><p class="tl">Branded gifts, engraved in-house and delivered ready to give. A family workshop in Ajmer, Rajasthan.</p><a class="btn b-brass" style="display:inline-flex;color:#16181a" href="{WA}">WhatsApp +91 91095 35267</a></div>
<div><h5>Shop</h5><a href="/collections/ready-gift-packages">Gift packages</a><a href="/collections/keychains">Keychains</a><a href="/collections/pens">Pens</a><a href="/collections/bottles-drinkware">Bottles & drinkware</a><a href="/collections/desk-accessories">Desk accessories</a></div>
<div><h5>Company</h5><a href="/pages/how-it-works">How it works</a><a href="/pages/who-we-work-with">Who we work with</a><a href="/pages/our-story">Our story</a><a href="/pages/faq">FAQ</a></div>
<div><h5>Get started</h5><a href="/pages/get-a-quote">Get a free sample</a><a href="/pages/get-a-quote">Request a quote</a><p style="color:#9a9a9a;font-size:.88rem;line-height:1.6;margin-top:.8rem">Minimum order 50 pieces.<br>All prices include GST.</p></div>
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
