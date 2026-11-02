from PIL import Image, ImageOps, ImageEnhance, ImageFilter
P="photos/"; O="/home/user/reviewbuddie2/imprint-house/product-photos/"
def L(f): return Image.open(P+f).convert("RGB")
def save(im,n):
    if max(im.size)>2000: im.thumbnail((2000,2000),Image.LANCZOS)
    im.save(O+n,quality=90,optimize=True,progressive=True)
def patch(im,cx,cy,r=75,dx=-230):
    src=im.crop((cx-r+dx,cy-r,cx+r+dx,cy+r)).filter(ImageFilter.GaussianBlur(2))
    m=Image.new("L",(2*r,2*r),0); from PIL import ImageDraw
    ImageDraw.Draw(m).ellipse((8,8,2*r-8,2*r-8),fill=255); m=m.filter(ImageFilter.GaussianBlur(10))
    im.paste(src,(cx-r,cy-r),m); return im
def enhance(im):
    im=ImageOps.autocontrast(im,cutoff=0.5,preserve_tone=True)
    im=ImageEnhance.Brightness(im).enhance(1.04); im=ImageEnhance.Contrast(im).enhance(1.06); im=ImageEnhance.Color(im).enhance(1.0)
    return im.filter(ImageFilter.UnsharpMask(radius=2,percent=80,threshold=3))
# AI renders
save(L("17.webp"),"pen-keychain-set-black-gift-box.jpg")
save(patch(L("12.webp"),1888,1888),"pen-keychain-set-black-open-box.jpg")
save(L("10.webp"),"pen-keychain-set-black-desk.jpg")
save(L("11.webp"),"engraved-pen-keychain-closeup.jpg")
save(L("16.webp"),"pen-keychain-set-silver-gift-box.jpg")
save(L("7.webp"),"pen-keychain-set-silver-closeup.jpg")
save(L("23.webp"),"pen-keychain-set-blue-gift-box.jpg")
save(patch(L("8.webp"),1890,1888),"engraved-black-metal-pen.jpg")
save(patch(L("9.webp"),1890,1888),"engraved-metal-keychain-logo.jpg")
save(L("15.webp"),"engraved-metal-keychain-rectangle.jpg")
save(L("14.webp"),"flask-pen-keychain-gift-set-black.jpg")
save(L("18.webp"),"flask-pen-keychain-gift-set-red.jpg")
save(L("22.jpg").crop((0,0,872,1078)),"flask-pen-keychain-gift-set-black-desk.jpg")
save(L("20.jpg").crop((0,205,1080,1060)),"steel-coffee-mug-blue-logo.jpg")
save(L("21.jpg").crop((0,290,1080,1080)),"steel-coffee-mug-black-logo.jpg")
save(enhance(L("19.jpg")),"name-engraved-steel-bottle-sage.jpg")
# collage 2x2
c=L("24.webp"); w,h=c.size; s=w//2; g=6
for i,(x,y) in enumerate([(0,0),(s,0),(0,s),(s,s)]):
    save(c.crop((x+g,y+g,x+s-g,y+s-g)),f"matte-roller-pen-gift-case-{i+1}.jpg")
# real phone photos
save(enhance(L("2.jpg").crop((90,540,1036,1780))),"pen-keychain-set-silver-real.jpg")
save(enhance(L("3.jpg").crop((90,560,1036,1800))),"pen-keychain-set-black-real.jpg")
save(enhance(L("4.jpg").crop((90,200,900,1740))),"matte-roller-pen-gift-case-real.jpg")
save(enhance(L("5.jpg").crop((60,360,1080,1720))),"matte-roller-pen-open-real.jpg")
