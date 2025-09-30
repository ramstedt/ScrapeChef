import { chromium } from 'playwright';

export async function fetchPage(url: string): Promise<string> {
  const userAgent =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';

  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      userAgent,
    });
    const page = await context.newPage();

    console.log(`Navigating to ${url}`);
    await page.goto(url, { waitUntil: 'networkidle' });

    const content = await page.content();
    console.log(`Fetched content length: ${content.length}`);

    return content;
  } finally {
    await browser.close();
  }
}
