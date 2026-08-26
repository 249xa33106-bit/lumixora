
const { chromium } = require('playwright');
const { spawn } = require('child_process');

(async () => {
  console.log('Starting dev server...');
  const server = spawn('npm', ['run', 'dev'], { shell: true });
  
  await new Promise(r => setTimeout(r, 4000));
  
  console.log('Launching browser...');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER_ERROR:', err.message));
  
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(2000);
  console.log('Clicking study arena link...');
  await page.evaluate(() => { window.location.hash = 'study-with-me'; });
  
  await page.waitForTimeout(4000);
  
  await browser.close();
  server.kill();
  console.log('Done.');
})();

