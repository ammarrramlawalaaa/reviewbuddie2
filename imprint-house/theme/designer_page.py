import json, re, sys
PREVIEW = len(sys.argv) > 1 and sys.argv[1] == "preview"
OUT = sys.argv[2]
SP = "/tmp/claude-0/-home-user-reviewbuddie2/13fb6bb1-3703-5537-a370-eed2c2e2af05/scratchpad"

FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Great+Vibes&display=swap" rel="stylesheet">'
CSS = """<style>
.ihd-band{padding:clamp(2.4rem,6vw,4rem) 0}
.ihd-band h1{font-size:clamp(2.1rem,5vw,3.6rem)!important}
.ihd{padding:clamp(1.6rem,4vw,3rem) 0 4rem;background:var(--paper)}
.ihd-grid{display:grid;gap:24px}
@media(min-width:960px){.ihd-grid{grid-template-columns:1.12fr .88fr;align-items:start}.ihd-left{position:sticky;top:96px}}
.ihd-stage{position:relative;aspect-ratio:1/1;border-radius:22px;background:radial-gradient(circle at 50% 30%,#30353b,#0f1113 72%);overflow:hidden;touch-action:pan-y;cursor:grab;user-select:none}
.ihd-stage:active{cursor:grabbing}
.ihd-stage .ihd-canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.ihd-loading{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:2rem;color:rgba(255,255,255,.65);font-size:.92rem}
.ihd-ready .ihd-loading{display:none}
.ihd-side-label{position:absolute;top:14px;left:16px;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.7);pointer-events:none}
.ihd-hint{position:absolute;bottom:12px;left:0;right:0;text-align:center;font-size:.68rem;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.45);pointer-events:none}
.ihd-stagebar{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.8rem}
.ih .btn.sm{padding:.62rem 1rem;font-size:.82rem}
.ihd-panel{background:#fff;border:1px solid var(--line);border-radius:22px;padding:clamp(1.1rem,3vw,1.7rem)}
.ihd-step{padding:1.1rem 0;border-bottom:1px solid var(--line)}
.ihd-step:first-child{padding-top:0}.ihd-step:last-child{border:0;padding-bottom:0}
.ihd-h{font-weight:600;font-size:.95rem;margin-bottom:.75rem;display:flex;align-items:center;gap:.55rem}
.ihd-h b{display:inline-flex;width:24px;height:24px;border-radius:50%;background:var(--ink);color:#fff;font-size:.75rem;align-items:center;justify-content:center;flex:none}
.ihd-h span{font-weight:400;color:var(--muted)}
.ihd .chips{display:flex;gap:.45rem;flex-wrap:wrap}
.ihd .chips button{border:1px solid #cfc9bd;background:#fff;border-radius:99px;padding:.5rem .95rem;font:inherit;font-size:.85rem;cursor:pointer;color:var(--ink)}
.ihd .chips button.on{background:var(--ink);color:#fff;border-color:var(--ink)}
.ihd-sw{display:flex;gap:.6rem;flex-wrap:wrap}
.ihd-sw button{width:34px;height:34px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 1px #cfc9bd;cursor:pointer;padding:0}
.ihd-sw button.on{box-shadow:0 0 0 2px var(--ink)}
.ihd-upload{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:.15rem;border:1.5px dashed #cfc9bd;border-radius:14px;padding:.95rem 1.1rem;cursor:pointer;background:var(--paper)}
.ihd-upload:hover{border-color:var(--brass)}
.ihd-upload input{position:absolute;opacity:0;width:1px;height:1px;pointer-events:none}
.ihd-upload span{font-weight:600}.ihd-upload small{color:var(--muted);font-size:.8rem}
.ihd textarea{width:100%;border:1px solid #cfc9bd;border-radius:12px;padding:.8rem 1rem;font:inherit;font-size:1rem;resize:vertical;margin-bottom:.7rem;background:#fff}
.ihd-range{display:flex;align-items:center;gap:.8rem;font-size:.86rem;margin:.75rem 0;color:var(--muted)}
.ihd-range input[type=range]{flex:1;accent-color:#b8925a}
.ihd-range input[type=number]{width:120px;border:1px solid #cfc9bd;border-radius:10px;padding:.55rem .7rem;font:inherit;background:#fff}
.ihd-check{display:flex;gap:.55rem;align-items:center;font-size:.88rem;margin:.6rem 0;cursor:pointer}
.ihd-check input{accent-color:#16181a;width:16px;height:16px}
.ihd-note{font-size:.8rem!important;color:var(--muted);margin-top:.55rem!important;line-height:1.5!important}
.ihd-err{color:#b3261e;font-size:.85rem;margin-top:.55rem!important}
.ihd-link{background:none;border:0;padding:0;font:inherit;font-size:.85rem;text-decoration:underline;cursor:pointer;color:var(--ink);margin-right:1.1rem}
.ihd-edwrap{background:#e9e5dd;border-radius:12px;padding:12px;display:flex;justify-content:center;margin:.6rem 0}
.ihd-edwrap canvas{border-radius:6px;touch-action:none;max-width:100%;display:block}
.ihd-sides{display:flex;align-items:center;gap:.6rem;margin-bottom:.5rem;font-size:.86rem;color:var(--muted)}
.ihd-cta{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.4rem}
.ihd-price{font-size:.85rem;color:var(--muted);margin-top:.75rem!important}.ihd-price a{color:var(--ink);text-decoration:underline}
.ih-gal{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}@media(min-width:900px){.ih-gal{grid-template-columns:repeat(4,1fr);gap:16px}}
.ih-gal a{display:block;aspect-ratio:1/1;border-radius:14px;overflow:hidden;background:#eee}
.ih-gal img{width:100%;height:100%;object-fit:cover;transition:transform .5s}.ih-gal a:hover img{transform:scale(1.05)}
.ihd-prev{display:flex;gap:.9rem;align-items:center;margin:.9rem 0 .2rem}.ihd-prev canvas{border-radius:10px;flex:none;max-width:55%}.ihd-prev .ihd-note{margin:0!important}
@media(max-width:480px){.ihd-prev{flex-direction:column;align-items:flex-start}.ihd-prev canvas{max-width:100%}}
.ihd [hidden],.ih [hidden]{display:none!important}
</style>"""

PROD_BTNS = "".join(f'<button type="button" data-p="{k}"{" class=on" if k=="keychain" else ""}>{v}</button>' for k,v in [("keychain","Metal keychain"),("roundkey","Round keychain"),("housekey","House keychain"),("leather","Leather keychain"),("pen","Metal pen"),("penlux","Gold / rose-gold pen"),("slimpen","Slim stylus pen"),("roller","Roller pen"),("flask","Flask"),("bottle","Sage bottle"),("ropebottle","Rope bottle"),("whitebottle","White bottle"),("mug","Coffee mug")])
FONT_BTNS = "".join(f'<button type="button" data-f="{k}"{" class=on" if k=="serif" else ""}>{v}</button>' for k,v in [("serif","Classic"),("sans","Modern"),("bold","Bold"),("script","Script")])

MARKUP = f"""<div class="ih"><section class="ih-band ihd-band"><div class="wrap"><span class="eb">3D Designer</span><h1>Design your engraved gift</h1>
<p>Upload your logo, add your text and place it exactly where you want it. See it laser-engraved in 3D &mdash; on both sides of the keychain. Your logo stays on your device.</p></div></section>
<section class="ihd"><div class="wrap ihd-grid">
<div class="ihd-left">
<div class="ihd-stage" id="ihdStage" aria-label="3D preview of your engraved product"><div class="ihd-loading">Loading 3D preview&hellip;</div><span class="ihd-side-label" id="ihdSideLabel">Front</span><span class="ihd-hint">Drag to rotate</span></div>
<div class="ihd-stagebar"><button type="button" id="ihdFlip" class="btn b-line sm">&#8635; Flip to other side</button><button type="button" id="ihdBurn" class="btn b-line sm">Replay laser</button><button type="button" id="ihdDownload" class="btn b-line sm">Download preview</button></div>
</div>
<div class="ihd-panel">
<div class="ihd-step"><div class="ihd-h"><b>1</b>Product</div><div class="chips" id="ihdProducts">{PROD_BTNS}</div><p class="ihd-price" id="ihdPrice"></p></div>
<div class="ihd-step"><div class="ihd-h"><b>2</b>Colour <span id="ihdColourName"></span></div><div class="ihd-sw" id="ihdColours"></div></div>
<div class="ihd-step"><div class="ihd-h"><b>3</b>Your logo</div>
<label class="ihd-upload"><input type="file" id="ihdFile" accept="image/*"><span>&#8682; Upload your logo</span><small>Any JPG, PNG or SVG &mdash; even a phone photo of your logo or visiting card. We clean it up automatically.</small></label>
<p class="ihd-err" id="ihdLogoErr" hidden></p>
<p class="ihd-note" id="ihdLogoEmpty">No logo yet &mdash; you can also engrave text only.</p>
<div id="ihdLogoControls" hidden>
<div class="ihd-prev"><canvas id="ihdLogoPrev" aria-label="How your logo will be engraved"></canvas><p class="ihd-note" id="ihdLogoNote"></p></div>
<div class="ihd-sides" style="margin-top:.6rem"><span>Style:</span><div class="chips" id="ihdLogoStyle"><button type="button" data-s="auto" class="on">Auto</button><button type="button" data-s="logo">Logo</button><button type="button" data-s="photo">Photo</button></div></div>
<label class="ihd-range">Detail <input type="range" id="ihdDetail" min="0" max="100" value="50"></label>
<label class="ihd-check"><input type="checkbox" id="ihdLogoOn" checked> Show logo on this side</label>
<label class="ihd-range">Logo size <input type="range" id="ihdLogoSize" min="10" max="100" value="60"></label>
<label class="ihd-check"><input type="checkbox" id="ihdInvert"> Invert (for a light logo on a dark background)</label>
<button type="button" class="ihd-link" id="ihdLogoRemove">Remove logo</button>
</div></div>
<div class="ihd-step"><div class="ihd-h"><b>4</b>Your text</div>
<textarea id="ihdText" rows="2" maxlength="60" placeholder="Business name, a person&rsquo;s name or a vehicle number" aria-label="Engraving text"></textarea>
<div class="chips" id="ihdFonts">{FONT_BTNS}</div>
<label class="ihd-range">Text size <input type="range" id="ihdTextSize" min="5" max="100" value="20"></label>
<p class="ihd-note" id="ihdFit" hidden>Your text was made smaller so it fits the engraving area.</p></div>
<div class="ihd-step"><div class="ihd-h"><b>5</b>Placement</div>
<div class="ihd-sides"><span>Side:</span><div class="chips" id="ihdSides"></div></div>
<div class="ihd-edwrap"><canvas id="ihdEditor" aria-label="Engraving layout editor"></canvas></div>
<p class="ihd-note">Drag the logo or the text to move it. Tap one to select it, then use the size sliders above.</p>
<div><button type="button" id="ihdCenter" class="ihd-link">Centre selected</button><button type="button" id="ihdReset" class="ihd-link">Reset layout</button></div></div>
<div class="ihd-step"><div class="ihd-h"><b>6</b>Get your quote</div>
<label class="ihd-range">Quantity <input type="number" id="ihdQty" min="50" step="10" value="100" aria-label="Quantity"></label>
<div class="ihd-cta"><a id="ihdWhatsApp" class="btn b-brass" target="_blank" rel="noopener" href="https://wa.me/918319267960?text=Hi%2C%20I%20designed%20a%20gift%20in%20your%203D%20designer%20and%20would%20like%20a%20free%20mockup.">Send this design on WhatsApp &rarr;</a><a class="btn b-line" href="/pages/get-a-quote">Request a quote</a></div>
<p class="ihd-note">Tip: tap <b>Download preview</b>, then attach the image and your logo file in WhatsApp. Laser engraving is single-tone, so we convert your logo automatically and send you a digital mockup to approve before we make anything. Minimum order 50 pieces.</p></div>
</div></div></section></div>"""

CFG_LIQ = """{%- assign ihpairs = 'keychain:classic-metal-keychain,pen:metal-ball-pen,roller:matte-roller-pen-gift-case,flask:insulated-steel-flask-logo,bottle:stainless-steel-bottle-750-ml,mug:steel-coffee-mug-logo,leather:engraved-leather-keychain,penlux:soft-touch-pen-gold-rose-gold,ropebottle:black-rope-handle-bottle,whitebottle:white-steel-bottle,roundkey:round-metal-keychain,housekey:house-metal-keychain,slimpen:slim-stylus-pen' | split: ',' -%}{%- capture ihp -%}{%- for pair in ihpairs -%}{%- assign kv = pair | split: ':' -%}{%- assign pr = all_products[kv[1]] -%}{%- if pr.id -%}{%- assign pp = pr.price_min -%}{%- for v in pr.variants -%}{%- if v.title contains 'Bulk' -%}{%- if v.title contains 'min.' -%}{%- assign pp = v.price -%}{%- else -%}{%- assign pp = v.price | divided_by: 50 -%}{%- endif -%}{%- break -%}{%- endif -%}{%- endfor -%}"{{ kv[0] }}":{"url":{{ pr.url | json }},"moq":{{ pr.metafields.custom.moq.value | default: 50 }},"from":{{ pp | money_without_trailing_zeros | replace: 'Rs. ', '₹' | replace: 'Rs.', '₹' | json }}},{%- endif -%}{%- endfor -%}{%- endcapture -%}
{%- assign ex = all_products['executive-gift-kit-under-600'] -%}"""
CFG_JS_LIVE = """window.IHD_CFG={whatsapp:'https://wa.me/918319267960',products:{ {{ ihp }} } };"""
CFG_JS_PRE = """window.IHD_CFG={whatsapp:'https://wa.me/918319267960',products:{"keychain":{"url":"#","from":"₹45"},"pen":{"url":"#","from":"₹80"},"roller":{"url":"#","from":"₹120"},"flask":{"url":"#","from":"₹349"},"bottle":{"url":"#","from":"₹350"},"mug":{"url":"#","from":"₹220"}}};"""
JS_URL = "./dist/ih-designer.js" if PREVIEW else "{{ 'ih-designer.js' | asset_url }}"
LOADER = "(function(){var s=document.createElement('script');s.src='" + JS_URL + "';s.onload=function(){if(window.IHDesigner&&IHDesigner.init){IHDesigner.init(window.IHD_CFG)}};s.onerror=function(){var l=document.querySelector('.ihd-loading');if(l)l.textContent='The 3D preview could not load. Please refresh the page.'};document.head.appendChild(s)})();"
SCRIPT = ("" if PREVIEW else CFG_LIQ) + "<script>" + (CFG_JS_PRE if PREVIEW else CFG_JS_LIVE) + LOADER + "</script>"
DESIGNER = FONTS + CSS + MARKUP + SCRIPT

GAL_LIQ = """<div class="ih"><section class="ih-sec"><div class="wrap"><div class="ih-head"><div><span class="eb">Our products</span><h2>How it looks for real.</h2></div><p>Laser-engraved pens, keychains, flasks, mugs and gift sets. Tap any photo to see the product.</p></div>
<div class="ih-gal">{%- assign ihgal = 'essential-gift-kit-under-300,executive-gift-kit-under-600,classic-metal-keychain,matte-roller-pen-gift-case,steel-coffee-mug-logo,metal-ball-pen' | split: ',' -%}{%- for h in ihgal -%}{%- assign pr = all_products[h] -%}{%- if pr.id -%}{%- for m in pr.media limit: 2 -%}{%- if m.media_type == 'image' -%}<a href="{{ pr.url }}">{{ m.preview_image | image_url: width: 700 | image_tag: loading: 'lazy', alt: m.alt }}</a>{%- endif -%}{%- endfor -%}{%- endif -%}{%- endfor -%}</div></div></section></div>"""

if PREVIEW:
    v2 = open(SP + "/v2/gen.py").read()
    base = re.search(r'CSS = """(.*?)"""', v2, re.S).group(1)
    open(OUT, "w").write('<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><body style="margin:0">' + base + DESIGNER + '</body>')
else:
    sec = lambda h: {"type": "custom-liquid", "settings": {"custom_liquid": h, "background_color": "", "section_width": "full-width", "padding-block-start": 0, "padding-block-end": 0}}
    tpl = {"sections": {"ihd_main": sec(DESIGNER), "ihd_gallery": sec(GAL_LIQ)}, "order": ["ihd_main", "ihd_gallery"]}
    open(OUT, "w").write(json.dumps(tpl, ensure_ascii=False, separators=(',', ':')))
    print("live template", len(DESIGNER), len(GAL_LIQ))
