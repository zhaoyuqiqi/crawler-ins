import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

chromium.use(StealthPlugin());


async function setup() {
  const browser = await chromium.launch({
    headless: true, // 调试时设为false
    slowMo: 100 // 降低速度避免检测
  });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
    // viewport: { width: 1920, height: 1080 }
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();
  // await stealthMode(page);
  await page.goto('https://arh.antoinevastel.com/bots/areyouheadless', {
    timeout: 30000
  });
  const answer = await page.locator('#res').textContent();
  console.log(answer);
}
setup();
