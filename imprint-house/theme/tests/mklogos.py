import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import sys, os
out = sys.argv[1]
def font(sz, bold=True):
    for p in ['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf']:
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()
rng = np.random.default_rng(3)
# 1. paper fills the whole frame, uneven light + noise + soft shadow, dark ink logo
W,H = 1200, 900
paper = Image.new('RGB', (W,H), (236,232,224)); d = ImageDraw.Draw(paper)
d.ellipse((470,170,730,430), outline=(30,40,90), width=26); d.polygon([(600,215),(530,390),(670,390)], fill=(30,40,90))
d.text((600,540), 'KAPOOR & SONS', fill=(30,40,90), font=font(84), anchor='mm')
d.text((600,630), 'Chartered Accountants', fill=(60,60,70), font=font(40, False), anchor='mm')
a = np.asarray(paper).astype(np.float32)
yy, xx = np.mgrid[0:H,0:W]
light = 0.72 + 0.35*(xx/W) - 0.18*((yy-H*0.8)/H)**2   # brighter on the right, darker bottom-left
shadow = 1 - 0.35*np.exp(-(((xx-150)/260)**2 + ((yy-760)/200)**2))  # hand/phone shadow
a = a*light[...,None]*shadow[...,None] + rng.normal(0,6,(H,W,1))
Image.fromarray(np.clip(a,0,255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.1)).save(f'{out}/paper-full-frame.jpg', quality=70)
# 2. digital badge logo: solid navy rounded square with white text, on white (must NOT be treated as a card)
b = Image.new('RGB', (800,800), (255,255,255)); d = ImageDraw.Draw(b)
d.rounded_rectangle((150,150,650,650), 60, fill=(20,40,110)); d.text((400,360), 'RK', fill=(255,255,255), font=font(200), anchor='mm'); d.text((400,540), 'BUILDERS', fill=(255,255,255), font=font(56), anchor='mm')
b.save(f'{out}/badge-square.jpg', quality=88)
# 3. digital circle badge
c = Image.new('RGB', (800,800), (255,255,255)); d = ImageDraw.Draw(c)
d.ellipse((120,120,680,680), fill=(170,20,30)); d.text((400,400), 'ZEN', fill=(255,255,255), font=font(170), anchor='mm')
c.save(f'{out}/badge-circle.jpg', quality=88)
# 4. letterhead photo taken at an angle under warm light, paper bigger than frame on one side
L = Image.new('RGB', (1400,1000), (120,100,80)); d = ImageDraw.Draw(L)
sheet = Image.new('RGB', (1000,1300), (245,242,235)); sd = ImageDraw.Draw(sheet)
sd.text((500,220), 'MEHTA', fill=(150,20,30), font=font(150), anchor='mm'); sd.text((500,360), 'TEXTILES', fill=(40,40,40), font=font(70), anchor='mm')
for i in range(12): sd.line((120, 560+i*55, 880, 560+i*55), fill=(170,170,170), width=3)
sheet = sheet.rotate(-8, expand=True, fillcolor=(120,100,80))
L.paste(sheet, (250,-200))
a = np.asarray(L).astype(np.float32); H2,W2 = a.shape[:2]; yy,xx = np.mgrid[0:H2,0:W2]
a = a*(0.85+0.25*(yy/H2))[...,None]*np.array([1.0,0.95,0.85]) + rng.normal(0,5,(H2,W2,1))
Image.fromarray(np.clip(a,0,255).astype(np.uint8)).save(f'{out}/letterhead-photo.jpg', quality=75)
print('ok')
