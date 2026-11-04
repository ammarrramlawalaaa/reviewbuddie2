// The Imprint House — 3D engraving designer
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, MeshStandardMaterial, MeshPhysicalMaterial, MeshBasicMaterial,
  Shape, Path, ExtrudeGeometry, CylinderGeometry, TorusGeometry, PlaneGeometry, BoxGeometry, LatheGeometry, TubeGeometry,
  CatmullRomCurve3, SphereGeometry, CircleGeometry, Vector2, Vector3, CanvasTexture, SRGBColorSpace, ACESFilmicToneMapping,
  PMREMGenerator, DirectionalLight, BackSide, DoubleSide, Color, Box3, Float32BufferAttribute
} from 'three';

/* ================= configuration ================= */
const FONTS = {
  serif:  { label: 'Classic',  css: px => `600 ${px}px Fraunces, Georgia, "Times New Roman", serif`, load: '600 40px Fraunces' },
  sans:   { label: 'Modern',   css: px => `600 ${px}px Inter, "Helvetica Neue", Arial, sans-serif`, load: '600 40px Inter' },
  bold:   { label: 'Bold',     css: px => `400 ${px}px "Archivo Black", Impact, "Arial Black", sans-serif`, load: '400 40px "Archivo Black"' },
  script: { label: 'Script',   css: px => `400 ${px}px "Great Vibes", "Brush Script MT", cursive`, load: '400 40px "Great Vibes"' },
};
const SILVER = '#d7d9dc', DARK = '#2b2c2e';
// engraving areas in model units (w = along the text direction)
const PRODUCTS = {
  keychain: { label: 'Keychain', sides: ['Front', 'Back'], area: { w: 2.42, h: 4.0 }, wrap: null,
    colours: [{ name: 'Polished silver', swatch: 'linear-gradient(135deg,#f3f4f6,#9fa4a9 50%,#e8eaec)', bg: '#4d5156', engrave: '#ffffff', finish: 'frost' }] },
  pen: { label: 'Metal pen', sides: ['Barrel'], area: { w: 4.4, h: 0.52 }, wrap: 'v',
    colours: [{ name: 'Black', swatch: '#151515', bg: '#161616', engrave: SILVER, body: 'black' },
              { name: 'Silver', swatch: '#c3c6ca', bg: '#b9bcc0', engrave: DARK, body: 'silver' },
              { name: 'Blue', swatch: '#1e3fae', bg: '#1a3aa8', engrave: SILVER, body: 'blue' }] },
  roller: { label: 'Roller pen', sides: ['Barrel'], area: { w: 4.6, h: 0.545 }, wrap: 'v',
    colours: [{ name: 'Teal & terracotta', swatch: 'linear-gradient(90deg,#2f5868 50%,#c2582f 50%)', bg: '#2f5868', engrave: SILVER }] },
  flask: { label: 'Flask', sides: ['Body'], area: { w: 5.6, h: 1.42 }, wrap: 'v',
    colours: [{ name: 'Black', swatch: '#141414', bg: '#131415', engrave: SILVER, body: 'black' },
              { name: 'Blue', swatch: '#24409a', bg: '#22409a', engrave: SILVER, body: 'blue' },
              { name: 'Red', swatch: '#a8161d', bg: '#a3121b', engrave: SILVER, body: 'red' }] },
  bottle: { label: 'Water bottle', sides: ['Body'], area: { w: 4.8, h: 1.3 }, wrap: 'v',
    colours: [{ name: 'Sage & rose gold', swatch: 'linear-gradient(90deg,#a7b79f 60%,#d39c78 60%)', bg: '#a7b79f', engrave: '#7f8683' }] },
  roundkey: { label: 'Round keychain', sides: ['Front', 'Back'], area: { w: 2.3, h: 2.3 }, wrap: null,
    colours: [{ name: 'Polished silver', swatch: 'linear-gradient(135deg,#f3f4f6,#9fa4a9 50%,#e8eaec)', bg: '#4d5156', engrave: '#ffffff', finish: 'frost' }] },
  housekey: { label: 'House keychain', sides: ['Front', 'Back'], area: { w: 2.4, h: 1.9 }, wrap: null,
    colours: [{ name: 'Polished silver', swatch: 'linear-gradient(135deg,#f3f4f6,#9fa4a9 50%,#e8eaec)', bg: '#4d5156', engrave: '#ffffff', finish: 'frost' }] },
  slimpen: { label: 'Slim stylus pen', sides: ['Barrel'], area: { w: 3.6, h: 0.4 }, wrap: 'v',
    colours: [{ name: 'Glossy black', swatch: 'linear-gradient(90deg,#0d0d0e 70%,#d9dbde 70%)', bg: '#0d0d0e', engrave: SILVER }] },
  leather: { label: 'Leather keychain', sides: ['Front'], area: { w: 3.7, h: 1.15 }, wrap: null,
    colours: [{ name: 'Tan leather', swatch: '#b5652a', bg: '#b5652a', engrave: '#4a2510', finish: 'deboss' }] },
  penlux: { label: 'Gold / rose-gold pen', sides: ['Barrel'], area: { w: 4.4, h: 0.52 }, wrap: 'v',
    colours: [{ name: 'Gold trim', swatch: 'linear-gradient(90deg,#1d1d1f 55%,#d4ad5f 55%)', bg: '#1d1d1f', engrave: SILVER, body: 'soft', trim: 'gold' },
              { name: 'Rose-gold trim', swatch: 'linear-gradient(90deg,#1d1d1f 55%,#d89a80 55%)', bg: '#1d1d1f', engrave: SILVER, body: 'soft', trim: 'rose' }] },
  ropebottle: { label: 'Rope bottle', sides: ['Body'], area: { w: 4.6, h: 1.2 }, wrap: 'v',
    colours: [{ name: 'Matte black', swatch: '#151515', bg: '#151515', engrave: SILVER }] },
  whitebottle: { label: 'White bottle', sides: ['Body'], area: { w: 4.2, h: 1.15 }, wrap: 'v',
    colours: [{ name: 'Matte white', swatch: '#efefed', bg: '#e8e8e6', engrave: '#8c9094' }] },
  mug: { label: 'Coffee mug', sides: ['Front'], area: { w: 3.1, h: 2.0 }, wrap: 'h',
    colours: [{ name: 'Navy', swatch: '#1f2c55', bg: '#1f2c55', engrave: SILVER, body: 'navy' },
              { name: 'Black', swatch: '#141414', bg: '#151515', engrave: SILVER, body: 'black' }] },
};
const ORDER = ['keychain', 'roundkey', 'housekey', 'leather', 'pen', 'penlux', 'slimpen', 'roller', 'flask', 'bottle', 'ropebottle', 'whitebottle', 'mug'];

/* ================= helpers ================= */
const $ = (id) => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function areaPx(p) { const a = PRODUCTS[p].area, k = 2048 / Math.max(a.w, a.h); return { W: Math.round(a.w * k), H: Math.round(a.h * k) }; }
function shapeOf(p) { const a = PRODUCTS[p].area, r = a.w / a.h; return r < 1 ? 'tall' : r > 3 ? 'strip' : 'wide'; }

function defaultLayout(p, side, hasLogo) {
  const s = shapeOf(p);
  const back = side > 0;
  if (s === 'tall') return hasLogo && !back
    ? { logoOn: true, logoX: .5, logoY: .36, logoSize: .72, textX: .5, textY: .8, textSize: .16 }
    : { logoOn: false, logoX: .5, logoY: .36, logoSize: .72, textX: .5, textY: .5, textSize: .2 };
  if (s === 'strip') return hasLogo
    ? { logoOn: true, logoX: .13, logoY: .5, logoSize: .86, textX: .57, textY: .5, textSize: .5 }
    : { logoOn: false, logoX: .13, logoY: .5, logoSize: .86, textX: .5, textY: .5, textSize: .56 };
  return hasLogo
    ? { logoOn: true, logoX: .5, logoY: .38, logoSize: .6, textX: .5, textY: .82, textSize: .17 }
    : { logoOn: false, logoX: .5, logoY: .38, logoSize: .6, textX: .5, textY: .5, textSize: .24 };
}

/* ================= logo → single-tone engraving mask ================= */
function loadImage(file) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file); const img = new Image();
    img.onload = () => res({ img, url }); img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('Could not read this image')); };
    img.src = url;
  });
}
/* Turns any upload (transparent PNG, flat-background JPG, phone photo of a logo,
   WhatsApp-compressed image or a real photograph) into a clean single-tone engraving mask. */
function otsu(vals) { return otsu2(vals).t; }
function otsu2(vals) { // threshold + separability (0..1): high = clean two-tone image (logo), low = continuous tones (photo)
  const hist = new Float64Array(256); let n = 0;
  for (let i = 0; i < vals.length; i++) { hist[clamp(vals[i] | 0, 0, 255)]++; n++; }
  let sum = 0, sq = 0; for (let i = 0; i < 256; i++) { sum += i * hist[i]; sq += i * i * hist[i]; }
  const varT = n ? sq / n - (sum / n) * (sum / n) : 0;
  let sumB = 0, wB = 0, best = 0, t = 128;
  for (let i = 0; i < 256; i++) { wB += hist[i]; if (!wB) continue; const wF = n - wB; if (!wF) break; sumB += i * hist[i]; const mB = sumB / wB, mF = (sum - sumB) / wF, v = wB * wF * (mB - mF) * (mB - mF); if (v > best) { best = v; t = i; } }
  return { t, eta: varT > 0 ? best / (n * n) / varT : 0 };
}
function despeckle(bin, w, h, minArea, killBorderFrames) {
  const lab = new Int32Array(w * h); const stack = new Int32Array(w * h); let id = 0;
  for (let p0 = 0; p0 < w * h; p0++) {
    if (!bin[p0] || lab[p0]) continue;
    id++; let sp = 0, area = 0, minX = w, minY = h, maxX = 0, maxY = 0, border = false; const pix = [];
    stack[sp++] = p0; lab[p0] = id;
    while (sp) {
      const p = stack[--sp]; pix.push(p); area++; const x = p % w, y = (p / w) | 0;
      if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) border = true;
      if (x > 0 && bin[p - 1] && !lab[p - 1]) { lab[p - 1] = id; stack[sp++] = p - 1; }
      if (x < w - 1 && bin[p + 1] && !lab[p + 1]) { lab[p + 1] = id; stack[sp++] = p + 1; }
      if (y > 0 && bin[p - w] && !lab[p - w]) { lab[p - w] = id; stack[sp++] = p - w; }
      if (y < h - 1 && bin[p + w] && !lab[p + w]) { lab[p + w] = id; stack[sp++] = p + w; }
    }
    const frame = killBorderFrames && border && ((maxX - minX) > w * 0.6 || (maxY - minY) > h * 0.6);
    if (area < minArea || frame) for (const p of pix) bin[p] = 0;
  }
  return bin;
}
function blurAlpha(a, w, h) { return boxMean(a, w, h, 1, null); } // soft, antialiased edges
function boxMean(src, w, h, r, roi) { // mean over a (2r+1)² window; with roi, only roi pixels count
  const W1 = w + 1, I = new Float64Array(W1 * (h + 1)), C = roi ? new Float64Array(W1 * (h + 1)) : null;
  for (let y = 0; y < h; y++) { let s = 0, c = 0; for (let x = 0; x < w; x++) { const p = y * w + x, m = roi ? roi[p] : 1; s += src[p] * m; c += m; I[(y + 1) * W1 + x + 1] = I[y * W1 + x + 1] + s; if (C) C[(y + 1) * W1 + x + 1] = C[y * W1 + x + 1] + c; } }
  const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    const y0 = Math.max(0, y - r), y1 = Math.min(h, y + r + 1);
    for (let x = 0; x < w; x++) {
      const x0 = Math.max(0, x - r), x1 = Math.min(w, x + r + 1);
      const s = I[y1 * W1 + x1] - I[y0 * W1 + x1] - I[y1 * W1 + x0] + I[y0 * W1 + x0];
      const n = C ? C[y1 * W1 + x1] - C[y0 * W1 + x1] - C[y1 * W1 + x0] + C[y0 * W1 + x0] : (x1 - x0) * (y1 - y0);
      out[y * w + x] = n > 0 ? s / n : 0;
    }
  }
  return out;
}
function slideExt(src, w, h, r, isMax) { // separable sliding max/min (monotonic queue, O(N))
  const tmp = new Float32Array(w * h), out = new Float32Array(w * h), q = new Int32Array(Math.max(w, h) + 1);
  const pass = (inp, outp, len, count, stride, step) => {
    for (let c = 0; c < count; c++) {
      const base = c * stride; let qh = 0, qt = 0, next = 0;
      for (let i = 0; i < len; i++) {
        const hi = Math.min(len - 1, i + r);
        while (next <= hi) { const v = inp[base + next * step]; while (qt > qh && (isMax ? inp[base + q[qt - 1] * step] <= v : inp[base + q[qt - 1] * step] >= v)) qt--; q[qt++] = next++; }
        while (q[qh] < i - r) qh++;
        outp[base + i * step] = inp[base + q[qh] * step];
      }
    }
  };
  pass(src, tmp, w, h, w, 1); pass(tmp, out, h, w, 1, w); return out;
}
/* A photo of a visiting card, letterhead or printout lying on a table/wall: find the sheet
   (largest solid, convex, plain region that isn't the whole frame) so only what's printed on it is engraved. */
function findSheet(D, L, w, h, thr) {
  const N = w * h, lab = new Int32Array(N), stack = new Int32Array(N); let id = 0, best = 0, bestArea = 0;
  for (let p0 = 0; p0 < N; p0++) {
    if (D[p0] <= thr || lab[p0]) continue; id++; let sp = 0, area = 0; stack[sp++] = p0; lab[p0] = id;
    while (sp) {
      const p = stack[--sp]; area++; const x = p % w;
      if (x > 0 && D[p - 1] > thr && !lab[p - 1]) { lab[p - 1] = id; stack[sp++] = p - 1; }
      if (x < w - 1 && D[p + 1] > thr && !lab[p + 1]) { lab[p + 1] = id; stack[sp++] = p + 1; }
      if (p >= w && D[p - w] > thr && !lab[p - w]) { lab[p - w] = id; stack[sp++] = p - w; }
      if (p < N - w && D[p + w] > thr && !lab[p + w]) { lab[p + w] = id; stack[sp++] = p + w; }
    }
    if (area > bestArea) { bestArea = area; best = id; }
  }
  if (bestArea < N * 0.12) return null;
  // fill holes (the print on the sheet): flood everything else from the image border
  const outside = new Uint8Array(N); let sp = 0;
  const seed = p => { if (!outside[p] && lab[p] !== best) { outside[p] = 1; stack[sp++] = p; } };
  for (let x = 0; x < w; x++) { seed(x); seed((h - 1) * w + x); } for (let y = 0; y < h; y++) { seed(y * w); seed(y * w + w - 1); }
  while (sp) { const p = stack[--sp], x = p % w; if (x > 0) seed(p - 1); if (x < w - 1) seed(p + 1); if (p >= w) seed(p - w); if (p < N - w) seed(p + w); }
  const mask = new Uint8Array(N); let area = 0, edge = 0;
  for (let p = 0; p < N; p++) if (!outside[p]) { mask[p] = 1; area++; }
  if (area > N * 0.9) return null; // it is the whole frame, not a sheet on something
  for (let x = 0; x < w; x++) edge += mask[x] + mask[(h - 1) * w + x]; for (let y = 0; y < h; y++) edge += mask[y * w] + mask[y * w + w - 1];
  if (edge > (w + h) * 2 * 0.45) return null;
  // convexity: area vs convex hull area (cards and paper are convex, even when cut off by the frame)
  const pts = []; for (let y = 0; y < h; y++) { let a = -1, b = -1; for (let x = 0; x < w; x++) if (mask[y * w + x]) { if (a < 0) a = x; b = x; } if (a >= 0) { pts.push([a, y], [b + 1, y], [a, y + 1], [b + 1, y + 1]); } }
  pts.sort((m, n) => m[0] - n[0] || m[1] - n[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); const lo = [], up = [];
  for (const p of pts) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  const hull = lo.slice(0, -1).concat(up.slice(0, -1)); let ha = 0; for (let i = 0; i < hull.length; i++) { const a = hull[i], b = hull[(i + 1) % hull.length]; ha += a[0] * b[1] - b[0] * a[1]; }
  if (area / (Math.abs(ha) / 2) < 0.9) return null;
  // rectangularity (cards/paper are rectangles; round badges are not) + tilt angle
  let minA = Infinity, ang = 0, minA2 = Infinity, ang2 = 0;
  const onFrame = (a, b) => (a[0] <= 0 && b[0] <= 0) || (a[1] <= 0 && b[1] <= 0) || (a[0] >= w && b[0] >= w) || (a[1] >= h && b[1] >= h);
  for (let i = 0; i < hull.length; i++) {
    const a = hull[i], b = hull[(i + 1) % hull.length], ex = b[0] - a[0], ey = b[1] - a[1], len = Math.hypot(ex, ey); if (len < 1e-6) continue;
    const ux = ex / len, uy = ey / len; let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
    for (const q of hull) { const u = q[0] * ux + q[1] * uy, v = -q[0] * uy + q[1] * ux; if (u < a0) a0 = u; if (u > a1) a1 = u; if (v < b0) b0 = v; if (v > b1) b1 = v; }
    const A = (a1 - a0) * (b1 - b0); if (A < minA) { minA = A; ang = Math.atan2(uy, ux); }
    if (!onFrame(a, b) && A < minA2) { minA2 = A; ang2 = Math.atan2(uy, ux); } // ignore edges made by the photo's frame for the tilt
  }
  if (minA2 < Infinity) ang = ang2;
  if (area / minA < 0.85) return null;
  let tiltSigned = ((ang * 180 / Math.PI) % 90 + 90) % 90; if (tiltSigned > 45) tiltSigned -= 90; const tiltDeg = Math.abs(tiltSigned);
  // shrink away from the sheet's edge (edge shadows, bevel, background bleeding in)
  const k = Math.max(3, Math.round(Math.sqrt(area) * 0.035)), m = boxMean(mask, w, h, k, null), roi = new Uint8Array(N); let rn = 0;
  for (let p = 0; p < N; p++) if (mask[p] && m[p] > 0.999) { roi[p] = 1; rn++; }
  if (rn < N * 0.08) return null;
  // must be a plain surface (mostly one tone), not a busy object
  const s = []; for (let p = 0; p < N; p += 3) if (roi[p]) s.push(L[p]); s.sort((a, b) => a - b); const md = s[s.length >> 1]; let near = 0;
  for (const v of s) if (Math.abs(v - md) < 28) near++;
  if (near / s.length < 0.55) return null;
  const grow = boxMean(mask, w, h, k * 2, null); let outside2 = 0;
  for (let p = 0; p < N; p++) if (!grow[p] && D[p] > thr) outside2++;
  if (outside2 > N * 0.02) return null;
  return { roi, tiltDeg, tiltSigned };
}
/* dark ink on a light surface (or light print on a dark card): even out shadows and uneven light, then split ink from surface */
function docInk(L, R, G, B, w, h, roi, invert) {
  const N = w * h, s = [], cs = [];
  for (let p = 0; p < N; p += 5) if (!roi || roi[p]) { s.push(L[p]); cs.push(Math.max(R[p], G[p], B[p]) - Math.min(R[p], G[p], B[p])); }
  s.sort((a, b) => a - b); cs.sort((a, b) => a - b); const medL = s[s.length >> 1] || 128, surfCh = cs[cs.length >> 1] || 0;
  let light = medL < 105; if (invert) light = !light;
  const r = Math.max(8, Math.round(Math.min(w, h) / 8)), src = new Float32Array(N);
  for (let p = 0; p < N; p++) src[p] = (!roi || roi[p]) ? L[p] : medL;
  // blur first so camera noise doesn't bias the surface estimate, then take the local brightest (or darkest) surface
  const bg = boxMean(slideExt(boxMean(src, w, h, 2, null), w, h, r, !light), w, h, r >> 1, null), ink = new Float32Array(N);
  for (let p = 0; p < N; p++) {
    if (roi && !roi[p]) continue;
    const b = Math.max(1, bg[p]); let v = light ? (L[p] - b) / Math.max(40, 255 - b) : (b - L[p]) / Math.max(40, b);
    const ch = (Math.max(R[p], G[p], B[p]) - Math.min(R[p], G[p], B[p]) - surfCh) / 255; // coloured print on a neutral sheet
    ink[p] = clamp(Math.max(v, ch * 1.2), 0, 1);
  }
  return { ink, light };
}
function processLogo(img, opt = {}) {
  const style = opt.style || 'auto', detail = opt.detail == null ? 0.5 : opt.detail, invert = !!opt.invert;
  const max = 900; let w = img.naturalWidth || img.width || 600, h = img.naturalHeight || img.height || 600;
  const k = Math.min(1, max / Math.max(w, h)); w = Math.max(1, Math.round(w * k)); h = Math.max(1, Math.round(h * k));
  const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d', { willReadFrequently: true });
  x.drawImage(img, 0, 0, w, h);
  const px = x.getImageData(0, 0, w, h).data, N = w * h;
  // 1. analyse
  let transp = 0; for (let i = 3; i < px.length; i += 4) if (px[i] < 200) transp++;
  const usesAlpha = transp > N * 0.02;
  const L = new Uint8ClampedArray(N), R = new Uint8ClampedArray(N), G = new Uint8ClampedArray(N), B = new Uint8ClampedArray(N);
  for (let p = 0, i = 0; p < N; p++, i += 4) { const a = px[i + 3] / 255; R[p] = px[i] * a + 255 * (1 - a); G[p] = px[i + 1] * a + 255 * (1 - a); B[p] = px[i + 2] * a + 255 * (1 - a); L[p] = 0.299 * R[p] + 0.587 * G[p] + 0.114 * B[p]; }
  const br = [], bgc = [], bb = [];
  const take = (X, Y) => { const p = Y * w + X; br.push(R[p]); bgc.push(G[p]); bb.push(B[p]); };
  for (let X = 0; X < w; X += 2) { take(X, 0); take(X, Math.min(1, h - 1)); take(X, h - 1); take(X, Math.max(0, h - 2)); }
  for (let Y = 0; Y < h; Y += 2) { take(0, Y); take(Math.min(1, w - 1), Y); take(w - 1, Y); take(Math.max(0, w - 2), Y); }
  const med = a => { const s = a.slice().sort((m, n) => m - n); return s[s.length >> 1]; };
  const sd = a => { const m = a.reduce((u, v) => u + v, 0) / a.length; return Math.sqrt(a.reduce((u, v) => u + (v - m) * (v - m), 0) / a.length); };
  const mr = med(br), mg = med(bgc), mb = med(bb), borderSD = (sd(br) + sd(bgc) + sd(bb)) / 3;
  const D = new Uint8ClampedArray(N); let near = 0;
  for (let p = 0; p < N; p++) { const d = Math.max(Math.abs(R[p] - mr), Math.abs(G[p] - mg), Math.abs(B[p] - mb)); D[p] = d; if (d < 30) near++; }
  const bgFrac = near / N, flat = !usesAlpha && borderSD < 18 && bgFrac > 0.3;
  // clean digital artwork has a perfectly even (usually white) background; phone photos never do
  const digital = borderSD < 1.5 || ((Math.min(mr, mg, mb) >= 246 || Math.max(mr, mg, mb) <= 12) && borderSD < 8);
  let roi = null, tilt = 0;
  if (style !== 'photo' && !usesAlpha) {
    const vals = []; for (let p = 0; p < N; p += 3) vals.push(D[p]); const sh = findSheet(D, L, w, h, Math.max(28, otsu(vals) * 0.8));
    // a perfectly straight box on clean digital artwork is part of the logo, not a photographed card
    if (sh && !(digital && sh.tiltDeg < 1.5)) { roi = sh.roi; tilt = sh.tiltDeg > 0.7 && sh.tiltDeg < 30 ? sh.tiltSigned : 0; }
  }
  let mode = style === 'photo' ? 'photo' : usesAlpha ? 'alpha' : roi ? 'sheet' : flat ? 'flat' : 'adaptive';
  let alpha = new Float32Array(N), stats = null;
  // 2. build mask
  if (mode === 'alpha') {
    for (let p = 0; p < N; p++) alpha[p] = px[p * 4 + 3] / 255;
    if (invert) for (let p = 0; p < N; p++) alpha[p] = alpha[p] > 0.04 ? 1 - alpha[p] : 0;
  } else if (mode === 'flat') {
    const vals = []; for (let p = 0; p < N; p += 3) vals.push(D[p]);
    const T = Math.max(18, otsu(vals) * (1.35 - detail * 0.7));
    for (let p = 0; p < N; p++) { const a = clamp((D[p] - T + 10) / 20, 0, 1); alpha[p] = invert ? 1 - a : a; }
  } else if (mode === 'sheet' || mode === 'adaptive') {
    const { ink } = docInk(L, R, G, B, w, h, roi, invert);
    const vals = []; for (let p = 0; p < N; p += 2) if (!roi || roi[p]) vals.push(ink[p] * 255);
    const o = otsu2(vals), T = Math.max(0.12, (o.t / 255) * (1.15 - detail * 0.6));
    let bin = new Uint8Array(N), on = 0;
    for (let p = 0; p < N; p++) if (ink[p] > T) bin[p] = 1;
    bin = despeckle(bin, w, h, Math.max(6, N * 0.00003), !roi);
    for (let p = 0; p < N; p++) on += bin[p];
    const inkFrac = on / (vals.length * 2); stats = { eta: +o.eta.toFixed(2), inkFrac: +inkFrac.toFixed(2), borderSD: +borderSD.toFixed(1) };
    // continuous tones everywhere → it's a real photograph, not a logo
    if (style === 'auto' && mode === 'adaptive' && (inkFrac > 0.3 || o.eta < 0.78)) mode = 'photo';
    else { const soft = blurAlpha(bin, w, h); for (let p = 0; p < N; p++) alpha[p] = soft[p] * clamp((ink[p] - T) / 0.08 + 0.75, 0, 1); }
  }
  if (mode === 'photo') {
    // engraved-photo look: local contrast boost + auto levels + error-diffusion dithering, soft rounded edges
    const Lf = Float32Array.from(L), m = boxMean(Lf, w, h, Math.max(6, Math.round(Math.min(w, h) / 12)), null);
    for (let p = 0; p < N; p++) Lf[p] = Lf[p] + 0.9 * (Lf[p] - m[p]);
    const sorted = Array.from(Lf.filter((_, i) => i % 4 === 0)).sort((a, b) => a - b);
    const lo = sorted[Math.floor(sorted.length * 0.01)], hi = sorted[Math.floor(sorted.length * 0.99)];
    const scale = Math.min(1, 520 / Math.max(w, h)), dw = Math.max(1, Math.round(w * scale)), dh = Math.max(1, Math.round(h * scale));
    const gamma = 1.2 - detail * 0.5, g = new Float32Array(dw * dh);
    for (let y = 0; y < dh; y++) for (let X = 0; X < dw; X++) {
      const sx = Math.min(w - 1, Math.round(X / scale)), sy = Math.min(h - 1, Math.round(y / scale));
      let v = clamp((Lf[sy * w + sx] - lo) / Math.max(1, hi - lo), 0, 1); v = Math.pow(v, gamma); g[y * dw + X] = invert ? 1 - v : v;
    }
    const out = new Float32Array(dw * dh);
    for (let y = 0; y < dh; y++) for (let X = 0; X < dw; X++) {
      const p = y * dw + X, o = g[p] > 0.5 ? 1 : 0, e = g[p] - o; out[p] = o;
      if (X + 1 < dw) g[p + 1] += e * 7 / 16;
      if (y + 1 < dh) { if (X > 0) g[p + dw - 1] += e * 3 / 16; g[p + dw] += e * 5 / 16; if (X + 1 < dw) g[p + dw + 1] += e / 16; }
    }
    // soft rounded-rectangle vignette so it never looks like a pasted rectangle
    const rad = Math.min(dw, dh) * 0.12, fe = Math.min(dw, dh) * 0.08;
    for (let y = 0; y < dh; y++) for (let X = 0; X < dw; X++) {
      const qx = Math.max(rad - X, X - (dw - 1 - rad), 0), qy = Math.max(rad - y, y - (dh - 1 - rad), 0);
      const dist = rad - Math.hypot(qx, qy), edge = Math.min(dist, X, y, dw - 1 - X, dh - 1 - y);
      out[y * dw + X] *= clamp(edge / fe, 0, 1);
    }
    const pc = document.createElement('canvas'); pc.width = dw; pc.height = dh; const pxx = pc.getContext('2d'); const pd = pxx.createImageData(dw, dh);
    for (let p = 0; p < dw * dh; p++) { pd.data[p * 4] = pd.data[p * 4 + 1] = pd.data[p * 4 + 2] = 255; pd.data[p * 4 + 3] = Math.round(out[p] * 255); }
    pxx.putImageData(pd, 0, 0);
    return { mask: pc, mode: 'photo', usesAlpha, flat, stats };
  }
  // 3. write mask + trim to content
  const od = x.createImageData(w, h); let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let p = 0; p < N; p++) {
    const a = alpha[p]; od.data[p * 4] = od.data[p * 4 + 1] = od.data[p * 4 + 2] = 255; od.data[p * 4 + 3] = Math.round(a * 255);
    if (a > 0.2) { const X = p % w, Y = (p / w) | 0; if (X < minX) minX = X; if (X > maxX) maxX = X; if (Y < minY) minY = Y; if (Y > maxY) maxY = Y; }
  }
  if (maxX < 0) return null;
  x.putImageData(od, 0, 0);
  let srcC = c;
  if (tilt) { // straighten a tilted card / sheet, then find the content bounds again
    const rad = -tilt * Math.PI / 180, cs = Math.abs(Math.cos(rad)), sn = Math.abs(Math.sin(rad));
    const RW = Math.ceil(w * cs + h * sn), RH = Math.ceil(w * sn + h * cs), rc = document.createElement('canvas'); rc.width = RW; rc.height = RH;
    const rx = rc.getContext('2d', { willReadFrequently: true }); rx.translate(RW / 2, RH / 2); rx.rotate(rad); rx.drawImage(c, -w / 2, -h / 2);
    const ra = rx.getImageData(0, 0, RW, RH).data; minX = RW; minY = RH; maxX = -1; maxY = -1;
    for (let Y = 0; Y < RH; Y++) for (let X = 0; X < RW; X++) if (ra[(Y * RW + X) * 4 + 3] > 50) { if (X < minX) minX = X; if (X > maxX) maxX = X; if (Y < minY) minY = Y; if (Y > maxY) maxY = Y; }
    if (maxX < 0) return null; srcC = rc; w = RW; h = RH;
  }
  const pad = 3; minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad); maxX = Math.min(w - 1, maxX + pad); maxY = Math.min(h - 1, maxY + pad);
  const t = document.createElement('canvas'); t.width = maxX - minX + 1; t.height = maxY - minY + 1;
  t.getContext('2d').drawImage(srcC, minX, minY, t.width, t.height, 0, 0, t.width, t.height);
  return { mask: t, mode, usesAlpha, flat, stats: stats || { borderSD: +borderSD.toFixed(1) } };
}

/* ================= artwork rendering ================= */
function drawArtwork(ctx, W, H, d, logo, fontKey) {
  ctx.clearRect(0, 0, W, H);
  const m = Math.min(W, H), boxes = {}; let fitted = false;
  if (logo && d.logoOn) {
    const box = d.logoSize * m; const k = Math.min(box / logo.width, box / logo.height);
    let lw = logo.width * k, lh = logo.height * k;
    const kk = Math.min(1, (W * 0.98) / lw, (H * 0.98) / lh); lw *= kk; lh *= kk;
    const x = d.logoX * W - lw / 2, y = d.logoY * H - lh / 2;
    ctx.drawImage(logo, x, y, lw, lh); boxes.logo = [x, y, lw, lh];
  }
  let lines = (d.text || '').split('\n').map(s => s.trim()).filter(Boolean).slice(0, 3);
  if (lines.length) {
    const F = FONTS[fontKey] || FONTS.serif;
    let px = d.textSize * m; ctx.font = F.css(px);
    const lh = 1.15; const maxW = W * 0.96, maxH = H * 0.96;
    const scaleFor = (ls) => { const wd = Math.max(...ls.map(l => ctx.measureText(l).width)); let kk = 1; if (wd > maxW) kk = maxW / wd; if (px * lh * ls.length * kk > maxH) kk = Math.min(kk, maxH / (px * lh * ls.length)); return kk; };
    // a single long line that doesn't fit: try balanced 2- and 3-line wraps and keep whichever stays biggest
    if (lines.length === 1 && scaleFor(lines) < 1) {
      const words = lines[0].split(/\s+/);
      let best = { ls: lines, k: scaleFor(lines) };
      for (const n of [2, 3]) {
        if (words.length < n) break;
        const target = lines[0].length / n; const ls = []; let cur = '';
        words.forEach(w => { if (cur && (cur + ' ' + w).length > target * 1.15 && ls.length < n - 1) { ls.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w; });
        ls.push(cur); const k2 = scaleFor(ls); if (k2 > best.k * 1.08) best = { ls, k: k2 };
      }
      lines = best.ls;
    }
    let k = scaleFor(lines);
    if (k < 1) { px *= k; fitted = true; ctx.font = F.css(px); }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff';
    const total = px * lh * lines.length, y0 = d.textY * H - total / 2 + px * lh / 2;
    lines.forEach((l, i) => ctx.fillText(l, d.textX * W, y0 + i * px * lh));
    const tw = Math.max(...lines.map(l => ctx.measureText(l).width));
    boxes.text = [d.textX * W - tw / 2, d.textY * H - total / 2, tw, total];
  }
  return { boxes, fitted };
}

/* ================= 3D: materials, lighting ================= */
const MAT = {
  chrome: () => new MeshStandardMaterial({ color: 0xf2f3f5, metalness: 1, roughness: 0.1 }),
  polished: () => new MeshStandardMaterial({ color: 0xf6f7f9, metalness: 1, roughness: 0.06, envMapIntensity: 1.4 }),
  steel: () => new MeshStandardMaterial({ color: 0xc9ccd0, metalness: 1, roughness: 0.28 }),
  enamel: () => new MeshPhysicalMaterial({ color: 0x050506, metalness: 0, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 0.6 }),
  coat: (c, r = 0.55, m = 0.25) => new MeshStandardMaterial({ color: c, metalness: m, roughness: r }),
  gold: () => new MeshStandardMaterial({ color: 0xe2b864, metalness: 1, roughness: 0.17 }),
  rose: () => new MeshStandardMaterial({ color: 0xe6a58e, metalness: 1, roughness: 0.17 }),
  anodised: (c) => new MeshPhysicalMaterial({ color: c, metalness: 0.75, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.2 }),
};
const BODY = {
  black: () => MAT.coat(0x141414, 0.5, 0.35), soft: () => MAT.coat(0x1d1d1f, 0.8, 0.12), silver: () => MAT.coat(0xb8bbbf, 0.32, 0.95), blue: () => MAT.anodised(0x1a3aa8),
  red: () => MAT.anodised(0xa3121b), navy: () => MAT.coat(0x1f2c55, 0.62, 0.2), flaskBlack: () => MAT.coat(0x121314, 0.5, 0.35), flaskBlue: () => MAT.coat(0x22409a, 0.55, 0.3), flaskRed: () => MAT.coat(0xa3161d, 0.55, 0.3), mugBlack: () => MAT.coat(0x151515, 0.62, 0.2),
};
function studioEnvironment(renderer) {
  // bright product-photography studio: graded dome + large softboxes, so chrome, lids and rims read silver, not black
  const s = new Scene();
  const dome = new SphereGeometry(30, 48, 24), pos = dome.attributes.position, col = [];
  for (let i = 0; i < pos.count; i++) {
    const t = pos.getY(i) / 30; // -1 bottom .. 1 top
    const zf = pos.getZ(i) / 30; // +1 = behind the camera: keep that dark so flat glossy faces read black, like a real studio
    const v = (t > 0 ? 0.40 + 0.50 * t : 0.40 + 0.30 * t) * (1 - 0.6 * Math.max(0, zf) * (1 - Math.max(0, t)));
    col.push(v, v, v * 1.02);
  }
  dome.setAttribute('color', new Float32BufferAttribute(col, 3));
  s.add(new Mesh(dome, new MeshBasicMaterial({ vertexColors: true, side: BackSide })));
  const panel = (w, h, hex, k, x, y, z) => { const m = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color: new Color(hex).multiplyScalar(k), side: DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); s.add(m); };
  panel(16, 8, 0xffffff, 5.0, 0, 12, 1);       // big overhead softbox
  panel(5, 16, 0xffffff, 3.6, -13, 2, 5);      // left strip
  panel(5, 16, 0xfff0dc, 3.0, 13, 1, -2);      // right strip, warm
  panel(18, 2.4, 0xffffff, 1.7, 0, 7.5, 12);   // front strip above the camera
  panel(18, 1.6, 0xffffff, 0.5, 0, -5, 12.5);  // front strip below the camera
  panel(10, 10, 0xffffff, 2.2, 0, 4, -14);     // back rim
  panel(14, 3, 0xffffff, 0.9, 0, -6, 9);       // low bounce card
  const pm = new PMREMGenerator(renderer); const tex = pm.fromScene(s, 0.02).texture; pm.dispose(); return tex;
}

/* ================= 3D: models ================= */
function roundedRect(w, h, r, hole = false, cx = 0, cy = 0) {
  const s = hole ? new Path() : new Shape(); const x = cx - w / 2, y = cy - h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false); return s;
}
const cyl = (rt, rb, h, mat, y, seg = 64) => { const m = new Mesh(new CylinderGeometry(rt, rb, h, seg), mat); m.position.y = y; return m; };
const wrap = (r, h, theta, y, mat) => { const m = new Mesh(new CylinderGeometry(r, r, h, 64, 1, true, -theta / 2, theta), mat); m.position.y = y; return m; };

function buildKeychain(mats) {
  // modelled on the real tag: tall rounded rectangle with a rounded chrome bezel, glossy black face,
  // a chrome oval bail at the top centre (overlapping the bezel) and a large flat split ring
  const g = new Group(); const chrome = MAT.polished();
  const W = 3.0, H = 5.1, R = 0.52, bez = 0.13, D = 0.28, top = H / 2;
  const fs = roundedRect(W, H, R); fs.holes.push(roundedRect(W - bez * 2, H - bez * 2, R - bez * 0.75, true));
  // generous bevel = a rounded (half-round) bezel profile that catches highlights like polished metal
  const frame = new Mesh(new ExtrudeGeometry(fs, { depth: D - 0.1, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.055, bevelSegments: 7, curveSegments: 48 }), chrome);
  frame.position.z = -(D - 0.1) / 2; g.add(frame);
  // mirror-polished face: in a dark room it reflects the dark surroundings and reads gunmetal, exactly like the product photos
  const mirror = new MeshStandardMaterial({ color: 0x9aa0a7, metalness: 1, roughness: 0.07, envMapIntensity: 0.85 });
  const face = new Mesh(new ExtrudeGeometry(roundedRect(W - bez * 2 + 0.02, H - bez * 2 + 0.02, R - bez * 0.75), { depth: D - 0.08, bevelEnabled: false, curveSegments: 48 }), mirror);
  face.position.z = -(D - 0.08) / 2; g.add(face);
  // engraving surfaces (front + back)
  const a = PRODUCTS.keychain.area, ey = -0.15, ez = (D - 0.08) / 2 + 0.002;
  const front = new Mesh(new PlaneGeometry(a.w, a.h), mats[0]); front.position.set(0, ey, ez); g.add(front);
  const back = new Mesh(new PlaneGeometry(a.w, a.h), mats[1]); back.position.set(0, ey, -ez); back.rotation.y = Math.PI; g.add(back);
  // oval bail: a solid chrome stadium plate with a stadium slot; its lower end overlaps the top of the tag
  const bw = 0.74, bh = 1.86, bc = top + 1.3 - bh / 2;
  const bail = roundedRect(bw, bh, bw / 2 - 0.001, false, 0, 0); bail.holes.push(roundedRect(0.4, bh - 0.36, 0.2 - 0.001, true, 0, 0));
  const bailM = new Mesh(new ExtrudeGeometry(bail, { depth: 0.16, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 6, curveSegments: 32 }), chrome);
  bailM.position.set(0, bc, -0.08); g.add(bailM);
  // the tag's stem inside the bail's lower slot
  const stem = new Mesh(new CylinderGeometry(0.09, 0.09, 0.42, 24), chrome); stem.rotation.z = Math.PI / 2; stem.position.set(0, top + 0.05, 0); g.add(stem);
  const neck = new Mesh(new BoxGeometry(0.22, 0.3, 0.18), chrome); neck.position.set(0, top - 0.05, 0); g.add(neck);
  // large flat split ring (two coils) through the top of the bail
  const rOut = 1.8, rIn = 1.6, ringY = top + 1.3 - 0.42 + rOut - 0.1;
  const ringShape = new Shape(); ringShape.absarc(0, 0, rOut, 0, Math.PI * 2, false);
  const hole = new Path(); hole.absarc(0, 0, rIn, 0, Math.PI * 2, true); ringShape.holes.push(hole);
  const ringGeo = new ExtrudeGeometry(ringShape, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.025, bevelSegments: 4, curveSegments: 140 });
  const ring = new Group();
  const c1 = new Mesh(ringGeo, chrome); c1.position.z = -0.085; ring.add(c1);
  const c2 = new Mesh(ringGeo, chrome); c2.position.z = 0.015; ring.add(c2);
  ring.position.set(0, ringY, -0.04); ring.rotation.y = 0.1; g.add(ring);
  return { group: g, base: { x: -0.04, y: 0, z: 0 }, pitch: 0.05, fit: 1.08, sideYaw: [0, Math.PI] };
}
function buildPen(mats, colour) {
  const g = new Group(); const body = BODY[colour.body || 'black'](), chrome = colour.trim ? MAT[colour.trim]() : MAT.chrome();
  g.add(cyl(0.34, 0.035, 1.5, chrome, 0.75));
  const tip = new Mesh(new SphereGeometry(0.04, 12, 12), chrome); tip.position.y = 0.01; g.add(tip);
  g.add(cyl(0.40, 0.345, 3.2, body, 3.1)); g.add(cyl(0.418, 0.418, 0.1, chrome, 4.76)); g.add(cyl(0.405, 0.405, 0.26, body, 4.94));
  g.add(cyl(0.418, 0.418, 0.1, chrome, 5.12)); g.add(cyl(0.42, 0.405, 5.3, body, 7.82)); g.add(cyl(0.42, 0.42, 1.25, chrome, 11.1));
  const dome = new Mesh(new SphereGeometry(0.42, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), chrome); dome.scale.y = 0.38; dome.position.y = 11.72; g.add(dome);
  const clip = new Mesh(new BoxGeometry(0.2, 3.9, 0.11), chrome); clip.position.set(-0.52, 9.7, 0); g.add(clip);
  const clipTop = new Mesh(new BoxGeometry(0.2, 0.5, 0.36), chrome); clipTop.position.set(-0.36, 11.45, 0); g.add(clipTop);
  const clipEnd = new Mesh(new SphereGeometry(0.11, 16, 12), chrome); clipEnd.position.set(-0.53, 7.75, 0); g.add(clipEnd);
  const a = PRODUCTS.pen.area; g.add(wrap(0.4155, a.w, a.h / 0.4155, 7.9, mats[0]));
  g.children.forEach(c => c.position.y -= 5.9);
  return { group: g, base: { x: 0, y: 0, z: -1.3 }, pitch: 0.1, fit: 1.15, sideYaw: [0] };
}
function buildRoller(mats) {
  const g = new Group(); const teal = MAT.coat(0x2f5868, 0.78, 0.12), terra = MAT.coat(0xc2582f, 0.8, 0.08), dark = MAT.coat(0x111111, 0.45, 0.6);
  g.add(cyl(0.45, 0.45, 6.1, teal, 3.05));
  const end = new Mesh(new CircleGeometry(0.45, 48), teal); end.rotation.x = Math.PI / 2; g.add(end);
  for (let i = 0; i < 6; i++) g.add(cyl(0.462, 0.462, 0.045, dark, 6.18 + i * 0.065, 48));
  g.add(cyl(0.455, 0.455, 0.42, dark, 6.31)); g.add(cyl(0.47, 0.47, 4.4, terra, 8.75));
  const dome = new Mesh(new SphereGeometry(0.47, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), terra); dome.scale.y = 0.75; dome.position.y = 10.95; g.add(dome);
  const cm = MAT.coat(0x2f5868, 0.6, 0.3);
  const clip = new Mesh(new BoxGeometry(0.22, 3.4, 0.1), cm); clip.position.set(-0.57, 9.1, 0); g.add(clip);
  const clipTop = new Mesh(new BoxGeometry(0.22, 0.4, 0.3), cm); clipTop.position.set(-0.45, 10.7, 0); g.add(clipTop);
  const a = PRODUCTS.roller.area; g.add(wrap(0.454, a.w, a.h / 0.454, 3.1, mats[0]));
  g.children.forEach(c => c.position.y -= 5.5);
  return { group: g, base: { x: 0, y: 0, z: -1.3 }, pitch: 0.1, fit: 1.15, sideYaw: [0] };
}
function buildFlask(mats, colour) {
  const g = new Group(); const body = colour.body === 'red' ? BODY.flaskRed() : colour.body === 'blue' ? BODY.flaskBlue() : BODY.flaskBlack();
  const prof = [new Vector2(0, 0), new Vector2(1.18, 0), new Vector2(1.27, 0.05), new Vector2(1.3, 0.18), new Vector2(1.3, 8.0), new Vector2(1.27, 8.1), new Vector2(0, 8.1)];
  g.add(new Mesh(new LatheGeometry(prof, 96), body));
  g.add(cyl(1.24, 1.24, 0.16, MAT.coat(0x0a0a0a, 0.6, 0.2), 8.18));
  const lid = new Mesh(new LatheGeometry([new Vector2(0, 0), new Vector2(1.3, 0), new Vector2(1.3, 1.55), new Vector2(1.24, 1.68), new Vector2(0, 1.7)], 96), body); lid.position.y = 8.26; g.add(lid);
  const a = PRODUCTS.flask.area; g.add(wrap(1.305, a.w, a.h / 1.305, 3.9, mats[0]));
  g.children.forEach(c => c.position.y -= 5.0);
  return { group: g, base: { x: 0, y: 0, z: 0 }, pitch: 0.1, fit: 1.22, sideYaw: [0] };
}
function buildMug(mats, colour) {
  const g = new Group(); const body = colour.body === 'black' ? BODY.mugBlack() : BODY.navy(), chrome = MAT.chrome(), steel = MAT.steel();
  const outer = new Mesh(new CylinderGeometry(2.0, 1.96, 3.4, 96, 1, true), body); outer.position.y = 1.7; g.add(outer);
  const bottom = new Mesh(new CircleGeometry(1.96, 96), body); bottom.rotation.x = Math.PI / 2; g.add(bottom);
  const band = new Mesh(new CylinderGeometry(2.0, 2.0, 0.62, 96, 1, true), chrome); band.position.y = 3.71; g.add(band);
  const inner = new Mesh(new CylinderGeometry(1.92, 1.9, 3.95, 96, 1, true), new MeshStandardMaterial({ color: 0xc9ccd0, metalness: 1, roughness: 0.3, side: BackSide })); inner.position.y = 2.04; g.add(inner);
  const ib = new Mesh(new CircleGeometry(1.9, 96), steel); ib.rotation.x = -Math.PI / 2; ib.position.y = 0.08; g.add(ib);
  const lip = new Mesh(new TorusGeometry(1.96, 0.045, 12, 96), chrome); lip.rotation.x = Math.PI / 2; lip.position.y = 4.02; g.add(lip);
  const curve = new CatmullRomCurve3([new Vector3(1.9, 3.15, 0), new Vector3(2.75, 3.15, 0), new Vector3(3.05, 2.6, 0), new Vector3(3.0, 1.35, 0), new Vector3(2.7, 0.95, 0), new Vector3(1.95, 0.95, 0)]);
  g.add(new Mesh(new TubeGeometry(curve, 64, 0.17, 20, false), body));
  const a = PRODUCTS.mug.area; g.add(wrap(1.994, a.h, a.w / 1.994, 1.75, mats[0]));
  g.children.forEach(c => c.position.y -= 2.0);
  return { group: g, base: { x: 0, y: -0.35, z: 0 }, pitch: 0.22, fit: 1.25, sideYaw: [0] };
}
function buildBottle(mats) {
  // sage double-wall bottle with a polished rose-gold collar and cap, and a tan carry loop
  const g = new Group(); const sage = MAT.coat(0xa7b79f, 0.72, 0.12), rose = new MeshStandardMaterial({ color: 0xe0a585, metalness: 1, roughness: 0.16 });
  const prof = [new Vector2(0, 0), new Vector2(1.12, 0), new Vector2(1.2, 0.08), new Vector2(1.22, 0.3), new Vector2(1.22, 6.55), new Vector2(1.16, 6.85), new Vector2(1.02, 7.05), new Vector2(0, 7.05)];
  g.add(new Mesh(new LatheGeometry(prof, 96), sage));
  g.add(new Mesh(new LatheGeometry([new Vector2(0, 0), new Vector2(1.0, 0), new Vector2(1.06, 0.08), new Vector2(1.06, 0.5), new Vector2(1.0, 0.6), new Vector2(0, 0.6)], 96), rose).translateY(6.95));
  g.add(cyl(0.99, 0.99, 0.08, MAT.coat(0x1a1a1a, 0.7, 0.1), 7.6));
  g.add(cyl(1.0, 1.0, 0.62, sage, 7.95));
  const cap = new Mesh(new SphereGeometry(1.0, 64, 24, 0, Math.PI * 2, 0, Math.PI / 2), rose); cap.scale.y = 0.32; cap.position.y = 8.25; g.add(cap);
  const strap = new CatmullRomCurve3([new Vector3(0.95, 7.25, 0.25), new Vector3(1.35, 7.0, 0.4), new Vector3(1.55, 6.2, 0.35), new Vector3(1.5, 5.4, 0.2), new Vector3(1.3, 5.3, 0.05), new Vector3(1.3, 6.0, -0.1), new Vector3(1.12, 7.1, -0.2)]);
  g.add(new Mesh(new TubeGeometry(strap, 80, 0.06, 10, false), MAT.coat(0xc9a77c, 0.85, 0)));
  const a = PRODUCTS.bottle.area; g.add(wrap(1.225, a.w, a.h / 1.225, 3.3, mats[0]));
  g.children.forEach(c => c.position.y -= 4.3);
  return { group: g, base: { x: 0, y: 0, z: 0 }, pitch: 0.1, fit: 1.22, sideYaw: [0] };
}
function stitchPath(g, shape, z, keep, mat) {
  // dashed stitching along a path: short boxes on every other segment
  const pts = shape.getSpacedPoints(90);
  for (let i = 0; i < pts.length - 1; i += 2) {
    const a = pts[i], b = pts[i + 1]; if (!keep(a) || !keep(b)) continue;
    const len = Math.hypot(b.x - a.x, b.y - a.y), d = new Mesh(new BoxGeometry(0.035, len * 0.9, 0.02), mat);
    d.position.set((a.x + b.x) / 2, (a.y + b.y) / 2, z); d.rotation.z = Math.atan2(b.y - a.y, b.x - a.x) - Math.PI / 2; g.add(d);
  }
}
function buildLeather(mats) {
  // tan leather strap with contrast stitching, a folded flap with a brass snap and a gold split ring
  const g = new Group();
  const leather = new MeshStandardMaterial({ color: 0xb5652a, roughness: 0.7, metalness: 0 });
  const thread = new MeshStandardMaterial({ color: 0xeab84a, roughness: 0.6, metalness: 0 });
  const gold = MAT.gold();
  const W = 1.55, H = 5.6, T = 0.16, front = T / 2 + 0.03;
  const strap = new Mesh(new ExtrudeGeometry(roundedRect(W, H, 0.32), { depth: T, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3, curveSegments: 24 }), leather);
  strap.position.z = -T / 2; g.add(strap);
  const flapH = 1.3, flapY = H / 2 - flapH / 2 + 0.02, flapZ = front + 0.005;
  const flap = new Mesh(new ExtrudeGeometry(roundedRect(W, flapH, 0.32), { depth: 0.1, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.02, bevelSegments: 3, curveSegments: 24 }), leather);
  flap.position.set(0, flapY, flapZ); g.add(flap);
  const snapBase = new Mesh(new CylinderGeometry(0.2, 0.2, 0.05, 32), gold); snapBase.rotation.x = Math.PI / 2; snapBase.position.set(0, flapY - 0.12, flapZ + 0.14); g.add(snapBase);
  const snap = new Mesh(new SphereGeometry(0.16, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), gold); snap.rotation.x = Math.PI / 2; snap.scale.y = 0.45; snap.position.set(0, flapY - 0.12, flapZ + 0.16); g.add(snap);
  const flapBottom = flapY - flapH / 2;
  stitchPath(g, roundedRect(W - 0.26, H - 0.26, 0.22), front + 0.012, p => p.y < flapBottom - 0.05, thread);
  stitchPath(g, roundedRect(W - 0.26, flapH - 0.22, 0.22, false, 0, flapY), flapZ + 0.135, () => true, thread);
  // engraving runs along the strap (reads bottom to top, like the photos)
  const a = PRODUCTS.leather.area, ey = (-H / 2 + 0.3 + flapBottom - 0.12) / 2;
  const plate = new Mesh(new PlaneGeometry(a.w, a.h), mats[0]); plate.rotation.z = Math.PI / 2; plate.position.set(0, ey, front + 0.004); g.add(plate);
  const rOut = 1.15, rIn = 1.0, ringShape = new Shape(); ringShape.absarc(0, 0, rOut, 0, Math.PI * 2, false);
  const hole = new Path(); hole.absarc(0, 0, rIn, 0, Math.PI * 2, true); ringShape.holes.push(hole);
  const ringGeo = new ExtrudeGeometry(ringShape, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3, curveSegments: 120 });
  const ring = new Group(); const c1 = new Mesh(ringGeo, gold); c1.position.z = -0.07; ring.add(c1); const c2 = new Mesh(ringGeo, gold); c2.position.z = 0.01; ring.add(c2);
  ring.position.set(0, H / 2 + rOut - 0.35, -0.02); ring.rotation.y = 0.12; g.add(ring);
  return { group: g, base: { x: 0, y: 0, z: 0 }, pitch: 0.06, fit: 1.12, sideYaw: [0] };
}
function buildRopeBottle(mats) {
  // matte black steel bottle, steel ring, black lid with a braided white rope loop
  const g = new Group(); const body = MAT.coat(0x161617, 0.6, 0.3), steel = MAT.steel();
  const rope = new MeshStandardMaterial({ color: 0xf1f1ee, roughness: 0.9, metalness: 0 }), sleeve = MAT.coat(0x777a7d, 0.6, 0.1);
  const prof = [new Vector2(0, 0), new Vector2(1.06, 0), new Vector2(1.13, 0.07), new Vector2(1.16, 0.3), new Vector2(1.18, 4.6), new Vector2(1.14, 6.5), new Vector2(1.08, 6.95), new Vector2(0, 6.95)];
  g.add(new Mesh(new LatheGeometry(prof, 96), body));
  g.add(cyl(1.085, 1.085, 0.13, steel, 7.0));
  g.add(cyl(1.07, 1.07, 1.0, body, 7.56));
  const top = new Mesh(new CircleGeometry(0.62, 48), MAT.coat(0x0f0f10, 0.5, 0.3)); top.rotation.x = -Math.PI / 2; top.position.y = 8.065; g.add(top);
  const loop = new CatmullRomCurve3([new Vector3(-0.55, 8.05, 0.1), new Vector3(-0.62, 8.55, 0.15), new Vector3(-0.2, 9.0, 0.2), new Vector3(0.45, 8.95, 0.2), new Vector3(0.8, 8.45, 0.15), new Vector3(0.95, 7.9, 0.4), new Vector3(1.0, 7.5, 0.55)]);
  g.add(new Mesh(new TubeGeometry(loop, 80, 0.085, 12, false), rope));
  const sl = new Mesh(new CylinderGeometry(0.13, 0.13, 0.42, 20), sleeve); sl.position.set(0.98, 7.62, 0.5); sl.rotation.z = 0.15; g.add(sl);
  const a = PRODUCTS.ropebottle.area; g.add(wrap(1.175, a.w, a.h / 1.175, 3.4, mats[0]));
  g.children.forEach(c => c.position.y -= 4.5);
  return { group: g, base: { x: 0, y: 0, z: 0 }, pitch: 0.1, fit: 1.22, sideYaw: [0] };
}
function buildWhiteBottle(mats) {
  // matte white steel bottle with rounded shoulders, white screw cap and a dark ring at the neck
  const g = new Group(); const white = MAT.coat(0xeeeeec, 0.72, 0.05);
  const prof = [new Vector2(0, 0), new Vector2(0.97, 0), new Vector2(1.03, 0.08), new Vector2(1.06, 0.3), new Vector2(1.06, 5.1), new Vector2(1.02, 5.65), new Vector2(0.88, 6.05), new Vector2(0.7, 6.32), new Vector2(0.64, 6.42), new Vector2(0, 6.42)];
  g.add(new Mesh(new LatheGeometry(prof, 96), white));
  g.add(cyl(0.645, 0.645, 0.11, MAT.coat(0x2a2b2c, 0.35, 0.7), 6.48));
  g.add(cyl(0.67, 0.67, 0.86, white, 6.97));
  const capTop = new Mesh(new CircleGeometry(0.67, 48), white); capTop.rotation.x = -Math.PI / 2; capTop.position.y = 7.4; g.add(capTop);
  const a = PRODUCTS.whitebottle.area; g.add(wrap(1.062, a.w, a.h / 1.062, 2.9, mats[0]));
  g.children.forEach(c => c.position.y -= 3.8);
  return { group: g, base: { x: 0, y: 0, z: 0 }, pitch: 0.1, fit: 1.22, sideYaw: [0] };
}
function buildRoundKeychain(mats) {
  // round mirror-polished disc with a raised rounded rim, a small lug at the top, an oval link and a split ring
  const g = new Group(); const chrome = MAT.polished();
  const R = 1.75, rim = 0.15, D = 0.26, top = R;
  const rs = new Shape(); rs.absarc(0, 0, R, 0, Math.PI * 2, false);
  const rh = new Path(); rh.absarc(0, 0, R - rim, 0, Math.PI * 2, true); rs.holes.push(rh);
  const rimM = new Mesh(new ExtrudeGeometry(rs, { depth: D - 0.1, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.055, bevelSegments: 7, curveSegments: 120 }), chrome);
  rimM.position.z = -(D - 0.1) / 2; g.add(rimM);
  const mirror = new MeshStandardMaterial({ color: 0x9aa0a7, metalness: 1, roughness: 0.07, envMapIntensity: 0.85 });
  const fc = new Shape(); fc.absarc(0, 0, R - rim + 0.01, 0, Math.PI * 2, false);
  const face = new Mesh(new ExtrudeGeometry(fc, { depth: D - 0.08, bevelEnabled: false, curveSegments: 120 }), mirror);
  face.position.z = -(D - 0.08) / 2; g.add(face);
  const a = PRODUCTS.roundkey.area, ez = (D - 0.08) / 2 + 0.002;
  const front = new Mesh(new PlaneGeometry(a.w, a.h), mats[0]); front.position.set(0, 0, ez); g.add(front);
  const back = new Mesh(new PlaneGeometry(a.w, a.h), mats[1]); back.position.set(0, 0, -ez); back.rotation.y = Math.PI; g.add(back);
  hangLinkAndRing(g, chrome, top);
  return { group: g, base: { x: -0.04, y: 0, z: 0 }, pitch: 0.05, fit: 1.08, sideYaw: [0, Math.PI] };
}
function hangLinkAndRing(g, chrome, top) {
  // lug on top of the tag (turned side-on, so it threads through the link), an oval link facing the camera, and a flat split ring
  const lug = new Mesh(new TorusGeometry(0.2, 0.075, 16, 48), chrome); lug.rotation.y = Math.PI / 2; lug.position.set(0, top + 0.16, 0); g.add(lug);
  const lw = 0.52, lh = 1.25, ly = top + 0.16 + lh / 2 - 0.05;
  const link = roundedRect(lw, lh, lw / 2 - 0.001); link.holes.push(roundedRect(0.26, lh - 0.28, 0.13 - 0.001, true));
  const linkM = new Mesh(new ExtrudeGeometry(link, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.045, bevelSize: 0.04, bevelSegments: 5, curveSegments: 32 }), chrome);
  linkM.position.set(0, ly, -0.05); g.add(linkM);
  const rOut = 1.5, rIn = 1.33, ringY = ly + lh / 2 - 0.16 + rOut;
  const ringShape = new Shape(); ringShape.absarc(0, 0, rOut, 0, Math.PI * 2, false);
  const hole = new Path(); hole.absarc(0, 0, rIn, 0, Math.PI * 2, true); ringShape.holes.push(hole);
  const ringGeo = new ExtrudeGeometry(ringShape, { depth: 0.045, bevelEnabled: true, bevelThickness: 0.022, bevelSize: 0.022, bevelSegments: 4, curveSegments: 140 });
  const ring = new Group(); const c1 = new Mesh(ringGeo, chrome); c1.position.z = -0.075; ring.add(c1); const c2 = new Mesh(ringGeo, chrome); c2.position.z = 0.012; ring.add(c2);
  ring.position.set(0, ringY, -0.03); ring.rotation.y = 0.1; g.add(ring);
}
function roundedPoly(pts, r, hole = false) {
  // closed polygon with every corner rounded (radius capped by the neighbouring edge lengths)
  const s = hole ? new Path() : new Shape(), n = pts.length;
  for (let i = 0; i < n; i++) {
    const p = pts[i], a = pts[(i + n - 1) % n], b = pts[(i + 1) % n];
    const la = Math.hypot(a[0] - p[0], a[1] - p[1]), lb = Math.hypot(b[0] - p[0], b[1] - p[1]), rr = Math.min(r, la * 0.45, lb * 0.45);
    const x1 = p[0] + (a[0] - p[0]) / la * rr, y1 = p[1] + (a[1] - p[1]) / la * rr, x2 = p[0] + (b[0] - p[0]) / lb * rr, y2 = p[1] + (b[1] - p[1]) / lb * rr;
    if (i === 0) s.moveTo(x1, y1); else s.lineTo(x1, y1);
    s.quadraticCurveTo(p[0], p[1], x2, y2);
  }
  s.closePath(); return s;
}
function housePts(wall, eave, step, bottom, apex) {
  return [[-wall, bottom], [wall, bottom], [wall, step], [eave, step], [0, apex], [-eave, step], [-wall, step]];
}
function buildHouseKeychain(mats) {
  // house-shaped mirror-polished tag (walls, pitched roof with small eaves) with a raised rim, lug, oval link and split ring
  const g = new Group(); const chrome = MAT.polished();
  const wall = 1.45, eave = 1.72, step = 0.2, bottom = -1.85, apex = 1.45, bez = 0.1, D = 0.26;
  const m = (apex - step) / eave, k = bez * Math.sqrt(1 + m * m);
  const iStep = step + bez, iApex = apex - k, iEave = (iApex - iStep) / m;
  const inner = housePts(wall - bez, Math.max(iEave, wall - bez + 0.02), iStep, bottom + bez, iApex);
  const outer = roundedPoly(housePts(wall, eave, step, bottom, apex), 0.16);
  outer.holes.push(roundedPoly(inner, 0.08, true));
  const rimM = new Mesh(new ExtrudeGeometry(outer, { depth: D - 0.1, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 7, curveSegments: 16 }), chrome);
  rimM.position.z = -(D - 0.1) / 2; g.add(rimM);
  const mirror = new MeshStandardMaterial({ color: 0x9aa0a7, metalness: 1, roughness: 0.07, envMapIntensity: 0.85 });
  const face = new Mesh(new ExtrudeGeometry(roundedPoly(inner, 0.08), { depth: D - 0.08, bevelEnabled: false, curveSegments: 16 }), mirror);
  face.position.z = -(D - 0.08) / 2; g.add(face);
  const a = PRODUCTS.housekey.area, ey = bottom + bez + 0.25 + a.h / 2, ez = (D - 0.08) / 2 + 0.002;
  const front = new Mesh(new PlaneGeometry(a.w, a.h), mats[0]); front.position.set(0, ey, ez); g.add(front);
  const back = new Mesh(new PlaneGeometry(a.w, a.h), mats[1]); back.position.set(0, ey, -ez); back.rotation.y = Math.PI; g.add(back);
  hangLinkAndRing(g, chrome, apex - 0.02);
  return { group: g, base: { x: -0.04, y: 0, z: 0 }, pitch: 0.05, fit: 1.08, sideYaw: [0, Math.PI] };
}
function buildSlimPen(mats) {
  // slim glossy-black ballpoint: chrome cone tip, chrome rings, long chrome clip and a black stylus dome on top
  const g = new Group(); const body = MAT.enamel(), chrome = MAT.chrome(), rubber = MAT.coat(0x121213, 0.85, 0);
  const r = 0.3;
  g.add(cyl(0.27, 0.03, 1.25, chrome, 0.625));
  const tip = new Mesh(new SphereGeometry(0.035, 12, 12), chrome); tip.position.y = 0.01; g.add(tip);
  g.add(cyl(r + 0.012, r + 0.012, 0.09, chrome, 1.29));
  g.add(cyl(r, r, 4.4, body, 3.54));
  g.add(cyl(r + 0.014, r + 0.014, 0.1, chrome, 5.79));
  g.add(cyl(r, r, 5.2, body, 8.44));
  g.add(cyl(r + 0.014, r + 0.014, 0.1, chrome, 11.09));
  g.add(cyl(r, r - 0.01, 0.42, body, 11.35));
  g.add(cyl(r - 0.02, r - 0.02, 0.06, chrome, 11.59));
  const dome = new Mesh(new SphereGeometry(r - 0.03, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), rubber); dome.scale.y = 0.7; dome.position.y = 11.62; g.add(dome);
  const clip = new Mesh(new BoxGeometry(0.15, 3.5, 0.08), chrome); clip.position.set(-0.4, 9.25, 0); g.add(clip);
  const clipTop = new Mesh(new BoxGeometry(0.15, 0.36, 0.26), chrome); clipTop.position.set(-0.3, 10.86, 0); g.add(clipTop);
  const clipEnd = new Mesh(new SphereGeometry(0.085, 16, 12), chrome); clipEnd.position.set(-0.41, 7.5, 0); g.add(clipEnd);
  const a = PRODUCTS.slimpen.area; g.add(wrap(r + 0.0015, a.w, a.h / (r + 0.0015), 3.5, mats[0]));
  g.children.forEach(c => c.position.y -= 5.9);
  return { group: g, base: { x: 0, y: 0, z: -1.3 }, pitch: 0.1, fit: 1.15, sideYaw: [0] };
}
const BUILD = { keychain: buildKeychain, roundkey: buildRoundKeychain, housekey: buildHouseKeychain, slimpen: buildSlimPen, leather: buildLeather, pen: buildPen, penlux: buildPen, roller: buildRoller, flask: buildFlask, bottle: buildBottle, ropebottle: buildRopeBottle, whitebottle: buildWhiteBottle, mug: buildMug };

/* ================= engraving surface (texture per side) ================= */
class Surface {
  constructor(product) {
    this.product = product; const { W, H } = areaPx(product); this.W = W; this.H = H;
    this.logical = document.createElement('canvas'); this.logical.width = W; this.logical.height = H;
    this.glowL = document.createElement('canvas'); this.glowL.width = W; this.glowL.height = H;
    const rot = PRODUCTS[product].wrap === 'v';
    this.rot = rot;
    this.phys = document.createElement('canvas'); this.phys.width = rot ? H : W; this.phys.height = rot ? W : H;
    this.glowP = document.createElement('canvas'); this.glowP.width = this.phys.width; this.glowP.height = this.phys.height;
    this.tex = new CanvasTexture(this.phys); this.tex.colorSpace = SRGBColorSpace; this.tex.anisotropy = 8;
    this.gtex = new CanvasTexture(this.glowP); this.gtex.colorSpace = SRGBColorSpace;
    this.mat = new MeshStandardMaterial({ map: this.tex, transparent: true, metalness: 0.9, roughness: 0.38, emissive: 0xffffff, emissiveMap: this.gtex, emissiveIntensity: 0, polygonOffset: true, polygonOffsetFactor: -4, depthWrite: false });
  }
  toPhys(src, dst) {
    const x = dst.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, dst.width, dst.height);
    if (this.rot) { x.translate(dst.width / 2, dst.height / 2); x.rotate(-Math.PI / 2); x.translate(-dst.height / 2, -dst.width / 2); }
    x.drawImage(src, 0, 0);
  }
  // art: canvas with full artwork; progress 0..1 for laser burn
  update(art, colour, progress = 1) {
    const W = this.W, H = this.H, front = W * progress;
    const l = this.logical.getContext('2d'); l.clearRect(0, 0, W, H);
    l.save(); l.beginPath(); l.rect(0, 0, front, H); l.clip(); l.drawImage(art, 0, 0); l.restore();
    this.toPhys(this.logical, this.phys);
    const g = this.glowL.getContext('2d'); g.globalCompositeOperation = 'source-over'; g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
    if (progress < 1) {
      g.save(); g.beginPath(); g.rect(0, 0, front, H); g.clip(); g.drawImage(art, 0, 0); g.restore();
      g.globalCompositeOperation = 'source-atop';
      const gr = g.createLinearGradient(front - W * 0.3, 0, front, 0);
      gr.addColorStop(0, 'rgba(255,110,30,0.05)'); gr.addColorStop(0.85, 'rgba(255,150,60,0.9)'); gr.addColorStop(1, 'rgba(255,245,210,1)');
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      g.globalCompositeOperation = 'destination-over'; g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
    }
    this.toPhys(this.glowL, this.glowP);
    this.mat.color.set(colour.engrave); this.mat.emissiveIntensity = progress < 1 ? 2.2 : 0;
    // frosted engraving (on polished metal) is matte and bright; coating-removal engraving is metallic
    if (colour.finish === 'frost') { this.mat.metalness = 0.05; this.mat.roughness = 0.82; } else if (colour.finish === 'deboss') { this.mat.metalness = 0; this.mat.roughness = 0.95; } else { this.mat.metalness = 0.9; this.mat.roughness = 0.38; }
    this.tex.needsUpdate = true; this.gtex.needsUpdate = true;
  }
}

/* ================= the designer ================= */
export function init(cfg = {}) {
  const stage = $('ihdStage'), ed = $('ihdEditor');
  if (!stage || !ed) return;
  const S = {
    product: 'keychain', colour: 0, side: 0, font: 'serif', logo: null, logoImg: null, invert: false, qty: 100, logoStyle: 'auto', detail: 0.5, logoMode: '',
    designs: {}, // key product:side -> layout + text
  };
  const key = (p = S.product, s = S.side) => p + ':' + s;
  const design = (p = S.product, s = S.side) => {
    const k = key(p, s);
    if (!S.designs[k]) S.designs[k] = Object.assign({ text: s === 0 ? 'Your Business' : '', touched: false }, defaultLayout(p, s, !!S.logo));
    return S.designs[k];
  };

  /* ---------- 3D setup ---------- */
  let renderer = null, scene, camera, pivot, model = null, surfaces = [], shadow;
  try {
    const cv = document.createElement('canvas'); cv.className = 'ihd-canvas';
    renderer = new WebGLRenderer({ canvas: cv, antialias: true, alpha: true, preserveDrawingBuffer: false });
    stage.appendChild(cv);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0; renderer.outputColorSpace = SRGBColorSpace;
    scene = new Scene(); scene.environment = studioEnvironment(renderer);
    const k1 = new DirectionalLight(0xffffff, 1.4); k1.position.set(4, 6, 8); scene.add(k1);
    const k2 = new DirectionalLight(0xffd9a8, 0.8); k2.position.set(-6, 3, -5); scene.add(k2);
    const k3 = new DirectionalLight(0xffffff, 0.6); k3.position.set(0, 2, -9); scene.add(k3);
    camera = new PerspectiveCamera(28, 1, 0.1, 200);
    const sc = document.createElement('canvas'); sc.width = sc.height = 256; const sx = sc.getContext('2d');
    const rg = sx.createRadialGradient(128, 128, 0, 128, 128, 128); rg.addColorStop(0, 'rgba(0,0,0,.55)'); rg.addColorStop(1, 'rgba(0,0,0,0)'); sx.fillStyle = rg; sx.fillRect(0, 0, 256, 256);
    shadow = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ map: new CanvasTexture(sc), transparent: true, depthWrite: false })); shadow.rotation.x = -Math.PI / 2; scene.add(shadow);
    pivot = new Group(); scene.add(pivot);
    stage.classList.add('ihd-ready');
  } catch (e) { renderer = null; stage.classList.add('ihd-nogl'); const l = stage.querySelector('.ihd-loading'); if (l) l.textContent = '3D preview isn\u2019t supported on this device \u2014 use the flat preview in step 5.'; }

  const artCanvases = {}; // key -> canvas with full-res artwork
  function artFor(p, s) {
    const k = key(p, s); const { W, H } = areaPx(p);
    if (!artCanvases[k]) { artCanvases[k] = document.createElement('canvas'); artCanvases[k].width = W; artCanvases[k].height = H; }
    const c = artCanvases[k]; const r = drawArtwork(c.getContext('2d'), W, H, design(p, s), S.logo, S.font); c._fit = r; return c;
  }

  let yaw = 0, pitch = 0, targetYaw = 0, dragging = false, lx = 0, ly = 0, idle = 0, burn = -1, appear = 0;
  function build3D() {
    if (!renderer) return;
    if (model) { pivot.remove(model.group); model.group.traverse(o => o.geometry && o.geometry.dispose()); }
    const P = PRODUCTS[S.product], C = P.colours[S.colour] || P.colours[0];
    surfaces = P.sides.map(() => new Surface(S.product));
    model = BUILD[S.product](surfaces.map(s => s.mat), C);
    model.group.rotation.set(model.base.x, model.base.y, model.base.z);
    const box = new Box3().setFromObject(model.group); const ctr = box.getCenter(new Vector3()); const size = box.getSize(new Vector3());
    model.group.position.sub(ctr); pivot.add(model.group);
    const r = stage.getBoundingClientRect(); camera.aspect = Math.max(r.width, 1) / Math.max(r.height, 1); camera.updateProjectionMatrix();
    const t = Math.tan(camera.fov * Math.PI / 360);
    const dist = Math.max(size.y / 2 / t, size.x / 2 / t / camera.aspect, size.z * 2) * model.fit + size.z / 2;
    camera.position.set(0, dist * Math.sin(model.pitch), dist * Math.cos(model.pitch)); camera.lookAt(0, 0, 0);
    shadow.position.y = -size.y / 2 - 0.35; shadow.scale.set(size.x * 1.6 + 1, Math.max(size.z, 1.2) * 2.4, 1);
    targetYaw = model.sideYaw[S.side] || 0; yaw = targetYaw;
    refreshTextures(0); burn = performance.now(); appear = performance.now();
  }
  function refreshTextures(progress = 1) {
    if (!renderer || !model) return;
    const C = PRODUCTS[S.product].colours[S.colour] || PRODUCTS[S.product].colours[0];
    surfaces.forEach((sf, i) => sf.update(artFor(S.product, i), C, i === S.side ? progress : 1));
  }

  // pointer rotate
  if (renderer) {
    const cv = renderer.domElement;
    cv.addEventListener('pointerdown', e => { dragging = true; lx = e.clientX; ly = e.clientY; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', e => { if (!dragging) return; yaw += (e.clientX - lx) * 0.012; pitch = clamp(pitch + (e.clientY - ly) * 0.008, -0.6, 0.6); lx = e.clientX; ly = e.clientY; idle = performance.now(); });
    const up = () => { dragging = false; idle = performance.now(); };
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    new ResizeObserver(() => { if (model) { const r = stage.getBoundingClientRect(); renderer.setSize(r.width, r.height, false); build3D(); } }).observe(stage);
    let visible = true;
    new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(stage);
    let last = performance.now();
    const tick = (now) => {
      requestAnimationFrame(tick);
      const dt = Math.min(0.25, (now - last) / 1000); last = now;
      if (!visible || !model) return;
      const t = now / 1000;
      if (!dragging && now - idle > 1800) { const f = 1 - Math.exp(-dt * 5); yaw += (targetYaw - yaw) * f; pitch += (0 - pitch) * f; }
      pivot.rotation.y = yaw + Math.sin(t * 0.55) * 0.3;
      pivot.rotation.x = pitch + Math.sin(t * 0.4) * 0.04;
      const a = Math.min(1, (now - appear) / 600); pivot.scale.setScalar(0.86 + 0.14 * (1 - Math.pow(1 - a, 3)));
      if (burn > 0) { const p = Math.min(1, (now - burn) / 1300); refreshTextures(p); if (p >= 1) burn = -1; }
      renderer.render(scene, camera);
    };
    const r0 = stage.getBoundingClientRect(); renderer.setSize(r0.width, r0.height, false);
    requestAnimationFrame(tick);
  }

  /* ---------- 2D layout editor ---------- */
  const ectx = ed.getContext('2d'); let sel = 'text', drag = null, guides = { x: false, y: false };
  function drawEditor() {
    const P = PRODUCTS[S.product], C = P.colours[S.colour] || P.colours[0];
    const { W, H } = areaPx(S.product); const art = artFor(S.product, S.side);
    // fit editor canvas to its box
    const box = ed.parentElement.getBoundingClientRect(); const maxW = Math.max(180, box.width - 24);
    const ratio = W / H; let dw = maxW, dh = maxW / ratio; const maxH = shapeOf(S.product) === 'tall' ? 420 : 260;
    if (dh > maxH) { dh = maxH; dw = dh * ratio; }
    if (dh < 64) dh = 64;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ed.width = Math.round(dw * dpr); ed.height = Math.round(dh * dpr); ed.style.width = dw + 'px'; ed.style.height = dh + 'px';
    const x = ectx; x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, dw, dh);
    x.fillStyle = C.bg; x.fillRect(0, 0, dw, dh);
    // tinted artwork
    const tint = document.createElement('canvas'); tint.width = W; tint.height = H; const tx = tint.getContext('2d');
    tx.drawImage(art, 0, 0); tx.globalCompositeOperation = 'source-in'; tx.fillStyle = C.engrave; tx.fillRect(0, 0, W, H);
    x.drawImage(tint, 0, 0, dw, dh);
    // guides + selection
    x.strokeStyle = 'rgba(184,146,90,.9)'; x.setLineDash([4, 4]); x.lineWidth = 1;
    if (guides.x) { x.beginPath(); x.moveTo(dw / 2, 0); x.lineTo(dw / 2, dh); x.stroke(); }
    if (guides.y) { x.beginPath(); x.moveTo(0, dh / 2); x.lineTo(dw, dh / 2); x.stroke(); }
    const b = art._fit.boxes[sel];
    if (b) { const k = dw / W; x.setLineDash([5, 4]); x.strokeStyle = 'rgba(255,255,255,.8)'; x.strokeRect(b[0] * k - 3, b[1] * k - 3, b[2] * k + 6, b[3] * k + 6); }
    x.setLineDash([]);
    ed._scale = dw / W;
    const warn = $('ihdFit'); if (warn) warn.hidden = !art._fit.fitted;
  }
  function hit(px, py) {
    const art = artFor(S.product, S.side), k = ed._scale || 1, B = art._fit.boxes;
    for (const n of ['text', 'logo']) { const b = B[n]; if (b && px >= b[0] * k - 8 && px <= (b[0] + b[2]) * k + 8 && py >= b[1] * k - 8 && py <= (b[1] + b[3]) * k + 8) return n; }
    return null;
  }
  ed.addEventListener('pointerdown', e => {
    const r = ed.getBoundingClientRect(); const px = e.clientX - r.left, py = e.clientY - r.top; const h = hit(px, py);
    if (!h) return; sel = h; const d = design();
    drag = { n: h, sx: px, sy: py, ox: d[h + 'X'], oy: d[h + 'Y'], w: r.width, h: r.height }; ed.setPointerCapture(e.pointerId); e.preventDefault(); syncUI(); drawEditor();
  });
  ed.addEventListener('pointermove', e => {
    if (!drag) { const r = ed.getBoundingClientRect(); ed.style.cursor = hit(e.clientX - r.left, e.clientY - r.top) ? 'move' : 'default'; return; }
    const r = ed.getBoundingClientRect(); const d = design();
    let nx = drag.ox + (e.clientX - r.left - drag.sx) / drag.w, ny = drag.oy + (e.clientY - r.top - drag.sy) / drag.h;
    guides.x = Math.abs(nx - 0.5) < 0.02; guides.y = Math.abs(ny - 0.5) < 0.04; if (guides.x) nx = 0.5; if (guides.y) ny = 0.5;
    d[drag.n + 'X'] = clamp(nx, 0, 1); d[drag.n + 'Y'] = clamp(ny, 0, 1); d.touched = true; changed(false);
  });
  const endDrag = () => { if (drag) { drag = null; guides = { x: false, y: false }; changed(false); } };
  ed.addEventListener('pointerup', endDrag); ed.addEventListener('pointercancel', endDrag);

  /* ---------- UI wiring ---------- */
  let raf = 0;
  function changed(withBurn) {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => { drawEditor(); if (withBurn) { refreshTextures(0); burn = performance.now(); } else if (burn < 0) refreshTextures(1); updateCTA(); });
  }
  function syncUI() {
    const P = PRODUCTS[S.product], d = design();
    document.querySelectorAll('#ihdProducts button').forEach(b => b.classList.toggle('on', b.dataset.p === S.product));
    const sw = $('ihdColours'); sw.innerHTML = '';
    P.colours.forEach((c, i) => { const b = document.createElement('button'); b.type = 'button'; b.title = c.name; b.setAttribute('aria-label', c.name); b.style.background = c.swatch; if (i === S.colour) b.className = 'on'; b.onclick = () => { S.colour = i; syncUI(); build3D(); drawEditor(); updateCTA(); }; sw.appendChild(b); });
    $('ihdColourName').textContent = (P.colours[S.colour] || P.colours[0]).name;
    const sides = $('ihdSides'); sides.innerHTML = ''; sides.parentElement.hidden = P.sides.length < 2;
    P.sides.forEach((s, i) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = s; if (i === S.side) b.className = 'on'; b.onclick = () => { S.side = i; targetYaw = model ? (model.sideYaw[i] || 0) : 0; idle = 0; sel = 'text'; syncUI(); drawEditor(); }; sides.appendChild(b); });
    $('ihdFlip').hidden = P.sides.length < 2;
    $('ihdText').value = d.text; $('ihdTextSize').value = Math.round(d.textSize * 100);
    $('ihdLogoSize').value = Math.round(d.logoSize * 100); $('ihdLogoOn').checked = !!d.logoOn;
    $('ihdLogoControls').hidden = !S.logo; $('ihdLogoEmpty').hidden = !!S.logo; if (S.logo) drawLogoPreview();
    document.querySelectorAll('#ihdFonts button').forEach(b => b.classList.toggle('on', b.dataset.f === S.font));
    const info = (cfg.products || {})[S.product]; const pl = $('ihdPrice');
    if (info && pl) { pl.innerHTML = info.note ? info.note : `<b>${info.from}</b> per piece · MOQ ${info.moq || 50} · <a href="${info.url}">View product</a>`; } else if (pl) pl.textContent = '';
    $('ihdSideLabel').textContent = P.sides.length > 1 ? `Editing: ${P.sides[S.side]}` : P.sides[0];
  }
  function summary() {
    const P = PRODUCTS[S.product], C = P.colours[S.colour] || P.colours[0];
    const parts = P.sides.map((s, i) => { const d = design(S.product, i); const t = (d.text || '').replace(/\n/g, ' / ').trim(); const bits = []; if (S.logo && d.logoOn) bits.push('logo'); if (t) bits.push('text "' + t + '"'); return bits.length ? `${s}: ${bits.join(' + ')}` : null; }).filter(Boolean);
    return { P, C, parts };
  }
  function updateCTA() {
    const { P, C, parts } = summary(); const q = parseInt($('ihdQty').value, 10) || '';
    const msg = `Hi, I designed a ${P.label} (${C.name}) in your 3D designer.\n${parts.join('\n')}\nFont: ${FONTS[S.font].label}${q ? `\nQuantity: ${q}` : ''}\n${S.logo ? "I'll attach my logo file here too." : ''}`.trim();
    $('ihdWhatsApp').href = (cfg.whatsapp || 'https://wa.me/918319267960') + '?text=' + encodeURIComponent(msg);
  }

  document.querySelectorAll('#ihdProducts button').forEach(b => b.addEventListener('click', () => { S.product = b.dataset.p; S.colour = 0; S.side = 0; sel = 'text'; syncUI(); build3D(); drawEditor(); updateCTA(); }));
  document.querySelectorAll('#ihdFonts button').forEach(b => b.addEventListener('click', () => {
    S.font = b.dataset.f; syncUI();
    const f = FONTS[S.font]; (document.fonts && document.fonts.load ? document.fonts.load(f.load) : Promise.resolve()).catch(() => {}).then(() => changed(false));
    changed(false);
  }));
  $('ihdText').addEventListener('input', e => { const d = design(); d.text = e.target.value.slice(0, 60); sel = 'text'; changed(false); });
  $('ihdText').addEventListener('change', () => changed(true));
  $('ihdTextSize').addEventListener('input', e => { design().textSize = e.target.value / 100; design().touched = true; sel = 'text'; changed(false); });
  $('ihdLogoSize').addEventListener('input', e => { design().logoSize = e.target.value / 100; design().touched = true; sel = 'logo'; changed(false); });
  $('ihdLogoOn').addEventListener('change', e => { design().logoOn = e.target.checked; sel = 'logo'; changed(true); });
  function reprocess() {
    if (!S.logoImg) return;
    const r = processLogo(S.logoImg, { style: S.logoStyle, detail: S.detail, invert: S.invert });
    const err = $('ihdLogoErr');
    if (!r) { err.textContent = 'Nothing would be engraved with these settings — try another style or move the Detail slider.'; err.hidden = false; return; }
    err.hidden = true; S.logo = r.mask; S.logoMode = r.mode; drawLogoPreview(); changed(true);
  }
  function drawLogoPreview() {
    const cv = $('ihdLogoPrev'), note = $('ihdLogoNote'); if (!cv || !S.logo) return;
    const W = 240, H = 150, dpr = Math.min(window.devicePixelRatio || 1, 2); cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
    const x = cv.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.fillStyle = '#121314'; x.fillRect(0, 0, W, H);
    const m = S.logo, k = Math.min((W - 24) / m.width, (H - 24) / m.height), dw = m.width * k, dh = m.height * k;
    const t = document.createElement('canvas'); t.width = m.width; t.height = m.height; const tx = t.getContext('2d'); tx.drawImage(m, 0, 0); tx.globalCompositeOperation = 'source-in'; tx.fillStyle = '#d7d9dc'; tx.fillRect(0, 0, m.width, m.height);
    x.drawImage(t, (W - dw) / 2, (H - dh) / 2, dw, dh);
    const msg = { alpha: 'Transparent logo detected — engraved as-is.', flat: 'Plain background removed automatically.', adaptive: 'Photo of a logo detected — background, shadows and paper removed.', sheet: 'Card or paper detected — we kept only what is printed on it and straightened it.', photo: 'Photo engraving style — shades are made with fine laser dots.' };
    if (note) note.textContent = (msg[S.logoMode] || '') + ' Laser engraving is one colour, so colours become a single tone.';
    document.querySelectorAll('#ihdLogoStyle button').forEach(b => b.classList.toggle('on', b.dataset.s === S.logoStyle));
  }
  $('ihdInvert').addEventListener('change', e => { S.invert = e.target.checked; reprocess(); });
  document.querySelectorAll('#ihdLogoStyle button').forEach(b => b.addEventListener('click', () => { S.logoStyle = b.dataset.s; reprocess(); }));
  let dtm; $('ihdDetail').addEventListener('input', e => { S.detail = e.target.value / 100; clearTimeout(dtm); dtm = setTimeout(reprocess, 120); });
  $('ihdCenter').addEventListener('click', () => { const d = design(); d[sel + 'X'] = 0.5; if (shapeOf(S.product) === 'strip') d[sel + 'Y'] = 0.5; changed(false); });
  $('ihdReset').addEventListener('click', () => { const d = design(); Object.assign(d, defaultLayout(S.product, S.side, !!S.logo), { touched: false }); syncUI(); changed(true); });
  $('ihdQty').addEventListener('input', updateCTA);
  $('ihdBurn').addEventListener('click', () => { refreshTextures(0); burn = performance.now(); targetYaw = model ? (model.sideYaw[S.side] || 0) : 0; yaw = targetYaw; });
  $('ihdFlip').addEventListener('click', () => { S.side = S.side ? 0 : 1; targetYaw = model ? (model.sideYaw[S.side] || 0) : 0; idle = 0; syncUI(); drawEditor(); });
  $('ihdLogoRemove').addEventListener('click', () => { S.logo = null; S.logoImg = null; $('ihdFile').value = ''; Object.values(S.designs).forEach(d => { d.logoOn = false; }); syncUI(); changed(true); });
  $('ihdFile').addEventListener('change', async e => {
    const f = e.target.files && e.target.files[0]; const err = $('ihdLogoErr'); err.hidden = true; if (!f) return;
    if (f.size > 25 * 1024 * 1024) { err.textContent = 'That file is over 25 MB. Please use a smaller image.'; err.hidden = false; return; }
    try {
      const { img, url } = await loadImage(f).catch(() => { throw new Error("This file type can't be opened in the browser. Please upload a JPG or PNG (on iPhone: share the photo as JPG)."); });
      S.logoStyle = 'auto'; S.detail = 0.5; S.invert = false; $('ihdInvert').checked = false; $('ihdDetail').value = 50;
      const r = processLogo(img, { style: 'auto', detail: 0.5, invert: false }); URL.revokeObjectURL(url);
      if (!r) { err.textContent = "We couldn't find a logo in that image. Try a clearer photo, or a PNG/JPG of your logo."; err.hidden = false; return; }
      const first = !S.logo; S.logoImg = img; S.logo = r.mask; S.logoMode = r.mode; drawLogoPreview();
      // lay out every untouched side for a logo; front sides show the logo
      ORDER.forEach(p => PRODUCTS[p].sides.forEach((_, i) => { const d = design(p, i); if (!d.touched || first) { const L = defaultLayout(p, i, true); Object.assign(d, i === 0 ? L : { logoOn: d.logoOn, logoX: L.logoX, logoY: L.logoY, logoSize: L.logoSize }); } }));
      sel = 'logo'; syncUI(); changed(true);
    } catch (x) { err.textContent = x.message || 'Could not read this image.'; err.hidden = false; }
  });
  // one design image (all sides, rendered from the 3D view) for the download and the WhatsApp share
  function composeImage() {
    const P = PRODUCTS[S.product], C = P.colours[S.colour] || P.colours[0];
    const out = document.createElement('canvas'); out.width = 1600; out.height = 1000; const o = out.getContext('2d');
    o.fillStyle = '#16181a'; o.fillRect(0, 0, 1600, 1000);
    if (renderer && model) {
      const keepY = pivot.rotation.y, keepX = pivot.rotation.x, keepS = pivot.scale.x;
      pivot.scale.setScalar(1); pivot.rotation.x = 0;
      refreshTextures(1);
      const slot = 1600 / P.sides.length;
      P.sides.forEach((_, i) => {
        pivot.rotation.y = (model.sideYaw[i] || 0) + 0.25; renderer.render(scene, camera);
        const src = renderer.domElement, k = Math.min(slot / src.width, 900 / src.height), dw = src.width * k, dh = src.height * k;
        o.drawImage(src, i * slot + (slot - dw) / 2, (900 - dh) / 2, dw, dh); // same task as render, so the buffer is still valid
      });
      pivot.rotation.y = keepY; pivot.rotation.x = keepX; pivot.scale.setScalar(keepS);
    } else {
      const art = artFor(S.product, S.side); o.drawImage(art, 100, 100, 1400, 1400 * art.height / art.width);
    }
    o.fillStyle = '#b8925a'; o.fillRect(0, 900, 1600, 100);
    o.fillStyle = '#16181a'; o.font = '600 34px Fraunces, Georgia, serif'; o.textBaseline = 'middle'; o.textAlign = 'left';
    o.fillText(`The Imprint House — ${P.label} (${C.name})`, 40, 950);
    o.font = '500 22px Inter, Arial, sans-serif'; o.textAlign = 'right'; o.fillText('Design preview · final artwork confirmed on a digital mockup', 1560, 950);
    return out;
  }
  function downloadImage(out) {
    const a = document.createElement('a'); a.download = `imprint-house-${S.product}-design.png`; a.href = out.toDataURL('image/png'); document.body.appendChild(a); a.click(); a.remove();
  }
  $('ihdDownload').addEventListener('click', () => downloadImage(composeImage()));
  // WhatsApp: on phones, share the design image straight into WhatsApp; elsewhere open the chat and save the image to attach
  $('ihdWhatsApp').addEventListener('click', e => {
    updateCTA();
    const link = $('ihdWhatsApp').href, msg = decodeURIComponent((link.split('?text=')[1] || ''));
    let out; try { out = composeImage(); } catch (x) { return; }
    const canFiles = navigator.canShare && typeof File !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (canFiles) {
      e.preventDefault();
      const dataUrl = out.toDataURL('image/png'), bin = atob(dataUrl.split(',')[1]), arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      const file = new File([arr], `imprint-house-${S.product}-design.png`, { type: 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], text: msg + '\nWhatsApp: +91 83192 67960' }).catch(err => { if (!err || err.name !== 'AbortError') window.location.href = link; });
        return;
      }
      window.location.href = link; return;
    }
    downloadImage(out); // desktop: the chat opens in a new tab and the design image is saved, ready to attach
  });
  window.addEventListener('resize', () => drawEditor());

  // fonts may arrive late: redraw when they do
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => changed(false));
  syncUI(); build3D(); drawEditor(); updateCTA();
  return { state: S, PRODUCTS };
}

export { processLogo };
