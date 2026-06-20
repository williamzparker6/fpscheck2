// Dev-only screenshot helper. Not part of the app itself.
// Usage: node tools/screenshot.js <url> <outPath> [width] [height] [scheme] [clickSelector] [typeText]
//   scheme: "dark" | "light"  (emulates prefers-color-scheme)
//   clickSelector: optional CSS selector to click before the shot (e.g. open a dropdown)
//   typeText: optional text to type after clicking (e.g. into a search box)
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium").default;

(async () => {
  const [, , url, out = "shot.png", width = "1280", height = "900", scheme = "dark", clickSel, typeText] =
    process.argv;

  const browser = await puppeteer.launch({
    args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
    executablePath: await chromium.executablePath(),
    headless: "shell",
    defaultViewport: { width: +width, height: +height, deviceScaleFactor: 2 },
  });
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: scheme }]);
  await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 700)); // settle entry animations

  if (clickSel) {
    await page.click(clickSel);
    await new Promise((r) => setTimeout(r, 250));
    if (typeText) {
      await page.keyboard.type(typeText, { delay: 20 });
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  await new Promise((r) => setTimeout(r, 300));
  await page.screenshot({ path: out });
  await browser.close();
  console.log("saved", out);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
