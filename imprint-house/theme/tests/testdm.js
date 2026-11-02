const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const logs = [];
  p.on('pageerror', e => logs.push('PAGEERROR: ' + e.message));
  await p.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await p.goto('http://localhost:8765/designer.html'); await p.waitForTimeout(2500);
  await p.setInputFiles('#ihdFile', 'logos/logo-white.jpg'); await p.fill('#ihdText', 'Apollo Clinic'); await p.waitForTimeout(800);
  await p.click('#ihdSides button:nth-child(2)'); await p.fill('#ihdText', 'Thank you for choosing us'); await p.waitForTimeout(4000);
  await p.locator('#ihdStage').scrollIntoViewIfNeeded(); await p.waitForTimeout(2500); await p.locator('#ihdStage').screenshot({ path: 'm_stage_back.png' });
  await p.screenshot({ path: 'm_designer.png', fullPage: true });
  console.log(logs.join('\n') || 'no errors');
  await b.close();
})();
