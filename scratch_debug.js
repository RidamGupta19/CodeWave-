const { chromium } = require('playwright');

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => {
    console.log(`BROWSER CONSOLE [${msg.type()}]: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.log(`BROWSER PAGEERROR: ${err.message}`);
    console.log(err.stack);
  });

  console.log('Navigating to http://localhost:5173/...');
  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    console.log('Navigation completed.');
    
    const rootHTML = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root ? root.innerHTML : 'No root element found';
    });
    console.log('Root HTML content:', rootHTML);

    const bodyHTML = await page.evaluate(() => document.body.innerHTML);
    console.log('Body HTML length:', bodyHTML.length);
  } catch (err) {
    console.error('Error during page navigation:', err);
  }

  await browser.close();
  console.log('Done.');
})();
