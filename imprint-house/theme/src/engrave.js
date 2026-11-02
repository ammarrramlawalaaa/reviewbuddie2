// The Imprint House — live 3D engraving preview
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, MeshStandardMaterial, MeshPhysicalMaterial, MeshBasicMaterial,
  Shape, Path, ExtrudeGeometry, CylinderGeometry, TorusGeometry, PlaneGeometry, BoxGeometry, LatheGeometry, TubeGeometry,
  CatmullRomCurve3, SphereGeometry, CircleGeometry, Vector2, Vector3, CanvasTexture, SRGBColorSpace, ACESFilmicToneMapping,
  PMREMGenerator, DirectionalLight, BackSide, DoubleSide, Color, Box3
} from 'three';

const FONT_FAMILY = 'Fraunces, Georgia, "Times New Roman", serif';

/* ---------- materials ---------- */
const M = {
  chrome: () => new MeshStandardMaterial({ color: 0xeef0f3, metalness: 1, roughness: 0.07 }),
  steel: () => new MeshStandardMaterial({ color: 0xc9ccd0, metalness: 1, roughness: 0.28 }),
  enamel: () => new MeshPhysicalMaterial({ color: 0x0b0b0c, metalness: 0.15, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.06 }),
  coat: (c, r = 0.55, m = 0.25) => new MeshStandardMaterial({ color: c, metalness: m, roughness: r }),
  anodised: (c) => new MeshPhysicalMaterial({ color: c, metalness: 0.75, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.2 }),
};

/* ---------- studio lighting (procedural environment) ---------- */
function studioEnvironment(renderer) {
  const s = new Scene();
  s.add(new Mesh(new BoxGeometry(24, 16, 24), new MeshBasicMaterial({ color: 0x15171a, side: BackSide })));
  const panel = (w, h, hex, k, x, y, z) => {
    const m = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color: new Color(hex).multiplyScalar(k), side: DoubleSide }));
    m.position.set(x, y, z); m.lookAt(0, 0, 0); s.add(m);
  };
  panel(10, 3.5, 0xffffff, 4.0, 0, 7.5, 2);      // top softbox
  panel(3.5, 10, 0xffffff, 2.6, -10, 1, 4);      // left strip
  panel(3.5, 10, 0xffe7c4, 2.0, 10, 0.5, -1);    // warm right strip (brass tint)
  panel(12, 2.5, 0xffffff, 0.9, 0, -2, 11);      // front fill
  panel(6, 6, 0xffffff, 0.5, 0, 2, -11);         // back rim
  const pm = new PMREMGenerator(renderer);
  const tex = pm.fromScene(s, 0.03).texture;
  pm.dispose();
  return tex;
}

/* ---------- engraving texture ---------- */
class Engraving {
  constructor({ w = 1024, h = 512, vertical = false, lines = 1 }) {
    this.vertical = vertical; this.lines = lines;
    this.c = document.createElement('canvas'); this.c.width = w; this.c.height = h;
    this.e = document.createElement('canvas'); this.e.width = w; this.e.height = h;
    this.tex = new CanvasTexture(this.c); this.tex.colorSpace = SRGBColorSpace; this.tex.anisotropy = 8;
    this.etex = new CanvasTexture(this.e); this.etex.colorSpace = SRGBColorSpace;
    this.text = ''; this.progress = 1;
  }
  layout(ctx, W, H) {
    const words = (this.text || ' ').split(/\s+/).filter(Boolean);
    let lines = [this.text];
    if (this.lines > 1 && words.length > 1) {
      // balance into up to N lines
      let best = null;
      for (let i = 1; i < words.length; i++) {
        const a = words.slice(0, i).join(' '), b = words.slice(i).join(' ');
        const d = Math.abs(a.length - b.length);
        if (!best || d < best.d) best = { d, l: [a, b] };
      }
      const single = this.text.length;
      if (single > 11 && best) lines = best.l;
    }
    let size = H * (lines.length > 1 ? 0.34 : 0.56);
    ctx.font = `600 ${size}px ${FONT_FAMILY}`;
    const widest = Math.max(...lines.map(l => ctx.measureText(l).width));
    if (widest > W * 0.88) size *= (W * 0.88) / widest;
    return { lines, size };
  }
  draw(text, progress = 1) {
    if (text !== undefined) this.text = text;
    this.progress = progress;
    const draw1 = (cv, mode) => {
      const ctx = cv.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      if (mode === 'e') { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cv.width, cv.height); }
      let W = cv.width, H = cv.height;
      if (this.vertical) { ctx.translate(cv.width / 2, cv.height / 2); ctx.rotate(-Math.PI / 2); ctx.translate(-cv.height / 2, -cv.width / 2); W = cv.height; H = cv.width; }
      const { lines, size } = this.layout(ctx, W, H);
      ctx.font = `600 ${size}px ${FONT_FAMILY}`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const lh = size * 1.12, y0 = H / 2 - (lines.length - 1) * lh / 2;
      const front = W * (0.04 + 0.92 * this.progress);
      ctx.save();
      ctx.beginPath(); ctx.rect(0, 0, front, H); ctx.clip();
      if (mode === 'c') {
        ctx.fillStyle = '#ffffff';
        lines.forEach((l, i) => ctx.fillText(l, W / 2, y0 + i * lh));
      } else {
        const heat = 1 - this.progress;
        const g = ctx.createLinearGradient(front - W * 0.35, 0, front, 0);
        g.addColorStop(0, `rgba(255,120,40,${0.15 * heat})`);
        g.addColorStop(0.8, `rgba(255,150,60,${0.9 * heat})`);
        g.addColorStop(1, `rgba(255,240,200,${heat > 0 ? 1 : 0})`);
        ctx.fillStyle = g;
        lines.forEach((l, i) => ctx.fillText(l, W / 2, y0 + i * lh));
      }
      ctx.restore();
    };
    draw1(this.c, 'c'); draw1(this.e, 'e');
    this.tex.needsUpdate = true; this.etex.needsUpdate = true;
  }
  material(color) {
    this.mat = new MeshStandardMaterial({
      map: this.tex, transparent: true, color, metalness: 0.9, roughness: 0.38,
      emissive: 0xffffff, emissiveMap: this.etex, emissiveIntensity: 0,
      polygonOffset: true, polygonOffsetFactor: -4, depthWrite: false,
    });
    return this.mat;
  }
}

/* ---------- geometry helpers ---------- */
function roundedRect(w, h, r, hole = false) {
  const s = hole ? new Path() : new Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}
const cyl = (rt, rb, h, mat, y, seg = 64) => { const m = new Mesh(new CylinderGeometry(rt, rb, h, seg), mat); m.position.y = y; return m; };
const wrapSurface = (r, h, theta, y, mat) => {
  const m = new Mesh(new CylinderGeometry(r, r, h, 64, 1, true, -theta / 2, theta), mat);
  m.position.y = y; return m;
};

/* ---------- product models ---------- */
function keychain(opts) {
  const g = new Group();
  const W = 3.0, H = 4.6, R = 0.62, inset = 0.17;
  const chrome = M.chrome();
  // frame
  const frameShape = roundedRect(W, H, R);
  frameShape.holes.push(roundedRect(W - inset * 2, H - inset * 2, R - inset * 0.8, true));
  const frame = new Mesh(new ExtrudeGeometry(frameShape, { depth: 0.26, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 4, curveSegments: 32 }), chrome);
  frame.position.z = -0.13; g.add(frame);
  // back plate (chrome)
  const back = new Mesh(new ExtrudeGeometry(roundedRect(W - 0.06, H - 0.06, R), { depth: 0.08, bevelEnabled: false, curveSegments: 32 }), chrome);
  back.position.z = -0.17; g.add(back);
  // enamel face (slightly recessed)
  const fw = W - inset * 2, fh = H - inset * 2;
  const face = new Mesh(new ExtrudeGeometry(roundedRect(fw, fh, R - inset * 0.8), { depth: 0.2, bevelEnabled: false, curveSegments: 32 }), M.enamel());
  face.position.z = -0.08; g.add(face);
  // engraving
  const eng = new Engraving({ w: 1024, h: 1400, lines: 2 });
  const plane = new Mesh(new PlaneGeometry(fw * 0.86, fh * 0.86), eng.material(opts.engrave));
  plane.position.z = 0.122; g.add(plane);
  // swivel block + link + ring
  const block = new Mesh(new BoxGeometry(0.62, 0.42, 0.34), chrome); block.position.set(0, H / 2 + 0.08, 0); g.add(block);
  const link = new Mesh(new TorusGeometry(0.36, 0.085, 20, 48), chrome); link.scale.set(1, 1.75, 1); link.position.set(0, H / 2 + 0.78, 0); g.add(link);
  const ring = new Mesh(new TorusGeometry(1.25, 0.1, 24, 120), chrome); ring.position.set(0, H / 2 + 2.55, 0); ring.rotation.y = 0.35; g.add(ring);
  return { group: g, eng, base: { x: -0.05, y: 0, z: 0 }, pitch: 0.05, fit: 1.18 };
}

function pen(opts) {
  const g = new Group();
  const body = opts.body, chrome = M.chrome();
  g.add(cyl(0.34, 0.035, 1.5, chrome, 0.75));
  const tipBall = new Mesh(new SphereGeometry(0.04, 12, 12), chrome); tipBall.position.y = 0.01; g.add(tipBall);
  g.add(cyl(0.40, 0.345, 3.2, body, 3.1));
  g.add(cyl(0.418, 0.418, 0.1, chrome, 4.76));
  g.add(cyl(0.405, 0.405, 0.26, body, 4.94));
  g.add(cyl(0.418, 0.418, 0.1, chrome, 5.12));
  g.add(cyl(0.42, 0.405, 5.3, body, 7.82));
  g.add(cyl(0.42, 0.42, 1.25, chrome, 11.1));
  const dome = new Mesh(new SphereGeometry(0.42, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), chrome); dome.scale.y = 0.38; dome.position.y = 11.72; g.add(dome);
  // clip
  const clip = new Mesh(new BoxGeometry(0.2, 3.9, 0.11), chrome); clip.position.set(-0.52, 9.7, 0); clip.rotation.z = -0.02; g.add(clip);
  const clipTop = new Mesh(new BoxGeometry(0.2, 0.5, 0.36), chrome); clipTop.position.set(-0.36, 11.45, 0); g.add(clipTop);
  const clipEnd = new Mesh(new SphereGeometry(0.11, 16, 12), chrome); clipEnd.position.set(-0.53, 7.75, 0); g.add(clipEnd);
  // engraving along barrel
  const eng = new Engraving({ w: 256, h: 2048, vertical: true });
  g.add(wrapSurface(0.4155, 4.4, 1.25, 7.9, eng.material(opts.engrave)));
  g.children.forEach(c => c.position.y -= 5.9);
  return { group: g, eng, base: { x: 0, y: 0, z: -1.3 }, pitch: 0.1, fit: 1.15 };
}

function rollerPen(opts) {
  const g = new Group();
  const teal = M.coat(0x2f5868, 0.78, 0.12), terra = M.coat(0xc2582f, 0.8, 0.08), dark = M.coat(0x111111, 0.45, 0.6);
  g.add(cyl(0.45, 0.45, 6.1, teal, 3.05));
  const endCap = new Mesh(new CircleGeometry(0.45, 48), teal); endCap.rotation.x = Math.PI / 2; g.add(endCap);
  g.add(cyl(0.385, 0.45, 0.35, teal, 0.0));
  for (let i = 0; i < 6; i++) g.add(cyl(0.462, 0.462, 0.045, dark, 6.18 + i * 0.065, 48));
  g.add(cyl(0.455, 0.455, 0.42, dark, 6.31));
  g.add(cyl(0.47, 0.47, 4.4, terra, 8.75));
  const dome = new Mesh(new SphereGeometry(0.47, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), terra); dome.scale.y = 0.75; dome.position.y = 10.95; g.add(dome);
  const clip = new Mesh(new BoxGeometry(0.22, 3.4, 0.1), M.coat(0x2f5868, 0.6, 0.3)); clip.position.set(-0.57, 9.1, 0); g.add(clip);
  const clipTop = new Mesh(new BoxGeometry(0.22, 0.4, 0.3), M.coat(0x2f5868, 0.6, 0.3)); clipTop.position.set(-0.45, 10.7, 0); g.add(clipTop);
  const eng = new Engraving({ w: 256, h: 2048, vertical: true });
  g.add(wrapSurface(0.454, 4.6, 1.2, 3.1, eng.material(opts.engrave)));
  g.children.forEach(c => c.position.y -= 5.5);
  return { group: g, eng, base: { x: 0, y: 0, z: -1.3 }, pitch: 0.1, fit: 1.15 };
}

function flask(opts) {
  const g = new Group();
  const body = opts.body;
  const prof = [new Vector2(0, 0), new Vector2(1.18, 0), new Vector2(1.27, 0.05), new Vector2(1.3, 0.18), new Vector2(1.3, 8.0), new Vector2(1.27, 8.1), new Vector2(0, 8.1)];
  g.add(new Mesh(new LatheGeometry(prof, 96), body));
  g.add(cyl(1.24, 1.24, 0.16, M.coat(0x0a0a0a, 0.6, 0.2), 8.18));
  const lidProf = [new Vector2(0, 0), new Vector2(1.3, 0), new Vector2(1.3, 1.55), new Vector2(1.24, 1.68), new Vector2(0, 1.7)];
  const lid = new Mesh(new LatheGeometry(lidProf, 96), body); lid.position.y = 8.26; g.add(lid);
  const eng = new Engraving({ w: 512, h: 2048, vertical: true });
  g.add(wrapSurface(1.305, 5.6, 1.05, 3.9, eng.material(opts.engrave)));
  g.children.forEach(c => c.position.y -= 5.0);
  return { group: g, eng, base: { x: 0, y: 0, z: 0 }, pitch: 0.1, fit: 1.22 };
}

function mug(opts) {
  const g = new Group();
  const body = opts.body, chrome = M.chrome(), steel = M.steel();
  const outer = new Mesh(new CylinderGeometry(2.0, 1.96, 3.4, 96, 1, true), body); outer.position.y = 1.7; g.add(outer);
  const bottom = new Mesh(new CircleGeometry(1.96, 96), body); bottom.rotation.x = Math.PI / 2; g.add(bottom);
  const band = new Mesh(new CylinderGeometry(2.0, 2.0, 0.62, 96, 1, true), chrome); band.position.y = 3.71; g.add(band);
  const inner = new Mesh(new CylinderGeometry(1.92, 1.9, 3.95, 96, 1, true), new MeshStandardMaterial({ color: 0xc9ccd0, metalness: 1, roughness: 0.3, side: BackSide })); inner.position.y = 2.04; g.add(inner);
  const innerBottom = new Mesh(new CircleGeometry(1.9, 96), steel); innerBottom.rotation.x = -Math.PI / 2; innerBottom.position.y = 0.08; g.add(innerBottom);
  const lip = new Mesh(new TorusGeometry(1.96, 0.045, 12, 96), chrome); lip.rotation.x = Math.PI / 2; lip.position.y = 4.02; g.add(lip);
  const curve = new CatmullRomCurve3([new Vector3(1.9, 3.15, 0), new Vector3(2.75, 3.15, 0), new Vector3(3.05, 2.6, 0), new Vector3(3.0, 1.35, 0), new Vector3(2.7, 0.95, 0), new Vector3(1.95, 0.95, 0)]);
  g.add(new Mesh(new TubeGeometry(curve, 64, 0.17, 20, false), body));
  const eng = new Engraving({ w: 1600, h: 900, lines: 2 });
  g.add(wrapSurface(2.0 - 0.012 + 0.006, 2.0, 1.55, 1.75, eng.material(opts.engrave)));
  g.children.forEach(c => c.position.y -= 2.0);
  return { group: g, eng, base: { x: 0, y: -0.35, z: 0 }, pitch: 0.22, fit: 1.25 };
}

/* ---------- catalogue ---------- */
const SILVER = 0xd7d9dc, DARK = 0x2a2b2d;
export const PRODUCTS = {
  keychain: { label: 'Keychain', build: keychain, colours: [{ name: 'Black & chrome', swatch: '#111', engrave: SILVER }] },
  pen: { label: 'Metal pen', build: pen, colours: [
    { name: 'Black', swatch: '#151515', body: () => M.coat(0x141414, 0.5, 0.35), engrave: SILVER },
    { name: 'Silver', swatch: '#c3c6ca', body: () => M.coat(0xb8bbbf, 0.32, 0.95), engrave: DARK },
    { name: 'Blue', swatch: '#1e3fae', body: () => M.anodised(0x1a3aa8), engrave: SILVER } ] },
  roller: { label: 'Roller pen', build: rollerPen, colours: [{ name: 'Teal & terracotta', swatch: 'linear-gradient(90deg,#2f5868 50%,#c2582f 50%)', engrave: SILVER }] },
  flask: { label: 'Flask', build: flask, colours: [
    { name: 'Black', swatch: '#141414', body: () => M.coat(0x121314, 0.5, 0.35), engrave: SILVER },
    { name: 'Red', swatch: '#b0151d', body: () => M.anodised(0xa3121b), engrave: SILVER } ] },
  mug: { label: 'Coffee mug', build: mug, colours: [
    { name: 'Navy', swatch: '#1f2c55', body: () => M.coat(0x1f2c55, 0.62, 0.2), engrave: SILVER },
    { name: 'Black', swatch: '#141414', body: () => M.coat(0x151515, 0.62, 0.2), engrave: SILVER } ] },
};

/* ---------- viewer ---------- */
export function mount(root, ui = {}) {
  const canvas = document.createElement('canvas');
  canvas.className = 'ih3d-canvas';
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) { root.classList.add('ih3d-fallback'); return null; }
  root.appendChild(canvas);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  scene.environment = studioEnvironment(renderer);
  const key = new DirectionalLight(0xffffff, 1.4); key.position.set(4, 6, 8); scene.add(key);
  const rim = new DirectionalLight(0xffd9a8, 0.8); rim.position.set(-6, 3, -5); scene.add(rim);
  const camera = new PerspectiveCamera(28, 1, 0.1, 200);

  // soft contact shadow
  const sc = document.createElement('canvas'); sc.width = sc.height = 256;
  const sx = sc.getContext('2d'); const rg = sx.createRadialGradient(128, 128, 0, 128, 128, 128);
  rg.addColorStop(0, 'rgba(0,0,0,.55)'); rg.addColorStop(1, 'rgba(0,0,0,0)'); sx.fillStyle = rg; sx.fillRect(0, 0, 256, 256);
  const shadow = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ map: new CanvasTexture(sc), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; scene.add(shadow);

  const pivot = new Group(); scene.add(pivot);
  let current = null, state = { product: 'keychain', colour: 0, text: ui.text || 'Your Business' };
  let burnStart = -1, appear = 1, appearStart = 0;

  function build() {
    if (current) { pivot.remove(current.group); current.group.traverse(o => { o.geometry && o.geometry.dispose(); }); }
    const P = PRODUCTS[state.product], C = P.colours[state.colour] || P.colours[0];
    const model = P.build({ body: C.body ? C.body() : null, engrave: new Color(C.engrave) });
    model.group.rotation.set(model.base.x, model.base.y, model.base.z);
    // centre & frame
    const box = new Box3().setFromObject(model.group); const ctr = box.getCenter(new Vector3()); const size = box.getSize(new Vector3());
    model.group.position.sub(ctr);
    pivot.add(model.group);
    const fitH = size.y / 2 / Math.tan((camera.fov * Math.PI / 180) / 2);
    const fitW = size.x / 2 / Math.tan((camera.fov * Math.PI / 180) / 2) / camera.aspect;
    const dist = Math.max(fitH, fitW, size.z * 2) * (model.fit || 1.3) + size.z / 2;
    camera.position.set(0, dist * Math.sin(model.pitch), dist * Math.cos(model.pitch)); camera.lookAt(0, 0, 0);
    shadow.position.y = -size.y / 2 - 0.35; shadow.scale.set(size.x * 1.6 + 1, Math.max(size.z, 1.2) * 2.4, 1);
    current = model; model.size = size;
    model.eng.draw(state.text, 0); burnStart = performance.now(); appearStart = performance.now();
    ui.onChange && ui.onChange(state, P, C);
  }

  // drag to rotate
  let dragging = false, lx = 0, ly = 0, yaw = 0, pitch = 0, idle = 0;
  canvas.addEventListener('pointerdown', e => { dragging = true; lx = e.clientX; ly = e.clientY; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => { if (!dragging) return; yaw += (e.clientX - lx) * 0.012; pitch = Math.max(-0.6, Math.min(0.6, pitch + (e.clientY - ly) * 0.008)); lx = e.clientX; ly = e.clientY; idle = performance.now(); });
  const up = () => { dragging = false; idle = performance.now(); };
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);

  function resize() {
    const r = root.getBoundingClientRect(); const w = Math.max(1, r.width), h = Math.max(1, r.height);
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    if (current) build();
  }
  new ResizeObserver(() => { const r = root.getBoundingClientRect(); if (Math.abs(r.width - (renderer.domElement.width / renderer.getPixelRatio())) > 2 || Math.abs(r.height - (renderer.domElement.height / renderer.getPixelRatio())) > 2) resize(); }).observe(root);

  let visible = true;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) loop(); }).observe(root);
  let raf = 0;
  function loop() {
    cancelAnimationFrame(raf);
    const tick = (now) => {
      if (!visible) return;
      const t = now / 1000;
      if (!dragging && now - idle > 1500) { yaw *= 0.95; pitch *= 0.95; }
      pivot.rotation.y = yaw + Math.sin(t * 0.55) * 0.38;
      pivot.rotation.x = pitch + Math.sin(t * 0.4) * 0.04;
      // appear
      const a = Math.min(1, (now - appearStart) / 600); const ease = 1 - Math.pow(1 - a, 3);
      pivot.scale.setScalar(0.86 + 0.14 * ease);
      // laser burn
      if (burnStart > 0 && current) {
        const p = Math.min(1, (now - burnStart) / 1100);
        current.eng.draw(undefined, p);
        current.eng.mat.emissiveIntensity = p < 1 ? 2.2 : 0;
        if (p >= 1) burnStart = -1;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  const api = {
    setText(t) { state.text = (t || '').trim() || 'Your Business'; if (current) { current.eng.draw(state.text, 0); burnStart = performance.now(); } },
    setProduct(p) { if (PRODUCTS[p]) { state.product = p; state.colour = 0; build(); } },
    setColour(i) { state.colour = i; build(); },
    state,
  };
  resize(); build(); loop();
  root.classList.add('ih3d-ready');
  return api;
}
