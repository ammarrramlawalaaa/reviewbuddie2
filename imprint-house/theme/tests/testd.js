const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
  const p = await ctx.newPage();
  const logs = [];
  p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') logs.push(m.type() + ': ' + m.text()); });
  p.on('pageerror', e => logs.push('PAGEERROR: ' + e.message));
  await p.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await p.goto('http://localhost:8765/designer.html');
  await p.waitForTimeout(2500);
  const stage = p.locator('#ihdStage');
  console.log('stage class:', await stage.getAttribute('class'));
  await p.screenshot({ path: 'd0_initial.png' });
  // upload transparent logo
  await p.setInputFiles('#ihdFile', 'logos/logo-transparent.png');
  await p.waitForTimeout(800);
  await p.fill('#ihdText', 'Sharma Motors');
  await p.waitForTimeout(2200);
  await p.screenshot({ path: 'd1_keychain_front.png' });
  // back side: text only
  await p.click('#ihdSides button:nth-child(2)');
  await p.waitForTimeout(300);
  await p.fill('#ihdText', 'MH 12 AB 3456');
  await p.click('#ihdFonts button[data-f="sans"]');
  await p.waitForTimeout(2600);
  await p.screenshot({ path: 'd2_keychain_back.png' });
  // drag the text in the editor
  const ed = p.locator('#ihdEditor'); const bb = await ed.boundingBox();
  console.log('editor box', JSON.stringify(bb));
  // flip back to front
  await p.click('#ihdFlip'); await p.waitForTimeout(2500);
  // logo size slider
  await p.locator('#ihdLogoSize').fill('40'); await p.waitForTimeout(600);
  // drag logo upward
  const art = await p.evaluate(() => 1);
  await p.mouse.move(bb.x + bb.width * 0.5, bb.y + bb.height * 0.36); await p.mouse.down();
  await p.mouse.move(bb.x + bb.width * 0.5, bb.y + bb.height * 0.25, { steps: 6 }); await p.mouse.up();
  await p.waitForTimeout(1500);
  await p.screenshot({ path: 'd3_keychain_front_edit.png' });
  // pen with white-bg jpg logo
  await p.click('#ihdProducts button[data-p="pen"]');
  await p.setInputFiles('#ihdFile', 'logos/logo-white.jpg');
  await p.waitForTimeout(2600);
  await p.screenshot({ path: 'd4_pen.png' });
  await p.click('#ihdColours button:nth-child(2)'); await p.waitForTimeout(2200);
  await p.screenshot({ path: 'd5_pen_silver.png' });
  await p.click('#ihdProducts button[data-p="mug"]'); await p.setInputFiles('#ihdFile', 'logos/logo.svg'); await p.waitForTimeout(2600);
  await p.screenshot({ path: 'd6_mug.png' });
  await p.click('#ihdProducts button[data-p="flask"]'); await p.waitForTimeout(2400);
  await p.screenshot({ path: 'd7_flask.png' });
  await p.click('#ihdProducts button[data-p="roller"]'); await p.click('#ihdFonts button[data-f="script"]'); await p.waitForTimeout(2400);
  await p.screenshot({ path: 'd8_roller.png' });
  // download on keychain (2 sides)
  await p.click('#ihdProducts button[data-p="keychain"]'); await p.waitForTimeout(1800);
  const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 10000 }), p.click('#ihdDownload')]);
  await dl.saveAs('d9_download.png');
  console.log('download:', dl.suggestedFilename());
  console.log('whatsapp:', decodeURIComponent((await p.getAttribute('#ihdWhatsApp', 'href')).split('text=')[1]));
  console.log('price:', await p.locator('#ihdPrice').innerText());
  console.log(logs.filter(l => !/ERR_FAILED/.test(l)).slice(0, 20).join('\n') || 'no errors');
  await b.close();
})();
