import { retry } from 'retry-anything';
import { Browser, BrowserContext, type Page } from 'playwright';
/**
 * 查看这个帖子
 * https://www.bright.cn/blog/how-tos/avoid-bot-detection-with-playwright-stealth
 */
import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fakeUa from 'fake-useragent';

chromium.use(StealthPlugin());

export class ScrapeIns {
  private browser!: Browser;
  private context!: BrowserContext;
  async init() {
    this.browser = await chromium.launch({
      headless: process.env.NODE_ENV === 'prod', // 调试时设为true
      slowMo: 100, // 降低速度避免检测
    });
    this.context = await this.browser.newContext({
      userAgent: fakeUa(),
      viewport: { width: 1920, height: 1080 },
      //   viewport: { width: 1440, height: 900 },
    });
  }
  async getUrlResponse(url: string) {
    const page = await this.context.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForSelector('.items', { timeout: 30000 });
      const content = await page.content();
      return content;
    } catch {
      return null;
    } finally {
      page.close();
      console.log('执行完毕，退出');
    }
  }

  /**
   * 销毁浏览器实例
   */
  async dispose() {
    await this.context.close();
    await this.browser.close();
  }
}
