// The Imprint House — 3D engraving designer
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, MeshStandardMaterial, MeshPhysicalMaterial, MeshBasicMaterial,
  Shape, Path, ExtrudeGeometry, CylinderGeometry, TorusGeometry, PlaneGeometry, BoxGeometry, LatheGeometry, TubeGeometry,
  CatmullRomCurve3, SphereGeometry, CircleGeometry, Vector2, Vector3, CanvasTexture, SRGBColorSpace, ACESFilmicToneMapping,
  PMREMGenerator, DirectionalLight, BackSide, DoubleSide, Color, Box3
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
  keychain: { label: 'Keychain', sides: ['Front', 'Back'], area: { w: 2.29, h: 3.66 }, wrap: null,
    colours: [{ name: 'Black & chrome', swatch: '#111', bg: '#0d0d0e', engrave: SILVER }] },
  pen: { label: 'Metal pen', sides: ['Barrel'], area: { w: 4.4, h: 0.52 }, wrap: 'v',
    colours: [{ name: 'Black', swatch: '#151515', bg: '#161616', engrave: SILVER, body: 'black' },
              { name: 'Silver', swatch: '#c3c6ca', bg: '#b9bcc0', engrave: DARK, body: 'silver' },
              { name: 'Blue', swatch: '#1e3fae', bg: '#1a3aa8', engrave: SILVER, body: 'blue' }] },
  roller: { label: 'Roller pen', sides: ['Barrel'], area: { w: 4.6, h: 0.545 }, wrap: 'v',
    colours: [{ name: 'Teal & terracotta', swatch: 'linear-gradient(90deg,#2f5868 50%,#c2582f 50%)', bg: '#2f5868', engrave: SILVER }] },
  flask: { label: 'Flask', sides: ['Body'], area: { w: 5.6, h: 1.42 }, wrap: 'v',
    colours: [{ name: 'Black', swatch: '#141414', bg: '#131415', engrave: SILVER, body: 'black' },
              { name: 'Red', swatch: '#b0151d', bg: '#a3121b', engrave: SILVER, body: 'red' }] },
  mug: { label: 'Coffee mug', sides: ['Front'], area: { w: 3.1, h: 2.0 }, wrap: 'h',
    colours: [{ name: 'Navy', swatch: '#1f2c55', bg: '#1f2c55', engrave: SILVER, body: 'navy' },
              { name: 'Black', swatch: '#141414', bg: '#151515', engrave: SILVER, body: 'black' }] },
};
const ORDER = ['keychain', 'pen', 'roller', 'flask', 'mug'];

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
function makeMask(img, invert) {
  const max = 1200; let w = img.naturalWidth || img.width || 600, h = img.naturalHeight || img.height || 600;
  const k = Math.min(1, max / Math.max(w, h)); w = Math.max(1, Math.round(w * k)); h = Math.max(1, Math.round(h * k));
  const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d', { willReadFrequently: true });
  x.drawImage(img, 0, 0, w, h);
  const d = x.getImageData(0, 0, w, h), px = d.data;
  // transparency?
  let transparent = 0; for (let i = 3; i < px.length; i += 16) if (px[i] < 200) transparent++;
  const usesAlpha = transparent > px.length / 16 * 0.02;
  // background colour from the border
  let br = 0, bg = 0, bb = 0, n = 0;
  const sample = (X, Y) => { const i = (Y * w + X) * 4; if (px[i + 3] > 200) { br += px[i]; bg += px[i + 1]; bb += px[i + 2]; n++; } };
  for (let X = 0; X < w; X += 2) { sample(X, 0); sample(X, h - 1); }
  for (let Y = 0; Y < h; Y += 2) { sample(0, Y); sample(w - 1, Y); }
  if (n) { br /= n; bg /= n; bb /= n; } else { br = bg = bb = 255; }
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let i = 0, p = 0; i < px.length; i += 4, p++) {
    let a;
    if (usesAlpha) a = px[i + 3] / 255;
    else { const dist = Math.max(Math.abs(px[i] - br), Math.abs(px[i + 1] - bg), Math.abs(px[i + 2] - bb)); a = clamp((dist - 28) / 60, 0, 1); }
    if (invert) a = (usesAlpha ? (px[i + 3] > 10 ? 1 - a : 0) : 1 - a);
    px[i] = px[i + 1] = px[i + 2] = 255; px[i + 3] = Math.round(a * 255);
    if (a > 0.15) { const X = p % w, Y = (p / w) | 0; if (X < minX) minX = X; if (X > maxX) maxX = X; if (Y < minY) minY = Y; if (Y > maxY) maxY = Y; }
  }
  x.putImageData(d, 0, 0);
  if (maxX < 0) return null;
  const pad = 2; minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad); maxX = Math.min(w - 1, maxX + pad); maxY = Math.min(h - 1, maxY + pad);
  const t = document.createElement('canvas'); t.width = maxX - minX + 1; t.height = maxY - minY + 1;
  t.getContext('2d').drawImage(c, minX, minY, t.width, t.height, 0, 0, t.width, t.height);
  return t;
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
  chrome: () => new MeshStandardMaterial({ color: 0xeef0f3, metalness: 1, roughness: 0.07 }),
  steel: () => new MeshStandardMaterial({ color: 0xc9ccd0, metalness: 1, roughness: 0.28 }),
  enamel: () => new MeshPhysicalMaterial({ color: 0x0b0b0c, metalness: 0.15, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.06 }),
  coat: (c, r = 0.55, m = 0.25) => new MeshStandardMaterial({ color: c, metalness: m, roughness: r }),
  anodised: (c) => new MeshPhysicalMaterial({ color: c, metalness: 0.75, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.2 }),
};
const BODY = {
  black: () => MAT.coat(0x141414, 0.5, 0.35), silver: () => MAT.coat(0xb8bbbf, 0.32, 0.95), blue: () => MAT.anodised(0x1a3aa8),
  red: () => MAT.anodised(0xa3121b), navy: () => MAT.coat(0x1f2c55, 0.62, 0.2), flaskBlack: () => MAT.coat(0x121314, 0.5, 0.35), mugBlack: () => MAT.coat(0x151515, 0.62, 0.2),
};
function studioEnvironment(renderer) {
  const s = new Scene();
  s.add(new Mesh(new BoxGeometry(24, 16, 24), new MeshBasicMaterial({ color: 0x15171a, side: BackSide })));
  const panel = (w, h, hex, k, x, y, z) => { const m = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color: new Color(hex).multiplyScalar(k), side: DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); s.add(m); };
  panel(10, 3.5, 0xffffff, 4.0, 0, 7.5, 2); panel(3.5, 10, 0xffffff, 2.6, -10, 1, 4); panel(3.5, 10, 0xffe7c4, 2.0, 10, 0.5, -1);
  panel(12, 2.5, 0xffffff, 0.9, 0, -2, 11); panel(6, 6, 0xffffff, 0.8, 0, 2, -11);
  const pm = new PMREMGenerator(renderer); const tex = pm.fromScene(s, 0.03).texture; pm.dispose(); return tex;
}

/* ================= 3D: models ================= */
function roundedRect(w, h, r, hole = false) {
  const s = hole ? new Path() : new Shape(); const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false); return s;
}
const cyl = (rt, rb, h, mat, y, seg = 64) => { const m = new Mesh(new CylinderGeometry(rt, rb, h, seg), mat); m.position.y = y; return m; };
const wrap = (r, h, theta, y, mat) => { const m = new Mesh(new CylinderGeometry(r, r, h, 64, 1, true, -theta / 2, theta), mat); m.position.y = y; return m; };

function buildKeychain(mats) {
  const g = new Group(); const W = 3.0, H = 4.6, R = 0.62, inset = 0.17, chrome = MAT.chrome();
  const fs = roundedRect(W, H, R); fs.holes.push(roundedRect(W - inset * 2, H - inset * 2, R - inset * 0.8, true));
  const frame = new Mesh(new ExtrudeGeometry(fs, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 4, curveSegments: 32 }), chrome);
  frame.position.z = -0.15; g.add(frame);
  const fw = W - inset * 2, fh = H - inset * 2;
  const face = new Mesh(new ExtrudeGeometry(roundedRect(fw, fh, R - inset * 0.8), { depth: 0.24, bevelEnabled: false, curveSegments: 32 }), MAT.enamel());
  face.position.z = -0.12; g.add(face);
  const a = PRODUCTS.keychain.area;
  const front = new Mesh(new PlaneGeometry(a.w, a.h), mats[0]); front.position.z = 0.122; g.add(front);
  const back = new Mesh(new PlaneGeometry(a.w, a.h), mats[1]); back.position.z = -0.122; back.rotation.y = Math.PI; g.add(back);
  const block = new Mesh(new BoxGeometry(0.62, 0.42, 0.34), chrome); block.position.set(0, H / 2 + 0.08, 0); g.add(block);
  const link = new Mesh(new TorusGeometry(0.36, 0.085, 20, 48), chrome); link.scale.set(1, 1.75, 1); link.position.set(0, H / 2 + 0.78, 0); g.add(link);
  const ring = new Mesh(new TorusGeometry(1.25, 0.1, 24, 120), chrome); ring.position.set(0, H / 2 + 2.55, 0); ring.rotation.y = 0.35; g.add(ring);
  return { group: g, base: { x: -0.05, y: 0, z: 0 }, pitch: 0.05, fit: 1.12, sideYaw: [0, Math.PI] };
}
function buildPen(mats, colour) {
  const g = new Group(); const body = BODY[colour.body || 'black'](), chrome = MAT.chrome();
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
  const g = new Group(); const body = colour.body === 'red' ? BODY.red() : BODY.flaskBlack();
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
const BUILD = { keychain: buildKeychain, pen: buildPen, roller: buildRoller, flask: buildFlask, mug: buildMug };

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
    this.tex.needsUpdate = true; this.gtex.needsUpdate = true;
  }
}

/* ================= the designer ================= */
export function init(cfg = {}) {
  const stage = $('ihdStage'), ed = $('ihdEditor');
  if (!stage || !ed) return;
  const S = {
    product: 'keychain', colour: 0, side: 0, font: 'serif', logo: null, logoImg: null, invert: false, qty: 100,
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
    renderer.toneMapping = ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05; renderer.outputColorSpace = SRGBColorSpace;
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
    $('ihdLogoControls').hidden = !S.logo; $('ihdLogoEmpty').hidden = !!S.logo;
    document.querySelectorAll('#ihdFonts button').forEach(b => b.classList.toggle('on', b.dataset.f === S.font));
    const info = (cfg.products || {})[S.product]; const pl = $('ihdPrice');
    if (info && pl) { pl.innerHTML = info.note ? info.note : `From <b>${info.from}</b> per piece · min. 50 · <a href="${info.url}">View product</a>`; } else if (pl) pl.textContent = '';
    $('ihdSideLabel').textContent = P.sides.length > 1 ? `Editing: ${P.sides[S.side]}` : P.sides[0];
  }
  function summary() {
    const P = PRODUCTS[S.product], C = P.colours[S.colour] || P.colours[0];
    const parts = P.sides.map((s, i) => { const d = design(S.product, i); const t = (d.text || '').replace(/\n/g, ' / ').trim(); const bits = []; if (S.logo && d.logoOn) bits.push('logo'); if (t) bits.push('text "' + t + '"'); return bits.length ? `${s}: ${bits.join(' + ')}` : null; }).filter(Boolean);
    return { P, C, parts };
  }
  function updateCTA() {
    const { P, C, parts } = summary(); const q = parseInt($('ihdQty').value, 10) || '';
    const msg = `Hi, I designed a ${P.label} (${C.name}) in your 3D designer.\n${parts.join('\n')}\nFont: ${FONTS[S.font].label}${q ? `\nQuantity: ${q}` : ''}\n${S.logo ? "I'll attach my logo and the design image here." : ''}`.trim();
    $('ihdWhatsApp').href = (cfg.whatsapp || 'https://wa.me/919109535267') + '?text=' + encodeURIComponent(msg);
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
  $('ihdInvert').addEventListener('change', e => { S.invert = e.target.checked; if (S.logoImg) { S.logo = makeMask(S.logoImg, S.invert) || S.logo; changed(true); } });
  $('ihdCenter').addEventListener('click', () => { const d = design(); d[sel + 'X'] = 0.5; if (shapeOf(S.product) === 'strip') d[sel + 'Y'] = 0.5; changed(false); });
  $('ihdReset').addEventListener('click', () => { const d = design(); Object.assign(d, defaultLayout(S.product, S.side, !!S.logo), { touched: false }); syncUI(); changed(true); });
  $('ihdQty').addEventListener('input', updateCTA);
  $('ihdBurn').addEventListener('click', () => { refreshTextures(0); burn = performance.now(); targetYaw = model ? (model.sideYaw[S.side] || 0) : 0; yaw = targetYaw; });
  $('ihdFlip').addEventListener('click', () => { S.side = S.side ? 0 : 1; targetYaw = model ? (model.sideYaw[S.side] || 0) : 0; idle = 0; syncUI(); drawEditor(); });
  $('ihdLogoRemove').addEventListener('click', () => { S.logo = null; S.logoImg = null; $('ihdFile').value = ''; Object.values(S.designs).forEach(d => { d.logoOn = false; }); syncUI(); changed(true); });
  $('ihdFile').addEventListener('change', async e => {
    const f = e.target.files && e.target.files[0]; const err = $('ihdLogoErr'); err.hidden = true; if (!f) return;
    if (f.size > 10 * 1024 * 1024) { err.textContent = 'That file is over 10 MB. Please use a smaller image.'; err.hidden = false; return; }
    try {
      const { img, url } = await loadImage(f); const m = makeMask(img, S.invert); URL.revokeObjectURL(url);
      if (!m) { err.textContent = "We couldn't find a logo in that image. Try a PNG with a transparent or plain background."; err.hidden = false; return; }
      const first = !S.logo; S.logoImg = img; S.logo = m;
      // lay out every untouched side for a logo; front sides show the logo
      ORDER.forEach(p => PRODUCTS[p].sides.forEach((_, i) => { const d = design(p, i); if (!d.touched || first) { const L = defaultLayout(p, i, true); Object.assign(d, i === 0 ? L : { logoOn: d.logoOn, logoX: L.logoX, logoY: L.logoY, logoSize: L.logoSize }); } }));
      sel = 'logo'; syncUI(); changed(true);
    } catch (x) { err.textContent = x.message || 'Could not read this image.'; err.hidden = false; }
  });
  $('ihdDownload').addEventListener('click', () => {
    const P = PRODUCTS[S.product], C = P.colours[S.colour] || P.colours[0];
    const out = document.createElement('canvas'); out.width = 1600; out.height = 1000; const o = out.getContext('2d');
    o.fillStyle = '#16181a'; o.fillRect(0, 0, 1600, 1000);
    const shots = [];
    if (renderer && model) {
      const keepY = pivot.rotation.y, keepX = pivot.rotation.x, keepS = pivot.scale.x;
      pivot.scale.setScalar(1); pivot.rotation.x = 0;
      refreshTextures(1);
      P.sides.forEach((_, i) => { pivot.rotation.y = (model.sideYaw[i] || 0) + 0.25; renderer.render(scene, camera); shots.push(renderer.domElement.toDataURL('image/png')); });
      pivot.rotation.y = keepY; pivot.rotation.x = keepX; pivot.scale.setScalar(keepS);
    }
    const done = () => {
      o.fillStyle = '#b8925a'; o.fillRect(0, 900, 1600, 100);
      o.fillStyle = '#16181a'; o.font = '600 34px Fraunces, Georgia, serif'; o.textBaseline = 'middle';
      o.fillText(`The Imprint House — ${P.label} (${C.name})`, 40, 950);
      o.font = '500 22px Inter, Arial, sans-serif'; o.textAlign = 'right'; o.fillText('Design preview · final artwork confirmed on a digital mockup', 1560, 950);
      const a = document.createElement('a'); a.download = `imprint-house-${S.product}-design.png`; a.href = out.toDataURL('image/png'); document.body.appendChild(a); a.click(); a.remove();
    };
    if (!shots.length) {
      const art = artFor(S.product, S.side); o.drawImage(art, 100, 100, 1400, 1400 * art.height / art.width); done(); return;
    }
    let n = 0; const slot = 1600 / shots.length;
    shots.forEach((src, i) => { const im = new Image(); im.onload = () => { const k = Math.min(slot / im.width, 900 / im.height); const dw = im.width * k, dh = im.height * k; o.drawImage(im, i * slot + (slot - dw) / 2, (900 - dh) / 2, dw, dh); if (++n === shots.length) done(); }; im.src = src; });
  });
  window.addEventListener('resize', () => drawEditor());

  // fonts may arrive late: redraw when they do
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => changed(false));
  syncUI(); build3D(); drawEditor(); updateCTA();
  return { state: S, PRODUCTS };
}
