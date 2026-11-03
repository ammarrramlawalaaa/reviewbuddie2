import sys, numpy as np, cv2
from PIL import Image, ImageFilter
src, outdir, prefix = sys.argv[1], sys.argv[2], sys.argv[3]
names = sys.argv[4].split(',')  # 4 names: TL,TR,BL,BR
im = np.asarray(Image.open(src).convert('RGB')).astype(np.float32); H, W = im.shape[:2]
L = im.mean(axis=2)
def find_div(Lm, axis):
    # divider = run of perfectly uniform, light lines across the whole image near the centre
    for mean_min, std_max in ((225, 15), (150, 22)):  # white gutter first (works on light backgrounds), then any light gutter
        hits = []
        for i in range(600, 655):
            line = Lm[:, i] if axis == 0 else Lm[i, :]
            if line.std() < std_max and line.mean() > mean_min: hits.append(i)
        if hits: return min(hits), max(hits)
    return (624, 628)
x0, x1 = find_div(L, 0); y0, y1 = find_div(L, 1)
print('divider x', x0, x1, 'y', y0, y1)
pad = 2
boxes = [(0, 0, x0 - pad, y0 - pad), (x1 + pad + 1, 0, W, y0 - pad), (0, y1 + pad + 1, x0 - pad, H), (x1 + pad + 1, y1 + pad + 1, W, H)]
img = cv2.cvtColor(np.asarray(Image.open(src).convert('RGB')), cv2.COLOR_RGB2BGR)
for (a, b, c, d), nm in zip(boxes, names):
    t = img[b:d, a:c]
    # outer edge of the collage can carry a thin border: trim 2px on outside edges
    E = int(sys.argv[5]) if len(sys.argv) > 5 else 2  # outer-edge trim (collages with rounded corners need more)
    t = t[E if b == 0 else 0: t.shape[0] - (E if d == H else 0), E if a == 0 else 0: t.shape[1] - (E if c == W else 0)]
    s = min(t.shape[:2]); t = t[(t.shape[0] - s) // 2:(t.shape[0] - s) // 2 + s, (t.shape[1] - s) // 2:(t.shape[1] - s) // 2 + s]  # square
    t = cv2.fastNlMeansDenoisingColored(t, None, 2, 2, 5, 15)          # remove webp blocking before enlarging
    up = cv2.resize(t, (1600, 1600), interpolation=cv2.INTER_LANCZOS4)
    pil = Image.fromarray(cv2.cvtColor(up, cv2.COLOR_BGR2RGB)).filter(ImageFilter.UnsharpMask(radius=1.6, percent=55, threshold=2))
    out = f'{outdir}/{prefix}-{nm}.jpg'; pil.save(out, quality=90, optimize=True, progressive=True)
    print(out, t.shape[:2], '->', pil.size)
