const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1300, height: 900 } });
  p.on('pageerror', e => console.log('PAGEERROR', e.message));
  await p.goto('http://localhost:8765/harness.html?styles=' + (process.argv[2] || 'auto'));
  await p.waitForFunction(() => window.done, null, { timeout: 120000 });
  console.log(await p.locator('#out').innerText());
  await p.screenshot({ path: process.argv[3] || 'harness.png', fullPage: true });
  await b.close();
})();
